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
    description: v.string(),
    tags: v.array(v.string()),
    difficulty: v.union(v.literal("BEGINNER"), v.literal("INTERMEDIATE"), v.literal("ADVANCED"), v.literal("EXPERT")),
    complexity: v.number(), // 1-5 scale
    version: v.string(),
    downloads: v.number(),
    createdAt: v.number(), // timestamp
    updatedAt: v.number(), // timestamp
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
});
