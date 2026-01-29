import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const MIDDLEWARE_URL = process.env.MIDDLEWARE_URL;
const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "auth_token";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const response = await fetch(`${MIDDLEWARE_URL}/api/Configuration/scheduled-jobs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await response.text();

    if (!response.ok) {
      let message = "Failed to fetch scheduled jobs";
      try {
        const errorData = text ? JSON.parse(text) : {};
        message = errorData.message || message;
      } catch {
        // Response is not JSON, use default message
      }
      return NextResponse.json({ message }, { status: response.status });
    }

    if (!text) {
      return NextResponse.json([]);
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch {
      return NextResponse.json(
        { message: "Invalid response from server" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Get scheduled jobs error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching scheduled jobs" },
      { status: 500 }
    );
  }
}
