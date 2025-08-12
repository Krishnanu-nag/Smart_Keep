import Navbar from '../components/Navbar';
import '../styles/About.css';

const About = () => {
  return (
    <>
      <Navbar />
      <div className="about-container">
        <section className="about-hero">
          <h1>About Smart Keep</h1>
          <p className="hero-subtitle">A smarter way for students to learn, collaborate, and grow</p>
        </section>

        <section className="about-content">
          <div className="about-card">
            <h2>Our Story</h2>
            <p>
              Student Connect was created with a simple vision — to give students a dedicated space 
              to track their academic progress, share updates, and collaborate on projects. 
              Starting as a small campus initiative, it quickly evolved into a platform helping 
              students stay connected and motivated across universities and institutions.
            </p>
          </div>

          <div className="about-card">
            <h2>Our Mission</h2>
            <p>
              We aim to make learning and progress tracking simple, engaging, and social. 
              By combining goal-setting tools, task management, and real-time chat, 
              we help students stay accountable, exchange knowledge, and work together efficiently.
            </p>
          </div>

          <div className="about-values">
            <h2>Our Values</h2>
            <div className="values-grid">
              <div className="value-item">
                <div className="value-icon">📚</div>
                <h3>Academic Growth</h3>
                <p>Every feature is designed to support continuous learning and skill development.</p>
              </div>
              <div className="value-item">
                <div className="value-icon">🤝</div>
                <h3>Collaboration</h3>
                <p>We believe that shared knowledge and teamwork drive better results.</p>
              </div>
              <div className="value-item">
                <div className="value-icon">🔒</div>
                <h3>Privacy & Security</h3>
                <p>Student data is always protected with strong privacy measures.</p>
              </div>
            </div>
          </div>

          <div className="about-team">
            <h2>Meet The Team</h2>
            <div className="team-grid">
              <div className="team-member">
                <div className="member-avatar">👩‍🎓</div>
                <h3>Krishnanu Nag</h3>
                <p>Founder & Platform Architect</p>
              </div>
              <div className="team-member">
                <div className="member-avatar">👨‍💻</div>
                <h3>Krishnanu Nag</h3>
                <p>Lead Developer</p>
              </div>
              <div className="team-member">
                <div className="member-avatar">👩‍💻</div>
                <h3>Krishnanu Nag</h3>
                <p>UI/UX Designer</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
