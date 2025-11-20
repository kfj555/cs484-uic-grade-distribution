import { NextResponse } from 'next/server';
import { getToken, deleteToken } from '@/lib/tokenStore';

function maskEmail(email: string) {
  const [user, domain] = email.split('@');
  if (!domain) return email;
  const u = user || '';
  const maskedUser = u.length <= 2 ? u[0] + '*' : u[0] + '*'.repeat(Math.max(1, u.length - 2)) + u[u.length - 1];
  return maskedUser + '@' + domain;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = (body?.email || '').trim();
    const token = (body?.token || '').trim();

    if (!email || !token) {
      return NextResponse.json({ ok: false, error: 'Email and token required' }, { status: 400 });
    }

    const rec = getToken(email);
    if (!rec || rec.token !== token) {
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[verify] token mismatch', { email: maskEmail(email), found: !!rec });
      }
      return NextResponse.json({ ok: false, error: 'Invalid or expired token' }, { status: 400 });
    }

    // Invalidate the token
    deleteToken(email);

    const res = NextResponse.json({ ok: true });
    res.cookies.set('is_uic_verified', 'true', {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    if (process.env.NODE_ENV !== 'production') {
      console.debug('[verify] success', { email: maskEmail(email) });
    }
    return res;
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Verification failed' }, { status: 500 });
  }
}
