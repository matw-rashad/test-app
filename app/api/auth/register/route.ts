import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.API_URL || 'http://localhost:85';
const COOKIE_NAME = process.env.JWT_COOKIE_NAME || 'auth_token';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Registration failed', errors: data.errors },
        { status: response.status }
      );
    }

    // If the API returns a token on registration, set the cookie
    if (data.token) {
      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NAME, data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: data.expiresIn || 60 * 60 * 24 * 7,
        path: '/',
      });
    }

    return NextResponse.json({
      user: data.user,
      message: 'Registration successful',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
