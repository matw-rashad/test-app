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
import { Loader2, ArrowLeft, ShoppingCart, Globe, Key, Eye, EyeOff, Lock } from "lucide-react";
import { ShopwareCredentials } from "@/types/integrations";

const initialCredentials: ShopwareCredentials = {
  shopwareBaseUrl: "",
  shopwareClientId: "",
  shopwareClientSecret: "",
};

export default function ShopwareConfiguration() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<ShopwareCredentials>(initialCredentials);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/credentials/shopware");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch Shopware credentials");
      }

      setCredentials({
        shopwareBaseUrl: data.shopwareBaseUrl || "",
        shopwareClientId: data.shopwareClientId || "",
        shopwareClientSecret: data.shopwareClientSecret || "",
      });
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch Shopware credentials";
      toast.error(errorMessage);
      router.push("/admin");
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const response = await fetch("/api/credentials/shopware", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update Shopware credentials");
      }

      toast.success("Shopware credentials updated successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update Shopware credentials";
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shopware</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Configure Shopware API connection
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
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shopware</h1>
            <p className="text-sm md:text-base text-gray-500">
              Configure Shopware API connection
            </p>
          </div>
        </div>
      </div>

      {/* Credentials Card */}
      <Card className="max-w-2xl">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">API Credentials</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Configure the Shopware 6 API connection using OAuth 2.0 Client Credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shopwareBaseUrl" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Base URL
            </Label>
            <Input
              id="shopwareBaseUrl"
              placeholder="https://your-shop.shopware.store"
              value={credentials.shopwareBaseUrl}
              onChange={(e) => setCredentials({ ...credentials, shopwareBaseUrl: e.target.value })}
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500">
              The base URL of your Shopware 6 instance
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shopwareClientId" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Client ID
            </Label>
            <Input
              id="shopwareClientId"
              placeholder="Enter client ID"
              value={credentials.shopwareClientId}
              onChange={(e) => setCredentials({ ...credentials, shopwareClientId: e.target.value })}
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500">
              The integration Client ID from Shopware admin
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shopwareClientSecret" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Client Secret
            </Label>
            <div className="relative">
              <Input
                id="shopwareClientSecret"
                type={showSecret ? "text" : "password"}
                placeholder="Enter client secret"
                value={credentials.shopwareClientSecret}
                onChange={(e) => setCredentials({ ...credentials, shopwareClientSecret: e.target.value })}
                disabled={isSaving}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              The integration Client Secret from Shopware admin (stored encrypted)
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
