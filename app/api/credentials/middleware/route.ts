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

    const response = await fetch(`${MIDDLEWARE_URL}/api/Credentials/middleware`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await response.text();

    if (!response.ok) {
      let message = "Failed to fetch Middleware settings";
      try {
        const errorData = text ? JSON.parse(text) : {};
        message = errorData.message || message;
      } catch {
        // Response is not JSON, use default message
      }
      return NextResponse.json({ message }, { status: response.status });
    }

    if (!text) {
      return NextResponse.json(
        { message: "Empty response from server" },
        { status: 500 }
      );
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
    console.error("Get Middleware settings error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching Middleware settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${MIDDLEWARE_URL}/api/Credentials/middleware`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    if (!response.ok) {
      let message = "Failed to update Middleware settings";
      try {
        const errorData = text ? JSON.parse(text) : {};
        message = errorData.message || message;
      } catch {
        // Response is not JSON, use default message
      }
      return NextResponse.json({ message }, { status: response.status });
    }

    if (!text) {
      return NextResponse.json({ message: "Middleware settings updated successfully" });
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch {
      return NextResponse.json({ message: "Middleware settings updated successfully" });
    }
  } catch (error) {
    console.error("Update Middleware settings error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating Middleware settings" },
      { status: 500 }
    );
  }
}
