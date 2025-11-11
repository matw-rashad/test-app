import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function GeneralConfiguration() {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">General Configuration</h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">
          Manage general application settings and preferences
        </p>
      </div>

      {/* Application Settings */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Application Settings</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Configure basic application information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="app-name">Application Name</Label>
            <Input
              id="app-name"
              placeholder="Enter application name"
              defaultValue="Admin Panel"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="app-description">Description</Label>
            <Textarea
              id="app-description"
              placeholder="Enter application description"
              defaultValue="Manage your application settings and users"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="app-url">Application URL</Label>
            <Input
              id="app-url"
              type="url"
              placeholder="https://example.com"
              defaultValue="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="support-email">Support Email</Label>
            <Input
              id="support-email"
              type="email"
              placeholder="support@example.com"
              defaultValue="support@example.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Regional Settings */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Regional Settings</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Configure timezone and language preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input
              id="timezone"
              placeholder="UTC"
              defaultValue="America/New_York"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Input
              id="language"
              placeholder="English"
              defaultValue="English (US)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-format">Date Format</Label>
            <Input
              id="date-format"
              placeholder="MM/DD/YYYY"
              defaultValue="MM/DD/YYYY"
            />
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Feature Toggles</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Enable or disable application features
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
              <p className="text-xs md:text-sm text-gray-500">
                Put the application in maintenance mode
              </p>
            </div>
            <Switch id="maintenance-mode" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="user-registration">User Registration</Label>
              <p className="text-xs md:text-sm text-gray-500">
                Allow new users to register
              </p>
            </div>
            <Switch id="user-registration" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-xs md:text-sm text-gray-500">
                Send email notifications to users
              </p>
            </div>
            <Switch id="email-notifications" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="analytics">Analytics Tracking</Label>
              <p className="text-xs md:text-sm text-gray-500">
                Enable analytics and tracking
              </p>
            </div>
            <Switch id="analytics" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button variant="outline" className="w-full sm:w-auto">
          Reset to Defaults
        </Button>
        <Button className="w-full sm:w-auto">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
