import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export default function SecurityConfiguration() {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Security Configuration</h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">
          Manage security settings and authentication options
        </p>
      </div>

      {/* Authentication Settings */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Authentication Settings</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Configure authentication and login requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              <p className="text-xs md:text-sm text-gray-500">
                Require 2FA for all users
              </p>
            </div>
            <Switch id="two-factor" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="password-expiry">Password Expiry</Label>
              <p className="text-xs md:text-sm text-gray-500">
                Force password changes every 90 days
              </p>
            </div>
            <Switch id="password-expiry" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
            <Input
              id="session-timeout"
              type="number"
              placeholder="30"
              defaultValue="30"
            />
            <p className="text-xs text-gray-500">
              Users will be logged out after this period of inactivity
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-login-attempts">Maximum Login Attempts</Label>
            <Input
              id="max-login-attempts"
              type="number"
              placeholder="5"
              defaultValue="5"
            />
            <p className="text-xs text-gray-500">
              Lock account after this many failed login attempts
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Password Policy */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Password Policy</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Define password requirements for user accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="min-length">Minimum Password Length</Label>
            <Input
              id="min-length"
              type="number"
              placeholder="8"
              defaultValue="8"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="require-uppercase">Require Uppercase Letters</Label>
              <p className="text-xs md:text-sm text-gray-500">
                Password must contain at least one uppercase letter
              </p>
            </div>
            <Switch id="require-uppercase" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="require-numbers">Require Numbers</Label>
              <p className="text-xs md:text-sm text-gray-500">
                Password must contain at least one number
              </p>
            </div>
            <Switch id="require-numbers" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="require-special">Require Special Characters</Label>
              <p className="text-xs md:text-sm text-gray-500">
                Password must contain at least one special character
              </p>
            </div>
            <Switch id="require-special" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Security Monitoring */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Security Monitoring</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Monitor and track security events
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="login-alerts">Login Alerts</Label>
              <p className="text-xs md:text-sm text-gray-500">
                Alert admins of suspicious login attempts
              </p>
            </div>
            <Switch id="login-alerts" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="audit-logging">Audit Logging</Label>
              <p className="text-xs md:text-sm text-gray-500">
                Log all user actions for security audits
              </p>
            </div>
            <Switch id="audit-logging" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ip-whitelist">IP Whitelisting</Label>
              <p className="text-xs md:text-sm text-gray-500">
                Restrict access to whitelisted IP addresses
              </p>
            </div>
            <Switch id="ip-whitelist" />
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Active Sessions</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            View and manage currently active user sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
          <div className="space-y-3">
            {[
              { user: "Admin User", ip: "192.168.1.100", location: "New York, US", time: "5 min ago", device: "Chrome on Windows" },
              { user: "John Doe", ip: "192.168.1.101", location: "London, UK", time: "15 min ago", device: "Safari on macOS" },
              { user: "Jane Smith", ip: "192.168.1.102", location: "Tokyo, JP", time: "1 hour ago", device: "Firefox on Linux" },
            ].map((session, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-3 last:border-0 last:pb-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">{session.user}</p>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                      Active
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{session.device}</p>
                  <p className="text-xs text-gray-500">{session.ip} • {session.location}</p>
                  <p className="text-xs text-gray-400">{session.time}</p>
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  Revoke
                </Button>
              </div>
            ))}
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
