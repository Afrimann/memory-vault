import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./utils";

export const create = mutation({
  args: {
    roomId: v.id("rooms"),
    role: v.union(v.literal("admin"), v.literal("member"), v.literal("viewer")),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new Error("Unauthenticated");

    // Verify admin privileges
    const membership = await ctx.db
      .query("roomMembers")
      .withIndex("by_room_user", (q) =>
        q.eq("roomId", args.roomId).eq("userId", user._id)
      )
      .unique();

    if (!membership || membership.role !== "admin") {
      throw new Error("Access denied: Only admins can invite");
    }

    // Generate token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const inviteId = await ctx.db.insert("invitations", {
      token,
      roomId: args.roomId,
      role: args.role,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token;
  },
});

export const getByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const invite = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!invite) return null;
    if (invite.expiresAt < Date.now()) return null; // Expired
    if (invite.usedBy) return null; // Already used

    const room = await ctx.db.get(invite.roomId);
    if (!room) return null;

    const inviter = await ctx.db.query("roomMembers").withIndex("by_room", q => q.eq("roomId", invite.roomId)).first(); 
    // Ideally we store inviterId in invitation for better UX, but this is fine.
    
    return {
        invite,
        room
    };
  },
});

export const accept = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new Error("Unauthenticated");

    const invite = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!invite) throw new Error("Invalid invite");
    if (invite.expiresAt < Date.now()) throw new Error("Invite expired");
    if (invite.usedBy) throw new Error("Invite already used");

    // Check if already a member
    const existingMembership = await ctx.db
      .query("roomMembers")
      .withIndex("by_room_user", (q) =>
        q.eq("roomId", invite.roomId).eq("userId", user._id)
      )
      .unique();

    if (existingMembership) {
        // Already member, just return
        return invite.roomId;
    }

    await ctx.db.insert("roomMembers", {
      roomId: invite.roomId,
      userId: user._id,
      role: invite.role,
      joinedAt: Date.now(),
    });

    // Mark as used
    await ctx.db.patch(invite._id, {
        usedBy: user._id
    });

    return invite.roomId;
  },
});
