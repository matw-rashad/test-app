"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Loader2, CheckCircle2, ArrowLeft, Mail, Eye, EyeOff } from "lucide-react";
import { MailSettings } from "@/types/integrations";

const initialMailSettings: MailSettings = {
  userName: "",
  password: "",
  smtpServer: "",
  smtpPort: "",
  senderName: "",
  senderEmail: "",
};

export default function EmailServiceConfiguration() {
  const [mailSettings, setMailSettings] = useState<MailSettings>(initialMailSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchMailSettings();
  }, []);

  const fetchMailSettings = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch("/api/mailsettings");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch mail settings");
      }

      setMailSettings({
        userName: data.UserName || data.userName || "",
        password: data.Password || data.password || "",
        smtpServer: data.SmtpServer || data.smtpServer || "",
        smtpPort: data.SmtpPort || data.smtpPort || "",
        senderName: data.SenderName || data.senderName || "",
        senderEmail: data.SenderEmail || data.senderEmail || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch mail settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/mailsettings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: mailSettings.userName,
          password: mailSettings.password,
          smtpServer: mailSettings.smtpServer,
          smtpPort: mailSettings.smtpPort,
          senderName: mailSettings.senderName,
          senderEmail: mailSettings.senderEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update mail settings");
      }

      setSuccess("Mail settings updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update mail settings");
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Email Service</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              SMTP configuration for sending emails
            </p>
          </div>
        </div>
        <Card className="max-w-2xl">
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
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Email Service</h1>
            <p className="text-sm md:text-base text-gray-500">
              SMTP configuration for sending emails
            </p>
          </div>
        </div>
      </div>

      {/* Email Service Card */}
      <Card className="max-w-2xl">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">SMTP Settings</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Configure your SMTP server for email delivery
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
              <Label htmlFor="smtpServer">SMTP Server</Label>
              <Input
                id="smtpServer"
                placeholder="smtp.example.com"
                value={mailSettings.smtpServer}
                onChange={(e) => setMailSettings({ ...mailSettings, smtpServer: e.target.value })}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                placeholder="587"
                value={mailSettings.smtpPort}
                onChange={(e) => setMailSettings({ ...mailSettings, smtpPort: e.target.value })}
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="userName">Username</Label>
              <Input
                id="userName"
                placeholder="user@example.com"
                value={mailSettings.userName}
                onChange={(e) => setMailSettings({ ...mailSettings, userName: e.target.value })}
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
                  value={mailSettings.password}
                  onChange={(e) => setMailSettings({ ...mailSettings, password: e.target.value })}
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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="senderName">Sender Name</Label>
              <Input
                id="senderName"
                placeholder="My Company"
                value={mailSettings.senderName}
                onChange={(e) => setMailSettings({ ...mailSettings, senderName: e.target.value })}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderEmail">Sender Email</Label>
              <Input
                id="senderEmail"
                type="email"
                placeholder="noreply@example.com"
                value={mailSettings.senderEmail}
                onChange={(e) => setMailSettings({ ...mailSettings, senderEmail: e.target.value })}
                disabled={isSaving}
              />
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
