import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles/custom-theme.css';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import WeatherComponent from './pages/Weather';
import AddOwner from './pages/AddOwner';
import Auth from './pages/Auth';
import Admin from "./pages/Admin";
import PropertyManager from './pages/PropertyManager';
import Tenant from './pages/Tenant';
import Maintenance from './pages/Maintenance';
import MaintenanceDashboard from './pages/MaintenanceDashboard';
import Lease from './pages/Lease';
import Payment from './pages/Payment';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import AdminUsers from "./pages/AdminUsers";

function AppRoutes() {
  const location = useLocation(); // 👈 Track current path
  const isAuthenticated = !!localStorage.getItem('authToken');
  const roles = JSON.parse(localStorage.getItem("authRoles") || "[]");
  const isAdmin = roles.includes("Admin");
  const isOwner = roles.includes("Owner");
  const isTenant = roles.includes("Tenant");

  return (
    <Routes key={location.pathname}> {/* 👈 Force re-render on path change */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/auth" />} />
      <Route path="/about" element={isAuthenticated ? <About /> : <Navigate to="/auth" />} />
      <Route path="/contact" element={isAuthenticated ? <Contact /> : <Navigate to="/auth" />} />
      <Route path="/weather" element={isAuthenticated ? <WeatherComponent /> : <Navigate to="/auth" />} />
      <Route path="/addowner" element={isAuthenticated ? <AddOwner /> : <Navigate to="/auth" />} />
      <Route path="/tenants" element={isAuthenticated ? <Tenant /> : <Navigate to="/auth" />} />
      <Route path="/maintenance" element={isAuthenticated && (isTenant || isAdmin) ? <Maintenance /> : <Navigate to="/" />} />
      <Route path="/maintenance-dashboard" element={isAuthenticated && isOwner ? <MaintenanceDashboard /> : <Navigate to="/" />} />
      <Route path="/lease" element={isAuthenticated ? <Lease /> : <Navigate to="/auth" />} />
      <Route path="/payments" element={isAuthenticated ? <Payment /> : <Navigate to="/auth" />} />
      <Route path="/cart" element={isAuthenticated ? <Cart /> : <Navigate to="/auth" />} />
      <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/auth" />} />
      <Route path="/admin/users" element={isAuthenticated && isAdmin ? <AdminUsers /> : <Navigate to="/" />} />
      <Route path="/admin" element={isAuthenticated && isAdmin ? <Admin /> : <Navigate to="/" />} />
      <Route path="/propertyManager" element={isAuthenticated && (isOwner || isAdmin) ? <PropertyManager /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <AppRoutes />
      <Footer />
    </Router>
  );
}
