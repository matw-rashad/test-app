import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ApiKeysModel, ApiKeyItem, PaginatedApiKeysResponse } from "@/types/api-keys";

const MIDDLEWARE_URL = process.env.MIDDLEWARE_URL;
const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "auth_token";

// API key configurations - defines available keys and their metadata
const API_KEY_CONFIGS: Omit<ApiKeyItem, "value">[] = [
  {
    id: "1",
    name: "ITScope API Key",
    propertyName: "itScopeAPIKey",
    description: "API key for ITScope integration",
  },
  {
    id: "2",
    name: "Seq API Key",
    propertyName: "seqApiKey",
    description: "API key for Seq logging server",
  },
  {
    id: "3",
    name: "DHL Client Key",
    propertyName: "dhlClientKey",
    description: "Client key for DHL API integration",
  },
  {
    id: "4",
    name: "DHL Client Secret",
    propertyName: "dhlClientSecret",
    description: "Client secret for DHL API integration",
  },
];

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const search = searchParams.get("search")?.toLowerCase() || "";

    // Fetch API keys from backend
    const response = await fetch(`${MIDDLEWARE_URL}/api/Credentials/GetApiKeys`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { message: data.message || "Failed to fetch API keys" },
        { status: response.status }
      );
    }

    const apiKeysData: ApiKeysModel = await response.json();

    // Map config to items with values
    let items: ApiKeyItem[] = API_KEY_CONFIGS.map((config) => ({
      ...config,
      value: apiKeysData[config.propertyName as keyof ApiKeysModel] || null,
    }));

    // Apply search filter (by name only)
    if (search) {
      items = items.filter((item) =>
        item.name.toLowerCase().includes(search)
      );
    }

    // Calculate pagination
    const totalCount = items.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = items.slice(startIndex, startIndex + pageSize);

    const result: PaginatedApiKeysResponse = {
      items: paginatedItems,
      totalCount,
      page,
      pageSize,
      totalPages,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get API keys error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching API keys" },
      { status: 500 }
    );
  }
}
