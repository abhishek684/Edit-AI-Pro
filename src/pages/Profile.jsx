import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, CreditCard, Zap, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { currentUser, userProfile } = useAuth();
    const navigate = useNavigate();

    // Format date securely
    const formatDate = (timestamp) => {
        if (!timestamp) return 'Unknown';
        // Handle Firestore Timestamps
        if (timestamp.toDate) {
            return timestamp.toDate().toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
        }
        // Handle native Dates or parsing strings if necessary
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const isPremium = userProfile?.subscriptionPlan === 'premium';

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Profile Overview</h1>

            {/* Profile Header Card */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', background: 'var(--bg-card)' }}>
                <div className="avatar" style={{ width: 80, height: 80, fontSize: '2rem' }}>
                    {userProfile?.profilePhoto ? (
                        <img src={userProfile.profilePhoto} alt="Profile" />
                    ) : (
                        userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'
                    )}
                </div>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {userProfile?.displayName || 'User'}
                        {isPremium && <Crown size={20} style={{ color: '#F59E0B' }} title="Premium Member" />}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <Mail size={16} /> {currentUser?.email}
                    </p>
                </div>
                <div>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isPremium ? 'rgba(245, 158, 11, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                        color: isPremium ? '#F59E0B' : 'var(--primary)',
                        fontWeight: 600,
                        textTransform: 'capitalize'
                    }}>
                        {isPremium ? <Crown size={16} /> : <User size={16} />}
                        {userProfile?.subscriptionPlan || 'Free'} Plan
                    </span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                {/* Account Details */}
                <div className="card">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Account Details</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="flex-between">
                            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <User size={16} /> User ID
                            </span>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{currentUser?.uid.slice(0, 8)}...</span>
                        </div>

                        <div className="flex-between">
                            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Calendar size={16} /> Member Since
                            </span>
                            <span style={{ fontWeight: 500 }}>{formatDate(userProfile?.createdAt)}</span>
                        </div>
                    </div>
                </div>

                {/* Usage & Plan */}
                <div className="card">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Usage & Billing</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="flex-between">
                            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Zap size={16} style={{ color: isPremium ? 'var(--text-muted)' : 'var(--primary)' }} /> Available Credits
                            </span>
                            <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>
                                {isPremium ? 'Unlimited' : (userProfile?.credits || 0)}
                            </span>
                        </div>

                        <div className="flex-between">
                            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CreditCard size={16} /> Subscription
                            </span>
                            <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>
                                {userProfile?.subscriptionPlan || 'Free'}
                            </span>
                        </div>

                        <button
                            className="btn-outline"
                            style={{ marginTop: '0.5rem', width: '100%', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                            onClick={() => navigate('/dashboard/pricing')}
                        >
                            Upgrade Plan
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
