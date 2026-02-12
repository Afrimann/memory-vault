import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./utils";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const create = mutation({
  args: {
    roomId: v.id("rooms"),
    mediaStorageId: v.string(),
    mediaType: v.union(v.literal("image"), v.literal("video"), v.literal("audio"), v.literal("text")),
    caption: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new Error("Unauthenticated");

    // Verify membership
    const membership = await ctx.db
      .query("roomMembers")
      .withIndex("by_room_user", (q) =>
        q.eq("roomId", args.roomId).eq("userId", user._id)
      )
      .unique();

    if (!membership) throw new Error("Access denied");

    const memoryId = await ctx.db.insert("memories", {
      roomId: args.roomId,
      uploaderId: user._id,
      mediaStorageId: args.mediaStorageId,
      mediaType: args.mediaType,
      caption: args.caption,
      location: args.location,
      takenAt: Date.now(),
    });

    return memoryId;
  },
});

export const list = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return [];

    const membership = await ctx.db
      .query("roomMembers")
      .withIndex("by_room_user", (q) =>
        q.eq("roomId", args.roomId).eq("userId", user._id)
      )
      .unique();

    if (!membership) return []; // Access denied

    const memories = await ctx.db
      .query("memories")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .order("desc") // Newest first
      .take(50); // Pagination needed later

    // Enrich with media URLs and Uploader info
    const enrichedMemories = await Promise.all(
      memories.map(async (memory) => {
        const url = await ctx.storage.getUrl(memory.mediaStorageId);
        const uploader = await ctx.db.get(memory.uploaderId);
        return {
          ...memory,
          mediaUrl: url,
          uploader: uploader,
        };
      })
    );

    return enrichedMemories;
  },
});
