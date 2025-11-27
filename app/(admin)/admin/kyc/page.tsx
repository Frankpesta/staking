"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, FileText, User } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

export default function AdminKYCPage() {
  const { user } = useAuth();
  const [selectedDocument, setSelectedDocument] = useState<Id<"kycDocuments"> | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const pendingDocuments = useQuery(api.kyc.getPendingKYCDocuments);
  const approveMutation = useMutation(api.kyc.approveKYCDocument);
  const rejectMutation = useMutation(api.kyc.rejectKYCDocument);
  const getFileUrlMutation = useMutation(api.files.getFileUrl);

  const handleApprove = async (documentId: string) => {
    if (!user?._id) return;
    try {
      await approveMutation({
        documentId: documentId as any,
        adminId: user._id,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve");
    }
  };

  const handleReject = async (documentId: string) => {
    if (!user?._id || !rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    try {
      await rejectMutation({
        documentId: documentId as any,
        adminId: user._id,
        rejectionReason,
      });
      setRejectionReason("");
      setSelectedDocument(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject");
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">KYC Review</h1>
        <p className="text-muted-foreground">
          Review and approve KYC documents
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Pending Documents ({pendingDocuments?.length || 0})
          </CardTitle>
          <CardDescription>
            Review uploaded KYC documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingDocuments && pendingDocuments.length > 0 ? (
            <div className="space-y-4">
              {pendingDocuments.map((doc) => {
                return (
                  <div
                    key={doc._id}
                    className="rounded-lg border p-4"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span className="font-semibold">
                            {getDocumentTypeLabel(doc.documentType)}
                          </span>
                          <Badge>Pending</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <User className="h-4 w-4" />
                          User ID: {doc.userId}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Uploaded: {new Date(doc.uploadedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          getFileUrlMutation({ fileId: doc.fileId }).then((url) => {
                            if (url) window.open(url, "_blank");
                          });
                        }}
                        variant="outline"
                      >
                        View Document
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(doc._id)}
                        className="flex-1"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setSelectedDocument(doc._id)}
                        className="flex-1"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border bg-muted p-12">
              <p className="text-sm text-muted-foreground">No pending documents</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedDocument && (
        <Card>
          <CardHeader>
            <CardTitle>Rejection Reason</CardTitle>
            <CardDescription>
              Please provide a reason for rejecting this document
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedDocument(null);
                  setRejectionReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleReject(selectedDocument)}
              >
                Submit Rejection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

