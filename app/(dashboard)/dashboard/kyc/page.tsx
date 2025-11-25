"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, CheckCircle, XCircle, Clock } from "lucide-react";
import { KYC_DOCUMENT_TYPES } from "@/lib/constants";

export default function KYCPage() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const documents = useQuery(
    api.kyc.getUserKYCDocuments,
    user?._id ? { userId: user._id } : "skip"
  );

  const uploadDocumentMutation = useMutation(api.kyc.uploadKYCDocument);
  const generateUploadUrlMutation = useMutation(api.files.generateUploadUrl);

  const handleFileUpload = async (documentType: string, file: File) => {
    if (!user?._id) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    try {
      setUploading(documentType);
      setError(null);

      // Generate upload URL
      const uploadUrl = await generateUploadUrlMutation();
      
      // Upload file to Convex storage
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      // Create document record
      await uploadDocumentMutation({
        userId: user._id,
        documentType: documentType as any,
        fileId: storageId,
      });

      setUploading(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploading(null);
    }
  };

  const getDocumentStatus = (type: string) => {
    const doc = documents?.find((d) => d.documentType === type);
    if (!doc) return "not_uploaded";
    return doc.status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "pending":
        return "Pending Review";
      default:
        return "Not Uploaded";
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">KYC Verification</h1>
        <p className="text-muted-foreground">
          Complete your identity verification to unlock all features
        </p>
      </div>

      {user.kycStatus === "approved" && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="font-semibold text-green-900 dark:text-green-100">
                Your KYC verification has been approved!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {user.kycStatus === "rejected" && (
        <Card className="border-red-500 bg-red-50 dark:bg-red-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <p className="font-semibold text-red-900 dark:text-red-100">
                Your KYC verification was rejected. Please upload corrected documents.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-500 bg-red-50 dark:bg-red-950">
          <CardContent className="pt-6">
            <p className="text-sm text-red-900 dark:text-red-100">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(KYC_DOCUMENT_TYPES).map(([key, value]) => {
          const status = getDocumentStatus(value);
          const isUploading = uploading === value;
          const doc = documents?.find((d) => d.documentType === value);

          return (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </CardTitle>
                <CardDescription>
                  {key === "id_front" && "Front side of your government-issued ID"}
                  {key === "id_back" && "Back side of your government-issued ID"}
                  {key === "selfie" && "Selfie holding your ID"}
                  {key === "proof_of_address" && "Utility bill or bank statement (less than 3 months old)"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    <span className="text-sm">{getStatusText(status)}</span>
                  </div>
                </div>

                {doc?.rejectionReason && (
                  <div className="rounded-md bg-red-50 p-2 text-xs text-red-900 dark:bg-red-950 dark:text-red-100">
                    <p className="font-medium">Rejection Reason:</p>
                    <p>{doc.rejectionReason}</p>
                  </div>
                )}

                <div>
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 hover:border-primary">
                    <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {isUploading ? "Uploading..." : "Click to upload"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      JPG, PNG, or PDF (max 5MB)
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,application/pdf"
                      disabled={isUploading || status === "approved"}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(value, file);
                        }
                      }}
                    />
                  </label>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verification Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>All documents must be clear and readable</li>
            <li>ID documents must be valid and not expired</li>
            <li>Selfie must clearly show your face and the ID</li>
            <li>Proof of address must be less than 3 months old</li>
            <li>File size must be less than 5MB per document</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

