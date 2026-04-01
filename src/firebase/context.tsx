import { getAuth } from 'firebase/auth';

const auth = getAuth();
const user = auth.currentUser;
if (user) {
    const token = await user.getIdToken();
    localStorage.setItem('authToken', token);

    setInterval(async () => {
        const newToken = await user.getIdToken(true);
        localStorage.setItem('authToken', newToken);
    }, 50 * 60 * 1000);
}