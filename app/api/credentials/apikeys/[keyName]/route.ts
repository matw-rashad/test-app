import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const MIDDLEWARE_URL = process.env.MIDDLEWARE_URL;
const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "auth_token";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ keyName: string }> }
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

    const { keyName } = await params;
    const value = await request.json();

    const response = await fetch(
      `${MIDDLEWARE_URL}/api/Credentials/UpdateApiKey/${keyName}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || `Failed to update API key: ${keyName}` },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Update API key error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating API key" },
      { status: 500 }
    );
  }
}
