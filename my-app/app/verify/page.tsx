'use client'

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyPage() {
  // local UI state for email + token verification
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [stage, setStage] = useState<'email' | 'token'>('email');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';

  // send verification code email via /api/send-token
  async function sendToken(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch('/api/send-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to send');
      setMessage('Verification code sent. Check your email.');
      setStage('token');
    } catch (err: any) {
      setError(err?.message || 'Failed to send');
    } finally {
      setLoading(false);
    }
  }

  // verify code and set auth cookie via /api/verify-token
  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch('/api/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Invalid code');
      // Force a full navigation so middleware sees the new cookie
      if (typeof window !== 'undefined') {
        window.location.replace(next);
      } else {
        router.replace(next);
      }
    } catch (err: any) {
      setError(err?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          border: '2px solid #000',
          borderRadius: 8,
          padding: 24,
          background: '#fff',
        }}
      >
        <h1 style={{ textAlign: 'center', margin: 0, marginBottom: 16 }}>Email Verification</h1>

        {stage === 'email' && (
          <form onSubmit={sendToken} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label htmlFor="email" style={{ fontWeight: 600 }}>UIC Email</label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@uic.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: 10, border: '1px solid #000', borderRadius: 6 }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 12px',
                border: '1px solid #000',
                borderRadius: 6,
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              Send Code
            </button>
          </form>
        )}

        {stage === 'token' && (
          <form onSubmit={verify} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 14 }}>Email: <strong>{email}</strong></div>
            <label htmlFor="token" style={{ fontWeight: 600 }}>Enter Code</label>
            <input
              id="token"
              type="text"
              inputMode="numeric"
              required
              placeholder="6-digit code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              style={{ padding: 10, border: '1px solid #000', borderRadius: 6 }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 12px',
                border: '1px solid #000',
                borderRadius: 6,
                background: '#fff',
                cursor: 'pointer', 
              }}
            >
              Verify
            </button>
          </form>
        )}

        {message && <p style={{ color: 'green', marginTop: 12, textAlign: 'center' }}>{message}</p>} {}
        {error && <p style={{ color: 'red', marginTop: 12, textAlign: 'center' }}>{error}</p>} {}
      </div>
    </div>
  );
}
