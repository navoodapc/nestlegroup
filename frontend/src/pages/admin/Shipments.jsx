import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Shipments = () => {
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/admin/shipments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setShipments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchShipments();
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <h2 style={{ color: '#1A7F4B', marginBottom: '24px' }}>All Shipments</h2>
      
      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>Shipment ID</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Transporter</th>
              <th>ETA</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: '500' }}>{s.id}</td>
                <td>{s.origin}</td>
                <td>{s.destination}</td>
                <td>{s.transporter_name || 'Unassigned'}</td>
                <td>{new Date(s.eta).toLocaleDateString()}</td>
                <td>
                  <span className={`badge \${s.status === 'En Route' ? 'badge-amber' : s.status === 'Delayed' ? 'badge-red' : s.status === 'Delivered' ? 'badge-gray' : 'badge-green'}`}>
                    {s.status}
                  </span>
                </td>
                <td>
                  <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8.5em' }} onClick={() => setSelectedShipment(s)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
            {shipments.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No shipments found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Side Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '350px', backgroundColor: '#FFF',
        boxShadow: '-2px 0 8px rgba(0,0,0,0.1)', transform: selectedShipment ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease', zIndex: 1000, display: 'flex', flexDirection: 'column'
      }}>
        {selectedShipment && (
          <>
            <div style={{ padding: '20px', borderBottom: '1px solid #E0E0E0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#1A7F4B' }}>{selectedShipment.id} Details</h3>
              <button 
                onClick={() => setSelectedShipment(null)}
                style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}
              >&times;</button>
            </div>
            <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
              <p><strong>Status:</strong> {selectedShipment.status}</p>
              <p><strong>Contents:</strong> {selectedShipment.contents}</p>
              <p><strong>Origin:</strong> {selectedShipment.origin}</p>
              <p><strong>Destination:</strong> {selectedShipment.destination}</p>
              <p><strong>Transporter:</strong> {selectedShipment.transporter_name}</p>
              <p><strong>ETA:</strong> {new Date(selectedShipment.eta).toLocaleString()}</p>
              
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#F5F5F5', borderRadius: '4px' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>Delivery Log</h4>
                <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '8px' }}>• Scheduled</div>
                <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '8px' }}>• Handed over to Transporter</div>
                <div style={{ fontSize: '0.9em', color: '#1A7F4B', fontWeight: '500' }}>• Currently {selectedShipment.status}</div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Backdrop */}
      {selectedShipment && (
        <div 
          onClick={() => setSelectedShipment(null)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 999 }}
        />
      )}
    </div>
  );
};

export default Shipments;
