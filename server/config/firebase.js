import admin from 'firebase-admin';

const initializeFirebase = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    console.log('Firebase Admin SDK initialized');
  }
  return admin;
};

const getStorageBucket = () => {
  const firebaseAdmin = initializeFirebase();
  return firebaseAdmin.storage().bucket();
};

export { initializeFirebase, getStorageBucket };
