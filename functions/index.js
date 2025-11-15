const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {onRequest} = require("firebase-functions/v2/https");
const {defineString} = require("firebase-functions/params");
const admin = require("firebase-admin");
const {GoogleGenerativeAI} = require("@google/generative-ai");

admin.initializeApp();

// Define Gemini API key as a parameter
const geminiApiKey = defineString("GEMINI_API_KEY", {
  default: "AIzaSyAnGIhvRYWN7Yie-krcMZhpT_rekNpLD9M",
});

// Initialize Gemini AI (lazy initialization to avoid config errors)
let genAI = null;

const MODEL_PREFERENCE = [
  "gemini-flash-latest",
  "gemini-2.5-flash",
];

const RETRY_CONFIG = {
  maxAttempts: 3,
  initialDelayMs: 2000,
  multiplier: 2,
  maxDelayMs: 64000,
};

const generationConfig = {
  temperature: 0.3,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

/**
 * Get Gemini AI instance (lazy initialization)
 * @return {GoogleGenerativeAI} Gemini AI instance
 */
function getGenAI() {
  if (!genAI) {
    const key = geminiApiKey.value();
    if (!key) {
      throw new Error("Gemini API key not configured");
    }
    genAI = new GoogleGenerativeAI(key);
  }
  return genAI;
}

/**
 * Determine if Gemini error is quota/rate related
 * @param {any} error error object
 * @return {boolean}
 */
function isQuotaError(error) {
  if (!error) return false;
  const message = error.message || error.toString();
  return typeof message === "string" &&
    (message.includes("429") ||
      message.toLowerCase().includes("quota") ||
      message.toLowerCase().includes("rate"));
}

/**
 * Sleep helper
 * @param {number} ms milliseconds
 * @return {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Structured log helper
 * @param {string} label log label
 * @param {Record<string, any>} payload payload
 */
function logStructured(label, payload) {
  try {
    console.log(`[${label}] ${JSON.stringify(payload)}`);
  } catch (err) {
    console.log(`[${label}]`, payload);
  }
}

/**
 * Generate content with automatic model fallback
 * @param {string} prompt prompt text
 * @return {Promise<{
 *   modelName: string,
 *   aiResponseText: string,
 *   attemptLog: any[],
 * }>}
 */
async function generateContentWithFallback(prompt) {
  let lastError = null;
  const attemptLog = [];
  let quotaOnlyFailures = true;
  const modelsTried = [];

  for (const modelName of MODEL_PREFERENCE) {
    modelsTried.push(modelName);
    let attempt = 0;
    let delay = RETRY_CONFIG.initialDelayMs;
    try {
      while (attempt < RETRY_CONFIG.maxAttempts) {
        attempt++;
        const attemptMeta = {modelName, attempt};
        logStructured("geminiAttempt", {
          modelName,
          attempt,
          maxAttempts: RETRY_CONFIG.maxAttempts,
        });
        const model = getGenAI().getGenerativeModel({
          model: modelName,
          generationConfig,
        });
        try {
          const result = await model.generateContent(prompt);
          const response = await result.response;
          attemptMeta.success = true;
          attemptLog.push(attemptMeta);
          return {
            modelName,
            aiResponseText: response.text(),
            attemptLog,
          };
        } catch (innerError) {
          lastError = innerError;
          const quotaError = isQuotaError(innerError);
          quotaOnlyFailures = quotaOnlyFailures && quotaError;
          attemptMeta.success = false;
          attemptMeta.errorMessage = innerError.message;
          attemptMeta.quotaError = quotaError;
          attemptLog.push(attemptMeta);

          console.error(
              `⚠️ Model ${modelName} attempt ${attempt} ` +
          `(${quotaError ? "quota" : "other"}):`,
              innerError.message,
          );

          if (quotaError && attempt < RETRY_CONFIG.maxAttempts) {
            const sleepMs = Math.min(delay, RETRY_CONFIG.maxDelayMs);
            logStructured("geminiBackoff", {
              modelName,
              attempt,
              sleepMs,
            });
            await sleep(sleepMs);
            delay = delay * RETRY_CONFIG.multiplier;
            continue;
          }

          if (quotaError) {
            break;
          } else {
            quotaOnlyFailures = false;
            break;
          }
        }
      }
    } catch (error) {
      // This catch kept for safety, though inner try handles most cases
      lastError = error;
      quotaOnlyFailures = quotaOnlyFailures && isQuotaError(error);
      attemptLog.push({
        modelName,
        attempt: "wrapped",
        success: false,
        errorMessage: error.message,
        quotaError: isQuotaError(error),
      });
    }
  }

  logStructured("geminiExhausted", {
    modelsTried,
    quotaOnlyFailures,
    attempts: attemptLog,
  });

  const errorMessage = `All Gemini models failed after ${
    attemptLog.length
  } attempts. Last error: ${
    lastError ? lastError.message : "unknown"
  }`;

  const terminalError = new Error(errorMessage);
  terminalError.attemptLog = attemptLog;
  terminalError.modelsTried = modelsTried;
  terminalError.isQuotaExhausted = quotaOnlyFailures;
  throw terminalError;
}

/**
 * Build deterministic fallback decision when Gemini quota exhausted
 * @param {Object} wasteData waste batch data
 * @param {Array<Object>} industries list of industries with distance
 * @return {Object} decision payload
 */
function buildHeuristicDecision(wasteData, industries) {
  if (!industries || industries.length === 0) {
    throw new Error("No industries available for fallback decision");
  }

  const wasteType = (wasteData.wasteType || "").toLowerCase();
  const quantity = wasteData.quantityKg || 0;

  const scored = industries.map((industry) => {
    const preferredTypes = (industry.preferredWasteTypes ||
        industry.demandCategories || []).map((type) => type.toLowerCase());
    const typeMatches = preferredTypes.length === 0 ? 0.6 :
        (preferredTypes.includes(wasteType) ? 1 : 0.3);
    const typeScore = Math.round(typeMatches * 100);

    const distance = industry.distance || 0;
    const proximityScore = Math.max(0, Math.round(100 - distance * 2));

    const demandCapacity = industry.demandKg ||
        industry.capacityKgPerMonth || 50000;
    const demandFit =
      demandCapacity > 0 ?
        Math.min(100, Math.round((quantity / demandCapacity) * 100)) : 70;
    const demandFitScore = Math.max(10, demandFit);

    const moisture = (wasteData.moistureLevel || "").toLowerCase();
    let qualityScore = 80;
    if (moisture.includes("low")) qualityScore = 95;
    else if (moisture.includes("medium")) qualityScore = 85;
    else if (moisture.includes("high")) qualityScore = 65;

    const priceRange = industry.priceRange || {};
    const priceMid = (
      (priceRange.min || 2.5) +
      (priceRange.max || 3.5)
    ) / 2;
    const pricePerKg = Number(priceMid.toFixed(2));
    const priceScore = Math.min(100, Math.round((pricePerKg / 4) * 100));

    const totalScore = Math.round(
        (0.4 * typeScore) +
        (0.3 * proximityScore) +
        (0.2 * demandFitScore) +
        (0.1 * priceScore),
    );

    return {
      industry,
      totalScore,
      factors: {
        proximityScore,
        demandFitScore,
        qualityScore,
        priceScore,
      },
      pricePerKg,
    };
  }).sort((a, b) => b.totalScore - a.totalScore);

  const best = scored[0];
  const industryDistance = Number(best.industry.distance || 0);
  const pm25Prevented =
    (quantity / 1000) * 1.5;
  const logisticsNote = industryDistance <= 20 ?
    "Nearby pickup route available" :
    "Schedule optimized transport route";

  const reasoningParts = [
    "Fallback match selected using deterministic heuristics",
    `considering waste type compatibility, ${Math.round(industryDistance)}km`,
    "distance, and demand capacity in Punjab.",
  ];

  return {
    industryId: best.industry.id,
    industryName: best.industry.name || best.industry.company_name ||
      "Punjab Industry",
    pricePerKg: best.pricePerKg,
    reasoning: reasoningParts.join(" "),
    matchScore: best.totalScore,
    factors: best.factors,
    distanceKm: Number(industryDistance.toFixed(1)),
    logisticsNote,
    environmentalImpact: `Avoids burning ${quantity}kg waste, preventing ` +
      `${pm25Prevented.toFixed(2)}kg PM2.5 in Ludhiana.`,
  };
}

// ============================================
// AUTONOMOUS AI AGENT WITH GEMINI 2.0 FLASH THINKING
// ============================================

exports.autonomousWasteMatching = onDocumentCreated({
  document: "waste_batches/{batchId}",
  timeoutSeconds: 120,
  memory: "512MiB",
}, async (event) => {
  const snap = event.data;
  if (!snap) {
    console.log("No data associated with the event");
    return;
  }
  const wasteData = snap.data();
  const batchId = event.params.batchId;

  console.log(
      "🌾 ECOX AI Agent (Gemini) triggered for batch:",
      batchId,
  );
  const startTime = Date.now();

  try {
    // Fetch Punjab industries
    const industriesSnapshot = await admin.firestore()
        .collection("industries")
        .where("isActive", "==", true)
        .where("location.state", "==", "Punjab")
        .get();

    if (industriesSnapshot.empty) {
      throw new Error("No active Punjab industries found");
    }

    const industries = industriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(
        `📊 Analyzing ${industries.length} Punjab industries`,
    );

    // Calculate distances
    const wasteLocation = wasteData.location ||
          {lat: 30.9010, lng: 75.8573};

    const industriesWithDistance = industries.map((industry) => {
      const distance = calculateDistance(
          wasteLocation.lat,
          wasteLocation.lng,
          industry.location.lat,
          industry.location.lng,
      );
      return {...industry, distance};
    });

    // Construct prompt for Gemini
    const prompt = `You are an autonomous agricultural waste supply \
chain AI agent for Punjab, India.
Your task is to make an INDEPENDENT, OPTIMAL matching decision for \
farmers in Ludhiana region.

WASTE SUBMISSION (Ludhiana, Punjab):
- Type: ${wasteData.wasteType}
- Quantity: ${wasteData.quantityKg} kg
- Location: Ludhiana (${wasteLocation.lat}, ${wasteLocation.lng})
- Quality: ${wasteData.moistureLevel || "Standard"} moisture
- Farmer ID: ${wasteData.farmerId}
- Crop Season: ${wasteData.season || "Rabi/Kharif"}

PUNJAB MARKET CONTEXT:
- Rice straw burning is Punjab's major pollution source \
(contributes to Delhi smog)
- Government ban on crop burning (Section 188 IPC, ₹15,000 fine)
- Punjab produces ~23 million tons of paddy straw annually
- Peak burning season: Oct-Nov (post-paddy harvest)
- Short harvest window (15-20 days) creates urgency

AVAILABLE INDUSTRIES (Punjab):
${JSON.stringify(industriesWithDistance, null, 2)}

DECISION CRITERIA (Punjab-specific weighting):
1. Waste Type Compatibility (40%): Does industry prefer this \
waste type?
2. Proximity (30%): Transport logistics in Punjab \
(<20km excellent, 20-50km good, >50km poor)
3. Demand Capacity (20%): Can industry handle this quantity?
4. Price Optimization (10%): Fair Punjab market rates \
(₹2.5-4.0/kg for rice straw)

AUTONOMOUS DECISION REQUIREMENTS:
Think step-by-step:
1. Filter industries by waste type compatibility
2. Score each on proximity (0-100)
3. Score each on demand capacity fit (0-100)
4. Score each on quality match (0-100)
5. Calculate weighted total score
6. Select highest scoring industry
7. Determine optimal price
8. Explain decision in 2-3 sentences

OUTPUT (return ONLY this JSON, no other text):
{
  "industryId": "string",
  "industryName": "string",
  "pricePerKg": number,
  "reasoning": "string (2-3 sentences with Punjab context)",
  "matchScore": number (0-100),
  "factors": {
    "proximityScore": number,
    "demandFitScore": number,
    "qualityScore": number,
    "priceScore": number
  },
  "distanceKm": number,
  "logisticsNote": "string",
  "environmentalImpact": "string"
}`;

    console.log("🧠 Attempting Gemini models:", MODEL_PREFERENCE.join(" → "));

    let selectedModel = null;
    let aiResponseText = null;
    let decision = null;
    let fallbackUsed = false;
    let fallbackMetadata = null;
    let attemptLogSummary = [];

    try {
      const result = await generateContentWithFallback(prompt);
      selectedModel = result.modelName;
      aiResponseText = result.aiResponseText;
      attemptLogSummary = result.attemptLog || [];
      console.log(`📄 Raw Gemini response (${selectedModel}):`, aiResponseText);

      const cleanedResponse = aiResponseText
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
      decision = JSON.parse(cleanedResponse);
    } catch (error) {
      if (error.isQuotaExhausted) {
        fallbackUsed = true;
        selectedModel = "heuristic-fallback";
        attemptLogSummary = error.attemptLog || [];
        fallbackMetadata = {
          reason: "Gemini quota exhausted - deterministic fallback used",
          errorMessage: error.message,
          attemptedModels: error.modelsTried || [],
          attemptCount: (error.attemptLog || []).length || 0,
          attempts: error.attemptLog || [],
        };
        logStructured("geminiFallbackActivated", fallbackMetadata);
        decision = buildHeuristicDecision(wasteData, industriesWithDistance);
      } else if (aiResponseText) {
        // Parsing failure after response
        console.error("❌ JSON parse failed:", error);
        const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          decision = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not parse AI response");
        }
      } else {
        throw error;
      }
    }

    console.log("✅ Parsed decision:", decision);

    // Calculate values
    const totalValue = decision.pricePerKg * wasteData.quantityKg;
    const decisionTime = (Date.now() - startTime) / 1000;
    const co2Saved = (wasteData.quantityKg / 1000) * 4;
    const pm25Prevented = (wasteData.quantityKg / 1000) * 1.5;

    // Save match to Firestore
    const matchStatus = fallbackUsed ?
      "fallback_pending" :
      "autonomous_pending";
    const matchRef = await admin.firestore().collection("ai_matches").add({
      wasteBatchId: batchId,
      farmerId: wasteData.farmerId,
      farmerName: wasteData.farmerName || "Anonymous Farmer",
      industryId: decision.industryId,
      industryName: decision.industryName,

      pricePerKg: decision.pricePerKg,
      totalValue: totalValue,
      currency: "INR",

      reasoning: decision.reasoning,
      matchScore: decision.matchScore,
      factors: decision.factors,
      logisticsNote: decision.logisticsNote || "Standard logistics",
      environmentalImpact: decision.environmentalImpact ||
            `Prevents ${pm25Prevented.toFixed(2)}kg PM2.5`,

      distanceKm: decision.distanceKm,
      decisionTimeSeconds: decisionTime,
      co2SavedTons: co2Saved,
      pm25PreventedKg: pm25Prevented,

      region: "Punjab",
      district: "Ludhiana",
      state: "Punjab",
      country: "India",

      status: matchStatus,
      agentName: "ECOX Punjab Agent v1.0 (Gemini)",
      aiModel: selectedModel,
      decisionSource: fallbackUsed ? "heuristic" : "gemini",
      fallbackUsed,
      fallbackDetails: fallbackMetadata,
      geminiAttemptLog: attemptLogSummary,

      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: new Date().toISOString(),

      wasteType: wasteData.wasteType,
      wasteQuantityKg: wasteData.quantityKg,
      wasteLocation: wasteData.location,
      wastePhotoUrl: wasteData.photoUrl || null,
      wasteSeason: wasteData.season || "Unknown",
    });

    console.log("💾 Match saved:", matchRef.id);

    // Update waste batch
    const batchUpdate = {
      status: fallbackUsed ? "match_pending" : "matched",
      matchId: matchRef.id,
      matchedIndustry: decision.industryName,
      estimatedValue: totalValue,
      matchedAt: admin.firestore.FieldValue.serverTimestamp(),
      co2SavedTons: co2Saved,
      pm25PreventedKg: pm25Prevented,
      aiModel: selectedModel,
    };

    if (fallbackUsed) {
      batchUpdate.matchWarning = fallbackMetadata.reason;
      batchUpdate.aiQuotaExhausted = true;
    }

    await snap.ref.update(batchUpdate);

    const totalTime = (Date.now() - startTime) / 1000;
    console.log(`🎉 Matching completed in ${totalTime.toFixed(2)}s`);

    return {success: true, matchId: matchRef.id, totalTime};
  } catch (error) {
    console.error("❌ Matching failed:", error);
    await snap.ref.update({
      status: "match_failed",
      error: error.message,
      failedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    throw error;
  }
});

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - First latitude
 * @param {number} lon1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lon2 - Second longitude
 * @return {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
}

// Manual retrigger
exports.retriggerMatch = onCall(async (request) => {
  const {batchId} = request.data;
  if (!batchId) {
    throw new HttpsError(
        "invalid-argument",
        "batchId required",
    );
  }

  const batchDoc = await admin.firestore()
      .collection("waste_batches")
      .doc(batchId)
      .get();
  if (!batchDoc.exists) {
    throw new HttpsError(
        "not-found",
        "Batch not found",
    );
  }

  // Trigger a manual update to retry matching
  await batchDoc.ref.update({
    status: "pending",
    retriggerTimestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {success: true, message: "Retrigger initiated"};
});

// Impact metrics
exports.calculateImpactMetrics = onRequest(async (req, res) => {
  try {
    const matchesSnapshot = await admin.firestore()
        .collection("ai_matches")
        .where("region", "==", "Punjab")
        .get();

    let totalWaste = 0;
    let totalEarnings = 0;
    let totalCO2 = 0;
    let totalPM25 = 0;
    let totalConfidence = 0;
    let totalTime = 0;

    matchesSnapshot.forEach((doc) => {
      const m = doc.data();
      totalWaste += m.wasteQuantityKg || 0;
      totalEarnings += m.totalValue || 0;
      totalCO2 += m.co2SavedTons || 0;
      totalPM25 += m.pm25PreventedKg || 0;
      totalConfidence += m.matchScore || 0;
      totalTime += m.decisionTimeSeconds || 0;
    });

    const count = matchesSnapshot.size;

    res.json({
      region: "Punjab (Ludhiana)",
      totalMatches: count,
      totalWasteDiverted: `${(totalWaste / 1000).toFixed(2)} tons`,
      totalFarmerEarnings: `₹${totalEarnings.toFixed(2)}`,
      totalCO2Saved: `${totalCO2.toFixed(2)} tons`,
      totalPM25Prevented: `${totalPM25.toFixed(2)} kg`,
      avgConfidence: count > 0 ? Math.round(totalConfidence / count) : 0,
      avgDecisionTime: count > 0 ? `${(totalTime / count).toFixed(2)}s` : "0s",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});
