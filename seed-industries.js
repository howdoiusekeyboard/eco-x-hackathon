/**
 * ECOX Labs - Industry Database Seeder
 * Adds 5 Punjab industries to Firestore (Step 2 of Deployment Guide)
 */

require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, writeBatch } = require('firebase/firestore');

// Initialize Firebase with client SDK
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Industry data from DEPLOYMENT_GUIDE.md
const industries = [
  {
    id: 'biopower-ludhiana',
    data: {
      name: 'Punjab BioEnergy Ltd',
      type: 'biogas',
      location: {
        lat: 30.9010,
        lng: 75.8573,
        city: 'Ludhiana',
        state: 'Punjab'
      },
      demandKg: 80000,
      preferredWasteTypes: ['Rice Straw', 'Wheat Residue', 'Mustard Stalks'],
      priceRange: {
        min: 2.5,
        max: 3.5
      },
      description: 'Biogas plant converting paddy straw to renewable energy',
      contact: '+91-98765-43210',
      isActive: true,
      createdAt: '2025-11-15T08:00:00Z'
    }
  },
  {
    id: 'greenfeed-punjab',
    data: {
      name: 'Green Feed Industries',
      type: 'animal_feed',
      location: {
        lat: 30.8850,
        lng: 75.8700,
        city: 'Ludhiana',
        state: 'Punjab'
      },
      demandKg: 50000,
      preferredWasteTypes: ['Rice Straw', 'Wheat Residue'],
      priceRange: {
        min: 2.0,
        max: 3.0
      },
      description: 'Cattle feed manufacturer using agricultural waste',
      contact: '+91-98765-43211',
      isActive: true,
      createdAt: '2025-11-15T08:00:00Z'
    }
  },
  {
    id: 'paper-mills-ludhiana',
    data: {
      name: 'Ludhiana Paper Mills',
      type: 'paper_production',
      location: {
        lat: 30.9200,
        lng: 75.8400,
        city: 'Ludhiana',
        state: 'Punjab'
      },
      demandKg: 60000,
      preferredWasteTypes: ['Rice Straw', 'Wheat Residue', 'Sugarcane Bagasse'],
      priceRange: {
        min: 1.8,
        max: 2.8
      },
      description: 'Recycled paper and packaging materials',
      contact: '+91-98765-43212',
      isActive: true,
      createdAt: '2025-11-15T08:00:00Z'
    }
  },
  {
    id: 'compost-punjab',
    data: {
      name: 'Punjab Organic Compost Co.',
      type: 'composting',
      location: {
        lat: 30.9100,
        lng: 75.8650,
        city: 'Ludhiana',
        state: 'Punjab'
      },
      demandKg: 40000,
      preferredWasteTypes: ['Rice Straw', 'Wheat Residue', 'Mustard Stalks', 'Cotton Stalks'],
      priceRange: {
        min: 1.5,
        max: 2.5
      },
      description: 'Organic fertilizer and soil conditioner production',
      contact: '+91-98765-43213',
      isActive: true,
      createdAt: '2025-11-15T08:00:00Z'
    }
  },
  {
    id: 'ethanol-punjab',
    data: {
      name: 'Punjab Ethanol Plant',
      type: 'biofuel',
      location: {
        lat: 30.8900,
        lng: 75.8800,
        city: 'Ludhiana',
        state: 'Punjab'
      },
      demandKg: 70000,
      preferredWasteTypes: ['Rice Straw', 'Wheat Residue', 'Corn Stalks'],
      priceRange: {
        min: 2.8,
        max: 4.0
      },
      description: 'Second-generation ethanol from agricultural residues',
      contact: '+91-98765-43214',
      isActive: true,
      createdAt: '2025-11-15T08:00:00Z'
    }
  }
];

async function seedIndustries() {
  console.log('🌾 ECOX Labs - Seeding Punjab Industries to Firestore...\n');

  try {
    const batch = writeBatch(db);
    const industriesCollection = collection(db, 'industries');

    for (const industry of industries) {
      const docRef = doc(industriesCollection, industry.id);
      batch.set(docRef, industry.data);
      console.log(`✅ Queued: ${industry.data.name} (${industry.data.type})`);
    }

    await batch.commit();

    console.log('\n✅ All 5 Punjab industries successfully added to Firestore!');
    console.log('\n📊 Summary:');
    console.log('   - Collection: industries');
    console.log('   - Documents: 5');
    console.log('   - Region: Punjab (Ludhiana)');
    console.log('   - Total demand: 300,000 kg/month');
    console.log('\n🎯 Step 2 Complete! Next: Deploy Firebase Functions (Step 3)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding industries:', error);
    console.error('Full error:', error.message);
    process.exit(1);
  }
}

// Run the seeder
seedIndustries();
