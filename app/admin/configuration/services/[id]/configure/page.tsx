"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Play, Pause, Info, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CronJob {
  jobName: string;
  cron: string;
  nightCron: string | null;
  status: boolean;
}

interface FormState {
  cron: string;
  nightCron: string;
  enabled: boolean;
}

const quartzExamples = [
  { expression: "0 0 12 * * ?", description: "Fire at 12:00 PM (noon) every day" },
  { expression: "0 15 10 * * ?", description: "Fire at 10:15 AM every day" },
  { expression: "0 0/5 * * * ?", description: "Fire every 5 minutes" },
  { expression: "0 0/30 * * * ?", description: "Fire every 30 minutes" },
  { expression: "0 0 * * * ?", description: "Fire every hour on the hour" },
  { expression: "0 0 0 * * ?", description: "Fire at midnight every day" },
  { expression: "0 0 6 * * ?", description: "Fire at 6:00 AM every day" },
  { expression: "0 0 0 1 * ?", description: "Fire at midnight on the 1st of every month" },
  { expression: "0 0 0 ? * MON", description: "Fire at midnight every Monday" },
  { expression: "0 0 0 ? * MON-FRI", description: "Fire at midnight Monday through Friday" },
];

const quartzFields = [
  { field: "Seconds", allowed: "0-59", special: ", - * /" },
  { field: "Minutes", allowed: "0-59", special: ", - * /" },
  { field: "Hours", allowed: "0-23", special: ", - * /" },
  { field: "Day of Month", allowed: "1-31", special: ", - * ? / L W" },
  { field: "Month", allowed: "1-12 or JAN-DEC", special: ", - * /" },
  { field: "Day of Week", allowed: "1-7 or SUN-SAT", special: ", - * ? / L #" },
  { field: "Year (optional)", allowed: "empty, 1970-2099", special: ", - * /" },
];

const specialCharacters = [
  { char: "*", meaning: "All values", example: "* in minutes = every minute" },
  { char: "?", meaning: "No specific value", example: "Used in day-of-month and day-of-week" },
  { char: "-", meaning: "Range", example: "10-12 in hours = 10, 11, 12" },
  { char: ",", meaning: "List", example: "MON,WED,FRI in day-of-week" },
  { char: "/", meaning: "Increment", example: "0/15 in minutes = every 15 min starting at 0" },
  { char: "L", meaning: "Last", example: "L in day-of-month = last day of month" },
  { char: "W", meaning: "Weekday", example: "15W = nearest weekday to 15th" },
  { char: "#", meaning: "Nth occurrence", example: "6#3 = third Friday of month" },
];

export default function ServiceConfigurePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const jobName = decodeURIComponent(resolvedParams.id);

  const [service, setService] = useState<CronJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [formState, setFormState] = useState<FormState>({
    cron: "",
    nightCron: "",
    enabled: false,
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await fetch(`/api/configuration/cronjobs/${encodeURIComponent(jobName)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch service");
        }

        // Normalize the data
        const normalizedService: CronJob = {
          jobName: data.JobName || data.jobName || "",
          cron: data.Cron || data.cron || "",
          nightCron: data.NightCron || data.nightCron || null,
          status: data.Status ?? data.status ?? false,
        };

        setService(normalizedService);
        setFormState({
          cron: normalizedService.cron,
          nightCron: normalizedService.nightCron || "",
          enabled: normalizedService.status,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch service");
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [jobName]);

  const handleSave = async () => {
    if (!formState.cron.trim()) {
      toast.error("Cron expression is required");
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch(`/api/configuration/cronjobs/${encodeURIComponent(jobName)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cron: formState.cron,
          nightCron: formState.nightCron || null,
          enabled: formState.enabled,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update service");
      }

      // Update local state to reflect changes
      setService((prev) =>
        prev
          ? {
              ...prev,
              cron: formState.cron,
              nightCron: formState.nightCron || null,
              status: formState.enabled,
            }
          : null
      );

      toast.success("Service configuration saved successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save configuration");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/configuration/services")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
        </div>
        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="p-4 md:p-6">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-64 mt-2" />
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <Skeleton key={j} className="h-10 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/configuration/services")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Service Configuration</h1>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/configuration/services")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Service Not Found</h1>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">The requested service could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/configuration/services")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{service.jobName}</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Configure service settings and schedule
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={
            formState.enabled
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }
        >
          {formState.enabled ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        {/* Service Configuration */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">Service Configuration</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Configure the service settings and execution schedule
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service-name">Service Name</Label>
              <Input
                id="service-name"
                value={service.jobName}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cron-expression">Cron Expression (Quartz Format)</Label>
              <Input
                id="cron-expression"
                value={formState.cron}
                onChange={(e) => setFormState((prev) => ({ ...prev, cron: e.target.value }))}
                placeholder="0 0/5 * * * ?"
              />
              <p className="text-xs text-gray-500">
                Format: Seconds Minutes Hours Day-of-Month Month Day-of-Week [Year]
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="night-cron-expression">Night Cron Expression (Optional)</Label>
              <Input
                id="night-cron-expression"
                value={formState.nightCron}
                onChange={(e) => setFormState((prev) => ({ ...prev, nightCron: e.target.value }))}
                placeholder="0 0 2 * * ?"
              />
              <p className="text-xs text-gray-500">
                Optional cron expression for night-time scheduling
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="service-active">Service Status</Label>
                <p className="text-xs text-gray-500">
                  Enable or disable this service
                </p>
              </div>
              <Switch
                id="service-active"
                checked={formState.enabled}
                onCheckedChange={(checked) => setFormState((prev) => ({ ...prev, enabled: checked }))}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" disabled>
                <Play className="h-4 w-4 mr-1" />
                Run Now
              </Button>
              <Button variant="outline" className="flex-1" disabled>
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </Button>
            </div>
            <Button className="w-full" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-1" />
              )}
              {isSaving ? "Saving..." : "Save Configuration"}
            </Button>
          </CardContent>
        </Card>

        {/* Quartz Cron Format */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-base md:text-lg">Quartz Cron Expression Guide</CardTitle>
            </div>
            <CardDescription className="text-xs md:text-sm">
              Understanding the Quartz cron format for scheduling
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Expression Format</h4>
              <code className="block bg-gray-100 p-2 rounded text-xs">
                Seconds Minutes Hours Day-of-Month Month Day-of-Week [Year]
              </code>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Field Values</h4>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Field</TableHead>
                      <TableHead className="text-xs">Allowed Values</TableHead>
                      <TableHead className="text-xs">Special Chars</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quartzFields.map((field) => (
                      <TableRow key={field.field}>
                        <TableCell className="text-xs font-medium">{field.field}</TableCell>
                        <TableCell className="text-xs">{field.allowed}</TableCell>
                        <TableCell className="text-xs font-mono">{field.special}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Characters */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">Special Characters</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Special characters used in Quartz cron expressions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs w-16">Char</TableHead>
                    <TableHead className="text-xs">Meaning</TableHead>
                    <TableHead className="text-xs">Example</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {specialCharacters.map((item) => (
                    <TableRow key={item.char}>
                      <TableCell className="text-xs font-mono font-bold">{item.char}</TableCell>
                      <TableCell className="text-xs">{item.meaning}</TableCell>
                      <TableCell className="text-xs text-gray-500">{item.example}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Common Examples */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">Common Examples</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Frequently used cron expressions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Expression</TableHead>
                    <TableHead className="text-xs">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quartzExamples.map((example, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {example.expression}
                        </code>
                      </TableCell>
                      <TableCell className="text-xs">{example.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
