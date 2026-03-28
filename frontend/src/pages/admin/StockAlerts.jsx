import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:5000/api/admin/alerts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAlerts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAlerts();
  }, []);

  return (
    <div>
      <h2 style={{ color: '#1A7F4B', marginBottom: '24px' }}>Stock Alerts</h2>
      
      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>Retailer Name</th>
              <th>Product</th>
              <th>Stock %</th>
              <th>Time Reported</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map(a => (
              <tr key={a.id} style={{ backgroundColor: a.stock_percent < 25 ? '#FDE8E8' : 'transparent' }}>
                <td>{a.retailer_name}</td>
                <td style={{ fontWeight: '500' }}>{a.product}</td>
                <td>
                  <span style={{ color: a.stock_percent < 25 ? '#D32F2F' : 'inherit', fontWeight: a.stock_percent < 25 ? 'bold' : 'normal' }}>
                    {a.stock_percent}%
                  </span>
                </td>
                <td>{new Date(a.time_reported).toLocaleString()}</td>
              </tr>
            ))}
            {alerts.length === 0 && (
              <tr><td colSpan="4" style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No stock alerts</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockAlerts;
