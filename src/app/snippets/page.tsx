"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "react-error-boundary";

import NavigationHeader from "@/components/NavigationHeader";
import SnippetsPageSkeleton from "./_components/SnippetsPageSkeleton";

import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Code, Grid, Layers, Search, Tag, X } from "lucide-react";
import ErrorFallback from "@/components/ErrorFallback";

// Dynamically import SnippetCard for better initial page load
const SnippetCard = dynamic(() => import("./_components/SnippetCard"), {
  loading: () => <div className="h-[300px] animate-pulse bg-[#1e1e2e]/50 rounded-xl" />
});

// Types
interface ViewType {
  grid: "grid";
  list: "list";
}

function SnippetsPage() {
  const snippets = useQuery(api.snippets.getSnippets);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [view, setView] = useState<keyof ViewType>("grid");

  // Memoized languages list
  const languages = useMemo(() => {
    if (!snippets) return [];
    return [...new Set(snippets.map((s) => s.language))];
  }, [snippets]);

  const popularLanguages = useMemo(() => languages.slice(0, 5), [languages]);

  // Memoized filtered snippets
  const filteredSnippets = useMemo(() => {
    if (!snippets) return [];
    return snippets.filter((snippet) => {
      const matchesSearch =
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.userName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLanguage = !selectedLanguage || snippet.language === selectedLanguage;

      return matchesSearch && matchesLanguage;
    });
  }, [snippets, searchQuery, selectedLanguage]);

  // Handle language selection
  const handleLanguageSelect = useCallback((lang: string) => {
    setSelectedLanguage(prev => prev === lang ? null : lang);
  }, []);

  // loading state
  if (snippets === undefined) {
    return (
      <div className="min-h-screen">
        <NavigationHeader />
        <SnippetsPageSkeleton />
      </div>
    );
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <div className="min-h-screen bg-[#0a0a0f]">
        <NavigationHeader />

        <main className="relative max-w-7xl mx-auto px-4 py-12" role="main">
          {/* Hero Section */}
          <section className="text-center max-w-3xl mx-auto mb-16" aria-labelledby="hero-title">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r
               from-blue-500/10 to-purple-500/10 text-sm text-gray-400 mb-6"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>Community Code Library</span>
            </motion.div>
            
            <motion.h1
              id="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 
                text-transparent bg-clip-text mb-6"
            >
              Discover & Share Code Snippets
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-400 mb-8"
            >
              Explore a curated collection of code snippets from the community
            </motion.p>
          </section>

          {/* Filters Section */}
          <section className="relative max-w-5xl mx-auto mb-12 space-y-6" aria-label="Filters">
            {/* Search */}
            <div className="relative group">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 
                  rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"
                aria-hidden="true"
              />
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search snippets by title, language, or author..."
                  className="w-full pl-12 pr-4 py-4 bg-[#1e1e2e]/80 hover:bg-[#1e1e2e] text-white
                    rounded-xl border border-[#313244] hover:border-[#414155] transition-all duration-200
                    placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  aria-label="Search snippets"
                />
              </div>
            </div>

            {/* Language Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-gray-800">
                <Tag className="w-4 h-4 text-gray-400" aria-hidden="true" />
                <span className="text-sm text-gray-400">Languages:</span>
              </div>

              {popularLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageSelect(lang)}
                  className={`
                    group relative px-3 py-1.5 rounded-lg transition-all duration-200
                    ${
                      selectedLanguage === lang
                        ? "text-blue-400 bg-blue-500/10 ring-2 ring-blue-500/50"
                        : "text-gray-400 hover:text-gray-300 bg-[#1e1e2e] hover:bg-[#262637] ring-1 ring-gray-800"
                    }
                  `}
                  aria-pressed={selectedLanguage === lang}
                >
                  <div className="flex items-center gap-2">
                    <img 
                      src={`/${lang}.png`} 
                      alt="" 
                      className="w-4 h-4 object-contain"
                      aria-hidden="true"
                    />
                    <span className="text-sm">{lang}</span>
                  </div>
                </button>
              ))}

              {selectedLanguage && (
                <button
                  onClick={() => setSelectedLanguage(null)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 
                    hover:text-gray-300 transition-colors"
                  aria-label="Clear language filter"
                >
                  <X className="w-3 h-3" aria-hidden="true" />
                  Clear
                </button>
              )}

              <div className="ml-auto flex items-center gap-3">
                <span className="text-sm text-gray-500" role="status">
                  {filteredSnippets.length} snippets found
                </span>

                {/* View Toggle */}
                <div className="flex items-center gap-1 p-1 bg-[#1e1e2e] rounded-lg ring-1 ring-gray-800">
                  <button
                    onClick={() => setView("grid")}
                    className={`p-2 rounded-md transition-all ${
                      view === "grid"
                        ? "bg-blue-500/20 text-blue-400"
                        : "text-gray-400 hover:text-gray-300 hover:bg-[#262637]"
                    }`}
                    aria-label="Grid view"
                    aria-pressed={view === "grid"}
                  >
                    <Grid className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={`p-2 rounded-md transition-all ${
                      view === "list"
                        ? "bg-blue-500/20 text-blue-400"
                        : "text-gray-400 hover:text-gray-300 hover:bg-[#262637]"
                    }`}
                    aria-label="List view"
                    aria-pressed={view === "list"}
                  >
                    <Layers className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Snippets Grid */}
          <section 
            className={`grid gap-6 ${
              view === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            }`}
            aria-label="Code snippets"
          >
            <AnimatePresence mode="popLayout">
              {filteredSnippets.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400"
                >
                  <Code className="w-12 h-12 mb-4" />
                  <p className="text-lg font-medium">No snippets found</p>
                  <p className="text-sm text-gray-500">
                    Try adjusting your search or filter criteria
                  </p>
                </motion.div>
              ) : (
                filteredSnippets.map((snippet) => (
                  <SnippetCard key={snippet._id} snippet={snippet} />
                ))
              )}
            </AnimatePresence>
          </section>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default SnippetsPage;
