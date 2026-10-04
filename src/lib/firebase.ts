import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getAuth, DecodedIdToken, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let firebaseApp: App | null = null;
let isFirebaseAdminInitialized = false;
let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;

try {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;

  if (serviceAccountKey) {
    let credentialData: any;
    try {
      credentialData = JSON.parse(serviceAccountKey);
    } catch {
      // Might be a file path
      credentialData = cert(serviceAccountKey);
    }

    firebaseApp = initializeApp({
      credential: typeof credentialData === 'object' && !('getAccessToken' in credentialData)
        ? cert(credentialData)
        : credentialData,
      projectId: projectId || credentialData.project_id,
    });
    isFirebaseAdminInitialized = true;
    authInstance = getAuth(firebaseApp);
    firestoreInstance = getFirestore(firebaseApp);
    console.log('✅ Firebase Admin & Firestore initialized successfully with Service Account Key');
  } else if (projectId && !projectId.includes('YOUR_PROJECT') && projectId !== 'your-project') {
    firebaseApp = initializeApp({
      projectId,
    });
    isFirebaseAdminInitialized = true;
    authInstance = getAuth(firebaseApp);
    firestoreInstance = getFirestore(firebaseApp);
    console.log(`✅ Firebase Admin & Firestore initialized with Project ID: ${projectId}`);
  } else {
    console.info('ℹ️ Firebase Admin SDK initialized in local demo mode (no credentials supplied)');
  }
} catch (err: any) {
  console.warn('⚠️ Firebase Admin initialization notice:', err.message);
}

export const firebaseAdmin = isFirebaseAdminInitialized ? firebaseApp : null;
export const firestore: Firestore | null = firestoreInstance;
export const isLiveFirebaseConfigured = isFirebaseAdminInitialized;

/**
 * Verify Firebase ID Token
 */
export async function verifyFirebaseIdToken(token: string): Promise<DecodedIdToken | null> {
  if (!token) return null;

  if (authInstance) {
    try {
      return await authInstance.verifyIdToken(token);
    } catch (err: any) {
      // In dev or demo mode, don't crash
      console.warn('[Firebase Auth] Failed to verify ID token:', err.message);
      return null;
    }
  }

  return null;
}
