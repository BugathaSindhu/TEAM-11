import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllUsers } from '../services/adminService';
import { logout, getCurrentUser } from '../services/authService';
import '../styles/Dashboard.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.users || []);
    } catch (err) {
      console.error('Error loading users:', err);
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
          <h1>FEEDILINK - Manage Users</h1>
          <div className="nav-actions">
            <span>Welcome, {user?.name}</span>
            <Link to="/admin/dashboard" className="btn-secondary">Dashboard</Link>
            <Link to="/admin/donations" className="btn-secondary">Donations</Link>
            <Link to="/admin/reports" className="btn-secondary">Reports</Link>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
          </div>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="container">
          <h2>All Users</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge badge-${u.role}`}>{u.role}</span>
                    </td>
                    <td>{u.phone || 'N/A'}</td>
                    <td>{u.address || 'N/A'}</td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
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

export default AdminUsers;

