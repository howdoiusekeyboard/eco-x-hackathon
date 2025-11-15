import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { WasteBatch, AIMatch, Industry, IoTReading } from './types';

// Collection names
export const COLLECTIONS = {
  WASTE_BATCHES: 'waste_batches',
  AI_MATCHES: 'ai_matches',
  INDUSTRIES: 'industries',
  IOT_READINGS: 'iot_readings',
  USERS: 'users',
} as const;

// ============================================
// WASTE BATCHES
// ============================================

/**
 * Create a new waste batch submission
 */
export async function createWasteBatch(
  data: Omit<WasteBatch, 'id' | 'createdAt'>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.WASTE_BATCHES), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating waste batch:', error);
    throw error;
  }
}

/**
 * Get all waste batches for a specific farmer
 */
export async function getWasteBatchesByFarmer(
  farmerId: string
): Promise<WasteBatch[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.WASTE_BATCHES),
      where('farmerId', '==', farmerId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as WasteBatch[];
  } catch (error) {
    console.error('Error fetching waste batches:', error);
    throw error;
  }
}

/**
 * Get a single waste batch by ID
 */
export async function getWasteBatchById(batchId: string): Promise<WasteBatch | null> {
  try {
    const docRef = doc(db, COLLECTIONS.WASTE_BATCHES, batchId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as WasteBatch;
    }
    return null;
  } catch (error) {
    console.error('Error fetching waste batch:', error);
    throw error;
  }
}

/**
 * Listen to real-time updates for farmer's waste batches
 */
export function subscribeToFarmerWasteBatches(
  farmerId: string,
  callback: (batches: WasteBatch[]) => void
): Unsubscribe {
  const q = query(
    collection(db, COLLECTIONS.WASTE_BATCHES),
    where('farmerId', '==', farmerId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const batches = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as WasteBatch[];
    callback(batches);
  });
}

// ============================================
// AI MATCHES
// ============================================

/**
 * Get all AI matches (for industry dashboard)
 */
export async function getAllAIMatches(limitCount: number = 20): Promise<AIMatch[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.AI_MATCHES),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AIMatch[];
  } catch (error) {
    console.error('Error fetching AI matches:', error);
    throw error;
  }
}

/**
 * Get AI matches for a specific industry
 */
export async function getAIMatchesByIndustry(
  industryId: string
): Promise<AIMatch[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.AI_MATCHES),
      where('industryId', '==', industryId),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AIMatch[];
  } catch (error) {
    console.error('Error fetching matches for industry:', error);
    throw error;
  }
}

/**
 * Listen to real-time AI matches
 */
export function subscribeToAIMatches(
  callback: (matches: AIMatch[]) => void,
  limitCount: number = 20
): Unsubscribe {
  const q = query(
    collection(db, COLLECTIONS.AI_MATCHES),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );

  return onSnapshot(q, (snapshot) => {
    const matches = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AIMatch[];
    callback(matches);
  });
}

/**
 * Accept an AI match
 */
export async function acceptAIMatch(matchId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.AI_MATCHES, matchId);
    await updateDoc(docRef, {
      status: 'accepted',
      acceptedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error accepting match:', error);
    throw error;
  }
}

/**
 * Reject an AI match
 */
export async function rejectAIMatch(matchId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.AI_MATCHES, matchId);
    await updateDoc(docRef, {
      status: 'rejected',
    });
  } catch (error) {
    console.error('Error rejecting match:', error);
    throw error;
  }
}

// ============================================
// INDUSTRIES
// ============================================

/**
 * Get all active industries
 */
export async function getActiveIndustries(): Promise<Industry[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.INDUSTRIES),
      where('isActive', '==', true)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Industry[];
  } catch (error) {
    console.error('Error fetching industries:', error);
    throw error;
  }
}

/**
 * Get industries by state (e.g., Punjab)
 */
export async function getIndustriesByState(state: string): Promise<Industry[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.INDUSTRIES),
      where('isActive', '==', true),
      where('location.state', '==', state)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Industry[];
  } catch (error) {
    console.error('Error fetching industries by state:', error);
    throw error;
  }
}

// ============================================
// IOT READINGS
// ============================================

/**
 * Get IoT readings for a waste batch
 */
export async function getIoTReadings(wasteBatchId: string): Promise<IoTReading[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.IOT_READINGS),
      where('wasteBatchId', '==', wasteBatchId),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IoTReading[];
  } catch (error) {
    console.error('Error fetching IoT readings:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time IoT readings
 */
export function subscribeToIoTReadings(
  wasteBatchId: string,
  callback: (readings: IoTReading[]) => void
): Unsubscribe {
  const q = query(
    collection(db, COLLECTIONS.IOT_READINGS),
    where('wasteBatchId', '==', wasteBatchId),
    orderBy('timestamp', 'desc'),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const readings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IoTReading[];
    callback(readings);
  });
}
