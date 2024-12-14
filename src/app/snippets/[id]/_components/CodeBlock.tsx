"use client";

import { memo, useMemo } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import CopyButton from "./CopyButton";
import Image from "next/image";

interface CodeBlockProps {
  /**
   * The programming language for syntax highlighting
   * @default "plaintext"
   */
  language?: string;
  /**
   * The code to display
   */
  code: string;
  /**
   * Whether to show line numbers
   * @default true
   */
  showLineNumbers?: boolean;
  /**
   * Whether to wrap long lines
   * @default true
   */
  wrapLines?: boolean;
}

function CodeBlockComponent({
  language = "plaintext",
  code,
  showLineNumbers = true,
  wrapLines = true,
}: CodeBlockProps) {
  // Memoize the trimmed code to prevent unnecessary recalculations
  const trimmedCode = useMemo(() => {
    try {
      return code
        .split("\n")
        .map((line) => line.trimEnd())
        .join("\n");
    } catch (error) {
      console.error("Error processing code:", error);
      return code;
    }
  }, [code]);

  // Memoize syntax highlighter style customizations
  const customStyle = useMemo(
    () => ({
      padding: "1rem",
      background: "transparent",
      margin: 0,
      fontSize: "0.875rem",
      lineHeight: "1.5",
      fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
    }),
    []
  );

  return (
    <div 
      className="my-4 bg-[#0a0a0f] rounded-lg overflow-hidden border border-[#ffffff0a] 
        shadow-lg animate-in fade-in-0 duration-200"
      role="region"
      aria-label={`Code block in ${language}`}
    >
      {/* Header bar showing language and copy button */}
      <div 
        className="flex items-center justify-between px-4 py-2 bg-[#ffffff08] border-b border-[#ffffff0a]"
        aria-label="Code block header"
      >
        {/* Language indicator with icon */}
        <div className="flex items-center gap-2">
          <div className="relative size-4">
            <Image
              src={`/${language}.png`}
              alt=""
              className="object-contain"
              fill
              sizes="16px"
              priority
            />
          </div>
          <span className="text-sm text-gray-400 font-medium">
            {language}
          </span>
        </div>

        {/* Button to copy code to clipboard */}
        <CopyButton 
          code={trimmedCode} 
          label={`Copy ${language} code to clipboard`}
        />
      </div>

      {/* Code block with syntax highlighting */}
      <div 
        className="relative overflow-auto max-h-[600px] scrollbar-thin scrollbar-thumb-[#ffffff14] 
          scrollbar-track-transparent hover:scrollbar-thumb-[#ffffff20]"
      >
        <SyntaxHighlighter
          language={language}
          style={atomOneDark}
          customStyle={customStyle}
          showLineNumbers={showLineNumbers}
          wrapLines={wrapLines}
          wrapLongLines={wrapLines}
          aria-label={`${language} code`}
          PreTag="div"
          CodeTag="code"
          lineNumberStyle={{
            minWidth: "2.5em",
            paddingRight: "1em",
            textAlign: "right",
            userSelect: "none",
            color: "#4a5568",
          }}
        >
          {trimmedCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
const CodeBlock = memo(CodeBlockComponent);
export default CodeBlock;
