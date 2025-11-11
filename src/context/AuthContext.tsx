import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged,
    type User as FirebaseUser,
} from 'firebase/auth';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    initializing: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, username: string) => Promise<void>;
    logout: () => void;
}

interface User {
    id: string;
    email: string;
    username: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [initializing, setInitializing] = useState(true);

    // Subscribe to Firebase auth state on mount so sessions persist across reloads
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
            if (fbUser) {
                setUser(mapFirebaseUser(fbUser));
            } else {
                setUser(null);
            }
            // finished initial auth check
            setInitializing(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        setUser(mapFirebaseUser(cred.user));
    };

    const signup = async (email: string, password: string, username: string) => {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        // update displayName on the Firebase user profile
        if (cred.user) {
            await updateProfile(cred.user, { displayName: username });
            // refresh local user state
            setUser(mapFirebaseUser(cred.user));
        }
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    const value = {
        isAuthenticated: !!user,
        user,
        initializing,
        login,
        signup,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function mapFirebaseUser(fbUser: FirebaseUser): User {
    return {
        id: fbUser.uid,
        email: fbUser.email ?? '',
        username: fbUser.displayName ?? fbUser.email?.split('@')[0] ?? '',
    };
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}