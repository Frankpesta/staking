import { z } from "zod";

export const createTicketSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200, "Subject too long"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  category: z.enum(["technical", "account", "transaction", "other"]),
});

export const ticketResponseSchema = z.object({
  ticketId: z.string().min(1, "Ticket ID is required"),
  message: z.string().min(1, "Message is required"),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type TicketResponseInput = z.infer<typeof ticketResponseSchema>;

