"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Play, Pause, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Service = {
  id: number;
  serviceName: string;
  status: "Active" | "Deactive";
  runningPeriod: string;
  description?: string;
};

const dummyServices: Record<number, Service> = {
  1: { id: 1, serviceName: "DHL Mail Processor", status: "Active", runningPeriod: "0 0/5 * * * ?", description: "Processes incoming DHL mail notifications and updates shipment status" },
  2: { id: 2, serviceName: "Order Sync Service", status: "Active", runningPeriod: "0 0 * * * ?", description: "Synchronizes orders with external systems" },
  3: { id: 3, serviceName: "Inventory Update", status: "Active", runningPeriod: "0 0/15 * * * ?", description: "Updates inventory levels from warehouse systems" },
  4: { id: 4, serviceName: "Payment Gateway Sync", status: "Active", runningPeriod: "0 0/10 * * * ?", description: "Syncs payment status with payment gateways" },
  5: { id: 5, serviceName: "Email Notification Service", status: "Deactive", runningPeriod: "0 0/30 * * * ?", description: "Sends scheduled email notifications to customers" },
  6: { id: 6, serviceName: "Customer Data Sync", status: "Active", runningPeriod: "0 0 0/2 * * ?", description: "Synchronizes customer data with CRM systems" },
  7: { id: 7, serviceName: "Report Generator", status: "Active", runningPeriod: "0 0 6 * * ?", description: "Generates daily reports at 6 AM" },
  8: { id: 8, serviceName: "Cache Cleanup", status: "Active", runningPeriod: "0 0 0 * * ?", description: "Cleans up expired cache entries daily at midnight" },
  9: { id: 9, serviceName: "Backup Service", status: "Active", runningPeriod: "0 0 2 * * ?", description: "Performs database backups at 2 AM daily" },
  10: { id: 10, serviceName: "Log Archiver", status: "Deactive", runningPeriod: "0 0 3 * * ?", description: "Archives old log files at 3 AM" },
  11: { id: 11, serviceName: "API Rate Limiter", status: "Active", runningPeriod: "0 0/1 * * * ?", description: "Monitors and enforces API rate limits" },
  12: { id: 12, serviceName: "Session Cleanup", status: "Active", runningPeriod: "0 0/30 * * * ?", description: "Removes expired user sessions" },
  13: { id: 13, serviceName: "Webhook Dispatcher", status: "Deactive", runningPeriod: "0 0/5 * * * ?", description: "Dispatches pending webhook notifications" },
  14: { id: 14, serviceName: "Analytics Aggregator", status: "Active", runningPeriod: "0 0 * * * ?", description: "Aggregates analytics data hourly" },
  15: { id: 15, serviceName: "Health Check Monitor", status: "Active", runningPeriod: "0 0/2 * * * ?", description: "Monitors system health every 2 minutes" },
};

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
  const serviceId = parseInt(resolvedParams.id);
  const service = dummyServices[serviceId];

  if (!service) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Service not found</p>
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{service.serviceName}</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Configure service settings and schedule
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={
            service.status === "Active"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }
        >
          {service.status}
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
                defaultValue={service.serviceName}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-description">Description</Label>
              <Input
                id="service-description"
                defaultValue={service.description}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cron-expression">Cron Expression (Quartz Format)</Label>
              <Input
                id="cron-expression"
                defaultValue={service.runningPeriod}
                placeholder="0 0/5 * * * ?"
              />
              <p className="text-xs text-gray-500">
                Format: Seconds Minutes Hours Day-of-Month Month Day-of-Week [Year]
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="service-active">Service Status</Label>
                <p className="text-xs text-gray-500">
                  Enable or disable this service
                </p>
              </div>
              <Switch id="service-active" defaultChecked={service.status === "Active"} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1">
                <Play className="h-4 w-4 mr-1" />
                Run Now
              </Button>
              <Button variant="outline" className="flex-1">
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </Button>
            </div>
            <Button className="w-full">
              <Save className="h-4 w-4 mr-1" />
              Save Configuration
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
