import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap, CreditCard, Clock, TrendingUp, Star, ArrowUpRight } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import ImageGallery from '../components/ImageGallery';

const Dashboard = () => {
    const { userProfile, currentUser } = useAuth();
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    if (!userProfile) {
        return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>Loading dashboard data...</div>;
    }

    const { credits, subscriptionPlan, createdAt } = userProfile;
    const joinDate = createdAt?.toDate ? createdAt.toDate().toLocaleDateString() : 'Recently';

    const handleUploadSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const statCards = [
        {
            title: 'Available Credits',
            value: subscriptionPlan === 'premium' ? 'Unlimited' : credits,
            subtitle: 'Use credits to generate content',
            icon: Zap,
            gradient: 'linear-gradient(135deg, #E84393, #F97316)',
            iconBg: 'rgba(232, 67, 147, 0.1)',
            iconColor: '#E84393',
            isWarning: credits === 0 && subscriptionPlan !== 'premium'
        },
        {
            title: 'Current Plan',
            value: subscriptionPlan,
            subtitle: 'Free tier includes 50 credits',
            icon: CreditCard,
            gradient: 'linear-gradient(135deg, #A855F7, #EC4899)',
            iconBg: 'rgba(168, 85, 247, 0.1)',
            iconColor: '#A855F7',
            capitalize: true
        },
        {
            title: 'Member Since',
            value: joinDate,
            subtitle: currentUser?.email,
            icon: Clock,
            gradient: 'linear-gradient(135deg, #F97316, #EAB308)',
            iconBg: 'rgba(249, 115, 22, 0.1)',
            iconColor: '#F97316',
            smallValue: true
        }
    ];

    return (
        <div>
            {/* Welcome Header */}
            <div style={styles.welcomeSection}>
                <div>
                    <h1 style={styles.welcomeTitle}>
                        Welcome back, <span style={styles.gradientName}>{userProfile.displayName || 'Creator'}</span> ✨
                    </h1>
                    <p style={styles.welcomeSubtitle}>Here's what's happening with your creative studio</p>
                </div>
            </div>

            {/* Stat Cards */}
            <div style={styles.statsGrid}>
                {statCards.map((card, i) => (
                    <div key={i} style={styles.statCard}>
                        <div style={styles.statCardInner}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <p style={styles.statLabel}>{card.title}</p>
                                    <p style={{
                                        ...styles.statValue,
                                        fontSize: card.smallValue ? '1.5rem' : '2.25rem',
                                        textTransform: card.capitalize ? 'capitalize' : 'none',
                                        color: card.isWarning ? 'var(--error)' : 'var(--text-main)'
                                    }}>
                                        {card.value}
                                    </p>
                                </div>
                                <div style={{ ...styles.statIconWrap, background: card.iconBg }}>
                                    <card.icon size={22} style={{ color: card.iconColor }} />
                                </div>
                            </div>
                            <p style={styles.statSubtitle}>{card.subtitle}</p>
                        </div>
                        {/* Gradient bottom bar */}
                        <div style={{ height: '3px', background: card.gradient, borderRadius: '0 0 16px 16px' }}></div>
                    </div>
                ))}
            </div>

            {/* Upload Section */}
            <ImageUpload onUploadSuccess={handleUploadSuccess} />

            {/* Gallery Section */}
            <ImageGallery refreshTrigger={refreshTrigger} />
        </div>
    );
};

const styles = {
    welcomeSection: {
        marginBottom: '2rem',
        padding: '1.5rem 0'
    },
    welcomeTitle: {
        fontSize: '1.75rem',
        fontWeight: '700',
        color: 'var(--text-main)',
        marginBottom: '0.5rem',
        letterSpacing: '-0.025em'
    },
    gradientName: {
        background: 'linear-gradient(135deg, #E84393, #F97316)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    welcomeSubtitle: {
        color: 'var(--text-muted)',
        fontSize: '0.95rem'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
    },
    statCard: {
        backgroundColor: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(232, 67, 147, 0.06)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    },
    statCardInner: {
        padding: '1.5rem'
    },
    statLabel: {
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        fontWeight: '500',
        marginBottom: '0.5rem'
    },
    statValue: {
        fontSize: '2.25rem',
        fontWeight: '700',
        lineHeight: '1.1',
        marginBottom: '0.75rem'
    },
    statIconWrap: {
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    statSubtitle: {
        color: 'var(--text-muted)',
        fontSize: '0.8rem'
    }
};

export default Dashboard;
