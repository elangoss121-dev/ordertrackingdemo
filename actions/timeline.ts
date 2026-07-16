"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { timelineSchema } from "@/lib/validations";
import { sanitizeInput } from "@/lib/utils";

export async function addTimelineEntry(
  orderId: string,
  formData: {
    title: string;
    description?: string;
    date?: string;
    time?: string;
    location?: string;
    icon?: string;
    completed?: boolean;
  }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const validated = timelineSchema.safeParse(formData);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const data = validated.data;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return { success: false, error: "Order not found." };
    }

    const entry = await prisma.trackingTimeline.create({
      data: {
        orderId,
        title: sanitizeInput(data.title),
        description: data.description ? sanitizeInput(data.description) : "",
        date: data.date ? new Date(data.date) : new Date(),
        time: data.time || new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        location: data.location ? sanitizeInput(data.location) : "",
        icon: data.icon || "package",
        completed: data.completed ?? false,
      },
    });

    return {
      success: true,
      message: "Timeline entry added!",
      data: entry,
    };
  } catch {
    return { success: false, error: "Failed to add timeline entry." };
  }
}

export async function updateTimelineEntry(
  entryId: string,
  formData: {
    title?: string;
    description?: string;
    date?: string;
    time?: string;
    location?: string;
    icon?: string;
    completed?: boolean;
  }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const updateData: Record<string, unknown> = {};

    if (formData.title) updateData.title = sanitizeInput(formData.title);
    if (formData.description !== undefined) updateData.description = sanitizeInput(formData.description);
    if (formData.date) updateData.date = new Date(formData.date);
    if (formData.time) updateData.time = formData.time;
    if (formData.location !== undefined) updateData.location = sanitizeInput(formData.location);
    if (formData.icon) updateData.icon = formData.icon;
    if (formData.completed !== undefined) updateData.completed = formData.completed;

    const entry = await prisma.trackingTimeline.update({
      where: { id: entryId },
      data: updateData,
    });

    return {
      success: true,
      message: "Timeline entry updated!",
      data: entry,
    };
  } catch {
    return { success: false, error: "Failed to update timeline entry." };
  }
}

export async function deleteTimelineEntry(entryId: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.trackingTimeline.delete({
      where: { id: entryId },
    });

    return { success: true, message: "Timeline entry deleted!" };
  } catch {
    return { success: false, error: "Failed to delete timeline entry." };
  }
}
