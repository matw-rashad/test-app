"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
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
import { RefreshCw, Play, Clock, ArrowRight, CalendarClock, Timer } from "lucide-react";
import { RunningJob, ScheduledJob, UpcomingJobsResponse } from "@/types/integrations";

export default function AdminPage() {
  const [runningJobs, setRunningJobs] = useState<RunningJob[]>([]);
  const [scheduledJobs, setScheduledJobs] = useState<ScheduledJob[]>([]);
  const [upcomingJobsData, setUpcomingJobsData] = useState<UpcomingJobsResponse | null>(null);
  const [isLoadingRunning, setIsLoadingRunning] = useState(true);
  const [isLoadingScheduled, setIsLoadingScheduled] = useState(true);
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshCountdown, setRefreshCountdown] = useState(5);
  const nextRefreshAtRef = useRef<number | null>(null);
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      console.error(errorMessage);
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
      console.error(errorMessage);
      setScheduledJobs([]);
    } finally {
      setIsLoadingScheduled(false);
    }
  }, []);

  const fetchUpcomingJobs = useCallback(async () => {
    try {
      const response = await fetch("/api/configuration/upcoming-jobs?hoursAhead=24&limit=5");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch upcoming jobs");
      }

      setUpcomingJobsData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch upcoming jobs";
      console.error(errorMessage);
      setUpcomingJobsData(null);
    } finally {
      setIsLoadingUpcoming(false);
    }
  }, []);

  const refreshJobs = useCallback(async (options?: { showToast?: boolean }) => {
    const shouldShowToast = options?.showToast ?? true;
    setIsRefreshing(true);
    await Promise.all([fetchRunningJobs(), fetchScheduledJobs(), fetchUpcomingJobs()]);
    setIsRefreshing(false);
    if (shouldShowToast) {
      toast.success("Jobs refreshed");
    }
  }, [fetchRunningJobs, fetchScheduledJobs, fetchUpcomingJobs]);

  useEffect(() => {
    let isMounted = true;
    const refreshIntervalMs = 5000;

    const scheduleRefresh = () => {
      nextRefreshAtRef.current = Date.now() + refreshIntervalMs;
      setRefreshCountdown(Math.ceil(refreshIntervalMs / 1000));
      refreshTimeoutRef.current = setTimeout(async () => {
        await refreshJobs({ showToast: false });
        if (isMounted) {
          scheduleRefresh();
        }
      }, refreshIntervalMs);
    };

    refreshJobs({ showToast: false });
    scheduleRefresh();

    countdownIntervalRef.current = setInterval(() => {
      if (!nextRefreshAtRef.current) return;
      const remainingMs = Math.max(0, nextRefreshAtRef.current - Date.now());
      const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
      setRefreshCountdown(remainingSeconds);
    }, 1000);

    return () => {
      isMounted = false;
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [refreshJobs]);

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

  const getTimeUntilBadge = (timeFormatted: string) => {
    const isUrgent = timeFormatted.includes("s") && !timeFormatted.includes("m") && !timeFormatted.includes("h") && !timeFormatted.includes("d");
    const isSoon = timeFormatted.includes("m") && !timeFormatted.includes("h") && !timeFormatted.includes("d");

    if (isUrgent) {
      return (
        <Badge variant="destructive" className="font-mono">
          {timeFormatted}
        </Badge>
      );
    }
    if (isSoon) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200 font-mono">
          {timeFormatted}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="font-mono">
        {timeFormatted}
      </Badge>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Welcome to the admin panel
          </p>
        </div>
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
              <CalendarClock className="h-4 w-4" />
              Upcoming (24h)
            </CardDescription>
            <CardTitle className="text-2xl md:text-3xl text-blue-600">
              {isLoadingUpcoming ? <Skeleton className="h-9 w-12" /> : upcomingJobsData?.totalCount ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4 md:p-6 pb-3">
            <CardDescription className="text-xs md:text-sm">Paused Jobs</CardDescription>
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
            <CardDescription className="text-xs md:text-sm">Error Jobs</CardDescription>
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

      {/* Running Jobs Card */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-green-600" />
              <CardTitle className="text-base md:text-lg">Currently Running Jobs</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refreshJobs()}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5" />
                <span>Auto refresh in {refreshCountdown}s</span>
              </div>
              <Link href="/admin/configuration/jobs">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
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
            <div className="text-center py-6 text-gray-500">
              <Play className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No jobs are currently running</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Name</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Started At</TableHead>
                    <TableHead>Run Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runningJobs.map((job, index) => (
                    <TableRow key={`${job.jobName}-${index}`}>
                      <TableCell className="font-medium">{job.jobName}</TableCell>
                      <TableCell>{job.jobGroup}</TableCell>
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

      {/* Upcoming Jobs Card */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base md:text-lg">Upcoming Jobs</CardTitle>
            </div>
            <Link href="/admin/configuration/jobs">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          <CardDescription className="text-xs md:text-sm">
            Next scheduled job executions (within 24 hours)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
          {isLoadingUpcoming ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : !upcomingJobsData || upcomingJobsData.jobs.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <CalendarClock className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No upcoming jobs in the next 24 hours</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Name</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Next Fire Time</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Timer className="h-4 w-4" />
                        Time Until
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingJobsData.jobs.map((job, index) => (
                    <TableRow key={`${job.jobName}-${index}`}>
                      <TableCell className="font-medium">{job.jobName}</TableCell>
                      <TableCell>{job.jobGroup}</TableCell>
                      <TableCell>{formatDateTime(job.nextFireTime)}</TableCell>
                      <TableCell>{getTimeUntilBadge(job.timeUntilFireFormatted)}</TableCell>
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
