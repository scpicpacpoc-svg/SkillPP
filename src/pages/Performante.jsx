import './Page.css';

export default function Performante() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Performanțe</h1>
          <p className="page-subtitle">Urmărește progresul și rezultatele tale de-a lungul timpului.</p>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-value">—</span>
          <span className="stat-label">Scor mediu</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">—</span>
          <span className="stat-label">Quiz-uri completate</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">—</span>
          <span className="stat-label">Certificări</span>
        </div>
      </div>

      <div className="empty-state">
        <div className="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <h2>Nicio activitate încă</h2>
        <p>Performanțele tale vor apărea aici după ce începi un curs.</p>
      </div>
    </div>
  );
}
