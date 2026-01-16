import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const MIDDLEWARE_URL = process.env.MIDDLEWARE_URL;
const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "auth_token";

// GET /api/dhlmail/templates/[id]/full - Get template with all its lines
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

    const response = await fetch(`${MIDDLEWARE_URL}/api/dhlmail/templates/${id}/full`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to fetch DHL mail template with lines" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get DHL mail template with lines error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching DHL mail template" },
      { status: 500 }
    );
  }
}
