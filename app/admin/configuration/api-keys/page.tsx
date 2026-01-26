"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Save, Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { ApiKeyItem, PaginatedApiKeysResponse } from "@/types/api-keys";

const PAGE_SIZE_OPTIONS = [2, 5, 10];

export default function APIKeysConfiguration() {
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [apiKeysResponse, setApiKeysResponse] = useState<PaginatedApiKeysResponse | null>(null);
  const [editedValues, setEditedValues] = useState<{ [key: string]: string }>({});
  const [originalValues, setOriginalValues] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Pagination and search state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchApiKeys = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (debouncedSearch) {
        params.append("search", debouncedSearch);
      }

      const response = await fetch(`/api/credentials/apikeys?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch API keys");
      }

      const data: PaginatedApiKeysResponse = await response.json();
      setApiKeysResponse(data);

      // Initialize edited and original values
      const values: { [key: string]: string } = {};
      data.items.forEach((item) => {
        values[item.propertyName] = item.value || "";
      });
      setEditedValues((prev) => ({ ...prev, ...values }));
      setOriginalValues((prev) => ({ ...prev, ...values }));
    } catch (error) {
      console.error("Error fetching API keys:", error);
      toast.error("Failed to load API keys");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  const toggleKeyVisibility = (id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleValueChange = (propertyName: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [propertyName]: value }));
  };

  const handleSave = async (item: ApiKeyItem) => {
    const newValue = editedValues[item.propertyName];

    if (!newValue || newValue.trim() === "") {
      toast.error("Value cannot be empty");
      return;
    }

    try {
      setSavingKey(item.propertyName);

      const backendKeyName = mapToBackendKeyName(item.propertyName);

      const response = await fetch(`/api/credentials/apikeys/${backendKeyName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newValue),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update API key");
      }

      toast.success(`${item.name} updated successfully`);

      // Update original value to reflect saved state
      setOriginalValues((prev) => ({
        ...prev,
        [item.propertyName]: newValue,
      }));
    } catch (error) {
      console.error("Error updating API key:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update API key");
    } finally {
      setSavingKey(null);
    }
  };

  const mapToBackendKeyName = (propertyName: string): string => {
    const mapping: { [key: string]: string } = {
      itScopeAPIKey: "ITScopeAPIKey",
      seqApiKey: "SeqApiKey",
      dhlClientKey: "DHLClientKey",
      dhlClientSecret: "DHLClientSecret",
    };
    return mapping[propertyName] || propertyName;
  };

  const maskKey = (key: string) => {
    if (!key || key.length <= 20) return key || "";
    return `${key.substring(0, 12)}${"•".repeat(20)}${key.substring(key.length - 4)}`;
  };

  const hasChanges = (propertyName: string): boolean => {
    const originalValue = originalValues[propertyName] || "";
    const currentValue = editedValues[propertyName] || "";
    return originalValue !== currentValue;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (apiKeysResponse?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(parseInt(newPageSize, 10));
    setPage(1);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">API Keys</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Manage API keys for external service integrations
          </p>
        </div>
      </div>

      {/* API Keys Overview */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
        <Card>
          <CardHeader className="p-4 md:p-6 pb-3">
            <CardDescription className="text-xs md:text-sm">Total Keys</CardDescription>
            <CardTitle className="text-2xl md:text-3xl">
              {apiKeysResponse?.totalCount || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4 md:p-6 pb-3">
            <CardDescription className="text-xs md:text-sm">Configured Keys</CardDescription>
            <CardTitle className="text-2xl md:text-3xl text-green-600">
              {apiKeysResponse?.items.filter((item) => item.value && item.value !== "string")
                .length || 0}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* API Keys List */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-base md:text-lg">Your API Keys</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                View and manage your API keys. Keep your keys secure and never share them publicly.
              </CardDescription>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by key name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : apiKeysResponse?.items.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              {debouncedSearch ? "No API keys match your search" : "No API keys found"}
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeysResponse?.items.map((item) => (
                <Card key={item.id} className="border">
                  <CardContent className="p-4 space-y-3">
                    {/* Key Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </div>

                    {/* API Key Input */}
                    <div className="space-y-2">
                      <Label className="text-xs">API Key</Label>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <Input
                            type={showKeys[item.id] ? "text" : "password"}
                            value={
                              showKeys[item.id]
                                ? editedValues[item.propertyName] || ""
                                : maskKey(editedValues[item.propertyName] || "")
                            }
                            onChange={(e) => handleValueChange(item.propertyName, e.target.value)}
                            className="font-mono text-xs"
                            placeholder="Enter API key..."
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toggleKeyVisibility(item.id)}
                        >
                          {showKeys[item.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant={hasChanges(item.propertyName) ? "default" : "outline"}
                          size="icon"
                          onClick={() => handleSave(item)}
                          disabled={
                            savingKey === item.propertyName || !hasChanges(item.propertyName)
                          }
                        >
                          {savingKey === item.propertyName ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Pagination */}
              {apiKeysResponse && apiKeysResponse.totalCount > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Rows per page:</span>
                    <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                      <SelectTrigger className="w-16 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAGE_SIZE_OPTIONS.map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      Page {apiKeysResponse.page} of {apiKeysResponse.totalPages} (
                      {apiKeysResponse.totalCount} items)
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= apiKeysResponse.totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Guidelines */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">API Usage Guidelines</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Best practices for using API keys
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Store API keys securely in environment variables</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Use different keys for development and production</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Rotate keys regularly to maintain security</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-600 font-bold">✗</span>
              <span>Never commit API keys to version control</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-600 font-bold">✗</span>
              <span>Never share API keys publicly or with unauthorized users</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
