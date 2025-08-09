import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Auth.css';
import Navbar from '../Navbar';
import GoogleAuth from './GoogleAuth';





const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your login logic here
        console.log('Login submitted', { email, password });
    };

  

    return (
        <>
         <Navbar />
        <div className="auth-container">
    
            
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2 className="auth-title">Login</h2>
                
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
                
                {error && <div className="error-message">{error}</div>}
                
                <button type="submit" className="auth-button">
                    Login
                </button>
                
                <div className="auth-divider">or</div>
    

                <GoogleAuth />
                
                <div className="auth-link">
                    Don't have an account? <Link to="/register">Register</Link>
                </div>
            </form>

        </div>
      </>
       
    );
};

export default Login;