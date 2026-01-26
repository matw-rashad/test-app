"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Loader2, CheckCircle2, ArrowLeft, Server, Eye, EyeOff } from "lucide-react";
import { UniteCredentials } from "@/types/integrations";

const initialUniteCredentials: UniteCredentials = {
  username: "",
  password: "",
  ftpUrl: "",
  orderResponseUrl: "",
  dispatchNotificationUrl: "",
  invoiceUrl: "",
  importLocation: "",
  contactPersonCode: "",
};

export default function UniteServiceConfiguration() {
  const [credentials, setCredentials] = useState<UniteCredentials>(initialUniteCredentials);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchUniteCredentials();
  }, []);

  const fetchUniteCredentials = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch("/api/credentials/unite");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch Unite credentials");
      }

      setCredentials({
        username: data.username || "",
        password: data.password || "",
        ftpUrl: data.ftpUrl || "",
        orderResponseUrl: data.orderResponseUrl || "",
        dispatchNotificationUrl: data.dispatchNotificationUrl || "",
        invoiceUrl: data.invoiceUrl || "",
        importLocation: data.importLocation || "",
        contactPersonCode: data.contactPersonCode || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch Unite credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/credentials/unite", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update Unite credentials");
      }

      setSuccess("Unite credentials updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update Unite credentials");
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Unite EDI</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              FTP and EDI configuration for Unite integration
            </p>
          </div>
        </div>
        <Card className="max-w-2xl">
          <CardHeader className="p-4 md:p-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-3">
            {[...Array(8)].map((_, i) => (
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
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Server className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Unite EDI</h1>
            <p className="text-sm md:text-base text-gray-500">
              FTP and EDI configuration for Unite integration
            </p>
          </div>
        </div>
      </div>

      {/* Unite Credentials Card */}
      <Card className="max-w-2xl">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">FTP Connection Settings</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Configure FTP credentials and connection URLs for Unite EDI
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="FTP username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  disabled={isSaving}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSaving}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ftpUrl">FTP URL</Label>
            <Input
              id="ftpUrl"
              placeholder="ftp://example.com"
              value={credentials.ftpUrl}
              onChange={(e) => setCredentials({ ...credentials, ftpUrl: e.target.value })}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="orderResponseUrl">Order Response URL</Label>
            <Input
              id="orderResponseUrl"
              placeholder="/path/to/order/response"
              value={credentials.orderResponseUrl}
              onChange={(e) => setCredentials({ ...credentials, orderResponseUrl: e.target.value })}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dispatchNotificationUrl">Dispatch Notification URL</Label>
            <Input
              id="dispatchNotificationUrl"
              placeholder="/path/to/dispatch/notification"
              value={credentials.dispatchNotificationUrl}
              onChange={(e) =>
                setCredentials({ ...credentials, dispatchNotificationUrl: e.target.value })
              }
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoiceUrl">Invoice URL</Label>
            <Input
              id="invoiceUrl"
              placeholder="/path/to/invoice"
              value={credentials.invoiceUrl}
              onChange={(e) => setCredentials({ ...credentials, invoiceUrl: e.target.value })}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="importLocation">Import Location</Label>
            <Input
              id="importLocation"
              placeholder="D:\Automation\Unite\Import"
              value={credentials.importLocation}
              onChange={(e) => setCredentials({ ...credentials, importLocation: e.target.value })}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPersonCode">Contact Person Code</Label>
            <Input
              id="contactPersonCode"
              placeholder="12345"
              value={credentials.contactPersonCode}
              onChange={(e) =>
                setCredentials({ ...credentials, contactPersonCode: e.target.value })
              }
              disabled={isSaving}
            />
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
