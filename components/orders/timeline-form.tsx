"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Edit } from "lucide-react";
import { timelineSchema, type TimelineInput } from "@/lib/validations";
import { addTimelineEntry, updateTimelineEntry } from "@/actions/timeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { TimelineEntry } from "@/types";
import { toast } from "sonner";

interface TimelineFormProps {
  orderId: string;
  existingEntry?: TimelineEntry;
  onSuccess?: () => void;
}

export function TimelineForm({ orderId, existingEntry, onSuccess }: TimelineFormProps) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!existingEntry;

  const initialDate = existingEntry?.date
    ? new Date(existingEntry.date).toISOString().substring(0, 10)
    : new Date().toISOString().substring(0, 10);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TimelineInput>({
    resolver: zodResolver(timelineSchema),
    defaultValues: {
      title: existingEntry?.title || "",
      description: existingEntry?.description || "",
      date: initialDate,
      time: existingEntry?.time || new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      location: existingEntry?.location || "",
      icon: existingEntry?.icon || "package",
      completed: existingEntry?.completed ?? true,
    },
  });

  const activeIcon = watch("icon");
  const isCompleted = watch("completed");

  const onSubmit = async (data: TimelineInput) => {
    try {
      setLoading(true);
      if (isEditing && existingEntry) {
        const res = await updateTimelineEntry(existingEntry.id, data);
        if (res.success) {
          toast.success(res.message);
          if (onSuccess) onSuccess();
        } else {
          toast.error(res.error || "Update failed.");
        }
      } else {
        const res = await addTimelineEntry(orderId, data);
        if (res.success) {
          toast.success(res.message);
          reset();
          if (onSuccess) onSuccess();
        } else {
          toast.error(res.error || "Creation failed.");
        }
      }
    } catch {
      toast.error("Failed to submit timeline entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-panel border-border/40 shadow-lg rounded-3xl">
      <CardHeader>
        <CardTitle className="text-lg font-bold tracking-tight">
          {isEditing ? "Edit Tracking Log" : "Log New Update"}
        </CardTitle>
        <CardDescription className="text-xs">
          Append transit details, customs checkins, or dispatch checkpoints.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Update Title
              </label>
              <Input placeholder="e.g. Package Reached Hub" {...register("title")} />
              {errors.title && (
                <p className="text-xs text-destructive mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Location
              </label>
              <Input placeholder="e.g. San Francisco, CA" {...register("location")} />
              {errors.location && (
                <p className="text-xs text-destructive mt-1">{errors.location.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Date
              </label>
              <Input type="date" {...register("date")} />
              {errors.date && (
                <p className="text-xs text-destructive mt-1">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Time
              </label>
              <Input placeholder="e.g. 10:30 AM" {...register("time")} />
              {errors.time && (
                <p className="text-xs text-destructive mt-1">{errors.time.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                Visual Icon
              </label>
              <Select
                value={activeIcon}
                onValueChange={(val) => setValue("icon", val)}
              >
                <SelectTrigger className="w-full rounded-xl bg-card">
                  <SelectValue placeholder="Select Icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="package">Package Box</SelectItem>
                  <SelectItem value="check">Checkmark Circle</SelectItem>
                  <SelectItem value="truck">Delivery Truck</SelectItem>
                  <SelectItem value="location">Map Pin</SelectItem>
                  <SelectItem value="alert">Alert / Problem</SelectItem>
                  <SelectItem value="clock">Clock / Waiting</SelectItem>
                  <SelectItem value="compass">Compass / Dispatch</SelectItem>
                  <SelectItem value="inbox">Inbox Received</SelectItem>
                  <SelectItem value="send">Departed / Send</SelectItem>
                  <SelectItem value="flag">Flag / Destination</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="completed"
                checked={isCompleted}
                onCheckedChange={(checked) => setValue("completed", !!checked)}
              />
              <label
                htmlFor="completed"
                className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Mark Stage Completed
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Brief Description
            </label>
            <Input placeholder="Describe the status details..." {...register("description")} />
            {errors.description && (
              <p className="text-xs text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full h-11 rounded-xl shadow-sm mt-2" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Log...
              </>
            ) : (
              <>
                {isEditing ? <Edit className="mr-1.5 h-4.5 w-4.5" /> : <Plus className="mr-1.5 h-4.5 w-4.5" />}
                {isEditing ? "Save Tracking Log" : "Append Tracking Log"}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
