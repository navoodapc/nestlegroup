import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', confirmPassword: '', role: 'Nestle Admin'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    try {
      await axios.post('/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5', padding: '20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#1A7F4B', margin: 0 }}>Register</h2>
          <p style={{ color: '#666', marginTop: '8px', fontSize: '0.9em' }}>Create a NesSCM account</p>
        </div>
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column' }}>
          {error && <div style={{ color: '#D32F2F', backgroundColor: '#FDE8E8', padding: '10px', borderRadius: '4px', marginBottom: '16px', fontSize: '0.9em' }}>{error}</div>}
          
          <label style={{ marginBottom: '6px', fontWeight: '500', fontSize: '0.9em' }}>Full Name</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />

          <label style={{ marginBottom: '6px', fontWeight: '500', fontSize: '0.9em' }}>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label style={{ marginBottom: '6px', fontWeight: '500', fontSize: '0.9em' }}>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />

          <label style={{ marginBottom: '6px', fontWeight: '500', fontSize: '0.9em' }}>Confirm Password</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />

          <label style={{ marginBottom: '6px', fontWeight: '500', fontSize: '0.9em' }}>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="Nestle Admin">Nestlé Admin</option>
            <option value="Retailer">Retailer</option>
            <option value="Transporter">Transporter</option>
            <option value="Farmer/Supplier">Farmer/Supplier</option>
          </select>

          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Register</button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9em' }}>
          <span style={{ color: '#666' }}>Already have an account? </span>
          <Link to="/login" style={{ color: '#1A7F4B', fontWeight: '600' }}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
