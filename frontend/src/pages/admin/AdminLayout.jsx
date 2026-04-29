import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, FileText, Users, LogOut, Globe } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2>Admin Panel</h2>
                </div>
                <nav className="admin-nav">
                    <NavLink to="/admin" end className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/admin/posts" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                        <FileText size={20} />
                        <span>Manage Posts</span>
                    </NavLink>
                    <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                        <Users size={20} />
                        <span>Manage Users</span>
                    </NavLink>
                </nav>
                <div className="admin-sidebar-footer">
                    <NavLink to="/" className="admin-nav-link">
                        <Globe size={20} />
                        <span>Back to Site</span>
                    </NavLink>
                    <button className="admin-logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
            <main className="admin-main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
