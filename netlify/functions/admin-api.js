import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL     = process.env.VITE_SUPABASE_URL;
const ANON_KEY         = process.env.VITE_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function verifyAdmin(token) {
  const client = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return null;

  const { data: profile } = await client
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return profile?.role === 'admin' ? user : null;
}

export default async (event) => {
  const token = (event.headers.authorization || '').replace('Bearer ', '');
  if (!token) return { statusCode: 401, body: 'Unauthorized' };

  const admin = await verifyAdmin(token);
  if (!admin) return { statusCode: 403, body: 'Forbidden' };

  const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  if (event.httpMethod === 'GET') {
    const { data, error } = await adminClient
      .from('profiles')
      .select('*')
      .neq('role', 'admin')
      .order('created_at', { ascending: false });

    if (error) return { statusCode: 500, body: JSON.stringify({ error }) };
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  }

  if (event.httpMethod === 'POST') {
    const { userId, changes } = JSON.parse(event.body);
    const { error } = await adminClient
      .from('profiles')
      .update(changes)
      .eq('id', userId);

    if (error) return { statusCode: 500, body: JSON.stringify({ error }) };
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
