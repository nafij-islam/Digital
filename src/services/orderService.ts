import { CreateOrderPayload, Order, OrderStatus, OrderAccessDetails } from "@/types/order";
import { INITIAL_ORDERS, INITIAL_PAYMENT_METHODS } from "./mockData";
import { getLocalProducts } from "./productService";

export const ORDERS_STORAGE_KEY = "dg_local_orders";

export function getLocalOrders(): Order[] {
  if (typeof window === "undefined") return INITIAL_ORDERS;
  try {
    const data = localStorage.getItem(ORDERS_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_ORDERS;
  } catch {
    return INITIAL_ORDERS;
  }
}

export function saveLocalOrders(orders: Order[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error("Failed to save local orders", e);
  }
}

export function normalizeBackendOrder(o: any): Order {
  const items = (o.items || []).map((it: any) => ({
    id: it._id?.toString() || it.id || `item-${Math.random()}`,
    productId: it.productId?.toString() || "",
    productName: it.productNameSnapshot || it.productName || "Digital Product",
    productSlug: it.productSlug || "product",
    productImage: it.productImageSnapshot || it.productImage || "",
    planId: it.productPlanId?.toString() || it.planId || "",
    planName: it.planNameSnapshot || it.planName || "Standard Plan",
    durationValue: 1,
    durationUnit: it.durationSnapshot || "months",
    price:
      typeof it.unitPrice === "number" && it.unitPrice > 1000
        ? Math.round(it.unitPrice / 100)
        : it.unitPrice || it.price || 0,
    quantity: it.quantity || 1,
  }));

  const totalAmount =
    typeof o.total === "number" && o.total > 1000
      ? Math.round(o.total / 100)
      : o.total || o.totalAmount || 0;
  const subtotal =
    typeof o.subtotal === "number" && o.subtotal > 1000
      ? Math.round(o.subtotal / 100)
      : o.subtotal || totalAmount;
  const discountAmount =
    typeof o.discount === "number" && o.discount > 1000
      ? Math.round(o.discount / 100)
      : o.discount || o.discountAmount || 0;

  const now = o.createdAt || new Date().toISOString();

  return {
    id: o._id?.toString() || o.id,
    orderNumber: o.orderNumber || `DV-${Math.floor(10000 + Math.random() * 90000)}`,
    customerId: o.userId?.toString() || o.customerId || "",
    customerName: o.customerSnapshot?.name || o.customerName || "Customer",
    customerEmail: o.customerSnapshot?.email || o.customerEmail || "",
    customerPhone: o.customerSnapshot?.phone || o.customerPhone || "",
    items,
    subtotal,
    discountAmount,
    couponCode: o.couponCode,
    totalAmount,
    currency: "৳",
    paymentMethodId: o.paymentSubmission?.paymentMethodId?.toString() || o.paymentMethodId,
    senderNumber: o.paymentSubmission?.senderPhone || o.senderNumber,
    transactionId: o.paymentSubmission?.transactionId || o.transactionId,
    paymentNote: o.paymentSubmission?.note || o.paymentNote,
    paymentSubmittedAt: o.paymentSubmission?.submittedAt || o.paymentSubmittedAt,
    paymentVerifiedAt: o.paymentApprovedAt || o.paymentVerifiedAt,
    status: o.status || "PENDING_PAYMENT",
    timeline: o.timeline || [
      {
        id: "tl-1",
        status: "PENDING_PAYMENT",
        title: "Order Placed",
        description: "Order submitted through checkout.",
        timestamp: now,
        completed: true,
      },
      {
        id: "tl-2",
        status: "PENDING_PAYMENT_VERIFICATION",
        title: "Payment Submitted",
        description: "Transaction submitted for manual verification.",
        timestamp: now,
        completed: o.status !== "PENDING_PAYMENT",
      },
      {
        id: "tl-3",
        status: "PAYMENT_APPROVED",
        title: "Payment Approved",
        description: "Payment verified by administrator.",
        timestamp: o.paymentApprovedAt || "",
        completed: ["PAYMENT_APPROVED", "PROCESSING", "FULFILLED"].includes(o.status),
      },
      {
        id: "tl-4",
        status: "PROCESSING",
        title: "Order Processing",
        description: "Preparing digital product credentials.",
        timestamp: o.processingAt || "",
        completed: ["PROCESSING", "FULFILLED"].includes(o.status),
      },
      {
        id: "tl-5",
        status: "FULFILLED",
        title: "Delivered",
        description: "Credentials ready in delivery vault.",
        timestamp: o.fulfilledAt || "",
        completed: o.status === "FULFILLED",
      },
    ],
    createdAt: now,
    updatedAt: o.updatedAt || now,
  };
}

export const orderService = {
  getOrders: async (status?: OrderStatus): Promise<Order[]> => {
    const orders = getLocalOrders();
    if (status) {
      return orders.filter((o) => o.status === status);
    }
    return orders;
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    const orders = getLocalOrders();
    const found = orders.find((o) => o.id === id || o.orderNumber === id);
    return found || null;
  },

  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const orders = getLocalOrders();
    const allProducts = getLocalProducts();
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `DV-${randomDigits}`;
    const newId = `ord-${Date.now()}`;

    const orderItems = payload.items.map((item) => {
      const product = allProducts.find((p) => p.id === item.productId);
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

    let paymentMethods = INITIAL_PAYMENT_METHODS;
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("dg_local_pm");
        if (stored) paymentMethods = JSON.parse(stored);
      } catch {
        // use default
      }
    }

    const paymentMethod =
      paymentMethods.find((p) => p.id === payload.paymentMethodId) ||
      paymentMethods[0] ||
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
          description: `${paymentMethod.displayName} TrxID ${payload.transactionId} submitted for verification.`,
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
          description: "Credentials will be displayed in secure delivery vault.",
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
  },

  getOrderAccess: async (orderId: string): Promise<OrderAccessDetails | null> => {
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
  },
};
