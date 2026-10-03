import { AdminDashboardMetrics, AuditLog } from "@/types/admin";
import { Order, OrderStatus, FulfillOrderPayload, OrderAccessDetails } from "@/types/order";
import { Product, Category } from "@/types/product";
import { PaymentMethod } from "@/types/payment";
import { Coupon } from "@/types/settings";
import { User } from "@/types/auth";
import {
  INITIAL_ORDERS,
  INITIAL_PAYMENT_METHODS,
  INITIAL_COUPONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_USERS,
} from "./mockData";
import { getLocalOrders, saveLocalOrders } from "./orderService";
import { getLocalProducts, saveLocalProducts } from "./productService";
import { getLocalCategories, saveLocalCategories } from "./categoryService";

const ADMIN_PAYMENT_METHODS_KEY = "dg_local_pm";
const ADMIN_COUPONS_KEY = "dg_local_coupons";
const ADMIN_LOGS_KEY = "dg_local_audit_logs";
const REGISTERED_USERS_KEY = "dg_registered_users";

function getStoreItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setStoreItem<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Storage write error", e);
  }
}

function logAdminAction(action: string, targetType: any, targetId: string, details: string) {
  const logs = getStoreItem<AuditLog[]>(ADMIN_LOGS_KEY, INITIAL_AUDIT_LOGS);
  const newLog: AuditLog = {
    id: `log-${Date.now()}`,
    adminId: "usr-admin-1",
    adminName: "Admin Superuser",
    action,
    targetType,
    targetId,
    details,
    createdAt: new Date().toISOString(),
  };
  setStoreItem(ADMIN_LOGS_KEY, [newLog, ...logs]);
}

export const adminService = {
  getDashboardMetrics: async (): Promise<AdminDashboardMetrics> => {
    const orders = getLocalOrders();
    const pendingVerification = orders.filter(
      (o) => o.status === "PENDING_PAYMENT_VERIFICATION"
    );
    const completed = orders.filter((o) => o.status === "FULFILLED");
    const totalRevenue = orders
      .filter((o) => o.status === "FULFILLED" || o.status === "PAYMENT_APPROVED")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      todayOrders: orders.length,
      pendingVerificationCount: pendingVerification.length,
      todayRevenue: 3450,
      monthlyRevenue: totalRevenue + 24800,
      completedOrdersCount: completed.length + 84,
      activeCustomersCount: 128,
      revenueGrowthRate: 18.4,
      orderGrowthRate: 12.1,
      revenueChartData: [
        { date: "Mon", revenue: 4200, orders: 8 },
        { date: "Tue", revenue: 5800, orders: 12 },
        { date: "Wed", revenue: 3900, orders: 7 },
        { date: "Thu", revenue: 7600, orders: 15 },
        { date: "Fri", revenue: 9100, orders: 19 },
        { date: "Sat", revenue: 11400, orders: 24 },
        { date: "Sun", revenue: 8300, orders: 16 },
      ],
      categorySalesData: [
        { name: "AI Tools", sales: 45, value: 58500 },
        { name: "Design Suite", sales: 38, value: 42300 },
        { name: "Dev Tools", sales: 24, value: 28900 },
        { name: "OS & Office", sales: 30, value: 16500 },
        { name: "Streaming", sales: 18, value: 8900 },
      ],
      recentOrders: orders.slice(0, 5),
      pendingOrders: pendingVerification,
    };
  },

  // Admin Orders
  getOrders: async (status?: OrderStatus, search?: string): Promise<Order[]> => {
    let orders = getLocalOrders();
    if (status) {
      orders = orders.filter((o) => o.status === status);
    }
    if (search) {
      const query = search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(query) ||
          o.customerName.toLowerCase().includes(query) ||
          o.customerEmail.toLowerCase().includes(query) ||
          (o.transactionId && o.transactionId.toLowerCase().includes(query))
      );
    }
    return orders;
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    const orders = getLocalOrders();
    return orders.find((o) => o.id === id || o.orderNumber === id) || null;
  },

  approvePayment: async (orderId: string): Promise<Order> => {
    const orders = getLocalOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) throw new Error("Order not found");

    const now = new Date().toISOString();
    const updated: Order = {
      ...orders[index],
      status: "PAYMENT_APPROVED",
      paymentVerifiedAt: now,
      updatedAt: now,
      timeline: orders[index].timeline.map((t) => {
        if (t.status === "PAYMENT_APPROVED") {
          return {
            ...t,
            completed: true,
            timestamp: now,
            description: "Payment approved by admin.",
          };
        }
        return t;
      }),
    };

    orders[index] = updated;
    saveLocalOrders(orders);
    logAdminAction("PAYMENT_APPROVED", "ORDER", orderId, `Approved payment for order ${orders[index].orderNumber}`);
    return updated;
  },

  rejectPayment: async (orderId: string, reason?: string): Promise<Order> => {
    const orders = getLocalOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) throw new Error("Order not found");

    const now = new Date().toISOString();
    const updated: Order = {
      ...orders[index],
      status: "PAYMENT_REJECTED",
      paymentNote: reason ? `Rejected: ${reason}` : "Payment verification failed. Invalid TrxID.",
      updatedAt: now,
    };

    orders[index] = updated;
    saveLocalOrders(orders);
    logAdminAction("PAYMENT_REJECTED", "ORDER", orderId, `Rejected payment for order ${orders[index].orderNumber}: ${reason || "Invalid TrxID"}`);
    return updated;
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<Order> => {
    const orders = getLocalOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) throw new Error("Order not found");

    const now = new Date().toISOString();
    const updated: Order = {
      ...orders[index],
      status,
      updatedAt: now,
      timeline: orders[index].timeline.map((t) => {
        if (t.status === status) {
          return { ...t, completed: true, timestamp: now };
        }
        return t;
      }),
    };

    orders[index] = updated;
    saveLocalOrders(orders);
    logAdminAction("STATUS_UPDATE", "ORDER", orderId, `Updated status to ${status}`);
    return updated;
  },

  fulfillOrder: async (payload: FulfillOrderPayload): Promise<Order> => {
    const orders = getLocalOrders();
    const index = orders.findIndex((o) => o.id === payload.orderId);
    if (index === -1) throw new Error("Order not found");

    const now = new Date().toISOString();
    const updated: Order = {
      ...orders[index],
      status: "FULFILLED",
      deliveryType: payload.deliveryType,
      deliveryData: {
        emailOrUsername: payload.emailOrUsername,
        password: payload.password,
        loginUrl: payload.loginUrl,
        licenseKey: payload.licenseKey,
        activationLink: payload.activationLink,
        downloadUrl: payload.downloadUrl,
        instructions: payload.instructions,
        notes: payload.notes,
        fulfilledAt: now,
      },
      updatedAt: now,
      timeline: orders[index].timeline.map((t) => {
        if (t.status === "FULFILLED" || t.status === "PROCESSING" || t.status === "PAYMENT_APPROVED") {
          return { ...t, completed: true, timestamp: t.timestamp || now };
        }
        return t;
      }),
    };

    orders[index] = updated;
    saveLocalOrders(orders);
    logAdminAction(
      "ORDER_FULFILLED",
      "ORDER",
      payload.orderId,
      `Fulfilled order with delivery type ${payload.deliveryType}`
    );
    return updated;
  },

  markOrderProcessing: async (orderId: string): Promise<Order> => {
    return adminService.updateOrderStatus(orderId, "PROCESSING");
  },

  getOrderAccess: async (orderId: string): Promise<OrderAccessDetails | null> => {
    const orders = getLocalOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order?.deliveryData) return null;
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

  saveOrderAccess: async (
    orderId: string,
    payload: Partial<OrderAccessDetails>
  ): Promise<OrderAccessDetails> => {
    const orders = getLocalOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index !== -1) {
      orders[index] = {
        ...orders[index],
        deliveryType: payload.type || orders[index].deliveryType,
        deliveryData: {
          ...orders[index].deliveryData,
          emailOrUsername: payload.loginEmail || payload.loginUsername,
          password: payload.loginPassword,
          loginUrl: payload.loginUrl,
          licenseKey: payload.licenseKey,
          activationLink: payload.activationLink,
          downloadUrl: payload.downloadUrl,
          instructions: payload.publicInstructions,
          notes: payload.additionalInstructions,
        },
      };
      saveLocalOrders(orders);
    }
    logAdminAction(
      "ACCESS_CONFIGURED",
      "ORDER",
      orderId,
      `Configured access credentials/delivery data`
    );
    return {
      orderId,
      type: payload.type || "ACCOUNT_CREDENTIAL",
      ...payload,
    };
  },

  // Admin Products
  getProducts: async (): Promise<Product[]> => {
    return getLocalProducts();
  },

  createProduct: async (product: Partial<Product>): Promise<Product> => {
    const products = getLocalProducts();
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: product.name || "New Product",
      slug:
        product.slug ||
        product.name?.toLowerCase().replace(/\s+/g, "-") ||
        `prod-${Date.now()}`,
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      categoryId: product.categoryId || "cat-1",
      imageUrl:
        product.imageUrl ||
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      isFeatured: !!product.isFeatured,
      isPopular: !!product.isPopular,
      isActive: product.isActive ?? true,
      deliveryType: product.deliveryType || "ACTIVATION_LINK",
      features: product.features || [],
      deliveryInfo: product.deliveryInfo || "Instant digital delivery.",
      plans: product.plans || [
        {
          id: `plan-${Date.now()}`,
          productId: `prod-${Date.now()}`,
          name: "Standard 1 Month",
          durationValue: 1,
          durationUnit: "months",
          regularPrice: 500,
          salePrice: 350,
          stock: -1,
          active: true,
          sortOrder: 1,
        },
      ],
      startingPrice: product.plans?.[0]?.salePrice || 350,
      originalPrice: product.plans?.[0]?.regularPrice || 500,
      discountPercentage: 30,
      rating: 5.0,
      ratingCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newProduct, ...products];
    saveLocalProducts(updated);
    logAdminAction("PRODUCT_CREATED", "PRODUCT", newProduct.id, `Created product ${newProduct.name}`);
    return newProduct;
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    const products = getLocalProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Product not found");

    const updated = {
      ...products[index],
      ...updates,
      startingPrice: updates.plans?.[0]?.salePrice ?? products[index].startingPrice,
      updatedAt: new Date().toISOString(),
    };

    products[index] = updated;
    saveLocalProducts(products);
    logAdminAction("PRODUCT_UPDATED", "PRODUCT", id, `Updated product ${updated.name}`);
    return updated;
  },

  deleteProduct: async (id: string): Promise<void> => {
    const products = getLocalProducts();
    const filtered = products.filter((p) => p.id !== id);
    saveLocalProducts(filtered);
    logAdminAction("PRODUCT_DELETED", "PRODUCT", id, `Deleted product ${id}`);
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    return getLocalCategories();
  },

  createCategory: async (category: Partial<Category>): Promise<Category> => {
    const categories = getLocalCategories();
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: category.name || "New Category",
      slug:
        category.slug ||
        category.name?.toLowerCase().replace(/\s+/g, "-") ||
        `cat-${Date.now()}`,
      description: category.description || "",
      icon: category.icon || "Sparkles",
      color: category.color || "from-blue-500 to-cyan-600",
      productCount: 0,
      active: category.active ?? true,
      sortOrder: (categories.length || 0) + 1,
    };
    const updated = [...categories, newCategory];
    saveLocalCategories(updated);
    logAdminAction("CATEGORY_CREATED", "CATEGORY", newCategory.id, `Created category ${newCategory.name}`);
    return newCategory;
  },

  updateCategory: async (id: string, updates: Partial<Category>): Promise<Category> => {
    const categories = getLocalCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Category not found");
    const updated = { ...categories[index], ...updates };
    categories[index] = updated;
    saveLocalCategories(categories);
    logAdminAction("CATEGORY_UPDATED", "CATEGORY", id, `Updated category ${updated.name}`);
    return updated;
  },

  deleteCategory: async (id: string): Promise<void> => {
    const categories = getLocalCategories();
    const filtered = categories.filter((c) => c.id !== id);
    saveLocalCategories(filtered);
    logAdminAction("CATEGORY_DELETED", "CATEGORY", id, `Deleted category ${id}`);
  },

  // Payment Methods
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    return getStoreItem<PaymentMethod[]>(ADMIN_PAYMENT_METHODS_KEY, INITIAL_PAYMENT_METHODS);
  },

  updatePaymentMethod: async (
    id: string,
    updates: Partial<PaymentMethod>
  ): Promise<PaymentMethod> => {
    const methods = getStoreItem<PaymentMethod[]>(ADMIN_PAYMENT_METHODS_KEY, INITIAL_PAYMENT_METHODS);
    const index = methods.findIndex((m) => m.id === id);
    if (index === -1) throw new Error("Payment method not found");

    const updated = { ...methods[index], ...updates };
    methods[index] = updated;
    setStoreItem(ADMIN_PAYMENT_METHODS_KEY, methods);
    logAdminAction("PAYMENT_METHOD_UPDATED", "PAYMENT", id, `Updated payment method ${updated.displayName}`);
    return updated;
  },

  // Coupons
  getCoupons: async (): Promise<Coupon[]> => {
    return getStoreItem<Coupon[]>(ADMIN_COUPONS_KEY, INITIAL_COUPONS);
  },

  createCoupon: async (coupon: Partial<Coupon>): Promise<Coupon> => {
    const coupons = getStoreItem<Coupon[]>(ADMIN_COUPONS_KEY, INITIAL_COUPONS);
    const newCoupon: Coupon = {
      id: `cp-${Date.now()}`,
      code: (coupon.code || "DISCOUNT").toUpperCase(),
      description: coupon.description,
      discountType: coupon.discountType || "percentage",
      discountValue: coupon.discountValue || 10,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxDiscount: coupon.maxDiscount,
      usedCount: 0,
      active: coupon.active ?? true,
    };
    setStoreItem(ADMIN_COUPONS_KEY, [newCoupon, ...coupons]);
    logAdminAction("COUPON_CREATED", "SETTING", newCoupon.id, `Created coupon ${newCoupon.code}`);
    return newCoupon;
  },

  deleteCoupon: async (id: string): Promise<void> => {
    const coupons = getStoreItem<Coupon[]>(ADMIN_COUPONS_KEY, INITIAL_COUPONS);
    const filtered = coupons.filter((c) => c.id !== id);
    setStoreItem(ADMIN_COUPONS_KEY, filtered);
    logAdminAction("COUPON_DELETED", "SETTING", id, `Deleted coupon ${id}`);
  },

  // Customers
  getCustomers: async (): Promise<User[]> => {
    const registered = getStoreItem<User[]>(REGISTERED_USERS_KEY, []);
    return [...INITIAL_USERS, ...registered.filter((r) => !INITIAL_USERS.some((u) => u.id === r.id || u.email === r.email))];
  },

  // Audit logs
  getAuditLogs: async (): Promise<AuditLog[]> => {
    return getStoreItem<AuditLog[]>(ADMIN_LOGS_KEY, INITIAL_AUDIT_LOGS);
  },
};
