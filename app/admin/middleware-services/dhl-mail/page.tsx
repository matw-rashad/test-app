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

// DHL Status interfaces
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

// DHL Mail Template interfaces
interface DHLMailTemplate {
  id: number;
  trackingStatusCode: string;
  templateKey: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DHLMailTemplateFormData {
  templateKey: string;
  description: string;
  isActive: boolean;
}

const initialStatusFormData: DHLStatusFormData = {
  service: "",
  status: "",
  statusCode: "",
  description: "",
  sendMail: false,
  timeCheck: false,
  duration: 0,
};

const initialTemplateFormData: DHLMailTemplateFormData = {
  templateKey: "",
  description: "",
  isActive: true,
};

export default function DHLMailConfiguration() {
  // DHL Status state
  const [statuses, setStatuses] = useState<DHLStatus[]>([]);
  const [isLoadingStatuses, setIsLoadingStatuses] = useState(true);
  const [statusError, setStatusError] = useState("");
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);
  const [statusFormData, setStatusFormData] = useState<DHLStatusFormData>(initialStatusFormData);
  const [statusFormError, setStatusFormError] = useState("");
  const [editingStatus, setEditingStatus] = useState<DHLStatus | null>(null);

  // DHL Mail Template state
  const [templates, setTemplates] = useState<DHLMailTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [templateError, setTemplateError] = useState("");
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isSubmittingTemplate, setIsSubmittingTemplate] = useState(false);
  const [templateFormData, setTemplateFormData] = useState<DHLMailTemplateFormData>(initialTemplateFormData);
  const [templateFormError, setTemplateFormError] = useState("");
  const [editingTemplate, setEditingTemplate] = useState<DHLMailTemplate | null>(null);

  useEffect(() => {
    fetchStatuses();
    fetchTemplates();
  }, []);

  // ==================== DHL Status Functions ====================
  const fetchStatuses = async () => {
    try {
      setIsLoadingStatuses(true);
      setStatusError("");
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
      setStatusError(err instanceof Error ? err.message : "Failed to fetch DHL statuses");
    } finally {
      setIsLoadingStatuses(false);
    }
  };

  const handleOpenCreateStatus = () => {
    setEditingStatus(null);
    setStatusFormData(initialStatusFormData);
    setStatusFormError("");
    setIsStatusDialogOpen(true);
  };

  const handleOpenEditStatus = (status: DHLStatus) => {
    setEditingStatus(status);
    setStatusFormData({
      service: status.service,
      status: status.status,
      statusCode: status.statusCode || "",
      description: status.description || "",
      sendMail: status.sendMail,
      timeCheck: status.timeCheck,
      duration: status.duration,
    });
    setStatusFormError("");
    setIsStatusDialogOpen(true);
  };

  const handleCloseStatusDialog = () => {
    setIsStatusDialogOpen(false);
    setEditingStatus(null);
    setStatusFormData(initialStatusFormData);
    setStatusFormError("");
  };

  const handleSubmitStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusFormError("");

    if (!statusFormData.service.trim()) {
      setStatusFormError("Service is required");
      return;
    }
    if (!statusFormData.status.trim()) {
      setStatusFormError("Status is required");
      return;
    }
    if (statusFormData.service.length > 20) {
      setStatusFormError("Service must be 20 characters or less");
      return;
    }
    if (statusFormData.status.length > 20) {
      setStatusFormError("Status must be 20 characters or less");
      return;
    }
    if (statusFormData.description.length > 250) {
      setStatusFormError("Description must be 250 characters or less");
      return;
    }

    setIsSubmittingStatus(true);

    try {
      const url = editingStatus
        ? `/api/dhlmail/UpdateDhlStatus/${editingStatus.id}`
        : "/api/dhlmail/CreateDhlStatus";

      const method = editingStatus ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: statusFormData.service,
          status: statusFormData.status,
          statusCode: statusFormData.statusCode || null,
          description: statusFormData.description || null,
          sendMail: statusFormData.sendMail,
          timeCheck: statusFormData.timeCheck,
          duration: statusFormData.timeCheck ? statusFormData.duration : 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${editingStatus ? "update" : "create"} DHL status`);
      }

      handleCloseStatusDialog();
      await fetchStatuses();
    } catch (err) {
      setStatusFormError(err instanceof Error ? err.message : `Failed to ${editingStatus ? "update" : "create"} DHL status`);
    } finally {
      setIsSubmittingStatus(false);
    }
  };

  // ==================== DHL Mail Template Functions ====================
  const fetchTemplates = async () => {
    try {
      setIsLoadingTemplates(true);
      setTemplateError("");
      const response = await fetch("/api/dhlmail/templates");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch DHL mail templates");
      }

      const templatesData = (data.templates || data.data || data || []).map((item: any) => ({
        id: item.Id || item.id,
        trackingStatusCode: item.TrackingStatusCode || item.trackingStatusCode,
        templateKey: item.TemplateKey || item.templateKey,
        description: item.Description || item.description,
        isActive: item.IsActive ?? item.isActive ?? true,
        createdAt: item.CreatedAt || item.createdAt,
        updatedAt: item.UpdatedAt || item.updatedAt,
      }));

      setTemplates(templatesData);
    } catch (err) {
      setTemplateError(err instanceof Error ? err.message : "Failed to fetch DHL mail templates");
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const handleOpenCreateTemplate = () => {
    setEditingTemplate(null);
    setTemplateFormData(initialTemplateFormData);
    setTemplateFormError("");
    setIsTemplateDialogOpen(true);
  };

  const handleOpenEditTemplate = (template: DHLMailTemplate) => {
    setEditingTemplate(template);
    setTemplateFormData({
      templateKey: template.templateKey,
      description: template.description || "",
      isActive: template.isActive,
    });
    setTemplateFormError("");
    setIsTemplateDialogOpen(true);
  };

  const handleCloseTemplateDialog = () => {
    setIsTemplateDialogOpen(false);
    setEditingTemplate(null);
    setTemplateFormData(initialTemplateFormData);
    setTemplateFormError("");
  };

  const handleSubmitTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setTemplateFormError("");

    if (!templateFormData.templateKey.trim()) {
      setTemplateFormError("Template Key is required");
      return;
    }
    if (templateFormData.templateKey.length > 100) {
      setTemplateFormError("Template Key must be 100 characters or less");
      return;
    }
    if (templateFormData.description.length > 250) {
      setTemplateFormError("Description must be 250 characters or less");
      return;
    }

    setIsSubmittingTemplate(true);

    try {
      const url = editingTemplate
        ? `/api/dhlmail/templates/${editingTemplate.id}`
        : "/api/dhlmail/templates";

      const method = editingTemplate ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateKey: templateFormData.templateKey,
          description: templateFormData.description || null,
          isActive: templateFormData.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${editingTemplate ? "update" : "create"} template`);
      }

      handleCloseTemplateDialog();
      await fetchTemplates();
    } catch (err) {
      setTemplateFormError(err instanceof Error ? err.message : `Failed to ${editingTemplate ? "update" : "create"} template`);
    } finally {
      setIsSubmittingTemplate(false);
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
              <Button onClick={handleOpenCreateStatus} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            {statusError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{statusError}</AlertDescription>
              </Alert>
            )}

            {isLoadingStatuses ? (
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
                          onClick={() => handleOpenEditStatus(status)}
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

        {/* DHL Mail Templates Table */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base md:text-lg">DHL Mail Templates</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Manage DHL mail template configurations
                </CardDescription>
              </div>
              <Button onClick={handleOpenCreateTemplate} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            {templateError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{templateError}</AlertDescription>
              </Alert>
            )}

            {isLoadingTemplates ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-[50px]" />
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-[60px]" />
                    <Skeleton className="h-8 w-[60px]" />
                  </div>
                ))}
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No DHL mail templates configured yet.</p>
                <p className="text-sm">Click &quot;Create New&quot; to add your first template.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Tracking Status Code</TableHead>
                    <TableHead>Template Key</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.id}</TableCell>
                      <TableCell className="font-medium">{template.trackingStatusCode}</TableCell>
                      <TableCell>{template.templateKey}</TableCell>
                      <TableCell className="text-gray-600 max-w-[300px] truncate">
                        {template.description || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={template.isActive ? "default" : "secondary"}>
                          {template.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditTemplate(template)}
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
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
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
          <form onSubmit={handleSubmitStatus}>
            <div className="grid gap-4 py-4">
              {statusFormError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{statusFormError}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service">
                    Service <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="service"
                    value={statusFormData.service}
                    onChange={(e) => setStatusFormData({ ...statusFormData, service: e.target.value })}
                    maxLength={20}
                    placeholder="Enter service name"
                    disabled={isSubmittingStatus}
                  />
                  <p className="text-xs text-gray-500">{statusFormData.service.length}/20</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="status"
                    value={statusFormData.status}
                    onChange={(e) => setStatusFormData({ ...statusFormData, status: e.target.value })}
                    maxLength={20}
                    placeholder="Enter status"
                    disabled={isSubmittingStatus}
                  />
                  <p className="text-xs text-gray-500">{statusFormData.status.length}/20</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="statusCode">Status Code</Label>
                <Input
                  id="statusCode"
                  value={statusFormData.statusCode}
                  onChange={(e) => setStatusFormData({ ...statusFormData, statusCode: e.target.value })}
                  placeholder="Enter status code"
                  disabled={isSubmittingStatus}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="statusDescription">Description</Label>
                <Input
                  id="statusDescription"
                  value={statusFormData.description}
                  onChange={(e) => setStatusFormData({ ...statusFormData, description: e.target.value })}
                  maxLength={250}
                  placeholder="Enter description"
                  disabled={isSubmittingStatus}
                />
                <p className="text-xs text-gray-500">{statusFormData.description.length}/250</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sendMail">Send Mail</Label>
                  <p className="text-xs text-gray-500">Send email notification for this status</p>
                </div>
                <Switch
                  id="sendMail"
                  checked={statusFormData.sendMail}
                  onCheckedChange={(checked) => setStatusFormData({ ...statusFormData, sendMail: checked })}
                  disabled={isSubmittingStatus}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="timeCheck">Time Check</Label>
                  <p className="text-xs text-gray-500">Enable time-based checking for this status</p>
                </div>
                <Switch
                  id="timeCheck"
                  checked={statusFormData.timeCheck}
                  onCheckedChange={(checked) => setStatusFormData({ ...statusFormData, timeCheck: checked })}
                  disabled={isSubmittingStatus}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={0}
                  value={statusFormData.duration}
                  onChange={(e) => setStatusFormData({ ...statusFormData, duration: parseInt(e.target.value) || 0 })}
                  placeholder="Enter duration in hours"
                  disabled={isSubmittingStatus || !statusFormData.timeCheck}
                />
                {!statusFormData.timeCheck && (
                  <p className="text-xs text-gray-500">Enable &quot;Time Check&quot; to set duration</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseStatusDialog} disabled={isSubmittingStatus}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmittingStatus}>
                {isSubmittingStatus
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

      {/* Create/Edit DHL Mail Template Dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit DHL Mail Template" : "Create New DHL Mail Template"}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate
                ? "Update the DHL mail template configuration."
                : "Add a new DHL mail template configuration."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitTemplate}>
            <div className="grid gap-4 py-4">
              {templateFormError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{templateFormError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="templateKey">
                  Template Key <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="templateKey"
                  value={templateFormData.templateKey}
                  onChange={(e) => setTemplateFormData({ ...templateFormData, templateKey: e.target.value })}
                  maxLength={100}
                  placeholder="Enter template key"
                  disabled={isSubmittingTemplate || !!editingTemplate}
                />
                <p className="text-xs text-gray-500">{templateFormData.templateKey.length}/100</p>
                {editingTemplate && (
                  <p className="text-xs text-amber-600">Template key cannot be changed after creation</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="templateDescription">Description</Label>
                <Input
                  id="templateDescription"
                  value={templateFormData.description}
                  onChange={(e) => setTemplateFormData({ ...templateFormData, description: e.target.value })}
                  maxLength={250}
                  placeholder="Enter description"
                  disabled={isSubmittingTemplate}
                />
                <p className="text-xs text-gray-500">{templateFormData.description.length}/250</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive">Active</Label>
                  <p className="text-xs text-gray-500">Enable or disable this template</p>
                </div>
                <Switch
                  id="isActive"
                  checked={templateFormData.isActive}
                  onCheckedChange={(checked) => setTemplateFormData({ ...templateFormData, isActive: checked })}
                  disabled={isSubmittingTemplate}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseTemplateDialog} disabled={isSubmittingTemplate}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmittingTemplate}>
                {isSubmittingTemplate
                  ? editingTemplate
                    ? "Updating..."
                    : "Creating..."
                  : editingTemplate
                    ? "Update Template"
                    : "Create Template"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
