import './Page.css';

const faqs = [
  { q: 'Cum accesez un curs?', a: 'Mergi la secțiunea Cursuri și apasă pe butonul Deschide de lângă cursul dorit.' },
  { q: 'Pot descărca materialele?', a: 'Funcționalitatea de descărcare va fi disponibilă în curând.' },
  { q: 'Cum obțin un certificat?', a: 'Certificatele se acordă automat la finalizarea tuturor modulelor unui curs.' },
];

export default function Suport() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Suport</h1>
          <p className="page-subtitle">Găsește răspunsuri sau contactează echipa noastră.</p>
        </div>
      </div>

      <div className="support-grid">
        <div className="support-card">
          <div className="support-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h3>Întrebări frecvente</h3>
          <p>Răspunsuri la cele mai comune întrebări.</p>
        </div>
        <div className="support-card">
          <div className="support-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h3>Chat live</h3>
          <p>Discută direct cu un membru al echipei.</p>
        </div>
        <div className="support-card">
          <div className="support-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h3>Email</h3>
          <p>Trimite-ne un mesaj și îți răspundem în 24h.</p>
        </div>
      </div>

      <div className="section-label" style={{ marginTop: '40px' }}>Întrebări frecvente</div>
      <div className="faq-list">
        {faqs.map((item, i) => (
          <div key={i} className="faq-item">
            <h3 className="faq-question">{item.q}</h3>
            <p className="faq-answer">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
