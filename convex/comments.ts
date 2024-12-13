import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addComment = mutation({
  args: {
    templateId: v.id("marketplaceTemplates"),
    content: v.string(),
    parentId: v.optional(v.id("templateComments")),
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

    // If this is a reply, verify parent comment exists
    if (args.parentId) {
      const parentComment = await ctx.db.get(args.parentId);
      if (!parentComment) throw new Error("Parent comment not found");
    }

    const now = Date.now();

    const commentId = await ctx.db.insert("templateComments", {
      templateId: args.templateId,
      userId: user.userId,
      userName: user.name,
      content: args.content,
      parentId: args.parentId,
      createdAt: now,
      updatedAt: now,
      isEdited: false,
    });

    return commentId;
  },
});

export const editComment = mutation({
  args: {
    commentId: v.id("templateComments"),
    content: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error("Comment not found");
    if (comment.userId !== identity.subject) throw new Error("Not authorized");

    await ctx.db.patch(args.commentId, {
      content: args.content,
      updatedAt: Date.now(),
      isEdited: true,
    });

    return { success: true };
  },
});

export const deleteComment = mutation({
  args: {
    commentId: v.id("templateComments"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error("Comment not found");
    if (comment.userId !== identity.subject) throw new Error("Not authorized");

    await ctx.db.delete(args.commentId);

    return { success: true };
  },
});

export const getComments = query({
  args: {
    templateId: v.id("marketplaceTemplates"),
    parentId: v.optional(v.id("templateComments")),
  },
  async handler(ctx, args) {
    const comments = await ctx.db
      .query("templateComments")
      .withIndex("by_template_id", (q) => q.eq("templateId", args.templateId))
      .filter((q) => 
        args.parentId 
          ? q.eq(q.field("parentId"), args.parentId)
          : q.eq(q.field("parentId"), undefined)
      )
      .order("desc")
      .collect();

    // For top-level comments, fetch their replies
    if (!args.parentId) {
      const commentsWithReplies = await Promise.all(
        comments.map(async (comment) => {
          const replies = await ctx.db
            .query("templateComments")
            .withIndex("by_parent_id", (q) => q.eq("parentId", comment._id))
            .order("asc")
            .collect();

          return {
            ...comment,
            replies,
          };
        })
      );

      return commentsWithReplies;
    }

    return comments;
  },
});
