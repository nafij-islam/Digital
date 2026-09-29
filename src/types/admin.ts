import { Order } from "./order";

export interface AdminDashboardMetrics {
  todayOrders: number;
  pendingVerificationCount: number;
  todayRevenue: number;
  monthlyRevenue: number;
  completedOrdersCount: number;
  activeCustomersCount: number;
  revenueGrowthRate: number;
  orderGrowthRate: number;
  revenueChartData: {
    date: string;
    revenue: number;
    orders: number;
  }[];
  categorySalesData: {
    name: string;
    sales: number;
    value: number;
  }[];
  recentOrders: Order[];
  pendingOrders: Order[];
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: "ORDER" | "PRODUCT" | "PLAN" | "PAYMENT" | "USER" | "SETTING";
  targetId: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}
