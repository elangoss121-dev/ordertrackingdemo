"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useTheme } from "next-themes";
import { Bell, ShieldCheck, Mail, Smartphone, Lock } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { changePasswordAction } from "@/actions/auth";

export default function UserSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast.error("Password change failed.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Password change failed.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password change failed.");
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await changePasswordAction({ oldPassword, newPassword, confirmNewPassword });
      if (res.success) {
        toast.success("Password changed successfully");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        toast.error("Password change failed.");
      }
    } catch {
      toast.error("Password change failed.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleToggle = (type: string, val: boolean) => {
    if (type === "email") {
      setEmailAlerts(val);
      toast.success(`Email alerts ${val ? "enabled" : "disabled"}!`);
    } else {
      setSmsAlerts(val);
      toast.success(`SMS alerts ${val ? "enabled" : "disabled"}!`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground text-sm font-semibold">
          Configure notification preferences and display styles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <Card className="glass-panel border-border/40 shadow-lg rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold tracking-tight">Appearance</CardTitle>
            <CardDescription className="text-xs">
              Toggle color theme modes between light and dark backgrounds.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between p-6">
            <span className="font-semibold text-sm">Color Mode</span>
            <ThemeToggle />
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="glass-panel border-border/40 shadow-lg rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold tracking-tight">Notifications</CardTitle>
            <CardDescription className="text-xs">
              Specify delivery channels for tracking updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-semibold text-sm block">Email Alerts</span>
                  <span className="text-xs text-muted-foreground">Receive logs on dispatch.</span>
                </div>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={(val) => handleToggle("email", val)} />
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-semibold text-sm block">SMS Notifications</span>
                  <span className="text-xs text-muted-foreground">Receive real-time driver texts.</span>
                </div>
              </div>
              <Switch checked={smsAlerts} onCheckedChange={(val) => handleToggle("sms", val)} />
            </div>
          </CardContent>
        </Card>

        {/* Change Password Settings */}
        <Card className="glass-panel border-border/40 shadow-lg rounded-3xl md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold tracking-tight flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Change Password
            </CardTitle>
            <CardDescription className="text-xs">
              Update your account password to maintain credentials safety.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Old Password
                </label>
                <Input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-xl h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  New Password
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-xl h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-xl h-10"
                />
              </div>

              <Button
                type="submit"
                disabled={passwordLoading}
                className="h-10 px-5 rounded-xl shadow-sm mt-2"
              >
                {passwordLoading ? "Updating..." : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
