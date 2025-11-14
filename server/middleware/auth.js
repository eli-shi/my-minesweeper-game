import admin from '../services/firebaseAdmin.js';
import prisma from '../services/prisma.js';

// Express middleware: verify Firebase ID token and map to local DB user
export async function verifyFirebaseToken(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/^Bearer (.+)$/);
    if (!match) return res.status(401).json({ error: 'Missing Authorization header' });

    const idToken = match[1];
    try {
        const decoded = await admin.auth().verifyIdToken(idToken);
        // attach decoded token
        req.auth = decoded;

        const email = decoded.email;
        let user = null;
        if (email) {
            user = await prisma.user.findUnique({ where: { email } });
        }

        if (!user) {
            const username = decoded.name ?? (email ? email.split('@')[0] : `u_${decoded.uid.slice(0, 6)}`);
            user = await prisma.user.create({
                data: {
                    email: email ?? '',
                    username,
                    passwordHashed: '',
                },
            });
        }

        req.user = user;
        return next();
    } catch (err) {
        console.error('Failed to verify ID token', err);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
