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
import { Loader2, ArrowLeft, BarChart3, Eye, EyeOff } from "lucide-react";
import { SellerLogicCredentials } from "@/types/integrations";

const initialCredentials: SellerLogicCredentials = {
  sl_ClientId: "",
  sl_SecretKey: "",
};

export default function SellerLogicConfiguration() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<SellerLogicCredentials>(initialCredentials);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showClientId, setShowClientId] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/credentials/sellerlogic");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch SellerLogic credentials");
      }

      setCredentials({
        sl_ClientId: data.sl_ClientId || "",
        sl_SecretKey: data.sl_SecretKey || "",
      });
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch SellerLogic credentials";
      toast.error(errorMessage);
      router.push("/admin");
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const response = await fetch("/api/credentials/sellerlogic", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update SellerLogic credentials");
      }

      toast.success("SellerLogic credentials updated successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update SellerLogic credentials";
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">SellerLogic</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Configure SellerLogic API credentials
            </p>
          </div>
        </div>
        <Card className="max-w-2xl">
          <CardHeader className="p-4 md:p-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-3">
            {[...Array(2)].map((_, i) => (
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
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">SellerLogic</h1>
            <p className="text-sm md:text-base text-gray-500">
              Configure SellerLogic API credentials
            </p>
          </div>
        </div>
      </div>

      {/* Credentials Card */}
      <Card className="max-w-2xl">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">API Credentials</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Enter your SellerLogic API credentials for authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sl_ClientId">Client ID</Label>
            <div className="relative">
              <Input
                id="sl_ClientId"
                type={showClientId ? "text" : "password"}
                placeholder="Enter Client ID"
                value={credentials.sl_ClientId}
                onChange={(e) => setCredentials({ ...credentials, sl_ClientId: e.target.value })}
                disabled={isSaving}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowClientId(!showClientId)}
                disabled={isSaving}
              >
                {showClientId ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sl_SecretKey">Secret Key</Label>
            <div className="relative">
              <Input
                id="sl_SecretKey"
                type={showSecretKey ? "text" : "password"}
                placeholder="Enter Secret Key"
                value={credentials.sl_SecretKey}
                onChange={(e) => setCredentials({ ...credentials, sl_SecretKey: e.target.value })}
                disabled={isSaving}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowSecretKey(!showSecretKey)}
                disabled={isSaving}
              >
                {showSecretKey ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
