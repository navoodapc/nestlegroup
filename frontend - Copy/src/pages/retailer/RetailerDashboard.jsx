import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RetailerDashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [newStockVal, setNewStockVal] = useState(0);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:5000/api/retailer/stocks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStocks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://127.0.0.1:5000/api/retailer/stocks/${editingStock.product}`, { stockPercent: newStockVal }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      fetchStocks(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (stock) => {
    setEditingStock(stock);
    setNewStockVal(stock.stock_percent);
    setShowModal(true);
  };

  return (
    <div>
      <h2 style={{ color: '#1A7F4B', marginBottom: '24px' }}>Inventory Stock Levels</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {stocks.map(s => (
          <div key={s.id} className="card" style={{ borderColor: s.stock_percent < 25 ? '#D32F2F' : '#E0E0E0', position: 'relative' }}>
            {s.stock_percent < 25 && (
              <span className="badge badge-red" style={{ position: 'absolute', top: '12px', right: '12px' }}>LOW STOCK</span>
            )}
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2em' }}>{s.product}</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#666', fontSize: '0.9em' }}>Available Stock</span>
              <span style={{ fontWeight: 'bold', color: s.stock_percent < 25 ? '#D32F2F' : '#1A1A1A' }}>{s.stock_percent}%</span>
            </div>
            
            <div style={{ width: '100%', backgroundColor: '#E0E0E0', borderRadius: '4px', height: '8px', marginBottom: '20px', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                backgroundColor: s.stock_percent < 25 ? '#D32F2F' : '#1A7F4B',
                width: `${s.stock_percent}%` 
              }}></div>
            </div>

            <button className="btn-primary" style={{ width: '100%' }} onClick={() => openModal(s)}>
              Update Stock
            </button>
          </div>
        ))}
        {stocks.length === 0 && <p>No records found.</p>}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div className="card" style={{ width: '400px' }}>
            <h3 style={{ marginTop: 0 }}>Update {editingStock?.product} Stock</h3>
            <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '16px' }}>Adjust the available shelf stock percentage.</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <input 
                type="range" 
                min="0" max="100" 
                value={newStockVal} 
                onChange={(e) => setNewStockVal(e.target.value)} 
                style={{ flex: 1, margin: 0 }}
              />
              <input 
                type="number" 
                min="0" max="100" 
                value={newStockVal} 
                onChange={(e) => setNewStockVal(e.target.value)} 
                style={{ width: '70px', margin: 0 }}
              /> <span style={{ fontWeight: 'bold' }}>%</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button style={{ backgroundColor: 'transparent', color: '#666', fontWeight: '500' }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleUpdate}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetailerDashboard;
