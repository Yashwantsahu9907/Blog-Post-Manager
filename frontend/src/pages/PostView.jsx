import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Trash2, Calendar, User, Mail, Tag, Folder } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPost, deletePost } from '../api/postService';
import { AuthContext } from '../context/AuthContext';

const PostView = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await getPost(id);
                setPost(data);
            } catch (error) {
                toast.error('Post not found');
                navigate('/posts');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePost(id);
                toast.success('Post deleted successfully');
                navigate('/posts');
            } catch (error) {
                toast.error('Failed to delete post');
            }
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading post details...</div>;
    }

    if (!post) return null;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '3rem' }}>
            <Link to="/posts" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                <ArrowLeft size={16} /> Back to Posts
            </Link>

            <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2rem' }}>
                <img 
                    src={post.thumbnailUrl} 
                    alt={post.title} 
                    style={{ width: '100%', height: '350px', objectFit: 'cover', backgroundColor: 'var(--secondary-color)' }}
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22900%22%20height%3D%22350%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20900%20350%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3Avar(--font-family)%2C%20sans-serif%3Bfont-size%3A30pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1%22%3E%3Crect%20width%3D%22900%22%20height%3D%22350%22%20fill%3D%22%23eee%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22370%22%20y%3D%22185%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                    }}
                />
                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <span className={`badge badge-${post.status.toLowerCase()}`}>{post.status}</span>
                                <span className="badge" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>{post.category}</span>
                            </div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>{post.title}</h1>
                        </div>
                        {user && (user.role === 'Admin' || user._id === post.user) && (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Link to={`/posts/edit/${post._id}`} className="btn btn-secondary">
                                    <Edit size={16} /> Edit
                                </Link>
                                <button onClick={handleDelete} className="btn btn-danger">
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <User size={16} /> {post.authorName}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <Mail size={16} /> {post.email}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <Calendar size={16} /> {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
                        </div>
                        {post.tags && post.tags.length > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                <Tag size={16} /> {post.tags.join(', ')}
                            </div>
                        )}
                    </div>

                    <div style={{ fontSize: '1.125rem', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '1.5rem', fontStyle: 'italic', borderLeft: '4px solid var(--primary-color)', paddingLeft: '1rem' }}>
                        {post.shortDescription}
                    </div>

                    <div style={{ color: 'var(--text-primary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                        {post.content}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostView;
