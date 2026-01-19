"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import VariableView from "@/components/views/variable-view";

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

const initialTemplateLine: DHLMailTemplateLine = {
  language: "",
  mailSubject: "",
  mailBody: "",
};

const stripHtml = (html: string): string => {
  if (!html) {
    return "";
  }

  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

const isHtmlEmpty = (html: string): boolean => !stripHtml(html).trim();

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.id as string;

  const [originalTemplate, setOriginalTemplate] = useState<DHLMailTemplate | null>(null);
  const [formData, setFormData] = useState<DHLMailTemplateFormData | null>(null);
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusCodes, setStatusCodes] = useState<string[]>([]);
  const [isLoadingStatusCodes, setIsLoadingStatusCodes] = useState(true);

  useEffect(() => {
    Promise.all([fetchTemplate(), fetchStatusCodes()]);
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/dhlmail/templates/${templateId}/full`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch template");
      }

      const templateData = data.data || data;
      const template: DHLMailTemplate = {
        id: templateData.Id || templateData.id,
        trackingStatusCode: templateData.TrackingStatusCode || templateData.trackingStatusCode,
        templateKey: templateData.TemplateKey || templateData.templateKey,
        description: templateData.Description || templateData.description,
        isActive: templateData.IsActive ?? templateData.isActive ?? true,
        createdAt: templateData.CreatedAt || templateData.createdAt,
        updatedAt: templateData.UpdatedAt || templateData.updatedAt,
        templateLines: (templateData.TemplateLines || templateData.templateLines || []).map((line: any) => ({
          id: line.Id ?? line.id,
          language: line.Language ?? line.language ?? "",
          mailSubject: line.MailSubject ?? line.mailSubject ?? "",
          mailBody: line.MailBody ?? line.mailBody ?? "",
        })),
      };

      setOriginalTemplate(template);
      setFormData({
        trackingStatusCode: template.trackingStatusCode,
        templateKey: template.templateKey,
        description: template.description || "",
        isActive: template.isActive,
        templateLines: template.templateLines && template.templateLines.length > 0
          ? template.templateLines
          : [{ ...initialTemplateLine }],
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to fetch template");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatusCodes = async () => {
    try {
      setIsLoadingStatusCodes(true);
      const response = await fetch("/api/dhlmail/statusCodes");
      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch status codes:", data.message);
        return;
      }

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

  const handleAddTemplateLine = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      templateLines: [...formData.templateLines, { ...initialTemplateLine }],
    });
  };

  const handleRemoveTemplateLine = (index: number) => {
    if (!formData || formData.templateLines.length <= 1) return;
    const newLines = formData.templateLines.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      templateLines: newLines,
    });
  };

  const handleTemplateLineChange = (index: number, field: keyof DHLMailTemplateLine, value: string) => {
    if (!formData) return;
    const newLines = [...formData.templateLines];
    newLines[index] = { ...newLines[index], [field]: value };
    setFormData({
      ...formData,
      templateLines: newLines,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !originalTemplate) return;
    setFormError("");

    // Validation
    if (!formData.templateKey.trim()) {
      setFormError("Template Key is required");
      return;
    }
    if (formData.templateKey.length > 100) {
      setFormError("Template Key must be 100 characters or less");
      return;
    }
    if (formData.description.length > 250) {
      setFormError("Description must be 250 characters or less");
      return;
    }

    // Validate template lines
    for (let i = 0; i < formData.templateLines.length; i++) {
      const line = formData.templateLines[i];
      if (!line.language.trim()) {
        setFormError(`Language is required for line ${i + 1}`);
        return;
      }
      if (line.language.length > 10) {
        setFormError(`Language must be 10 characters or less for line ${i + 1}`);
        return;
      }
      if (!line.mailSubject.trim()) {
        setFormError(`Mail Subject is required for line ${i + 1}`);
        return;
      }
      if (isHtmlEmpty(line.mailBody)) {
        setFormError(`Mail Body is required for line ${i + 1}`);
        return;
      }
    }

    // Check for duplicate languages
    const languages = formData.templateLines.map(l => l.language.toLowerCase());
    const uniqueLanguages = new Set(languages);
    if (languages.length !== uniqueLanguages.size) {
      setFormError("Each language can only be used once per template");
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Update template basic info
      const templateResponse = await fetch(`/api/dhlmail/templates/${originalTemplate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateKey: originalTemplate.templateKey,
          trackingStatusCode: originalTemplate.trackingStatusCode,
          description: formData.description || null,
          isActive: formData.isActive,
        }),
      });

      const templateData = await templateResponse.json();

      if (!templateResponse.ok) {
        throw new Error(templateData.message || "Failed to update template");
      }

      // Step 2: Handle template lines
      const existingLines = originalTemplate.templateLines || [];
      const newLines = formData.templateLines;

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
        await fetch(`/api/dhlmail/templates/${originalTemplate.id}/lines/${line.language}`, {
          method: "DELETE",
        });
      }

      // Update existing lines
      for (const line of linesToUpdate) {
        await fetch(`/api/dhlmail/templates/${originalTemplate.id}/lines/${line.language}`, {
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
        await fetch(`/api/dhlmail/templates/${originalTemplate.id}/lines`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: line.language,
            mailSubject: line.mailSubject,
            mailBody: line.mailBody,
          }),
        });
      }

      router.push("/admin/middleware-services/dhl-mail");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to update template");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-20" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!formData || !originalTemplate) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/middleware-services/dhl-mail")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{formError || "Template not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/admin/middleware-services/dhl-mail")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit DHL Mail Template</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Update the DHL mail template configuration
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
          <CardDescription>
            Modify the template settings and content for different languages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="trackingStatusCode">
                  Tracking Status Code <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.trackingStatusCode}
                  onValueChange={(value) => setFormData({ ...formData, trackingStatusCode: value })}
                  disabled={true}
                >
                  <SelectTrigger id="trackingStatusCode">
                    <SelectValue placeholder={isLoadingStatusCodes ? "Loading..." : "Select tracking status code"} />
                  </SelectTrigger>
                  <SelectContent>
                    {statusCodes.map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-amber-600">Tracking Status Code cannot be changed after creation</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="templateKey">
                  Template Key <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="templateKey"
                  value={formData.templateKey}
                  onChange={(e) => setFormData({ ...formData, templateKey: e.target.value })}
                  maxLength={100}
                  placeholder="Enter template key"
                  disabled={true}
                />
                <p className="text-xs text-amber-600">Template key cannot be changed after creation</p>
              </div>
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
                <Label htmlFor="isActive">Active</Label>
                <p className="text-xs text-gray-500">Enable or disable this template</p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                disabled={isSubmitting}
              />
            </div>

            {/* Template Lines Section */}
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold">Template Lines</Label>
                  <p className="text-xs text-gray-500">Add email content for different languages (e.g., DE, EN, FR)</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTemplateLine}
                  disabled={isSubmitting}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Language
                </Button>
              </div>

              {formData.templateLines.map((line, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Language {index + 1}</Label>
                      {formData.templateLines.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTemplateLine(index)}
                          disabled={isSubmitting}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`language-${index}`}>
                        Language Code <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`language-${index}`}
                        value={line.language}
                        onChange={(e) => handleTemplateLineChange(index, "language", e.target.value.toUpperCase())}
                        maxLength={10}
                        placeholder="e.g., DE, EN, FR"
                        disabled={isSubmitting}
                        className="w-32"
                      />
                      <p className="text-xs text-gray-500">{line.language.length}/10</p>
                    </div>

                    <VariableView />

                    <div className="space-y-2">
                      <Label htmlFor={`mailSubject-${index}`}>
                        Mail Subject <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`mailSubject-${index}`}
                        value={line.mailSubject}
                        onChange={(e) => handleTemplateLineChange(index, "mailSubject", e.target.value)}
                        placeholder="Enter email subject"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`mailBody-${index}`}>
                        Mail Body <span className="text-red-500">*</span>
                      </Label>
                      <RichTextEditor
                        id={`mailBody-${index}`}
                        value={line.mailBody}
                        onChange={(value) => handleTemplateLineChange(index, "mailBody", value)}
                        placeholder="Enter email body content"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 border-t pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/middleware-services/dhl-mail")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Template"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
