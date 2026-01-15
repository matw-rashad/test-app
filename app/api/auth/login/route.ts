import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

//const API_URL = process.env.API_URL || 'http://localhost:85';
const AUTH_API_URL = process.env.AUTH_API_URL;
const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "auth_token";
const COOKIE_SECURE = process.env.COOKIE_SECURE !== "false";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${AUTH_API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Login failed", errors: data.errors },
        { status: response.status }
      );
    }

    // Set HTTP-only cookie with the JWT token
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, data.token, {
      httpOnly: true,
      secure: COOKIE_SECURE,
      sameSite: "lax",
      maxAge: data.expiresIn || 60 * 60 * 24 * 7, // Default 7 days
      path: "/",
    });

    // Return user data without the token (it's in the cookie)
    return NextResponse.json({
      user: data.user,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
