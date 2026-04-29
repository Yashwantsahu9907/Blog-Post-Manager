import React, { useEffect, useState } from 'react';
import { getAdminPosts, updatePostApproval } from '../../api/adminService';
import { deletePost } from '../../api/postService';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AdminPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ search: '', status: '', approvalStatus: '', category: '' });

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await getAdminPosts(filter);
            setPosts(data.posts);
        } catch (error) {
            toast.error('Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchPosts();
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [filter]);

    const handleApproval = async (id, status) => {
        try {
            await updatePostApproval(id, status);
            toast.success(`Post ${status.toLowerCase()} successfully`);
            fetchPosts();
        } catch (error) {
            toast.error('Failed to update approval status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            try {
                await deletePost(id);
                toast.success('Post deleted successfully');
                fetchPosts();
            } catch (error) {
                toast.error('Failed to delete post');
            }
        }
    };

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-title">Manage Posts</h1>
            </div>

            <div className="filter-bar">
                <input 
                    type="text" 
                    name="search" 
                    placeholder="Search posts..." 
                    value={filter.search}
                    onChange={handleFilterChange}
                    style={{ flex: 1 }}
                />
                <select name="status" value={filter.status} onChange={handleFilterChange}>
                    <option value="">All Publish Status</option>
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                </select>
                <select name="category" value={filter.category} onChange={handleFilterChange}>
                    <option value="">All Categories</option>
                    <option value="Technology">Technology</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Travel">Travel</option>
                    <option value="Food">Food</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                </select>
                <select name="approvalStatus" value={filter.approvalStatus} onChange={handleFilterChange}>
                    <option value="">All Approval Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            <div className="admin-table-container">
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading posts...</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Publish Status</th>
                                <th>Approval Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(post => (
                                <tr key={post._id}>
                                    <td>
                                        <Link to={`/posts/view/${post._id}`} style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '500' }}>
                                            {post.title}
                                        </Link>
                                    </td>
                                    <td>{post.user ? post.user.name : post.authorName}</td>
                                    <td>{post.category}</td>
                                    <td>
                                        <span className={`status-badge status-${post.status.toLowerCase()}`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${post.approvalStatus ? post.approvalStatus.toLowerCase() : 'pending'}`}>
                                            {post.approvalStatus || 'Pending'}
                                        </span>
                                    </td>
                                    <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        {post.approvalStatus !== 'Approved' && (
                                            <button className="action-btn btn-approve" onClick={() => handleApproval(post._id, 'Approved')}>Approve</button>
                                        )}
                                        {post.approvalStatus !== 'Rejected' && (
                                            <button className="action-btn btn-reject" onClick={() => handleApproval(post._id, 'Rejected')}>Reject</button>
                                        )}
                                        <Link to={`/posts/edit/${post._id}`} className="action-btn btn-edit" style={{ textDecoration: 'none', display: 'inline-block' }}>Edit</Link>
                                        <button className="action-btn btn-delete" onClick={() => handleDelete(post._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {posts.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center' }}>No posts found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminPosts;
