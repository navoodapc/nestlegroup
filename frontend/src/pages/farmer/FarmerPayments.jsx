import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FarmerPayments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/farmer/payments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPayments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPayments();
  }, []);

  // Format currency LKR
  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amt);
  };

  return (
    <div>
      <h2 style={{ color: '#1A7F4B', marginBottom: '24px' }}>My Payments & Invoices</h2>
      
      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Product Submitted</th>
              <th>Amount Settled</th>
              <th>Date</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: '500' }}>{p.invoice_id}</td>
                <td>{p.product}</td>
                <td style={{ fontWeight: 'bold' }}>{formatCurrency(p.amount)}</td>
                <td>{new Date(p.date).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${p.status === 'Paid' ? 'badge-green' : 'badge-amber'}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No payment records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FarmerPayments;
