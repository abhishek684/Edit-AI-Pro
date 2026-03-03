import React, { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Shield, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { resetPassword, deleteUserAccount, logoutUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [notifications, setNotifications] = useState(localStorage.getItem('notifications') === 'false' ? false : true);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleThemeToggle = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleNotificationsToggle = () => {
        const newVal = !notifications;
        setNotifications(newVal);
        localStorage.setItem('notifications', newVal);
        setMessage(newVal ? 'Notifications enabled' : 'Notifications disabled');
        setTimeout(() => setMessage(''), 3000);
    };

    const handleResetPassword = async () => {
        if (!currentUser?.email) return;
        try {
            await resetPassword(currentUser.email);
            setMessage('Password reset email sent! Please check your inbox.');
            setError('');
        } catch {
            setError('Failed to send reset email. Try again later.');
            setMessage('');
        }
        setTimeout(() => { setMessage(''); setError(''); }, 5000);
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you ABSOLUTELY sure you want to delete your account? This action cannot be undone.')) {
            try {
                await deleteUserAccount();
                await logoutUser();
                navigate('/login');
            } catch {
                setError('Failed to delete account. You may need to log out and log back in to verify your identity before deleting.');
            }
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Account Settings</h1>

            {message && <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid var(--success)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>{message}</div>}
            {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}

            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    Appearance
                </h2>

                <div className="flex-between" style={{ padding: '0.75rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {theme === 'dark' ? <Moon size={20} style={{ color: 'var(--primary)' }} /> : <Sun size={20} style={{ color: 'var(--primary)' }} />}
                        <div>
                            <div style={{ fontWeight: 500 }}>Dark Mode</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Toggle dark/light theme</div>
                        </div>
                    </div>
                    <label className="switch">
                        <input type="checkbox" checked={theme === 'dark'} onChange={handleThemeToggle} />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    Notifications
                </h2>

                <div className="flex-between" style={{ padding: '0.75rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Bell size={20} style={{ color: 'var(--primary)' }} />
                        <div>
                            <div style={{ fontWeight: 500 }}>Email Notifications</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Receive updates and promotional emails</div>
                        </div>
                    </div>
                    <label className="switch">
                        <input type="checkbox" checked={notifications} onChange={handleNotificationsToggle} />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>

            <div className="card">
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    Security
                </h2>

                <div className="flex-between" style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Key size={20} style={{ color: 'var(--text-muted)' }} />
                        <div>
                            <div style={{ fontWeight: 500 }}>Password</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Last changed: Never</div>
                        </div>
                    </div>
                    <button className="btn-outline" onClick={handleResetPassword} style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
                        Change Password
                    </button>
                </div>

                <div className="flex-between" style={{ padding: '0.75rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Shield size={20} style={{ color: 'var(--error)' }} />
                        <div>
                            <div style={{ fontWeight: 500, color: 'var(--error)' }}>Danger Zone</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Permanently delete your account and all data</div>
                        </div>
                    </div>
                    <button className="btn-outline" onClick={handleDeleteAccount} style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem', color: 'var(--error)', borderColor: 'var(--error)' }}>
                        Delete Account
                    </button>
                </div>
            </div>

            <style>{`
                .switch {
                  position: relative;
                  display: inline-block;
                  width: 44px;
                  height: 24px;
                }
                .switch input { 
                  opacity: 0;
                  width: 0;
                  height: 0;
                }
                .slider {
                  position: absolute;
                  cursor: pointer;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background-color: var(--border);
                  transition: .4s;
                }
                .slider:before {
                  position: absolute;
                  content: "";
                  height: 18px;
                  width: 18px;
                  left: 3px;
                  bottom: 3px;
                  background-color: white;
                  transition: .4s;
                }
                input:checked + .slider {
                  background-color: var(--primary);
                }
                input:checked + .slider:before {
                  transform: translateX(20px);
                }
                .slider.round {
                  border-radius: 24px;
                }
                .slider.round:before {
                  border-radius: 50%;
                }
            `}</style>
        </div>
    );
};

export default Settings;
