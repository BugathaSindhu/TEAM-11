import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllDonations } from '../services/adminService';
import { logout, getCurrentUser } from '../services/authService';
import '../styles/Dashboard.css';

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      const response = await getAllDonations();
      setDonations(response.donations || []);
    } catch (err) {
      console.error('Error loading donations:', err);
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
          <h1>FEEDILINK - Manage Donations</h1>
          <div className="nav-actions">
            <span>Welcome, {user?.name}</span>
            <Link to="/admin/dashboard" className="btn-secondary">Dashboard</Link>
            <Link to="/admin/users" className="btn-secondary">Users</Link>
            <Link to="/admin/reports" className="btn-secondary">Reports</Link>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
          </div>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="container">
          <h2>All Donations</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Food Name</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Donor</th>
                  <th>Volunteer</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.food_name}</td>
                    <td>{d.food_type}</td>
                    <td>{d.quantity}</td>
                    <td>{d.donor_name || 'N/A'}</td>
                    <td>{d.volunteer_name || 'N/A'}</td>
                    <td>
                      <span className={`badge badge-${d.status}`}>{d.status}</span>
                    </td>
                    <td>{new Date(d.created_at).toLocaleDateString()}</td>
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

export default AdminDonations;

