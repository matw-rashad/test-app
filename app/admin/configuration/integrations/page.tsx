import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export default function IntegrationsConfiguration() {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Integrations</h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">
          Connect and configure third-party services
        </p>
      </div>

      {/* Available Integrations */}
      <div className="grid gap-3 md:gap-4 md:grid-cols-2">
        {/* Email Service */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base md:text-lg">Email Service</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  SMTP configuration for sending emails
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                Connected
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-3">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input
                id="smtp-host"
                placeholder="smtp.example.com"
                defaultValue="smtp.gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input
                id="smtp-port"
                placeholder="587"
                defaultValue="587"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-user">Username</Label>
              <Input
                id="smtp-user"
                placeholder="user@example.com"
                defaultValue="notifications@example.com"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                Test Connection
              </Button>
              <Button size="sm" className="flex-1">
                Update
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Gateway */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base md:text-lg">Payment Gateway</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Stripe integration for payments
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                Connected
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="stripe-enabled">Enable Stripe</Label>
                <p className="text-xs text-gray-500">
                  Accept payments via Stripe
                </p>
              </div>
              <Switch id="stripe-enabled" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripe-key">Publishable Key</Label>
              <Input
                id="stripe-key"
                placeholder="pk_test_..."
                defaultValue="pk_test_51H..."
                type="password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripe-secret">Secret Key</Label>
              <Input
                id="stripe-secret"
                placeholder="sk_test_..."
                type="password"
                defaultValue="••••••••••••••"
              />
            </div>
            <Button size="sm" className="w-full">
              Update Credentials
            </Button>
          </CardContent>
        </Card>

        {/* Cloud Storage */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base md:text-lg">Cloud Storage</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Amazon S3 for file storage
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                Connected
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-3">
            <div className="space-y-2">
              <Label htmlFor="s3-bucket">Bucket Name</Label>
              <Input
                id="s3-bucket"
                placeholder="my-bucket"
                defaultValue="app-storage-prod"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s3-region">Region</Label>
              <Input
                id="s3-region"
                placeholder="us-east-1"
                defaultValue="us-east-1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s3-access-key">Access Key ID</Label>
              <Input
                id="s3-access-key"
                placeholder="AKIA..."
                type="password"
                defaultValue="••••••••••••••"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                Test Connection
              </Button>
              <Button size="sm" className="flex-1">
                Update
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base md:text-lg">Analytics</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Google Analytics integration
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                Pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ga-enabled">Enable Google Analytics</Label>
                <p className="text-xs text-gray-500">
                  Track user behavior and analytics
                </p>
              </div>
              <Switch id="ga-enabled" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ga-id">Tracking ID</Label>
              <Input
                id="ga-id"
                placeholder="G-XXXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ga-measurement">Measurement ID</Label>
              <Input
                id="ga-measurement"
                placeholder="UA-XXXXXXXXX-X"
              />
            </div>
            <Button size="sm" className="w-full">
              Connect Analytics
            </Button>
          </CardContent>
        </Card>

        {/* Slack Notifications */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base md:text-lg">Slack</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Send notifications to Slack
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200 text-xs">
                Not Connected
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="slack-enabled">Enable Slack</Label>
                <p className="text-xs text-gray-500">
                  Send alerts to Slack channels
                </p>
              </div>
              <Switch id="slack-enabled" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slack-webhook">Webhook URL</Label>
              <Input
                id="slack-webhook"
                placeholder="https://hooks.slack.com/services/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slack-channel">Default Channel</Label>
              <Input
                id="slack-channel"
                placeholder="#general"
              />
            </div>
            <Button size="sm" className="w-full">
              Connect Slack
            </Button>
          </CardContent>
        </Card>

        {/* SMS Service */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base md:text-lg">SMS Service</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Twilio for SMS notifications
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200 text-xs">
                Not Connected
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-3">
            <div className="space-y-2">
              <Label htmlFor="twilio-sid">Account SID</Label>
              <Input
                id="twilio-sid"
                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twilio-token">Auth Token</Label>
              <Input
                id="twilio-token"
                placeholder="Your auth token"
                type="password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twilio-phone">Phone Number</Label>
              <Input
                id="twilio-phone"
                placeholder="+1234567890"
              />
            </div>
            <Button size="sm" className="w-full">
              Connect Twilio
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
