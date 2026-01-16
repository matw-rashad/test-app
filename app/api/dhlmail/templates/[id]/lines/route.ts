import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const MIDDLEWARE_URL = process.env.MIDDLEWARE_URL;
const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "auth_token";

// GET /api/dhlmail/templates/[id]/lines - Get all lines for a template
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const response = await fetch(`${MIDDLEWARE_URL}/api/dhlmail/templates/${id}/lines`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to fetch template lines" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get template lines error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching template lines" },
      { status: 500 }
    );
  }
}

// POST /api/dhlmail/templates/[id]/lines - Create a new template line
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const response = await fetch(`${MIDDLEWARE_URL}/api/dhlmail/templates/${id}/lines`, {
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
        { message: data.message || "Failed to create template line" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Create template line error:", error);
    return NextResponse.json(
      { message: "An error occurred while creating template line" },
      { status: 500 }
    );
  }
}
