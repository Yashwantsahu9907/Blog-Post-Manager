import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav style={{ backgroundColor: 'var(--white)', borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
          <BookOpen size={24} />
          BlogManager
        </Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/posts" style={{ fontWeight: location.pathname === '/posts' || location.pathname === '/' ? '600' : '400', color: location.pathname === '/posts' || location.pathname === '/' ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
            Posts
          </Link>
          <Link to="/posts/add" style={{ fontWeight: location.pathname === '/posts/add' ? '600' : '400', color: location.pathname === '/posts/add' ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
            Add Post
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
