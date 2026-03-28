import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:5000/api/farmer/deliveries', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDeliveries(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDeliveries();
  }, []);

  return (
    <div>
      <h2 style={{ color: '#1A7F4B', marginBottom: '24px' }}>My Delivery Schedule</h2>
      
      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>Collection Date</th>
              <th>Truck Arrival Time</th>
              <th>Product Type</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map(d => (
              <tr key={d.id}>
                <td>{new Date(d.collection_date).toLocaleDateString()}</td>
                <td>{d.truck_arrival_time}</td>
                <td style={{ fontWeight: '500' }}>{d.product}</td>
                <td>{d.quantity} {d.product === 'Fresh Milk' ? 'L' : 'kg'}</td>
                <td>
                  <span className={`badge ${d.status === 'Scheduled' ? 'badge-amber' : d.status === 'Arrived' ? 'badge-green' : 'badge-gray'}`}>
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
            {deliveries.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No upcoming deliveries scheduled.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyDeliveries;
