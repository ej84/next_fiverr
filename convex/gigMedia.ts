import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// This is how you upload the saved image data to the database
export const sendImage = mutation({
  args: {
    storageId: v.id("_storage"),
    format: v.string(),
    gigId: v.id("gigs"),
  },
  handler: async (ctx, args) => {
    // Checks how many images are already uploaded
    const gigMedia = await ctx.db
      .query("gigMedia")
      .withIndex("by_gigId", (q) => q.eq("gigId", args.gigId))
      .collect();

    if (gigMedia.length >= 5) {
      throw new Error(
        "You can upload up to 5 media files. Please delete a media file before uploading a new one."
      );
    }

    await ctx.db.insert("gigMedia", {
      storageId: args.storageId,
      format: args.format,
      gigId: args.gigId,
    });
  },
});
