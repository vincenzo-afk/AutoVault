import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAutoStore from './store/useAutoStore';
import AdminPanel from './pages/AdminPanel';
import BrandsPage from './pages/BrandsPage';
import ModelsPage from './pages/ModelsPage';
import PartsPage from './pages/PartsPage';
import SpecsPage from './pages/SpecsPage';
import { useEffect } from 'react';

function ProtectedRoute({ children }) {
  const isDataLoaded = useAutoStore((s) => s.isDataLoaded);
  if (!isDataLoaded) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

export default function App() {
  const theme = useAutoStore((s) => s.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/brands" replace />} />
        <Route path="/admin" element={<AdminPanel />} />

        <Route
          path="/brands"
          element={
            <ProtectedRoute>
              <BrandsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brands/:brandId/models"
          element={
            <ProtectedRoute>
              <ModelsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brands/:brandId/models/:modelId/parts"
          element={
            <ProtectedRoute>
              <PartsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brands/:brandId/models/:modelId/parts/:partId/specs"
          element={
            <ProtectedRoute>
              <SpecsPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
