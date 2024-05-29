import { json } from '@sveltejs/kit';
import { getDB } from '$lib/db';

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