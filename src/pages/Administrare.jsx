import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import './Page.css';
import './Administrare.css';

const PLANS = ['Free', 'Basic', 'Expert'];

const planStyle = {
  Free:   { color: '#9A9A9A', bg: 'rgba(154,154,154,0.1)', border: 'rgba(154,154,154,0.2)' },
  Basic:  { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.2)'  },
  Expert: { color: '#C9A84C', bg: 'rgba(201,168,76,0.1)',  border: 'rgba(201,168,76,0.2)'  },
};

async function fetchStudents() {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch('/.netlify/functions/admin-api', {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (!res.ok) return [];
  return res.json();
}

export default function Administrare() {
  const { updateStudent } = useAuth();
  const [students, setStudents] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [planMenu, setPlanMenu] = useState(null);

  const refresh = useCallback(async () => {
    const data = await fetchStudents();
    setStudents(data);
    setLoadingData(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function toggleSuspend(student) {
    await updateStudent(student.id, { suspended: !student.suspended });
    refresh();
  }

  async function changePlan(student, plan) {
    await updateStudent(student.id, { plan });
    setPlanMenu(null);
    refresh();
  }

  const active    = students.filter((s) => !s.suspended).length;
  const suspended = students.filter((s) =>  s.suspended).length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Administrare</h1>
          <p className="page-subtitle">Gestionează studenții și planurile lor de acces.</p>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-value">{students.length}</span>
          <span className="stat-label">Total studenți</span>
        </div>
        <div className="stat-card">
          <span className="stat-value" style={{ color: '#4ade80' }}>{active}</span>
          <span className="stat-label">Conturi active</span>
        </div>
        <div className="stat-card">
          <span className="stat-value" style={{ color: '#f87171' }}>{suspended}</span>
          <span className="stat-label">Conturi suspendate</span>
        </div>
      </div>

      <div className="section-label">Studenți înregistrați</div>

      {loadingData ? (
        <div className="empty-state">
          <p>Se încarcă...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h2>Niciun student înregistrat</h2>
          <p>Studenții vor apărea aici după ce își creează cont pe platformă.</p>
        </div>
      ) : (
        <div className="students-table">
          <div className="table-header">
            <span>Nume</span>
            <span>Email</span>
            <span>Telefon</span>
            <span>Plan</span>
            <span>Status</span>
            <span>Acțiuni</span>
          </div>

          {students.map((student) => {
            const plan   = student.plan || 'Free';
            const ps     = planStyle[plan];
            const isOpen = planMenu === student.id;

            return (
              <div key={student.id} className={`table-row ${student.suspended ? 'table-row--suspended' : ''}`}>
                <div className="student-name">
                  <div className="student-avatar">
                    {student.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'S'}
                  </div>
                  <span>{student.name}</span>
                </div>

                <span className="student-email">{student.phone ? student.phone : '—'}</span>
                <span className="student-phone">{student.phone || '—'}</span>

                <div className="plan-cell">
                  <div className="plan-dropdown-wrap">
                    <button
                      className="plan-badge"
                      style={{ color: ps.color, background: ps.bg, borderColor: ps.border }}
                      onClick={() => setPlanMenu(isOpen ? null : student.id)}
                    >
                      {plan}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="plan-menu">
                        {PLANS.map((p) => (
                          <button
                            key={p}
                            className={`plan-option ${p === plan ? 'plan-option--active' : ''}`}
                            style={{ color: planStyle[p].color }}
                            onClick={() => changePlan(student, p)}
                          >
                            {p}
                            {p === plan && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <span className={`status-badge ${student.suspended ? 'status-badge--suspended' : 'status-badge--active'}`}>
                  {student.suspended ? 'Suspendat' : 'Activ'}
                </span>

                <button
                  className={`action-btn ${student.suspended ? 'action-btn--activate' : 'action-btn--suspend'}`}
                  onClick={() => toggleSuspend(student)}
                >
                  {student.suspended ? 'Activează' : 'Suspendă'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
