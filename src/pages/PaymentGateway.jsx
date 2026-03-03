import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, CreditCard, Lock, Tag, CheckCircle, ArrowLeft, Loader2, X, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateUserSubscription } from '../services/authService';

const PLANS = {
    pro: {
        name: 'Pro',
        price: 9,
        currency: '₹',
        period: '/month',
        icon: Sparkles,
        color: '#8B5CF6',
        features: ['500 Credits/month', 'AI Background Removal', 'AI Object Replacement', 'High-res exports'],
        credits: 500,
    },
    premium: {
        name: 'Premium',
        price: 29,
        currency: '₹',
        period: '/month',
        icon: Zap,
        color: '#F59E0B',
        features: ['Unlimited Credits', 'Prompt AI Editing', 'Priority Processing', 'Commercial Rights'],
        credits: 9999,
    }
};

const COUPONS = {
    'ABHIPRO': { plan: 'pro', discount: 100, label: 'Pro Plan — 100% OFF' },
    'ABHIPRE': { plan: 'premium', discount: 100, label: 'Premium Plan — 100% OFF' },
};

const PaymentGateway = () => {
    const { planId } = useParams();
    const navigate = useNavigate();
    const { currentUser, refreshUserProfile } = useAuth();

    const plan = PLANS[planId];

    // Form state
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');

    // UX state
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [cardBrand, setCardBrand] = useState(null);
    const [focusedField, setFocusedField] = useState(null);
    const [errors, setErrors] = useState({});
    const [step, setStep] = useState(1); // 1 = form, 2 = processing, 3 = success
    const successTimerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (successTimerRef.current) clearTimeout(successTimerRef.current);
        };
    }, []);

    if (!plan) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Invalid Plan</h2>
                    <button className="btn-primary" onClick={() => navigate('/dashboard/pricing')} style={{ marginTop: '1rem' }}>Back to Pricing</button>
                </div>
            </div>
        );
    }

    // ─── Card Formatting ───
    const formatCardNumber = (val) => {
        const digits = val.replace(/\D/g, '').slice(0, 16);
        return digits.replace(/(.{4})/g, '$1 ').trim();
    };

    const formatExpiry = (val) => {
        const digits = val.replace(/\D/g, '').slice(0, 4);
        if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
        return digits;
    };

    const detectCardBrand = (num) => {
        const d = num.replace(/\s/g, '');
        if (/^4/.test(d)) return 'visa';
        if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return 'mastercard';
        if (/^3[47]/.test(d)) return 'amex';
        if (/^6(?:011|5)/.test(d)) return 'discover';
        return null;
    };

    const handleCardNumberChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        setCardNumber(formatted);
        setCardBrand(detectCardBrand(formatted));
    };

    const handleExpiryChange = (e) => {
        setExpiry(formatExpiry(e.target.value));
    };

    // ─── Coupon Logic ───
    const handleApplyCoupon = () => {
        const code = couponCode.trim().toUpperCase();
        setCouponError('');

        if (!code) {
            setCouponError('Please enter a coupon code');
            return;
        }

        const coupon = COUPONS[code];
        if (!coupon) {
            setCouponError('Invalid coupon code. Please try again.');
            return;
        }

        setAppliedCoupon({ code, ...coupon });
        setCouponError('');
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError('');
    };

    // ─── Validation ───
    const validate = () => {
        const errs = {};
        // If coupon gives 100% off, skip card validation
        if (appliedCoupon && appliedCoupon.discount === 100) return errs;

        if (cardNumber.replace(/\s/g, '').length < 16) errs.cardNumber = 'Enter a valid 16-digit card number';
        if (!cardName.trim()) errs.cardName = 'Cardholder name is required';
        if (!/^\d{2}\/\d{2}$/.test(expiry)) errs.expiry = 'Enter a valid expiry (MM/YY)';
        else {
            const [mm, yy] = expiry.split('/').map(Number);
            if (mm < 1 || mm > 12) errs.expiry = 'Invalid month';
            else if (yy < 26) errs.expiry = 'Card has expired';
        }
        if (cvv.length < 3) errs.cvv = 'Enter a valid CVV';

        return errs;
    };

    // ─── Submit ───
    const handleSubmit = async (e) => {
        e.preventDefault();

        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setStep(2);
        setProcessing(true);

        // Determine the target plan (coupon might override)
        const targetPlan = appliedCoupon ? appliedCoupon.plan : planId;
        const targetPlanData = PLANS[targetPlan];

        try {
            // Simulate processing delay for realism
            await new Promise(r => setTimeout(r, 2500));

            // Update Firestore
            await updateUserSubscription(currentUser.uid, targetPlan, targetPlanData.credits);

            // Refresh user profile context
            await refreshUserProfile();

            setProcessing(false);
            setSuccess(true);
            setStep(3);

            // Auto-redirect after success animation
            successTimerRef.current = setTimeout(() => {
                navigate('/dashboard');
            }, 3500);

        } catch (err) {
            console.error('Payment processing error:', err);
            setProcessing(false);
            setStep(1);
            setErrors({ submit: 'Payment processing failed. Please try again.' });
        }
    };

    // ─── Computed Values ───
    const effectivePlan = appliedCoupon ? PLANS[appliedCoupon.plan] || plan : plan;
    const subtotal = effectivePlan.price;
    const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discount / 100) : 0;
    const total = Math.max(0, subtotal - discountAmount);

    const CardBrandIcon = ({ brand }) => {
        const styles = { fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px', letterSpacing: '0.5px' };
        if (brand === 'visa') return <span style={{ ...styles, backgroundColor: '#1A1F71', color: 'white' }}>VISA</span>;
        if (brand === 'mastercard') return <span style={{ ...styles, backgroundColor: '#EB001B', color: 'white' }}>MC</span>;
        if (brand === 'amex') return <span style={{ ...styles, backgroundColor: '#2E77BB', color: 'white' }}>AMEX</span>;
        if (brand === 'discover') return <span style={{ ...styles, backgroundColor: '#FF6000', color: 'white' }}>DISC</span>;
        return <CreditCard size={18} style={{ color: 'var(--text-muted)' }} />;
    };

    // ─── Success Screen ───
    if (step === 3) {
        return (
            <div style={styles.successOverlay}>
                <div style={styles.successCard}>
                    <div style={styles.successCheckWrapper}>
                        <div style={styles.successCircle}>
                            <CheckCircle size={48} style={{ color: 'white' }} />
                        </div>
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '1.5rem', color: 'var(--text-main)' }}>
                        Payment Successful!
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                        Your <strong>{effectivePlan.name}</strong> plan is now active.
                    </p>
                    {appliedCoupon && (
                        <div style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: '8px', color: 'var(--success)', fontWeight: 600, fontSize: '0.85rem' }}>
                            🎉 Coupon "{appliedCoupon.code}" applied — You paid ₹0!
                        </div>
                    )}
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '1.5rem' }}>
                        Redirecting to dashboard...
                    </p>
                    <div style={styles.progressBar}>
                        <div style={styles.progressFill}></div>
                    </div>
                </div>

                <style>{`
                    @keyframes pgSuccessPop {
                        0% { transform: scale(0); opacity: 0; }
                        50% { transform: scale(1.2); }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    @keyframes pgSuccessRipple {
                        0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
                        100% { box-shadow: 0 0 0 30px rgba(16,185,129,0); }
                    }
                    @keyframes pgProgressFill {
                        0% { width: 0%; }
                        100% { width: 100%; }
                    }
                    @keyframes pgFadeInUp {
                        0% { opacity: 0; transform: translateY(20px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
            </div>
        );
    }

    // ─── Processing Screen ───
    if (step === 2) {
        return (
            <div style={styles.successOverlay}>
                <div style={styles.successCard}>
                    <Loader2 size={48} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '1.5rem', color: 'var(--text-main)' }}>
                        Processing Payment...
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                        Please do not close this window.
                    </p>
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                        <ProcessStep label="Verifying card details" done={true} />
                        <ProcessStep label="Contacting payment network" done={true} />
                        <ProcessStep label="Authorizing transaction" done={false} active={true} />
                        <ProcessStep label="Activating subscription" done={false} />
                    </div>
                </div>
            </div>
        );
    }

    // ─── Main Payment Form ───
    return (
        <div style={styles.pageWrapper}>
            {/* Background decoration */}
            <div style={styles.bgDecor1}></div>
            <div style={styles.bgDecor2}></div>

            <div style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                    <button onClick={() => navigate('/dashboard/pricing')} style={styles.backBtn}>
                        <ArrowLeft size={18} />
                        <span>Back</span>
                    </button>
                    <div style={styles.securedBadge}>
                        <Lock size={14} />
                        <span>SSL Secured</span>
                    </div>
                </div>

                <div className="pg-main-grid" style={styles.mainGrid}>
                    {/* ─── LEFT: Payment Form ─── */}
                    <div className="pg-form-section" style={styles.formSection}>
                        <h1 style={styles.formTitle}>Payment Details</h1>
                        <p style={styles.formSubtitle}>Complete your purchase securely</p>

                        <form onSubmit={handleSubmit}>
                            {/* Card Number */}
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Card Number</label>
                                <div style={{
                                    ...styles.inputWrapper,
                                    borderColor: focusedField === 'cardNumber' ? 'var(--primary)' : errors.cardNumber ? 'var(--error)' : 'var(--border)',
                                    boxShadow: focusedField === 'cardNumber' ? '0 0 0 3px rgba(139,92,246,0.15)' : 'none'
                                }}>
                                    <input
                                        id="pg-card-number"
                                        type="text"
                                        placeholder="1234 5678 9012 3456"
                                        value={cardNumber}
                                        onChange={handleCardNumberChange}
                                        onFocus={() => setFocusedField('cardNumber')}
                                        onBlur={() => setFocusedField(null)}
                                        style={styles.input}
                                        maxLength={19}
                                        inputMode="numeric"
                                        disabled={appliedCoupon?.discount === 100}
                                    />
                                    <CardBrandIcon brand={cardBrand} />
                                </div>
                                {errors.cardNumber && <span style={styles.fieldError}>{errors.cardNumber}</span>}
                            </div>

                            {/* Cardholder Name */}
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Cardholder Name</label>
                                <div style={{
                                    ...styles.inputWrapper,
                                    borderColor: focusedField === 'cardName' ? 'var(--primary)' : errors.cardName ? 'var(--error)' : 'var(--border)',
                                    boxShadow: focusedField === 'cardName' ? '0 0 0 3px rgba(139,92,246,0.15)' : 'none'
                                }}>
                                    <input
                                        id="pg-card-name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                        onFocus={() => setFocusedField('cardName')}
                                        onBlur={() => setFocusedField(null)}
                                        style={styles.input}
                                        disabled={appliedCoupon?.discount === 100}
                                    />
                                </div>
                                {errors.cardName && <span style={styles.fieldError}>{errors.cardName}</span>}
                            </div>

                            {/* Expiry + CVV Row */}
                            <div style={styles.row}>
                                <div style={{ ...styles.fieldGroup, flex: 1 }}>
                                    <label style={styles.label}>Expiry Date</label>
                                    <div style={{
                                        ...styles.inputWrapper,
                                        borderColor: focusedField === 'expiry' ? 'var(--primary)' : errors.expiry ? 'var(--error)' : 'var(--border)',
                                        boxShadow: focusedField === 'expiry' ? '0 0 0 3px rgba(139,92,246,0.15)' : 'none'
                                    }}>
                                        <input
                                            id="pg-expiry"
                                            type="text"
                                            placeholder="MM/YY"
                                            value={expiry}
                                            onChange={handleExpiryChange}
                                            onFocus={() => setFocusedField('expiry')}
                                            onBlur={() => setFocusedField(null)}
                                            style={styles.input}
                                            maxLength={5}
                                            inputMode="numeric"
                                            disabled={appliedCoupon?.discount === 100}
                                        />
                                    </div>
                                    {errors.expiry && <span style={styles.fieldError}>{errors.expiry}</span>}
                                </div>

                                <div style={{ ...styles.fieldGroup, flex: 1 }}>
                                    <label style={styles.label}>CVV</label>
                                    <div style={{
                                        ...styles.inputWrapper,
                                        borderColor: focusedField === 'cvv' ? 'var(--primary)' : errors.cvv ? 'var(--error)' : 'var(--border)',
                                        boxShadow: focusedField === 'cvv' ? '0 0 0 3px rgba(139,92,246,0.15)' : 'none'
                                    }}>
                                        <input
                                            id="pg-cvv"
                                            type="password"
                                            placeholder="•••"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                            onFocus={() => setFocusedField('cvv')}
                                            onBlur={() => setFocusedField(null)}
                                            style={styles.input}
                                            maxLength={4}
                                            inputMode="numeric"
                                            disabled={appliedCoupon?.discount === 100}
                                        />
                                        <Lock size={14} style={{ color: 'var(--text-muted)' }} />
                                    </div>
                                    {errors.cvv && <span style={styles.fieldError}>{errors.cvv}</span>}
                                </div>
                            </div>

                            {/* Card fields disabled notice */}
                            {appliedCoupon?.discount === 100 && (
                                <div style={{
                                    padding: '0.75rem 1rem',
                                    backgroundColor: 'rgba(16,185,129,0.08)',
                                    borderRadius: '10px',
                                    border: '1px solid rgba(16,185,129,0.2)',
                                    color: 'var(--success)',
                                    fontSize: '0.825rem',
                                    fontWeight: 500,
                                    marginBottom: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <CheckCircle size={16} />
                                    No card needed — coupon covers entire amount!
                                </div>
                            )}

                            {/* Coupon Section */}
                            <div style={styles.couponSection}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                    <Tag size={16} style={{ color: 'var(--primary)' }} />
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Have a coupon code?</span>
                                </div>

                                {appliedCoupon ? (
                                    <div style={styles.appliedCouponBadge}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--success)' }}>
                                                    {appliedCoupon.label}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Code: {appliedCoupon.code}</div>
                                            </div>
                                        </div>
                                        <button type="button" onClick={removeCoupon} style={styles.removeCouponBtn}>
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div style={styles.couponInputRow}>
                                        <input
                                            id="pg-coupon-code"
                                            type="text"
                                            placeholder="Enter coupon code"
                                            value={couponCode}
                                            onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                                            style={styles.couponInput}
                                        />
                                        <button type="button" onClick={handleApplyCoupon} style={styles.couponApplyBtn}>
                                            Apply
                                        </button>
                                    </div>
                                )}
                                {couponError && <span style={{ ...styles.fieldError, marginTop: '0.5rem' }}>{couponError}</span>}
                            </div>

                            {errors.submit && (
                                <div style={{ ...styles.fieldError, textAlign: 'center', marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: '8px' }}>
                                    {errors.submit}
                                </div>
                            )}

                            {/* Submit — mobile only order summary is inside form */}
                            <button
                                id="pg-pay-button"
                                type="submit"
                                disabled={processing}
                                style={styles.payButton}
                            >
                                {processing ? (
                                    <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                                ) : (
                                    <>
                                        <Lock size={16} />
                                        Pay {effectivePlan.currency}{total.toFixed(2)}
                                    </>
                                )}
                            </button>

                            <p style={styles.termsText}>
                                By clicking Pay, you agree to our Terms of Service. This is a simulated payment gateway for demonstration purposes.
                            </p>
                        </form>
                    </div>

                    {/* ─── RIGHT: Order Summary ─── */}
                    <div className="pg-summary-section" style={styles.summarySection}>
                        <div style={styles.summaryCard}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Order Summary</h3>

                            {/* Plan info */}
                            <div style={styles.planHeader}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '12px',
                                    background: `linear-gradient(135deg, ${effectivePlan.color}22, ${effectivePlan.color}44)`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <effectivePlan.icon size={22} style={{ color: effectivePlan.color }} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{effectivePlan.name} Plan</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Monthly subscription</div>
                                </div>
                            </div>

                            {/* Features */}
                            <div style={{ margin: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {effectivePlan.features.map((f, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem' }}>
                                        <CheckCircle size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />
                                        <span>{f}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={styles.divider}></div>

                            {/* Price breakdown */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <div style={styles.summaryRow}>
                                    <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                                    <span>{effectivePlan.currency}{subtotal.toFixed(2)}</span>
                                </div>
                                {appliedCoupon && (
                                    <div style={styles.summaryRow}>
                                        <span style={{ color: 'var(--success)', fontWeight: 500 }}>Coupon Discount</span>
                                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>-{effectivePlan.currency}{discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            <div style={styles.divider}></div>

                            <div style={styles.summaryRow}>
                                <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Total</span>
                                <span style={{ fontWeight: 700, fontSize: '1.25rem', color: total === 0 ? 'var(--success)' : 'var(--text-main)' }}>
                                    {total === 0 ? 'FREE' : `${effectivePlan.currency}${total.toFixed(2)}`}
                                </span>
                            </div>

                            {/* Security badges */}
                            <div style={styles.securitySection}>
                                <div style={styles.securityItem}>
                                    <Shield size={14} style={{ color: 'var(--text-muted)' }} />
                                    <span>256-bit encryption</span>
                                </div>
                                <div style={styles.securityItem}>
                                    <Lock size={14} style={{ color: 'var(--text-muted)' }} />
                                    <span>PCI DSS Compliant</span>
                                </div>
                            </div>

                            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                                    Protected by industry-leading security standards. Your card information is never stored on our servers.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Processing Step Sub-component ───
const ProcessStep = ({ label, done, active }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: done || active ? 1 : 0.4 }}>
        {done ? (
            <CheckCircle size={18} style={{ color: 'var(--success)' }} />
        ) : active ? (
            <Loader2 size={18} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
        ) : (
            <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--border)' }}></div>
        )}
        <span style={{ fontSize: '0.875rem', fontWeight: done ? 500 : 400, color: done ? 'var(--success)' : 'var(--text-main)' }}>{label}</span>
    </div>
);

// ─── Inline Styles ───
const styles = {
    pageWrapper: {
        minHeight: '100vh',
        backgroundColor: 'var(--bg-main)',
        position: 'relative',
        overflow: 'hidden',
    },
    bgDecor1: {
        position: 'absolute',
        top: '-150px',
        right: '-150px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    bgDecor2: {
        position: 'absolute',
        bottom: '-100px',
        left: '-100px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    container: {
        maxWidth: '960px',
        margin: '0 auto',
        padding: '1.5rem',
        position: 'relative',
        zIndex: 1,
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    backBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'transparent',
        border: '1px solid var(--border)',
        color: 'var(--text-main)',
        padding: '0.5rem 1rem',
        borderRadius: '10px',
        fontSize: '0.875rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    securedBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.75rem',
        color: 'var(--success)',
        fontWeight: 600,
        backgroundColor: 'rgba(16,185,129,0.08)',
        padding: '0.4rem 0.8rem',
        borderRadius: '20px',
    },
    mainGrid: {
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: '2rem',
        alignItems: 'start',
    },
    formSection: {
        backgroundColor: 'var(--bg-card)',
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    },
    formTitle: {
        fontSize: '1.5rem',
        fontWeight: 700,
        marginBottom: '0.25rem',
    },
    formSubtitle: {
        color: 'var(--text-muted)',
        fontSize: '0.875rem',
        marginBottom: '1.75rem',
    },
    fieldGroup: {
        marginBottom: '1.25rem',
    },
    label: {
        display: 'block',
        fontSize: '0.8rem',
        fontWeight: 600,
        marginBottom: '0.4rem',
        color: 'var(--text-main)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: 'var(--bg-main)',
        border: '1.5px solid var(--border)',
        borderRadius: '10px',
        padding: '0 0.85rem',
        transition: 'all 0.2s ease',
    },
    input: {
        flex: 1,
        border: 'none',
        background: 'transparent',
        padding: '0.8rem 0',
        fontSize: '0.95rem',
        color: 'var(--text-main)',
        fontFamily: "'Inter', monospace",
        outline: 'none',
    },
    row: {
        display: 'flex',
        gap: '1rem',
    },
    fieldError: {
        color: 'var(--error)',
        fontSize: '0.75rem',
        marginTop: '0.3rem',
        display: 'block',
    },
    couponSection: {
        padding: '1rem',
        backgroundColor: 'var(--bg-main)',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        border: '1px dashed var(--border)',
    },
    couponInputRow: {
        display: 'flex',
        gap: '0.5rem',
    },
    couponInput: {
        flex: 1,
        border: '1.5px solid var(--border)',
        borderRadius: '8px',
        padding: '0.6rem 0.75rem',
        fontSize: '0.875rem',
        fontWeight: 600,
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-main)',
        fontFamily: "'Inter', monospace",
        letterSpacing: '1px',
        textTransform: 'uppercase',
        outline: 'none',
    },
    couponApplyBtn: {
        backgroundColor: 'var(--primary)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '0.6rem 1.25rem',
        fontSize: '0.8rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
    },
    appliedCouponBadge: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(16,185,129,0.06)',
        border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: '10px',
        padding: '0.6rem 0.75rem',
    },
    removeCouponBtn: {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-muted)',
        padding: '0.25rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
    },
    payButton: {
        width: '100%',
        padding: '0.9rem',
        fontSize: '1rem',
        fontWeight: 700,
        color: 'white',
        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        boxShadow: '0 4px 14px rgba(139,92,246,0.4)',
        transition: 'all 0.3s ease',
        letterSpacing: '0.3px',
    },
    termsText: {
        textAlign: 'center',
        fontSize: '0.7rem',
        color: 'var(--text-muted)',
        marginTop: '1rem',
        lineHeight: 1.5,
    },

    // ─── Summary Sidebar ───
    summarySection: {
        position: 'sticky',
        top: '1.5rem',
    },
    summaryCard: {
        backgroundColor: 'var(--bg-card)',
        borderRadius: '16px',
        padding: '1.75rem',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    },
    planHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        padding: '0.75rem',
        backgroundColor: 'var(--bg-main)',
        borderRadius: '12px',
    },
    divider: {
        height: '1px',
        backgroundColor: 'var(--border)',
        margin: '1rem 0',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.9rem',
    },
    securitySection: {
        display: 'flex',
        justifyContent: 'center',
        gap: '1.25rem',
        marginTop: '1.25rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border)',
    },
    securityItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        fontSize: '0.7rem',
        color: 'var(--text-muted)',
    },

    // ─── Success / Processing Overlay ───
    successOverlay: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-main)',
        padding: '1rem',
    },
    successCard: {
        backgroundColor: 'var(--bg-card)',
        borderRadius: '20px',
        padding: '2.5rem',
        textAlign: 'center',
        maxWidth: '420px',
        width: '100%',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
        animation: 'pgFadeInUp 0.5s ease-out',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    successCheckWrapper: {
        position: 'relative',
    },
    successCircle: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #10B981, #059669)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'pgSuccessPop 0.6s ease-out, pgSuccessRipple 1.5s ease-out',
    },
    progressBar: {
        width: '100%',
        height: '3px',
        backgroundColor: 'var(--border)',
        borderRadius: '10px',
        marginTop: '1rem',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(90deg, var(--primary), var(--success))',
        borderRadius: '10px',
        animation: 'pgProgressFill 3.5s ease-out forwards',
    },
};

export default PaymentGateway;
