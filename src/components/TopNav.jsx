import React, { useEffect, useState } from 'react';
import { Moon, Sun, LogOut, Menu, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const TopNav = ({ onToggleSidebar }) => {
    const { userProfile, currentUser } = useAuth();
    const navigate = useNavigate();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleLogout = async () => {
        await logoutUser();
        navigate('/login');
    };

    const displayName = userProfile?.displayName || currentUser?.email?.split('@')[0] || 'User';
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <header className="topbar">
            <button onClick={onToggleSidebar} className="hamburger-btn" aria-label="Toggle menu">
                <Menu size={24} />
            </button>

            {/* Credits Badge */}
            <div style={styles.creditsBadge}>
                <Sparkles size={14} style={{ color: '#E84393' }} />
                <span>{userProfile?.subscriptionPlan === 'premium' ? '∞' : userProfile?.credits || 0} credits</span>
            </div>

            <div className="profile-menu">
                <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <div className="flex-between" style={{ gap: '0.75rem' }}>
                    <div style={styles.avatar}>
                        {userProfile?.profilePhoto ? (
                            <img src={userProfile.profilePhoto} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            initial
                        )}
                    </div>
                    <span style={{ fontWeight: 500 }}>{displayName}</span>
                </div>

                <button
                    onClick={handleLogout}
                    style={styles.logoutBtn}
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
};

const styles = {
    creditsBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        background: 'linear-gradient(135deg, rgba(232,67,147,0.08), rgba(249,115,22,0.08))',
        border: '1px solid rgba(232,67,147,0.12)',
        padding: '0.35rem 0.85rem',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600',
        color: '#E84393'
    },
    avatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #E84393, #F97316)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        fontSize: '0.85rem',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(232, 67, 147, 0.3)'
    },
    logoutBtn: {
        padding: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        border: 'none',
        background: 'transparent',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        borderRadius: '8px',
        transition: 'color 0.2s'
    }
};

export default TopNav;
