import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { registerUser } from '../api/authService';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const user = await registerUser(data);
            login(user);
            toast.success('Account created successfully!');
            navigate('/posts');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to sign up');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <div className="card">
                <h1 className="page-title" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Sign Up</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            {...register('name', { required: 'Name is required' })} 
                        />
                        {errors.name && <span className="form-error">{errors.name.message}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            {...register('email', { 
                                required: 'Email is required',
                                pattern: { value: /^\S+@\S+\.\S+$/i, message: 'Invalid email address' }
                            })} 
                        />
                        {errors.email && <span className="form-error">{errors.email.message}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            {...register('password', { 
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' }
                            })} 
                        />
                        {errors.password && <span className="form-error">{errors.password.message}</span>}
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 500 }}>Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
