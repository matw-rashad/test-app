import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const MIDDLEWARE_URL = process.env.MIDDLEWARE_URL;
const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "auth_token";

export async function DELETE(
  request: Request,
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

    const response = await fetch(`${MIDDLEWARE_URL}/api/dhlmail/statuses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return NextResponse.json({ success: true });
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to delete DHL status" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Delete DHL status error:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting DHL status" },
      { status: 500 }
    );
  }
}
