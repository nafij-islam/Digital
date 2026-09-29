import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";
import { OrderStatus, FulfillOrderPayload } from "@/types/order";
import { Product } from "@/types/product";
import { PaymentMethod } from "@/types/payment";
import { Coupon } from "@/types/settings";

export function useAdminMetrics() {
  return useQuery({
    queryKey: ["admin-metrics"],
    queryFn: () => adminService.getDashboardMetrics(),
    refetchInterval: 15000,
  });
}

export function useAdminOrders(status?: OrderStatus, search?: string) {
  return useQuery({
    queryKey: ["admin-orders", status, search],
    queryFn: () => adminService.getOrders(status, search),
  });
}

export function useAdminOrder(id: string) {
  return useQuery({
    queryKey: ["admin-order", id],
    queryFn: () => adminService.getOrderById(id),
    enabled: !!id,
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin-products"],
    queryFn: () => adminService.getProducts(),
  });
}

export function useAdminPaymentMethods() {
  return useQuery({
    queryKey: ["admin-payment-methods"],
    queryFn: () => adminService.getPaymentMethods(),
  });
}

export function useAdminCoupons() {
  return useQuery({
    queryKey: ["admin-coupons"],
    queryFn: () => adminService.getCoupons(),
  });
}

export function useAdminCustomers() {
  return useQuery({
    queryKey: ["admin-customers"],
    queryFn: () => adminService.getCustomers(),
  });
}

export function useAdminAuditLogs() {
  return useQuery({
    queryKey: ["admin-audit-logs"],
    queryFn: () => adminService.getAuditLogs(),
  });
}

export function useAdminOrderMutations() {
  const queryClient = useQueryClient();

  const approvePayment = useMutation({
    mutationFn: (orderId: string) => adminService.approvePayment(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order"] });
    },
  });

  const rejectPayment = useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      adminService.rejectPayment(orderId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order"] });
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      adminService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order"] });
    },
  });

  const fulfillOrder = useMutation({
    mutationFn: (payload: FulfillOrderPayload) => adminService.fulfillOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order"] });
    },
  });

  return {
    approvePayment,
    rejectPayment,
    updateStatus,
    fulfillOrder,
  };
}
