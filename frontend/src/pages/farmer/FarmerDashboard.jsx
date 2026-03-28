import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FarmerDashboard = () => {
  const [demands, setDemands] = useState([]);

  useEffect(() => {
    fetchDemands();
  }, []);

  const fetchDemands = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:5000/api/farmer/demands', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDemands(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://127.0.0.1:5000/api/farmer/demands/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDemands();
    } catch (err) {
      console.error(err);
    }
  };

  // Mock Reliability Score
  const reliabilityScore = 95;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: '#1A7F4B', marginBottom: '24px' }}>Dashboard Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Performance Score */}
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 24px 0', color: '#1A1A1A' }}>Your Reliability Score</h3>
          
          <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto', borderRadius: '50%', background: `conic-gradient(#1A7F4B ${reliabilityScore}%, #E0E0E0 ${reliabilityScore}% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '130px', height: '130px', backgroundColor: '#FFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2em', fontWeight: 'bold', color: '#1A7F4B' }}>
              {reliabilityScore}%
            </div>
          </div>
          
          <p style={{ color: '#666', fontSize: '0.9em', marginTop: '20px' }}>Based on your last 10 deliveries ensuring on-time and correct quantity.</p>
        </div>

        {/* Demand Notifications */}
        <div>
          <h3 style={{ margin: '0 0 16px 0', color: '#1A1A1A' }}>Demand Requests from Nestlé</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {demands.length === 0 && (
              <div className="card" style={{ textAlign: 'center', color: '#666' }}>No new demand requests.</div>
            )}
            {demands.map(d => (
              <div key={d.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{d.product_type}</span>
                    <span className={`badge ${d.status === 'Pending' ? 'badge-amber' : d.status === 'Accepted' ? 'badge-green' : 'badge-red'}`}>
                      {d.status}
                    </span>
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9em' }}>
                    We require <strong style={{ color: '#1A1A1A' }}>{d.quantity_required} units</strong> by <strong style={{ color: '#1A1A1A' }}>{new Date(d.required_by).toLocaleDateString()}</strong>.
                  </div>
                </div>
                
                {d.status === 'Pending' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-primary" style={{ padding: '8px 16px' }} onClick={() => handleUpdateStatus(d.id, 'Accepted')}>Accept</button>
                    <button className="btn-outline-red" style={{ padding: '8px 16px' }} onClick={() => handleUpdateStatus(d.id, 'Declined')}>Decline</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
