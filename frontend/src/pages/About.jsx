import { Link } from 'react-router-dom';
import '../styles/Landing.css';

const About = () => {
  return (
    <div className="landing">
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo">FEEDILINK</Link>
          <div className="nav-links">
            <Link to="/about">About</Link>
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/impact">Impact</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
          </div>
        </div>
      </nav>

      <main className="hero" style={{ padding: '60px 0' }}>
        <div className="container">
          <h2>About FEEDILINK</h2>
          <p style={{ maxWidth: '800px', margin: '0 auto' }}>
            FEEDILINK is a platform dedicated to reducing food waste by connecting food donors 
            with volunteers who can deliver surplus food to NGOs and those in need.
          </p>
        </div>
      </main>

      <section className="features">
        <div className="container">
          <div className="feature-grid">
            <div className="feature-card">
              <h4>Our Mission</h4>
              <p>To eliminate food waste and ensure no one goes hungry by creating a seamless connection between donors, volunteers, and NGOs.</p>
            </div>
            <div className="feature-card">
              <h4>Our Vision</h4>
              <p>A world where surplus food reaches those who need it most, creating a sustainable and compassionate food distribution network.</p>
            </div>
            <div className="feature-card">
              <h4>Our Values</h4>
              <p>Transparency, efficiency, and compassion drive everything we do. We believe in making a real impact in our communities.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

