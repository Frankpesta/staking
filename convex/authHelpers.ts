import type { MutationCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";

/**
 * Resolve the current user from a session token and require super_admin.
 */
export async function requireSuperAdmin(
  ctx: MutationCtx,
  token: string
): Promise<Doc<"users">> {
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q) => q.eq("token", token))
    .first();

  if (!session || session.expiresAt < Date.now()) {
    throw new Error("Unauthorized");
  }

  const user = await ctx.db.get(session.userId);
  if (!user || user.role !== "super_admin") {
    throw new Error("Forbidden — admin only");
  }

  return user;
}
