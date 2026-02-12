import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    // This connects the Convex User to the external Auth provider ID if needed,
    // though typically we use the Convex User Identity. We'll store externalId just in case.
    externalId: v.optional(v.string()), 
  }).index("by_email", ["email"])
    .index("by_externalId", ["externalId"]),

  rooms: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    coverImage: v.optional(v.string()), // Storage ID or URL
    ownerId: v.id("users"),
  })
  .index("by_owner", ["ownerId"]),

  roomMembers: defineTable({
    roomId: v.id("rooms"),
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("member"), v.literal("viewer")),
    joinedAt: v.number(),
  })
  .index("by_room", ["roomId"])
  .index("by_user", ["userId"])
  .index("by_room_user", ["roomId", "userId"]), // For quick permission checks

  memories: defineTable({
    roomId: v.id("rooms"),
    uploaderId: v.id("users"),
    mediaStorageId: v.string(), // Convex Storage ID
    mediaType: v.union(v.literal("image"), v.literal("video"), v.literal("audio"), v.literal("text")),
    caption: v.optional(v.string()),
    location: v.optional(v.string()),
    takenAt: v.optional(v.number()), // When the memory happened
  })
  .index("by_room", ["roomId"]),

  comments: defineTable({
    memoryId: v.id("memories"),
    userId: v.id("users"),
    text: v.string(),
    createdAt: v.number(),
  })
  .index("by_memory", ["memoryId"]),

  reactions: defineTable({
    memoryId: v.id("memories"),
    userId: v.id("users"),
    type: v.string(), // e.g. "❤️", "😂"
  })
  .index("by_memory", ["memoryId"])
  .index("by_user_memory", ["userId", "memoryId"]),

  invitations: defineTable({
    token: v.string(),
    roomId: v.id("rooms"),
    invitedEmail: v.optional(v.string()), // Optional: can be a generic link
    role: v.union(v.literal("admin"), v.literal("member"), v.literal("viewer")),
    expiresAt: v.number(),
    usedBy: v.optional(v.id("users")),
  })
  .index("by_token", ["token"])
  .index("by_room", ["roomId"]),

});
