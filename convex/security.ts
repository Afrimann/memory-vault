import { QueryCtx, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export async function hasAccess(ctx: QueryCtx | MutationCtx, roomId: Id<"rooms">, userId: Id<"users">) {
    const membership = await ctx.db
        .query("roomMembers")
        .withIndex("by_room_user", (q) => q.eq("roomId", roomId).eq("userId", userId))
        .unique();
    return !!membership;
}

export async function isOwner(ctx: QueryCtx | MutationCtx, roomId: Id<"rooms">, userId: Id<"users">) {
    const room = await ctx.db.get(roomId);
    return room?.ownerId === userId;
}

export async function hashString(str: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
