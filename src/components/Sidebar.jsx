import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Settings, User, Zap } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="avatar" style={{ width: 28, height: 28, fontSize: '0.8rem' }}>AI</div>
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
        </aside>
    );
};

export default Sidebar;
