import { Link } from 'react-router-dom';
import '../styles/Landing.css';

const HowItWorks = () => {
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
          <h2>How FEEDILINK Works</h2>
        </div>
      </main>

      <section className="features">
        <div className="container">
          <div className="feature-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="feature-card" style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
              <h4>Step 1: Donors Post Donations</h4>
              <p>Food donors create a donation listing with details about the food, quantity, pickup location, and expiry time.</p>
            </div>
            <div className="feature-card" style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
              <h4>Step 2: Volunteers Assign</h4>
              <p>Volunteers browse available donations and assign themselves to pick up and deliver the food.</p>
            </div>
            <div className="feature-card" style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
              <h4>Step 3: Pickup & Delivery</h4>
              <p>Volunteers pick up the donation from the donor's location and deliver it to the assigned NGO or recipient.</p>
            </div>
            <div className="feature-card" style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
              <h4>Step 4: Distribution</h4>
              <p>NGOs receive the delivered donations and distribute them to those in need within their community.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;

