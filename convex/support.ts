import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Create a support ticket
 */
export const createTicket = mutation({
  args: {
    userId: v.id("users"),
    subject: v.string(),
    message: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  },
  handler: async (ctx, args) => {
    const ticketId = await ctx.db.insert("supportTickets", {
      userId: args.userId,
      subject: args.subject,
      message: args.message,
      status: "open",
      priority: args.priority,
      responses: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create activity log
    await ctx.db.insert("activities", {
      userId: args.userId,
      type: "support_ticket_created",
      description: `Support ticket created: ${args.subject}`,
      metadata: { ticketId },
      timestamp: Date.now(),
    });

    return { ticketId };
  },
});

/**
 * Get user's support tickets
 */
export const getUserTickets = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const tickets = await ctx.db
      .query("supportTickets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return tickets.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * Get all support tickets (admin only)
 */
export const getAllTickets = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("open"),
        v.literal("in_progress"),
        v.literal("resolved"),
        v.literal("closed")
      )
    ),
  },
  handler: async (ctx, args) => {
    let tickets = await ctx.db.query("supportTickets").collect();

    if (args.status) {
      tickets = tickets.filter((t) => t.status === args.status);
    }

    return tickets.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * Respond to a support ticket (admin only)
 */
export const respondToTicket = mutation({
  args: {
    ticketId: v.id("supportTickets"),
    adminId: v.id("users"),
    message: v.string(),
    attachments: v.optional(v.array(v.id("_storage"))),
  },
  handler: async (ctx, args) => {
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const response = {
      adminId: args.adminId,
      message: args.message,
      timestamp: Date.now(),
      attachments: args.attachments || [],
    };

    await ctx.db.patch(args.ticketId, {
      responses: [...ticket.responses, response],
      status: ticket.status === "open" ? "in_progress" : ticket.status,
      updatedAt: Date.now(),
    });

    // Create activity log
    await ctx.db.insert("activities", {
      userId: ticket.userId,
      type: "support_ticket_response",
      description: `Admin responded to ticket: ${ticket.subject}`,
      metadata: { ticketId: args.ticketId },
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Update ticket status (admin only)
 */
export const updateTicketStatus = mutation({
  args: {
    ticketId: v.id("supportTickets"),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("resolved"),
      v.literal("closed")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.ticketId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

