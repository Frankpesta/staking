"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Send, Upload, X, Loader2 } from "lucide-react";

export default function AdminEmailsPage() {
  const [recipientType, setRecipientType] = useState<"all" | "single">("single");
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);

  const users = useQuery(api.users.listUsers, {});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !body.trim()) {
      alert("Subject and body are required");
      return;
    }

    if (recipientType === "single" && !selectedUserEmail) {
      alert("Please select a recipient");
      return;
    }

    setIsSending(true);

    try {
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("body", body);
      formData.append("recipientType", recipientType);

      if (recipientType === "single") {
        formData.append("recipientEmail", selectedUserEmail);
      } else {
        // Get all user emails
        const allEmails = users?.map((user) => user.email).filter(Boolean) || [];
        if (allEmails.length === 0) {
          alert("No users found to send email to");
          setIsSending(false);
          return;
        }
        formData.append("recipientEmails", JSON.stringify(allEmails));
      }

      // Add attachments (only valid files)
      attachments
        .filter((file) => file && file.size > 0 && file.size <= 10 * 1024 * 1024)
        .forEach((file) => {
          formData.append("attachments", file);
        });

      const response = await fetch("/api/email/send-admin", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send email");
      }

      alert(`Email sent successfully! ${result.sent} sent, ${result.failed} failed`);

      // Reset form
      setSubject("");
      setBody("");
      setAttachments([]);
      setSelectedUserEmail("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Send Email</h1>
        <p className="text-muted-foreground mt-1">
          Send emails to users individually or in bulk
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compose Email</CardTitle>
          <CardDescription>
            Send emails to users with optional attachments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipient Type */}
            <div className="space-y-4">
              <Label>Recipient</Label>
              <RadioGroup
                value={recipientType}
                onValueChange={(value) => setRecipientType(value as "all" | "single")}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label htmlFor="single" className="cursor-pointer">
                    Single User
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="cursor-pointer">
                    All Users ({users?.length || 0})
                  </Label>
                </div>
              </RadioGroup>

              {recipientType === "single" && (
                <div className="space-y-2">
                  <Label htmlFor="userEmail">Select User</Label>
                  <Select value={selectedUserEmail} onValueChange={setSelectedUserEmail}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users?.map((user) => (
                        <SelectItem key={user._id} value={user.email}>
                          {user.email} {user.accountHolderName1 && `(${user.accountHolderName1})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {recipientType === "all" && (
                <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                  This email will be sent to all {users?.length || 0} users in the system.
                </div>
              )}
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
                required
              />
            </div>

            {/* Body */}
            <div className="space-y-2">
              <Label htmlFor="body">Email Body *</Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter your email content here. You can use HTML for formatting."
                rows={12}
                required
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                You can use HTML tags for formatting (e.g., &lt;p&gt;, &lt;strong&gt;, &lt;a&gt;)
              </p>
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <Label htmlFor="attachments">Attachments (Optional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              {attachments.length > 0 && (
                <div className="space-y-2 mt-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md border p-2"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Maximum file size: 10MB per file
              </p>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isSending}>
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Email
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
