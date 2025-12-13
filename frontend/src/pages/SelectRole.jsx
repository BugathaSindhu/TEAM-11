import { Link } from 'react-router-dom';
import '../styles/Auth.css';

const SelectRole = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Select Your Role</h2>
        <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
          Choose how you want to contribute to FEEDILINK
        </p>
        <div className="role-grid">
          <Link to="/register?role=donor" className="role-card">
            <h3>Donor</h3>
            <p>Donate surplus food and reduce waste</p>
          </Link>
          <Link to="/register?role=volunteer" className="role-card">
            <h3>Volunteer</h3>
            <p>Pick up and deliver donations</p>
          </Link>
          <Link to="/register?role=ngo" className="role-card">
            <h3>NGO</h3>
            <p>Receive and distribute donations</p>
          </Link>
        </div>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default SelectRole;

