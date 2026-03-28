import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, AlertTriangle, Users, Package, FileText, MapPin, Send } from 'lucide-react';

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role;

  let links = [];

  if (role === 'Nestle Admin') {
    links = [
      { path: '/admin-dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
      { path: '/admin-shipments', label: 'Shipments', icon: <Truck size={20} /> },
      { path: '/admin-alerts', label: 'Stock Alerts', icon: <AlertTriangle size={20} /> },
      { path: '/admin-users', label: 'Users', icon: <Users size={20} /> },
    ];
  } else if (role === 'Retailer') {
    links = [
      { path: '/retailer-dashboard', label: 'Stock Levels', icon: <Package size={20} /> },
      { path: '/retailer-shipments', label: 'Incoming Shipments', icon: <Truck size={20} /> },
    ];
  } else if (role === 'Transporter') {
    links = [
      { path: '/transporter-dashboard', label: 'My Shipment', icon: <MapPin size={20} /> },
      // Report Issue might just be a modal on the My Shipment page, but we'll add a link if needed 
      // User said "Report Issue button opens a modal" on "My Shipment page", so we could just link to the same page
    ];
  } else if (role === 'Farmer/Supplier') {
    links = [
      { path: '/farmer-dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
      { path: '/farmer-submit', label: 'Submit Supply', icon: <Send size={20} /> },
      { path: '/farmer-deliveries', label: 'My Deliveries', icon: <Truck size={20} /> },
      { path: '/farmer-payments', label: 'Payments', icon: <FileText size={20} /> },
    ];
  }

  return (
    <div style={{
      width: '220px',
      backgroundColor: '#FFFFFF',
      borderRight: '1px solid #E0E0E0',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      flexShrink: 0
    }}>
      <div style={{
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid #E0E0E0'
      }}>
        {/* Logo Placeholder */}
        <div style={{
          width: '32px',
          height: '32px',
          backgroundColor: '#1A7F4B',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontWeight: 'bold',
          fontSize: '18px'
        }}>
          N
        </div>
        <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#1A7F4B' }}>NesSCM</div>
      </div>
      
      <div style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              color: isActive ? '#1A7F4B' : '#666',
              backgroundColor: isActive ? '#E8F5EE' : 'transparent',
              fontWeight: isActive ? '600' : '500',
              borderRight: isActive ? '4px solid #1A7F4B' : '4px solid transparent',
              transition: 'background-color 0.2s',
              textDecoration: 'none'
            })}
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
