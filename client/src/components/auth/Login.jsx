import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Auth.css';
import Navbar from '../Navbar';
import GoogleAuth from './GoogleAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_FRONTEND_URI}/api/login`,
                { email, password },
                { withCredentials: true }
            );

            setSuccess(res.data.message);

            // Store JWT token and user
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            // console.log('Login success:', res.data);

            // Redirect after storing
            navigate('/welcome');

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-container">
                <form className="auth-form" onSubmit={handleSubmit}>
                    <h2 className="auth-title">Login</h2>

                    <div className="auth-input-group">
                        <label htmlFor="email" className="auth-label">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="auth-input"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="password" className="auth-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="auth-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button type="submit" className="auth-button">
                        Login
                    </button>

                    <div className="auth-divider"><span>or</span></div>

                    <GoogleAuth />

                    <div className="auth-link">
                        Don’t have an account? <Link to="/register">Register</Link>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Login;
