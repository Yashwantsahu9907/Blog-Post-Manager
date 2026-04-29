import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
  };

  return (
    <nav style={{ backgroundColor: 'var(--white)', borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
          <BookOpen size={24} />
          BlogManager
        </Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/posts" style={{ fontWeight: location.pathname === '/posts' || location.pathname === '/' ? '600' : '400', color: location.pathname === '/posts' || location.pathname === '/' ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
            Posts
          </Link>
          {user ? (
            <>
                <Link to="/posts/add" style={{ fontWeight: location.pathname === '/posts/add' ? '600' : '400', color: location.pathname === '/posts/add' ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
                  Add Post
                </Link>
                {user.role === 'Admin' && (
                  <Link to="/admin" style={{ fontWeight: location.pathname.startsWith('/admin') ? '600' : '400', color: location.pathname.startsWith('/admin') ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
                    Admin Panel
                  </Link>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <User size={16} /> {user.name}
                    </span>
                    <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </>
          ) : (
            <>
                <Link to="/login" style={{ fontWeight: location.pathname === '/login' ? '600' : '400', color: location.pathname === '/login' ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
                  Sign Up
                </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
