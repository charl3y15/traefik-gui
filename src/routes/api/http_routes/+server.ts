import { json } from '@sveltejs/kit';
import { getDB } from '$lib/db';

export async function GET() {
  const db = getDB();
  const http_routes = db.prepare('SELECT * FROM http_routes').all();
  return json({ http_routes: http_routes });
}


export async function POST({ request }: { request: Request }) {
  const db = getDB();
  const { name, target, rule } = await request.json();

  const stmt = db.prepare('INSERT INTO http_routes (name, target, rule) VALUES (?, ?, ?)');
  const info = stmt.run(name, target, rule);

  return json({ id: info.lastInsertRowid }, { status: 201 });
}

export async function DELETE({ params }: { params: { id: string } }) {
  const db = getDB();
  const stmt = db.prepare('DELETE FROM http_routes WHERE id = ?');
  const info = stmt.run(params.id);

  if (info.changes > 0) {
    return json({ success: true }, { status: 200 });
  } else {
    return json({ error: 'Route not found' }, { status: 404 });
  }
}