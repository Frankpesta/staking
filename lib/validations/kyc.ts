import { z } from "zod";

export const kycDocumentSchema = z.object({
  documentType: z.enum(["id_front", "id_back", "selfie", "proof_of_address"]),
  fileId: z.string().min(1, "File is required"),
});

export type KYCDocumentInput = z.infer<typeof kycDocumentSchema>;

