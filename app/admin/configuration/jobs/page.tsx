"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw, Play, Clock, AlertCircle } from "lucide-react";
import { RunningJob, ScheduledJob } from "@/types/integrations";

export default function JobsPage() {
  const [runningJobs, setRunningJobs] = useState<RunningJob[]>([]);
  const [scheduledJobs, setScheduledJobs] = useState<ScheduledJob[]>([]);
  const [isLoadingRunning, setIsLoadingRunning] = useState(true);
  const [isLoadingScheduled, setIsLoadingScheduled] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRunningJobs = useCallback(async () => {
    try {
      const response = await fetch("/api/configuration/running-jobs");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch running jobs");
      }

      setRunningJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch running jobs";
      toast.error(errorMessage);
      setRunningJobs([]);
    } finally {
      setIsLoadingRunning(false);
    }
  }, []);

  const fetchScheduledJobs = useCallback(async () => {
    try {
      const response = await fetch("/api/configuration/scheduled-jobs");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch scheduled jobs");
      }

      setScheduledJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch scheduled jobs";
      toast.error(errorMessage);
      setScheduledJobs([]);
    } finally {
      setIsLoadingScheduled(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([fetchRunningJobs(), fetchScheduledJobs()]);
    setIsRefreshing(false);
    toast.success("Jobs refreshed");
  }, [fetchRunningJobs, fetchScheduledJobs]);

  useEffect(() => {
    fetchRunningJobs();
    fetchScheduledJobs();
  }, [fetchRunningJobs, fetchScheduledJobs]);

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const formatRunTime = (runTime: string) => {
    if (!runTime) return "N/A";
    // RunTime comes as TimeSpan string like "00:00:05.1234567"
    const parts = runTime.split(":");
    if (parts.length === 3) {
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      const seconds = parseFloat(parts[2]);
      if (hours > 0) return `${hours}h ${minutes}m ${seconds.toFixed(0)}s`;
      if (minutes > 0) return `${minutes}m ${seconds.toFixed(0)}s`;
      return `${seconds.toFixed(1)}s`;
    }
    return runTime;
  };

  const getStateBadge = (state: ScheduledJob["state"]) => {
    const variants: Record<ScheduledJob["state"], { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
      Normal: { variant: "default", className: "bg-green-100 text-green-700 border-green-200" },
      Paused: { variant: "secondary", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
      Complete: { variant: "default", className: "bg-blue-100 text-blue-700 border-blue-200" },
      Error: { variant: "destructive", className: "" },
      Blocked: { variant: "secondary", className: "bg-orange-100 text-orange-700 border-orange-200" },
      None: { variant: "outline", className: "" },
    };
    const config = variants[state] || variants.None;
    return (
      <Badge variant={config.variant} className={config.className}>
        {state}
      </Badge>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Job Monitor</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Monitor running and scheduled background jobs
          </p>
        </div>
        <Button
          variant="outline"
          onClick={refreshAll}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="p-4 md:p-6 pb-3">
            <CardDescription className="flex items-center gap-2 text-xs md:text-sm">
              <Play className="h-4 w-4" />
              Running Jobs
            </CardDescription>
            <CardTitle className="text-2xl md:text-3xl text-green-600">
              {isLoadingRunning ? <Skeleton className="h-9 w-12" /> : runningJobs.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4 md:p-6 pb-3">
            <CardDescription className="flex items-center gap-2 text-xs md:text-sm">
              <Clock className="h-4 w-4" />
              Scheduled Jobs
            </CardDescription>
            <CardTitle className="text-2xl md:text-3xl">
              {isLoadingScheduled ? <Skeleton className="h-9 w-12" /> : scheduledJobs.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4 md:p-6 pb-3">
            <CardDescription className="flex items-center gap-2 text-xs md:text-sm">
              <AlertCircle className="h-4 w-4" />
              Paused Jobs
            </CardDescription>
            <CardTitle className="text-2xl md:text-3xl text-yellow-600">
              {isLoadingScheduled ? (
                <Skeleton className="h-9 w-12" />
              ) : (
                scheduledJobs.filter((j) => j.state === "Paused").length
              )}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4 md:p-6 pb-3">
            <CardDescription className="flex items-center gap-2 text-xs md:text-sm">
              <AlertCircle className="h-4 w-4" />
              Error Jobs
            </CardDescription>
            <CardTitle className="text-2xl md:text-3xl text-red-600">
              {isLoadingScheduled ? (
                <Skeleton className="h-9 w-12" />
              ) : (
                scheduledJobs.filter((j) => j.state === "Error").length
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Running Jobs */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <div className="flex items-center gap-2">
            <Play className="h-5 w-5 text-green-600" />
            <CardTitle className="text-base md:text-lg">Currently Running Jobs</CardTitle>
          </div>
          <CardDescription className="text-xs md:text-sm">
            Jobs that are currently being executed
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
          {isLoadingRunning ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : runningJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Play className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>No jobs are currently running</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Name</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Started At</TableHead>
                    <TableHead>Run Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runningJobs.map((job, index) => (
                    <TableRow key={`${job.jobName}-${index}`}>
                      <TableCell className="font-medium">{job.jobName}</TableCell>
                      <TableCell>{job.jobGroup}</TableCell>
                      <TableCell>{job.triggerName}</TableCell>
                      <TableCell>{formatDateTime(job.fireTime)}</TableCell>
                      <TableCell>{formatRunTime(job.runTime)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scheduled Jobs */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-base md:text-lg">Scheduled Jobs</CardTitle>
          </div>
          <CardDescription className="text-xs md:text-sm">
            All scheduled jobs and their next fire times
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
          {isLoadingScheduled ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : scheduledJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>No scheduled jobs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Name</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Next Fire Time</TableHead>
                    <TableHead>State</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledJobs.map((job, index) => (
                    <TableRow key={`${job.jobName}-${index}`}>
                      <TableCell className="font-medium">{job.jobName}</TableCell>
                      <TableCell>{job.jobGroup}</TableCell>
                      <TableCell>{formatDateTime(job.nextFireTime)}</TableCell>
                      <TableCell>{getStateBadge(job.state)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
