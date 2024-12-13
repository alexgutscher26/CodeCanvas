import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useMutation } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";
import { cn } from "@/lib/utils";

interface ShareSnippetDialogProps {
  onClose: () => void;
}

function ShareSnippetDialog({ onClose }: ShareSnippetDialogProps) {
  const [title, setTitle] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const { language, getCode } = useCodeEditorStore();
  const createSnippet = useMutation(api.snippets.createSnippet);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Keyboard shortcuts
  useHotkeys('esc', onClose, { enabled: true });

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate title
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      toast.error("Please enter a title", {
        duration: 3000,
        className: "bg-[#1e1e2e] border border-[#313244] text-white",
      });
      inputRef.current?.focus();
      return;
    }

    setIsSharing(true);
    // Initialize toastId with loading state
    const toastId = toast.loading("Sharing snippet...", {
      className: "bg-[#1e1e2e] border border-[#313244] text-white",
    });

    try {
      // Get and validate code
      const code = getCode();
      if (!code?.trim()) {
        throw new Error("Code editor is empty");
      }

      if (code.length > 50000) {
        throw new Error("Code is too long (max 50,000 characters)");
      }

      // Create snippet
      await createSnippet({ 
        title: trimmedTitle, 
        language, 
        code: code.trim() 
      });

      // Success toast
      toast.success("Snippet shared successfully!", {
        id: toastId,
        duration: 3000,
        className: "bg-[#1e1e2e] border border-[#313244] text-white",
      });

      // Reset and close
      setTitle("");
      onClose();

    } catch (error) {
      // Handle specific error types
      let errorMessage = "Failed to share snippet";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      // Error toast
      toast.error(errorMessage, {
        id: toastId,
        duration: 4000,
        className: "bg-[#1e1e2e] border border-[#313244] text-white",
      });

      console.error("Error sharing snippet:", error);
      inputRef.current?.focus();
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
      >
        <motion.div
          ref={dialogRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className={cn(
            "bg-[#1e1e2e] rounded-lg p-6 w-full max-w-md",
            "border border-[#313244] shadow-xl",
            "focus-within:ring-2 focus-within:ring-blue-500/40"
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <motion.h2 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-xl font-semibold text-white"
            >
              Share Snippet
            </motion.h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              disabled={isSharing}
              className={cn(
                "text-gray-400 p-1 rounded-full",
                "hover:text-gray-300 hover:bg-white/5 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/40",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleShare}
            className="space-y-6"
          >
            <div>
              <label 
                htmlFor="title" 
                className="block text-sm font-medium text-gray-400 mb-2"
              >
                Title
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={cn(
                    "w-full px-3 py-2 bg-[#181825] border border-[#313244] rounded-lg",
                    "text-white placeholder-gray-500 transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  placeholder="Enter a descriptive title"
                  required
                  disabled={isSharing}
                  maxLength={100}
                  aria-label="Snippet title"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                  {title.length}/100
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSharing}
                className={cn(
                  "px-4 py-2 text-gray-400 rounded-lg",
                  "hover:text-gray-300 hover:bg-white/5 transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/40",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSharing || !title.trim()}
                className={cn(
                  "px-4 py-2 bg-blue-500 text-white rounded-lg",
                  "hover:bg-blue-600 transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "flex items-center gap-2"
                )}
              >
                {isSharing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sharing...</span>
                  </>
                ) : (
                  <span>Share</span>
                )}
              </button>
            </div>
          </motion.form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ShareSnippetDialog;
