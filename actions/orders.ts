"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generateUniqueOrderId } from "@/lib/order-id";
import { createOrderSchema, updateOrderSchema } from "@/lib/validations";
import { sanitizeInput, generateCsvContent } from "@/lib/utils";
import type { OrderStatus, PaginatedResponse, Order } from "@/types";

export async function createOrder(formData: {
  customerEmail: string;
  orderNumber: number;
}) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const validated = createOrderSchema.safeParse(formData);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { customerEmail, orderNumber } = validated.data;

    const customer = await prisma.user.findUnique({
      where: { email: customerEmail },
    });

    const customerName = customer?.name || customerEmail.split("@")[0];

    const orderId = await generateUniqueOrderId(orderNumber);

    const order = await prisma.order.create({
      data: {
        orderId,
        customerName: sanitizeInput(customerName),
        customerEmail,
        status: "PROCESSING",
        timeline: {
          create: {
            title: "Order Created",
            description: `Order ${orderId} has been created and is being processed.`,
            date: new Date(),
            time: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            location: "System",
            icon: "package",
            completed: true,
          },
        },
      },
      include: { timeline: true },
    });

    return {
      success: true,
      message: `Order ${orderId} created successfully!`,
      data: order,
    };
  } catch {
    return { success: false, error: "Failed to create order." };
  }
}

export async function updateOrder(
  orderId: string,
  formData: {
    customerName?: string;
    phone?: string;
    productName?: string;
    description?: string;
    courierName?: string;
    trackingUrl?: string;
    status?: OrderStatus;
    estimatedDelivery?: string;
    currentLocation?: string;
  }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const validated = updateOrderSchema.safeParse(formData);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const updateData: Record<string, unknown> = {};
    const data = validated.data;

    if (data.customerName) updateData.customerName = sanitizeInput(data.customerName);
    if (data.phone !== undefined) updateData.phone = sanitizeInput(data.phone);
    if (data.productName !== undefined) updateData.productName = sanitizeInput(data.productName);
    if (data.description !== undefined) updateData.description = sanitizeInput(data.description);
    if (data.courierName !== undefined) updateData.courierName = sanitizeInput(data.courierName);
    if (data.trackingUrl !== undefined) updateData.trackingUrl = data.trackingUrl;
    if (data.status) updateData.status = data.status;
    if (data.estimatedDelivery) updateData.estimatedDelivery = new Date(data.estimatedDelivery);
    if (data.currentLocation !== undefined) updateData.currentLocation = sanitizeInput(data.currentLocation);

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: { timeline: { orderBy: { createdAt: "asc" } } },
    });

    return {
      success: true,
      message: "Order updated successfully!",
      data: order,
    };
  } catch {
    return { success: false, error: "Failed to update order." };
  }
}

export async function deleteOrder(orderId: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.order.delete({
      where: { id: orderId },
    });

    return { success: true, message: "Order deleted successfully!" };
  } catch {
    return { success: false, error: "Failed to delete order." };
  }
}

export async function getOrders(params: {
  query?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: OrderStatus;
}): Promise<PaginatedResponse<Order>> {
  const {
    query = "",
    page = 1,
    pageSize = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    status,
  } = params;

  const where: Record<string, unknown> = {};

  if (query) {
    where.OR = [
      { orderId: { contains: query, mode: "insensitive" } },
      { customerName: { contains: query, mode: "insensitive" } },
      { customerEmail: { contains: query, mode: "insensitive" } },
    ];
  }

  if (status) {
    where.status = status;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { timeline: { orderBy: { createdAt: "asc" } } },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    data: orders as unknown as Order[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getOrderByOrderId(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderId },
      include: { timeline: { orderBy: { createdAt: "asc" } } },
    });

    if (!order) {
      return { success: false, error: "Order not found." };
    }

    return { success: true, data: order };
  } catch {
    return { success: false, error: "Failed to fetch order." };
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { timeline: { orderBy: { createdAt: "asc" } } },
    });

    if (!order) {
      return { success: false, error: "Order not found." };
    }

    return { success: true, data: order };
  } catch {
    return { success: false, error: "Failed to fetch order." };
  }
}

export async function getUserOrders(email: string, params?: {
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResponse<Order>> {
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;

  const where = { customerEmail: email };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { timeline: { orderBy: { createdAt: "asc" } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    data: orders as unknown as Order[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function searchOrders(query: string) {
  try {
    if (!query || query.length < 2) {
      return { success: true, data: [] };
    }

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { orderId: { contains: query, mode: "insensitive" } },
          { customerName: { contains: query, mode: "insensitive" } },
          { customerEmail: { contains: query, mode: "insensitive" } },
        ],
      },
      include: { timeline: { orderBy: { createdAt: "asc" } } },
      take: 20,
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: orders };
  } catch {
    return { success: false, error: "Search failed.", data: [] };
  }
}

export async function exportOrdersCsv() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "Order ID",
      "Customer Name",
      "Customer Email",
      "Phone",
      "Product",
      "Status",
      "Courier",
      "Location",
      "Created",
    ];

    const rows = orders.map((order: any) => [
      order.orderId,
      order.customerName,
      order.customerEmail,
      order.phone,
      order.productName,
      order.status,
      order.courierName,
      order.currentLocation,
      order.createdAt.toISOString(),
    ]);

    const csv = generateCsvContent(headers, rows);

    return { success: true, data: csv };
  } catch {
    return { success: false, error: "Failed to export orders." };
  }
}
