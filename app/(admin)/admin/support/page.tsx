"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Id } from "@/convex/_generated/dataModel";

type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export default function AdminSupportPage() {
  const { user } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<Id<"supportTickets"> | null>(null);
  const [responseMessage, setResponseMessage] = useState("");

  const tickets = useQuery(api.support.getAllTickets, {});
  const respondMutation = useMutation(api.support.respondToTicket);
  const updateStatusMutation = useMutation(api.support.updateTicketStatus);

  const handleRespond = async (ticketId: Id<"supportTickets">) => {
    if (!user?._id || !responseMessage.trim()) {
      alert("Please enter a response");
      return;
    }
    try {
      await respondMutation({
        ticketId,
        adminId: user._id,
        message: responseMessage,
      });
      setResponseMessage("");
      setSelectedTicket(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to send response");
    }
  };

  const handleStatusChange = async (ticketId: Id<"supportTickets">, status: TicketStatus) => {
    try {
      await updateStatusMutation({
        ticketId,
        status,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Support Tickets</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Manage and respond to support tickets
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tickets ({tickets?.length || 0})</CardTitle>
          <CardDescription>
            View and respond to user support requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tickets && tickets.length > 0 ? (
            <div className="space-y-4">
              {tickets.map((ticket) => {
                return (
                  <div
                    key={ticket._id}
                    className="rounded-lg border p-4 hover:bg-accent/50 cursor-pointer"
                    onClick={() => setSelectedTicket(ticket._id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-semibold text-sm sm:text-base break-words">{ticket.subject}</h3>
                          <Badge className={`${getStatusColor(ticket.status)} text-xs`}>
                            {ticket.status}
                          </Badge>
                          <Badge className={`${getPriorityColor(ticket.priority)} text-xs`}>
                            {ticket.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          User ID: {ticket.userId}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {ticket.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Created: {new Date(ticket.createdAt).toLocaleString()}
                        </p>
                        {ticket.responses.length > 0 && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                            <MessageSquare className="h-3 w-3" />
                            <span>{ticket.responses.length} response(s)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border bg-muted p-12">
              <p className="text-sm text-muted-foreground">No tickets</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedTicket && (
        <TicketDetailDialog
          ticketId={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onRespond={handleRespond}
          onStatusChange={handleStatusChange}
          responseMessage={responseMessage}
          setResponseMessage={setResponseMessage}
        />
      )}
    </div>
  );
}

function TicketDetailDialog({
  ticketId,
  onClose,
  onRespond,
  onStatusChange,
  responseMessage,
  setResponseMessage,
}: {
  ticketId: Id<"supportTickets">;
  onClose: () => void;
  onRespond: (ticketId: Id<"supportTickets">) => void;
  onStatusChange: (ticketId: Id<"supportTickets">, status: TicketStatus) => void;
  responseMessage: string;
  setResponseMessage: (msg: string) => void;
}) {
  const tickets = useQuery(api.support.getAllTickets, {});
  const ticket = tickets?.find((t) => t._id === ticketId);
  const ticketUser = useQuery(
    api.users.getUserById,
    ticket ? { userId: ticket.userId } : "skip"
  );

  if (!ticket) return null;

  return (
    <Dialog open={!!ticketId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle>{ticket.subject}</DialogTitle>
          <DialogDescription>
            Ticket from {ticketUser?.email || "Unknown user"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Original Message */}
          <div className="rounded-lg border p-4">
            <p className="font-medium mb-2">User Message:</p>
            <p className="text-sm">{ticket.message}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Responses */}
          {ticket.responses.length > 0 && (
            <div className="space-y-4">
              <p className="font-medium">Responses:</p>
              {ticket.responses.map((response, index) => (
                <div key={index} className="rounded-lg border bg-muted p-4">
                  <p className="text-sm mb-2">{response.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(response.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Response Form */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Your Response</label>
              <Textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Type your response..."
                rows={4}
                className="mt-2"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => onRespond(ticketId)}
                disabled={!responseMessage.trim()}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                <Send className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Send Response
              </Button>
              <Button
                variant="outline"
                onClick={() => onStatusChange(ticketId, "in_progress")}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                Mark In Progress
              </Button>
              <Button
                variant="outline"
                onClick={() => onStatusChange(ticketId, "resolved")}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                Mark Resolved
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

