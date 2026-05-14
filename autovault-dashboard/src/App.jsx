import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAutoStore from './store/useAutoStore';
import AdminPanel from './pages/AdminPanel';
import BrandsPage from './pages/BrandsPage';
import ModelsPage from './pages/ModelsPage';
import PartsPage from './pages/PartsPage';
import SpecsPage from './pages/SpecsPage';
import LoginPage from './pages/LoginPage';

// Only admins can access
function AdminRoute({ children }) {
  const auth = useAutoStore(s => s.auth);
  if (!auth.isLoggedIn) return <Navigate to="/login" replace />;
  if (auth.role !== "admin") return <Navigate to="/brands" replace />;
  return children;
}

// Any logged-in user can access
function ViewerRoute({ children }) {
  const auth = useAutoStore(s => s.auth);
  if (!auth.isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { theme } = useAutoStore();

  // Sync theme class on mount
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route 
          path="/login" 
          element={<LoginPage />} 
        />
        
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } 
        />
        
        <Route
          path="/brands"
          element={
            <ViewerRoute>
              <BrandsPage />
            </ViewerRoute>
          }
        />
        
        <Route
          path="/brands/:brandId/models"
          element={
            <ViewerRoute>
              <ModelsPage />
            </ViewerRoute>
          }
        />
        
        <Route
          path="/brands/:brandId/models/:modelId/parts"
          element={
            <ViewerRoute>
              <PartsPage />
            </ViewerRoute>
          }
        />
        
        <Route
          path="/brands/:brandId/models/:modelId/parts/:partId/specs"
          element={
            <ViewerRoute>
              <SpecsPage />
            </ViewerRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
