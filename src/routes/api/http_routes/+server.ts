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

  try {
    const stmt = db.prepare('INSERT INTO http_routes (name, target, rule) VALUES (?, ?, ?)');
    const info = stmt.run(name, target, rule);

    return json({ id: info.lastInsertRowid }, { status: 201 });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return json({ error: 'Route name must be unique' }, { status: 400 });
    }
    throw error;
  }
}
