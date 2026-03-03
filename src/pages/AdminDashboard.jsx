import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Zap, ShieldAlert, Check, X, ShieldBan } from 'lucide-react';
import { getAllUsers, updateUserCredits, toggleUserBlock } from '../services/authService';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [creditInput, setCreditInput] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const fetchedUsers = await getAllUsers();
            setUsers(fetchedUsers);
            setError('');
        } catch (err) {
            console.error(err);
            setError('Failed to fetch users. Make sure you have admin privileges.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEditCredits = (user) => {
        setEditingUser(user.id);
        setCreditInput(user.credits?.toString() || '0');
    };

    const handleSaveCredits = async (uid) => {
        try {
            const newAmount = parseInt(creditInput, 10);
            if (isNaN(newAmount) || newAmount < 0) {
                alert("Please enter a valid positive number.");
                return;
            }
            await updateUserCredits(uid, newAmount);
            setEditingUser(null);
            fetchUsers(); // Refresh the list
        } catch {
            alert("Failed to update credits.");
        }
    };

    const handleToggleBlock = async (uid, currentStatus) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'unblock' : 'block'} this user?`)) return;
        try {
            await toggleUserBlock(uid, currentStatus);
            fetchUsers();
        } catch {
            alert("Failed to change block status.");
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', padding: '2rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <button
                    className="btn-outline"
                    onClick={() => navigate('/dashboard')}
                    style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <ArrowLeft size={16} /> Exit Admin Panel
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                    <ShieldAlert size={32} style={{ color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Admin Dashboard</h1>
                </div>

                {error && <div className="error-message" style={{ marginBottom: '2rem' }}>{error}</div>}

                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-card)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Users size={20} /> User Management ({users.length})
                        </h2>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>User</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Joined</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Plan</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Credits</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading users...</td>
                                    </tr>
                                ) : users.map(user => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid var(--border)', opacity: user.isBlocked ? 0.6 : 1 }}>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div className="avatar" style={{ width: 36, height: 36 }}>
                                                    {user.displayName?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        {user.displayName || 'Unnamed User'}
                                                        {user.role === 'admin' && <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '4px' }}>ADMIN</span>}
                                                        {user.isBlocked && <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', backgroundColor: 'var(--error)', color: 'white', borderRadius: '4px' }}>BLOCKED</span>}
                                                    </div>
                                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                            {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'Unknown'}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{user.subscriptionPlan || 'free'}</span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            {editingUser === user.id ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <input
                                                        type="number"
                                                        className="input"
                                                        value={creditInput}
                                                        onChange={(e) => setCreditInput(e.target.value)}
                                                        style={{ width: '80px', padding: '0.25rem 0.5rem' }}
                                                    />
                                                    <button onClick={() => handleSaveCredits(user.id)} style={{ color: 'var(--success)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}><Check size={18} /></button>
                                                    <button onClick={() => setEditingUser(null)} style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}><X size={18} /></button>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Zap size={16} style={{ color: user.subscriptionPlan === 'premium' ? 'var(--text-muted)' : 'var(--primary)' }} />
                                                    <span style={{ fontWeight: 600 }}>{user.subscriptionPlan === 'premium' ? 'Unlimited' : (user.credits || 0)}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                <button
                                                    className="btn-outline"
                                                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                                                    onClick={() => handleEditCredits(user)}
                                                    disabled={user.subscriptionPlan === 'premium'}
                                                >
                                                    Edit Credits
                                                </button>
                                                <button
                                                    className="btn-outline"
                                                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', color: user.isBlocked ? 'var(--success)' : 'var(--error)', borderColor: user.isBlocked ? 'var(--success)' : 'var(--error)' }}
                                                    onClick={() => handleToggleBlock(user.id, user.isBlocked)}
                                                    disabled={user.role === 'admin'} // Prevent blocking other admins easily
                                                >
                                                    <ShieldBan size={14} style={{ marginRight: '0.25rem' }} />
                                                    {user.isBlocked ? 'Unblock' : 'Block'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {users.length === 0 && !loading && !error && (
                            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No users found.</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
