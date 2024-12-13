import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Add a template to favorites
export const addToFavorites = mutation({
  args: {
    templateId: v.id("marketplaceTemplates"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const template = await ctx.db.get(args.templateId);
    if (!template) throw new Error("Template not found");

    const existingFavorite = await ctx.db
      .query("templateFavorites")
      .withIndex("by_user_and_template", (q) =>
        q.eq("userId", identity.subject).eq("templateId", args.templateId)
      )
      .first();

    if (existingFavorite) {
      throw new Error("Template already in favorites");
    }

    await ctx.db.insert("templateFavorites", {
      userId: identity.subject,
      templateId: args.templateId,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Remove a template from favorites
export const removeFromFavorites = mutation({
  args: {
    templateId: v.id("marketplaceTemplates"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const favorite = await ctx.db
      .query("templateFavorites")
      .withIndex("by_user_and_template", (q) =>
        q.eq("userId", identity.subject).eq("templateId", args.templateId)
      )
      .first();

    if (!favorite) {
      throw new Error("Template not in favorites");
    }

    await ctx.db.delete(favorite._id);
    return { success: true };
  },
});

// Get user's favorite templates
export const getFavoriteTemplates = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const favorites = await ctx.db
      .query("templateFavorites")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .collect();

    const templates = await Promise.all(
      favorites.map((fav) => ctx.db.get(fav.templateId))
    );

    return templates.filter(Boolean); // Remove any null values
  },
});

// Check if a template is favorited by the current user
export const isTemplateFavorited = query({
  args: {
    templateId: v.id("marketplaceTemplates"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const favorite = await ctx.db
      .query("templateFavorites")
      .withIndex("by_user_and_template", (q) =>
        q.eq("userId", identity.subject).eq("templateId", args.templateId)
      )
      .first();

    return !!favorite;
  },
});
