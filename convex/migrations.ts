/* eslint-disable @typescript-eslint/no-unused-vars */
import { mutation } from "./_generated/server";

export const migrateSnippets = mutation({
  handler: async (ctx) => {
    const snippets = await ctx.db.query("snippets").collect();
    
    for (const snippet of snippets) {
      await ctx.db.patch(snippet._id, {
        complexity: 1.0,
        createdAt: snippet.createdAt || Date.now(),
        description: snippet.description || "",
        difficulty: snippet.difficulty || "BEGINNER",
        downloads: snippet.downloads || 0.0,
        tags: snippet.tags || [],
        updatedAt: snippet.updatedAt || Date.now(),
        version: snippet.version || "1.0.0"
      });
    }
    
    return { success: true, migratedCount: snippets.length };
  },
});

export const updateTemplatesWithIsPro = mutation({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db.query("marketplaceTemplates").collect();
    
    for (const template of templates) {
      if (template.isPro === undefined) {
        await ctx.db.patch(template._id, {
          isPro: false // Set default value for existing templates
        });
      }
    }
    
    return { success: true, migratedCount: templates.length };
  },
});

export const removeTemplatePrice = mutation({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db.query("marketplaceTemplates").collect();

    for (const template of templates) {
      // Set price to undefined to remove it
      await ctx.db.patch(template._id, {
        price: undefined
      });
    }
    
    return { success: true, migratedCount: templates.length };
  },
});