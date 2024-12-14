"use client";

import { Trash2Icon, UserIcon, Loader2 } from "lucide-react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { memo } from "react";
import CommentContent from "./CommentContent";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  _id: Id<"snippetComments">;
  _creationTime: number;
  userId: string;
  userName: string;
  snippetId: Id<"snippets">;
  content: string;
}

interface CommentProps {
  comment: Comment;
  onDelete: (commentId: Id<"snippetComments">) => void;
  isDeleting: boolean;
  currentUserId?: string;
}

function CommentComponent({ comment, currentUserId, isDeleting, onDelete }: CommentProps) {
  const isOwner = comment.userId === currentUserId;
  const formattedDate = formatDistanceToNow(new Date(comment._creationTime), { addSuffix: true });
  
  return (
    <article 
      className="group animate-in fade-in-0 duration-200"
      aria-label={`Comment by ${comment.userName}`}
    >
      <div 
        className={`bg-[#0a0a0f] rounded-xl p-6 border transition-all duration-200
          ${isDeleting ? 'opacity-50 border-red-500/20' : 'border-[#ffffff0a] hover:border-[#ffffff14]'}`}
      >
        <header className="flex items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-full bg-[#ffffff08] flex items-center justify-center flex-shrink-0
                ring-2 ring-[#ffffff08] transition-all duration-200"
              aria-hidden="true"
            >
              <UserIcon className="w-4 h-4 text-[#808086]" />
            </div>
            <div className="min-w-0">
              <span 
                className="block text-[#e1e1e3] font-medium truncate"
                title={comment.userName}
              >
                {comment.userName}
              </span>
              <time 
                dateTime={new Date(comment._creationTime).toISOString()}
                className="block text-sm text-[#808086]"
              >
                {formattedDate}
              </time>
            </div>
          </div>

          {isOwner && (
            <button
              onClick={() => onDelete(comment._id)}
              disabled={isDeleting}
              className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 rounded-lg 
                transition-all duration-200 focus:opacity-100 focus:outline-none focus:ring-2 
                focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              title="Delete comment"
              aria-label="Delete comment"
              type="button"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
              ) : (
                <Trash2Icon 
                  className="w-4 h-4 text-red-400" 
                  aria-hidden="true"
                />
              )}
            </button>
          )}
        </header>

        <div className="prose prose-invert max-w-none">
          <CommentContent content={comment.content} />
        </div>
      </div>
    </article>
  );
}

// Memoize the component to prevent unnecessary re-renders
const Comment = memo(CommentComponent);
export default Comment;
