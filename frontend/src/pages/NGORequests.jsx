import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getNGORequests, createNGORequest } from '../services/ngoService';
import { logout, getCurrentUser } from '../services/authService';
import '../styles/Dashboard.css';
import '../styles/Auth.css';

const NGORequests = () => {
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    food_type: '',
    quantity: '',
    urgency: 'medium',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await getNGORequests();
      setRequests(response.requests || []);
    } catch (err) {
      console.error('Error loading requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await createNGORequest(formData);
      setSuccess('Food request created successfully!');
      setFormData({ food_type: '', quantity: '', urgency: 'medium', notes: '' });
      loadRequests();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create request');
    } finally {
      setSubmitting(false);
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
          <h1>FEEDILINK - Food Requests</h1>
          <div className="nav-actions">
            <span>Welcome, {user?.name}</span>
            <Link to="/ngo/dashboard" className="btn-secondary">Dashboard</Link>
            <Link to="/ngo/history" className="btn-secondary">History</Link>
            <Link to="/ngo/profile" className="btn-secondary">Profile</Link>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
          </div>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
            <div>
              <h2>Create Food Request</h2>
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
              <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div className="form-group">
                  <label>Food Type</label>
                  <input
                    type="text"
                    value={formData.food_type}
                    onChange={(e) => setFormData({ ...formData, food_type: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="text"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Urgency</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows="3"
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Create Request'}
                </button>
              </form>
            </div>
            <div>
              <h2>My Requests</h2>
              {loading ? (
                <p>Loading...</p>
              ) : requests.length === 0 ? (
                <div className="empty-state">
                  <p>No requests yet.</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Food Type</th>
                      <th>Quantity</th>
                      <th>Urgency</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id}>
                        <td>{req.food_type}</td>
                        <td>{req.quantity}</td>
                        <td>
                          <span className={`badge badge-${req.urgency}`}>{req.urgency}</span>
                        </td>
                        <td>
                          <span className={`badge badge-${req.status}`}>{req.status}</span>
                        </td>
                        <td>{new Date(req.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NGORequests;

