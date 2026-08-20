import { neon } from '@neondatabase/serverless';

function verify(req) {
  try {
    const token = (req.headers['authorization'] || '').replace('Bearer ', '');
    if (!token) return false;
    const payload = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString());
    return payload.exp > Date.now();
  } catch { return false; }
}

export default async function handler(req, res) {
  const db = neon(process.env.DATABASE_URL);

  // POST público — formulário do site
  if (req.method === 'POST' && !req.headers['authorization']) {
    const { nome, telefone, email, area, mensagem } = req.body;
    if (!nome || !telefone) return res.status(400).json({ error: 'Nome e telefone obrigatórios.' });
    const [row] = await db`INSERT INTO mensagens_contato (nome,telefone,email,area,mensagem) VALUES (${nome},${telefone},${email},${area},${mensagem}) RETURNING id`;
    return res.status(201).json(row);
  }
  if (!verify(req)) return res.status(401).json({ error: 'Não autorizado.' });

  if (req.method === 'GET') {
    const rows = await db`SELECT * FROM mensagens_contato ORDER BY criado_em DESC`;
    return res.status(200).json(rows);
  }
  if (req.method === 'PATCH') {
    await db`UPDATE mensagens_contato SET lida=${req.body.lida} WHERE id=${req.body.id}`;
    return res.status(200).json({ ok: true });
  }
  if (req.method === 'DELETE') {
    await db`DELETE FROM mensagens_contato WHERE id=${req.body.id}`;
    return res.status(200).json({ ok: true });
  }
  res.status(405).end();
}
