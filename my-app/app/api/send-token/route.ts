import { NextResponse } from 'next/server';
import { setToken } from '@/lib/tokenStore';
import { sendVerificationEmail } from '@/lib/mailer';

function isUICEmail(email: string) {
  return /@uic\.edu$/i.test(email);
}

function generateToken() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawEmail = (body?.email || '').trim();

    if (!rawEmail) {
      return NextResponse.json({ ok: false, error: 'Email required' }, { status: 400 });
    }

    if (!isUICEmail(rawEmail)) {
      return NextResponse.json({ ok: false, error: 'Must use @uic.edu email' }, { status: 400 });
    }

    const token = generateToken();
    const ttlMs = 10 * 60 * 1000; // 10 minutes
    setToken(rawEmail, token, ttlMs);

    await sendVerificationEmail(rawEmail, token);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to send token' }, { status: 500 });
  }
}
