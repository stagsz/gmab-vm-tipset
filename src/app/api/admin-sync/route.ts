import { NextResponse } from 'next/server';

// Server-side proxy so the admin UI can trigger a sync without exposing CRON_SECRET client-side.
export async function GET() {
  const secret = process.env.CRON_SECRET;
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  const headers: Record<string, string> = {};
  if (secret) headers['Authorization'] = `Bearer ${secret}`;

  try {
    const res = await fetch(`${baseUrl}/api/sync-scores`, { headers });
    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
