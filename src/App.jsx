import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Cursuri from './pages/Cursuri';
import Performante from './pages/Performante';
import Suport from './pages/Suport';
import Setari from './pages/Setari';
import Administrare from './pages/Administrare';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/cursuri" replace />} />
            <Route path="cursuri" element={<Cursuri />} />
            <Route path="performante" element={<Performante />} />
            <Route path="suport" element={<Suport />} />
            <Route path="setari" element={<Setari />} />
            <Route path="administrare" element={<Administrare />} />
          </Route>
          <Route path="*" element={<Navigate to="/cursuri" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
