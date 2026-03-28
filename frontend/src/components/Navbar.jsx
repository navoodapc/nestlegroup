import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ height: '60px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 10 }}>
      {/* Search or other left navbar elements could go here... but strictly left logo is in sidebar usually. We'll add logo top left of navbar if asked, or sidebar. Let's put NesSCM text in navbar left for now or leave it since it's in Sidebar */}
      <div style={{ fontWeight: 'bold', fontSize: '20px', color: '#1A7F4B' }}>
        NesSCM Platform
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={18} color="#666" />
          <span style={{ fontWeight: '500' }}>{user.name}</span>
          <span className="badge badge-green" style={{ marginLeft: '4px' }}>{user.role}</span>
        </div>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', color: '#D32F2F', fontWeight: '500' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
