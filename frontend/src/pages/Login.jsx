import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { loginUser } from '../api/authService';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const from = location.state?.from?.pathname || '/';

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const user = await loginUser(data);
            login(user);
            toast.success('Logged in successfully!');
            navigate(from, { replace: true });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <div className="card">
                <h1 className="page-title" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Log In</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                            {...register('password', { required: 'Password is required' })} 
                        />
                        {errors.password && <span className="form-error">{errors.password.message}</span>}
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--primary-color)', fontWeight: 500 }}>Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
