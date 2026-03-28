import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';

const TransporterDashboard = () => {
  const [shipment, setShipment] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  
  const [currLocation, setCurrLocation] = useState('');
  const [statusVal, setStatusVal] = useState('En Route');
  const [issueText, setIssueText] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchShipment();
  }, []);

  const fetchShipment = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/transporter/shipment', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShipment(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateLocation = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/transporter/shipment/${shipment.id}`, 
        { status: statusVal, currLocation }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowLocationModal(false);
      setSuccessMsg('Location updated successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchShipment();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkDelivered = async () => {
    if(!window.confirm('Are you sure you want to mark this shipment as Delivered?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/transporter/shipment/${shipment.id}`, 
        { status: 'Delivered', currLocation: 'Destination' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMsg('Shipment marked as Delivered!');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchShipment();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReportIssue = async () => {
    try {
      const token = localStorage.getItem('token');
      // For demo, we just update status to Delayed and close
      await axios.put(`/api/transporter/shipment/${shipment.id}`, 
        { status: 'Delayed', currLocation: 'Issue Reported: ' + issueText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowIssueModal(false);
      setSuccessMsg('Issue reported to Admin.');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchShipment();
    } catch (err) {
      console.error(err);
    }
  };

  if (!shipment) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>
        <CheckCircle size={48} color="#1A7F4B" style={{ marginBottom: '16px' }} />
        <h2>No Active Shipments</h2>
        <p>You have no pending deliveries assigned to you right now.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#1A7F4B', marginBottom: '24px' }}>My Active Shipment</h2>
      {successMsg && (
        <div style={{ backgroundColor: '#E8F5EE', color: '#1A7F4B', padding: '12px', borderRadius: '4px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
          <CheckCircle size={20} /> {successMsg}
        </div>
      )}

      <div className="card" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', borderBottom: '1px solid #E0E0E0', paddingBottom: '20px' }}>
          <div>
            <div style={{ color: '#666', fontSize: '0.9em', fontWeight: '500', marginBottom: '4px' }}>SHIPMENT ID</div>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#1A1A1A' }}>{shipment.id}</div>
          </div>
          <span className={`badge \${shipment.status === 'Delayed' ? 'badge-red' : 'badge-amber'}`} style={{ fontSize: '1em' }}>
            {shipment.status}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div>
            <div style={{ color: '#666', fontSize: '0.9em', fontWeight: '500', marginBottom: '4px' }}><Package size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> Contents</div>
            <div style={{ fontWeight: '500' }}>{shipment.contents}</div>
          </div>
          <div>
            <div style={{ color: '#666', fontSize: '0.9em', fontWeight: '500', marginBottom: '4px' }}>ETA</div>
            <div style={{ fontWeight: '500' }}>{new Date(shipment.eta).toLocaleString()}</div>
          </div>
          <div style={{ gridColumn: '1 / span 2', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#F5F5F5', padding: '16px', borderRadius: '8px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#666', fontSize: '0.8em', fontWeight: '600' }}>ORIGIN</div>
              <div style={{ fontWeight: 'bold' }}>{shipment.origin}</div>
            </div>
            <div style={{ color: '#1A7F4B' }}>{`-->`}</div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <div style={{ color: '#666', fontSize: '0.8em', fontWeight: '600' }}>DESTINATION</div>
              <div style={{ fontWeight: 'bold' }}>{shipment.destination}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center' }} onClick={() => setShowLocationModal(true)}>
            <MapPin size={18} /> Update Location
          </button>
          <button style={{ backgroundColor: '#FFFFFF', color: '#1A7F4B', border: '1px solid #1A7F4B', display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center', fontWeight: '500', borderRadius: '4px', cursor: 'pointer', transition: '0.2s' }} onClick={handleMarkDelivered}>
            <CheckCircle size={18} /> Mark Delivered
          </button>
          <button className="btn-outline-red" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center' }} onClick={() => setShowIssueModal(true)}>
            <AlertTriangle size={18} /> Report Issue
          </button>
        </div>
      </div>

      {showLocationModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div className="card" style={{ width: '400px' }}>
            <h3 style={{ marginTop: 0 }}>Update Current Location</h3>
            <label style={{ fontSize: '0.9em', fontWeight: '500', display: 'block', marginBottom: '4px' }}>Location Name (e.g. Kandy Bypass)</label>
            <input type="text" value={currLocation} onChange={e => setCurrLocation(e.target.value)} placeholder="Current location..." />
            
            <label style={{ fontSize: '0.9em', fontWeight: '500', display: 'block', marginBottom: '4px' }}>Status</label>
            <select value={statusVal} onChange={e => setStatusVal(e.target.value)}>
              <option value="En Route">En Route</option>
              <option value="Approaching">Approaching</option>
              <option value="Delayed">Delayed</option>
            </select>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button style={{ backgroundColor: 'transparent', color: '#666', fontWeight: '500' }} onClick={() => setShowLocationModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleUpdateLocation}>Save Update</button>
            </div>
          </div>
        </div>
      )}

      {showIssueModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div className="card" style={{ width: '400px' }}>
            <h3 style={{ marginTop: 0, color: '#D32F2F' }}>Report Delay / Issue</h3>
            <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '16px' }}>Describe the problem. This will flag the shipment on the Admin dashboard.</p>
            <textarea rows="4" value={issueText} onChange={e => setIssueText(e.target.value)} placeholder="Vehicle breakdown, extreme traffic, etc..."></textarea>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button style={{ backgroundColor: 'transparent', color: '#666', fontWeight: '500' }} onClick={() => setShowIssueModal(false)}>Cancel</button>
              <button style={{ backgroundColor: '#D32F2F', color: 'white', padding: '10px 16px', borderRadius: '4px', border: 'none', fontWeight: '500', cursor: 'pointer' }} onClick={handleReportIssue}>Submit Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransporterDashboard;
