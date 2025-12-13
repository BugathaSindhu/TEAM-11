import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAdminReports } from '../services/adminService';
import { logout, getCurrentUser } from '../services/authService';
import '../styles/Dashboard.css';

const AdminReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const response = await getAdminReports();
      setReports(response);
    } catch (err) {
      console.error('Error loading reports:', err);
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
          <h1>FEEDILINK - Reports</h1>
          <div className="nav-actions">
            <span>Welcome, {user?.name}</span>
            <Link to="/admin/dashboard" className="btn-secondary">Dashboard</Link>
            <Link to="/admin/users" className="btn-secondary">Users</Link>
            <Link to="/admin/donations" className="btn-secondary">Donations</Link>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
          </div>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="container">
          <h2>System Reports</h2>
          {loading ? (
            <p>Loading...</p>
          ) : reports ? (
            <div className="feature-grid" style={{ marginTop: '20px' }}>
              <div className="feature-card">
                <h4>Total Users</h4>
                <p style={{ fontSize: '36px', color: '#4CAF50', margin: '10px 0' }}>{reports.total_users || 0}</p>
              </div>
              <div className="feature-card">
                <h4>Total Donations</h4>
                <p style={{ fontSize: '36px', color: '#4CAF50', margin: '10px 0' }}>{reports.total_donations || 0}</p>
              </div>
              <div className="feature-card">
                <h4>Pending Donations</h4>
                <p style={{ fontSize: '36px', color: '#4CAF50', margin: '10px 0' }}>{reports.pending_donations || 0}</p>
              </div>
              <div className="feature-card">
                <h4>Delivered Donations</h4>
                <p style={{ fontSize: '36px', color: '#4CAF50', margin: '10px 0' }}>{reports.delivered_donations || 0}</p>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p>No reports available.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminReports;

