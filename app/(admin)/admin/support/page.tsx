"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminSupportPage() {
  const { user } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState("");

  const tickets = useQuery(api.support.getAllTickets);
  const respondMutation = useMutation(api.support.respondToTicket);
  const updateStatusMutation = useMutation(api.support.updateTicketStatus);

  const handleRespond = async (ticketId: string) => {
    if (!user?._id || !responseMessage.trim()) {
      alert("Please enter a response");
      return;
    }
    try {
      await respondMutation({
        ticketId: ticketId as any,
        adminId: user._id,
        message: responseMessage,
      });
      setResponseMessage("");
      setSelectedTicket(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to send response");
    }
  };

  const handleStatusChange = async (ticketId: string, status: string) => {
    try {
      await updateStatusMutation({
        ticketId: ticketId as any,
        status: status as any,
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Support Tickets</h1>
        <p className="text-muted-foreground">
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
                const ticketUser = useQuery(api.users.getUserById, {
                  userId: ticket.userId,
                });
                return (
                  <div
                    key={ticket._id}
                    className="rounded-lg border p-4 hover:bg-accent/50 cursor-pointer"
                    onClick={() => setSelectedTicket(ticket._id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{ticket.subject}</h3>
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </div>
                        {ticketUser && (
                          <p className="text-sm text-muted-foreground">
                            From: {ticketUser.email}
                          </p>
                        )}
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
  ticketId: string;
  onClose: () => void;
  onRespond: (ticketId: string) => void;
  onStatusChange: (ticketId: string, status: string) => void;
  responseMessage: string;
  setResponseMessage: (msg: string) => void;
}) {
  const tickets = useQuery(api.support.getAllTickets);
  const ticket = tickets?.find((t) => t._id === ticketId);
  const ticketUser = useQuery(
    api.users.getUserById,
    ticket ? { userId: ticket.userId } : "skip"
  );

  if (!ticket) return null;

  return (
    <Dialog open={!!ticketId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
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
            <div className="flex gap-2">
              <Button
                onClick={() => onRespond(ticketId)}
                disabled={!responseMessage.trim()}
              >
                <Send className="mr-2 h-4 w-4" />
                Send Response
              </Button>
              <Button
                variant="outline"
                onClick={() => onStatusChange(ticketId, "in_progress")}
              >
                Mark In Progress
              </Button>
              <Button
                variant="outline"
                onClick={() => onStatusChange(ticketId, "resolved")}
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

