import admin from 'firebase-admin';

// Initialize Firebase Admin SDK for server-side use.
// Expect a base64-encoded service account JSON in FIREBASE_SERVICE_ACCOUNT_BASE64
// or rely on GOOGLE_APPLICATION_CREDENTIALS / ADC when available.
if (!admin.apps.length) {
    const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    if (base64) {
        try {
            const json = Buffer.from(base64, 'base64').toString('utf8');
            const serviceAccount = JSON.parse(json);
            admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
            console.log('Firebase Admin initialized from FIREBASE_SERVICE_ACCOUNT_BASE64');
        } catch (err) {
            console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_BASE64', err);
            throw err;
        }
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        // If running on a platform with ADC (or a file path is provided) allow admin to init from ADC
        admin.initializeApp();
        console.log('Firebase Admin initialized using Application Default Credentials');
    } else {
        console.warn('No Firebase Admin credentials found. Set FIREBASE_SERVICE_ACCOUNT_BASE64 or GOOGLE_APPLICATION_CREDENTIALS');
    }
}

export default admin;
