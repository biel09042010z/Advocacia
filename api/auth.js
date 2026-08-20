export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body || {};
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64');
    const sig = Buffer.from(email + (process.env.JWT_SECRET || 'secret')).toString('base64');
    return res.status(200).json({ token: `${payload}.${sig}`, email });
  }
  return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
}
