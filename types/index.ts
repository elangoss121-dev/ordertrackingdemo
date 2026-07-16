export interface User {
  id: string;
  name: string;
  email: string;
  photo: string | null;
  role: "ADMIN" | "USER";
  emailVerified: boolean;
  createdAt: Date;
}

export interface Order {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  productName: string;
  productImage: string | null;
  description: string;
  courierName: string;
  trackingUrl: string;
  status: OrderStatus;
  estimatedDelivery: Date | null;
  currentLocation: string;
  createdAt: Date;
  updatedAt: Date;
  timeline?: TimelineEntry[];
}

export type OrderStatus =
  | "PROCESSING"
  | "PACKED"
  | "SHIPPED"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface TimelineEntry {
  id: string;
  orderId: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  icon: string;
  completed: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  inTransitOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalUsers: number;
}

export interface MonthlyData {
  month: string;
  orders: number;
  delivered: number;
  cancelled: number;
}

export interface StatusDistribution {
  name: string;
  value: number;
  color: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchParams {
  query?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: OrderStatus;
}
