import React, { useEffect, useState } from 'react';
import { getDashboardMetrics } from '../../api/adminService';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await getDashboardMetrics();
                setMetrics(data);
            } catch (error) {
                toast.error('Failed to load dashboard metrics');
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;
    if (!metrics) return null;

    const chartData = [
        { name: 'Total Posts', count: metrics.totalPosts },
        { name: 'Published', count: metrics.publishedPosts },
        { name: 'Drafts', count: metrics.draftPosts }
    ];

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-title">Dashboard Overview</h1>
            </div>

            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-icon" style={{ backgroundColor: '#3b82f6' }}>
                        <Users size={24} />
                    </div>
                    <div className="metric-content">
                        <h3>Total Users</h3>
                        <p>{metrics.totalUsers}</p>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-icon" style={{ backgroundColor: '#8b5cf6' }}>
                        <FileText size={24} />
                    </div>
                    <div className="metric-content">
                        <h3>Total Posts</h3>
                        <p>{metrics.totalPosts}</p>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-icon" style={{ backgroundColor: '#10b981' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div className="metric-content">
                        <h3>Published Posts</h3>
                        <p>{metrics.publishedPosts}</p>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-icon" style={{ backgroundColor: '#f59e0b' }}>
                        <Clock size={24} />
                    </div>
                    <div className="metric-content">
                        <h3>Draft Posts</h3>
                        <p>{metrics.draftPosts}</p>
                    </div>
                </div>
            </div>

            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#0f172a' }}>Post Statistics</h3>
                <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: '#f1f5f9' }} />
                            <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="admin-table-container">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: 0, color: '#0f172a' }}>Recent Posts</h3>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Status</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {metrics.recentActivity.map(post => (
                            <tr key={post._id}>
                                <td>{post.title}</td>
                                <td>{post.user ? post.user.name : post.authorName}</td>
                                <td>
                                    <span className={`status-badge status-${post.status.toLowerCase()}`}>
                                        {post.status}
                                    </span>
                                </td>
                                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {metrics.recentActivity.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>No recent activity</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
