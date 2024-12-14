/* eslint-disable react/no-unescaped-entities */
"use client";

import { useCallback, useMemo } from "react";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "react-error-boundary";
import Image from "next/image";
import type { editor } from 'monaco-editor';

import NavigationHeader from "@/components/NavigationHeader";
import SnippetLoadingSkeleton from "./_components/SnippetLoadingSkeleton";
import ErrorFallback from "@/components/ErrorFallback";
import { Clock, Code, MessageSquare, User, ArrowLeft } from "lucide-react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "@/app/(root)/_constants";

type RenderWhitespace = "all" | "none" | "selection" | "boundary" | "trailing";

// Dynamically import heavy components
const Editor = dynamic(() => import("@monaco-editor/react").then((mod) => mod.Editor), {
  loading: () => (
    <div className="h-[600px] animate-pulse bg-[#1e1e2e]/50 rounded-xl flex items-center justify-center">
      <div className="text-gray-400">Loading editor...</div>
    </div>
  ),
  ssr: false,
});

const CopyButton = dynamic(() => import("./_components/CopyButton"));
const Comments = dynamic(() => import("./_components/Comments"));

function SnippetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const snippetId = params.id as Id<"snippets">;

  // Memoize query options
  const queryOptions = useMemo(() => ({ snippetId }), [snippetId]);

  const snippet = useQuery(api.snippets.getSnippetById, queryOptions);
  const comments = useQuery(api.snippets.getComments, queryOptions);

  // Memoize editor options
  const editorOptions: editor.IStandaloneEditorConstructionOptions = useMemo(
    () => ({
      minimap: { enabled: false },
      fontSize: 16,
      readOnly: true,
      automaticLayout: true,
      scrollBeyondLastLine: false,
      padding: { top: 16 },
      renderWhitespace: "selection" as RenderWhitespace,
      fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
      fontLigatures: true,
      semanticHighlighting: { enabled: true },
      bracketPairColorization: { enabled: true },
      lineNumbers: 'on',
      folding: true,
      wordWrap: 'on',
      lineDecorationsWidth: 0,
      renderLineHighlight: 'all',
      scrollbar: {
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
      },
    }),
    []
  );

  const handleBackClick = useCallback(() => {
    router.back();
  }, [router]);

  if (snippet === undefined) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <NavigationHeader />
        <SnippetLoadingSkeleton />
      </div>
    );
  }

  if (snippet === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <NavigationHeader />
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Code className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-semibold text-white mb-3">Snippet not found</h1>
            <p className="text-gray-400 mb-6">
              The snippet you're looking for might have been deleted or doesn't exist.
            </p>
            <button
              onClick={handleBackClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffffff08] text-white 
                rounded-lg hover:bg-[#ffffff12] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <div className="min-h-screen bg-[#0a0a0f]">
        <NavigationHeader />

        <main className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl p-6 sm:p-8 mb-6 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div 
                    className="relative flex items-center justify-center size-12 rounded-xl bg-[#ffffff08] p-2.5"
                    aria-hidden="true"
                  >
                    <Image
                      src={`/${snippet.language}.png`}
                      alt=""
                      className="object-contain"
                      width={48}
                      height={48}
                      priority
                    />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                      {snippet.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                      <div className="flex items-center gap-2 text-[#8b8b8d]">
                        <User className="w-4 h-4" aria-hidden="true" />
                        <span>{snippet.userName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#8b8b8d]">
                        <Clock className="w-4 h-4" aria-hidden="true" />
                        <time dateTime={new Date(snippet._creationTime).toISOString()}>
                          {new Date(snippet._creationTime).toLocaleDateString()}
                        </time>
                      </div>
                      <div className="flex items-center gap-2 text-[#8b8b8d]">
                        <MessageSquare className="w-4 h-4" aria-hidden="true" />
                        <span>{comments?.length || 0} comments</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div 
                  className="inline-flex items-center px-3 py-1.5 bg-[#ffffff08] text-[#808086] 
                    rounded-lg text-sm font-medium"
                  role="status"
                >
                  {snippet.language}
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div className="mb-8 rounded-2xl overflow-hidden border border-[#ffffff0a] bg-[#121218]">
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#ffffff0a]">
                <div className="flex items-center gap-2 text-[#808086]">
                  <Code className="w-4 h-4" aria-hidden="true" />
                  <span className="text-sm font-medium">Source Code</span>
                </div>
                <CopyButton code={snippet.code} />
              </div>
              <Editor
                height="600px"
                language={LANGUAGE_CONFIG[snippet.language].monacoLanguage}
                value={snippet.code}
                theme="vs-dark"
                beforeMount={defineMonacoThemes}
                options={editorOptions}
                loading={
                  <div className="h-[600px] flex items-center justify-center text-gray-400">
                    Loading editor...
                  </div>
                }
              />
            </div>

            <Comments snippetId={snippet._id} />
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default SnippetDetailPage;
