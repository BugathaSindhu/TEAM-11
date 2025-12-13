import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getVolunteerTasks } from '../services/volunteerService';
import { logout, getCurrentUser } from '../services/authService';
import '../styles/Dashboard.css';

const VolunteerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await getVolunteerTasks();
      setTasks(response.tasks || []);
    } catch (err) {
      console.error('Error loading tasks:', err);
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
          <h1>FEEDILINK - My Tasks</h1>
          <div className="nav-actions">
            <span>Welcome, {user?.name}</span>
            <Link to="/volunteer/dashboard" className="btn-secondary">Dashboard</Link>
            <Link to="/volunteer/history" className="btn-secondary">History</Link>
            <Link to="/volunteer/profile" className="btn-secondary">Profile</Link>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
          </div>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="container">
          <h2>My Assigned Tasks</h2>
          {loading ? (
            <p>Loading...</p>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks assigned yet.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task ID</th>
                  <th>Donation ID</th>
                  <th>Status</th>
                  <th>Assigned Date</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.donation_id}</td>
                    <td>
                      <span className={`badge badge-${task.status}`}>{task.status}</span>
                    </td>
                    <td>{new Date(task.created_at).toLocaleDateString()}</td>
                    <td>{task.notes || 'N/A'}</td>
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

export default VolunteerTasks;

