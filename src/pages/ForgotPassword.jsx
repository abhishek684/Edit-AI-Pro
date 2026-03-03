import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '../services/authService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            await resetPassword(email);
            setMessage('Check your inbox for password reset instructions.');
        } catch {
            setError('Failed to reset password. Please check the email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="card auth-card">
                <h2 className="auth-title">Reset Password</h2>
                <p className="auth-subtitle">Enter your email to receive a reset link</p>

                {error && <div className="error-message">{error}</div>}
                {message && <div className="error-message" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary btn-full" disabled={loading}>
                        {loading ? 'Sending...' : 'Reset Password'}
                    </button>
                </form>

                <p className="text-center mt-4 text-sm text-muted">
                    Remember your password? <Link to="/login" className="text-primary">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
