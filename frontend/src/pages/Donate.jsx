import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDonation } from '../services/donationService';
import '../styles/Auth.css';

const Donate = () => {
  const [formData, setFormData] = useState({
    food_name: '',
    food_type: '',
    quantity: '',
    pickup_address: '',
    expiry_time: '',
    image_url: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await createDonation(formData);
      setSuccess('Donation created successfully!');
      setTimeout(() => {
        navigate('/donor/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Donation</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Food Name</label>
            <input
              type="text"
              value={formData.food_name}
              onChange={(e) => setFormData({ ...formData, food_name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Food Type</label>
            <input
              type="text"
              value={formData.food_type}
              onChange={(e) => setFormData({ ...formData, food_type: e.target.value })}
              placeholder="e.g., Cooked, Raw, Packaged"
              required
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="text"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="e.g., 5 kg, 10 plates"
              required
            />
          </div>
          <div className="form-group">
            <label>Pickup Address</label>
            <input
              type="text"
              value={formData.pickup_address}
              onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Expiry Time</label>
            <input
              type="datetime-local"
              value={formData.expiry_time}
              onChange={(e) => setFormData({ ...formData, expiry_time: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="Enter image filename"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Donation'}
          </button>
        </form>
        <button onClick={() => navigate('/donor/dashboard')} className="btn-secondary">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Donate;


