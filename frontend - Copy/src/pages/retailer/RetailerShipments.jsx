import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RetailerShipments = () => {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:5000/api/retailer/shipments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setShipments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchShipments();
  }, []);

  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div>
      <h2 style={{ color: '#1A7F4B', marginBottom: '24px' }}>Incoming Shipments</h2>
      
      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>Shipment ID</th>
              <th>Contents</th>
              <th>ETA</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map(s => {
              const rowIsToday = isToday(s.eta);
              return (
                <tr key={s.id} style={{ backgroundColor: rowIsToday ? '#E8F5EE' : 'transparent' }}>
                  <td style={{ fontWeight: '500' }}>{s.id}</td>
                  <td>{s.contents}</td>
                  <td style={{ fontWeight: rowIsToday ? 'bold' : 'normal', color: rowIsToday ? '#1A7F4B' : 'inherit' }}>
                    {new Date(s.eta).toLocaleDateString()} {rowIsToday && '(Today)'}
                  </td>
                  <td>
                    <span className={`badge \${s.status === 'En Route' ? 'badge-amber' : s.status === 'Delayed' ? 'badge-red' : 'badge-green'}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {shipments.length === 0 && (
              <tr><td colSpan="4" style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No incoming shipments</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RetailerShipments;
