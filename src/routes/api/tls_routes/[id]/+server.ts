import { json } from '@sveltejs/kit';
import { getDB } from '$lib/db';
import type { TlsRoute } from '$lib/types';

export async function DELETE({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const db = getDB();
  let success = db.deleteTlsRoute(id);
  if (success) {
    return json({ success: true }, { status: 200 });
  } else {
    return json({ error: 'Route not found' }, { status: 404 });
  }
}

export async function POST({ request, params }: { request: Request, params: { id: string } }) {
  const id = parseInt(params.id);
  const db = getDB();

  const route: Partial<TlsRoute> = await request.json();

  let success = db.updateTlsRoute(id, route);
  if (success) {
    return json({ success: true }, { status: 200 });
  } else {
    return json({ error: 'Route not found' }, { status: 404 });
  }
}