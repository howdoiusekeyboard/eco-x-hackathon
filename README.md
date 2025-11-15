# KhetSe - ECOX Labs PWA

A mobile-first Progressive Web App connecting farmers with industries for agricultural waste management. Built for the BTF 2025 Hackathon at BITS Pilani.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router) with Turbopack
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS 3.x
- **Runtime**: Bun 1.3.2
- **i18n**: next-intl (Hindi + English)
- **Forms**: React Hook Form + Zod
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Backend**: Firebase (Ready to integrate)

## 📱 PWA Features

- **Installable**: Add to Home Screen on Android/iOS
- **Service Worker**: Minimal SW for installability (caches static assets only)
- **Manifest**: Full PWA manifest with icons
- **Mobile-First**: Optimized for Pixel 7 (412x915 viewport)
- **Offline**: No offline mode - requires backend connectivity for data sync

## 🎨 Design System

- **Colors**: Cream (#f2eac5), Gold (#e1cf7a), Yellow (#ffe568), Green (#60d66a)
- **Fonts**: Mukta (Hindi/Devanagari), Inter (English)
- **Components**: Custom Button, Input, Card with shadow effects
- **Responsive**: Mobile-first with smooth transitions

## 📂 Project Structure

```
eco-x-hackathon/
├── app/
│   ├── [locale]/          # i18n routes (hi, en)
│   │   ├── page.tsx       # Language selection
│   │   ├── splash/        # Splash screen
│   │   ├── user-type/     # Farmer/Buyer selection
│   │   ├── login/         # Authentication
│   │   ├── dashboard/     # Farmer dashboard
│   │   ├── pickup/        # Waste pickup form
│   │   ├── date-picker/   # Schedule pickup
│   │   ├── confirmation/  # Success screen
│   │   ├── marketplace/   # Buyer marketplace
│   │   ├── product/[id]/  # Product details
│   │   └── fiber-products/# Fiber market
│   ├── globals.css
│   ├── layout.tsx
│   └── register-sw.tsx    # Service worker registration
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   └── layout/
│       └── Sidebar.tsx    # Navigation menu
├── lib/
│   └── utils.ts           # Utility functions
├── messages/              # i18n translations
│   ├── hi.json
│   └── en.json
├── public/
│   ├── sw.js              # Service worker
│   ├── manifest.json      # PWA manifest
│   └── icons/             # App icons (SVG placeholders)
├── i18n.ts
├── middleware.ts          # next-intl middleware
└── next.config.ts

```

## 🛠️ Setup Instructions

### Prerequisites

- Bun 1.3+ installed ([https://bun.sh](https://bun.sh))
- Node.js 18+ (for compatibility)
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd eco-x-hackathon

# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

### Development

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will start on the language selection screen.

**Important**: For PWA features to work, you need HTTPS:
- Use `localhost` for local testing (PWA works on localhost)
- For production, deploy to Vercel/Netlify/Firebase Hosting

## 🌍 User Flows

### Farmer Flow
1. Select language (Hindi/English)
2. View splash screen
3. Select "Pickup Waste"
4. Login
5. Access dashboard
6. Fill waste pickup form (6 fields + photo)
7. Schedule date/time
8. Receive confirmation

### Buyer Flow
1. Select language
2. View splash screen
3. Select "I am a Buyer"
4. Login
5. Browse marketplace
6. View product details
7. Enter delivery address
8. Confirm purchase

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
# Firebase (when ready to integrate)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
```

### PWA Customization

- **Icons**: Replace SVG placeholders in `/public/icons/` with PNG icons from Figma
- **Service Worker**: Edit `/public/sw.js` to customize caching strategy
- **Manifest**: Update `/public/manifest.json` for app metadata

### Adding Languages

1. Add locale to `i18n.ts`:
   ```ts
   export const locales = ["hi", "en", "ta", "bn"] as const;
   ```

2. Create translation file in `messages/ta.json`

3. Add fonts in `app/layout.tsx` if needed

## 📱 PWA Testing

### Install on Android
1. Open app in Chrome
2. Tap menu → "Add to Home Screen"
3. App installs as standalone

### Install on iOS
1. Open app in Safari
2. Tap Share button
3. Tap "Add to Home Screen"

## 🎯 Features Implemented

✅ All 13 screens from Figma design
✅ Hindi + English bilingual support
✅ Form validation (React Hook Form + Zod)
✅ PWA installability (Service Worker + Manifest)
✅ Mobile-first responsive design
✅ Navigation sidebar with language switcher
✅ WhatsApp contact integration
✅ Date picker component
✅ Image upload (camera/gallery)
✅ Clean, shadow-based UI matching Figma

## 🚧 Firebase Integration (Next Steps)

The app is architected for Firebase but not yet connected. To integrate:

1. Install Firebase SDK:
   ```bash
   bun add firebase
   ```

2. Create `lib/firebase.ts`:
   ```ts
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';
   import { getStorage } from 'firebase/storage';

   const firebaseConfig = {
     // Your config from Firebase Console
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   export const storage = getStorage(app);
   ```

3. Update login page to use Firebase Auth
4. Connect forms to Firestore
5. Upload images to Firebase Storage

## 📊 Performance

- **First Load**: ~125KB JS
- **Route-based code splitting**: ✅
- **Optimized fonts**: Google Fonts with `next/font`
- **Image optimization**: Next.js Image component ready
- **Build time**: ~4s with Turbopack

## 🐛 Known Issues

- Next-intl deprecation warnings (cosmetic, doesn't affect functionality)
- Icons are SVG placeholders (replace with PNG from Figma for production)
- Dynamic rendering used for all pages (required for next-intl, fine for PWA)

## 📄 License

Built for BTF 2025 Hackathon - ECOX Labs Team

## 🙏 Credits

- **Design**: Figma design system
- **Framework**: Next.js by Vercel
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Mukta, Inter)
