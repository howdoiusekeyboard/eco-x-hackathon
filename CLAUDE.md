# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ECOX Labs** is an agricultural waste supply chain platform developed for the BTF 2025 Hackathon at BITS Pilani. The project addresses the critical problem of crop burning (1.6M annual deaths, 20% of carbon emissions) by creating a digital marketplace connecting farmers with industries that need agricultural waste.

**Core Problem**: Farmers burn agricultural waste due to lack of economically viable disposal options.

**Solution**: Autonomous AI-powered platform that matches waste supply with industrial demand, optimizes collection logistics, and provides real-time quality monitoring.

**Target Market**: UAE agriculture sector (aligned with Dubai 2033 sustainability goals), with secondary focus on India (Ludhiana region).

**Development Timeline**: 48-hour hackathon format - prioritize MVP features and demonstrable functionality over production polish.

## Technology Stack

### Frontend
- **Farmer Mobile App**: Flutter with Material 3 design system (or Kotlin with Jetpack Compose)
- **Industry Dashboard**: Next.js or React
- **State Management**: MVVM pattern
- **Dependency Injection**: Hilt (for Android/Kotlin)

### Backend
- **Server**: Node.js + Express + TypeScript
- **Database**: Supabase (PostgreSQL with real-time capabilities)
- **Authentication**: Supabase Auth
- **File Storage**: Firebase Storage

### AI/ML Layer
- **Agentic AI**: OpenAI API for autonomous decision-making (matching, routing, quality control)
- **Computer Vision**: Google ML Kit for camera-based waste detection and categorization
- **AI Framework**: Firebase Genkit for agentic backend patterns

### Additional Services
- **Maps**: Google Maps API for logistics visualization
- **Blockchain**: Ethereum testnet for transaction tracking and transparency
- **IoT**: Simulated sensor data (temperature, moisture, weight) for quality monitoring

## System Architecture

### Three-Tier Design

```
┌─────────────────────────────────┐
│   Farmer Mobile App (Flutter)   │
│   - Camera + GPS waste logging  │
│   - Image classification (ML)   │
│   - Pickup request submission   │
│   - Real-time notifications     │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   Agentic AI Engine (Node.js)   │
│   - Autonomous waste matching   │
│   - Route optimization          │
│   - Quality control decisions   │
│   - Dynamic pricing             │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   Supabase Database (Postgres)  │
│   - Real-time sync across apps  │
│   - Row-level security (RLS)    │
│   - Relationship management     │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Industry Dashboard (Next.js)   │
│  - Waste inventory browsing     │
│  - IoT sensor monitoring        │
│  - Blockchain audit trail       │
│  - Demand pattern analytics     │
└─────────────────────────────────┘
```

### Component Interactions

1. **Farmer → Backend**: Submit waste batch with photo, GPS coordinates, estimated quantity
2. **Backend → AI Agent**: Process new waste entry, run autonomous matching algorithm
3. **AI Agent → Database**: Store matching decisions, update availability status
4. **Database → Dashboard**: Real-time sync of waste inventory to industry buyers
5. **IoT Layer → Dashboard**: Stream simulated sensor readings (temperature, moisture)
6. **Blockchain Layer**: Record confirmed transactions for transparency

## Database Schema

### Core Tables

**farmers**
- `id` (UUID, primary key)
- `name`, `phone`, `location` (geography point)
- `farm_size_acres`, `primary_crops`
- `created_at`, `updated_at`

**waste_batches**
- `id` (UUID, primary key)
- `farmer_id` (foreign key → farmers)
- `waste_type` (rice straw, wheat stubble, sugarcane bagasse, etc.)
- `estimated_quantity_kg`
- `location` (geography point)
- `image_url` (Firebase Storage path)
- `quality_score` (AI-generated, 0-100)
- `status` (available, matched, collected, delivered)
- `created_at`, `matched_at`, `collected_at`

**industries**
- `id` (UUID, primary key)
- `company_name`, `industry_type` (biogas, animal feed, biofuel, etc.)
- `demand_categories` (array of waste types)
- `location` (geography point)
- `capacity_kg_per_month`
- `created_at`

**ai_matches**
- `id` (UUID, primary key)
- `waste_batch_id` (foreign key → waste_batches)
- `industry_id` (foreign key → industries)
- `confidence_score` (AI decision confidence, 0-1)
- `reasoning` (text explanation from AI agent)
- `route_distance_km`, `estimated_cost`
- `status` (proposed, accepted, rejected, completed)
- `created_at`, `accepted_at`

**iot_readings**
- `id` (UUID, primary key)
- `waste_batch_id` (foreign key → waste_batches)
- `temperature_celsius`, `moisture_percent`, `weight_kg`
- `sensor_location` (storage facility, transport vehicle, etc.)
- `timestamp`

### Key Relationships

- One farmer → Many waste batches
- One waste batch → Many AI matches (multiple potential buyers)
- One industry → Many AI matches (multiple supply sources)
- One waste batch → Many IoT readings (time series data)

## Development Guidelines

### Hackathon-Specific Practices

**48-Hour MVP Strategy**:
1. **Hour 0-8**: Setup + Database schema + API skeleton
2. **Hour 8-16**: Farmer app core flow (camera → upload → confirmation)
3. **Hour 16-24**: Agentic AI matching engine
4. **Hour 24-32**: Industry dashboard + IoT simulation
5. **Hour 32-40**: Integration testing + blockchain demo
6. **Hour 40-48**: Polish UI + prepare pitch deck + video demo

**Prioritization**:
- ✅ **Must Have**: Camera logging, AI matching, basic dashboard
- 🔄 **Should Have**: IoT simulation, route optimization
- 💡 **Nice to Have**: Blockchain tracking, AR waste visualization, real-time chat

### Agentic AI Patterns

**Autonomous Matching Algorithm**:
```javascript
// AI agent should autonomously:
// 1. Analyze new waste batch (type, quantity, location, quality)
// 2. Query industries with matching demand profiles
// 3. Calculate route distance and logistics cost
// 4. Generate confidence scores for each potential match
// 5. Auto-notify top 3 matches (no human intervention)
// 6. Learn from acceptance/rejection patterns over time

const matchingPrompt = `
You are an autonomous supply chain agent. A farmer has logged ${wasteType}
waste (${quantity}kg) at location ${farmerGPS}.

Available buyers:
${industriesWithDemand}

Your task:
1. Rank buyers by suitability (demand fit, distance, capacity)
2. Calculate route optimization and cost estimates
3. Provide matching confidence scores (0-1)
4. Explain your reasoning for top 3 matches

Return JSON with ranked matches.
`;
```

**Key AI Capabilities**:
- Image classification (identify waste type from farmer photos)
- Quality scoring (assess waste freshness, moisture, contamination)
- Route optimization (minimize collection costs across multiple pickups)
- Dynamic pricing (suggest fair prices based on market conditions)

### Mobile-First Design Principles

**Farmer App UX**:
1. **One-tap waste logging**: Camera → Auto-detect waste type → Confirm quantity → Submit
2. **Offline-first**: Queue uploads when no network, sync when connected
3. **Vernacular support**: Hindi, Punjabi, Tamil for farmer accessibility
4. **Visual feedback**: Show real-time matching status with progress indicators

**Dashboard UX**:
1. **Map-centric view**: Visualize waste sources geographically
2. **Filter by waste type**: Quick access to relevant supply
3. **IoT health indicators**: Color-coded quality alerts (green/yellow/red)
4. **One-click procurement**: Accept match → Auto-generate collection order

### API Contracts

**Farmer App → Backend**

`POST /api/waste/submit`
```json
{
  "farmer_id": "uuid",
  "image": "base64_or_upload_url",
  "gps_coordinates": {"lat": 28.7041, "lng": 77.1025},
  "estimated_quantity_kg": 500,
  "waste_type_hint": "rice_straw" // optional, AI will verify
}
```

Response:
```json
{
  "batch_id": "uuid",
  "status": "processing",
  "estimated_matching_time_minutes": 5
}
```

**Backend → Dashboard**

`GET /api/matches/pending?industry_id=uuid`
```json
{
  "matches": [
    {
      "match_id": "uuid",
      "waste_batch": {...},
      "confidence_score": 0.92,
      "reasoning": "High demand fit, optimal distance (12km), fresh quality",
      "route_details": {...},
      "estimated_cost_usd": 45
    }
  ]
}
```

**IoT Simulation → Dashboard** (WebSocket)

`ws://backend/iot/stream?batch_id=uuid`
```json
{
  "timestamp": "2025-11-15T10:30:00Z",
  "temperature_celsius": 28,
  "moisture_percent": 12,
  "weight_kg": 485,
  "status": "healthy"
}
```

### Environment Setup

**Required Tools**:
- Flutter SDK (3.x) or Android Studio (for Kotlin)
- Node.js (18.x or later)
- Supabase CLI
- Firebase CLI (for Storage + Genkit)
- OpenAI API key
- Google Maps API key
- Git

**Environment Variables** (`.env`):
```
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://...supabase.co
SUPABASE_ANON_KEY=eyJ...
FIREBASE_STORAGE_BUCKET=ecox-labs.appspot.com
GOOGLE_MAPS_API_KEY=AIza...
ETHEREUM_TESTNET_RPC=https://sepolia.infura.io/v3/...
```

**Quick Start** (to be added when code exists):
```bash
# Backend setup
cd backend
npm install
npm run dev

# Frontend setup (Flutter)
cd farmer-app
flutter pub get
flutter run

# Dashboard setup
cd dashboard
npm install
npm run dev
```

## Core Features Implementation Guide

### 1. Camera + GPS Waste Logging

**Flutter Implementation**:
- Use `camera` package for image capture
- Use `geolocator` package for GPS coordinates
- Use `image_picker` for gallery selection fallback
- Compress images before upload (max 1MB)

**ML Integration**:
- Send image to Google ML Kit for initial waste type detection
- Cross-verify with OpenAI Vision API for accuracy
- Store both predictions for confidence scoring

### 2. Autonomous AI Matching Engine

**Node.js Backend Pattern**:
```javascript
// Use Firebase Genkit for agentic workflows
import { genkit } from 'firebase-genkit';
import { openai } from 'firebase-genkit/openai';

const matchingAgent = genkit.defineAgent({
  name: 'wasteMatchingAgent',
  model: openai('gpt-4'),
  tools: [calculateDistance, fetchIndustryDemand, estimateCost],
  systemPrompt: 'You are an autonomous supply chain optimizer...'
});

// Agent runs autonomously on new waste batch
await matchingAgent.run({
  wasteBatch: newBatch,
  availableIndustries: industries
});
```

**Autonomous Decision Loop**:
1. New waste batch triggers webhook
2. AI agent analyzes batch characteristics
3. Agent queries database for matching industries
4. Agent calculates logistics (distance, cost, time)
5. Agent ranks matches by suitability score
6. Agent auto-notifies top matches (no human approval)
7. Agent learns from acceptance patterns (reinforcement)

### 3. IoT Simulation Layer

**Mock Sensor Data Generation**:
```javascript
// Simulate realistic sensor readings
function generateIoTReading(wasteBatch) {
  const baseTemp = 25;
  const baseMoisture = 15;

  // Simulate degradation over time
  const hoursSinceLogging = (Date.now() - wasteBatch.created_at) / (1000 * 60 * 60);
  const tempIncrease = hoursSinceLogging * 0.5; // Gradual heating
  const moistureLoss = hoursSinceLogging * 0.3; // Gradual drying

  return {
    temperature_celsius: baseTemp + tempIncrease + randomNoise(2),
    moisture_percent: Math.max(0, baseMoisture - moistureLoss + randomNoise(1)),
    weight_kg: wasteBatch.estimated_quantity_kg - (hoursSinceLogging * 0.1) // Minor loss
  };
}

// Stream readings every 30 seconds via WebSocket
setInterval(() => {
  const reading = generateIoTReading(batch);
  io.to(`batch_${batch.id}`).emit('iot_update', reading);
}, 30000);
```

### 4. Blockchain Transaction Tracking

**Ethereum Testnet Integration**:
```javascript
// Simple smart contract for transparency
contract WasteTransaction {
  struct Trade {
    address farmer;
    address industry;
    string wasteType;
    uint256 quantityKg;
    uint256 priceUSD;
    uint256 timestamp;
  }

  mapping(bytes32 => Trade) public transactions;

  function recordTrade(
    bytes32 tradeId,
    address industry,
    string memory wasteType,
    uint256 quantityKg,
    uint256 priceUSD
  ) public {
    transactions[tradeId] = Trade({
      farmer: msg.sender,
      industry: industry,
      wasteType: wasteType,
      quantityKg: quantityKg,
      priceUSD: priceUSD,
      timestamp: block.timestamp
    });
  }
}
```

**Purpose**: Provide immutable audit trail for judges and investors (not critical for MVP).

## Testing Strategy

### Hackathon Testing Approach

**Skip Unit Tests** (time constraint) - Focus on:
1. **Integration testing**: Test complete user flows end-to-end
2. **Demo scenarios**: Pre-populate database with realistic data
3. **Error handling**: Graceful fallbacks for API failures

**Demo Data Setup**:
```sql
-- Insert demo farmers in Ludhiana region
INSERT INTO farmers (name, location, primary_crops) VALUES
  ('Ranjit Singh', ST_Point(75.8573, 30.9010), ARRAY['rice', 'wheat']),
  ('Harpreet Kaur', ST_Point(75.8895, 30.8712), ARRAY['sugarcane']);

-- Insert demo industries
INSERT INTO industries (company_name, industry_type, demand_categories) VALUES
  ('Punjab Biogas Ltd', 'biogas', ARRAY['rice_straw', 'wheat_stubble']),
  ('GreenFeed Industries', 'animal_feed', ARRAY['sugarcane_bagasse']);
```

## Deployment Strategy

### Hackathon Demo Deployment

**Mobile App**:
- Build Android APK: `flutter build apk --release`
- Test on physical device (emulator acceptable for demo)
- Have APK ready for judge installation

**Dashboard**:
- Deploy to Vercel: `vercel --prod`
- Use environment variables for API keys
- Ensure public URL is accessible

**Backend**:
- Deploy to Render, Railway, or Heroku free tier
- Configure Supabase connection strings
- Set up CORS for dashboard domain

**Database**:
- Use Supabase cloud (free tier sufficient)
- Enable real-time subscriptions
- Configure RLS policies for security

### Post-Hackathon Production Considerations

**Not Required for 48-Hour Demo**:
- CI/CD pipelines
- Load testing
- Production monitoring (Sentry, DataDog)
- Real IoT hardware integration
- Municipal partnership APIs
- Multi-region deployment

## Project-Specific Context

### Domain Knowledge: Agricultural Waste Types

**Common Waste Categories**:
1. **Rice Straw/Stubble**: Post-harvest residue (high volume, low moisture)
2. **Wheat Stubble**: Similar to rice, often burned in Punjab/Haryana
3. **Sugarcane Bagasse**: Fibrous residue after juice extraction
4. **Cotton Stalks**: Hard, woody stems
5. **Corn Stover**: Leaves, stalks, cobs after harvest

**Industrial Use Cases**:
- **Biogas Plants**: Anaerobic digestion for methane production
- **Animal Feed**: Processed straw as cattle fodder
- **Biofuel**: Ethanol production from cellulosic material
- **Paper/Packaging**: Pulp manufacturing from agricultural fiber
- **Compost**: Organic fertilizer production

### Regulatory Alignment

**Dubai 2033 Goals**:
- Zero waste to landfill by 2030
- 100% sustainable agriculture by 2033
- Smart city integration (IoT + AI)

**India Context**:
- National Clean Air Programme (NCAP)
- Punjab Pollution Control Board regulations
- ICAR (Indian Council of Agricultural Research) guidelines

### Competitive Landscape

**Existing Solutions**:
- **Limitations**: Manual matching, no AI, poor farmer UX, limited transparency
- **ECOX Labs Differentiator**: Fully autonomous AI agent (not just matching algorithm)

### Pitch Positioning

**For Judges**:
1. **Problem Scale**: 1.6M deaths, 20% emissions (urgent global issue)
2. **Tech Innovation**: Agentic AI (autonomous decision-making, not just automation)
3. **Market Alignment**: Dubai 2033 sustainability targets
4. **Feasibility**: Leverages existing infrastructure (Supabase, OpenAI, Firebase)
5. **Impact**: Win-win for farmers (income) and industries (supply chain)

**Judging Criteria Focus**:
- ✅ Innovation (agentic AI + IoT + blockchain integration)
- ✅ Feasibility (48-hour working prototype)
- ✅ Impact (environmental + economic benefits)
- ✅ Scalability (cloud-native architecture)

## Future Enhancements (Post-Hackathon)

**Phase 2 Features**:
- AR waste visualization (point phone at field, see overlay of quantity estimates)
- Real IoT hardware integration (deploy physical sensors in storage facilities)
- Municipal partnership APIs (integrate with government waste management systems)
- Predictive analytics (forecast waste availability by season/region)
- Farmer community features (co-op formation, bulk selling)
- Carbon credit tokenization (reward farmers for not burning)

**Not In Scope for Hackathon**:
- Payment gateway integration (focus on matching, not transactions)
- Multi-language support beyond English (time constraint)
- iOS app (Android only for demo)
- Real blockchain mainnet deployment (testnet sufficient)