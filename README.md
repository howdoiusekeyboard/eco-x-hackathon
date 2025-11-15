# KhetSe - ECOX Labs PWA

A mobile-first Progressive Web App connecting farmers with industries for agricultural waste management in Ludhiana, Punjab. Built for the BTF 2025 Hackathon at BITS Pilani.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router) with Turbopack
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS 3.x
- **Runtime**: Bun 1.3.2
- **i18n**: next-intl (Hindi + English)
- **Forms**: React Hook Form + Zod
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Backend**: Firebase (Firestore, Cloud Functions, Storage)
- **AI Model**: Google Gemini 2.0 Flash Thinking (Experimental)
- **Deployment**: Vercel (Frontend) + Firebase (Backend)

## 📱 PWA Features

- **Installable**: Add to Home Screen on Android/iOS
- **Service Worker**: Minimal SW for installability (caches static assets only)
- **Manifest**: Full PWA manifest with icons
- **Mobile-First**: Optimized for Pixel 7 (412x915 viewport)
- **Camera Integration**: Native camera access for waste photo capture
- **Location Services**: GPS coordinates for waste submissions
- **Offline-Ready**: Service worker enables basic offline functionality

## 🎨 Design System

- **Colors**: Cream (#f2eac5), Gold (#e1cf7a), Yellow (#ffe568), Green (#60d66a)
- **Fonts**: Mukta (Hindi/Devanagari), Inter (English)
- **Components**: Custom Button, Input, Card with shadow effects
- **Responsive**: Mobile-first with smooth transitions

## 📂 Project Structure

```
eco-x-hackathon/
├── app/
│   ├── [locale]/              # i18n routes (hi, en)
│   │   ├── page.tsx           # Language selection
│   │   ├── splash/            # Splash screen
│   │   ├── user-type/         # Farmer/Buyer selection
│   │   ├── login/             # Authentication
│   │   ├── dashboard/         # Farmer dashboard
│   │   ├── pickup/            # Waste pickup form + camera + GPS
│   │   ├── history/           # Waste submission history (NEW)
│   │   ├── date-picker/       # Schedule pickup
│   │   ├── confirmation/      # Success screen
│   │   ├── marketplace/       # Buyer marketplace
│   │   ├── dashboard-industry/# Industry AI dashboard (NEW)
│   │   ├── product/[id]/      # Product details
│   │   └── fiber-products/    # Fiber market
│   ├── globals.css
│   ├── layout.tsx
│   └── register-sw.tsx        # Service worker registration
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   └── layout/
│       └── Sidebar.tsx        # Navigation menu
├── lib/
│   ├── firebase.ts            # Firebase config (NEW)
│   └── utils.ts               # Utility functions
├── functions/                 # Firebase Cloud Functions (NEW)
│   ├── index.js              # AI matching agent (Gemini)
│   └── package.json          # Function dependencies
├── messages/                  # i18n translations
│   ├── hi.json
│   └── en.json
├── public/
│   ├── sw.js                 # Service worker
│   ├── manifest.json         # PWA manifest
│   └── icons/                # App icons (SVG placeholders)
├── firebase.json             # Firebase config (NEW)
├── firestore.rules           # Firestore security rules (NEW)
├── firestore.indexes.json    # Firestore indexes (NEW)
├── storage.rules             # Storage security rules (NEW)
├── i18n.ts
├── middleware.ts             # next-intl middleware
└── next.config.ts
```

## 🛠️ Setup Instructions

### Prerequisites

- Bun 1.3+ installed (https://bun.sh)
- Node.js 18+ (for compatibility)
- Git
- Firebase CLI installed: `npm install -g firebase-tools`
- Google Gemini API key (https://aistudio.google.com/app/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/howdoiusekeyboard/eco-x-hackathon
cd eco-x-hackathon

# Install dependencies
bun install

# Install Firebase Functions dependencies
cd functions
npm install @google/generative-ai firebase-admin
cd ..

# Run development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

### Firebase Setup

```bash
# 1. Login to Firebase
firebase login

# 2. Initialize Firebase (if not already done)
firebase init
# Select: Firestore, Functions, Hosting, Storage

# 3. Set Gemini API key
firebase functions:config:set gemini.key="YOUR_GEMINI_API_KEY"

# 4. Deploy Firebase backend
firebase deploy --only functions,firestore,storage
```

### Environment Variables

Create `.env.local`:

```bash
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Also set in Vercel Dashboard:
- Project Settings → Environment Variables → Add all `NEXT_PUBLIC_*` variables

### Development

Open http://localhost:3000 in your browser. The app will start on the language selection screen.

**Important**: For PWA features to work, you need HTTPS:
- Use `localhost` for local testing (PWA works on localhost)
- For production, deploy to Vercel (https://eco-x-hackathon.vercel.app)

## 🌍 User Flows

### Farmer Flow (Ludhiana, Punjab)

1. Select language (Hindi/English)
2. View splash screen
3. Select "Pickup Waste"
4. Login with phone/email
5. Access dashboard
6. Navigate to "Log Waste"
7. **Capture waste photo** (camera or upload)
8. **Enable GPS location** (auto-capture coordinates)
9. Fill waste pickup form (6 fields):
   - Waste type (Rice Straw, Wheat Residue, etc.)
   - Quantity (kg)
   - Moisture level
   - Crop season (Rabi/Kharif/Zaid)
   - Photo (captured)
   - Location (GPS)
10. Submit waste
11. **AI agent autonomously matches** to Punjab industry (3 seconds)
12. Receive confirmation with:
    - Matched industry name
    - Estimated price (₹/kg)
    - Total value (₹)
    - CO2 saved (tons)
    - PM2.5 prevented (kg)
13. View **history** of past submissions

### Buyer/Industry Flow (Punjab)

1. Select language
2. View splash screen
3. Select "I am a Buyer"
4. Login
5. Access **Industry Dashboard**
6. View **real-time AI matches**:
   - Waste type, quantity, location
   - AI reasoning for match
   - Match confidence score (0-100)
   - Pricing details (₹/kg)
   - Distance (km)
   - Environmental impact
7. **Accept or reject** matches
8. View **impact metrics**:
   - Total waste diverted (tons)
   - Total farmer earnings (₹)
   - Total CO2 saved (tons)
   - Total PM2.5 prevented (kg)

## 🤖 Autonomous AI Agent

### Technology: Google Gemini 2.0 Flash Thinking

The core innovation of ECOX Labs is the **autonomous AI agent** powered by Google's Gemini 2.0 Flash Thinking experimental model.

### How It Works

1. **Trigger**: When farmer submits waste, Firestore `onCreate` trigger fires Cloud Function
2. **Data Fetch**: Agent fetches all active Punjab industries from Firestore
3. **Distance Calculation**: Haversine formula calculates distance from farmer to each industry
4. **AI Decision**: Gemini 2.0 Flash Thinking analyzes:
   - Waste type compatibility (40% weight)
   - Proximity for logistics (30% weight)
   - Demand capacity fit (20% weight)
   - Price optimization (10% weight)
5. **Autonomous Match**: AI selects optimal industry without human approval
6. **Reasoning**: AI explains decision in 2-3 sentences (farmer-friendly)
7. **Storage**: Match saved to Firestore `ai_matches` collection
8. **Real-Time Update**: Industry dashboard receives match instantly via Firestore listener
9. **Impact Calculation**: CO2 saved (1 ton waste = 4 tons CO2) and PM2.5 prevented

### AI Model Configuration

```javascript
model: "gemini-2.0-flash-thinking-exp-01-21"
temperature: 0.3  // Deterministic decisions
maxOutputTokens: 8192
responseMimeType: "application/json"
```

### Punjab-Specific Context

The AI agent considers:
- Punjab's 23 million tons annual paddy straw production
- Government ban on burning (Section 188 IPC, ₹15,000 fine)
- Short harvest window (15-20 days) creating urgency
- Crop types: Rice straw, wheat residue, mustard stalks, cotton stalks
- Regional pricing: ₹2.5-4.0/kg (varies by waste type and quality)
- Air quality impact on Delhi NCR
- Seasonal logistics (Rabi/Kharif/Zaid cycles)

## 🔧 Configuration

### PWA Customization

- **Icons**: Replace SVG placeholders in `/public/icons/` with PNG icons from Figma
- **Service Worker**: Edit `/public/sw.js` to customize caching strategy
- **Manifest**: Update `/public/manifest.json` for app metadata

### Adding Languages

1. Add locale to `i18n.ts`:
```typescript
export const locales = ["hi", "en", "pa", "ta"] as const;
```

2. Create translation file in `messages/pa.json`
3. Add fonts in `app/layout.tsx` if needed (e.g., Gurmukhi for Punjabi)

### Firebase Security Rules

**Firestore Rules** (`firestore.rules`):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read for authenticated users
    match /waste_batches/{batch} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == resource.data.farmerId;
    }

    match /ai_matches/{match} {
      allow read: if request.auth != null;
      allow write: if false; // Only Cloud Functions can write
    }

    match /industries/{industry} {
      allow read: if true; // Public read
      allow write: if false; // Admin only
    }
  }
}
```

**Storage Rules** (`storage.rules`):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /waste_images/{imageId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
                && request.resource.size < 5 * 1024 * 1024  // Max 5MB
                && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 📱 PWA Testing

### Install on Android

1. Open app in Chrome: https://eco-x-hackathon.vercel.app
2. Tap menu → "Add to Home Screen"
3. App installs as standalone
4. Grant camera and location permissions

### Install on iOS

1. Open app in Safari
2. Tap Share button
3. Tap "Add to Home Screen"

### Test Camera & Location

1. Navigate to "Log Waste" screen
2. Tap "Open Camera" → Grant permission
3. Capture waste photo
4. Tap "Get Current Location" → Grant permission
5. Verify coordinates displayed

## 🎯 Features Implemented

### Core Features (Original)
✅ All 13 screens from Figma design  
✅ Hindi + English bilingual support  
✅ Form validation (React Hook Form + Zod)  
✅ PWA installability (Service Worker + Manifest)  
✅ Mobile-first responsive design  
✅ Navigation sidebar with language switcher  
✅ WhatsApp contact integration  
✅ Date picker component  
✅ Clean, shadow-based UI matching Figma  

### New Features (Backend + AI)
✅ **Camera Integration**: Native camera access with CameraX API  
✅ **Location Services**: GPS coordinate capture via Geolocation API  
✅ **History Screen**: View past waste submissions with match status  
✅ **Firebase Backend**: Firestore database + Cloud Functions + Storage  
✅ **Autonomous AI Agent**: Gemini 2.0 Flash Thinking for matching  
✅ **Industry Dashboard**: Real-time AI matches display  
✅ **Impact Metrics**: CO2 saved, farmer earnings, PM2.5 prevented  
✅ **Real-Time Updates**: Firestore listeners for live data sync  
✅ **Image Upload**: Firebase Storage for waste photos  

## 🚧 Firestore Collections Schema

### `industries` Collection
```typescript
{
  id: string;                    // Document ID
  name: string;                  // "Punjab BioEnergy Ltd"
  type: string;                  // "biogas" | "animal_feed" | "paper_production" | "composting" | "biofuel"
  location: {
    lat: number;                 // 30.9010
    lng: number;                 // 75.8573
    city: string;                // "Ludhiana"
    state: string;               // "Punjab"
  };
  demandKg: number;              // 80000
  preferredWasteTypes: string[]; // ["Rice Straw", "Wheat Residue"]
  priceRange: {
    min: number;                 // 2.5 (INR)
    max: number;                 // 3.5 (INR)
  };
  description: string;
  contact: string;               // "+91-98765-43210"
  isActive: boolean;
  createdAt: Timestamp;
}
```

### `waste_batches` Collection
```typescript
{
  id: string;                    // Auto-generated
  farmerId: string;              // User UID
  farmerName: string;            // "Farmer Singh"
  wasteType: string;             // "Rice Straw"
  quantityKg: number;            // 500
  moistureLevel: string;         // "15%"
  season: string;                // "Rabi" | "Kharif" | "Zaid"
  photoUrl: string;              // Firebase Storage URL
  location: {
    lat: number;
    lng: number;
  };
  status: string;                // "pending" | "matched" | "match_failed"
  matchId?: string;              // Reference to ai_matches doc
  matchedIndustry?: string;      // Industry name
  estimatedValue?: number;       // Total value in INR
  co2SavedTons?: number;         // Environmental impact
  pm25PreventedKg?: number;      // Air quality benefit
  region: string;                // "Punjab"
  district: string;              // "Ludhiana"
  createdAt: Timestamp;
  matchedAt?: Timestamp;
}
```

### `ai_matches` Collection
```typescript
{
  id: string;                    // Auto-generated
  wasteBatchId: string;          // Reference to waste_batches
  farmerId: string;
  farmerName: string;
  industryId: string;            // Reference to industries
  industryName: string;

  // Pricing
  pricePerKg: number;            // INR
  totalValue: number;            // INR
  currency: "INR";

  // AI Decision
  reasoning: string;             // AI's explanation (2-3 sentences)
  matchScore: number;            // 0-100
  factors: {
    proximityScore: number;      // 0-100
    demandFitScore: number;      // 0-100
    qualityScore: number;        // 0-100
    priceScore: number;          // 0-100
  };
  logisticsNote: string;
  environmentalImpact: string;

  // Metrics
  distanceKm: number;
  decisionTimeSeconds: number;
  co2SavedTons: number;
  pm25PreventedKg: number;

  // Location
  region: "Punjab";
  district: "Ludhiana";
  state: "Punjab";
  country: "India";

  // Status
  status: "autonomous_pending" | "accepted" | "rejected";
  agentName: "ECOX Punjab Agent v1.0 (Gemini)";
  aiModel: "gemini-2.0-flash-thinking-exp";

  // Timestamps
  timestamp: Timestamp;
  createdAt: string;             // ISO string

  // Waste Details
  wasteType: string;
  wasteQuantityKg: number;
  wasteLocation: { lat: number; lng: number };
  wastePhotoUrl?: string;
  wasteSeason: string;
}
```

## 📊 Performance

- **First Load**: ~125KB JS
- **Route-based code splitting**: ✅
- **Optimized fonts**: Google Fonts with `next/font`
- **Image optimization**: Next.js Image component + Firebase Storage
- **Build time**: ~4s with Turbopack
- **AI Decision Time**: 2-5 seconds (Gemini 2.0 Flash Thinking)
- **Real-time latency**: <500ms (Firestore listeners)

## 🐛 Known Issues & Limitations

### Current Limitations
- Icons are SVG placeholders (replace with PNG from Figma for production)
- Authentication uses mock data (implement Firebase Auth for production)
- Accept/Reject buttons on industry dashboard are UI-only (backend logic pending)
- Offline mode supports viewing only (submissions require network)
- Camera requires HTTPS (works on localhost and Vercel, not HTTP)

### Next-intl Warnings
- Deprecation warnings are cosmetic and don't affect functionality
- Will be resolved in next-intl v4.0

### Dynamic Rendering
- All pages use dynamic rendering (required for next-intl)
- This is expected behavior for i18n apps

## 🚀 Deployment

### Vercel Deployment (Frontend)

```bash
# Already deployed at: https://eco-x-hackathon.vercel.app

# To redeploy:
git add .
git commit -m "Update with backend features"
git push origin main

# Vercel auto-deploys on push

# Or manual deploy:
vercel --prod
```

### Firebase Deployment (Backend)

```bash
# Deploy Cloud Functions + Firestore + Storage
firebase deploy --only functions,firestore,storage

# Deploy only functions (faster)
firebase deploy --only functions

# View logs
firebase functions:log --only autonomousWasteMatching --limit 50
```

### Environment Variables in Vercel

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add all `NEXT_PUBLIC_*` variables from `.env.local`
3. Save and redeploy

## 🧪 Testing

### End-to-End Test Flow

1. **Farmer Submission**:
```bash
# Open: https://eco-x-hackathon.vercel.app/hi/pickup

# 1. Capture waste photo (camera)
# 2. Get GPS location
# 3. Fill form: Rice Straw, 500kg, Rabi season
# 4. Submit
```

2. **Backend Verification**:
```bash
# Check Firebase Console → Firestore → waste_batches
# Status should be "pending"

# Wait 5 seconds, check Cloud Functions logs:
firebase functions:log --only autonomousWasteMatching

# Status should change to "matched"
# New document in ai_matches collection
```

3. **Dashboard Verification**:
```bash
# Open: https://eco-x-hackathon.vercel.app/hi/dashboard-industry

# New match should appear in real-time
# Verify AI reasoning, pricing, impact metrics
```

4. **History Verification**:
```bash
# Open: https://eco-x-hackathon.vercel.app/hi/history

# Submitted waste should appear in list
# Match status and earnings displayed
```

### Manual Testing Checklist

- [ ] PWA installs on Android
- [ ] Camera captures waste photo
- [ ] GPS location works
- [ ] Waste submission saves to Firestore
- [ ] AI agent triggers and matches within 5 seconds
- [ ] Match appears on industry dashboard in real-time
- [ ] Impact metrics calculate correctly
- [ ] History screen displays past submissions
- [ ] Hindi/English language switching works
- [ ] All forms validate properly

## 📄 License

Built for BTF 2025 Hackathon - ECOX Labs Team

## 🙏 Credits

- **Design**: Figma design system
- **Framework**: Next.js by Vercel
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Mukta, Inter)
- **Backend**: Firebase (Google Cloud)
- **AI Model**: Google Gemini 2.0 Flash Thinking
- **Target Region**: Ludhiana, Punjab, India

## 📞 Contact & Support

- **GitHub**: https://github.com/howdoiusekeyboard/eco-x-hackathon
- **Live Demo**: https://eco-x-hackathon.vercel.app
- **Hackathon**: BTF 2025, BITS Pilani Dubai

## 🌾 About ECOX Labs

ECOX Labs is an autonomous AI-powered agricultural waste supply chain platform targeting Punjab's crop burning crisis. By matching farmers' crop residue to industrial buyers in 3 seconds, we prevent air pollution (1.6M deaths annually), generate farmer income (₹2.5-4/kg), and support India's circular economy goals.

**Problem**: Punjab produces 23 million tons of paddy straw annually. With a short 15-20 day harvest window and government fines for burning (₹15,000), farmers lack alternatives.

**Solution**: Autonomous AI agent (Gemini 2.0 Flash Thinking) analyzes waste type, location, quantity, and quality to match farmers with biogas plants, paper mills, animal feed manufacturers, and composting facilities across Punjab—all without human approval.

**Impact**: Every ton of waste diverted from burning saves 4 tons of CO2 emissions and prevents PM2.5 particulates that contribute to Delhi's air quality crisis.

---

**Built with ❤️ for India's farmers and India's air quality.**