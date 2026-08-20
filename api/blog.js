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
    const isAdmin = verify(req) && req.query?.all === '1';
    const rows = isAdmin
      ? await db`SELECT * FROM blog_artigos ORDER BY criado_em DESC`
      : await db`SELECT * FROM blog_artigos WHERE publicado=true ORDER BY criado_em DESC`;
    return res.status(200).json(rows);
  }
  if (!verify(req)) return res.status(401).json({ error: 'Não autorizado.' });

  if (req.method === 'POST') {
    const { titulo, categoria, leitura, resumo, conteudo, publicado } = req.body;
    const [row] = await db`INSERT INTO blog_artigos (titulo,categoria,leitura,resumo,conteudo,publicado) VALUES (${titulo},${categoria},${leitura},${resumo},${conteudo},${publicado ?? false}) RETURNING *`;
    return res.status(201).json(row);
  }
  if (req.method === 'PATCH') {
    const { id, titulo, categoria, leitura, resumo, conteudo, publicado } = req.body;
    await db`UPDATE blog_artigos SET titulo=${titulo},categoria=${categoria},leitura=${leitura},resumo=${resumo},conteudo=${conteudo},publicado=${publicado} WHERE id=${id}`;
    return res.status(200).json({ ok: true });
  }
  if (req.method === 'DELETE') {
    await db`DELETE FROM blog_artigos WHERE id=${req.body.id}`;
    return res.status(200).json({ ok: true });
  }
  res.status(405).end();
}
