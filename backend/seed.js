const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const SEED_PASSWORD = bcrypt.hashSync('password123', 10);

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  console.log("Connected to MySQL server.");
  const dbName = process.env.DB_NAME || 'nesscm';
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await connection.query(`USE \`${dbName}\``);

  const tables = [
    'stock_alerts', 'incoming_shipments', 'shipments', 'retailer_stocks',
    'demands', 'deliveries', 'payments', 'users'
  ];
  for (const table of tables) {
    await connection.query(`DROP TABLE IF EXISTS \`${table}\``);
  }

  await connection.query(`
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('Nestle Admin', 'Retailer', 'Transporter', 'Farmer/Supplier') NOT NULL,
      status VARCHAR(50) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await connection.query(`
    CREATE TABLE shipments (
      id VARCHAR(20) PRIMARY KEY,
      origin VARCHAR(100),
      destination VARCHAR(100),
      transporter_id INT,
      eta DATETIME,
      status VARCHAR(50),
      contents VARCHAR(255),
      FOREIGN KEY (transporter_id) REFERENCES users(id)
    )
  `);

  await connection.query(`
    CREATE TABLE stock_alerts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      retailer_id INT,
      product VARCHAR(100),
      stock_percent INT,
      time_reported TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (retailer_id) REFERENCES users(id)
    )
  `);

  await connection.query(`
    CREATE TABLE demands (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_type VARCHAR(100),
      quantity_required INT,
      required_by DATE,
      status VARCHAR(50) DEFAULT 'Pending',
      supplier_id INT,
      FOREIGN KEY (supplier_id) REFERENCES users(id)
    )
  `);

  await connection.query(`
    CREATE TABLE deliveries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      farmer_id INT,
      collection_date DATE,
      truck_arrival_time VARCHAR(20),
      product VARCHAR(100),
      quantity INT,
      status VARCHAR(50),
      FOREIGN KEY (farmer_id) REFERENCES users(id)
    )
  `);

  await connection.query(`
    CREATE TABLE payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      farmer_id INT,
      invoice_id VARCHAR(50),
      product VARCHAR(100),
      amount DECIMAL(15,2),
      date DATE,
      status VARCHAR(50),
      FOREIGN KEY (farmer_id) REFERENCES users(id)
    )
  `);

  await connection.query(`
    CREATE TABLE retailer_stocks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      retailer_id INT,
      product VARCHAR(100),
      stock_percent INT,
      FOREIGN KEY (retailer_id) REFERENCES users(id)
    )
  `);

  await connection.query(`
    INSERT INTO users (full_name, email, password, role) VALUES 
    ('Admin Account', 'admin@nestle.lk', ?, 'Nestle Admin'),
    ('Keells Retailer', 'retailer@keells.lk', ?, 'Retailer'),
    ('Lanka Transporter', 'transporter@lanka.lk', ?, 'Transporter'),
    ('Nuwara Farmer', 'farmer@nuwara.lk', ?, 'Farmer/Supplier')
  `, [SEED_PASSWORD, SEED_PASSWORD, SEED_PASSWORD, SEED_PASSWORD]);

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const now = new Date();

  await connection.query(`
    INSERT INTO shipments (id, origin, destination, transporter_id, eta, status, contents) VALUES
    ('SL-001', 'Makandura Factory', 'Keells Kandy', 3, ?, 'En Route', 'Maggi Noodles, Nescafe'),
    ('SL-002', 'Pannala Factory', 'Cargills Galle', 3, ?, 'Delayed', 'Milo Powder'),
    ('SL-003', 'Colombo Port', 'Arpico Jaffna', 3, ?, 'En Route', 'Nestomalt')
  `, [tomorrow, tomorrow, tomorrow]);

  await connection.query(`
    INSERT INTO stock_alerts (retailer_id, product, stock_percent) VALUES
    (2, 'Maggi Noodles', 20),
    (2, 'Nestomalt', 15)
  `);

  const fDate1 = new Date(); fDate1.setDate(fDate1.getDate() + 5);
  const fDate2 = new Date(); fDate2.setDate(fDate2.getDate() + 7);
  const fDate3 = new Date(); fDate3.setDate(fDate3.getDate() + 10);
  await connection.query(`
    INSERT INTO demands (product_type, quantity_required, required_by, status, supplier_id) VALUES
    ('Fresh Milk', 500, ?, 'Pending', 4),
    ('Coconut', 2000, ?, 'Pending', 4),
    ('Packaging Materials', 1000, ?, 'Pending', 4)
  `, [fDate1, fDate2, fDate3]);

  const pDate = new Date(); pDate.setDate(pDate.getDate() - 1);
  await connection.query(`
    INSERT INTO deliveries (farmer_id, collection_date, truck_arrival_time, product, quantity, status) VALUES
    (4, ?, '08:00 AM', 'Fresh Milk', 450, 'Completed'),
    (4, ?, '09:30 AM', 'Coconut', 1800, 'Scheduled'),
    (4, ?, '10:00 AM', 'Fresh Milk', 500, 'Arrived'),
    (4, ?, '11:15 AM', 'Packaging Materials', 1000, 'Scheduled')
  `, [pDate, tomorrow, now, tomorrow]);

  await connection.query(`
    INSERT INTO payments (farmer_id, invoice_id, product, amount, date, status) VALUES
    (4, 'INV-1001', 'Fresh Milk', 125000.00, ?, 'Paid'),
    (4, 'INV-1002', 'Coconut', 90000.00, ?, 'Paid'),
    (4, 'INV-1003', 'Fresh Milk', 135000.00, ?, 'Pending'),
    (4, 'INV-1004', 'Packaging Materials', 250000.00, ?, 'Paid'),
    (4, 'INV-1005', 'Fresh Milk', 128000.00, ?, 'Pending')
  `, [pDate, pDate, now, pDate, now]);

  await connection.query(`
    INSERT INTO retailer_stocks (retailer_id, product, stock_percent) VALUES
    (2, 'Maggi Noodles', 20),
    (2, 'Milo Powder', 65),
    (2, 'Nescafe', 80),
    (2, 'Nestomalt', 15)
  `);

  console.log("Database seeded successfully!");
  await connection.end();
}

seed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});