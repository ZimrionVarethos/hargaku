import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, createSignedAdminToken } from '@/lib/server/admin-session';
import { DEFAULT_ADMIN_USER } from '@/lib/store/admin-seed';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { email?: string; password?: string; rememberMe?: boolean };
    const email = (body.email || '').trim().toLowerCase();
    const password = (body.password || '').trim();

    const validEmail =
      email === 'admin@hargaku.id' ||
      email === 'admin' ||
      email === DEFAULT_ADMIN_USER.email.toLowerCase();
    const validPass = password === 'admin' || password === 'admin123' || password === 'admin2026!';

    if (!validEmail || !validPass) {
      return NextResponse.json(
        { success: false, message: 'Email atau kata sandi tidak valid.' },
        { status: 401 }
      );
    }

    const token = createSignedAdminToken(DEFAULT_ADMIN_USER.email);
    const response = NextResponse.json({
      success: true,
      message: 'Login administrator berhasil.',
      data: {
        token,
        user: DEFAULT_ADMIN_USER,
      },
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: body.rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: 'Permintaan login tidak valid.' },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Sesi diakhiri.' });
  response.cookies.set(ADMIN_COOKIE_NAME, '', { path: '/', maxAge: 0 });
  return response;
}

