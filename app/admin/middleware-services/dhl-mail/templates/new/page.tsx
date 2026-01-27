"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

const initialFormData: DHLMailTemplateFormData = {
  templateKey: "",
  trackingStatusCode: "",
  description: "",
  isActive: true,
  templateLines: [{ ...initialTemplateLine }],
};

const stripHtml = (html: string): string => {
  if (!html) {
    return "";
  }

  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

const isHtmlEmpty = (html: string): boolean => !stripHtml(html).trim();

export default function NewTemplatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<DHLMailTemplateFormData>(initialFormData);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusCodes, setStatusCodes] = useState<string[]>([]);
  const [isLoadingStatusCodes, setIsLoadingStatusCodes] = useState(true);

  useEffect(() => {
    fetchStatusCodes();
  }, []);

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
    setFormData({
      ...formData,
      templateLines: [...formData.templateLines, { ...initialTemplateLine }],
    });
  };

  const handleRemoveTemplateLine = (index: number) => {
    if (formData.templateLines.length > 1) {
      const newLines = formData.templateLines.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        templateLines: newLines,
      });
    }
  };

  const handleTemplateLineChange = (index: number, field: keyof DHLMailTemplateLine, value: string) => {
    const newLines = [...formData.templateLines];
    newLines[index] = { ...newLines[index], [field]: value };
    setFormData({
      ...formData,
      templateLines: newLines,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validation
    if (!formData.trackingStatusCode.trim()) {
      setFormError("Tracking Status Code is required");
      return;
    }
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
      const response = await fetch("/api/dhlmail/templates/with-lines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackingStatusCode: formData.trackingStatusCode,
          templateKey: formData.templateKey,
          description: formData.description || null,
          isActive: formData.isActive,
          templateLines: formData.templateLines.map(line => ({
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

      router.push("/admin/middleware-services/dhl-mail");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create template");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create DHL Mail Template</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Add a new DHL mail template with language-specific content
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
          <CardDescription>
            Configure the template settings and add content for different languages
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
                  disabled={isSubmitting || isLoadingStatusCodes}
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
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500">{formData.templateKey.length}/100</p>
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
                <Card key={index} className="overflow-hidden">
                    <CardHeader >
                    <CardTitle><div className="bg-gray-200 flex items-center justify-between px-4 py-3 rounded-md">
                      <Label className="text-sm font-semibold">Language {index + 1}</Label>
                      {formData.templateLines.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTemplateLine(index)}
                          disabled={isSubmitting}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 -my-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    </CardTitle>
                  </CardHeader>
                    <div className="p-4 space-y-4">
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
                    Creating...
                  </>
                ) : (
                  "Create Template"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
