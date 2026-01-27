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
import { Loader2, ArrowLeft, Database, Eye, EyeOff, Globe, User, Lock } from "lucide-react";
import { SapSettings } from "@/types/integrations";

const initialSettings: SapSettings = {
  serviceLayerBaseUrl: "",
  companyDb: "",
  userName: "",
  userPassword: "",
};

export default function SapConfiguration() {
  const router = useRouter();
  const [settings, setSettings] = useState<SapSettings>(initialSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/credentials/sap");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch SAP settings");
      }

      setSettings({
        serviceLayerBaseUrl: data.serviceLayerBaseUrl || "",
        companyDb: data.companyDb || "",
        userName: data.userName || "",
        userPassword: data.userPassword || "",
      });
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch SAP settings";
      toast.error(errorMessage);
      router.push("/admin");
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const response = await fetch("/api/credentials/sap", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update SAP settings");
      }

      toast.success("SAP settings updated successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update SAP settings";
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">SAP Business One</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Configure SAP Service Layer connection
            </p>
          </div>
        </div>
        <Card className="max-w-2xl">
          <CardHeader className="p-4 md:p-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-3">
            {[...Array(4)].map((_, i) => (
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
            <Database className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">SAP Business One</h1>
            <p className="text-sm md:text-base text-gray-500">
              Configure SAP Service Layer connection
            </p>
          </div>
        </div>
      </div>

      {/* Settings Card */}
      <Card className="max-w-2xl">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Connection Settings</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Configure the SAP Service Layer API connection credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serviceLayerBaseUrl" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Service Layer Base URL
            </Label>
            <Input
              id="serviceLayerBaseUrl"
              placeholder="https://sap-server:50000/b1s/v1"
              value={settings.serviceLayerBaseUrl}
              onChange={(e) => setSettings({ ...settings, serviceLayerBaseUrl: e.target.value })}
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500">
              The base URL for SAP Business One Service Layer API
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyDb" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Company Database
            </Label>
            <Input
              id="companyDb"
              placeholder="SBO_COMPANY"
              value={settings.companyDb}
              onChange={(e) => setSettings({ ...settings, companyDb: e.target.value })}
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500">
              The SAP Business One company database name
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Username
            </Label>
            <Input
              id="userName"
              placeholder="manager"
              value={settings.userName}
              onChange={(e) => setSettings({ ...settings, userName: e.target.value })}
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500">
              The SAP Business One user account for API access
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userPassword" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Password
            </Label>
            <div className="relative">
              <Input
                id="userPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={settings.userPassword}
                onChange={(e) => setSettings({ ...settings, userPassword: e.target.value })}
                disabled={isSaving}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              The password for the SAP user account (stored encrypted)
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
                "Save Settings"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
