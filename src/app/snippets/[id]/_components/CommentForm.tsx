/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { CodeIcon, SendIcon } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import CommentContent from "./CommentContent";

interface CommentFormProps {
  onSubmit: (comment: string) => Promise<void>;
  isSubmitting: boolean;
  /**
   * Maximum length of the comment
   * @default 5000
   */
  maxLength?: number;
}

function CommentForm({ 
  isSubmitting, 
  onSubmit, 
  maxLength = 5000 
}: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle tab key for indentation
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newComment = comment.substring(0, start) + "  " + comment.substring(end);
      
      if (newComment.length <= maxLength) {
        setComment(newComment);
        // Set cursor position after indentation
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
          }
        });
      }
    }

    // Handle Ctrl/Cmd + Enter to submit
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [comment, maxLength]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedComment = comment.trim();
    if (!trimmedComment) {
      toast.error("Please enter a comment");
      return;
    }

    if (trimmedComment.length > maxLength) {
      toast.error(`Comment is too long (max ${maxLength} characters)`);
      return;
    }

    try {
      await onSubmit(trimmedComment);
      setComment("");
      setIsPreview(false);
      toast.success("Comment posted successfully!");
    } catch (error) {
      console.error("Failed to post comment:", error);
      toast.error("Failed to post comment. Please try again.");
    }
  };

  const togglePreview = useCallback(() => {
    setIsPreview((prev) => !prev);
    // Focus textarea when switching back to edit mode
    if (isPreview) {
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
  }, [isPreview]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      setComment(newValue);
    }
  }, [maxLength]);

  const remainingChars = maxLength - comment.length;
  const isOverLimit = remainingChars < 0;

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="bg-[#0a0a0f] rounded-xl border border-[#ffffff0a] overflow-hidden">
        {/* Comment form header */}
        <div className="flex items-center justify-between gap-2 px-4 pt-2">
          <span className="text-xs text-[#808086]">
            {remainingChars} characters remaining
          </span>
          <button
            type="button"
            onClick={togglePreview}
            className={`text-sm px-3 py-1 rounded-md transition-colors ${
              isPreview ? "bg-blue-500/10 text-blue-400" : "hover:bg-[#ffffff08] text-gray-400"
            }`}
            aria-pressed={isPreview}
          >
            {isPreview ? "Edit" : "Preview"}
          </button>
        </div>

        {/* Comment form body */}
        {isPreview ? (
          <div 
            className="min-h-[120px] p-4 text-[#e1e1e3]"
            aria-label="Comment preview"
          >
            <CommentContent content={comment} />
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={comment}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Add to the discussion... (Ctrl/Cmd + Enter to submit)"
            className="w-full bg-transparent border-0 text-[#e1e1e3] placeholder:text-[#808086] outline-none 
              resize-none min-h-[120px] p-4 font-mono text-sm"
            aria-label="Comment input"
            aria-invalid={isOverLimit}
            maxLength={maxLength}
          />
        )}

        {/* Comment Form Footer */}
        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-[#080809] border-t border-[#ffffff0a]">
          <div className="hidden sm:block text-xs text-[#808086] space-y-1">
            <div className="flex items-center gap-2">
              <CodeIcon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Format code with ```language</span>
            </div>
            <div className="text-[#808086]/60 pl-5">
              Tab key inserts spaces • Ctrl/Cmd + Enter to submit • Preview before posting
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !comment.trim() || isOverLimit}
            className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] text-white rounded-lg 
              hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed transition-all ml-auto
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={isSubmitting ? "Posting comment..." : "Post comment"}
          >
            {isSubmitting ? (
              <>
                <div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  aria-hidden="true"
                />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <SendIcon className="w-4 h-4" aria-hidden="true" />
                <span>Comment</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export default CommentForm;
