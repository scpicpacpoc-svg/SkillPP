import { useAuth } from '../context/AuthContext';
import './Page.css';

const placeholder = [
  { id: 1, title: 'Agent AI Vocal', modules: 0, progress: 0, tag: 'Inteligență Artificială' },
];

export default function Cursuri() {
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Cursuri</h1>
          <p className="page-subtitle">Explorează modulele disponibile și continuă unde ai rămas.</p>
        </div>
        {user?.role === 'admin' && (
          <button className="btn-primary" disabled>+ Curs nou</button>
        )}
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-value">0</span>
          <span className="stat-label">Cursuri active</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">0</span>
          <span className="stat-label">Module finalizate</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">0h</span>
          <span className="stat-label">Timp de studiu</span>
        </div>
      </div>

      <div className="section-label">Cursuri disponibile</div>
      <div className="course-grid">
        {placeholder.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-tag">{course.tag}</div>
            <h3 className="course-title">{course.title}</h3>
            <p className="course-meta">{course.modules} module</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${course.progress}%` }} />
            </div>
            <div className="course-footer">
              <span className="progress-text">{course.progress}% completat</span>
              <button className="btn-ghost">Deschide</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
