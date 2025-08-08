import Navbar from '../components/Navbar';
import '../styles/About.css';

const About = () => {
  return (
    <>
    <Navbar />
    <div className="about-container">
      <section className="about-hero">
        <h1>About Smart Keep</h1>
        <p className="hero-subtitle">Your intelligent solution for digital organization</p>
      </section>

      <section className="about-content">
        <div className="about-card">
          <h2>Our Story</h2>
          <p>
            Founded in 2023, Smart Keep began as a simple idea to help people organize their digital lives.
            Today, we've grown into a platform trusted by thousands worldwide to securely store, organize,
            and manage their important information.
          </p>
        </div>

        <div className="about-card">
          <h2>Our Mission</h2>
          <p>
            We believe in creating tools that adapt to your life, not the other way around. Smart Keep
            combines powerful organization features with intuitive design to help you focus on what
            really matters.
          </p>
        </div>

        <div className="about-values">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">🔒</div>
              <h3>Security First</h3>
              <p>Your data's safety is our top priority with end-to-end encryption.</p>
            </div>
            <div className="value-item">
              <div className="value-icon">🧠</div>
              <h3>Smart Organization</h3>
              <p>AI-powered suggestions to keep your digital life perfectly organized.</p>
            </div>
            <div className="value-item">
              <div className="value-icon">❤️</div>
              <h3>User Focused</h3>
              <p>Designed based on real user feedback and needs.</p>
            </div>
          </div>
        </div>

        <div className="about-team">
          <h2>Meet The Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">👩💻</div>
              <h3>Sarah Chen</h3>
              <p>CEO & Founder</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👨💻</div>
              <h3>David Park</h3>
              <p>CTO</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👩💻</div>
              <h3>Maria Gonzalez</h3>
              <p>Lead Designer</p>
            </div>
          </div>
        </div>
      </section>


    </div>
    </>
  );
};

export default About;