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

  if (req.method === 'GET') {
    const rows = await db`SELECT * FROM equipe ORDER BY ordem ASC`;
    return res.status(200).json(rows);
  }
  if (!verify(req)) return res.status(401).json({ error: 'Não autorizado.' });

  if (req.method === 'POST') {
    const { nome, oab, especialidade, cargo, bio, ordem } = req.body;
    const [row] = await db`INSERT INTO equipe (nome,oab,especialidade,cargo,bio,ordem) VALUES (${nome},${oab},${especialidade},${cargo},${bio},${ordem ?? 0}) RETURNING *`;
    return res.status(201).json(row);
  }
  if (req.method === 'PATCH') {
    const { id, nome, oab, especialidade, cargo, bio } = req.body;
    await db`UPDATE equipe SET nome=${nome},oab=${oab},especialidade=${especialidade},cargo=${cargo},bio=${bio} WHERE id=${id}`;
    return res.status(200).json({ ok: true });
  }
  if (req.method === 'DELETE') {
    await db`DELETE FROM equipe WHERE id=${req.body.id}`;
    return res.status(200).json({ ok: true });
  }
  res.status(405).end();
}
