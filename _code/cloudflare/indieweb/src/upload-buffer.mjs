// This Worker has no public routes or workers.dev hostname. Only the main
// publishing service can call its binding; each bounded chunk has its own CPU
// budget, avoiding a multi-megabyte JSON/BLOB conversion in one free invocation.
const CHUNK = 131072;
const ID = /^[0-9a-f]{64}\.(?:jpg|png|gif|webp|avif|mp3|ogg|wav|m4a|mp4|webm|vtt)$/;
export default {
  async fetch(request, env) {
    const u = new URL(request.url);
    if (u.origin !== 'https://upload-buffer.internal' || u.pathname !== '/part' ||
        !env.PUBLISHER_TOKEN || request.headers.get('Authorization') !== `Bearer ${env.PUBLISHER_TOKEN}`) return new Response(null, { status: 401 });
    const id = u.searchParams.get('id'), sequence = Number(u.searchParams.get('sequence'));
    if (!ID.test(id || '') || !Number.isSafeInteger(sequence) || sequence < 0 || sequence >= 40) return new Response(null, { status: 400 });
    if (request.method === 'PUT') {
      if (Number(request.headers.get('Content-Length')) > CHUNK) return new Response(null, { status: 413 });
      const bytes = await request.arrayBuffer();
      if (!bytes.byteLength || bytes.byteLength > CHUNK) return new Response(null, { status: 413 });
      await env.DB.prepare('INSERT OR IGNORE INTO media_chunks (media_id,sequence,data) VALUES (?,?,?)').bind(id, sequence, bytes).run();
      return new Response(null, { status: 204 });
    }
    if (request.method === 'GET') {
      const row = await env.DB.prepare('SELECT data FROM media_chunks WHERE media_id=? AND sequence=?').bind(id, sequence).first();
      return row ? new Response(new Uint8Array(row.data), { headers: { 'Content-Type': 'application/octet-stream' } }) : new Response(null, { status: 404 });
    }
    return new Response(null, { status: 405 });
  },
};
