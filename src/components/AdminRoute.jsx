import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const AdminRoute = ({ children }) => {
    const { currentUser, userProfile, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={40} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    if (!currentUser || userProfile?.role !== 'admin') {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default AdminRoute;
