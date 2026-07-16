"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { profileSchema, type ProfileInput } from "@/lib/validations";
import { updateProfile } from "@/actions/users";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export default function UserProfilePage() {
  const { user, refreshUser } = useCurrentUser();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  const onSubmit = async (data: ProfileInput) => {
    try {
      setLoading(true);
      const res = await updateProfile(data);
      if (res.success) {
        toast.success(res.message);
        await refreshUser();
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Profile Details</h1>
        <p className="text-muted-foreground text-sm font-semibold">
          Manage your personal details and account configurations.
        </p>
      </div>

      <Card className="glass-panel border-border/40 max-w-xl shadow-lg rounded-3xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold tracking-tight">Personal Information</CardTitle>
          <CardDescription className="text-xs">
            Updating your public name here alters communications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address (Read-only)
              </label>
              <Input type="email" value={user?.email || ""} disabled className="bg-secondary" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Full Name
              </label>
              <Input {...register("name")} placeholder="Your name" />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full h-11 rounded-xl shadow-sm mt-2" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                <>
                  <Save className="mr-1.5 h-4.5 w-4.5" />
                  Update Profile
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
