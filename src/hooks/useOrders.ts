import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import { paymentService } from "@/services/paymentService";
import { CreateOrderPayload, OrderStatus } from "@/types/order";

export function useOrders(status?: OrderStatus) {
  return useQuery({
    queryKey: ["orders", status],
    queryFn: () => orderService.getOrders(status),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
    refetchInterval: 10000, // Poll every 10s for verification updates
  });
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => paymentService.getPaymentMethods(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => orderService.createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
