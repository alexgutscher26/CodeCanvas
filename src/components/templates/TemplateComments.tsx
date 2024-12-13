/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { MessageCircle, Send, Edit2, Trash2, Reply, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/UXEnhancements";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

interface Props {
  templateId: Id<"marketplaceTemplates">;
}

interface Comment {
  _id: Id<"templateComments">;
  userId: string;
  userName: string;
  content: string;
  parentId?: Id<"templateComments">;
  createdAt: number;
  updatedAt: number;
  isEdited: boolean;
}

export default function TemplateComments({ templateId }: Props) {
  const { isSignedIn } = useAuth();
  const [comment, setComment] = useState("");
  const [editingComment, setEditingComment] = useState<Id<"templateComments"> | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<Id<"templateComments"> | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addComment = useMutation(api.comments.addComment);
  const editComment = useMutation(api.comments.editComment);
  const deleteComment = useMutation(api.comments.deleteComment);
  const commentsQuery = useQuery(api.comments.getComments, {
    templateId,
  });

  if (!commentsQuery) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  const comments = commentsQuery;

  const handleSubmitComment = async () => {
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      setIsSubmitting(true);
      await addComment({
        templateId,
        content: comment.trim(),
        parentId: replyingTo,
      });
      setComment("");
      setReplyingTo(null);
      toast.success("Comment added successfully!");
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: Id<"templateComments">) => {
    if (!editedContent.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      setIsSubmitting(true);
      await editComment({
        commentId,
        content: editedContent.trim(),
      });
      setEditingComment(null);
      setEditedContent("");
      toast.success("Comment updated successfully!");
    } catch (error) {
      toast.error("Failed to update comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: Id<"templateComments">) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await deleteComment({ commentId });
      toast.success("Comment deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  const getCommentResponses = (parentId: Id<"templateComments">) => {
    return comments.filter((c) => c.parentId === parentId);
  };

  const CommentComponent = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const responses = getCommentResponses(comment._id);
    const isEditing = editingComment === comment._id;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`${
          isReply ? "ml-8 mt-4" : "border-b border-[#ffffff0a] pb-6 mb-6 last:border-0 last:mb-0 last:pb-0"
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium flex-shrink-0">
            {comment.userName[0].toUpperCase()}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-200">{comment.userName}</span>
                <span className="text-sm text-gray-400 ml-2">
                  {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </span>
                {comment.isEdited && (
                  <span className="text-xs text-gray-500 ml-2">(edited)</span>
                )}
              </div>
              <div className="relative group">
                <button className="p-1 rounded-lg hover:bg-[#ffffff0a] transition-colors">
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-32 bg-[#1a1a24] rounded-lg shadow-lg border border-[#ffffff0a] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <button
                    onClick={() => {
                      setEditingComment(comment._id);
                      setEditedContent(comment.content);
                    }}
                    className="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-[#ffffff0a] transition-colors flex items-center gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="w-full px-4 py-2 text-sm text-left text-red-400 hover:bg-[#ffffff0a] transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0a0a0f] text-gray-100 rounded-lg border border-[#ffffff0a] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent resize-none h-24 placeholder:text-gray-500"
                  placeholder="Edit your comment..."
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditComment(comment._id)}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium flex items-center gap-2"
                  >
                    {isSubmitting ? <LoadingSpinner /> : "Save Changes"}
                  </button>
                  <button
                    onClick={() => {
                      setEditingComment(null);
                      setEditedContent("");
                    }}
                    className="px-4 py-2 bg-[#ffffff0a] text-gray-300 rounded-lg hover:bg-[#ffffff15] transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-300 leading-relaxed">{comment.content}</p>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => {
                      setReplyingTo(comment._id);
                      setReplyContent(`@${comment.userName} `);
                    }}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <Reply className="h-4 w-4" />
                    Reply
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {responses.length > 0 && (
          <div className="mt-4 space-y-4">
            {responses.map((response) => (
              <CommentComponent key={response._id} comment={response} isReply />
            ))}
          </div>
        )}

        {replyingTo === comment._id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 ml-14"
          >
            <div className="space-y-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a0f] text-gray-100 rounded-lg border border-[#ffffff0a] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent resize-none h-24 placeholder:text-gray-500"
                placeholder="Write your reply..."
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setComment(replyContent);
                    handleSubmitComment();
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium flex items-center gap-2"
                >
                  {isSubmitting ? <LoadingSpinner /> : "Post Reply"}
                </button>
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent("");
                  }}
                  className="px-4 py-2 bg-[#ffffff0a] text-gray-300 rounded-lg hover:bg-[#ffffff15] transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-[#1a1a24] to-[#121218] rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Discussion
        </h3>

        {isSignedIn ? (
          <div className="space-y-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-3 bg-[#0a0a0f] text-gray-100 rounded-lg border border-[#ffffff0a] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent resize-none h-32 placeholder:text-gray-500"
            />
            <button
              onClick={handleSubmitComment}
              disabled={!comment.trim() || isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center gap-2"
            >
              {isSubmitting ? (
                <LoadingSpinner />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Post Comment
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="bg-[#0a0a0f]/50 rounded-lg p-4 text-center">
            <p className="text-gray-400">
              Please sign in to join the discussion
            </p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {comments
            .filter((c) => !c.parentId)
            .map((comment) => (
              <CommentComponent key={comment._id} comment={comment} />
            ))}
        </AnimatePresence>

        {comments.length === 0 && (
          <div className="bg-[#1a1a24] rounded-xl p-8 text-center border border-[#ffffff0a]">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}
