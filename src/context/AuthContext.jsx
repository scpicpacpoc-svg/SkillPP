import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

const ADMIN_EMAILS = ['scpicpacpoc@gmail.com'];

function getRole(email) {
  return ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'student';
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) loadProfile(session.user);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) await loadProfile(session.user);
        else { setUser(null); setLoading(false); }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(authUser) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (profile?.suspended) {
      await supabase.auth.signOut();
      setUser(null);
      setLoading(false);
      return;
    }

    if (profile) {
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: profile.name,
        phone: profile.phone,
        role: profile.role,
        plan: profile.plan,
        suspended: profile.suspended,
      });
    }
    setLoading(false);
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: 'Email sau parolă incorecte.' };

    const { data: profile } = await supabase
      .from('profiles')
      .select('suspended')
      .eq('id', data.user.id)
      .single();

    if (profile?.suspended) {
      await supabase.auth.signOut();
      return { error: 'Contul tău a fost suspendat. Contactează administratorul.' };
    }

    return { success: true };
  }

  async function register(name, email, phone, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      if (error.message.toLowerCase().includes('already')) {
        return { error: 'Există deja un cont cu acest email.' };
      }
      return { error: error.message };
    }

    const role = getRole(email);
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      name,
      phone,
      role,
      plan: 'Free',
      suspended: false,
    });

    if (profileError) return { error: 'Eroare la crearea profilului.' };
    return { success: true };
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  async function updateStudent(id, changes) {
    const { data: { session } } = await supabase.auth.getSession();

    const res = await fetch('/.netlify/functions/admin-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ userId: id, changes }),
    });

    if (!res.ok) throw new Error('Update failed');
    return { success: true };
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
