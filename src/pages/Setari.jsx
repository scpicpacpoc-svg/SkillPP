import './Page.css';

export default function Setari() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Setări</h1>
          <p className="page-subtitle">Personalizează contul și preferințele tale.</p>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="settings-title">Profil</h2>
        <div className="settings-group">
          <div className="settings-row">
            <div className="settings-info">
              <span className="settings-label">Nume complet</span>
              <span className="settings-value">Utilizator SkillPP</span>
            </div>
            <button className="btn-ghost">Editează</button>
          </div>
          <div className="settings-row">
            <div className="settings-info">
              <span className="settings-label">Email</span>
              <span className="settings-value">—</span>
            </div>
            <button className="btn-ghost">Editează</button>
          </div>
          <div className="settings-row">
            <div className="settings-info">
              <span className="settings-label">Parolă</span>
              <span className="settings-value">••••••••</span>
            </div>
            <button className="btn-ghost">Schimbă</button>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="settings-title">Notificări</h2>
        <div className="settings-group">
          <div className="settings-row">
            <div className="settings-info">
              <span className="settings-label">Notificări email</span>
              <span className="settings-value muted">Primești actualizări despre cursuri</span>
            </div>
            <div className="toggle toggle--off">
              <div className="toggle-thumb" />
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-info">
              <span className="settings-label">Reminder-uri săptămânale</span>
              <span className="settings-value muted">Reamintire să continui cursul</span>
            </div>
            <div className="toggle toggle--off">
              <div className="toggle-thumb" />
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="settings-title">Cont</h2>
        <div className="settings-group">
          <div className="settings-row danger">
            <div className="settings-info">
              <span className="settings-label">Ștergere cont</span>
              <span className="settings-value muted">Acțiune ireversibilă</span>
            </div>
            <button className="btn-danger" disabled>Șterge</button>
          </div>
        </div>
      </div>
    </div>
  );
}
