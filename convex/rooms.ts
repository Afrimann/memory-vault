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

export const getPublicInfo = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) return null;
    return {
      name: room.name,
      coverImage: room.coverImage,
      hasInviteCode: !!room.hasInviteCode,
    };
  },
});

export const setAccessCode = mutation({
  args: { roomId: v.id("rooms"), code: v.string() },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new Error("Unauthenticated");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");
    if (room.ownerId !== user._id) throw new Error("Only owner can set code");

    // Simple hashing (SHA-256)
    const encoder = new TextEncoder();
    const data = encoder.encode(args.code);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    await ctx.db.patch(args.roomId, {
      accessCodeHash: hash,
      hasInviteCode: true,
    });
  },
});

export const joinRoom = mutation({
  args: { roomId: v.id("rooms"), code: v.string() },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new Error("Unauthenticated");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    // Check if already member
    const existing = await ctx.db
      .query("roomMembers")
      .withIndex("by_room_user", (q) =>
        q.eq("roomId", args.roomId).eq("userId", user._id)
      )
      .unique();

    if (existing) return args.roomId; // Already confirmed

    if (!room.accessCodeHash) throw new Error("No access code set for this room");

    // Verify Hash
    const encoder = new TextEncoder();
    const data = encoder.encode(args.code);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    if (hash !== room.accessCodeHash) {
      throw new Error("Incorrect access code");
    }

    // Add Membership
    await ctx.db.insert("roomMembers", {
      roomId: args.roomId,
      userId: user._id,
      role: "member",
      joinedAt: Date.now(),
    });

    return args.roomId;
  },
});
