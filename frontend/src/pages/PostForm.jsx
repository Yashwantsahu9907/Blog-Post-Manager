import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getPost, createPost, updatePost } from '../api/postService';

const PostForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            status: 'Draft',
            tags: ''
        }
    });

    useEffect(() => {
        if (isEditMode) {
            const fetchPost = async () => {
                try {
                    const data = await getPost(id);
                    Object.keys(data).forEach(key => {
                        if (key === 'tags' && Array.isArray(data[key])) {
                            setValue(key, data[key].join(', '));
                        } else {
                            setValue(key, data[key]);
                        }
                    });
                } catch (error) {
                    toast.error('Failed to fetch post details');
                    navigate('/posts');
                }
            };
            fetchPost();
        }
    }, [id, isEditMode, setValue, navigate]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const payload = { ...data };
            if (payload.tags) {
                payload.tags = payload.tags.split(',').map(tag => tag.trim()).filter(Boolean);
            } else {
                payload.tags = [];
            }

            if (isEditMode) {
                await updatePost(id, payload);
                toast.success('Post updated successfully');
            } else {
                await createPost(payload);
                toast.success('Post created successfully');
            }
            navigate('/posts');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="page-header">
                <h1 className="page-title">{isEditMode ? 'Edit Post' : 'Create New Post'}</h1>
                <p className="page-subtitle">Fill in the details below to {isEditMode ? 'update the' : 'create a new'} blog post.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Basic Information</h2>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Enter post title"
                            {...register('title', { required: 'Title is required' })} 
                        />
                        {errors.title && <span className="form-error">{errors.title.message}</span>}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div className="form-group" style={{ flex: '1 1 300px' }}>
                            <label className="form-label">Author Name</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Enter author name"
                                {...register('authorName', { required: 'Author name is required' })} 
                            />
                            {errors.authorName && <span className="form-error">{errors.authorName.message}</span>}
                        </div>
                        <div className="form-group" style={{ flex: '1 1 300px' }}>
                            <label className="form-label">Email</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                placeholder="Enter author email"
                                {...register('email', { 
                                    required: 'Email is required',
                                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                                })} 
                            />
                            {errors.email && <span className="form-error">{errors.email.message}</span>}
                        </div>
                    </div>
                </div>

                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Classification</h2>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div className="form-group" style={{ flex: '1 1 200px' }}>
                            <label className="form-label">Category</label>
                            <select className="form-control" {...register('category', { required: 'Category is required' })}>
                                <option value="">Select a category</option>
                                <option value="Technology">Technology</option>
                                <option value="Lifestyle">Lifestyle</option>
                                <option value="Business">Business</option>
                                <option value="Travel">Travel</option>
                            </select>
                            {errors.category && <span className="form-error">{errors.category.message}</span>}
                        </div>
                        <div className="form-group" style={{ flex: '1 1 200px' }}>
                            <label className="form-label">Status</label>
                            <select className="form-control" {...register('status')}>
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                                <option value="Archived">Archived</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Tags (comma separated)</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="e.g. react, nodejs, web dev"
                            {...register('tags')} 
                        />
                    </div>
                </div>

                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Media</h2>
                    <div className="form-group">
                        <label className="form-label">Thumbnail URL</label>
                        <input 
                            type="url" 
                            className="form-control" 
                            placeholder="https://example.com/image.jpg"
                            {...register('thumbnailUrl', { 
                                required: 'Thumbnail URL is required',
                                pattern: { value: /^https?:\/\/.+/, message: 'Must be a valid URL' }
                            })} 
                        />
                        {errors.thumbnailUrl && <span className="form-error">{errors.thumbnailUrl.message}</span>}
                    </div>
                </div>

                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Content</h2>
                    <div className="form-group">
                        <label className="form-label">Short Description</label>
                        <textarea 
                            className="form-control" 
                            rows="3" 
                            placeholder="Brief summary of the post..."
                            {...register('shortDescription', { required: 'Short description is required' })} 
                        ></textarea>
                        {errors.shortDescription && <span className="form-error">{errors.shortDescription.message}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Full Content</label>
                        <textarea 
                            className="form-control" 
                            rows="10" 
                            placeholder="Write your post content here..."
                            {...register('content', { required: 'Content is required' })} 
                        ></textarea>
                        {errors.content && <span className="form-error">{errors.content.message}</span>}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginBottom: '3rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/posts')}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : isEditMode ? 'Update Post' : 'Publish Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostForm;
