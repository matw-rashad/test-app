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
import { Loader2, ArrowLeft, FolderInput, FolderOutput } from "lucide-react";
import { ConradSettings } from "@/types/integrations";

const initialSettings: ConradSettings = {
  importLocation: "",
  exportLocation: "",
};

export default function ConradConfiguration() {
  const router = useRouter();
  const [settings, setSettings] = useState<ConradSettings>(initialSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/credentials/conrad");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch Conrad settings");
      }

      setSettings({
        importLocation: data.importLocation || "",
        exportLocation: data.exportLocation || "",
      });
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch Conrad settings";
      toast.error(errorMessage);
      router.push("/admin");
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const response = await fetch("/api/credentials/conrad", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update Conrad settings");
      }

      toast.success("Conrad settings updated successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update Conrad settings";
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Conrad</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Configure Conrad file locations
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
          <div className="p-2 bg-red-100 rounded-lg text-red-600">
            <FolderInput className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Conrad</h1>
            <p className="text-sm md:text-base text-gray-500">
              Configure Conrad file locations
            </p>
          </div>
        </div>
      </div>

      {/* Settings Card */}
      <Card className="max-w-2xl">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">File Locations</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Configure import and export folder paths for Conrad integration
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="importLocation" className="flex items-center gap-2">
              <FolderInput className="h-4 w-4" />
              Import Location
            </Label>
            <Input
              id="importLocation"
              placeholder="D:\Automation\Conrad\Import"
              value={settings.importLocation}
              onChange={(e) => setSettings({ ...settings, importLocation: e.target.value })}
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500">Path where Conrad order files are imported from</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exportLocation" className="flex items-center gap-2">
              <FolderOutput className="h-4 w-4" />
              Export Location
            </Label>
            <Input
              id="exportLocation"
              placeholder="D:\Automation\Conrad\Export"
              value={settings.exportLocation}
              onChange={(e) => setSettings({ ...settings, exportLocation: e.target.value })}
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500">Path where Conrad export files are saved</p>
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
