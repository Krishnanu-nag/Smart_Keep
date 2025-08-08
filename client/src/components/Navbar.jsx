import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            Smart Keep
          </Link>
        </div>
        
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/about" className="navbar-link">About Us</Link>
          <Link to="/register" className="navbar-link get-started">Get Started</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;