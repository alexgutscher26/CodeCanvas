/* eslint-disable @typescript-eslint/no-unused-vars */

import { Template } from "@/types/templates";
import { Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CodePreviewProps {
  template: Template;
}

export function CodePreview({ template }: CodePreviewProps) {
  const [isCopying, setIsCopying] = useState(false);

  const copyCode = async () => {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(template.code);
      toast.success("Code copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy code");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Code Preview
        </h2>
        <button
          onClick={copyCode}
          disabled={isCopying}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md 
            text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 
            hover:bg-gray-200 dark:hover:bg-gray-600 
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200"
        >
          <Copy className="h-4 w-4 mr-2" />
          {isCopying ? "Copying..." : "Copy Code"}
        </button>
      </div>
      <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm text-gray-800 dark:text-gray-200">
          {template.code}
        </code>
      </pre>
    </div>
  );
}
