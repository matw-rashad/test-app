"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DHLStatus {
  id: number;
  service: string;
  status: string;
  statusCode: string | null;
  description: string | null;
  sendMail: boolean;
  timeCheck: boolean;
  duration: number;
}

interface DHLStatusFormData {
  service: string;
  status: string;
  statusCode: string;
  description: string;
  sendMail: boolean;
  timeCheck: boolean;
  duration: number;
}

const initialFormData: DHLStatusFormData = {
  service: "",
  status: "",
  statusCode: "",
  description: "",
  sendMail: false,
  timeCheck: false,
  duration: 0,
};

export default function DHLMailConfiguration() {
  const [statuses, setStatuses] = useState<DHLStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<DHLStatusFormData>(initialFormData);
  const [formError, setFormError] = useState("");
  const [editingStatus, setEditingStatus] = useState<DHLStatus | null>(null);

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch("/api/dhlmail/GetDhlStatuses");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch DHL statuses");
      }

      const statusesData = (data.statuses || data || []).map((item: any) => ({
        id: item.Id || item.id,
        service: item.Service || item.service,
        status: item.Status || item.status,
        statusCode: item.StatusCode || item.statusCode,
        description: item.Description || item.description,
        sendMail: item.SendMail || item.sendMail || false,
        timeCheck: item.TimeCheck || item.timeCheck || false,
        duration: item.Duration || item.duration || 0,
      }));

      setStatuses(statusesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch DHL statuses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingStatus(null);
    setFormData(initialFormData);
    setFormError("");
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (status: DHLStatus) => {
    setEditingStatus(status);
    setFormData({
      service: status.service,
      status: status.status,
      statusCode: status.statusCode || "",
      description: status.description || "",
      sendMail: status.sendMail,
      timeCheck: status.timeCheck,
      duration: status.duration,
    });
    setFormError("");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingStatus(null);
    setFormData(initialFormData);
    setFormError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.service.trim()) {
      setFormError("Service is required");
      return;
    }
    if (!formData.status.trim()) {
      setFormError("Status is required");
      return;
    }
    if (formData.service.length > 20) {
      setFormError("Service must be 20 characters or less");
      return;
    }
    if (formData.status.length > 20) {
      setFormError("Status must be 20 characters or less");
      return;
    }
    if (formData.description.length > 250) {
      setFormError("Description must be 250 characters or less");
      return;
    }

    setIsSubmitting(true);

    try {
      const url = editingStatus
        ? `/api/dhlmail/UpdateDhlStatus/${editingStatus.id}`
        : "/api/dhlmail/CreateDhlStatus";

      const method = editingStatus ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: formData.service,
          status: formData.status,
          statusCode: formData.statusCode || null,
          description: formData.description || null,
          sendMail: formData.sendMail,
          timeCheck: formData.timeCheck,
          duration: formData.timeCheck ? formData.duration : 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${editingStatus ? "update" : "create"} DHL status`);
      }

      handleCloseDialog();
      await fetchStatuses();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : `Failed to ${editingStatus ? "update" : "create"} DHL status`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">DHL Mail Configuration</h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">
          Configure DHL mail service integration for shipping and logistics
        </p>
      </div>

      {/* Configuration Cards */}
      <div className="grid gap-4 md:gap-6">  
        {/* DHL Statuses Table */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base md:text-lg">DHL Statuses</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Manage DHL status configurations
                </CardDescription>
              </div>
              <Button onClick={handleOpenCreate} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-[50px]" />
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-8 w-[60px]" />
                  </div>
                ))}
              </div>
            ) : statuses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No DHL statuses configured yet.</p>
                <p className="text-sm">Click &quot;Create New&quot; to add your first status.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statuses.map((status) => (
                    <TableRow key={status.id}>
                      <TableCell className="font-medium">{status.id}</TableCell>
                      <TableCell>{status.service}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{status.status}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 max-w-[300px] truncate">
                        {status.description || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(status)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>       
      </div>

      {/* Create/Edit DHL Status Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingStatus ? "Edit DHL Status" : "Create New DHL Status"}
            </DialogTitle>
            <DialogDescription>
              {editingStatus
                ? "Update the DHL status configuration."
                : "Add a new DHL status configuration."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {formError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service">
                    Service <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="service"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    maxLength={20}
                    placeholder="Enter service name"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500">{formData.service.length}/20</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    maxLength={20}
                    placeholder="Enter status"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500">{formData.status.length}/20</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="statusCode">Status Code</Label>
                <Input
                  id="statusCode"
                  value={formData.statusCode}
                  onChange={(e) => setFormData({ ...formData, statusCode: e.target.value })}
                  placeholder="Enter status code"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  maxLength={250}
                  placeholder="Enter description"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500">{formData.description.length}/250</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sendMail">Send Mail</Label>
                  <p className="text-xs text-gray-500">Send email notification for this status</p>
                </div>
                <Switch
                  id="sendMail"
                  checked={formData.sendMail}
                  onCheckedChange={(checked) => setFormData({ ...formData, sendMail: checked })}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="timeCheck">Time Check</Label>
                  <p className="text-xs text-gray-500">Enable time-based checking for this status</p>
                </div>
                <Switch
                  id="timeCheck"
                  checked={formData.timeCheck}
                  onCheckedChange={(checked) => setFormData({ ...formData, timeCheck: checked })}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={0}
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  placeholder="Enter duration in hours"
                  disabled={isSubmitting || !formData.timeCheck}
                />
                {!formData.timeCheck && (
                  <p className="text-xs text-gray-500">Enable &quot;Time Check&quot; to set duration</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? editingStatus
                    ? "Updating..."
                    : "Creating..."
                  : editingStatus
                    ? "Update Status"
                    : "Create Status"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
