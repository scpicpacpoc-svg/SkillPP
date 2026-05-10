exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { phone, code } = JSON.parse(event.body);
    const message = `Codul tau de verificare SkillPP este: ${code}. Valabil 10 minute.`;

    const response = await fetch('https://www.smsadvert.ro/api/sms/', {
      method: 'POST',
      headers: {
        Authorization: process.env.SMSADVERT_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone,
        shortTextMessage: message,
        sendAsShort: true,
        failover: 'short',
      }),
    });

    const data = await response.json();
    return {
      statusCode: response.ok ? 200 : 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
