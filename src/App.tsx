import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './views/landing/LandingPage';
import LoginPage from './views/auth/LoginPage';
import ApplicationForm from './views/application/ApplicationForm';
import AdminDashboard from './views/admin/AdminDashboard';
import ApplicationReview from './views/admin/ApplicationReview';
import InternDashboard from './views/intern/InternDashboard';
import GuideDashboard from './views/guide/GuideDashboard';
import PanelDashboard from './views/panel/PanelDashboard';

export default function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/apply" element={<ApplicationForm />} />
        
        {/* Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ApplicationReview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/intern"
          element={
            <ProtectedRoute allowedRoles={['intern']}>
              <InternDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guide"
          element={
            <ProtectedRoute allowedRoles={['guide']}>
              <GuideDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/panel"
          element={
            <ProtectedRoute allowedRoles={['panel_member']}>
              <PanelDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
    </AuthProvider>
  );
}