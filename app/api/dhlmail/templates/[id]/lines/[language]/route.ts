import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const MIDDLEWARE_URL = process.env.MIDDLEWARE_URL;
const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "auth_token";

// GET /api/dhlmail/templates/[id]/lines/[language] - Get a specific template line
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; language: string }> }
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

    const { id, language } = await params;

    const response = await fetch(
      `${MIDDLEWARE_URL}/api/dhlmail/templates/${id}/lines/${language}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to fetch template line" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get template line error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching template line" },
      { status: 500 }
    );
  }
}

// PUT /api/dhlmail/templates/[id]/lines/[language] - Update a template line
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; language: string }> }
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

    const { id, language } = await params;
    const body = await request.json();

    const response = await fetch(
      `${MIDDLEWARE_URL}/api/dhlmail/templates/${id}/lines/${language}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to update template line" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Update template line error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating template line" },
      { status: 500 }
    );
  }
}

// DELETE /api/dhlmail/templates/[id]/lines/[language] - Delete a template line
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; language: string }> }
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

    const { id, language } = await params;

    const response = await fetch(
      `${MIDDLEWARE_URL}/api/dhlmail/templates/${id}/lines/${language}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 204) {
      return NextResponse.json({ success: true });
    }

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { message: data.message || "Failed to delete template line" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete template line error:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting template line" },
      { status: 500 }
    );
  }
}
