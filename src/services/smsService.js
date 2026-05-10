export function generateCode() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

export function formatPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('40')) return `+${digits}`;
  if (digits.startsWith('0')) return `+4${digits}`;
  return `+40${digits}`;
}

export async function sendVerificationSMS(phone, code) {
  const formatted = formatPhone(phone);

  const response = await fetch('/.netlify/functions/send-sms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: formatted, code }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`SMS error ${response.status}: ${text}`);
  }

  return await response.json();
}
