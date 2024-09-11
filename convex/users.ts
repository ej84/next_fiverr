import { v } from "convex/values";
import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
//import Stripe from "stripe";
import { api, internal } from "./_generated/api";

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if this identity was already stored before.
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (user !== null) {
      // If this identity has been seen before but the name has changed, patch the value.
      if (user.username !== identity.nickname) {
        await ctx.db.patch(user._id, { username: identity.name });
      }
      return user._id;
    }

    // If its a new identity, create a new 'User'
    const userId = await ctx.db.insert("users", {
      fullName: identity.name!,
      tokenIdentifier: identity.tokenIdentifier,
      title: "",
      about: "",
      username: identity.nickname!,
      profileImageUrl: identity.profileUrl,
    });

    return userId;
  },
});

export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    // throw new Error("Unauthenticated call to query");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    return user;
  },
});
