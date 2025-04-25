import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import PDIChat from './pages/PDIChat';
import PDIView from './pages/PDIView';
import CriarConta from './pages/CriarConta';
import Dashboard from './pages/Dashboard';

const AppRoutes: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/criar-conta" element={<CriarConta />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Navigate to="/" replace />
            </PrivateRoute>
          }
        />
        <Route
          path="/pdi/:id"
          element={
            <PrivateRoute>
              <PDIView />
            </PrivateRoute>
          }
        />
        <Route
          path="/pdi/:id/chat"
          element={
            <PrivateRoute>
              <PDIChat />
            </PrivateRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes; 