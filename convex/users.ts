import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./utils";
import { v } from "convex/values";

export const syncUser = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    externalId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log("Server side syncUser called with:", args);
    // 1. Try to find by external ID
    if (args.externalId) {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
        .unique();
      
      if (existingUser) {
        // Update user fields
        await ctx.db.patch(existingUser._id, {
          name: args.name,
          email: args.email,
          image: args.image,
          // ensure externalId is set if it was missing (shouldn't be if we found it by index)
          externalId: args.externalId, 
        });
        return existingUser._id;
      }
    }

    // 2. Fallback to finding by email
    const userByEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (userByEmail) {
      // Found by email, update externalId to link accounts
      await ctx.db.patch(userByEmail._id, {
        name: args.name,
        image: args.image,
        externalId: args.externalId, // Link the external ID!
      });
      return userByEmail._id;
    }

    // 3. Create new user
    const newUserId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      image: args.image,
      externalId: args.externalId,
    });

    return newUserId;
  },
});

export const getUser = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
     return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  }
});

export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        return await getAuthenticatedUser(ctx);
    }
})
