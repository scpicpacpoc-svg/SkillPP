import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendVerificationSMS, generateCode, formatPhone } from '../services/smsService';
import './Login.css';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // 'login' | 'register' | 'verify'
  const [tab, setTab]       = useState('login');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm]     = useState({ name: '', email: '', phone: '', password: '', confirm: '' });

  // Verification state
  const [digits, setDigits]       = useState(['', '', '', '', '']);
  const [pendingCode, setPendingCode] = useState('');
  const [pendingData, setPendingData] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef([]);
  const timerRef  = useRef(null);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  function startTimer() {
    setResendTimer(60);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
  }

  function handle(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  function switchTab(t) {
    setTab(t);
    setError('');
    setForm({ name: '', email: '', phone: '', password: '', confirm: '' });
  }

  // OTP digit input handling
  function handleDigit(i, val) {
    const v = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    setError('');
    if (v && i < 4) inputRefs.current[i + 1]?.focus();
  }

  function handleDigitKey(i, e) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && i > 0) inputRefs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < 4) inputRefs.current[i + 1]?.focus();
  }

  function handleDigitPaste(e) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 5);
    if (!text) return;
    e.preventDefault();
    const next = ['', '', '', '', ''];
    text.split('').forEach((ch, idx) => { next[idx] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(text.length, 4)]?.focus();
  }

  // Submit login
  async function submitLogin(e) {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Completează toate câmpurile.'); return; }
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.error) setError(result.error);
    else navigate('/cursuri');
  }

  // Submit register → send SMS
  async function submitRegister(e) {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.phone || !form.password || !form.confirm) {
      setError('Completează toate câmpurile.'); return;
    }
    const phoneDigits = form.phone.replace(/\D/g, '');
    if (phoneDigits.length < 9) {
      setError('Numărul de telefon nu este valid.'); return;
    }
    if (form.password.length < 6) {
      setError('Parola trebuie să aibă cel puțin 6 caractere.'); return;
    }
    if (form.password !== form.confirm) {
      setError('Parolele nu coincid.'); return;
    }

    setLoading(true);
    try {
      const code = generateCode();
      await sendVerificationSMS(form.phone, code);
      setPendingCode(code);
      setPendingData({ ...form });
      setDigits(['', '', '', '', '']);
      setTab('verify');
      startTimer();
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError('Nu am putut trimite SMS-ul. Verifică numărul și încearcă din nou.');
      console.error(err);
    }
    setLoading(false);
  }

  // Resend SMS
  async function resendCode() {
    if (resendTimer > 0) return;
    setLoading(true);
    setError('');
    try {
      const code = generateCode();
      await sendVerificationSMS(pendingData.phone, code);
      setPendingCode(code);
      setDigits(['', '', '', '', '']);
      startTimer();
      inputRefs.current[0]?.focus();
    } catch {
      setError('Eroare la retrimite SMS. Încearcă din nou.');
    }
    setLoading(false);
  }

  // Verify code → create account
  function submitVerify(e) {
    e.preventDefault();
    const entered = digits.join('');
    if (entered.length < 5) { setError('Introdu cele 5 cifre.'); return; }
    if (entered !== pendingCode) { setError('Cod incorect. Verifică SMS-ul și încearcă din nou.'); return; }

    const result = register(pendingData.name, pendingData.email, pendingData.phone, pendingData.password);
    if (result.error) setError(result.error);
    else navigate('/cursuri');
  }

  // ── RENDER VERIFY ──────────────────────────────────────────────
  if (tab === 'verify') {
    const maskedPhone = formatPhone(pendingData?.phone || '').replace(/(\+\d{2})\d{4}(\d{3})/, '$1****$2');

    return (
      <div className="login-page">
        <div className="login-bg" aria-hidden="true">
          <div className="bg-orb bg-orb--1" />
          <div className="bg-orb bg-orb--2" />
        </div>

        <div className="login-card">
          <div className="login-brand">Skill<span>PP</span></div>

          <div className="verify-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h2 className="verify-title">Verifică numărul de telefon</h2>
          <p className="verify-subtitle">
            Am trimis un cod de 5 cifre la<br />
            <strong>{maskedPhone}</strong>
          </p>

          <form className="login-form" onSubmit={submitVerify} noValidate>
            <div className="otp-row" onPaste={handleDigitPaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  className="otp-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleDigit(i, e.target.value)}
                  onKeyDown={(e) => handleDigitKey(i, e)}
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            {error && <div className="login-error">{error}</div>}

            <button className="login-submit" type="submit" disabled={loading}>
              Verifică contul
            </button>
          </form>

          <div className="verify-resend">
            {resendTimer > 0 ? (
              <span className="resend-timer">Retrimite codul în {resendTimer}s</span>
            ) : (
              <button type="button" onClick={resendCode} disabled={loading}>
                Retrimite codul
              </button>
            )}
          </div>

          <button
            type="button"
            className="verify-back"
            onClick={() => { setTab('register'); setError(''); }}
          >
            ← Înapoi
          </button>
        </div>
      </div>
    );
  }

  // ── RENDER LOGIN / REGISTER ─────────────────────────────────────
  return (
    <div className="login-page">
      <div className="login-bg" aria-hidden="true">
        <div className="bg-orb bg-orb--1" />
        <div className="bg-orb bg-orb--2" />
      </div>

      <div className="login-card">
        <div className="login-brand">Skill<span>PP</span></div>
        <p className="login-tagline">Platforma ta de dezvoltare profesională</p>

        <div className="login-tabs">
          <button
            className={`tab-btn ${tab === 'login' ? 'tab-btn--active' : ''}`}
            onClick={() => switchTab('login')}
            type="button"
          >
            Autentificare
          </button>
          <button
            className={`tab-btn ${tab === 'register' ? 'tab-btn--active' : ''}`}
            onClick={() => switchTab('register')}
            type="button"
          >
            Cont nou
          </button>
        </div>

        <form
          className="login-form"
          onSubmit={tab === 'login' ? submitLogin : submitRegister}
          noValidate
        >
          {tab === 'register' && (
            <div className="field">
              <label htmlFor="name">Nume complet</label>
              <input
                id="name" name="name" type="text"
                placeholder="Ion Popescu"
                value={form.name} onChange={handle}
                autoComplete="name"
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email"
              placeholder="email@exemplu.com"
              value={form.email} onChange={handle}
              autoComplete="email"
            />
          </div>

          {tab === 'register' && (
            <div className="field">
              <label htmlFor="phone">Număr de telefon</label>
              <div className="phone-field">
                <span className="phone-prefix">+40</span>
                <input
                  id="phone" name="phone" type="tel"
                  placeholder="740 123 456"
                  value={form.phone} onChange={handle}
                  autoComplete="tel"
                />
              </div>
            </div>
          )}

          <div className="field">
            <label htmlFor="password">
              Parolă
              {tab === 'login' && <span className="forgot-link">Ai uitat parola?</span>}
            </label>
            <input
              id="password" name="password" type="password"
              placeholder={tab === 'register' ? 'Minim 6 caractere' : '••••••••'}
              value={form.password} onChange={handle}
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {tab === 'register' && (
            <div className="field">
              <label htmlFor="confirm">Confirmă parola</label>
              <input
                id="confirm" name="confirm" type="password"
                placeholder="••••••••"
                value={form.confirm} onChange={handle}
                autoComplete="new-password"
              />
            </div>
          )}

          {error && <div className="login-error">{error}</div>}

          <button className="login-submit" type="submit" disabled={loading}>
            {loading
              ? tab === 'register' ? 'Se trimite SMS...' : 'Se încarcă...'
              : tab === 'login' ? 'Intră în cont' : 'Continuă'}
          </button>
        </form>

        <p className="login-switch">
          {tab === 'login' ? (
            <>Nu ai cont?{' '}
              <button type="button" onClick={() => switchTab('register')}>Înregistrează-te</button>
            </>
          ) : (
            <>Ai deja cont?{' '}
              <button type="button" onClick={() => switchTab('login')}>Autentifică-te</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
