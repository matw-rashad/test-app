export interface ApiKeysModel {
  itScopeAPIKey: string | null;
  seqApiKey: string | null;
  dhlClientKey: string | null;
  dhlClientSecret: string | null;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  propertyName: string;
  description: string;
  value: string | null;
}

export interface PaginatedApiKeysResponse {
  items: ApiKeyItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UpdateApiKeyRequest {
  keyName: string;
  value: string;
}

export interface UpdateApiKeyResponse {
  message: string;
}
