/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../_constants";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  RotateCcwIcon,
  ShareIcon,
  TypeIcon,
  SaveIcon,
  CodeIcon,
  Settings,
  Download,
  Copy,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { EditorPanelSkeleton } from "./EditorPanelSkeleton";
import useMounted from "@/hooks/useMounted";
import ShareSnippetDialog from "./ShareSnippetDialog";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import type { OnMount } from "@monaco-editor/react";
import prettier from "prettier";
import parserBabel from "prettier/parser-babel";
import { getAICompletions } from "@/lib/ai";

// Custom Tooltip Component
const Tooltip = ({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) => {
  const [show, setShow] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      <AnimatePresence>
        {show && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 px-2 py-1 text-xs font-medium text-white 
              bg-gray-900 rounded-md shadow-lg -top-8 left-1/2 transform -translate-x-1/2
              whitespace-nowrap pointer-events-none"
          >
            {content}
            <div
              className="absolute w-2 h-2 bg-gray-900 transform rotate-45
                -bottom-1 left-1/2 -translate-x-1/2"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Dynamically import Editor and monaco with no SSR
const MonacoEditor = dynamic(() => import("@monaco-editor/react").then((mod) => {
  // Import monaco editor themes only on client side
  import("monaco-editor").then((monaco) => {
    defineMonacoThemes(monaco);
  });
  return mod.Editor;
}), {
  ssr: false,
  loading: () => <EditorPanelSkeleton />
});

// Update the marker interface
interface IEditorMarker extends monaco.editor.IMarkerData {
  severity: number;
}

interface Diagnostics {
  errors: number;
  warnings: number;
}

interface HeaderProps {
  language: string;
  fontSize: number;
  handleFontSizeChange: (size: number) => void;
  handleRefresh: () => void;
  setIsShareDialogOpen: (open: boolean) => void;
  isSaving?: boolean;
  diagnostics: Diagnostics;
  onCopyCode: () => void;
  onDownloadCode: () => void;
  onFormatCode: () => void;
}

interface FontSizeSliderProps {
  fontSize: number;
  handleFontSizeChange: (size: number) => void;
}

// Header component with enhanced functionality
const Header = ({
  language,
  fontSize,
  handleFontSizeChange,
  handleRefresh,
  setIsShareDialogOpen,
  isSaving,
  diagnostics,
  onCopyCode,
  onDownloadCode,
  onFormatCode,
}: HeaderProps) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5">
        <Image src={`/${language}.png`} alt="Logo" width={24} height={24} />
      </div>
      <div>
        <h2 className="text-sm font-medium text-white">Code Editor</h2>
      </div>
      <div className="flex items-center gap-2 pl-3 border-l border-white/10">
        {diagnostics.errors > 0 && (
          <span className="flex items-center gap-1 text-xs text-red-400">
            <XCircle className="size-3" />
            {diagnostics.errors} error(s)
          </span>
        )}
        {diagnostics.warnings > 0 && (
          <span className="flex items-center gap-1 text-xs text-yellow-400">
            <AlertCircle className="size-3" />
            {diagnostics.warnings} warning(s)
          </span>
        )}
      </div>
    </div>

    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 p-1 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5">
        <Tooltip content="Copy code">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCopyCode}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Copy className="size-4 text-gray-400" />
          </motion.button>
        </Tooltip>

        <Tooltip content="Download code">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDownloadCode}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Download className="size-4 text-gray-400" />
          </motion.button>
        </Tooltip>

        <Tooltip content="Format code">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onFormatCode}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Settings className="size-4 text-gray-400" />
          </motion.button>
        </Tooltip>
      </div>

      <FontSizeSlider
        fontSize={fontSize}
        handleFontSizeChange={handleFontSizeChange}
      />

      <Tooltip content="Reset code">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          className="p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors"
        >
          <RotateCcwIcon className="size-4 text-gray-400" />
        </motion.button>
      </Tooltip>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsShareDialogOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg 
          bg-gradient-to-r from-blue-500 to-blue-600 
          hover:from-blue-600 hover:to-blue-700
          transition-all duration-200 shadow-lg shadow-blue-500/20"
      >
        <ShareIcon className="size-4 text-white" />
        <span className="text-sm font-medium text-white">Share</span>
      </motion.button>

      <KeyboardShortcutsDropdown />
    </div>
  </div>
);

// Enhanced Font Size Slider
const FontSizeSlider = ({
  fontSize,
  handleFontSizeChange,
}: FontSizeSliderProps) => (
  <Tooltip content="Adjust font size">
    <div className="flex items-center gap-3 px-3 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5">
      <TypeIcon className="size-4 text-gray-400" />
      <div className="flex items-center gap-3">
        <input
          type="range"
          min="12"
          max="24"
          value={fontSize}
          onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
          className="w-20 h-1 bg-gray-600 rounded-lg cursor-pointer
            accent-blue-500 hover:accent-blue-400 transition-colors"
          aria-label="Font size slider"
        />
        <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">
          {fontSize}
        </span>
      </div>
    </div>
  </Tooltip>
);

// Enhanced Keyboard Shortcuts Dropdown
const KeyboardShortcutsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg
          bg-[#1e1e2e] hover:bg-[#2a2a3a] ring-1 ring-white/5
          text-sm text-gray-300 transition-colors"
      >
        <CodeIcon className="size-4" />
        <span>Shortcuts</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-[#1e1e2e] rounded-lg shadow-xl
              ring-1 ring-white/10 divide-y divide-white/10 z-50"
          >
            <div className="p-2 text-xs text-gray-400">Common shortcuts</div>
            <div className="p-2 space-y-1">
              {[
                { key: "Ctrl + S", action: "Save code" },
                { key: "Ctrl + F", action: "Find text" },
                { key: "Ctrl + H", action: "Replace text" },
                { key: "Ctrl + Z", action: "Undo" },
                { key: "Ctrl + Y", action: "Redo" },
                { key: "Alt + Up/Down", action: "Move line up/down" },
                { key: "Ctrl + /", action: "Toggle comment" },
                { key: "Ctrl + ]", action: "Indent line" },
                { key: "Ctrl + [", action: "Outdent line" },
              ].map(({ key, action }) => (
                <div
                  key={key}
                  className="flex items-center justify-between px-3 py-1.5 rounded-md
                    hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm text-gray-300">{action}</span>
                  <kbd className="px-2 py-0.5 text-xs font-medium text-gray-400
                    bg-black/20 rounded border border-white/10">{key}</kbd>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const updateCounts = (text: string): { words: number; chars: number } => {
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const chars = text.length;
  return { words, chars };
};

function EditorPanel() {
  const clerk = useClerk();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const { language, theme, fontSize, editor, setFontSize, setEditor } =
    useCodeEditorStore();

  const mounted = useMounted();
  const [isSaving, setIsSaving] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [diagnostics, setDiagnostics] = useState<Diagnostics>({
    errors: 0,
    warnings: 0,
  });

  const editorRef = useRef<HTMLDivElement | null>(null);

  const handleEditorMount: OnMount = async (
    editorInstance: monaco.editor.IStandaloneCodeEditor
  ) => {
    console.log("Editor mounting with language:", language);
    setEditor(editorInstance);
    editorInstance.focus();

    // Configure editor events
    editorInstance.onDidChangeModelContent(() => {
      const model = editorInstance.getModel();
      if (model) {
        const text = model.getValue();
        const { words, chars } = updateCounts(text);
      }
    });

    editorInstance.onDidChangeCursorPosition((e) => {
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column,
      });
    });

    // Configure AI-powered auto-completion
    monaco.languages.register({ id: language });

    const disposable = monaco.languages.registerCompletionItemProvider(language, {
      triggerCharacters: [".", " ", "(", "{", "[", '"', "'", "`"],
      async provideCompletionItems(model, position) {
        try {
          const wordInfo = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: wordInfo.startColumn,
            endColumn: wordInfo.endColumn,
          };

          // Get surrounding code for context
          const startLine = Math.max(1, position.lineNumber - 5);
          const endLine = Math.min(model.getLineCount(), position.lineNumber + 5);

          const precedingCode = model.getValueInRange({
            startLineNumber: startLine,
            endLineNumber: position.lineNumber - 1,
            startColumn: 1,
            endColumn: model.getLineMaxColumn(position.lineNumber - 1),
          });

          const followingCode = model.getValueInRange({
            startLineNumber: position.lineNumber + 1,
            endLineNumber: endLine,
            startColumn: 1,
            endColumn: model.getLineMaxColumn(endLine),
          });

          // Get AI suggestions
          const aiResponse = await getAICompletions({
            prefix: wordInfo.word,
            line: model.getLineContent(position.lineNumber),
            lineNumber: position.lineNumber,
            language,
            filePath: model.uri.toString(),
            precedingCode,
            followingCode,
          });

          // Convert suggestions to Monaco format
          const aiSuggestions = aiResponse.suggestions.map((item) => ({
            label: item.label,
            kind: item.kind as monaco.languages.CompletionItemKind,
            detail: item.detail,
            documentation: {
              value:
                typeof item.documentation === "string"
                  ? item.documentation
                  : item.documentation?.value || "",
            },
            insertText: item.insertText || item.label,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          }));

          // Add basic suggestions
          const basicSuggestions = [
            {
              label: "console.log",
              kind: monaco.languages.CompletionItemKind.Function,
              detail: "Log output to the console",
              documentation: { value: "Log output to the console" },
              insertText: "console.log($1);",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range,
            },
            // Add more basic suggestions here
          ];

          return {
            suggestions: [...aiSuggestions, ...basicSuggestions],
            incomplete: false,
          };
        } catch (error) {
          console.error("Error in completion provider:", error);
          return { suggestions: [] };
        }
      },
    });

    // Configure diagnostics
    const updateDiagnostics = () => {
      const markers = monaco.editor.getModelMarkers({ owner: language });
      const errors = markers.filter((m) => m.severity === 8).length;
      const warnings = markers.filter((m) => m.severity === 4).length;
      setDiagnostics({ errors, warnings });
    };

    editorInstance.onDidChangeModelDecorations(() => {
      updateDiagnostics();
    });

    // Clean up
    return () => {
      disposable.dispose();
    };
  };

  const debouncedCode = useDebounce(
    (editor as unknown as monaco.editor.IStandaloneCodeEditor)?.getValue() || "",
    1000
  );

  useEffect(() => {
    if (debouncedCode) {
      setIsSaving(true);
      localStorage.setItem(`editor-code-${language}`, debouncedCode);

      const timer = setTimeout(() => {
        setIsSaving(false);
        toast.success("Changes saved", {
          description: "Your code has been automatically saved",
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [debouncedCode, language]);

  useEffect(() => {
    const savedCode = localStorage.getItem(`editor-code-${language}`);
    const newCode = savedCode || LANGUAGE_CONFIG[language].defaultCode;
    if (editor) {
      (editor as unknown as monaco.editor.IStandaloneCodeEditor).setValue(
        newCode
      );
    }
  }, [language, editor]);

  useEffect(() => {
    const savedFontSize = localStorage.getItem("editor-font-size");
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
  }, [setFontSize]);

  const handleRefresh = useCallback(() => {
    const defaultCode = LANGUAGE_CONFIG[language].defaultCode;
    if (editor) {
      (editor as unknown as monaco.editor.IStandaloneCodeEditor).setValue(
        defaultCode
      );
    }
    localStorage.removeItem(`editor-code-${language}`);
  }, [editor, language]);

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      if (value) localStorage.setItem(`editor-code-${language}`, value);
    },
    [language]
  );

  const handleFontSizeChange = useCallback(
    (newSize: number) => {
      const size = Math.min(Math.max(newSize, 12), 24);
      setFontSize(size);
      localStorage.setItem("editor-font-size", size.toString());
    },
    [setFontSize]
  );

  const handleCopyCode = () => {
    navigator.clipboard.writeText(
      (editor as unknown as monaco.editor.IStandaloneCodeEditor).getValue()
    );
    toast.success("Code copied to clipboard");
  };

  const handleDownloadCode = () => {
    const code = (editor as unknown as monaco.editor.IStandaloneCodeEditor).getValue();
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${LANGUAGE_CONFIG[language].extension}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Code downloaded");
  };

  const handleFormatCode = async () => {
    const currentCode = (
      editor as unknown as monaco.editor.IStandaloneCodeEditor
    ).getValue();
    const formattedCode = await prettier.format(currentCode, {
      parser: "babel",
      plugins: [parserBabel],
    });
    (editor as unknown as monaco.editor.IStandaloneCodeEditor).setValue(
      formattedCode
    );
    toast.success("Code formatted");
  };

  // Only render the editor on the client side
  if (!mounted) {
    return <EditorPanelSkeleton />;
  }

  const currentLanguageObj =
    LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG["javascript"];

  return (
    <div className="relative">
      <div className="relative bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-6">
        <Header
          language={language}
          fontSize={fontSize}
          handleFontSizeChange={handleFontSizeChange}
          handleRefresh={handleRefresh}
          setIsShareDialogOpen={setIsShareDialogOpen}
          isSaving={isSaving}
          diagnostics={diagnostics}
          onCopyCode={handleCopyCode}
          onDownloadCode={handleDownloadCode}
          onFormatCode={handleFormatCode}
        />
        <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]">
          {clerk.loaded && (
            <MonacoEditor
              height="600px"
              defaultLanguage={currentLanguageObj.monacoLanguage}
              defaultValue={LANGUAGE_CONFIG[language].defaultCode}
              theme={theme}
              onChange={handleEditorChange}
              onMount={handleEditorMount}
              options={{
                fontSize: fontSize,
                fontFamily: "JetBrains Mono",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                glyphMargin: true,
                folding: true,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 3,
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                scrollbar: {
                  verticalScrollbarSize: 12,
                  horizontalScrollbarSize: 12,
                  verticalSliderSize: 12,
                  horizontalSliderSize: 12,
                  verticalHasArrows: false,
                  horizontalHasArrows: false,
                  useShadows: true,
                },
              }}
            />
          )}
          {!clerk.loaded && <EditorPanelSkeleton />}
        </div>
        <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>
              Line {cursorPosition.line}, Column {cursorPosition.column}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {diagnostics.errors > 0 && (
              <span className="text-red-400">{diagnostics.errors} errors</span>
            )}
            {diagnostics.warnings > 0 && (
              <span className="text-yellow-400">
                {diagnostics.warnings} warnings
              </span>
            )}
          </div>
        </div>
      </div>
      {isShareDialogOpen && (
        <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />
      )}
    </div>
  );
}

export default EditorPanel;
