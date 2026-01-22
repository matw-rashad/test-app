import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const MIDDLEWARE_URL = process.env.MIDDLEWARE_URL;
const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "auth_token";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ jobName: string }> }
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

    const { jobName } = await params;

    const response = await fetch(
      `${MIDDLEWARE_URL}/api/Configuration/cronjobs/${encodeURIComponent(jobName)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to fetch cron job" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get cron job error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching cron job" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ jobName: string }> }
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

    const { jobName } = await params;
    const body = await request.json();

    const response = await fetch(
      `${MIDDLEWARE_URL}/api/Configuration/cronjobs/${encodeURIComponent(jobName)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to update cron job" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Update cron job error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating cron job" },
      { status: 500 }
    );
  }
}
