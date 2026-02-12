import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./utils";

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    coverImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new Error("Unauthenticated");

    const roomId = await ctx.db.insert("rooms", {
      name: args.name,
      description: args.description,
      coverImage: args.coverImage,
      ownerId: user._id,
    });

    await ctx.db.insert("roomMembers", {
      roomId,
      userId: user._id,
      role: "admin",
      joinedAt: Date.now(),
    });

    return roomId;
  },
});

export const list = query({
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return [];

    const memberships = await ctx.db
      .query("roomMembers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const rooms = await Promise.all(
      memberships.map(async (m) => {
        return await ctx.db.get(m.roomId);
      })
    );

    return rooms.filter((r) => r !== null);
  },
});

export const get = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return null;

    const membership = await ctx.db
      .query("roomMembers")
      .withIndex("by_room_user", (q) =>
        q.eq("roomId", args.roomId).eq("userId", user._id)
      )
      .unique();

    if (!membership) throw new Error("Access denied");

    return await ctx.db.get(args.roomId);
  },
});
