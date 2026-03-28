import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      const role = res.data.user.role;
      if (role === 'Nestle Admin') navigate('/admin-dashboard');
      else if (role === 'Retailer') navigate('/retailer-dashboard');
      else if (role === 'Transporter') navigate('/transporter-dashboard');
      else if (role === 'Farmer/Supplier') navigate('/farmer-dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#1A7F4B', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: 'bold', fontSize: '24px', margin: '0 auto 16px auto' }}>
            N
          </div>
          <h2 style={{ color: '#1A7F4B', margin: 0 }}>NesSCM</h2>
          <p style={{ color: '#666', marginTop: '8px', fontSize: '0.9em' }}>Log in to your account</p>
        </div>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
          {error && <div style={{ color: '#D32F2F', backgroundColor: '#FDE8E8', padding: '10px', borderRadius: '4px', marginBottom: '16px', fontSize: '0.9em' }}>{error}</div>}
          
          <label style={{ marginBottom: '6px', fontWeight: '500', fontSize: '0.9em', color: '#1A1A1A' }}>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="admin@nestle.lk" 
            required 
          />

          <label style={{ marginBottom: '6px', fontWeight: '500', fontSize: '0.9em', color: '#1A1A1A' }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="password123" 
            required 
          />

          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Login</button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9em' }}>
          <span style={{ color: '#666' }}>Don't have an account? </span>
          <Link to="/register" style={{ color: '#1A7F4B', fontWeight: '600' }}>Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
