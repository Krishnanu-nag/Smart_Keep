import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Auth.css';
import Navbar from '../Navbar';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your registration logic here
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        console.log('Registration submitted', { name, email, password });
    };

    const handleGoogleRegister = () => {
        // Add your Google registration logic here
        console.log('Register with Google');
    };

    return (
        <>
         <Navbar />
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2 className="auth-title">Register</h2>
                
                <div className="auth-input-group">
                    <input
                        type="text"
                        className="auth-input"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                
                <div className="auth-input-group">
                    <input
                        type="email"
                        className="auth-input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                
                <div className="auth-input-group">
                    <input
                        type="password"
                        className="auth-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                <div className="auth-input-group">
                    <input
                        type="password"
                        className="auth-input"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <button type="submit" className="auth-button">
                    Register
                </button>
                
                <div className="auth-divider">or</div>
                
                <button type="button" className="google-auth-button" onClick={handleGoogleRegister}>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
        
                        className="google-icon"
                    />
                    Continue with Google
                </button>
                
                <div className="auth-link">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </form>
        </div>
      </>
    
    );
};

export default Register;