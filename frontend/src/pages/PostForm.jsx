import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { getPost, createPost, updatePost, uploadPostImage } from '../api/postService';
import { AuthContext } from '../context/AuthContext';

const PostForm = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            status: 'Draft',
            tags: '',
            authorName: user?.name || '',
            email: user?.email || '',
            content: '',
        }
    });

    const quillContent = watch('content');

    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                try {
                    toast.loading('Uploading image...', { id: 'quill-upload' });
                    const imageUrl = await uploadPostImage(file);
                    
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection();
                    quill.insertEmbed(range.index, 'image', imageUrl);
                    
                    toast.success('Image uploaded', { id: 'quill-upload' });
                } catch (error) {
                    toast.error('Failed to upload image', { id: 'quill-upload' });
                }
            }
        };
    };

    const handleQuillChange = (content) => {
        setValue('content', content === '<p><br></p>' ? '' : content);
    };

    const quillModules = React.useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                ['link', 'image', 'code-block'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), []);

    const quillFormats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'indent',
        'link', 'image', 'code-block'
    ];

    useEffect(() => {
        register('content', { required: 'Content is required' });
    }, [register]);

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
                    if (data.thumbnailUrl) {
                        setImagePreview(data.thumbnailUrl);
                    }
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

    const handleThumbnailChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Upload
            try {
                setUploadingImage(true);
                const imageUrl = await uploadPostImage(file); // Reusing existing upload service
                setValue('thumbnailUrl', imageUrl);
                toast.success('Thumbnail uploaded successfully');
            } catch (error) {
                toast.error('Failed to upload thumbnail');
                setImagePreview(null);
            } finally {
                setUploadingImage(false);
            }
        }
    };

    const quillRef = React.useRef(null);

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
                        <label className="form-label">Thumbnail Image</label>
                        <div style={{ marginBottom: '1rem' }}>
                            {imagePreview ? (
                                <div style={{ position: 'relative', width: '100%', maxWidth: '300px', height: '200px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    {uploadingImage && (
                                        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Uploading...</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{ width: '100%', maxWidth: '300px', height: '200px', borderRadius: '8px', border: '2px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', color: 'var(--text-secondary)' }}>
                                    No image selected
                                </div>
                            )}
                        </div>
                        <input 
                            type="file" 
                            accept="image/*"
                            className="form-control" 
                            onChange={handleThumbnailChange}
                            disabled={uploadingImage}
                        />
                        <input type="hidden" {...register('thumbnailUrl', { required: 'Thumbnail is required' })} />
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
                        <div style={{ backgroundColor: 'white', minHeight: '300px' }}>
                            <ReactQuill 
                                ref={quillRef}
                                theme="snow"
                                value={quillContent || ''}
                                onChange={handleQuillChange}
                                modules={quillModules}
                                formats={quillFormats}
                                placeholder="Write your post content here..."
                                style={{ height: '350px', marginBottom: '45px' }}
                            />
                        </div>
                        {errors.content && <span className="form-error" style={{ display: 'block', marginTop: '10px' }}>{errors.content.message}</span>}
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
