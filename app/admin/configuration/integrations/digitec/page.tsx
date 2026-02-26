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
import { Loader2, ArrowLeft, FolderInput, FolderDown, FolderUp } from "lucide-react";
import { DigitecSettings } from "@/types/integrations";

const initialSettings: DigitecSettings = {
  productUpdateLocation: "",
  importLocation: "",
  exportLocation: "",
};

export default function DigitecConfiguration() {
  const router = useRouter();
  const [settings, setSettings] = useState<DigitecSettings>(initialSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/credentials/digitec");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch Digitec settings");
      }

      setSettings({
        productUpdateLocation: data.productUpdateLocation || "",
        importLocation: data.importLocation || "",
        exportLocation: data.exportLocation || "",
      });
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch Digitec settings";
      toast.error(errorMessage);
      router.push("/admin");
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const response = await fetch("/api/credentials/digitec", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update Digitec settings");
      }

      toast.success("Digitec settings updated successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update Digitec settings";
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Digitec</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Configure Digitec file locations
            </p>
          </div>
        </div>
        <Card className="max-w-2xl">
          <CardHeader className="p-4 md:p-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
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
          <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
            <FolderInput className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Digitec</h1>
            <p className="text-sm md:text-base text-gray-500">
              Configure Digitec file locations
            </p>
          </div>
        </div>
      </div>

      {/* Settings Card */}
      <Card className="max-w-2xl">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">File Locations</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Configure file locations for Digitec integration
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productUpdateLocation" className="flex items-center gap-2">
              <FolderInput className="h-4 w-4" />
              Product Update Location
            </Label>
            <Input
              id="productUpdateLocation"
              placeholder="D:\Automation\Digitec"
              value={settings.productUpdateLocation}
              onChange={(e) => setSettings({ ...settings, productUpdateLocation: e.target.value })}
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500">
              Root path for Digitec product update files.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="importLocation" className="flex items-center gap-2">
              <FolderDown className="h-4 w-4" />
              Import Location
            </Label>
            <Input
              id="importLocation"
              placeholder="D:\Automation\Digitec\Orders\In"
              value={settings.importLocation}
              onChange={(e) => setSettings({ ...settings, importLocation: e.target.value })}
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500">
              Path where incoming Digitec order XML files are read from.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exportLocation" className="flex items-center gap-2">
              <FolderUp className="h-4 w-4" />
              Export Location
            </Label>
            <Input
              id="exportLocation"
              placeholder="D:\Automation\Digitec\Orders\Out"
              value={settings.exportLocation}
              onChange={(e) => setSettings({ ...settings, exportLocation: e.target.value })}
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500">
              Path where generated Digitec XML documents (order responses, delivery notes, invoices) are saved.
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
