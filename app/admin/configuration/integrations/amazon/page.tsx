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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { AmazonIcon } from "@/components/icons/amazon-icon";
import { AmazonCredentials } from "@/types/integrations";

const initialAmazonCredentials: AmazonCredentials = {
  amazonClientId_Zubehor: "",
  amazonClientSecret_Zubehor: "",
  amazonRefreshToken_Zubehor: "",
  amazonClientId_UAG: "",
  amazonClientSecret_UAG: "",
  amazonRefreshToken_UAG: "",
  amazonClientId_Vendor: "",
  amazonClientSecret_Vendor: "",
  amazonRefreshToken_Vendor: "",
  amazonAdsClientId: "",
  amazonAdsClientSecret: "",
  amazonAdsRefreshToken: "",
  amazonAdsTokenUrl: "",
  amazonAdsApiUrl: "",
  amazonEndpoint: "",
  amazonReturnsCsvLocation: "",
  amazonAdsReportStartDays: 15,
};

type VisibleFields = {
  [K in keyof AmazonCredentials]?: boolean;
};

export default function AmazonServiceConfiguration() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<AmazonCredentials>(initialAmazonCredentials);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [visibleFields, setVisibleFields] = useState<VisibleFields>({});

  useEffect(() => {
    fetchAmazonCredentials();
  }, []);

  const fetchAmazonCredentials = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/credentials/amazon");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch Amazon credentials");
      }

      setCredentials({
        amazonClientId_Zubehor: data.amazonClientId_Zubehor || "",
        amazonClientSecret_Zubehor: data.amazonClientSecret_Zubehor || "",
        amazonRefreshToken_Zubehor: data.amazonRefreshToken_Zubehor || "",
        amazonClientId_UAG: data.amazonClientId_UAG || "",
        amazonClientSecret_UAG: data.amazonClientSecret_UAG || "",
        amazonRefreshToken_UAG: data.amazonRefreshToken_UAG || "",
        amazonClientId_Vendor: data.amazonClientId_Vendor || "",
        amazonClientSecret_Vendor: data.amazonClientSecret_Vendor || "",
        amazonRefreshToken_Vendor: data.amazonRefreshToken_Vendor || "",
        amazonAdsClientId: data.amazonAdsClientId || "",
        amazonAdsClientSecret: data.amazonAdsClientSecret || "",
        amazonAdsRefreshToken: data.amazonAdsRefreshToken || "",
        amazonAdsTokenUrl: data.amazonAdsTokenUrl || "",
        amazonAdsApiUrl: data.amazonAdsApiUrl || "",
        amazonEndpoint: data.amazonEndpoint || "",
        amazonReturnsCsvLocation: data.amazonReturnsCsvLocation || "",
        amazonAdsReportStartDays: data.amazonAdsReportStartDays || 15,
      });
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch Amazon credentials";
      toast.error(errorMessage);
      router.push("/admin");
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const response = await fetch("/api/credentials/amazon", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update Amazon credentials");
      }

      toast.success("Amazon credentials updated successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update Amazon credentials";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleVisibility = (field: keyof AmazonCredentials) => {
    setVisibleFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const renderSecretInput = (
    id: keyof Omit<AmazonCredentials, "amazonAdsReportStartDays">,
    label: string,
    placeholder: string
  ) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visibleFields[id] ? "text" : "password"}
          placeholder={placeholder}
          value={credentials[id] as string}
          onChange={(e) => setCredentials({ ...credentials, [id]: e.target.value })}
          disabled={isSaving}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={() => toggleVisibility(id)}
          disabled={isSaving}
        >
          {visibleFields[id] ? (
            <EyeOff className="h-4 w-4 text-gray-500" />
          ) : (
            <Eye className="h-4 w-4 text-gray-500" />
          )}
        </Button>
      </div>
    </div>
  );

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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Amazon SP-API</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Configure Amazon Seller Partner API credentials
            </p>
          </div>
        </div>
        <Card className="max-w-3xl">
          <CardHeader className="p-4 md:p-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-3">
            {[...Array(6)].map((_, i) => (
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
          <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
            <AmazonIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Amazon SP-API</h1>
            <p className="text-sm md:text-base text-gray-500">
              Configure Amazon Seller Partner API credentials
            </p>
          </div>
        </div>
      </div>

      {/* Amazon Credentials Tabs */}
      <Tabs defaultValue="zubehor" className="max-w-3xl">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="zubehor">Zubehor</TabsTrigger>
          <TabsTrigger value="uag">UAG</TabsTrigger>
          <TabsTrigger value="vendor">Vendor</TabsTrigger>
          <TabsTrigger value="ads">Ads</TabsTrigger>
        </TabsList>

        {/* Zubehor Account */}
        <TabsContent value="zubehor">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg">Zubehor Account</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Amazon SP-API credentials for Zubehor seller account
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
              {renderSecretInput("amazonClientId_Zubehor", "Client ID", "amzn1.application-oa2-client...")}
              {renderSecretInput("amazonClientSecret_Zubehor", "Client Secret", "Enter client secret")}
              {renderSecretInput("amazonRefreshToken_Zubehor", "Refresh Token", "Atzr|...")}
            </CardContent>
          </Card>
        </TabsContent>

        {/* UAG Account */}
        <TabsContent value="uag">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg">UAG Account</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Amazon SP-API credentials for UAG seller account
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
              {renderSecretInput("amazonClientId_UAG", "Client ID", "amzn1.application-oa2-client...")}
              {renderSecretInput("amazonClientSecret_UAG", "Client Secret", "Enter client secret")}
              {renderSecretInput("amazonRefreshToken_UAG", "Refresh Token", "Atzr|...")}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendor Account */}
        <TabsContent value="vendor">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg">Vendor Account</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Amazon SP-API credentials for Vendor Central account
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
              {renderSecretInput("amazonClientId_Vendor", "Client ID", "amzn1.application-oa2-client...")}
              {renderSecretInput("amazonClientSecret_Vendor", "Client Secret", "Enter client secret")}
              {renderSecretInput("amazonRefreshToken_Vendor", "Refresh Token", "Atzr|...")}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Amazon Ads */}
        <TabsContent value="ads">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg">Amazon Ads</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Amazon Advertising API credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
              {renderSecretInput("amazonAdsClientId", "Client ID", "amzn1.application-oa2-client...")}
              {renderSecretInput("amazonAdsClientSecret", "Client Secret", "Enter client secret")}
              {renderSecretInput("amazonAdsRefreshToken", "Refresh Token", "Atzr|...")}
              <div className="space-y-2">
                <Label htmlFor="amazonAdsTokenUrl">Token URL</Label>
                <Input
                  id="amazonAdsTokenUrl"
                  placeholder="https://api.amazon.com/auth/o2/token"
                  value={credentials.amazonAdsTokenUrl}
                  onChange={(e) => setCredentials({ ...credentials, amazonAdsTokenUrl: e.target.value })}
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amazonAdsApiUrl">API URL</Label>
                <Input
                  id="amazonAdsApiUrl"
                  placeholder="https://advertising-api-eu.amazon.com"
                  value={credentials.amazonAdsApiUrl}
                  onChange={(e) => setCredentials({ ...credentials, amazonAdsApiUrl: e.target.value })}
                  disabled={isSaving}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Common Settings */}
      <Card className="max-w-3xl">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Common Settings</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Shared configuration for all Amazon accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amazonEndpoint">Amazon Endpoint</Label>
            <Input
              id="amazonEndpoint"
              placeholder="https://sellingpartnerapi-eu.amazon.com"
              value={credentials.amazonEndpoint}
              onChange={(e) => setCredentials({ ...credentials, amazonEndpoint: e.target.value })}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amazonReturnsCsvLocation">Returns CSV Location</Label>
            <Input
              id="amazonReturnsCsvLocation"
              placeholder="D:\Automation\Amazon\Returns"
              value={credentials.amazonReturnsCsvLocation}
              onChange={(e) => setCredentials({ ...credentials, amazonReturnsCsvLocation: e.target.value })}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amazonAdsReportStartDays">Ads Report Start Days</Label>
            <Input
              id="amazonAdsReportStartDays"
              type="number"
              min="1"
              max="90"
              placeholder="15"
              value={credentials.amazonAdsReportStartDays}
              onChange={(e) => setCredentials({ ...credentials, amazonAdsReportStartDays: parseInt(e.target.value) || 15 })}
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500">Number of days to look back for Amazon Ads reports</p>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save All Settings"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
