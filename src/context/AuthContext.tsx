import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
    type User as FirebaseUser,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { authApi, type User } from '../services/authAPI';

interface AuthContextType {
    currentUser: FirebaseUser | null;
    backendUser: User | null;
    loading: boolean;
    register: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
    const [backendUser, setBackendUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);

    async function register(email: string, password: string) {
        setIsRegistering(true);
        try {
            console.log('Starting registration process...');

            console.log('Creating Firebase user...');
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Firebase user created:', userCredential.user.uid);

            console.log('Registering with backend...');
            await authApi.register(email, password);
            console.log('Backend registration complete');

            console.log('Getting Firebase ID token...');
            const idToken = await userCredential.user.getIdToken();
            console.log('Logging in to backend...');
            const authResponse = await authApi.login(idToken);
            setBackendUser(authResponse.user);
            console.log('Registration complete!');
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        } finally {
            setIsRegistering(false);
        }
    }

    async function login(email: string, password: string) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        const idToken = await userCredential.user.getIdToken();

        const authResponse = await authApi.login(idToken);
        setBackendUser(authResponse.user);
    }

    async function logout() {
        try {
            await authApi.logout();
        } catch (error) {
            console.warn('Backend logout failed, continuing with Firebase logout:', error);
        }

        await signOut(auth);
        setBackendUser(null);
        authApi.removeToken();
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user && !isRegistering) {
                try {
                    const idToken = await user.getIdToken();

                    const authResponse = await authApi.login(idToken);
                    setBackendUser(authResponse.user);
                } catch (error) {
                    console.error('Failed to sync with backend:', error);
                    setBackendUser(null);
                }
            } else if (!user) {
                setBackendUser(null);
                authApi.removeToken();
            }

            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, [isRegistering]);

    const value: AuthContextType = {
        currentUser,
        backendUser,
        loading,
        register,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

