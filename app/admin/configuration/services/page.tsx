"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

type Service = {
  id: number;
  serviceName: string;
  status: "Active" | "Deactive";
  runningPeriod: string;
};

const dummyServices: Service[] = [
  { id: 1, serviceName: "DHL Mail Processor", status: "Active", runningPeriod: "0 0/5 * * * ?" },
  { id: 2, serviceName: "Order Sync Service", status: "Active", runningPeriod: "0 0 * * * ?" },
  { id: 3, serviceName: "Inventory Update", status: "Active", runningPeriod: "0 0/15 * * * ?" },
  { id: 4, serviceName: "Payment Gateway Sync", status: "Active", runningPeriod: "0 0/10 * * * ?" },
  { id: 5, serviceName: "Email Notification Service", status: "Deactive", runningPeriod: "0 0/30 * * * ?" },
  { id: 6, serviceName: "Customer Data Sync", status: "Active", runningPeriod: "0 0 0/2 * * ?" },
  { id: 7, serviceName: "Report Generator", status: "Active", runningPeriod: "0 0 6 * * ?" },
  { id: 8, serviceName: "Cache Cleanup", status: "Active", runningPeriod: "0 0 0 * * ?" },
  { id: 9, serviceName: "Backup Service", status: "Active", runningPeriod: "0 0 2 * * ?" },
  { id: 10, serviceName: "Log Archiver", status: "Deactive", runningPeriod: "0 0 3 * * ?" },
  { id: 11, serviceName: "API Rate Limiter", status: "Active", runningPeriod: "0 0/1 * * * ?" },
  { id: 12, serviceName: "Session Cleanup", status: "Active", runningPeriod: "0 0/30 * * * ?" },
  { id: 13, serviceName: "Webhook Dispatcher", status: "Deactive", runningPeriod: "0 0/5 * * * ?" },
  { id: 14, serviceName: "Analytics Aggregator", status: "Active", runningPeriod: "0 0 * * * ?" },
  { id: 15, serviceName: "Health Check Monitor", status: "Active", runningPeriod: "0 0/2 * * * ?" },
];

export default function ServiceListPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const totalRecords = dummyServices.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = dummyServices.slice(startIndex, endIndex);

  const handleRecordsPerPageChange = (value: string) => {
    setRecordsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleConfigure = (service: Service) => {
    router.push(`/admin/configuration/services/${service.id}/configure`);
  };

  const activeServices = dummyServices.filter(s => s.status === "Active").length;
  const deactiveServices = dummyServices.filter(s => s.status === "Deactive").length;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Service List</h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">
          Manage and configure middleware services
        </p>
      </div>

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
            <div className="text-2xl font-bold text-red-600">{deactiveServices}</div>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Running Period (Quartz)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRecords.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.serviceName}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {service.runningPeriod}
                    </code>
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t">
            {/* Records per page selector - Bottom Left */}
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
        </CardContent>
      </Card>
    </div>
  );
}
