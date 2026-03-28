const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');

require('dotenv').config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'nestle_super_secret_key_2026';

const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// --- AUTH ROUTES ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ msg: 'Email and password are required' });
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (users.length === 0) return res.status(400).json({ msg: 'Invalid credentials' });
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    const payload = { id: user.id, email: user.email, role: user.role, name: user.full_name };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: payload });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { fullName, email, password, role } = req.body;
  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ msg: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
      [fullName, email, hashedPassword, role]
    );
    res.json({ msg: 'User registered successfully!' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- ADMIN ROUTES ---
app.get('/api/admin/dashboard', auth, async (req, res) => {
  if (req.user.role !== 'Nestle Admin') return res.status(403).json({ msg: 'Unauthorized' });
  try {
    const [shipments] = await pool.query("SELECT COUNT(*) as count FROM shipments WHERE status IN ('En Route', 'Delayed')");
    const [alerts] = await pool.query("SELECT COUNT(*) as count FROM stock_alerts");
    const onTimeRate = 92;
    res.json({
      activeShipmentsCount: shipments[0].count,
      lowStockAlertsCount: alerts[0].count,
      onTimeRate
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/shipments', auth, async (req, res) => {
  try {
    const [shipments] = await pool.query(`
      SELECT s.*, u.full_name as transporter_name 
      FROM shipments s 
      LEFT JOIN users u ON s.transporter_id = u.id
    `);
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/alerts', auth, async (req, res) => {
  try {
    const [alerts] = await pool.query(`
      SELECT a.*, u.full_name as retailer_name 
      FROM stock_alerts a 
      JOIN users u ON a.retailer_id = u.id
      ORDER BY a.time_reported DESC
    `);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/users', auth, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, full_name, email, role, status FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/users/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ msg: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- RETAILER ROUTES ---
app.get('/api/retailer/stocks', auth, async (req, res) => {
  try {
    const [stocks] = await pool.query('SELECT * FROM retailer_stocks WHERE retailer_id = ?', [req.user.id]);
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/retailer/stocks/:product', auth, async (req, res) => {
  try {
    const { stockPercent } = req.body;
    const product = req.params.product;
    await pool.query('UPDATE retailer_stocks SET stock_percent = ? WHERE retailer_id = ? AND product = ?', [stockPercent, req.user.id, product]);
    if (stockPercent < 25) {
      await pool.query('INSERT INTO stock_alerts (retailer_id, product, stock_percent) VALUES (?, ?, ?)', [req.user.id, product, stockPercent]);
    } else {
      await pool.query('DELETE FROM stock_alerts WHERE retailer_id = ? AND product = ?', [req.user.id, product]);
    }
    res.json({ msg: 'Stock updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/retailer/shipments', auth, async (req, res) => {
  try {
    const [shipments] = await pool.query("SELECT * FROM shipments WHERE status IN ('Scheduled', 'En Route', 'Delayed')");
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- TRANSPORTER ROUTES ---
app.get('/api/transporter/shipment', auth, async (req, res) => {
  try {
    const [shipments] = await pool.query('SELECT * FROM shipments WHERE transporter_id = ? AND status != "Delivered" LIMIT 1', [req.user.id]);
    res.json(shipments.length > 0 ? shipments[0] : null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/transporter/shipment/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE shipments SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ msg: 'Shipment updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- FARMER/SUPPLIER ROUTES ---
app.get('/api/farmer/demands', auth, async (req, res) => {
  try {
    const [demands] = await pool.query('SELECT * FROM demands WHERE supplier_id = ?', [req.user.id]);
    res.json(demands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/farmer/demands/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE demands SET status = ? WHERE id = ? AND supplier_id = ?', [status, req.params.id, req.user.id]);
    res.json({ msg: 'Demand status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/farmer/supply', auth, async (req, res) => {
  try {
    const { productType, quantity, availableDate, notes } = req.body;
    await pool.query(
      'INSERT INTO deliveries (farmer_id, collection_date, truck_arrival_time, product, quantity, status) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, availableDate, 'TBD', productType, quantity, 'Scheduled']
    );
    res.json({ msg: 'Supply submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/farmer/deliveries', auth, async (req, res) => {
  try {
    const [deliveries] = await pool.query('SELECT * FROM deliveries WHERE farmer_id = ?', [req.user.id]);
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/farmer/payments', auth, async (req, res) => {
  try {
    const [payments] = await pool.query('SELECT * FROM payments WHERE farmer_id = ?', [req.user.id]);
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server started on port ' + PORT));