import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Pricing from './pages/Pricing';
import PaymentGateway from './pages/PaymentGateway';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';

import Settings from './pages/Settings';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import ContactUs from './pages/ContactUs';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/dashboard/pricing" element={
            <ProtectedRoute>
              <Pricing />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/payment/:planId" element={
            <ProtectedRoute>
              <PaymentGateway />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/editor/:imageId" element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/profile" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/dashboard/settings" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
