import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const rateTemplate = mutation({
  args: {
    templateId: v.id("marketplaceTemplates"),
    rating: v.number(),
    review: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    const template = await ctx.db.get(args.templateId);
    if (!template) throw new Error("Template not found");

    // Check if user has already rated this template
    const existingRating = await ctx.db
      .query("templateRatings")
      .withIndex("by_user_and_template", (q) =>
        q.eq("userId", user.userId).eq("templateId", args.templateId)
      )
      .first();

    const now = Date.now();

    if (existingRating) {
      // Update existing rating
      await ctx.db.patch(existingRating._id, {
        rating: args.rating,
        review: args.review,
        updatedAt: now,
      });
    } else {
      // Create new rating
      await ctx.db.insert("templateRatings", {
        templateId: args.templateId,
        userId: user.userId,
        userName: user.name,
        rating: args.rating,
        review: args.review,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Update template's average rating
    const allRatings = await ctx.db
      .query("templateRatings")
      .withIndex("by_template_id", (q) => q.eq("templateId", args.templateId))
      .collect();

    const averageRating =
      allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    await ctx.db.patch(args.templateId, {
      averageRating: Math.round(averageRating * 10) / 10,
    });

    return { success: true };
  },
});

export const getTemplateRatings = query({
  args: {
    templateId: v.id("marketplaceTemplates"),
    limit: v.optional(v.number()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    
    const ratings = await ctx.db
      .query("templateRatings")
      .withIndex("by_template_id", (q) => q.eq("templateId", args.templateId))
      .order("desc")
      .collect();

    // Get user's rating if they're logged in
    let userRating = null;
    if (identity) {
      userRating = await ctx.db
        .query("templateRatings")
        .withIndex("by_user_and_template", (q) =>
          q.eq("userId", identity.subject).eq("templateId", args.templateId)
        )
        .first();
    }

    return {
      ratings: ratings.slice(0, args.limit ?? ratings.length),
      userRating,
    };
  },
});
