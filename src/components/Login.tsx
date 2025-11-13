import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/auth.css';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, initializing } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/'); // Redirect to home page after successful login
        } catch (err) {
            const code = (err as any)?.code;
            setError(mapAuthError(code) || 'Failed to log in. Please check your credentials.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="auth-button"
                    disabled={loading || initializing}
                    aria-busy={loading || initializing}
                >
                    {(loading || initializing) ? (
                        <><span className="spinner" />Logging in...</>
                    ) : 'Login'}
                </button>

                <Link to="/signup" className="auth-link">
                    Don't have an account? Sign up
                </Link>
            </form>
        </div>
    );
}

function mapAuthError(code?: string) {
    switch (code) {
        case 'auth/user-not-found':
            return 'No account found for this email.';
        case 'auth/wrong-password':
            return 'Incorrect password.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        case 'auth/network-request-failed':
            return 'Network error. Please try again.';
        default:
            return undefined;
    }
}