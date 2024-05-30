import { json } from '@sveltejs/kit';
import { getDB } from '$lib/db';
import type { Stats } from '$lib/types';

export async function GET() {
    const db = getDB();
    const stats: Stats = {
        http_routes: db.listHttpRoutes().length,
        tls_routes: db.listTlsRoutes().length
    }
    return json({ stats });
}