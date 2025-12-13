import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getVolunteerDonations } from '../services/donationService';
import { logout, getCurrentUser } from '../services/authService';
import '../styles/Dashboard.css';

const VolunteerHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await getVolunteerDonations();
      setDonations(response.donations || []);
    } catch (err) {
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="container">
          <h1>FEEDILINK - Delivery History</h1>
          <div className="nav-actions">
            <span>Welcome, {user?.name}</span>
            <Link to="/volunteer/dashboard" className="btn-secondary">Dashboard</Link>
            <Link to="/volunteer/tasks" className="btn-secondary">Tasks</Link>
            <Link to="/volunteer/profile" className="btn-secondary">Profile</Link>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
          </div>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="container">
          <h2>My Delivery History</h2>
          {loading ? (
            <p>Loading...</p>
          ) : donations.length === 0 ? (
            <div className="empty-state">
              <p>No delivery history yet.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Food Name</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Donor</th>
                  <th>Status</th>
                  <th>Completed Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id}>
                    <td>{donation.food_name}</td>
                    <td>{donation.food_type}</td>
                    <td>{donation.quantity}</td>
                    <td>{donation.donor_name}</td>
                    <td>
                      <span className={`badge badge-${donation.status}`}>
                        {donation.status}
                      </span>
                    </td>
                    <td>{new Date(donation.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default VolunteerHistory;

