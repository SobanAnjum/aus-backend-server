import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getAuth, DecodedIdToken, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

import fs from 'fs';

let firebaseApp: App | null = null;
let isFirebaseAdminInitialized = false;
let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;

try {
  const rawKey = (process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '').trim();
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;

  let hasValidServiceAccount = false;

  if (rawKey && rawKey.length > 20) {
    try {
      let credentialData: any = null;
      if (rawKey.startsWith('{') && rawKey.endsWith('}')) {
        credentialData = JSON.parse(rawKey);
      } else if (fs.existsSync(rawKey)) {
        credentialData = cert(rawKey);
      }

      if (credentialData && (credentialData.client_email || credentialData.project_id)) {
        const apps = getApps();
        firebaseApp = apps.length > 0 ? apps[0] : initializeApp({
          credential: typeof credentialData === 'object' && !('getAccessToken' in credentialData)
            ? cert(credentialData)
            : credentialData,
          projectId: projectId || credentialData.project_id,
        });
        hasValidServiceAccount = true;
        isFirebaseAdminInitialized = true;
        authInstance = getAuth(firebaseApp);
        firestoreInstance = getFirestore(firebaseApp);
        console.log('✅ Firebase Admin & Firestore initialized successfully with Service Account Key');
      }
    } catch (keyErr: any) {
      console.warn('⚠️ Could not load FIREBASE_SERVICE_ACCOUNT_KEY:', keyErr.message);
    }
  }

  // If no service account key, initialize Auth only (for verifying tokens).
  // DO NOT initialize Firestore, as Firestore without credentials tries to contact GCP metadata server (169.254.169.254) and times out on Render.
  if (!hasValidServiceAccount && projectId && !projectId.includes('YOUR_PROJECT') && projectId !== 'your-project') {
    const apps = getApps();
    firebaseApp = apps.length > 0 ? apps[0] : initializeApp({
      projectId,
    });
    isFirebaseAdminInitialized = true;
    authInstance = getAuth(firebaseApp);
    firestoreInstance = null; // Firestore disabled without service account to prevent metadata server timeout
    console.log(`ℹ️ Firebase Auth initialized for project "${projectId}" (Firestore is disabled because no Service Account Key was provided)`);
  } else if (!hasValidServiceAccount) {
    console.info('ℹ️ Firebase Admin SDK initialized in local demo mode (no credentials supplied)');
  }
} catch (err: any) {
  console.warn('⚠️ Firebase Admin initialization notice:', err.message);
}

export const firebaseAdmin = isFirebaseAdminInitialized ? firebaseApp : null;
export const firestore: Firestore | null = firestoreInstance;
export const isLiveFirebaseConfigured = Boolean(firestoreInstance);

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
