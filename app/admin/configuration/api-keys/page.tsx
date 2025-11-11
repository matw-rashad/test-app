"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Eye, EyeOff, Trash2, Plus } from "lucide-react";

export default function APIKeysConfiguration() {
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const apiKeys = [
    {
      id: "1",
      name: "Production API Key",
      key: "prod_api_key_1234567890abcdefghijklmnopqrstuvwxyz_EXAMPLE_DO_NOT_USE",
      created: "2024-01-15",
      lastUsed: "2 hours ago",
      status: "active",
      permissions: ["read", "write"]
    },
    {
      id: "2",
      name: "Development API Key",
      key: "dev_api_key_abcdefghijklmnopqrstuvwxyz1234567890_EXAMPLE_DO_NOT_USE",
      created: "2024-02-01",
      lastUsed: "1 day ago",
      status: "active",
      permissions: ["read"]
    },
    {
      id: "3",
      name: "Mobile App API Key",
      key: "mobile_api_key_xyz9876543210fedcba_EXAMPLE_KEY_FOR_DEMO_ONLY",
      created: "2024-01-20",
      lastUsed: "Never",
      status: "inactive",
      permissions: ["read", "write"]
    },
  ];

  const maskKey = (key: string) => {
    if (key.length <= 20) return key;
    return `${key.substring(0, 12)}${"•".repeat(40)}${key.substring(key.length - 4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">API Keys</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Manage API keys for accessing your application
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Generate New Key
        </Button>
      </div>

      {/* API Keys Overview */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="p-4 md:p-6 pb-3">
            <CardDescription className="text-xs md:text-sm">Total Keys</CardDescription>
            <CardTitle className="text-2xl md:text-3xl">3</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4 md:p-6 pb-3">
            <CardDescription className="text-xs md:text-sm">Active Keys</CardDescription>
            <CardTitle className="text-2xl md:text-3xl text-green-600">2</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4 md:p-6 pb-3">
            <CardDescription className="text-xs md:text-sm">API Requests (24h)</CardDescription>
            <CardTitle className="text-2xl md:text-3xl">1,234</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* API Keys List */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Your API Keys</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            View and manage your API keys. Keep your keys secure and never share them publicly.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <Card key={apiKey.id} className="border">
                <CardContent className="p-4 space-y-3">
                  {/* Key Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">{apiKey.name}</h3>
                        <Badge
                          variant="outline"
                          className={
                            apiKey.status === "active"
                              ? "bg-green-50 text-green-700 border-green-200 text-xs"
                              : "bg-gray-100 text-gray-700 border-gray-200 text-xs"
                          }
                        >
                          {apiKey.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        Created: {apiKey.created} • Last used: {apiKey.lastUsed}
                      </p>
                    </div>
                  </div>

                  {/* API Key Display */}
                  <div className="space-y-2">
                    <Label className="text-xs">API Key</Label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Input
                          value={showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                          readOnly
                          className="font-mono text-xs pr-10"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {showKeys[apiKey.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(apiKey.key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div>
                    <Label className="text-xs mb-1.5 block">Permissions</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {apiKey.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit Permissions
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Regenerate
                    </Button>
                    <Button variant="destructive" size="sm" className="flex-1">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Revoke
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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

      {/* Rate Limits */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Rate Limits</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Current API rate limit settings
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Requests per minute</Label>
              <p className="text-2xl font-bold">100</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Requests per day</Label>
              <p className="text-2xl font-bold">10,000</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs text-blue-800">
              Need higher limits? Contact support to upgrade your plan.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
