import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PostList from './pages/PostList';
import PostForm from './pages/PostForm';
import PostView from './pages/PostView';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Navbar />
        <main className="container" style={{ padding: '2rem 1rem' }}>
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/posts/add" element={<PostForm />} />
            <Route path="/posts/edit/:id" element={<PostForm />} />
            <Route path="/posts/view/:id" element={<PostView />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;
