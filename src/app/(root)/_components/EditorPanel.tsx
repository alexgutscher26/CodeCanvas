/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../_constants";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  RotateCcwIcon,
  ShareIcon,
  TypeIcon,
  SaveIcon,
  CodeIcon,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { EditorPanelSkeleton } from "./EditorPanelSkeleton";
import useMounted from "@/hooks/useMounted";
import ShareSnippetDialog from "./ShareSnippetDialog";
import * as monaco from "monaco-editor";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import type { OnMount } from "@monaco-editor/react";
import prettier from "prettier";
import parserBabel from "prettier/parser-babel";
import { getAICompletions } from "@/lib/ai";


// Update the marker interface
interface IEditorMarker extends monaco.editor.IMarkerData {
  severity: number;
}

// Dynamically import Editor with no SSR
const Editor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.Editor),
  { ssr: false }
);

// Add these interfaces at the top of the file
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
  wordCount?: number;
  characterCount?: number;
  cursorPosition?: {
    line: number;
    column: number;
  };
  diagnostics: Diagnostics;
}

interface FontSizeSliderProps {
  fontSize: number;
  handleFontSizeChange: (size: number) => void;
}

// Subcomponent for Header
const Header = ({
  language,
  fontSize,
  handleFontSizeChange,
  handleRefresh,
  setIsShareDialogOpen,
  isSaving,
  diagnostics,
}: HeaderProps) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5">
        <Image src={`/${language}.png`} alt="Logo" width={24} height={24} />
      </div>
      <div>
        <h2 className="text-sm font-medium text-white">Code Editor</h2>
        <p className="text-xs text-gray-500">Write and execute your code</p>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        {isSaving && (
          <>
            <span>|</span>
            <span className="flex items-center gap-1">
              <SaveIcon className="size-3 animate-pulse" />
              Saving...
            </span>
          </>
        )}
        {diagnostics.errors > 0 && (
          <span className="text-red-500">{diagnostics.errors} error(s)</span>
        )}
        {diagnostics.warnings > 0 && (
          <span className="text-yellow-500">
            {diagnostics.warnings} warning(s)
          </span>
        )}
      </div>
    </div>
    <div className="flex items-center gap-3">
      <FontSizeSlider
        fontSize={fontSize}
        handleFontSizeChange={handleFontSizeChange}
      />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleRefresh}
        className="p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors"
        aria-label="Reset to default code"
      >
        <RotateCcwIcon className="size-4 text-gray-400" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsShareDialogOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-gradient-to-r
         from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity"
        aria-label="Share code snippet"
      >
        <ShareIcon className="size-4 text-white" />
        <span className="text-sm font-medium text-white">Share</span>
      </motion.button>
      <KeyboardShortcutsDropdown />
    </div>
  </div>
);

// Subcomponent for Font Size Slider
const FontSizeSlider = ({
  fontSize,
  handleFontSizeChange,
}: FontSizeSliderProps) => (
  <div className="flex items-center gap-3 px-3 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5">
    <TypeIcon className="size-4 text-gray-400" />
    <div className="flex items-center gap-3">
      <input
        type="range"
        min="12"
        max="24"
        value={fontSize}
        onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
        className="w-20 h-1 bg-gray-600 rounded-lg cursor-pointer"
        aria-label="Font size slider"
      />
      <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">
        {fontSize}
      </span>
    </div>
  </div>
);

// Add this helper function
const updateCounts = (text: string) => {
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const chars = text.length;
  return { words, chars };
};


// Add a new component to display keyboard shortcuts as a dropdown
const KeyboardShortcutsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="text-white bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2"
      >
        Shortcuts
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <ul className="py-1 text-gray-700">
            <li className="px-4 py-2 hover:bg-gray-100">
              <strong>Ctrl + S</strong>: Save code
            </li>
            <li className="px-4 py-2 hover:bg-gray-100">
              <strong>Ctrl + F</strong>: Find text
            </li>
            <li className="px-4 py-2 hover:bg-gray-100">
              <strong>Ctrl + R</strong>: Replace text
            </li>
            <li className="px-4 py-2 hover:bg-gray-100">
              <strong>Ctrl + Z</strong>: Undo
            </li>
            <li className="px-4 py-2 hover:bg-gray-100">
              <strong>Ctrl + Y</strong>: Redo
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

function EditorPanel() {
  const clerk = useClerk();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const { language, theme, fontSize, editor, setFontSize, setEditor } =
    useCodeEditorStore();

  const mounted = useMounted();
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [diagnostics, setDiagnostics] = useState<Diagnostics>({
    errors: 0,
    warnings: 0,
  });

  const editorRef = useRef<HTMLDivElement | null>(null);

  const handleEditorMount: OnMount = async (
    editorInstance: monaco.editor.IStandaloneCodeEditor
  ) => {
    console.log('Editor mounting with language:', language);
    setEditor(editorInstance);
    editorInstance.focus();

    // Configure AI-powered auto-completion
    monaco.languages.register({ id: language });
    
    const disposable = monaco.languages.registerCompletionItemProvider(language, {
      triggerCharacters: [".", " ", "(", "{", "[", '"', "'", "`"],
      async provideCompletionItems(model, position) {
        try {
          console.log('Completion provider triggered');
          const wordInfo = model.getWordUntilPosition(position);
          console.log('Current word:', wordInfo);

          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: wordInfo.startColumn,
            endColumn: wordInfo.endColumn,
          };

          // Get the current line content
          const lineContent = model.getLineContent(position.lineNumber);
          const prefix = wordInfo.word;

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

          // Basic suggestions that are always available
          const basicSuggestions = [
            {
              label: 'console.log',
              kind: monaco.languages.CompletionItemKind.Function,
              detail: 'Log output to the console',
              documentation: { value: 'Log output to the console' },
              insertText: 'console.log($1);',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range,
            },
            {
              label: 'function',
              kind: monaco.languages.CompletionItemKind.Snippet,
              detail: 'Create a new function',
              documentation: { value: 'Create a new function' },
              insertText: [
                'function ${1:name}(${2:params}) {',
                '\t${3}',
                '}'
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range,
            },
          ];

          // Get AI suggestions
          console.log('Getting AI suggestions');
          const aiResponse = await getAICompletions({
            prefix,
            line: lineContent,
            lineNumber: position.lineNumber,
            language,
            filePath: model.uri.toString(),
            precedingCode,
            followingCode,
          });

          console.log('AI suggestions received:', aiResponse);

          // Convert VSCode completion items to Monaco format
          const aiSuggestions = aiResponse.suggestions.map((item) => ({
            label: item.label,
            kind: item.kind as monaco.languages.CompletionItemKind,
            detail: item.detail,
            documentation: {
              value: typeof item.documentation === 'string' 
                ? item.documentation 
                : item.documentation?.value || ''
            },
            insertText: item.insertText || item.label,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          }));

          const allSuggestions = [...aiSuggestions, ...basicSuggestions];
          console.log('All suggestions:', allSuggestions);

          return {
            suggestions: allSuggestions,
            incomplete: false
          };
        } catch (error) {
          console.error('Error in completion provider:', error);
          return { suggestions: [] };
        }
      }
    });

    // Clean up on unmount
    return () => {
      console.log('Disposing completion provider');
      disposable.dispose();
    };
  };

  const debouncedCode = useDebounce(
    (editor as unknown as monaco.editor.IStandaloneCodeEditor)?.getValue() ||
      "",
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

  const handleSave = async () => {
    if (!editor) return;

    const currentCode = (
      editor as unknown as monaco.editor.IStandaloneCodeEditor
    ).getValue();
    const formattedCode = await prettier.format(currentCode, {
      parser: "babel",
      plugins: [parserBabel],
    });

    (editor as unknown as monaco.editor.IStandaloneCodeEditor).setValue(formattedCode);
    localStorage.setItem(`editor-code-${language}`, formattedCode);
    toast.success("Code formatted and saved");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editor, language]);

  useEffect(() => {
    if (editorRef.current) {
      const editor = monaco.editor.create(editorRef.current, {
        value: "// Start coding...",
        language: "typescript",
        theme: "vs-dark",
        automaticLayout: true,
      });

      return () => editor.dispose();
    }
  }, []);

  if (!mounted) return null;

  const currentLanguageObj =
    LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG["javascript"];
  console.log(
    "Current language for editor:",
    language,
    "Language object:",
    currentLanguageObj
  );

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
          wordCount={wordCount}
          characterCount={characterCount}
          diagnostics={diagnostics}
        />
        <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]">
          {clerk.loaded && (
            <Editor
              height="600px"
              language={currentLanguageObj.monacoLanguage}
              onChange={handleEditorChange}
              theme={theme}
              beforeMount={defineMonacoThemes}
              onMount={handleEditorMount}
              options={{
                minimap: { enabled: false },
                fontSize,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                renderWhitespace: "selection",
                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                fontLigatures: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,
                contextmenu: true,
                renderLineHighlight: "all",
                lineHeight: 1.6,
                letterSpacing: 0.5,
                roundedSelection: true,
                wordWrap: "on",
                wordWrapOverride1: "on",
                wordWrapOverride2: "on",
                wrappingIndent: "indent",
                wrappingStrategy: "advanced",
                copyWithSyntaxHighlighting: true,
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                },
                folding: true,
                foldingStrategy: "indentation",
                foldingHighlight: true,
                showFoldingControls: "always",
                unfoldOnClickAfterEndOfLine: true,
                bracketPairColorization: {
                  enabled: true,
                  independentColorPoolPerBracketType: true,
                },
                guides: {
                  bracketPairs: true,
                  indentation: true,
                },
              }}
            />
          )}
          {!clerk.loaded && <EditorPanelSkeleton />}
        </div>
        <div className="mt-2 text-xs text-gray-500 flex justify-end">
          {wordCount} words
        </div>
      </div>
      {isShareDialogOpen && (
        <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />
      )}
    </div>
  );
}

export default EditorPanel;
