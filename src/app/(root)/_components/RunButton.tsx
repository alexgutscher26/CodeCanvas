"use client";

import { getExecutionResult, useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Play } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RunButtonProps {
  className?: string;
}

function RunButton({ className }: RunButtonProps) {
  const { user } = useUser();
  const { runCode, language, isRunning, getCode } = useCodeEditorStore();
  const saveExecution = useMutation(api.codeExecutions.saveExecution);

  async function handleRun() {
    const code = getCode();
    if (!code?.trim()) {
      toast.error("Please enter some code first", {
        className: "bg-[#1e1e2e] border border-[#313244] text-white",
      });
      return;
    }

    // Show loading toast
    const toastId = toast.loading("Running code...", {
      className: "bg-[#1e1e2e] border border-[#313244] text-white",
    });

    try {
      await runCode();
      const result = getExecutionResult();

      if (!result) {
        throw new Error("Failed to get execution result");
      }

      // Save execution if user is logged in
      if (user) {
        await saveExecution({
          language,
          code: result.code,
          output: result.output || undefined,
          error: result.error || undefined,
        });
      }

      // Show success or error toast based on execution result
      if (result.error) {
        toast.error("Code execution failed", {
          id: toastId,
          description: result.error.slice(0, 100) + (result.error.length > 100 ? "..." : ""),
          className: "bg-[#1e1e2e] border border-[#313244] text-white",
        });
      } else {
        toast.success("Code executed successfully", {
          id: toastId,
          className: "bg-[#1e1e2e] border border-[#313244] text-white",
        });
      }
    } catch (error) {
      console.error("Error running code:", error);
      toast.error("Failed to run code", {
        id: toastId,
        description: error instanceof Error ? error.message : "Unknown error occurred",
        className: "bg-[#1e1e2e] border border-[#313244] text-white",
      });
    }
  }

  return (
    <motion.button
      onClick={handleRun}
      disabled={isRunning}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative inline-flex items-center gap-2.5 px-5 py-2.5",
        "disabled:cursor-not-allowed focus:outline-none",
        "rounded-xl overflow-hidden",
        className
      )}
    >
      {/* Background with gradient and animations */}
      <motion.div
        className={cn(
          "absolute inset-0 bg-gradient-to-r",
          isRunning
            ? "from-blue-600/80 to-blue-500/80"
            : "from-blue-600 to-blue-500",
          "transition-opacity duration-200"
        )}
        initial={false}
        animate={{
          opacity: isRunning ? 0.9 : 1,
        }}
      />

      {/* Hover effect */}
      <motion.div
        className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 
        transition-opacity duration-200"
      />

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isRunning ? "running" : "idle"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="relative flex items-center gap-2.5"
        >
          {isRunning ? (
            <>
              <div className="relative flex items-center justify-center w-4 h-4">
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
              <span className="text-sm font-medium text-white">
                Executing...
              </span>
            </>
          ) : (
            <>
              <motion.div
                className="relative flex items-center justify-center w-4 h-4"
                whileHover={{ scale: 1.1 }}
              >
                <Play className="w-4 h-4 text-white" />
              </motion.div>
              <span className="text-sm font-medium text-white">
                Run Code
              </span>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}

export default RunButton;
