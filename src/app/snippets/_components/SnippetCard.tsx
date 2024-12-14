"use client";

import { memo, useCallback, useState } from "react";
import { Snippet } from "@/types";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Clock, Trash2, User, AlertCircle } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import StarButton from "@/components/StarButton";
import { formatDistanceToNow } from "date-fns";

interface SnippetCardProps {
  /** The snippet data to display */
  snippet: Snippet;
  /** Optional callback when the snippet is deleted */
  onDelete?: (snippetId: string) => void;
}

function SnippetCardComponent({ snippet, onDelete }: SnippetCardProps) {
  const { user } = useUser();
  const deleteSnippet = useMutation(api.snippets.deleteSnippet);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = useCallback(async () => {
    if (!window.confirm("Are you sure you want to delete this snippet?")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteSnippet({ snippetId: snippet._id });
      toast.success("Snippet deleted successfully");
      onDelete?.(snippet._id);
    } catch (error) {
      console.error("Error deleting snippet:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete snippet";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteSnippet, snippet._id, onDelete]);

  const formattedDate = formatDistanceToNow(new Date(snippet._creationTime), { addSuffix: true });
  const isOwner = user?.id === snippet.userId;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        layout
        className="group relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <Link 
          href={`/snippets/${snippet._id}`} 
          className="h-full block focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-xl"
          aria-label={`View ${snippet.title} snippet in ${snippet.language}`}
        >
          <div
            className="relative h-full bg-[#1e1e2e]/80 backdrop-blur-sm rounded-xl 
              border border-[#313244]/50 hover:border-[#313244] 
              transition-all duration-300 overflow-hidden"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20 
                        group-hover:opacity-30 transition-all duration-500"
                      aria-hidden="true"
                    />
                    <div
                      className="relative p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 
                        group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-500"
                    >
                      <Image
                        src={`/${snippet.language}.png`}
                        alt=""
                        className="w-6 h-6 object-contain relative z-10"
                        width={24}
                        height={24}
                        priority
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span 
                      className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium"
                      role="badge"
                    >
                      {snippet.language}
                    </span>
                    <time 
                      dateTime={new Date(snippet._creationTime).toISOString()}
                      className="flex items-center gap-2 text-xs text-gray-500"
                    >
                      <Clock className="size-3" aria-hidden="true" />
                      {formattedDate}
                    </time>
                  </div>
                </div>
                <div
                  className="absolute top-5 right-5 z-10 flex gap-4 items-center"
                  onClick={(e) => e.preventDefault()}
                >
                  <StarButton snippetId={snippet._id} />

                  {isOwner && (
                    <div className="z-10" onClick={(e) => e.preventDefault()}>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200
                          ${
                            isDeleting
                              ? "bg-red-500/20 text-red-400 cursor-not-allowed"
                              : "bg-gray-500/10 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                          }
                        `}
                        aria-label={isDeleting ? "Deleting snippet..." : "Delete snippet"}
                      >
                        {isDeleting ? (
                          <div 
                            className="size-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"
                            role="status"
                            aria-label="Deleting"
                          />
                        ) : (
                          <Trash2 className="size-3.5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {snippet.title}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-gray-800/50">
                        <User className="size-3" aria-hidden="true" />
                      </div>
                      <span className="truncate max-w-[150px]" title={snippet.userName}>
                        {snippet.userName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative group/code">
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-purple-500/5 
                      rounded-lg opacity-0 group-hover/code:opacity-100 transition-all"
                    aria-hidden="true"
                  />
                  <pre 
                    className="relative bg-black/30 rounded-lg p-4 overflow-hidden text-sm text-gray-300 line-clamp-3 font-['Fira_Code',_'Cascadia_Code',_monospace]"
                  >
                    {snippet.code}
                  </pre>
                </div>
              </div>

              {error && (
                <div 
                  className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-sm text-red-400"
                  role="alert"
                >
                  <AlertCircle className="size-4 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}
            </div>
          </div>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}

// Memoize the component to prevent unnecessary re-renders
const SnippetCard = memo(SnippetCardComponent);
export default SnippetCard;
