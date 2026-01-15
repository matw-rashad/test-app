import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const MIDDLEWARE_URL = process.env.MIDDLEWARE_URL;
const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "auth_token";

// GET /api/dhlmail/templates - Get all templates
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

    const response = await fetch(`${MIDDLEWARE_URL}/api/dhlmail/templates`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to fetch DHL mail templates" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get DHL mail templates error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching DHL mail templates" },
      { status: 500 }
    );
  }
}

// POST /api/dhlmail/templates - Create a new template
export async function POST(request: NextRequest) {
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

    const response = await fetch(`${MIDDLEWARE_URL}/api/dhlmail/templates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || "Failed to create DHL mail template",
          errors: data.errors,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      template: data.template || data.data || data,
      message: "DHL mail template created successfully",
    });
  } catch (error) {
    console.error("Create DHL mail template error:", error);
    return NextResponse.json(
      { message: "An error occurred while creating DHL mail template" },
      { status: 500 }
    );
  }
}
