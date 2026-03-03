import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { registerUser, signInWithGoogle } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const navigate = useNavigate();
    const { refreshUserProfile } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await registerUser(email, password, name);
            await refreshUserProfile();
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to create an account.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            await refreshUserProfile();
            navigate('/dashboard');
        } catch {
            setError('Failed to sign in with Google.');
        }
    };

    const getInputStyle = (field) => ({
        ...styles.inputWrapper,
        borderColor: focusedInput === field ? '#E84393' : 'rgba(232,67,147,0.15)',
        background: focusedInput === field ? 'rgba(232,67,147,0.04)' : 'rgba(255,255,255,0.6)'
    });

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
                    <h2 style={styles.title}>Create Account</h2>
                    <p style={styles.subtitle}>Join EditAI Pro today and start creating</p>
                </div>

                {error && <div style={styles.errorBanner}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <div style={getInputStyle('name')}>
                            <User size={18} style={styles.inputIcon} />
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                onFocus={() => setFocusedInput('name')} onBlur={() => setFocusedInput(null)}
                                style={styles.input} placeholder="John Doe" required />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <div style={getInputStyle('email')}>
                            <Mail size={18} style={styles.inputIcon} />
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setFocusedInput('email')} onBlur={() => setFocusedInput(null)}
                                style={styles.input} placeholder="you@example.com" required />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <div style={getInputStyle('password')}>
                            <Lock size={18} style={styles.inputIcon} />
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setFocusedInput('password')} onBlur={() => setFocusedInput(null)}
                                style={styles.input} placeholder="••••••••" required minLength="6" />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={styles.primaryBtn}>
                        {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <><span>Sign Up</span><ArrowRight size={18} /></>}
                    </button>
                </form>

                <div style={styles.dividerContainer}>
                    <div style={styles.dividerLine}></div>
                    <span style={styles.dividerText}>or continue with</span>
                    <div style={styles.dividerLine}></div>
                </div>

                <button onClick={handleGoogleSignIn} style={styles.googleBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span>Google</span>
                </button>

                <p style={styles.footerText}>
                    Already have an account? <Link to="/login" style={styles.primaryLink}>Log in</Link>
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
    title: { fontSize: '1.75rem', fontWeight: '700', color: '#2D2235', marginBottom: '0.5rem', letterSpacing: '-0.025em' },
    subtitle: { color: '#8E7A8A', fontSize: '0.95rem' },
    errorBanner: { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.875rem', marginBottom: '1.5rem', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    inputGroup: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '0.875rem', fontWeight: '500', color: '#2D2235', marginBottom: '0.4rem' },
    inputWrapper: { display: 'flex', alignItems: 'center', border: '1.5px solid', borderRadius: '12px', padding: '0 1rem', transition: 'all 0.2s ease', height: '48px' },
    inputIcon: { color: '#E84393', marginRight: '0.75rem', opacity: 0.6 },
    input: { flex: 1, background: 'transparent', border: 'none', color: '#2D2235', fontSize: '0.95rem', outline: 'none', width: '100%', height: '100%' },
    primaryBtn: { marginTop: '0.5rem', height: '50px', background: 'linear-gradient(135deg, #E84393, #F97316)', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 8px 20px -6px rgba(232,67,147,0.4)' },
    dividerContainer: { display: 'flex', alignItems: 'center', margin: '1.75rem 0', gap: '1rem' },
    dividerLine: { flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(232,67,147,0) 0%, rgba(232,67,147,0.15) 50%, rgba(232,67,147,0) 100%)' },
    dividerText: { color: '#8E7A8A', fontSize: '0.85rem', fontWeight: '500' },
    googleBtn: { width: '100%', height: '48px', background: 'rgba(255,255,255,0.6)', border: '1.5px solid rgba(232,67,147,0.12)', borderRadius: '12px', color: '#2D2235', fontSize: '0.95rem', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', cursor: 'pointer' },
    footerText: { textAlign: 'center', marginTop: '2rem', color: '#8E7A8A', fontSize: '0.9rem' },
    primaryLink: { color: '#E84393', textDecoration: 'none', fontWeight: '600', marginLeft: '0.25rem' }
};

export default Signup;
