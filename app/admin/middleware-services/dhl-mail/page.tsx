import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export default function DHLMailConfiguration() {
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
        {/* API Configuration */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base md:text-lg">API Configuration</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  DHL API credentials and endpoint settings
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200 text-xs">
                Not Connected
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dhl-enabled">Enable DHL Integration</Label>
                <p className="text-xs text-gray-500">
                  Activate DHL mail service for shipping operations
                </p>
              </div>
              <Switch id="dhl-enabled" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dhl-api-key">API Key</Label>
                <Input
                  id="dhl-api-key"
                  placeholder="Enter your DHL API key"
                  type="password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dhl-api-secret">API Secret</Label>
                <Input
                  id="dhl-api-secret"
                  placeholder="Enter your DHL API secret"
                  type="password"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dhl-endpoint">API Endpoint</Label>
              <Input
                id="dhl-endpoint"
                placeholder="https://api.dhl.com/..."
                defaultValue="https://api.dhl.com/parcel/de/shipping/v2"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dhl-sandbox">Sandbox Mode</Label>
                <p className="text-xs text-gray-500">
                  Use test environment for development
                </p>
              </div>
              <Switch id="dhl-sandbox" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div>
              <CardTitle className="text-base md:text-lg">Account Settings</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                DHL business account information
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dhl-account-number">Account Number</Label>
                <Input
                  id="dhl-account-number"
                  placeholder="Enter DHL account number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dhl-customer-id">Customer ID</Label>
                <Input
                  id="dhl-customer-id"
                  placeholder="Enter customer ID"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dhl-billing-number">Billing Number</Label>
                <Input
                  id="dhl-billing-number"
                  placeholder="Enter billing number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dhl-participation">Participation Number</Label>
                <Input
                  id="dhl-participation"
                  placeholder="Enter participation number"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Defaults */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div>
              <CardTitle className="text-base md:text-lg">Shipping Defaults</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Default shipping preferences and sender information
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dhl-sender-name">Sender Name</Label>
                <Input
                  id="dhl-sender-name"
                  placeholder="Company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dhl-sender-email">Sender Email</Label>
                <Input
                  id="dhl-sender-email"
                  type="email"
                  placeholder="shipping@company.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dhl-sender-address">Sender Address</Label>
              <Input
                id="dhl-sender-address"
                placeholder="Street address"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="dhl-sender-city">City</Label>
                <Input
                  id="dhl-sender-city"
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dhl-sender-postal">Postal Code</Label>
                <Input
                  id="dhl-sender-postal"
                  placeholder="Postal code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dhl-sender-country">Country</Label>
                <Input
                  id="dhl-sender-country"
                  placeholder="Country code"
                  defaultValue="DE"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dhl-sender-phone">Phone Number</Label>
              <Input
                id="dhl-sender-phone"
                placeholder="+49 123 456789"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div>
              <CardTitle className="text-base md:text-lg">Notification Settings</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Configure email and tracking notifications
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dhl-tracking-emails">Send Tracking Emails</Label>
                <p className="text-xs text-gray-500">
                  Automatically send tracking information to customers
                </p>
              </div>
              <Switch id="dhl-tracking-emails" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dhl-delivery-notification">Delivery Notifications</Label>
                <p className="text-xs text-gray-500">
                  Notify customers when package is delivered
                </p>
              </div>
              <Switch id="dhl-delivery-notification" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dhl-status-webhook">Status Webhooks</Label>
                <p className="text-xs text-gray-500">
                  Receive real-time status updates via webhook
                </p>
              </div>
              <Switch id="dhl-status-webhook" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dhl-webhook-url">Webhook URL</Label>
              <Input
                id="dhl-webhook-url"
                placeholder="https://yoursite.com/api/dhl-webhook"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex-1">
            Test Connection
          </Button>
          <Button className="flex-1">
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
