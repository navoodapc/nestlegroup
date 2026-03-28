import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in react-leaflet
const truckIcon = divIcon({
  className: 'custom-div-icon',
  html: "<div style='background-color:#1A7F4B;width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 0 5px rgba(0,0,0,0.3);position:relative;'><div style='position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:10px;height:10px;background:white;border-radius:50%;animation: pulse 1.5s infinite;'></div></div>",
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const redTruckIcon = divIcon({
  ...truckIcon,
  html: "<div style='background-color:#D32F2F;width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 0 5px rgba(0,0,0,0.3);position:relative;'><div style='position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:10px;height:10px;background:white;border-radius:50%;animation: pulse 1.5s infinite;'></div></div>"
});

const AdminDashboard = () => {
  const [stats, setStats] = useState({ activeShipmentsCount: 0, lowStockAlertsCount: 0, onTimeRate: 0 });

  // Map markers for shipments
  const [markers, setMarkers] = useState([
    { id: 'SL-001', pos: [7.3110, 79.9830], dest: 'Keells Kandy', contents: 'Maggi Noodles, Nescafé', eta: 'Tomorrow', status: 'En Route', color: 'green' }, // Makandura -> Kandy roughly
    { id: 'SL-002', pos: [7.2868, 79.9880], dest: 'Cargills Galle', contents: 'Milo Powder', eta: 'Tomorrow', status: 'Delayed', color: 'red' }, // Pannala -> Galle
    { id: 'SL-003', pos: [6.9271, 79.8612], dest: 'Arpico Jaffna', contents: 'Nestomalt', eta: 'Tomorrow', status: 'En Route', color: 'green' } // Colombo -> Jaffna
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();

    // Small animation effect on markers to simulate movement
    const interval = setInterval(() => {
      setMarkers(current => current.map(m => {
        if(m.status === 'En Route') {
          return { ...m, pos: [m.pos[0] + (Math.random() - 0.5)*0.005, m.pos[1] + (Math.random() - 0.5)*0.005] };
        }
        return m;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <style>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
      `}</style>
      <h2 style={{ color: '#1A7F4B', marginBottom: '24px' }}>Admin Dashboard</h2>
      
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ borderLeft: '4px solid #1A7F4B' }}>
          <h3 style={{ color: '#666', fontSize: '1rem', fontWeight: '500', marginBottom: '8px' }}>Active Shipments</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1A1A1A' }}>{stats.activeShipmentsCount}</div>
        </div>
        <div className="card" style={{ borderLeft: stats.lowStockAlertsCount > 0 ? '4px solid #D32F2F' : '4px solid #1A7F4B' }}>
          <h3 style={{ color: '#666', fontSize: '1rem', fontWeight: '500', marginBottom: '8px' }}>Low Stock Alerts</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: stats.lowStockAlertsCount > 0 ? '#D32F2F' : '#1A1A1A' }}>{stats.lowStockAlertsCount}</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #1A7F4B' }}>
          <h3 style={{ color: '#666', fontSize: '1rem', fontWeight: '500', marginBottom: '8px' }}>On-Time Delivery Rate</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1A1A1A' }}>{stats.onTimeRate}%</div>
        </div>
      </div>

      {/* Map Section */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', height: '400px', marginBottom: '32px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E0E0E0', backgroundColor: '#FFFFFF', fontWeight: '600' }}>
          Live Tracking Map
        </div>
        <div style={{ flex: 1, zIndex: 1 }}>
          <MapContainer center={[7.8731, 80.7718]} zoom={7} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {markers.map((m) => (
              <Marker key={m.id} position={m.pos} icon={m.color === 'red' ? redTruckIcon : truckIcon}>
                <Popup>
                  <div style={{ fontWeight: 'bold' }}>Shipment {m.id}</div>
                  <div style={{ fontSize: '0.9em', color: '#666', margin: '4px 0' }}>{m.contents}</div>
                  <div style={{ fontSize: '0.9em' }}>ETA: {m.eta}</div>
                  <div style={{ fontSize: '0.9em', marginTop: '4px' }}>
                    Status: <span style={{ color: m.color === 'red' ? '#D32F2F' : '#1A7F4B', fontWeight: 'bold' }}>{m.status}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
