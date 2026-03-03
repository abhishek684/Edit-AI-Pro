import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap, CreditCard, Clock } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import ImageGallery from '../components/ImageGallery';

const Dashboard = () => {
    const { userProfile, currentUser } = useAuth();
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    if (!userProfile) {
        return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>Loading dashboard data...</div>;
    }

    const { credits, subscriptionPlan, createdAt } = userProfile;
    const joinDate = createdAt?.toDate ? createdAt.toDate().toLocaleDateString() : 'Recently';

    const handleUploadSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '2rem' }}>Overview</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="flex-between">
                        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Available Credits</h3>
                        <Zap size={20} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div style={{ fontSize: '2.25rem', fontWeight: 700, color: (credits === 0 && subscriptionPlan !== 'premium') ? 'var(--error)' : 'inherit' }}>
                        {subscriptionPlan === 'premium' ? 'Unlimited' : credits}
                    </div>
                    <p className="text-sm text-muted">Use credits to generate content</p>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="flex-between">
                        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Current Plan</h3>
                        <CreditCard size={20} style={{ color: 'var(--success)' }} />
                    </div>
                    <div style={{ fontSize: '2.25rem', fontWeight: 700, textTransform: 'capitalize' }}>
                        {subscriptionPlan}
                    </div>
                    <p className="text-sm text-muted">Free tier includes 700 credits</p>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="flex-between">
                        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Member Since</h3>
                        <Clock size={20} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                        {joinDate}
                    </div>
                    <p className="text-sm text-muted">{currentUser?.email}</p>
                </div>
            </div>

            <ImageUpload onUploadSuccess={handleUploadSuccess} />
            <ImageGallery refreshTrigger={refreshTrigger} />

        </div>
    );
};

export default Dashboard;
