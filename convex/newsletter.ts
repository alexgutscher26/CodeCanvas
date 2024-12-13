import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const subscribe = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Check if email already exists
    const existingSubscriber = await ctx.db
      .query("newsletter_subscribers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingSubscriber) {
      if (existingSubscriber.status === "unsubscribed") {
        // Reactivate subscription
        await ctx.db.patch(existingSubscriber._id, {
          status: "active",
          subscribedAt: Date.now(),
        });
        return { success: true, reactivated: true };
      }
      throw new Error("Email already subscribed");
    }

    // Add new subscriber
    const id = await ctx.db.insert("newsletter_subscribers", {
      email,
      subscribedAt: Date.now(),
      status: "active",
    });

    return { success: true, id };
  },
});
