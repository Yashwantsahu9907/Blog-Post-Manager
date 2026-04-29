import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PostList from './pages/PostList';
import PostForm from './pages/PostForm';
import PostView from './pages/PostView';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPosts from './pages/admin/AdminPosts';
import AdminUsers from './pages/admin/AdminUsers';
import { AuthProvider } from './context/AuthContext';
import './index.css';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-wrapper">
      {!isAdminRoute && <Navbar />}
      <main className={!isAdminRoute ? "container" : ""} style={!isAdminRoute ? { padding: '2rem 1rem' } : {}}>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/posts" element={<PostList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/posts/add" element={
            <ProtectedRoute>
              <PostForm />
            </ProtectedRoute>
          } />
          <Route path="/posts/edit/:id" element={
            <ProtectedRoute>
              <PostForm />
            </ProtectedRoute>
          } />
          <Route path="/posts/view/:id" element={<PostView />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
