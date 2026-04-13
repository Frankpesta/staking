import { internal } from "./_generated/api";
import type { MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

/**
 * Queue an email to ADMIN_NOTIFICATION_EMAIL (comma-separated in Convex env).
 * Called from mutations after meaningful platform activity.
 */
export async function scheduleAdminActivityEmail(
  ctx: MutationCtx,
  args: {
    activityType: string;
    description: string;
    userId?: Id<"users">;
    adminPath?: string;
  }
): Promise<void> {
  let userEmail: string | undefined;
  if (args.userId) {
    const user = await ctx.db.get(args.userId);
    userEmail = user?.email;
  }

  await ctx.scheduler.runAfter(0, internal.actions.email.sendAdminActivityEmail, {
    subject: `[Truststaking] ${args.activityType}`,
    description: args.description,
    userEmail,
    adminPath: args.adminPath ?? "/admin",
  });
}
