import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const USERS_KEY   = 'skillpp_users';
const SESSION_KEY = 'skillpp_session';

const ADMIN_EMAILS = ['scpicpacpoc@gmail.com'];

function getRole(email) {
  return ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'student';
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function login(email, password) {
    const users = getUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { error: 'Email sau parolă incorecte.' };
    if (found.suspended) return { error: 'Contul tău a fost suspendat. Contactează administratorul.' };

    const role    = getRole(found.email);
    const session = { id: found.id, name: found.name, email: found.email, phone: found.phone, role, plan: found.plan || 'Free' };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { success: true };
  }

  function register(name, email, phone, password) {
    const users = getUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { error: 'Există deja un cont cu acest email.' };
    }
    const role    = getRole(email);
    const newUser = { id: Date.now().toString(), name, email, phone, password, role, plan: 'Free', suspended: false };
    users.push(newUser);
    saveUsers(users);
    const session = { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, role, plan: 'Free' };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { success: true };
  }

  function updateStudent(id, changes) {
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return;
    users[idx] = { ...users[idx], ...changes };
    saveUsers(users);
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateStudent }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
