import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { resetPassword } from '../services/authService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);

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
        <div style={styles.container}>
            <div style={{ ...styles.orb, ...styles.orb1 }}></div>
            <div style={{ ...styles.orb, ...styles.orb2 }}></div>
            <div style={{ ...styles.orb, ...styles.orb3 }}></div>

            <div style={styles.glassCard}>
                <div style={styles.cardHeader}>
                    <div style={styles.logoWrapper}>
                        <Sparkles size={28} style={{ color: '#fff' }} />
                    </div>
                    <h2 style={styles.title}>Reset Password</h2>
                    <p style={styles.subtitle}>Enter your email to receive a reset link</p>
                </div>

                {error && <div style={styles.errorBanner}>{error}</div>}
                {message && <div style={styles.successBanner}>{message}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <div style={{
                            ...styles.inputWrapper,
                            borderColor: focusedInput === 'email' ? '#E84393' : 'rgba(232,67,147,0.15)',
                            background: focusedInput === 'email' ? 'rgba(232,67,147,0.04)' : 'rgba(255,255,255,0.6)'
                        }}>
                            <Mail size={18} style={styles.inputIcon} />
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setFocusedInput('email')} onBlur={() => setFocusedInput(null)}
                                style={styles.input} placeholder="you@example.com" required />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={styles.primaryBtn}>
                        {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <><span>Send Reset Link</span><ArrowRight size={18} /></>}
                    </button>
                </form>

                <p style={styles.footerText}>
                    Remember your password? <Link to="/login" style={styles.primaryLink}>Log in</Link>
                </p>
            </div>

            <style>{`
                @keyframes floatOrb1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-50px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(0.9)} }
                @keyframes floatOrb2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-30px,40px) scale(1.15)} 66%{transform:translate(20px,-20px) scale(0.85)} }
                @keyframes floatOrb3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(50px,50px) scale(1.2)} }
                @keyframes cardEntrance { from{opacity:0;transform:translateY(20px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
            `}</style>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FDCBBA 0%, #F8A4C8 35%, #D5A8F0 65%, #B7C6F0 100%)', position: 'relative', overflow: 'hidden', padding: '1rem' },
    orb: { position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.5, pointerEvents: 'none', zIndex: 0 },
    orb1: { width: '400px', height: '400px', background: 'linear-gradient(135deg, #E84393, #F97316)', top: '-10%', left: '-10%', animation: 'floatOrb1 15s ease-in-out infinite' },
    orb2: { width: '350px', height: '350px', background: 'linear-gradient(135deg, #A855F7, #EC4899)', bottom: '-10%', right: '-5%', animation: 'floatOrb2 18s ease-in-out infinite' },
    orb3: { width: '300px', height: '300px', background: 'linear-gradient(135deg, #F97316, #E84393)', top: '40%', left: '60%', animation: 'floatOrb3 20s ease-in-out infinite', opacity: 0.3 },
    glassCard: { width: '100%', maxWidth: '440px', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(232,67,147,0.15)', zIndex: 10, animation: 'cardEntrance 0.6s cubic-bezier(0.2,0.8,0.2,1)' },
    cardHeader: { textAlign: 'center', marginBottom: '2rem' },
    logoWrapper: { width: '56px', height: '56px', background: 'linear-gradient(135deg, #E84393, #F97316)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '0 10px 25px -5px rgba(232,67,147,0.4)' },
    title: { fontSize: '1.75rem', fontWeight: '700', color: '#2D2235', marginBottom: '0.5rem' },
    subtitle: { color: '#8E7A8A', fontSize: '0.95rem' },
    errorBanner: { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.875rem', marginBottom: '1.5rem', textAlign: 'center' },
    successBanner: { background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', color: '#059669', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.875rem', marginBottom: '1.5rem', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    inputGroup: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '0.875rem', fontWeight: '500', color: '#2D2235', marginBottom: '0.4rem' },
    inputWrapper: { display: 'flex', alignItems: 'center', border: '1.5px solid', borderRadius: '12px', padding: '0 1rem', transition: 'all 0.2s ease', height: '48px' },
    inputIcon: { color: '#E84393', marginRight: '0.75rem', opacity: 0.6 },
    input: { flex: 1, background: 'transparent', border: 'none', color: '#2D2235', fontSize: '0.95rem', outline: 'none', width: '100%', height: '100%' },
    primaryBtn: { marginTop: '0.5rem', height: '50px', background: 'linear-gradient(135deg, #E84393, #F97316)', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 8px 20px -6px rgba(232,67,147,0.4)' },
    footerText: { textAlign: 'center', marginTop: '2rem', color: '#8E7A8A', fontSize: '0.9rem' },
    primaryLink: { color: '#E84393', textDecoration: 'none', fontWeight: '600', marginLeft: '0.25rem' }
};

export default ForgotPassword;
