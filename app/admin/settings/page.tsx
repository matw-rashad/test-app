"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Profile
    name: "Admin User",
    email: "admin@example.com",
    bio: "System administrator",

    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,

    // Security
    twoFactorAuth: false,
    sessionTimeout: "30",

    // Appearance
    darkMode: false,
    compactMode: false,
  });

  const handleSave = (section: string) => {
    console.log(`Saving ${section} settings:`, settings);
    // Add your save logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Update your profile information and personal details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={settings.name}
              onChange={(e) =>
                setSettings({ ...settings, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself"
              value={settings.bio}
              onChange={(e) =>
                setSettings({ ...settings, bio: e.target.value })
              }
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={() => handleSave("profile")}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>
            Configure how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-gray-500">
                Receive notifications via email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, emailNotifications: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-gray-500">
                Receive push notifications on your device
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.pushNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, pushNotifications: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-digest">Weekly Digest</Label>
              <p className="text-sm text-gray-500">
                Receive a weekly summary of activity
              </p>
            </div>
            <Switch
              id="weekly-digest"
              checked={settings.weeklyDigest}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, weeklyDigest: checked })
              }
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={() => handleSave("notifications")}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Manage your security preferences and authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              <p className="text-sm text-gray-500">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              id="two-factor"
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, twoFactorAuth: checked })
              }
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
            <Input
              id="session-timeout"
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) =>
                setSettings({ ...settings, sessionTimeout: e.target.value })
              }
              className="max-w-xs"
            />
            <p className="text-sm text-gray-500">
              Automatically log out after this period of inactivity
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Change Password</Label>
            <div className="space-y-2">
              <Input type="password" placeholder="Current password" />
              <Input type="password" placeholder="New password" />
              <Input type="password" placeholder="Confirm new password" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => handleSave("security")}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance Settings</CardTitle>
          <CardDescription>
            Customize the look and feel of your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-gray-500">
                Switch to dark theme
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={settings.darkMode}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, darkMode: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compact-mode">Compact Mode</Label>
              <p className="text-sm text-gray-500">
                Use a more compact layout to show more content
              </p>
            </div>
            <Switch
              id="compact-mode"
              checked={settings.compactMode}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, compactMode: checked })
              }
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={() => handleSave("appearance")}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-500">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
