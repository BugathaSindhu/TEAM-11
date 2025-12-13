import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Landing.css';

const Impact = () => {
  const [stats, setStats] = useState({
    donations: 0,
    volunteers: 0,
    meals: 0,
    ngos: 0
  });

  useEffect(() => {
    // Animate counters
    const targets = { donations: 1250, volunteers: 340, meals: 5600, ngos: 45 };
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setStats({
        donations: Math.floor(targets.donations * progress),
        volunteers: Math.floor(targets.volunteers * progress),
        meals: Math.floor(targets.meals * progress),
        ngos: Math.floor(targets.ngos * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setStats(targets);
      }
    }, increment);

    return () => clearInterval(timer);
  }, []);

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
          <h2>Our Impact</h2>
          <p>Together, we're making a real difference in reducing food waste and fighting hunger.</p>
        </div>
      </main>

      <section className="features">
        <div className="container">
          <div className="feature-grid">
            <div className="feature-card">
              <h4 style={{ fontSize: '48px', color: '#4CAF50', marginBottom: '10px' }}>{stats.donations}+</h4>
              <p>Donations Made</p>
            </div>
            <div className="feature-card">
              <h4 style={{ fontSize: '48px', color: '#4CAF50', marginBottom: '10px' }}>{stats.volunteers}+</h4>
              <p>Active Volunteers</p>
            </div>
            <div className="feature-card">
              <h4 style={{ fontSize: '48px', color: '#4CAF50', marginBottom: '10px' }}>{stats.meals}+</h4>
              <p>Meals Delivered</p>
            </div>
            <div className="feature-card">
              <h4 style={{ fontSize: '48px', color: '#4CAF50', marginBottom: '10px' }}>{stats.ngos}+</h4>
              <p>Partner NGOs</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Impact;

