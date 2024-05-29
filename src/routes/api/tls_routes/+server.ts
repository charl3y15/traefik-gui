import { json } from '@sveltejs/kit';
import { getDB } from '$lib/db';
import type { HttpRoute, TlsRoute } from '$lib/types';
import type { SqliteError } from 'better-sqlite3';

export async function GET() {
  const db = getDB();
  const tls_routes: TlsRoute[] = db.listTlsRoutes();
  return json({ tls_routes });
}

export async function POST({ request }: { request: Request }) {
  const db = getDB();

  const route: Omit<TlsRoute, 'id'> = await request.json();

  try {
    const id = db.newTlsRoute(route);

    return json({ id: id }, { status: 201 });
  } catch (error: SqliteError | any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return json({ error: 'Route name must be unique' }, { status: 400 });
    }
    throw error;
  }
}
