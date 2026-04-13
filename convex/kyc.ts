import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { scheduleAdminActivityEmail } from "./notifyAdmin";

/**
 * Upload KYC document
 */
export const uploadKYCDocument = mutation({
  args: {
    userId: v.id("users"),
    documentType: v.union(
      v.literal("id_front"),
      v.literal("id_back"),
      v.literal("selfie"),
      v.literal("proof_of_address")
    ),
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // Create document record
    const documentId = await ctx.db.insert("kycDocuments", {
      userId: args.userId,
      documentType: args.documentType,
      fileId: args.fileId,
      status: "pending",
      uploadedAt: Date.now(),
    });

    // Update user's KYC documents array
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const kycDocuments = [...user.kycDocuments, documentId];
    let kycStatus = user.kycStatus;

    // Check if all required documents are uploaded
    const documents = await ctx.db
      .query("kycDocuments")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const hasIdFront = documents.some((d) => d.documentType === "id_front");
    const hasIdBack = documents.some((d) => d.documentType === "id_back");
    const hasSelfie = documents.some((d) => d.documentType === "selfie");
    const hasProofOfAddress = documents.some(
      (d) => d.documentType === "proof_of_address"
    );

    if (hasIdFront && hasIdBack && hasSelfie && hasProofOfAddress) {
      kycStatus = "pending";
    } else if (kycStatus === "not_started") {
      kycStatus = "not_started";
    }

    await ctx.db.patch(args.userId, {
      kycDocuments,
      kycStatus,
      updatedAt: Date.now(),
    });

    // Create activity log
    await ctx.db.insert("activities", {
      userId: args.userId,
      type: "kyc_document_uploaded",
      description: `KYC document uploaded: ${args.documentType}`,
      metadata: { documentId, documentType: args.documentType },
      timestamp: Date.now(),
    });

    await scheduleAdminActivityEmail(ctx, {
      activityType: "kyc_document_uploaded",
      description: `KYC document uploaded: ${args.documentType}`,
      userId: args.userId,
      adminPath: "/admin/kyc",
    });

    return { documentId };
  },
});

/**
 * Get user's KYC documents
 */
export const getUserKYCDocuments = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const documents = await ctx.db
      .query("kycDocuments")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return documents.sort((a, b) => b.uploadedAt - a.uploadedAt);
  },
});

/**
 * Get pending KYC documents (admin only)
 */
export const getPendingKYCDocuments = query({
  handler: async (ctx) => {
    const documents = await ctx.db
      .query("kycDocuments")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    return documents.sort((a, b) => a.uploadedAt - b.uploadedAt);
  },
});

/**
 * Approve KYC document (admin only)
 */
export const approveKYCDocument = mutation({
  args: {
    documentId: v.id("kycDocuments"),
    adminId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    await ctx.db.patch(args.documentId, {
      status: "approved",
      reviewedAt: Date.now(),
      reviewedBy: args.adminId,
    });

    // Check if all user's documents are approved
    const userDocuments = await ctx.db
      .query("kycDocuments")
      .withIndex("by_user", (q) => q.eq("userId", document.userId))
      .collect();

    const allApproved = userDocuments.every((d) => d.status === "approved");
    const hasAllRequired = userDocuments.some(
      (d) => d.documentType === "id_front"
    ) &&
      userDocuments.some((d) => d.documentType === "id_back") &&
      userDocuments.some((d) => d.documentType === "selfie") &&
      userDocuments.some((d) => d.documentType === "proof_of_address");

    if (allApproved && hasAllRequired) {
      // Update user's KYC status
      await ctx.db.patch(document.userId, {
        kycStatus: "approved",
        updatedAt: Date.now(),
      });

      // Create activity log
      await ctx.db.insert("activities", {
        userId: document.userId,
        type: "kyc_approved",
        description: "KYC verification approved",
        timestamp: Date.now(),
      });

      await scheduleAdminActivityEmail(ctx, {
        activityType: "kyc_approved",
        description: "KYC verification approved",
        userId: document.userId,
        adminPath: "/admin/kyc",
      });
    }

    return { success: true };
  },
});

/**
 * Reject KYC document (admin only)
 */
export const rejectKYCDocument = mutation({
  args: {
    documentId: v.id("kycDocuments"),
    adminId: v.id("users"),
    rejectionReason: v.string(),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    await ctx.db.patch(args.documentId, {
      status: "rejected",
      reviewedAt: Date.now(),
      reviewedBy: args.adminId,
      rejectionReason: args.rejectionReason,
    });

    // Update user's KYC status
    await ctx.db.patch(document.userId, {
      kycStatus: "rejected",
      updatedAt: Date.now(),
    });

    // Create activity log
    await ctx.db.insert("activities", {
      userId: document.userId,
      type: "kyc_rejected",
      description: `KYC document rejected: ${args.rejectionReason}`,
      metadata: { documentId: args.documentId, reason: args.rejectionReason },
      timestamp: Date.now(),
    });

    await scheduleAdminActivityEmail(ctx, {
      activityType: "kyc_rejected",
      description: `KYC rejected: ${args.rejectionReason}`,
      userId: document.userId,
      adminPath: "/admin/kyc",
    });

    return { success: true };
  },
});

