"use client";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { AlertTriangle, CheckCircle, Clock, Copy, Terminal, RotateCcw, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RunningCodeSkeleton from "./RunningCodeSkeleton";
import { cn } from "@/lib/utils";

function OutputPanel() {
  const { output, error, isRunning } = useCodeEditorStore();
  const clearOutput = useCodeEditorStore((state) => state.clearOutput);
  const [isCopied, setIsCopied] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const hasContent = error || output;

  const handleCopy = useCallback(async () => {
    if (!hasContent) return;
    try {
      await navigator.clipboard.writeText(error || output);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [error, output, hasContent]);

  const handleClear = useCallback(() => {
    if (clearOutput) {
      clearOutput();
    }
  }, [clearOutput]);

  // Auto-scroll effect
  useEffect(() => {
    if (autoScroll && hasContent) {
      const outputArea = document.querySelector('.output-area');
      if (outputArea) {
        outputArea.scrollTop = outputArea.scrollHeight;
      }
    }
  }, [output, error, autoScroll, hasContent]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-[#181825] rounded-xl p-4 ring-1 ring-gray-800/50 transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#1e1e2e] ring-1 ring-gray-800/50"
          >
            <Terminal className="w-4 h-4 text-blue-400" />
          </motion.div>
          <span className="text-sm font-medium text-gray-300">Output</span>
          {isRunning && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              Running...
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-gray-300 bg-[#1e1e2e]",
              "rounded-lg ring-1 ring-gray-800/50 hover:ring-gray-700/50 transition-all",
              autoScroll && "text-blue-400 hover:text-blue-300"
            )}
          >
            Auto-scroll
          </button>

          {hasContent && (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClear}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-gray-300 bg-[#1e1e2e] 
                rounded-lg ring-1 ring-gray-800/50 hover:ring-gray-700/50 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-gray-300 bg-[#1e1e2e] 
                rounded-lg ring-1 ring-gray-800/50 hover:ring-gray-700/50 transition-all"
              >
                {isCopied ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Output Area */}
      <motion.div 
        layout
        className="relative"
      >
        <div
          className="output-area relative bg-[#1e1e2e]/50 backdrop-blur-sm border border-[#313244] 
          rounded-xl p-4 h-[600px] overflow-auto font-mono text-sm scrollbar-thin scrollbar-thumb-gray-700 
          scrollbar-track-transparent"
        >
          <AnimatePresence mode="wait">
            {isRunning ? (
              <motion.div
                key="running"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <RunningCodeSkeleton />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-3 text-red-400"
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <div className="font-medium">Execution Error</div>
                  <pre className="whitespace-pre-wrap text-red-400/80 break-words">{error}</pre>
                </div>
              </motion.div>
            ) : output ? (
              <motion.div
                key="output"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 text-emerald-400 mb-3">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Execution Successful</span>
                </div>
                <pre className="whitespace-pre-wrap text-gray-300 break-words">{output}</pre>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-gray-500"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800/50 ring-1 ring-gray-700/50 mb-4"
                >
                  <Clock className="w-6 h-6" />
                </motion.div>
                <p className="text-center">Run your code to see the output here...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default OutputPanel;
