export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "WAITING_ON_CUSTOMER" | "RESOLVED" | "CLOSED";

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: "customer" | "admin" | "support";
  message: string;
  createdAt: string;
  attachments?: string[];
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  category: "Billing" | "Delivery" | "Product Issue" | "Account" | "General";
  priority: TicketPriority;
  status: TicketStatus;
  orderId?: string;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketPayload {
  subject: string;
  category: string;
  priority: TicketPriority;
  orderId?: string;
  initialMessage: string;
}
