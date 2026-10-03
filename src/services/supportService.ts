import { CreateTicketPayload, SupportTicket, TicketMessage } from "@/types/support";
import { INITIAL_TICKETS } from "./mockData";

const TICKETS_KEY = "dg_support_tickets";

function getLocalTickets(): SupportTicket[] {
  if (typeof window === "undefined") return INITIAL_TICKETS;
  try {
    const data = localStorage.getItem(TICKETS_KEY);
    return data ? JSON.parse(data) : INITIAL_TICKETS;
  } catch {
    return INITIAL_TICKETS;
  }
}

function saveLocalTickets(tickets: SupportTicket[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
  } catch (e) {
    console.error("Failed to save tickets", e);
  }
}

export const supportService = {
  getTickets: async (): Promise<SupportTicket[]> => {
    return getLocalTickets();
  },

  getTicketById: async (id: string): Promise<SupportTicket | null> => {
    const tickets = getLocalTickets();
    return tickets.find((t) => t.id === id || t.ticketNumber === id) || null;
  },

  createTicket: async (payload: CreateTicketPayload): Promise<SupportTicket> => {
    const tickets = getLocalTickets();
    const newId = `tkt-${Date.now()}`;
    const ticketNumber = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newTicket: SupportTicket = {
      id: newId,
      ticketNumber,
      customerId: "usr-demo-1",
      customerName: "Nafij Islam",
      customerEmail: "nafij@example.com",
      subject: payload.subject,
      category: payload.category as any,
      priority: payload.priority,
      status: "OPEN",
      orderId: payload.orderId,
      messages: [
        {
          id: `msg-${Date.now()}`,
          ticketId: newId,
          senderId: "usr-demo-1",
          senderName: "Nafij Islam",
          senderRole: "customer",
          message: payload.initialMessage,
          createdAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newTicket, ...tickets];
    saveLocalTickets(updated);
    return newTicket;
  },

  sendMessage: async (ticketId: string, message: string): Promise<TicketMessage> => {
    const tickets = getLocalTickets();
    const ticket = tickets.find((t) => t.id === ticketId);
    const newMsg: TicketMessage = {
      id: `msg-${Date.now()}`,
      ticketId,
      senderId: "usr-demo-1",
      senderName: "Nafij Islam",
      senderRole: "customer",
      message,
      createdAt: new Date().toISOString(),
    };

    if (ticket) {
      ticket.messages.push(newMsg);
      ticket.updatedAt = new Date().toISOString();
      saveLocalTickets(tickets);
    }
    return newMsg;
  },
};
