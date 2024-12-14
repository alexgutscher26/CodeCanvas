"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CopyButtonProps {
  code: string;
  /**
   * Optional label for accessibility
   * @default "Copy code to clipboard"
   */
  label?: string;
}

function CopyButton({ code, label = "Copy code to clipboard" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const copyToClipboard = async () => {
    if (isLoading || copied) return;

    try {
      setIsLoading(true);
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy code:", error);
      toast.error("Failed to copy code to clipboard");
    } finally {
      setIsLoading(false);
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      type="button"
      disabled={isLoading || copied}
      className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 group
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
      {copied ? (
        <Check className="size-4 text-green-400 animate-in fade-in-0 zoom-in-0 duration-200" />
      ) : (
        <Copy 
          className={`size-4 text-gray-400 group-hover:text-gray-300 transition-colors
            ${isLoading ? "animate-pulse" : ""}`}
        />
      )}
    </button>
  );
}

export default CopyButton;
