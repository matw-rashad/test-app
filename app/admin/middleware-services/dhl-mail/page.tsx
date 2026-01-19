"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Loader2, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
interface DHLMailTemplateLine {
  id?: number;
  language: string;
  mailSubject: string;
  mailBody: string;
}

interface DHLMailTemplate {
  id: number;
  trackingStatusCode: string;
  templateKey: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  templateLines?: DHLMailTemplateLine[];
}

interface DHLMailTemplateFormData {
  templateKey: string;
  trackingStatusCode: string;
  description: string;
  isActive: boolean;
  templateLines: DHLMailTemplateLine[];
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

const initialTemplateLine: DHLMailTemplateLine = {
  language: "",
  mailSubject: "",
  mailBody: "",
};

const initialTemplateFormData: DHLMailTemplateFormData = {
  templateKey: "",
  trackingStatusCode: "",
  description: "",
  isActive: true,
  templateLines: [{ ...initialTemplateLine }],
};

export default function DHLMailConfiguration() {
  const router = useRouter();

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

  // Status codes for dropdown
  const [statusCodes, setStatusCodes] = useState<string[]>([]);
  const [isLoadingStatusCodes, setIsLoadingStatusCodes] = useState(false);

  // Services for dropdown
  const [services, setServices] = useState<string[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  // Loading state for edit dialog
  const [isLoadingEditDialog, setIsLoadingEditDialog] = useState(false);

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<"status" | "template" | null>(null);
  const [itemToDelete, setItemToDelete] = useState<DHLStatus | DHLMailTemplate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const fetchServices = async () => {
    try {
      setIsLoadingServices(true);
      const response = await fetch("/api/dhlmail/services");
      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch services:", data.message);
        return;
      }
      console.log("Fetched services:", data);

      // Handle both array of strings and array of objects
      const servicesList = Array.isArray(data)
        ? data
            .map((item: any) => (typeof item === "string" ? item : item.serviceName || item.servicename || ""))
            .filter((s: string) => s && s.trim())
        : [];
      setServices(servicesList);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setIsLoadingServices(false);
    }
  };

  const handleOpenCreateStatus = () => {
    setEditingStatus(null);
    setStatusFormData(initialStatusFormData);
    setStatusFormError("");
    setIsStatusDialogOpen(true);
    fetchServices();
    fetchStatusCodes();
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
    fetchServices();
    fetchStatusCodes();
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

  // ==================== Status Codes Functions ====================
  const fetchStatusCodes = async () => {
    try {
      setIsLoadingStatusCodes(true);
      const response = await fetch("/api/dhlmail/statusCodes");
      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch status codes:", data.message);
        return;
      }

      // Handle both array of strings and array of objects
      const codes = Array.isArray(data)
        ? data.map((item: any) => (typeof item === "string" ? item : item.StatusCode || item.statusCode || item))
        : [];
      setStatusCodes(codes);
    } catch (err) {
      console.error("Failed to fetch status codes:", err);
    } finally {
      setIsLoadingStatusCodes(false);
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

  const fetchTemplateWithLines = async (templateId: number): Promise<DHLMailTemplate | null> => {
    try {
      const response = await fetch(`/api/dhlmail/templates/${templateId}/full`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch template details");
      }

      const templateData = data.data || data;
      return {
        id: templateData.Id || templateData.id,
        trackingStatusCode: templateData.TrackingStatusCode || templateData.trackingStatusCode,
        templateKey: templateData.TemplateKey || templateData.templateKey,
        description: templateData.Description || templateData.description,
        isActive: templateData.IsActive ?? templateData.isActive ?? true,
        createdAt: templateData.CreatedAt || templateData.createdAt,
        updatedAt: templateData.UpdatedAt || templateData.updatedAt,
        templateLines: (templateData.TemplateLines || templateData.templateLines || []).map((line: any) => ({
          id: line.Id || line.id,
          language: line.Language || line.language,
          mailSubject: line.MailSubject || line.mailSubject,
          mailBody: line.MailBody || line.mailBody,
        })),
      };
    } catch (err) {
      console.error("Failed to fetch template with lines:", err);
      return null;
    }
  };

  const handleOpenCreateTemplate = () => {
    setEditingTemplate(null);
    setTemplateFormData({
      ...initialTemplateFormData,
      templateLines: [{ ...initialTemplateLine }],
    });
    setTemplateFormError("");
    setIsTemplateDialogOpen(true);
    fetchStatusCodes();
  };

  const handleOpenEditTemplate = async (template: DHLMailTemplate) => {
    setTemplateFormError("");
    setIsLoadingEditDialog(true);
    setIsTemplateDialogOpen(true);

    // Fetch template with lines and status codes in parallel
    const [fullTemplate] = await Promise.all([
      fetchTemplateWithLines(template.id),
      fetchStatusCodes(),
    ]);

    if (fullTemplate) {
      setEditingTemplate(fullTemplate);
      setTemplateFormData({
        trackingStatusCode: fullTemplate.trackingStatusCode,
        templateKey: fullTemplate.templateKey,
        description: fullTemplate.description || "",
        isActive: fullTemplate.isActive,
        templateLines: fullTemplate.templateLines && fullTemplate.templateLines.length > 0
          ? fullTemplate.templateLines
          : [{ ...initialTemplateLine }],
      });
    } else {
      setEditingTemplate(template);
      setTemplateFormData({
        trackingStatusCode: template.trackingStatusCode,
        templateKey: template.templateKey,
        description: template.description || "",
        isActive: template.isActive,
        templateLines: [{ ...initialTemplateLine }],
      });
    }

    setIsLoadingEditDialog(false);
  };

  const handleCloseTemplateDialog = () => {
    setIsTemplateDialogOpen(false);
    setEditingTemplate(null);
    setTemplateFormData(initialTemplateFormData);
    setTemplateFormError("");
    setIsLoadingEditDialog(false);
  };

  // ==================== Delete Functions ====================
  const handleOpenDeleteDialog = (type: "status" | "template", item: DHLStatus | DHLMailTemplate) => {
    setDeleteType(type);
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteType(null);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete || !deleteType) return;

    setIsDeleting(true);

    try {
      const url = deleteType === "status"
        ? `/api/dhlmail/DeleteDhlStatus/${itemToDelete.id}`
        : `/api/dhlmail/templates/${itemToDelete.id}`;

      const response = await fetch(url, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to delete ${deleteType}`);
      }

      handleCloseDeleteDialog();

      // Refresh the appropriate list
      if (deleteType === "status") {
        await fetchStatuses();
      } else {
        await fetchTemplates();
      }
    } catch (err) {
      // Show error in the appropriate section
      if (deleteType === "status") {
        setStatusError(err instanceof Error ? err.message : "Failed to delete status");
      } else {
        setTemplateError(err instanceof Error ? err.message : "Failed to delete template");
      }
      handleCloseDeleteDialog();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddTemplateLine = () => {
    setTemplateFormData({
      ...templateFormData,
      templateLines: [...templateFormData.templateLines, { ...initialTemplateLine }],
    });
  };

  const handleRemoveTemplateLine = (index: number) => {
    if (templateFormData.templateLines.length > 1) {
      const newLines = templateFormData.templateLines.filter((_, i) => i !== index);
      setTemplateFormData({
        ...templateFormData,
        templateLines: newLines,
      });
    }
  };

  const handleTemplateLineChange = (index: number, field: keyof DHLMailTemplateLine, value: string) => {
    const newLines = [...templateFormData.templateLines];
    newLines[index] = { ...newLines[index], [field]: value };
    setTemplateFormData({
      ...templateFormData,
      templateLines: newLines,
    });
  };

  const handleSubmitTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setTemplateFormError("");

    if (!editingTemplate && !templateFormData.trackingStatusCode.trim()) {
      setTemplateFormError("Tracking Status Code is required");
      return;
    }
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

    // Validate template lines
    for (let i = 0; i < templateFormData.templateLines.length; i++) {
      const line = templateFormData.templateLines[i];
      if (!line.language.trim()) {
        setTemplateFormError(`Language is required for line ${i + 1}`);
        return;
      }
      if (line.language.length > 10) {
        setTemplateFormError(`Language must be 10 characters or less for line ${i + 1}`);
        return;
      }
      if (!line.mailSubject.trim()) {
        setTemplateFormError(`Mail Subject is required for line ${i + 1}`);
        return;
      }
      if (!line.mailBody.trim()) {
        setTemplateFormError(`Mail Body is required for line ${i + 1}`);
        return;
      }
    }

    // Check for duplicate languages
    const languages = templateFormData.templateLines.map(l => l.language.toLowerCase());
    const uniqueLanguages = new Set(languages);
    if (languages.length !== uniqueLanguages.size) {
      setTemplateFormError("Each language can only be used once per template");
      return;
    }

    setIsSubmittingTemplate(true);

    try {
      if (editingTemplate) {
        // Update existing template
        // Step 1: Update template basic info
        const templateResponse = await fetch(`/api/dhlmail/templates/${editingTemplate.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateKey: editingTemplate.templateKey,
            trackingStatusCode: editingTemplate.trackingStatusCode,
            description: templateFormData.description || null,
            isActive: templateFormData.isActive,
          }),
        });

        const templateData = await templateResponse.json();

        if (!templateResponse.ok) {
          throw new Error(templateData.message || "Failed to update template");
        }

        // Step 2: Handle template lines
        const existingLines = editingTemplate.templateLines || [];
        const newLines = templateFormData.templateLines;

        // Find lines to delete (exist in old but not in new)
        const linesToDelete = existingLines.filter(
          (existingLine) => !newLines.some((newLine) => newLine.language.toUpperCase() === existingLine.language.toUpperCase())
        );

        // Find lines to update (exist in both)
        const linesToUpdate = newLines.filter((newLine) =>
          existingLines.some((existingLine) => existingLine.language.toUpperCase() === newLine.language.toUpperCase())
        );

        // Find lines to create (exist in new but not in old)
        const linesToCreate = newLines.filter(
          (newLine) => !existingLines.some((existingLine) => existingLine.language.toUpperCase() === newLine.language.toUpperCase())
        );

        // Delete removed lines
        for (const line of linesToDelete) {
          await fetch(`/api/dhlmail/templates/${editingTemplate.id}/lines/${line.language}`, {
            method: "DELETE",
          });
        }

        // Update existing lines
        for (const line of linesToUpdate) {
          await fetch(`/api/dhlmail/templates/${editingTemplate.id}/lines/${line.language}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              language: line.language,
              mailSubject: line.mailSubject,
              mailBody: line.mailBody,
            }),
          });
        }

        // Create new lines
        for (const line of linesToCreate) {
          await fetch(`/api/dhlmail/templates/${editingTemplate.id}/lines`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              language: line.language,
              mailSubject: line.mailSubject,
              mailBody: line.mailBody,
            }),
          });
        }
      } else {
        // Create new template with lines
        const response = await fetch("/api/dhlmail/templates/with-lines", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            trackingStatusCode: templateFormData.trackingStatusCode,
            templateKey: templateFormData.templateKey,
            description: templateFormData.description || null,
            isActive: templateFormData.isActive,
            templateLines: templateFormData.templateLines.map(line => ({
              language: line.language,
              mailSubject: line.mailSubject,
              mailBody: line.mailBody,
            })),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to create template");
        }
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
                    <TableHead>Mail Send</TableHead>
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
                       <TableCell className="text-gray-600 max-w-[300px] truncate">
                      
                        <Badge variant={status.sendMail ? "default" : "secondary"}>
                          {status.sendMail ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEditStatus(status)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog("status", status)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
              <Button onClick={() => router.push("/admin/middleware-services/dhl-mail/templates/new")} size="sm">
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
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/admin/middleware-services/dhl-mail/templates/${template.id}/edit`)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog("template", template)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
                  <Select
                    value={statusFormData.service || undefined}
                    onValueChange={(value) => setStatusFormData({ ...statusFormData, service: value })}
                    disabled={isSubmittingStatus || isLoadingServices}
                  >
                    <SelectTrigger id="service">
                      <SelectValue placeholder={isLoadingServices ? "Loading..." : "Select service"} />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <Select
                  value={statusFormData.statusCode || undefined}
                  onValueChange={(value) => setStatusFormData({ ...statusFormData, statusCode: value === "none" ? "" : value })}
                  disabled={isSubmittingStatus || isLoadingStatusCodes}
                >
                  <SelectTrigger id="statusCode">
                    <SelectValue placeholder={isLoadingStatusCodes ? "Loading..." : "Select status code"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-muted-foreground">
                      None
                    </SelectItem>
                    {statusCodes.map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

      {/*
        Template Dialog has been replaced with dedicated pages:
        - Create: /admin/middleware-services/dhl-mail/templates/new
        - Edit: /admin/middleware-services/dhl-mail/templates/[id]/edit
      */}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteType === "status" ? (
                <>
                  This will permanently delete the DHL status{" "}
                  <span className="font-semibold">
                    &quot;{(itemToDelete as DHLStatus)?.service} - {(itemToDelete as DHLStatus)?.status}&quot;
                  </span>
                  . This action cannot be undone.
                </>
              ) : (
                <>
                  This will permanently delete the mail template{" "}
                  <span className="font-semibold">
                    &quot;{(itemToDelete as DHLMailTemplate)?.templateKey}&quot;
                  </span>{" "}
                  and all its associated template lines. This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
