"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useTheme } from "next-themes";
import { Bell, ShieldCheck, Mail, Smartphone } from "lucide-react";
import { toast } from "sonner";

export default function UserSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

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
      </div>
    </div>
  );
}
