import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const MIDDLEWARE_URL = process.env.MIDDLEWARE_URL;
const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "auth_token";

// GET /api/dhlmail/templates/[id] - Get template by ID
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

    const response = await fetch(`${MIDDLEWARE_URL}/api/dhlmail/templates/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to fetch DHL mail template" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get DHL mail template error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching DHL mail template" },
      { status: 500 }
    );
  }
}

// PUT /api/dhlmail/templates/[id] - Update template
export async function PUT(
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

    const response = await fetch(`${MIDDLEWARE_URL}/api/dhlmail/templates/${id}`, {
      method: "PUT",
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
          message: data.message || "Failed to update DHL mail template",
          errors: data.errors,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      template: data.template || data.data || data,
      message: "DHL mail template updated successfully",
    });
  } catch (error) {
    console.error("Update DHL mail template error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating DHL mail template" },
      { status: 500 }
    );
  }
}

// DELETE /api/dhlmail/templates/[id] - Delete template
export async function DELETE(
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

    const response = await fetch(`${MIDDLEWARE_URL}/api/dhlmail/templates/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to delete DHL mail template" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: "DHL mail template deleted successfully",
    });
  } catch (error) {
    console.error("Delete DHL mail template error:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting DHL mail template" },
      { status: 500 }
    );
  }
}
