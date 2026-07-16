import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .trim(),
    email: z.string().email("Please enter a valid email address").trim().toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address").trim().toLowerCase(),
});

export const createOrderSchema = z.object({
  customerEmail: z
    .string()
    .email("Please enter a valid customer email")
    .trim()
    .toLowerCase(),
  orderNumber: z
    .number({ message: "Order number must be a number" })
    .int("Order number must be a whole number")
    .min(1, "Order number must be at least 1")
    .max(99, "Order number must be less than 100"),
});

export const updateOrderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required").optional(),
  phone: z.string().optional(),
  productName: z.string().optional(),
  description: z.string().optional(),
  courierName: z.string().optional(),
  trackingUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  status: z
    .enum([
      "PROCESSING",
      "PACKED",
      "SHIPPED",
      "IN_TRANSIT",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ])
    .optional(),
  estimatedDelivery: z.string().optional(),
  currentLocation: z.string().optional(),
});

export const timelineSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  location: z.string().max(200).optional(),
  icon: z.string().optional(),
  completed: z.boolean().optional(),
});

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .trim(),
  phone: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type TimelineInput = z.infer<typeof timelineSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
