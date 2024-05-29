import { json } from '@sveltejs/kit';
import { getDB } from '$lib/db';

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