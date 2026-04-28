import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Download, Eye, Edit, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { getPosts, deletePost, exportPosts } from '../api/postService';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = await getPosts({ page, limit: 10, search: debouncedSearch, category, status });
            setPosts(data.posts);
            setTotalPages(data.totalPages);
        } catch (error) {
            toast.error('Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [page, debouncedSearch, category, status]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePost(id);
                toast.success('Post deleted successfully');
                fetchPosts();
            } catch (error) {
                toast.error('Failed to delete post');
            }
        }
    };

    const handleExport = async () => {
        try {
            const data = await exportPosts({ search: debouncedSearch, category, status });
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'posts.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error('Failed to export posts');
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="page-title">Blog Post Manager</h1>
                    <p className="page-subtitle">Manage all your blog posts in one place.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" onClick={handleExport}>
                        <Download size={16} /> Export CSV
                    </button>
                    <Link to="/posts/add" className="btn btn-primary">
                        <Plus size={16} /> Add Post
                    </Link>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 250px', position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input 
                        type="text" 
                        placeholder="Search posts..." 
                        className="form-control" 
                        style={{ paddingLeft: '2.5rem' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div style={{ flex: '1 1 200px' }}>
                    <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">All Categories</option>
                        <option value="Technology">Technology</option>
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="Business">Business</option>
                        <option value="Travel">Travel</option>
                    </select>
                </div>
                <div style={{ flex: '1 1 200px' }}>
                    <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">All Statuses</option>
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                        <option value="Archived">Archived</option>
                    </select>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: 'var(--secondary-color)' }}>
                        <tr>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Title</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Author</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Category</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Status</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Date</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr>
                        ) : posts.length === 0 ? (
                            <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No posts found.</td></tr>
                        ) : (
                            posts.map(post => (
                                <tr key={post._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{post.title}</div>
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{post.authorName}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{post.category}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className={`badge badge-${post.status.toLowerCase()}`}>{post.status}</span>
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                        {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <Link to={`/posts/view/${post._id}`} className="btn btn-secondary" style={{ padding: '0.375rem' }}>
                                                <Eye size={16} />
                                            </Link>
                                            <Link to={`/posts/edit/${post._id}`} className="btn btn-secondary" style={{ padding: '0.375rem' }}>
                                                <Edit size={16} />
                                            </Link>
                                            <button onClick={() => handleDelete(post._id)} className="btn btn-danger" style={{ padding: '0.375rem' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                
                {!loading && totalPages > 1 && (
                    <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Page {page} of {totalPages}
                        </span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                                className="btn btn-secondary" 
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                            >
                                Previous
                            </button>
                            <button 
                                className="btn btn-secondary" 
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostList;
