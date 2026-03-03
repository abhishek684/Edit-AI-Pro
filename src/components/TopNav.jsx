import React, { useEffect, useState } from 'react';
import { Moon, Sun, LogOut, Menu } from 'lucide-react';
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
            <div></div> {/* Placeholder for potential left-aligned items on desktop */}

            <div className="profile-menu">
                <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <div className="flex-between" style={{ gap: '0.75rem' }}>
                    <div className="avatar">
                        {userProfile?.profilePhoto ? (
                            <img src={userProfile.profilePhoto} alt={displayName} />
                        ) : (
                            initial
                        )}
                    </div>
                    <span style={{ fontWeight: 500 }}>{displayName}</span>
                </div>

                <button
                    onClick={handleLogout}
                    className="btn-outline"
                    style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none' }}
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
};

export default TopNav;
