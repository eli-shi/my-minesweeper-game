const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface User {
    id: string;
    email: string;
    username: string;
    created_at: string;
    updated_at: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

class AuthApiService {
    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    setToken(token: string): void {
        localStorage.setItem('authToken', token);
    }

    removeToken(): void {
        localStorage.removeItem('authToken');
    }

    private getAuthHeaders(): HeadersInit {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }

    async register(email: string, password: string): Promise<User> {
        console.log('authAPI.register called with email:', email);
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        console.log('Register response status:', response.status);

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
            console.error('Register error:', error);
            throw new Error(error.error || 'Registration failed');
        }

        const data = await response.json();
        console.log('Register success:', data);
        return data;
    }

    async login(idToken: string): Promise<AuthResponse> {
        console.log('authAPI.login called with idToken:', idToken.substring(0, 20) + '...');
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ idToken }),
        });

        console.log('Login response status:', response.status);

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
            console.error('Login error:', error);
            throw new Error(error.error || 'Login failed');
        }

        const data: AuthResponse = await response.json();
        console.log('Login success, setting token');
        this.setToken(data.token);
        return data;
    }

    async logout(): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }

        this.removeToken();
    }

    async requestPasswordReset(email: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/auth/password-reset-request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
            throw new Error(error.error || 'Failed to send reset email');
        }
    }

    async resetPassword(code: string, newPassword: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/auth/password-reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, newPassword }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
            throw new Error(error.error || 'Failed to reset password');
        }
    }
}

export const authApi = new AuthApiService();