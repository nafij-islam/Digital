export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    GOOGLE: "/auth/google",
    REGISTER: "/auth/register",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    UPDATE_PROFILE: "/users/profile",
    CHANGE_PASSWORD: "/auth/change-password",
  },
  // Products & Categories
  PRODUCTS: {
    LIST: "/products",
    DEALS: "/products?popular=true",
    FEATURED: "/products?featured=true",
    DETAILS: (slug: string) => `/products/${slug}`,
    BY_CATEGORY: (categorySlug: string) => `/products?category=${categorySlug}`,
  },
  CATEGORIES: {
    LIST: "/categories",
    DETAILS: (slug: string) => `/categories/${slug}`,
  },
  // Checkout & Orders
  PAYMENTS: {
    METHODS: "/payment-methods",
    VERIFY: "/payments/verify",
  },
  ORDERS: {
    CREATE: "/orders",
    LIST: "/orders",
    DETAILS: (id: string) => `/orders/${id}`,
    CONFIRM: (id: string) => `/orders/${id}/confirm`,
    ACCESS: (id: string) => `/orders/${id}/access`,
    ACTIVATION_PROCESS: (id: string) => `/orders/${id}/activation-process`,
  },
  // Settings & Support
  SETTINGS: {
    HOMEPAGE: "/settings/homepage",
    APPEARANCE: "/settings/appearance",
  },
  SUPPORT: {
    TICKETS: "/support/tickets",
    TICKET_DETAILS: (id: string) => `/support/tickets/${id}`,
    SEND_MESSAGE: (id: string) => `/support/tickets/${id}/messages`,
  },
  // Admin Endpoints
  ADMIN: {
    METRICS: "/admin/dashboard/metrics",
    PRODUCTS: {
      LIST: "/admin/products",
      CREATE: "/admin/products",
      DETAILS: (id: string) => `/admin/products/${id}`,
      UPDATE: (id: string) => `/admin/products/${id}`,
      DELETE: (id: string) => `/admin/products/${id}`,
      TOGGLE_ACTIVE: (id: string) => `/admin/products/${id}/toggle-active`,
    },
    CATEGORIES: {
      LIST: "/admin/categories",
      CREATE: "/admin/categories",
      UPDATE: (id: string) => `/admin/categories/${id}`,
      DELETE: (id: string) => `/admin/categories/${id}`,
    },
    PLANS: {
      LIST: "/admin/plans",
      CREATE: "/admin/plans",
      UPDATE: (id: string) => `/admin/plans/${id}`,
      DELETE: (id: string) => `/admin/plans/${id}`,
    },
    ORDERS: {
      LIST: "/admin/orders",
      DETAILS: (id: string) => `/admin/orders/${id}`,
      APPROVE_PAYMENT: (id: string) => `/admin/orders/${id}/approve-payment`,
      REJECT_PAYMENT: (id: string) => `/admin/orders/${id}/reject-payment`,
      UPDATE_STATUS: (id: string) => `/admin/orders/${id}/status`,
      PROCESS: (id: string) => `/admin/orders/${id}/process`,
      FULFILL: (id: string) => `/admin/orders/${id}/fulfill`,
      CANCEL: (id: string) => `/admin/orders/${id}/cancel`,
      ACCESS: (id: string) => `/admin/orders/${id}/access`,
      ACTIVATION_PROCESS: (id: string) => `/admin/orders/${id}/activation-process`,
    },
    PAYMENT_METHODS: {
      LIST: "/admin/payment-methods",
      CREATE: "/admin/payment-methods",
      UPDATE: (id: string) => `/admin/payment-methods/${id}`,
      DELETE: (id: string) => `/admin/payment-methods/${id}`,
    },
    CUSTOMERS: {
      LIST: "/admin/customers",
      DETAILS: (id: string) => `/admin/customers/${id}`,
    },
    COUPONS: {
      LIST: "/admin/coupons",
      VALIDATE: "/admin/coupons/validate",
      CREATE: "/admin/coupons",
      UPDATE: (id: string) => `/admin/coupons/${id}`,
      DELETE: (id: string) => `/admin/coupons/${id}`,
    },
    REVIEWS: {
      LIST: "/admin/reviews",
      APPROVE: (id: string) => `/admin/reviews/${id}/approve`,
      DELETE: (id: string) => `/admin/reviews/${id}`,
    },
    SETTINGS: {
      GET: "/admin/settings",
      UPDATE: "/admin/settings",
      HOMEPAGE: "/admin/settings/homepage",
      HERO_IMAGE: "/admin/settings/homepage/hero-image",
      APPEARANCE: "/admin/settings/appearance",
    },
    AUDIT_LOGS: "/admin/audit-logs",
  },
};
