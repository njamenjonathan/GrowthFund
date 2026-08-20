import type { Auth, User as FirebaseUser } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';

export type { FirebaseUser };

/**
 * Lazily-loaded Firebase.
 *
 * The SDK is roughly 120 kB gzipped and was previously imported at the
 * top of the app context, so every visitor downloaded and parsed all of
 * it before the landing page could render — including visitors who never
 * sign in. It now loads on demand, behind the first auth call, and the
 * whole app runs on local state until then.
 */

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

/** True when the bundled config looks real rather than a placeholder. */
export const isFirebaseConfigured =
  Boolean(firebaseConfig.apiKey) && Boolean(firebaseConfig.projectId);

export interface FirebaseServices {
  auth: Auth;
  db: Firestore;
  googleProvider: import('firebase/auth').GoogleAuthProvider;
  authApi: typeof import('firebase/auth');
  dbApi: typeof import('firebase/firestore');
}

let servicesPromise: Promise<FirebaseServices> | null = null;

export const getFirebase = (): Promise<FirebaseServices> => {
  if (!servicesPromise) {
    servicesPromise = (async () => {
      const [{ initializeApp, getApps, getApp }, authApi, dbApi] = await Promise.all([
        import('firebase/app'),
        import('firebase/auth'),
        import('firebase/firestore'),
      ]);

      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

      const databaseId =
        firebaseConfigData.firestoreDatabaseId &&
        firebaseConfigData.firestoreDatabaseId !== '(default)'
          ? firebaseConfigData.firestoreDatabaseId
          : undefined;

      const googleProvider = new authApi.GoogleAuthProvider();
      googleProvider.setCustomParameters({ prompt: 'select_account' });

      return {
        auth: authApi.getAuth(app),
        db: databaseId ? dbApi.getFirestore(app, databaseId) : dbApi.getFirestore(app),
        googleProvider,
        authApi,
        dbApi,
      };
    })().catch((error) => {
      // Reset so a transient network failure does not permanently poison
      // the singleton and lock the user out of retrying.
      servicesPromise = null;
      throw error;
    });
  }

  return servicesPromise;
};
