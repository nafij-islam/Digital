import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { CreateOrderPayload, Order, OrderStatus, OrderAccessDetails } from "@/types/order";
import { INITIAL_ORDERS, INITIAL_PAYMENT_METHODS, INITIAL_PRODUCTS } from "./mockData";

const ORDERS_STORAGE_KEY = "dg_local_orders";

function getLocalOrders(): Order[] {
  if (typeof window === "undefined") return INITIAL_ORDERS;
  try {
    const data = localStorage.getItem(ORDERS_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_ORDERS;
  } catch {
    return INITIAL_ORDERS;
  }
}

function saveLocalOrders(orders: Order[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error("Failed to save local orders", e);
  }
}

export const orderService = {
  getOrders: async (status?: OrderStatus): Promise<Order[]> => {
    try {
      const { data } = await apiClient.get<Order[]>(API_ENDPOINTS.ORDERS.LIST, {
        params: { status },
      });
      return data;
    } catch {
      const orders = getLocalOrders();
      if (status) {
        return orders.filter((o) => o.status === status);
      }
      return orders;
    }
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    try {
      const { data } = await apiClient.get<Order>(API_ENDPOINTS.ORDERS.DETAILS(id));
      return data;
    } catch {
      const orders = getLocalOrders();
      const found = orders.find((o) => o.id === id || o.orderNumber === id);
      return found || null;
    }
  },

  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    try {
      const { data } = await apiClient.post<Order>(API_ENDPOINTS.ORDERS.CREATE, payload);
      return data;
    } catch {
      const orders = getLocalOrders();
      const randomDigits = Math.floor(10000 + Math.random() * 90000);
      const orderNumber = `DV-${randomDigits}`;
      const newId = `ord-${Date.now()}`;

      // Assemble item information
      const orderItems = payload.items.map((item) => {
        const product = INITIAL_PRODUCTS.find((p) => p.id === item.productId);
        const plan = product?.plans.find((pl) => pl.id === item.planId);
        return {
          id: `item-${Date.now()}-${Math.random()}`,
          productId: item.productId,
          productName: product?.name || "Digital Product",
          productSlug: product?.slug || "digital-product",
          productImage: product?.imageUrl || "",
          planId: item.planId,
          planName: plan?.name || "Standard Plan",
          durationValue: plan?.durationValue || 1,
          durationUnit: plan?.durationUnit || "months",
          price: plan?.salePrice || 0,
          quantity: item.quantity,
        };
      });

      const subtotal = orderItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
      const discountAmount = payload.couponCode ? 50 : 0;
      const totalAmount = Math.max(0, subtotal - discountAmount);

      const paymentMethod =
        INITIAL_PAYMENT_METHODS.find((p) => p.id === payload.paymentMethodId) ||
        INITIAL_PAYMENT_METHODS[0];

      const now = new Date().toISOString();

      const newOrder: Order = {
        id: newId,
        orderNumber,
        customerId: "usr-demo-1",
        customerName: payload.customerName,
        customerEmail: payload.customerEmail,
        customerPhone: payload.customerPhone,
        items: orderItems,
        subtotal,
        discountAmount,
        couponCode: payload.couponCode,
        totalAmount,
        currency: "৳",
        paymentMethodId: payload.paymentMethodId,
        paymentMethod,
        senderNumber: payload.senderNumber,
        transactionId: payload.transactionId,
        paymentNote: payload.paymentNote,
        paymentSubmittedAt: now,
        status: "PENDING_PAYMENT_VERIFICATION",
        timeline: [
          {
            id: `tl-${Date.now()}-1`,
            status: "PENDING_PAYMENT",
            title: "Order Placed",
            description: "Order submitted through checkout.",
            timestamp: now,
            completed: true,
          },
          {
            id: `tl-${Date.now()}-2`,
            status: "PENDING_PAYMENT_VERIFICATION",
            title: "Payment Submitted",
            description: `${paymentMethod.displayName} TrxID ${payload.transactionId} submitted for manual verification.`,
            timestamp: now,
            completed: true,
          },
          {
            id: `tl-${Date.now()}-3`,
            status: "PAYMENT_APPROVED",
            title: "Payment Approval",
            description: "Awaiting administrator verification.",
            timestamp: "",
            completed: false,
          },
          {
            id: `tl-${Date.now()}-4`,
            status: "PROCESSING",
            title: "Order Fulfillment",
            description: "Preparing digital product credentials.",
            timestamp: "",
            completed: false,
          },
          {
            id: `tl-${Date.now()}-5`,
            status: "FULFILLED",
            title: "Delivered",
            description: "Credentials will be displayed in this secure delivery vault.",
            timestamp: "",
            completed: false,
          },
        ],
        createdAt: now,
        updatedAt: now,
      };

      const updated = [newOrder, ...orders];
      saveLocalOrders(updated);
      return newOrder;
    }
  },

  getOrderAccess: async (orderId: string): Promise<OrderAccessDetails | null> => {
    try {
      const { data } = await apiClient.get<OrderAccessDetails>(
        API_ENDPOINTS.ORDERS.ACCESS(orderId)
      );
      return data;
    } catch {
      const orders = getLocalOrders();
      const order = orders.find((o) => o.id === orderId);
      if (!order || order.status !== "FULFILLED" || !order.deliveryData) {
        return null;
      }
      return {
        orderId,
        type: order.deliveryType || "ACCOUNT_CREDENTIAL",
        loginEmail: order.deliveryData.emailOrUsername,
        loginPassword: order.deliveryData.password,
        loginUrl: order.deliveryData.loginUrl,
        licenseKey: order.deliveryData.licenseKey,
        activationLink: order.deliveryData.activationLink,
        downloadUrl: order.deliveryData.downloadUrl,
        publicInstructions: order.deliveryData.instructions,
        additionalInstructions: order.deliveryData.notes,
      };
    }
  },
};
