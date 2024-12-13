import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(), // clerkId
    email: v.string(),
    name: v.string(),
    isPro: v.boolean(),
    proSince: v.optional(v.number()),
    lemonSqueezyCustomerId: v.optional(v.string()),
    lemonSqueezyOrderId: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),

  codeExecutions: defineTable({
    userId: v.string(),
    language: v.string(),
    code: v.string(),
    output: v.optional(v.string()),
    error: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),

  snippets: defineTable({
    userId: v.string(),
    title: v.string(),
    language: v.string(),
    code: v.string(),
    userName: v.string(), // store user's name for easy access
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    difficulty: v.optional(v.union(v.literal("BEGINNER"), v.literal("INTERMEDIATE"), v.literal("ADVANCED"), v.literal("EXPERT"))),
    complexity: v.optional(v.float64()), // 1-5 scale
    version: v.optional(v.string()),
    downloads: v.optional(v.float64()),
    createdAt: v.optional(v.float64()), // timestamp
    updatedAt: v.optional(v.float64()), // timestamp
  }).index("by_user_id", ["userId"])
    .index("by_language", ["language"])
    .index("by_difficulty", ["difficulty"])
    .index("by_downloads", ["downloads"]),

  snippetVersions: defineTable({
    snippetId: v.id("snippets"),
    version: v.string(),
    code: v.string(),
    changelog: v.string(),
    createdAt: v.number(),
  }).index("by_snippet_id", ["snippetId"]),

  snippetComments: defineTable({
    snippetId: v.id("snippets"),
    userId: v.string(),
    userName: v.string(),
    content: v.string(), // This will store HTML content
    rating: v.number(), // 1-5 scale
    createdAt: v.number(),
  }).index("by_snippet_id", ["snippetId"])
    .index("by_user_id", ["userId"]),

  stars: defineTable({
    userId: v.string(),
    snippetId: v.id("snippets"),
  })
    .index("by_user_id", ["userId"])
    .index("by_snippet_id", ["snippetId"])
    .index("by_user_id_and_snippet_id", ["userId", "snippetId"]),

  favorites: defineTable({
    userId: v.string(),
    snippetId: v.id("snippets"),
    createdAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_snippet_id", ["snippetId"])
    .index("by_user_and_snippet", ["userId", "snippetId"]),

  marketplaceTemplates: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.string(),
    code: v.string(),
    language: v.string(),
    framework: v.string(),
    previewImage: v.string(),
    downloads: v.number(),
    userName: v.string(),
    difficulty: v.union(v.literal("BEGINNER"), v.literal("INTERMEDIATE"), v.literal("ADVANCED"), v.literal("EXPERT")),
    complexity: v.float64(),
    tags: v.array(v.string()),
    version: v.string(),
    createdAt: v.float64(),
    updatedAt: v.float64(),
    isPro: v.optional(v.boolean()),
    price: v.optional(v.float64()), // Temporary field for migration
    averageRating: v.optional(v.float64()),
  })
    .index("by_user_id", ["userId"])
    .index("by_language", ["language"])
    .index("by_framework", ["framework"])
    .index("by_difficulty", ["difficulty"])
    .index("by_downloads", ["downloads"]),

  templateRatings: defineTable({
    templateId: v.id("marketplaceTemplates"),
    userId: v.string(),
    userName: v.string(),
    rating: v.number(),
    review: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_template_id", ["templateId"])
    .index("by_user_and_template", ["userId", "templateId"]),

  templateComments: defineTable({
    templateId: v.id("marketplaceTemplates"),
    userId: v.string(),
    userName: v.string(),
    content: v.string(),
    parentId: v.optional(v.id("templateComments")), // For reply threads
    createdAt: v.number(),
    updatedAt: v.number(),
    isEdited: v.boolean(),
  })
    .index("by_template_id", ["templateId"])
    .index("by_user_id", ["userId"])
    .index("by_parent_id", ["parentId"]),

  templateFavorites: defineTable({
    userId: v.string(),
    templateId: v.id("marketplaceTemplates"),
    createdAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_template_id", ["templateId"])
    .index("by_user_and_template", ["userId", "templateId"]),

  newsletter_subscribers: defineTable({
    email: v.string(),
    subscribedAt: v.float64(), // timestamp
    status: v.union(v.literal("active"), v.literal("unsubscribed")),
  }).index("by_email", ["email"]),
});