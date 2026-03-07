import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2, X, Sparkles, Zap } from 'lucide-react';
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

// Payment method tabs
const PAYMENT_METHODS = [
    { id: 'card', label: 'Card', icon: '💳' },
    { id: 'upi', label: 'UPI / QR', icon: '📱' },
    { id: 'netbanking', label: 'Netbanking', icon: '🏦' },
    { id: 'wallet', label: 'Wallet', icon: '👛' },
    { id: 'emi', label: 'EMI', icon: '📅' },
];

const UPI_APPS = [
    { name: 'Google Pay', color: '#4285F4' },
    { name: 'PhonePe', color: '#5F259F' },
    { name: 'Paytm', color: '#00BAF2' },
    { name: 'BHIM', color: '#00838F' },
];

const BANKS = [
    'HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Bank of Baroda', 'PNB', 'Yes Bank'
];

const WALLETS = [
    { name: 'Paytm', color: '#00BAF2' },
    { name: 'PhonePe', color: '#5F259F' },
    { name: 'Amazon Pay', color: '#FF9900' },
    { name: 'Freecharge', color: '#7ED321' },
    { name: 'Mobikwik', color: '#3B7DD8' },
];

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
    const [upiId, setUpiId] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [selectedWallet, setSelectedWallet] = useState('');

    // UX state
    const [processing, setProcessing] = useState(false);
    const [activeMethod, setActiveMethod] = useState('card');
    const [cardBrand, setCardBrand] = useState(null);
    const [focusedField, setFocusedField] = useState(null);
    const [errors, setErrors] = useState({});
    const [step, setStep] = useState(1);
    const successTimerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (successTimerRef.current) clearTimeout(successTimerRef.current);
        };
    }, []);

    if (!plan) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1B1F3B' }}>
                <div style={{ textAlign: 'center', color: '#fff' }}>
                    <h2>Invalid Plan</h2>
                    <button onClick={() => navigate('/dashboard/pricing')} style={{ marginTop: '1rem', padding: '0.6rem 1.5rem', background: '#528FF0', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Back to Pricing</button>
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
        if (!code) { setCouponError('Please enter a coupon code'); return; }
        const coupon = COUPONS[code];
        if (!coupon) { setCouponError('Invalid coupon code'); return; }
        setAppliedCoupon({ code, ...coupon });
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError('');
    };

    // ─── Validation ───
    const validate = () => {
        const errs = {};
        if (appliedCoupon && appliedCoupon.discount === 100) return errs;

        if (activeMethod === 'card') {
            if (cardNumber.replace(/\s/g, '').length < 16) errs.cardNumber = 'Enter a valid 16-digit card number';
            if (!cardName.trim()) errs.cardName = 'Cardholder name is required';
            if (!/^\d{2}\/\d{2}$/.test(expiry)) errs.expiry = 'Enter valid expiry (MM/YY)';
            else {
                const [mm, yy] = expiry.split('/').map(Number);
                if (mm < 1 || mm > 12) errs.expiry = 'Invalid month';
                else if (yy < 26) errs.expiry = 'Card has expired';
            }
            if (cvv.length < 3) errs.cvv = 'Enter a valid CVV';
        } else if (activeMethod === 'upi') {
            if (!upiId.includes('@')) errs.upiId = 'Enter a valid UPI ID (e.g. name@upi)';
        } else if (activeMethod === 'netbanking') {
            if (!selectedBank) errs.bank = 'Please select a bank';
        } else if (activeMethod === 'wallet') {
            if (!selectedWallet) errs.wallet = 'Please select a wallet';
        }

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

        const targetPlan = appliedCoupon ? appliedCoupon.plan : planId;
        const targetPlanData = PLANS[targetPlan];

        try {
            await new Promise(r => setTimeout(r, 2500));
            await updateUserSubscription(currentUser.uid, targetPlan, targetPlanData.credits);
            await refreshUserProfile();
            setProcessing(false);
            setStep(3);
            successTimerRef.current = setTimeout(() => {
                navigate('/dashboard');
            }, 3500);
        } catch (err) {
            console.error('Payment error:', err);
            setProcessing(false);
            setStep(1);
            setErrors({ submit: 'Payment failed. Please try again.' });
        }
    };

    // ─── Computed Values ───
    const effectivePlan = appliedCoupon ? PLANS[appliedCoupon.plan] || plan : plan;
    const subtotal = effectivePlan.price;
    const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discount / 100) : 0;
    const total = Math.max(0, subtotal - discountAmount);

    const CardBrandBadge = ({ brand }) => {
        const s = { fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '3px', letterSpacing: '0.5px' };
        if (brand === 'visa') return <span style={{ ...s, backgroundColor: '#1A1F71', color: '#fff' }}>VISA</span>;
        if (brand === 'mastercard') return <span style={{ ...s, backgroundColor: '#EB001B', color: '#fff' }}>MC</span>;
        if (brand === 'amex') return <span style={{ ...s, backgroundColor: '#2E77BB', color: '#fff' }}>AMEX</span>;
        return null;
    };

    // ─── Success Screen ───
    if (step === 3) {
        return (
            <div style={rzp.overlay}>
                <div style={rzp.successModal}>
                    <div style={rzp.successCircle}>
                        <CheckCircle size={48} color="#fff" />
                    </div>
                    <h2 style={{ color: '#1B1F3B', fontSize: '1.4rem', fontWeight: 700, marginTop: '1.25rem' }}>Payment Successful!</h2>
                    <p style={{ color: '#6B7294', marginTop: '0.4rem', fontSize: '0.9rem' }}>
                        Your <strong>{effectivePlan.name}</strong> plan is now active.
                    </p>
                    {appliedCoupon && (
                        <div style={{ marginTop: '0.75rem', padding: '0.4rem 1rem', background: 'rgba(16,185,129,0.1)', borderRadius: '6px', color: '#10B981', fontWeight: 600, fontSize: '0.8rem' }}>
                            🎉 Coupon "{appliedCoupon.code}" applied — You paid ₹0!
                        </div>
                    )}
                    <p style={{ color: '#9CA3AF', fontSize: '0.75rem', marginTop: '1.25rem' }}>Redirecting to dashboard...</p>
                    <div style={{ width: '100%', height: '3px', background: '#E5E7EB', borderRadius: '10px', marginTop: '0.75rem', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'linear-gradient(90deg, #528FF0, #10B981)', borderRadius: '10px', animation: 'rzpProgressFill 3.5s ease-out forwards' }}></div>
                    </div>
                </div>
                <style>{`
                    @keyframes rzpSuccessPop { 0%{transform:scale(0);opacity:0} 50%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
                    @keyframes rzpProgressFill { 0%{width:0} 100%{width:100%} }
                `}</style>
            </div>
        );
    }

    // ─── Processing Screen ───
    if (step === 2) {
        return (
            <div style={rzp.overlay}>
                <div style={rzp.successModal}>
                    <Loader2 size={42} style={{ color: '#528FF0', animation: 'spin 1s linear infinite' }} />
                    <h2 style={{ color: '#1B1F3B', fontSize: '1.15rem', fontWeight: 600, marginTop: '1.25rem' }}>Processing Payment...</h2>
                    <p style={{ color: '#6B7294', marginTop: '0.4rem', fontSize: '0.8rem' }}>Please do not close or refresh this page.</p>
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%' }}>
                        <ProcessStep label="Verifying details" done={true} />
                        <ProcessStep label="Connecting to payment network" done={true} />
                        <ProcessStep label="Authorizing transaction" done={false} active={true} />
                        <ProcessStep label="Activating subscription" done={false} />
                    </div>
                </div>
            </div>
        );
    }

    // ─── Razorpay-style Checkout ───
    return (
        <div className="rzp-overlay" style={rzp.overlay}>
            <style>{`
                @keyframes rzpSlideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
                @keyframes spin { to{transform:rotate(360deg)} }
                .rzp-overlay { padding: 1rem; }
                .rzp-modal { animation: rzpSlideUp 0.4s ease-out; }
                .rzp-modal * { box-sizing: border-box; }
                .rzp-method-btn { transition: all 0.15s ease; }
                .rzp-method-btn:hover { background: rgba(82,143,240,0.08) !important; }
                .rzp-method-btn.active { background: rgba(82,143,240,0.12) !important; border-left-color: #528FF0 !important; }
                .rzp-input:focus { border-color: #528FF0 !important; box-shadow: 0 0 0 2px rgba(82,143,240,0.15) !important; }
                .rzp-pay-btn:hover { opacity: 0.92; }
                .rzp-pay-btn:active { transform: scale(0.98); }
                .rzp-bank-option:hover { background: #F0F4FF !important; }
                .rzp-wallet-option:hover { background: #F0F4FF !important; border-color: #528FF0 !important; }

                /* Desktop styles */
                @media (min-width: 641px) {
                    .rzp-modal { max-width: 720px !important; max-height: 88vh !important; }
                    .rzp-sidebar { width: 160px !important; }
                    .rzp-close-btn { top: -12px !important; right: -12px !important; }
                }

                /* Mobile styles */
                @media (max-width: 640px) {
                    .rzp-overlay { padding: 0 !important; }
                    .rzp-modal {
                        width: 100% !important;
                        max-width: 100% !important;
                        height: 100vh !important;
                        max-height: 100vh !important;
                        border-radius: 0 !important;
                        flex-direction: column !important;
                    }
                    .rzp-sidebar {
                        width: 100% !important;
                        flex-direction: row !important;
                        padding: 0 !important;
                        border-right: none !important;
                        border-bottom: 1px solid #E2E8F0 !important;
                        overflow-x: auto !important;
                        overflow-y: hidden !important;
                        min-height: 48px !important;
                        flex-shrink: 0 !important;
                        -webkit-overflow-scrolling: touch;
                    }
                    .rzp-sidebar-inner {
                        flex-direction: row !important;
                        gap: 0 !important;
                        width: max-content !important;
                        min-width: 100% !important;
                    }
                    .rzp-method-btn {
                        border-left: none !important;
                        border-bottom: 2px solid transparent !important;
                        padding: 0.65rem 1rem !important;
                        font-size: 0.75rem !important;
                        white-space: nowrap !important;
                        flex: 1 1 0 !important;
                        justify-content: center !important;
                        min-width: 0 !important;
                    }
                    .rzp-method-btn.active {
                        border-left: none !important;
                        border-bottom-color: #528FF0 !important;
                    }
                    .rzp-right-panel { flex: 1 !important; overflow-y: auto !important; }
                    .rzp-content { padding: 1rem !important; }
                    .rzp-header-inner { padding: 0.75rem 1rem !important; }
                    .rzp-close-btn { top: 8px !important; right: 8px !important; background: rgba(255,255,255,0.2) !important; border: none !important; color: #fff !important; }
                }
            `}</style>

            <div className="rzp-modal" style={rzp.modal}>
                {/* ─── Left Sidebar ─── */}
                <div className="rzp-sidebar" style={rzp.sidebar}>
                    <div className="rzp-sidebar-inner" style={rzp.sidebarInner}>
                        {PAYMENT_METHODS.map(m => (
                            <button
                                key={m.id}
                                className={`rzp-method-btn ${activeMethod === m.id ? 'active' : ''}`}
                                onClick={() => { setActiveMethod(m.id); setErrors({}); }}
                                style={{
                                    ...rzp.methodBtn,
                                    ...(activeMethod === m.id ? rzp.methodBtnActive : {}),
                                }}
                            >
                                <span style={{ fontSize: '1.1rem' }}>{m.icon}</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: activeMethod === m.id ? 600 : 400 }}>{m.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ─── Right Content ─── */}
                <div className="rzp-right-panel" style={rzp.right}>
                    {/* Header */}
                    <div style={rzp.header}>
                        <div className="rzp-header-inner" style={rzp.headerInner}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={rzp.merchantLogo}>
                                    <Sparkles size={18} color="#fff" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>EditAI Pro</div>
                                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{currentUser?.email || 'user@email.com'}</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>₹{total.toFixed(2)}</div>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>{effectivePlan.name} Plan</div>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="rzp-content" style={rzp.content}>
                        <form onSubmit={handleSubmit}>
                            {/* ─── Card Payment ─── */}
                            {activeMethod === 'card' && (
                                <div>
                                    <div style={rzp.sectionTitle}>Card Information</div>

                                    <div style={rzp.fieldGroup}>
                                        <label style={rzp.label}>Card Number</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                className="rzp-input"
                                                type="text"
                                                placeholder="1234 5678 9012 3456"
                                                value={cardNumber}
                                                onChange={handleCardNumberChange}
                                                onFocus={() => setFocusedField('cardNumber')}
                                                onBlur={() => setFocusedField(null)}
                                                style={rzp.input}
                                                maxLength={19}
                                                inputMode="numeric"
                                                disabled={appliedCoupon?.discount === 100}
                                            />
                                            {cardBrand && <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}><CardBrandBadge brand={cardBrand} /></div>}
                                        </div>
                                        {errors.cardNumber && <span style={rzp.fieldError}>{errors.cardNumber}</span>}
                                    </div>

                                    <div style={rzp.fieldGroup}>
                                        <label style={rzp.label}>Card Holder Name</label>
                                        <input
                                            className="rzp-input"
                                            type="text"
                                            placeholder="Name on card"
                                            value={cardName}
                                            onChange={(e) => setCardName(e.target.value)}
                                            onFocus={() => setFocusedField('cardName')}
                                            onBlur={() => setFocusedField(null)}
                                            style={rzp.input}
                                            disabled={appliedCoupon?.discount === 100}
                                        />
                                        {errors.cardName && <span style={rzp.fieldError}>{errors.cardName}</span>}
                                    </div>

                                    <div className="rzp-row" style={rzp.row}>
                                        <div style={{ ...rzp.fieldGroup, flex: 1 }}>
                                            <label style={rzp.label}>Expiry</label>
                                            <input
                                                className="rzp-input"
                                                type="text"
                                                placeholder="MM/YY"
                                                value={expiry}
                                                onChange={handleExpiryChange}
                                                style={rzp.input}
                                                maxLength={5}
                                                inputMode="numeric"
                                                disabled={appliedCoupon?.discount === 100}
                                            />
                                            {errors.expiry && <span style={rzp.fieldError}>{errors.expiry}</span>}
                                        </div>
                                        <div style={{ ...rzp.fieldGroup, flex: 1 }}>
                                            <label style={rzp.label}>CVV</label>
                                            <input
                                                className="rzp-input"
                                                type="password"
                                                placeholder="•••"
                                                value={cvv}
                                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                                style={rzp.input}
                                                maxLength={4}
                                                inputMode="numeric"
                                                disabled={appliedCoupon?.discount === 100}
                                            />
                                            {errors.cvv && <span style={rzp.fieldError}>{errors.cvv}</span>}
                                        </div>
                                    </div>

                                    {/* accepted cards */}
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>We accept</span>
                                        {['VISA', 'MC', 'AMEX', 'RuPay'].map(c => (
                                            <span key={c} style={{ fontSize: '0.6rem', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', border: '1px solid #E2E8F0', color: '#6B7294' }}>{c}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ─── UPI Payment ─── */}
                            {activeMethod === 'upi' && (
                                <div>
                                    <div style={rzp.sectionTitle}>Pay using UPI</div>

                                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                                        {UPI_APPS.map(app => (
                                            <div key={app.name} style={{
                                                padding: '0.6rem 1rem',
                                                borderRadius: '8px',
                                                border: '1px solid #E2E8F0',
                                                fontSize: '0.8rem',
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                background: '#fff',
                                            }}
                                                onClick={() => setUpiId(app.name.toLowerCase().replace(' ', '') + '@upi')}
                                            >
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: app.color }}></div>
                                                {app.name}
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ ...rzp.divider, margin: '1rem 0' }}>
                                        <span style={{ background: '#fff', padding: '0 0.75rem', color: '#9CA3AF', fontSize: '0.75rem' }}>Or enter UPI ID</span>
                                    </div>

                                    <div style={rzp.fieldGroup}>
                                        <label style={rzp.label}>UPI ID</label>
                                        <input
                                            className="rzp-input"
                                            type="text"
                                            placeholder="yourname@upi"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                            style={rzp.input}
                                        />
                                        {errors.upiId && <span style={rzp.fieldError}>{errors.upiId}</span>}
                                    </div>
                                </div>
                            )}

                            {/* ─── Net Banking ─── */}
                            {activeMethod === 'netbanking' && (
                                <div>
                                    <div style={rzp.sectionTitle}>Select your bank</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                        {BANKS.map(bank => (
                                            <div
                                                key={bank}
                                                className="rzp-bank-option"
                                                onClick={() => setSelectedBank(bank)}
                                                style={{
                                                    padding: '0.7rem 0.85rem',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    background: selectedBank === bank ? '#EEF2FF' : '#fff',
                                                    border: selectedBank === bank ? '1.5px solid #528FF0' : '1px solid #E2E8F0',
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                <div style={{
                                                    width: '16px', height: '16px', borderRadius: '50%',
                                                    border: selectedBank === bank ? '5px solid #528FF0' : '2px solid #CBD5E1',
                                                    boxSizing: 'border-box',
                                                }}></div>
                                                <span style={{ fontSize: '0.85rem', fontWeight: selectedBank === bank ? 600 : 400, color: '#1B1F3B' }}>{bank}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.bank && <span style={rzp.fieldError}>{errors.bank}</span>}
                                </div>
                            )}

                            {/* ─── Wallet ─── */}
                            {activeMethod === 'wallet' && (
                                <div>
                                    <div style={rzp.sectionTitle}>Select Wallet</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                        {WALLETS.map(w => (
                                            <div
                                                key={w.name}
                                                className="rzp-wallet-option"
                                                onClick={() => setSelectedWallet(w.name)}
                                                style={{
                                                    padding: '0.75rem 0.85rem',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    background: selectedWallet === w.name ? '#EEF2FF' : '#fff',
                                                    border: selectedWallet === w.name ? '1.5px solid #528FF0' : '1px solid #E2E8F0',
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: w.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>{w.name[0]}</span>
                                                </div>
                                                <span style={{ fontSize: '0.85rem', fontWeight: selectedWallet === w.name ? 600 : 400, color: '#1B1F3B' }}>{w.name}</span>
                                                {selectedWallet === w.name && <CheckCircle size={16} style={{ color: '#528FF0', marginLeft: 'auto' }} />}
                                            </div>
                                        ))}
                                    </div>
                                    {errors.wallet && <span style={rzp.fieldError}>{errors.wallet}</span>}
                                </div>
                            )}

                            {/* ─── EMI ─── */}
                            {activeMethod === 'emi' && (
                                <div>
                                    <div style={rzp.sectionTitle}>EMI Options</div>
                                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#9CA3AF', fontSize: '0.85rem' }}>
                                        <p>EMI is available on orders above ₹3,000</p>
                                        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>Your order total is ₹{total.toFixed(2)}</p>
                                    </div>
                                </div>
                            )}

                            {/* ─── Coupon Section ─── */}
                            <div style={rzp.couponSection}>
                                {appliedCoupon ? (
                                    <div style={rzp.appliedCoupon}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <CheckCircle size={14} style={{ color: '#10B981' }} />
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#10B981' }}>{appliedCoupon.label}</span>
                                        </div>
                                        <button type="button" onClick={removeCoupon} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#9CA3AF' }}>
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div style={rzp.couponRow}>
                                        <input
                                            className="rzp-input"
                                            type="text"
                                            placeholder="Have a coupon?"
                                            value={couponCode}
                                            onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                                            style={{ ...rzp.input, flex: 1 }}
                                        />
                                        <button type="button" onClick={handleApplyCoupon} style={rzp.couponBtn}>Apply</button>
                                    </div>
                                )}
                                {couponError && <span style={{ ...rzp.fieldError, marginTop: '0.4rem' }}>{couponError}</span>}
                            </div>

                            {/* ─── Error ─── */}
                            {errors.submit && (
                                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.6rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '0.75rem', textAlign: 'center' }}>
                                    {errors.submit}
                                </div>
                            )}

                            {/* ─── Pay Button ─── */}
                            <button className="rzp-pay-btn" type="submit" disabled={processing || (activeMethod === 'emi' && total < 3000)} style={rzp.payBtn}>
                                {processing ? (
                                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                ) : (
                                    `Pay ₹${total.toFixed(2)}`
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <div style={rzp.footer}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#528FF0" strokeWidth="2" fill="rgba(82,143,240,0.1)" /></svg>
                            <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Secured by</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <svg width="20" height="20" viewBox="0 0 512 512" fill="none">
                                <path d="M 462.1 197.3 L 340.4 197.3 C 323.7 197.3 310.8 208.8 310.9 226.9 C 310.9 226.9 310.9 286.3 310.9 286.3 C 310.9 301.5 323 315 340.4 315 L 462.1 315 C 479.5 315 491.6 301.5 491.6 286.3 L 491.6 226.9 C 491.6 208.8 478.8 197.3 462.1 197.3 Z M 418 275.3 C 407.2 275.3 398.4 266.5 398.4 255.7 C 398.4 244.9 407.2 236.1 418 236.1 C 428.8 236.1 437.6 244.9 437.6 255.7 C 437.6 266.5 428.8 275.3 418 275.3 Z" fill="#3395FF" />
                                <path d="M 163.4 197 L 20.4 197 L 20.4 315 L 163.4 315 C 181 315 196.7 301.2 196.7 283.4 L 196.7 228.6 C 196.7 210.8 181 197 163.4 197 Z M 149 275.3 C 138.2 275.3 129.4 266.5 129.4 255.7 C 129.4 244.9 138.2 236.1 149 236.1 C 159.8 236.1 168.6 244.9 168.6 255.7 C 168.6 266.5 159.8 275.3 149 275.3 Z" fill="#072654" />
                            </svg>
                            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#072654', letterSpacing: '-0.3px' }}>Razorpay</span>
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={() => navigate('/dashboard/pricing')}
                    style={rzp.closeBtn}
                    title="Close"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

// ─── Processing Step Sub-component ───
const ProcessStep = ({ label, done, active }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', opacity: done || active ? 1 : 0.35 }}>
        {done ? (
            <CheckCircle size={16} style={{ color: '#10B981' }} />
        ) : active ? (
            <Loader2 size={16} style={{ color: '#528FF0', animation: 'spin 1s linear infinite' }} />
        ) : (
            <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #E2E8F0' }}></div>
        )}
        <span style={{ fontSize: '0.8rem', fontWeight: done ? 500 : 400, color: done ? '#10B981' : '#1B1F3B' }}>{label}</span>
    </div>
);


// ─── Razorpay-style Styles ───
const rzp = {
    overlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: '1rem',
    },
    modal: {
        width: '100%',
        maxWidth: '720px',
        maxHeight: '88vh',
        background: '#fff',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        position: 'relative',
    },
    sidebar: {
        width: '160px',
        background: '#F8FAFC',
        borderRight: '1px solid #E2E8F0',
        padding: '0.75rem 0',
        flexShrink: 0,
        overflowY: 'auto',
    },
    sidebarInner: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
    },
    methodBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.8rem 1rem',
        border: 'none',
        borderLeft: '3px solid transparent',
        background: 'transparent',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        color: '#4B5563',
        fontSize: '0.85rem',
    },
    methodBtnActive: {
        background: 'rgba(82,143,240,0.08)',
        borderLeftColor: '#528FF0',
        color: '#528FF0',
        fontWeight: 600,
    },
    right: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        overflowY: 'auto',
    },
    header: {
        background: 'linear-gradient(135deg, #1B1F3B 0%, #2A3158 100%)',
        flexShrink: 0,
    },
    headerInner: {
        padding: '1rem 1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    merchantLogo: {
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #528FF0, #8B5CF6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        padding: '1.5rem',
        overflowY: 'auto',
    },
    sectionTitle: {
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#1B1F3B',
        marginBottom: '1rem',
    },
    fieldGroup: {
        marginBottom: '0.85rem',
    },
    label: {
        display: 'block',
        fontSize: '0.72rem',
        fontWeight: 500,
        color: '#6B7294',
        marginBottom: '0.3rem',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
    },
    input: {
        width: '100%',
        padding: '0.7rem 0.85rem',
        border: '1.5px solid #E2E8F0',
        borderRadius: '6px',
        fontSize: '0.9rem',
        color: '#1B1F3B',
        outline: 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        boxSizing: 'border-box',
        background: '#fff',
    },
    row: {
        display: 'flex',
        gap: '0.75rem',
    },
    fieldError: {
        color: '#DC2626',
        fontSize: '0.7rem',
        marginTop: '0.25rem',
        display: 'block',
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        gap: '0',
        borderTop: '1px solid #E2E8F0',
        justifyContent: 'center',
        position: 'relative',
    },
    couponSection: {
        margin: '1rem 0',
        padding: '0.75rem',
        background: '#F8FAFC',
        borderRadius: '8px',
        border: '1px dashed #E2E8F0',
    },
    couponRow: {
        display: 'flex',
        gap: '0.5rem',
    },
    couponBtn: {
        padding: '0.6rem 1rem',
        background: '#528FF0',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '0.8rem',
        fontWeight: 600,
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'opacity 0.15s',
    },
    appliedCoupon: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.1rem 0',
    },
    payBtn: {
        width: '100%',
        padding: '0.9rem',
        background: '#528FF0',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.15s',
        letterSpacing: '0.2px',
    },
    footer: {
        padding: '0.6rem 1.25rem',
        borderTop: '1px solid #E2E8F0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#F8FAFC',
        flexShrink: 0,
    },
    closeBtn: {
        position: 'absolute',
        top: '-14px',
        right: '-14px',
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        background: '#fff',
        border: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        color: '#4B5563',
        zIndex: 10,
    },
    successModal: {
        background: '#fff',
        borderRadius: '12px',
        padding: '2.5rem',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    successCircle: {
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #10B981, #059669)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'rzpSuccessPop 0.5s ease-out',
    },
};

export default PaymentGateway;
