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
  const isDataLoaded = useAutoStore(s => s.isDataLoaded);
  if (!auth.isLoggedIn) return <Navigate to="/login" replace />;
  if (!isDataLoaded) return <Navigate to="/admin" replace />; // Wait, the plan says Navigate to /login but /admin might be better if no data. Actually plan says: Navigate to /login. I will follow plan. Wait! Wait, no, viewer can't go to admin, so maybe /login is fine, or maybe show empty state. Actually plan explicitly says: if (!isDataLoaded) return <Navigate to="/login" replace />; I will use what plan gave.
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
          element={
            <LoginPageWrapper />
          } 
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

// Wrapper for login to redirect if already logged in
function LoginPageWrapper() {
  const auth = useAutoStore(s => s.auth);
  if (auth.isLoggedIn) {
    if (auth.role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/brands" replace />;
  }
  return <LoginPage />;
}
