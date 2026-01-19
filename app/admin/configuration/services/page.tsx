"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CronJob {
  jobName: string;
  cron: string;
  nightCron: string | null;
  status: boolean;
}

export default function ServiceListPage() {
  const router = useRouter();
  const [services, setServices] = useState<CronJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  useEffect(() => {
    fetchCronJobs();
  }, []);

  const fetchCronJobs = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch("/api/configuration/cronjobs");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch cron jobs");
      }

      // Handle both array formats
      const jobsList = Array.isArray(data)
        ? data.map((item: any) => ({
            jobName: item.JobName || item.jobName || "",
            cron: item.Cron || item.cron || "",
            nightCron: item.NightCron || item.nightCron || null,
            status: item.Status ?? item.status ?? false,
          }))
        : [];

      setServices(jobsList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cron jobs");
    } finally {
      setIsLoading(false);
    }
  };

  const totalRecords = services.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = services.slice(startIndex, endIndex);

  const handleRecordsPerPageChange = (value: string) => {
    setRecordsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleConfigure = (service: CronJob) => {
    router.push(`/admin/configuration/services/${encodeURIComponent(service.jobName)}/configure`);
  };

  const activeServices = services.filter(s => s.status).length;
  const inactiveServices = services.filter(s => !s.status).length;

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Service List</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Manage and configure middleware services
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="p-4 md:p-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Service List</h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">
          Manage and configure middleware services
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecords}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeServices}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Inactive Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inactiveServices}</div>
          </CardContent>
        </Card>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Registered Services</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            View and manage all registered middleware services and their schedules
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
          {services.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No services configured yet.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cron Expression</TableHead>
                    <TableHead>Night Cron</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRecords.map((service) => (
                    <TableRow key={service.jobName}>
                      <TableCell className="font-medium">{service.jobName}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            service.status
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }
                        >
                          {service.status ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {service.cron}
                        </code>
                      </TableCell>
                      <TableCell>
                        {service.nightCron ? (
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {service.nightCron}
                          </code>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleConfigure(service)}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Configure
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination Footer */}
              {totalRecords > 5 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t">
                  {/* Records per page selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Show</span>
                    <Select
                      value={String(recordsPerPage)}
                      onValueChange={handleRecordsPerPageChange}
                    >
                      <SelectTrigger className="w-[70px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-500">records</span>
                  </div>

                  {/* Pagination Info and Controls */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      Showing {startIndex + 1} to {Math.min(endIndex, totalRecords)} of {totalRecords} entries
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-8"
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
