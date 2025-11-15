'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { ArrowLeft, Package, Leaf, DollarSign, MapPin, Zap, CheckCircle2, Clock, Droplet } from 'lucide-react';
import { subscribeToAIMatches, acceptAIMatch, rejectAIMatch, subscribeToMatchedWasteBatches } from '@/lib/firestore';
import { AIMatch, WasteBatch } from '@/lib/types';

export default function IndustryDashboardPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<AIMatch[]>([]);
  const [confirmedBatches, setConfirmedBatches] = useState<WasteBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to real-time AI matches
    const unsubscribe = subscribeToAIMatches((data) => {
      setMatches(data);
      setLoading(false);
    }, 50); // Limit to 50 most recent matches

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToMatchedWasteBatches((data) => {
      setConfirmedBatches(data);
    }, 12);

    return () => unsubscribe();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleAcceptMatch = async (matchId: string) => {
    try {
      setAcceptingId(matchId);
      await acceptAIMatch(matchId);
      // The UI will update automatically via real-time listener
    } catch (error) {
      console.error('Error accepting match:', error);
      alert('Failed to accept match. Please try again.');
    } finally {
      setAcceptingId(null);
    }
  };

  const handleRejectMatch = async (matchId: string) => {
    try {
      setRejectingId(matchId);
      await rejectAIMatch(matchId);
      // The UI will update automatically via real-time listener
    } catch (error) {
      console.error('Error rejecting match:', error);
      alert('Failed to reject match. Please try again.');
    } finally {
      setRejectingId(null);
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const formatDateTime = (timestamp: any) => {
    if (!timestamp) return '—';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  const formatCurrencyINR = (value?: number) => {
    if (value === undefined || value === null) return '₹0';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-700 border-green-500';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-500';
      case 'autonomous_pending':
        return 'bg-blue-100 text-blue-700 border-blue-500';
      case 'completed':
        return 'bg-purple-100 text-purple-700 border-purple-500';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'autonomous_pending':
        return 'AI Suggested';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  // Calculate summary statistics
  const totalMatches = matches.length;
  const avgConfidence =
    matches.length > 0
      ? Math.round(matches.reduce((sum, m) => sum + (m.matchScore || 0), 0) / matches.length)
      : 0;
  const totalWaste = matches.reduce((sum, m) => sum + (m.wasteQuantityKg || 0), 0);
  const totalCO2 = matches.reduce((sum, m) => sum + (m.co2SavedTons || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xl font-mukta text-brown">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden pb-20">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-20 w-[41px] h-[41px] rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm active:scale-95 transition-all"
      >
        <ArrowLeft className="w-5 h-5 text-brown" />
      </button>

      {/* Content */}
      <div className="relative z-10 pt-20 px-6">
        {/* Header */}
        <div className="mb-6 bg-gradient-to-r from-green to-teal rounded-[36px] border-2 border-black shadow-card p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-8 h-8" />
            <h1 className="text-3xl font-mukta font-extrabold">
              🤖 ECOX Punjab Dashboard
            </h1>
          </div>
          <p className="text-sm font-mukta opacity-90">
            Autonomous AI Waste Matching - Ludhiana
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-2xl border-2 border-black shadow-card p-4 text-center">
            <p className="text-3xl font-mukta font-bold text-green">
              {totalMatches}
            </p>
            <p className="text-xs font-mukta text-brown/60 mt-1">Total Matches</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-black shadow-card p-4 text-center">
            <p className="text-3xl font-mukta font-bold text-blue-600">
              {avgConfidence}%
            </p>
            <p className="text-xs font-mukta text-brown/60 mt-1">Avg Confidence</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-black shadow-card p-4 text-center">
            <p className="text-3xl font-mukta font-bold text-yellow-600">
              {(totalWaste / 1000).toFixed(1)}t
            </p>
            <p className="text-xs font-mukta text-brown/60 mt-1">Waste Diverted</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-black shadow-card p-4 text-center">
            <p className="text-3xl font-mukta font-bold text-teal-600">
              {totalCO2.toFixed(1)}t
            </p>
            <p className="text-xs font-mukta text-brown/60 mt-1">CO₂ Saved</p>
          </div>
        </div>

        {/* Confirmed Matches */}
        {confirmedBatches.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-mukta font-bold text-brown">
                Confirmed Supply Hand-offs
              </h2>
              <span className="px-3 py-1 rounded-full bg-white border border-black text-xs font-mukta font-semibold text-brown/70 shadow-card">
                Live feed • {confirmedBatches.length}
              </span>
            </div>

            <div className="space-y-4">
              {confirmedBatches.map((batch) => {
                const locationLabel =
                  batch.location?.district ||
                  batch.district ||
                  batch.location?.city ||
                  batch.region ||
                  'Punjab';
                const moisture = batch.moistureLevel || '—';
                const aiModel = batch.aiModel || 'ECOX Agent';
                const farmerName = batch.farmerName || 'Farmer';

                return (
                  <div
                    key={batch.id}
                    className="bg-white rounded-[32px] border-2 border-black shadow-card overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-green via-emerald-400 to-teal-400 text-white p-5">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <p className="text-xs font-mukta uppercase tracking-[0.2em] opacity-80">
                            AI confirmed industry
                          </p>
                          <p className="text-2xl font-mukta font-extrabold">
                            {batch.matchedIndustry}
                          </p>
                          <p className="text-sm font-mukta flex items-center gap-2 mt-1 text-white/80">
                            <CheckCircle2 className="w-4 h-4" />
                            Confirmed {formatDateTime(batch.matchedAt)}
                          </p>
                        </div>
                        <div className="text-sm font-mukta text-right">
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/40 uppercase tracking-wider text-xs font-bold">
                            <MapPin className="w-4 h-4" />
                            {locationLabel}
                          </span>
                          <p className="mt-2 uppercase tracking-[0.4em] text-white/70 text-[11px]">
                            {batch.status}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col lg:flex-row gap-5">
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="rounded-2xl border-2 border-black bg-cream-light p-3">
                            <p className="text-[11px] font-mukta uppercase text-brown/60">
                              Estimated value
                            </p>
                            <p className="text-xl font-mukta font-bold text-brown flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-green" />
                              {formatCurrencyINR(batch.estimatedValue)}
                            </p>
                          </div>
                          <div className="rounded-2xl border-2 border-black bg-white p-3">
                            <p className="text-[11px] font-mukta uppercase text-brown/60">
                              Quantity
                            </p>
                            <p className="text-xl font-mukta font-bold text-brown">
                              {batch.quantityKg} kg
                            </p>
                          </div>
                          <div className="rounded-2xl border-2 border-black bg-cream-light p-3">
                            <p className="text-[11px] font-mukta uppercase text-brown/60">
                              Matched at
                            </p>
                            <p className="text-base font-mukta font-bold text-brown flex items-center gap-2">
                              <Clock className="w-4 h-4 text-brown/70" />
                              {formatDateTime(batch.matchedAt)}
                            </p>
                          </div>
                          <div className="rounded-2xl border-2 border-black bg-white p-3">
                            <p className="text-[11px] font-mukta uppercase text-brown/60">
                              Season
                            </p>
                            <p className="text-xl font-mukta font-bold text-brown">
                              {batch.season || '—'}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="rounded-2xl border-2 border-green-500 bg-green-50 p-3 flex items-start gap-3">
                            <Leaf className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="text-xs font-mukta uppercase text-green-700">
                                Climate impact
                              </p>
                              <p className="text-lg font-mukta font-bold text-green-800">
                                {(batch.co2SavedTons || 0).toFixed(2)} t CO₂
                              </p>
                              <p className="text-xs font-mukta text-green-700 mt-1">
                                PM2.5 prevented: {(batch.pm25PreventedKg || 0).toFixed(2)} kg
                              </p>
                            </div>
                          </div>
                          <div className="rounded-2xl border-2 border-blue-500 bg-blue-50 p-3 flex items-start gap-3">
                            <Droplet className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="text-xs font-mukta uppercase text-blue-700">
                                Quality signature
                              </p>
                              <p className="text-lg font-mukta font-bold text-blue-900">
                                Moisture: {moisture}
                              </p>
                              <p className="text-xs font-mukta text-blue-700 mt-1">
                                AI model: {aiModel}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 text-xs font-mukta">
                          <span className="px-3 py-1 rounded-full bg-brown/5 border border-brown/20 text-brown font-semibold">
                            {batch.wasteType} • {batch.region || batch.state || 'Punjab'}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 font-semibold">
                            Farmer: {farmerName}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-semibold">
                            AI status: Matched
                          </span>
                        </div>
                      </div>

                      <div className="lg:w-56">
                        <div className="rounded-3xl border-2 border-black overflow-hidden h-full min-h-[180px] bg-cream-light">
                          {batch.photoUrl ? (
                            <img
                              src={batch.photoUrl}
                              alt={batch.wasteType}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 text-brown/60">
                              <Package className="w-10 h-10 mb-2" />
                              <p className="text-sm font-mukta">No photo uploaded</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Matches List */}
        <div className="space-y-4">
          <h2 className="text-xl font-mukta font-bold text-brown mb-4">
            Real-Time AI Matches
          </h2>

          {matches.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-black shadow-card p-8 text-center">
              <Package className="w-16 h-16 text-brown/30 mx-auto mb-4" />
              <p className="text-lg font-mukta text-brown/60">
                No matches yet
              </p>
              <p className="text-sm font-mukta text-brown/40 mt-2">
                AI matches will appear here in real-time
              </p>
            </div>
          ) : (
            matches.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-2xl border-2 border-black shadow-card overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 border-b-2 border-black bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-mukta font-bold text-brown">
                          🏭 {match.industryName}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-mukta font-bold ${getMatchScoreColor(
                            match.matchScore
                          )}`}
                        >
                          {match.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-xs font-mukta text-brown/60">
                        {formatTimestamp(match.timestamp)} • {match.agentName}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mukta font-bold border-2 ${getStatusColor(
                        match.status
                      )}`}
                    >
                      {getStatusText(match.status)}
                    </span>
                  </div>
                </div>

                {/* Waste Details */}
                <div className="p-4 bg-gray-50">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-mukta text-brown/60">Waste Type</p>
                      <p className="font-mukta font-bold text-brown">
                        {match.wasteType}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-mukta text-brown/60">Quantity</p>
                      <p className="font-mukta font-bold text-brown">
                        {match.wasteQuantityKg} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-mukta text-brown/60">Distance</p>
                      <p className="font-mukta font-bold text-brown">
                        {match.distanceKm} km
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="p-4 bg-blue-50 border-t-2 border-l-4 border-blue-400">
                  <p className="text-xs font-mukta font-bold text-blue-900 mb-1">
                    🧠 AI Reasoning:
                  </p>
                  <p className="text-sm font-mukta text-blue-800 italic">
                    "{match.reasoning}"
                  </p>
                </div>

                {/* Match Factors */}
                <div className="p-4 bg-white">
                  <p className="text-xs font-mukta font-bold text-brown/70 mb-2">
                    Match Factors
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green"
                          style={{
                            width: `${match.factors.proximityScore}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs font-mukta text-brown/60 mt-1">
                        Proximity
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: `${match.factors.demandFitScore}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs font-mukta text-brown/60 mt-1">
                        Demand Fit
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500"
                          style={{
                            width: `${match.factors.qualityScore}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs font-mukta text-brown/60 mt-1">
                        Quality
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500"
                          style={{
                            width: `${match.factors.priceScore}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs font-mukta text-brown/60 mt-1">
                        Price
                      </p>
                    </div>
                  </div>
                </div>

                {/* Value & Impact */}
                <div className="p-4 grid grid-cols-2 gap-4 border-t-2 border-black">
                  <div className="bg-green-50 rounded-xl p-3 border-2 border-green-500">
                    <p className="text-xs font-mukta text-green-600">Price</p>
                    <p className="text-2xl font-mukta font-bold text-green-700">
                      ₹{match.pricePerKg}/kg
                    </p>
                    <p className="text-xs font-mukta text-green-600 mt-1">
                      Total: ₹{match.totalValue.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-teal-50 rounded-xl p-3 border-2 border-teal-500">
                    <p className="text-xs font-mukta text-teal-600">CO₂ Saved</p>
                    <p className="text-2xl font-mukta font-bold text-teal-700">
                      {match.co2SavedTons.toFixed(2)} t
                    </p>
                    <p className="text-xs font-mukta text-teal-600 mt-1">
                      PM2.5: {match.pm25PreventedKg.toFixed(2)} kg
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                {match.status === 'autonomous_pending' && (
                  <div className="p-4 bg-gray-50 border-t-2 border-black flex gap-3">
                    <button
                      onClick={() => handleAcceptMatch(match.id)}
                      disabled={acceptingId === match.id}
                      className="flex-1 bg-green text-white py-3 rounded-pill border-2 border-black shadow-card font-mukta font-bold hover:bg-green/90 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {acceptingId === match.id ? (
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                      ) : (
                        'Accept Match'
                      )}
                    </button>
                    <button
                      onClick={() => handleRejectMatch(match.id)}
                      disabled={rejectingId === match.id}
                      className="flex-1 bg-red text-white py-3 rounded-pill border-2 border-black shadow-card font-mukta font-bold hover:bg-red/90 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {rejectingId === match.id ? (
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                      ) : (
                        'Reject'
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';
