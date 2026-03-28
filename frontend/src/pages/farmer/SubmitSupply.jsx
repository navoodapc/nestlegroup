import React, { useState } from 'react';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';

const SubmitSupply = () => {
  const [formData, setFormData] = useState({
    productType: 'Fresh Milk', quantity: '', availableDate: '', notes: ''
  });
  const [success, setSuccess] = useState('');

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/farmer/supply', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Supply logged successfully! Nestlé will arrange a truck for collection.');
      setFormData({ productType: 'Fresh Milk', quantity: '', availableDate: '', notes: '' });
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  // Determine unit label
  const getUnit = () => formData.productType === 'Fresh Milk' ? 'L' : 'kg';

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#1A7F4B', marginBottom: '24px' }}>Submit Available Supply</h2>
      
      {success && (
        <div style={{ backgroundColor: '#E8F5EE', color: '#1A7F4B', padding: '16px', borderRadius: '4px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #1A7F4B' }}>
          <CheckCircle size={20} /> {success}
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          
          <label style={{ marginBottom: '6px', fontWeight: '500' }}>Product Type</label>
          <select name="productType" value={formData.productType} onChange={handleChange}>
            <option value="Fresh Milk">Fresh Milk</option>
            <option value="Coconut">Coconut</option>
            <option value="Packaging Materials">Packaging Materials</option>
          </select>

          <label style={{ marginBottom: '6px', fontWeight: '500' }}>Quantity ({getUnit()})</label>
          <input 
            type="number" 
            name="quantity" 
            value={formData.quantity} 
            onChange={handleChange} 
            placeholder={`e.g. 500`}
            required 
          />

          <label style={{ marginBottom: '6px', fontWeight: '500' }}>Available Date for Collection</label>
          <input 
            type="date" 
            name="availableDate" 
            value={formData.availableDate} 
            onChange={handleChange} 
            required 
          />

          <label style={{ marginBottom: '6px', fontWeight: '500' }}>Additional Notes (Optional)</label>
          <textarea 
            name="notes" 
            rows="3" 
            value={formData.notes} 
            onChange={handleChange} 
            placeholder="Any specific access instructions..."
          ></textarea>

          <button type="submit" className="btn-primary" style={{ marginTop: '16px', fontSize: '1.1em', padding: '12px' }}>
            Submit Supply Schedule
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitSupply;
