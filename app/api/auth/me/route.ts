import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.API_URL || 'http://localhost:85';
const COOKIE_NAME = process.env.JWT_COOKIE_NAME || 'auth_token';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Call your .NET API to get the current user
    const response = await fetch(`${API_URL}/api/auth/GetCurrentUser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Token might be expired or invalid
      if (response.status === 401) {
        cookieStore.delete(COOKIE_NAME);
      }
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await response.json();
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}
