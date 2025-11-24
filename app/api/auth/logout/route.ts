import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const COOKIE_NAME = process.env.JWT_COOKIE_NAME || 'auth_token';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}
