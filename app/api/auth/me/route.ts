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

    // Create abort controller with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      // Call your .NET API to get the current user
      const response = await fetch(`${API_URL}/api/auth/GetCurrentUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

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
    } catch (fetchError) {
      clearTimeout(timeoutId);

      // Handle abort/timeout or connection errors
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('API request timed out');
      } else {
        console.error('API connection error:', fetchError);
      }

      return NextResponse.json(
        { message: 'Unable to connect to authentication server' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}
