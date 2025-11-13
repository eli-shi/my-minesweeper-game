import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
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

    const login = async (email: string, _password: string) => {
        // TODO: Implement actual authentication logic here
        // For now, simulate a successful login
        setUser({
            id: '1',
            email,
            username: email.split('@')[0],
        });
    };

    const signup = async (email: string, _password: string, username: string) => {
        // TODO: Implement actual signup logic here
        setUser({
            id: '1',
            email,
            username,
        });
    };

    const logout = () => {
        setUser(null);
    };

    const value = {
        isAuthenticated: !!user,
        user,
        login,
        signup,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}