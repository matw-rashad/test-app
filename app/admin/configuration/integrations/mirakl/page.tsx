"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, ArrowLeft, Store, Globe, Key, Eye, EyeOff, Hash } from "lucide-react";
import { MiraklCredentials } from "@/types/integrations";

const initialCredentials: MiraklCredentials = {
  miraklBaseUrl: "",
  miraklApiKey: "",
  miraklShopId: "",
};

export default function MiraklConfiguration() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<MiraklCredentials>(initialCredentials);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/credentials/mirakl");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch Mirakl credentials");
      }

      setCredentials({
        miraklBaseUrl: data.miraklBaseUrl || "",
        miraklApiKey: data.miraklApiKey || "",
        miraklShopId: data.miraklShopId || "",
      });
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch Mirakl credentials";
      toast.error(errorMessage);
      router.push("/admin");
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const response = await fetch("/api/credentials/mirakl", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update Mirakl credentials");
      }

      toast.success("Mirakl credentials updated successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update Mirakl credentials";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/configuration/integrations"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mirakl</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Configure Mirakl Marketplace API connection
            </p>
          </div>
        </div>
        <Card className="max-w-2xl">
          <CardHeader className="p-4 md:p-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/configuration/integrations"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mirakl</h1>
            <p className="text-sm md:text-base text-gray-500">
              Configure Mirakl Marketplace API connection
            </p>
          </div>
        </div>
      </div>

      {/* Credentials Card */}
      <Card className="max-w-2xl">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">API Credentials</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Configure the Mirakl Marketplace Platform API connection using a static API key
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="miraklBaseUrl" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Base URL
            </Label>
            <Input
              id="miraklBaseUrl"
              placeholder="https://your-marketplace.mirakl.net"
              value={credentials.miraklBaseUrl}
              onChange={(e) => setCredentials({ ...credentials, miraklBaseUrl: e.target.value })}
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500">
              The base URL of your Mirakl Marketplace platform
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="miraklApiKey" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Key
            </Label>
            <div className="relative">
              <Input
                id="miraklApiKey"
                type={showApiKey ? "text" : "password"}
                placeholder="Enter API key"
                value={credentials.miraklApiKey}
                onChange={(e) => setCredentials({ ...credentials, miraklApiKey: e.target.value })}
                disabled={isSaving}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              The static API key from your Mirakl shop settings (stored encrypted)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="miraklShopId" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Shop ID
            </Label>
            <Input
              id="miraklShopId"
              placeholder="Enter shop ID"
              value={credentials.miraklShopId}
              onChange={(e) => setCredentials({ ...credentials, miraklShopId: e.target.value })}
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500">
              Your shop identifier in the Mirakl platform
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Credentials"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
