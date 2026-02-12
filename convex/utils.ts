import { QueryCtx, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    console.log("getAuthenticatedUser: No identity found (ctx.auth.getUserIdentity() is null)");
    return null;
  }

  console.log("getAuthenticatedUser: Identity found:", identity.subject, identity.email);

  // First try to find by external ID (Clerk ID)
  // identity.subject contains the Clerk User ID
  const userByExternalId = await ctx.db
    .query("users")
    .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
    .unique();

  if (userByExternalId) {
    console.log("getAuthenticatedUser: Found user by externalId:", userByExternalId._id);
    return userByExternalId;
  }

  // Fallback to email for legacy users
  if (identity.email) {
    const userByEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .unique();
    
    if (userByEmail) {
        console.log("getAuthenticatedUser: Found user by email:", userByEmail._id);
        return userByEmail;
    }
  }

  console.log("getAuthenticatedUser: User not found in DB");
  return null;
}
