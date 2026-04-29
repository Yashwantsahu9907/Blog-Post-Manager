import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserProfile, updateUserProfile, uploadProfileImage } from '../api/authService';
import { getUserPosts, deletePost } from '../api/postService';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { User, Mail, Calendar, Edit3, Camera, FileText, Trash2, Edit } from 'lucide-react';
import './UserProfile.css';

const UserProfile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Edit mode states
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', email: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfileAndPosts = async () => {
            setLoading(true);
            try {
                const profileData = await getUserProfile();
                setProfile(profileData);
                setEditData({ name: profileData.name, email: profileData.email });
                setImagePreview(profileData.profileImage);

                const postsData = await getUserPosts();
                setPosts(postsData);
            } catch (error) {
                toast.error('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };
        fetchProfileAndPosts();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            let imageUrl = profile.profileImage;
            
            // Upload new image if selected
            if (imageFile) {
                toast.loading('Uploading image...', { id: 'upload-toast' });
                imageUrl = await uploadProfileImage(imageFile);
                toast.success('Image uploaded', { id: 'upload-toast' });
            }

            const updatedData = {
                name: editData.name,
                email: editData.email,
                profileImage: imageUrl
            };

            const newProfile = await updateUserProfile(updatedData);
            setProfile(newProfile);
            setUser({ ...user, ...newProfile }); // Update global auth context
            setIsEditing(false);
            setImageFile(null);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleDeletePost = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePost(id);
                setPosts(posts.filter(post => post._id !== id));
                toast.success('Post deleted');
            } catch (error) {
                toast.error('Failed to delete post');
            }
        }
    };

    if (loading) {
        return <div className="loading-container">Loading profile...</div>;
    }

    if (!profile) {
        return <div className="loading-container">Profile not found.</div>;
    }

    return (
        <div className="profile-container animate-fade-in">
            <div className="profile-header">
                <h1 className="page-title">My Profile</h1>
            </div>

            <div className="profile-content">
                {/* Profile Details Card */}
                <div className="card profile-card">
                    {isEditing ? (
                        <form onSubmit={handleSaveProfile} className="profile-form">
                            <div className="profile-image-section">
                                <div className="profile-image-wrapper editable">
                                    <img 
                                        src={imagePreview || 'https://via.placeholder.com/150?text=No+Image'} 
                                        alt="Profile Preview" 
                                        className="profile-image" 
                                    />
                                    <label htmlFor="imageUpload" className="image-upload-label">
                                        <Camera size={20} />
                                    </label>
                                    <input 
                                        type="file" 
                                        id="imageUpload" 
                                        accept="image/*" 
                                        onChange={handleImageChange} 
                                        style={{ display: 'none' }} 
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Name</label>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    value={editData.name}
                                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input 
                                    type="email" 
                                    className="form-control"
                                    value={editData.email}
                                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="profile-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => {
                                    setIsEditing(false);
                                    setImagePreview(profile.profileImage);
                                    setImageFile(null);
                                    setEditData({ name: profile.name, email: profile.email });
                                }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-view">
                            <div className="profile-image-section">
                                <div className="profile-image-wrapper">
                                    <img 
                                        src={profile.profileImage || 'https://via.placeholder.com/150?text=No+Image'} 
                                        alt="Profile" 
                                        className="profile-image" 
                                    />
                                </div>
                                <button className="btn btn-outline" onClick={() => setIsEditing(true)}>
                                    <Edit3 size={16} style={{ marginRight: '8px' }} /> Edit Profile
                                </button>
                            </div>

                            <div className="profile-details">
                                <div className="detail-item">
                                    <User className="detail-icon" />
                                    <div>
                                        <p className="detail-label">Name</p>
                                        <p className="detail-value">{profile.name}</p>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <Mail className="detail-icon" />
                                    <div>
                                        <p className="detail-label">Email</p>
                                        <p className="detail-value">{profile.email}</p>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <Calendar className="detail-icon" />
                                    <div>
                                        <p className="detail-label">Joined</p>
                                        <p className="detail-value">
                                            {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <Calendar className="detail-icon" style={{ color: '#94a3b8' }} />
                                    <div>
                                        <p className="detail-label">Last Updated</p>
                                        <p className="detail-value" style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                            {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Author's Posts Section */}
                <div className="profile-posts-section">
                    <div className="section-header">
                        <h2><FileText size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Posts by this Author</h2>
                        <Link to="/posts/add" className="btn btn-primary btn-sm">Create New</Link>
                    </div>

                    {posts.length === 0 ? (
                        <div className="empty-state">
                            <p>You haven't published any posts yet.</p>
                            <Link to="/posts/add" className="btn btn-outline" style={{ marginTop: '1rem' }}>Write your first post</Link>
                        </div>
                    ) : (
                        <div className="author-posts-grid">
                            {posts.map(post => (
                                <div key={post._id} className="author-post-card card">
                                    <div className="post-card-header">
                                        <h3 className="post-title">{post.title}</h3>
                                        <div className="post-meta">
                                            <span className={`status-badge status-${post.status.toLowerCase()}`}>{post.status}</span>
                                            <span className={`status-badge status-${(post.approvalStatus || 'pending').toLowerCase()}`}>{post.approvalStatus || 'Pending'}</span>
                                        </div>
                                    </div>
                                    <div className="post-card-body">
                                        <p>{post.shortDescription}</p>
                                        <div className="post-date">{new Date(post.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className="post-card-actions">
                                        <Link to={`/posts/view/${post._id}`} className="btn-icon view"><FileText size={16} /> View</Link>
                                        <Link to={`/posts/edit/${post._id}`} className="btn-icon edit"><Edit size={16} /> Edit</Link>
                                        <button onClick={() => handleDeletePost(post._id)} className="btn-icon delete"><Trash2 size={16} /> Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
