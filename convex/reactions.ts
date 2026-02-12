import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./utils";

export const toggle = mutation({
  args: {
    memoryId: v.id("memories"),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new Error("Unauthenticated");

    const memory = await ctx.db.get(args.memoryId);
    if (!memory) throw new Error("Memory not found");

    // Verify membership
    const membership = await ctx.db
      .query("roomMembers")
      .withIndex("by_room_user", (q) =>
        q.eq("roomId", memory.roomId).eq("userId", user._id)
      )
      .unique();
    if (!membership) throw new Error("Access denied");

    const existing = await ctx.db
      .query("reactions")
      .withIndex("by_user_memory", (q) =>
        q.eq("userId", user._id).eq("memoryId", args.memoryId)
      )
      .filter((q) => q.eq(q.field("type"), args.type))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return "removed";
    } else {
      await ctx.db.insert("reactions", {
        memoryId: args.memoryId,
        userId: user._id,
        type: args.type,
      });
      return "added";
    }
  },
});

export const list = query({
  args: { memoryId: v.id("memories") },
  handler: async (ctx, args) => {
    const reactions = await ctx.db
      .query("reactions")
      .withIndex("by_memory", (q) => q.eq("memoryId", args.memoryId))
      .collect();

    return reactions;
  },
});
