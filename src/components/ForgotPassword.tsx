import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authAPI';

export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setError('Please enter your email');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await authApi.requestPasswordReset(email);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-container">
                <div className="auth-box">
                    <h2>Check Your Email</h2>
                    <p>We've sent a password reset link to <strong>{email}</strong></p>
                    <p>Click the link in the email to reset your password.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="auth-button"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Reset Password</h2>
                <p>Enter your email address and we'll send you a link to reset your password.</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            disabled={loading}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="auth-links">
                    <button
                        onClick={() => navigate('/login')}
                        className="link-button"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
}
