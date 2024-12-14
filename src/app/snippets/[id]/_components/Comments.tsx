"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useCallback, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import toast from "react-hot-toast";
import { MessageSquare } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import components
const Comment = dynamic(() => import("./Comment"));
const CommentForm = dynamic(() => import("./CommentForm"));

interface CommentsProps {
  snippetId: Id<"snippets">;
}

function Comments({ snippetId }: CommentsProps) {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  // Get comments
  const comments = useQuery(api.snippets.getComments, { snippetId }) || [];
  const addComment = useMutation(api.snippets.addComment);
  const deleteComment = useMutation(api.snippets.deleteComment);

  const handleSubmitComment = useCallback(async (content: string) => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment({ snippetId, content });
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [addComment, snippetId]);

  const handleDeleteComment = useCallback(async (commentId: Id<"snippetComments">) => {
    setDeletingCommentId(commentId);
    try {
      await deleteComment({ commentId });
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment. Please try again.");
    } finally {
      setDeletingCommentId(null);
    }
  }, [deleteComment]);

  return (
    <section 
      className="bg-[#121218] border border-[#ffffff0a] rounded-2xl overflow-hidden"
      aria-label="Comments section"
    >
      <div className="px-6 sm:px-8 py-6 border-b border-[#ffffff0a]">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5" aria-hidden="true" />
          Discussion ({comments.length})
        </h2>
      </div>

      <div className="p-6 sm:p-8">
        {user ? (
          <CommentForm onSubmit={handleSubmitComment} isSubmitting={isSubmitting} />
        ) : (
          <div 
            className="bg-[#0a0a0f] rounded-xl p-6 text-center mb-8 border border-[#ffffff0a]"
            role="alert"
          >
            <p className="text-[#808086] mb-4">Sign in to join the discussion</p>
            <SignInButton mode="modal">
              <button 
                className="px-6 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] 
                  transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                Sign In
              </button>
            </SignInButton>
          </div>
        )}

        <div className="space-y-6" role="feed" aria-label="Comments list">
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onDelete={handleDeleteComment}
              isDeleting={deletingCommentId === comment._id}
              currentUserId={user?.id}
            />
          ))}

          {comments.length === 0 && (
            <div className="text-center py-8 text-[#808086]">
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Comments;
