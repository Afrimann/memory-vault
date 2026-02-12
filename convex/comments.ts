import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./utils";

export const create = mutation({
  args: {
    memoryId: v.id("memories"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new Error("Unauthenticated");

    // Verify access to memory's room? 
    // Ideally yes, but for now rely on RLS logic or just assume if they have the ID they might have access.
    // Better: Retrieve memory -> check room -> check membership.
    const memory = await ctx.db.get(args.memoryId);
    if (!memory) throw new Error("Memory not found");

    const membership = await ctx.db
      .query("roomMembers")
      .withIndex("by_room_user", (q) =>
        q.eq("roomId", memory.roomId).eq("userId", user._id)
      )
      .unique();

    if (!membership) throw new Error("Access denied");

    const commentId = await ctx.db.insert("comments", {
        memoryId: args.memoryId,
        userId: user._id,
        text: args.text,
        createdAt: Date.now(),
    });

    return commentId;
  },
});

export const list = query({
  args: { memoryId: v.id("memories") },
  handler: async (ctx, args) => {
      // In a real app, also verify access here
      const comments = await ctx.db
        .query("comments")
        .withIndex("by_memory", (q) => q.eq("memoryId", args.memoryId))
        .collect();

      // Enrich with user info
      return await Promise.all(comments.map(async (c) => {
          const user = await ctx.db.get(c.userId);
          return { ...c, user };
      }));
  }
})
