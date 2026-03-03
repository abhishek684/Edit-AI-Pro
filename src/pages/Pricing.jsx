import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles, Wand2, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Pricing = () => {
    const navigate = useNavigate();
    const { userProfile } = useAuth();
    const [loadingPlan, setLoadingPlan] = useState(null);

    const handleSubscribe = (planId) => {
        navigate(`/dashboard/payment/${planId}`);
    };

    const handleManage = () => {
        navigate('/dashboard/payment/premium');
    };

    const isCurrentPlan = (planId) => {
        return userProfile?.subscriptionPlan === planId;
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', padding: '2rem' }}>

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <button
                    className="btn-outline"
                    onClick={() => navigate('/dashboard')}
                    style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>

                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                        Unlock Your Creative Potential
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                        Choose the perfect plan for your AI editing workflow. From casual tweaks to professional automation.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'flex-start' }}>

                    {/* Free Plan */}
                    <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Free Trial</h2>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 700 }}>₹0</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Perfect for testing the waters.</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                            {[
                                "50 Total Credits",
                                "Basic filter adjustments",
                                "Standard export quality",
                                "10MB file limit"
                            ].map((feature, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                    <Check size={20} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                    <span style={{ fontSize: '0.95rem' }}>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            {isCurrentPlan('free') ? (
                                <button className="btn-outline" style={{ width: '100%', cursor: 'default', opacity: 0.7 }} disabled>Current Plan</button>
                            ) : (
                                <button className="btn-outline" style={{ width: '100%' }} onClick={() => navigate('/signup')}>Sign Up Free</button>
                            )}
                        </div>
                    </div>

                    {/* Pro Plan */}
                    <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%', border: '2px solid var(--primary)', position: 'relative', transform: 'scale(1.05)', zIndex: 10 }}>
                        <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--primary)', color: 'white', padding: '0.25rem 1rem', borderRadius: '14px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Sparkles size={14} /> MOST POPULAR
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Pro</h2>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 700 }}>₹9</span>
                                <span style={{ color: 'var(--text-muted)' }}>/month</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>For creators and enthusiasts.</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                            {[
                                "500 Credits per month",
                                "Advanced AI Background Removal",
                                "AI Object Replacement",
                                "AI Face Enhancement & Upscaling",
                                "High-resolution exports"
                            ].map((feature, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                    <Check size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                    <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            {isCurrentPlan('pro') ? (
                                <button className="btn-outline" style={{ width: '100%', cursor: 'default', opacity: 0.7 }} disabled>Current Plan</button>
                            ) : (
                                <button className="btn-primary" style={{ width: '100%' }} onClick={() => handleSubscribe('pro')}>
                                    Upgrade to Pro
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Premium Plan */}
                    <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Premium</h2>
                                <Zap size={20} style={{ color: '#F59E0B' }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 700 }}>₹29</span>
                                <span style={{ color: 'var(--text-muted)' }}>/month</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>For professional workflows.</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                            {[
                                "Unlimited Credits",
                                "Unrestricted Prompt AI Editing",
                                "Priority API processing speed",
                                "Commercial usage rights",
                                "24/7 Priority Support"
                            ].map((feature, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                    <Check size={20} style={{ color: 'var(--text-main)', flexShrink: 0 }} />
                                    <span style={{ fontSize: '0.95rem' }}>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            {isCurrentPlan('premium') ? (
                                <button className="btn-outline" style={{ width: '100%', cursor: 'default', opacity: 0.7 }} disabled>Current Plan</button>
                            ) : (
                                <button className="btn-outline" style={{ width: '100%', borderColor: 'var(--text-main)', color: 'var(--text-main)' }} onClick={() => handleSubscribe('premium')}>
                                    Upgrade to Premium
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Pricing;
