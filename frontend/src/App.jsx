import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import StockAlerts from './pages/admin/StockAlerts';
import Shipments from './pages/admin/Shipments';
import Users from './pages/admin/Users';
// Retailer
import RetailerDashboard from './pages/retailer/RetailerDashboard';
import RetailerShipments from './pages/retailer/RetailerShipments';
// Transporter
import TransporterDashboard from './pages/transporter/TransporterDashboard';
// Farmer
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import SubmitSupply from './pages/farmer/SubmitSupply';
import MyDeliveries from './pages/farmer/MyDeliveries';
import FarmerPayments from './pages/farmer/FarmerPayments';

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token || !user) {
    return <Navigate to="/login" />;
  }
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/\${user.role.split('/')[0].toLowerCase().split(' ')[0]}-dashboard`} />;
  }
  return children;
};

// Default redirect for root
const RootRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/login" />;
  
  if (user.role === 'Nestle Admin') return <Navigate to="/admin-dashboard" />;
  if (user.role === 'Retailer') return <Navigate to="/retailer-dashboard" />;
  if (user.role === 'Transporter') return <Navigate to="/transporter-dashboard" />;
  if (user.role === 'Farmer/Supplier') return <Navigate to="/farmer-dashboard" />;
  return <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<ProtectedRoute allowedRole="Nestle Admin"><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
        <Route path="/admin-shipments" element={<ProtectedRoute allowedRole="Nestle Admin"><Layout><Shipments /></Layout></ProtectedRoute>} />
        <Route path="/admin-alerts" element={<ProtectedRoute allowedRole="Nestle Admin"><Layout><StockAlerts /></Layout></ProtectedRoute>} />
        <Route path="/admin-users" element={<ProtectedRoute allowedRole="Nestle Admin"><Layout><Users /></Layout></ProtectedRoute>} />

        {/* Retailer Routes */}
        <Route path="/retailer-dashboard" element={<ProtectedRoute allowedRole="Retailer"><Layout><RetailerDashboard /></Layout></ProtectedRoute>} />
        <Route path="/retailer-shipments" element={<ProtectedRoute allowedRole="Retailer"><Layout><RetailerShipments /></Layout></ProtectedRoute>} />

        {/* Transporter Routes */}
        <Route path="/transporter-dashboard" element={<ProtectedRoute allowedRole="Transporter"><Layout><TransporterDashboard /></Layout></ProtectedRoute>} />

        {/* Farmer Routes */}
        <Route path="/farmer-dashboard" element={<ProtectedRoute allowedRole="Farmer/Supplier"><Layout><FarmerDashboard /></Layout></ProtectedRoute>} />
        <Route path="/farmer-submit" element={<ProtectedRoute allowedRole="Farmer/Supplier"><Layout><SubmitSupply /></Layout></ProtectedRoute>} />
        <Route path="/farmer-deliveries" element={<ProtectedRoute allowedRole="Farmer/Supplier"><Layout><MyDeliveries /></Layout></ProtectedRoute>} />
        <Route path="/farmer-payments" element={<ProtectedRoute allowedRole="Farmer/Supplier"><Layout><FarmerPayments /></Layout></ProtectedRoute>} />
        
        {/* Catch All */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;
