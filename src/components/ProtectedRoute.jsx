import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--black)',
        color: 'var(--gold)',
        fontSize: '1.1rem',
        fontWeight: 600,
        letterSpacing: '0.05em',
      }}>
        SkillPP
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}
