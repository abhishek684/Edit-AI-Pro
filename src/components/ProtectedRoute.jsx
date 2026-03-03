import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { currentUser, userProfile, loading } = useAuth();

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    if (!loading && userProfile?.isBlocked) {
        // Technically, you might want to log them out here, but showing an error state is also fine
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)' }}>
                <h1 style={{ color: 'var(--error)', fontSize: '2rem', marginBottom: '1rem' }}>Account Suspended</h1>
                <p style={{ color: 'var(--text-muted)' }}>Your account has been blocked by an administrator.</p>
                <a href="/login" style={{ marginTop: '2rem', color: 'var(--primary)', textDecoration: 'underline' }}>Return to Login</a>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
