import { json } from '@sveltejs/kit';
import { getDB, generateTraefikConfig } from '$lib/db';
import type { HttpRoute } from '$lib/types';

export async function GET() {
  const db = getDB();
  const httpRoutes: HttpRoute[] = db.prepare('SELECT * FROM http_routes').all() as HttpRoute[];
  return json({ httpRoutes });
}

export async function POST({ request }: { request: Request }) {
  const db = getDB();
  const { name, target, rule }: Omit<HttpRoute, 'id'> = await request.json();

  try {
    const stmt = db.prepare('INSERT INTO http_routes (name, target, rule) VALUES (?, ?, ?)');
    const info = stmt.run(name, target, rule);

    generateTraefikConfig();

    return json({ id: info.lastInsertRowid }, { status: 201 });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return json({ error: 'Route name must be unique' }, { status: 400 });
    }
    throw error;
  }
}
