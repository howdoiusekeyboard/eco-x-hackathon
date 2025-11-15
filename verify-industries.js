/**
 * Verify industries were added to Firestore
 */

require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore');

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

async function verifyIndustries() {
  console.log('🔍 Verifying industries in Firestore...\n');

  try {
    const industriesRef = collection(db, 'industries');
    const q = query(industriesRef, where('location.state', '==', 'Punjab'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log('❌ No industries found!');
      process.exit(1);
    }

    console.log(`✅ Found ${snapshot.size} Punjab industries:\n`);

    snapshot.forEach((doc, index) => {
      const data = doc.data();
      console.log(`${index + 1}. ${data.name}`);
      console.log(`   Type: ${data.type}`);
      console.log(`   Location: ${data.location.city}`);
      console.log(`   Demand: ${data.demandKg.toLocaleString()} kg/month`);
      console.log(`   Price Range: ₹${data.priceRange.min}-${data.priceRange.max}/kg`);
      console.log(`   Waste Types: ${data.preferredWasteTypes.join(', ')}`);
      console.log(`   Active: ${data.isActive ? '✅' : '❌'}`);
      console.log('');
    });

    console.log('✅ Verification complete! All industries are ready for AI matching.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyIndustries();
