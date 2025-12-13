import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getRewards, getUserRewards, redeemReward } from '../services/rewardsService';
import { logout, getCurrentUser } from '../services/authService';
import '../styles/Dashboard.css';

const DonorRewards = () => {
  const [rewards, setRewards] = useState([]);
  const [userRewards, setUserRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rewardsRes, userRewardsRes] = await Promise.all([
        getRewards(),
        getUserRewards()
      ]);
      setRewards(rewardsRes.rewards || []);
      setUserRewards(userRewardsRes.rewards || []);
    } catch (err) {
      console.error('Error loading rewards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (rewardId) => {
    try {
      await redeemReward(rewardId);
      alert('Reward redeemed successfully!');
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to redeem reward');
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
          <h1>FEEDILINK - Rewards</h1>
          <div className="nav-actions">
            <span>Welcome, {user?.name}</span>
            <Link to="/donor/dashboard" className="btn-secondary">Dashboard</Link>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
          </div>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="container">
          <h2>Available Rewards</h2>
          {loading ? (
            <p>Loading...</p>
          ) : rewards.length === 0 ? (
            <div className="empty-state">
              <p>No rewards available at the moment.</p>
            </div>
          ) : (
            <div className="feature-grid" style={{ marginTop: '20px' }}>
              {rewards.map((reward) => (
                <div key={reward.id} className="feature-card">
                  <h4>{reward.name}</h4>
                  <p>{reward.description}</p>
                  <p><strong>Points Required: {reward.points_required}</strong></p>
                  <button
                    onClick={() => handleRedeem(reward.id)}
                    className="btn-primary"
                    style={{ marginTop: '10px' }}
                  >
                    Redeem
                  </button>
                </div>
              ))}
            </div>
          )}

          <h2 style={{ marginTop: '40px' }}>My Rewards</h2>
          {userRewards.length === 0 ? (
            <div className="empty-state">
              <p>You haven't redeemed any rewards yet.</p>
            </div>
          ) : (
            <table className="data-table" style={{ marginTop: '20px' }}>
              <thead>
                <tr>
                  <th>Reward Name</th>
                  <th>Description</th>
                  <th>Redeemed Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {userRewards.map((ur) => (
                  <tr key={ur.id}>
                    <td>{ur.reward_name}</td>
                    <td>{ur.reward_description}</td>
                    <td>{new Date(ur.redeemed_at).toLocaleDateString()}</td>
                    <td>
                      <span className="badge badge-delivered">{ur.status}</span>
                    </td>
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

export default DonorRewards;

