import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Settings, User, Zap, Sparkles } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div style={styles.logoIcon}>
                    <Sparkles size={18} style={{ color: '#fff' }} />
                </div>
                <span>EditAI Pro</span>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} end onClick={onClose}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/dashboard/profile" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={onClose}>
                    <User size={20} />
                    <span>Profile</span>
                </NavLink>
                <NavLink to="/dashboard/pricing" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={onClose}>
                    <Zap size={20} />
                    <span>Pricing</span>
                </NavLink>
                <NavLink to="/dashboard/settings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={onClose}>
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>
            </nav>

            {/* Bottom decorative gradient */}
            <div style={styles.sidebarFooter}>
                <div style={styles.proCard}>
                    <div style={styles.proCardInner}>
                        <Sparkles size={16} style={{ color: '#F97316' }} />
                        <span style={styles.proText}>Upgrade to Pro</span>
                    </div>
                    <p style={styles.proSubtext}>Unlock all AI features</p>
                </div>
            </div>
        </aside>
    );
};

const styles = {
    logoIcon: {
        width: '30px',
        height: '30px',
        background: 'linear-gradient(135deg, #E84393, #F97316)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(232, 67, 147, 0.3)'
    },
    sidebarFooter: {
        padding: '1rem',
        borderTop: '1px solid var(--border)'
    },
    proCard: {
        background: 'linear-gradient(135deg, rgba(232,67,147,0.08), rgba(249,115,22,0.08))',
        borderRadius: '12px',
        padding: '1rem',
        border: '1px solid rgba(232,67,147,0.12)'
    },
    proCardInner: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.25rem'
    },
    proText: {
        fontWeight: '600',
        fontSize: '0.85rem',
        background: 'linear-gradient(135deg, #E84393, #F97316)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    proSubtext: {
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        marginLeft: '1.5rem'
    }
};

export default Sidebar;
