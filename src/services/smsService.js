const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OWJkMzQ2OTU3NWYzOGM1MWQzZjA4OWQifQ.hebrgpioNcyXA4pOAJnGwS13qrZ5dV9bzmJXapQr-w4';

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
  const message = `Codul tau de verificare SkillPP este: ${code}. Valabil 10 minute.`;

  const response = await fetch('/smsapi/sms/', {
    method: 'POST',
    headers: {
      'Authorization': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone: formatted,
      shortTextMessage: message,
      sendAsShort: true,
      failover: 'short',
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`SMS API error ${response.status}: ${text}`);
  }

  return await response.json();
}
