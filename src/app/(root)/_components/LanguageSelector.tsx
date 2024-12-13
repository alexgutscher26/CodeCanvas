/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useEffect, useRef, useState } from "react";
import { LANGUAGE_CONFIG } from "../_constants";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronDownIcon, Lock, Sparkles } from "lucide-react";
import useMounted from "@/hooks/useMounted";
import { cn } from "@/lib/utils";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";

interface LanguageSelectorProps {
  hasAccess: boolean;
}

function LanguageSelector({ hasAccess }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const mounted = useMounted();
  const { language, setLanguage } = useCodeEditorStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const currentLanguageObj = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG['javascript'];

  // Keyboard navigation
  const [focusIndex, setFocusIndex] = useState(-1);
  const languages = Object.values(LANGUAGE_CONFIG);

  useKeyboardShortcut('l', () => {
    buttonRef.current?.click();
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusIndex(prev => (prev + 1) % languages.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusIndex(prev => (prev - 1 + languages.length) % languages.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (focusIndex !== -1) {
            handleLanguageSelect(languages[focusIndex].id);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusIndex, languages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (langId: string) => {
    if (!hasAccess && langId !== "javascript") return;
    setLanguage(langId);
    setIsOpen(false);
    setFocusIndex(-1);
    buttonRef.current?.focus();
  };

  if (!mounted) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        ref={buttonRef}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Selected language: ${currentLanguageObj.label}. Press Enter to change.`}
        className={cn(
          "group relative flex items-center gap-3 px-4 py-2.5 bg-[#1e1e2e]/80",
          "rounded-lg transition-all duration-200 border border-gray-800/50",
          "hover:border-gray-700 focus:outline-none focus:ring-2",
          "focus:ring-blue-500/40 focus:border-blue-500/40",
          !hasAccess && language !== "javascript" && "opacity-50 cursor-not-allowed"
        )}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/5 
          rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
        />

        <div className="size-6 rounded-md bg-gray-800/50 p-0.5 group-hover:scale-110 transition-transform">
          <Image
            src={currentLanguageObj.logoPath}
            alt={`${currentLanguageObj.label} logo`}
            width={24}
            height={24}
            className="w-full h-full object-contain relative z-10"
            priority
          />
        </div>

        <span className="text-gray-200 min-w-[80px] text-left group-hover:text-white transition-colors">
          {currentLanguageObj.label}
        </span>

        <ChevronDownIcon
          className={cn(
            "size-4 text-gray-400 transition-all duration-300 group-hover:text-gray-300",
            isOpen && "rotate-180"
          )}
          aria-hidden="true"
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="listbox"
            aria-label="Programming languages"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-64 bg-[#1e1e2e]/95 backdrop-blur-xl
              rounded-xl border border-[#313244] shadow-2xl py-2 z-50"
          >
            <div className="px-3 pb-2 mb-2 border-b border-gray-800/50">
              <p className="text-xs font-medium text-gray-400">
                Select Language (Press L to open)
              </p>
            </div>

            <div className="max-h-[280px] overflow-y-auto overflow-x-hidden">
              {languages.map((lang, index) => {
                const isLocked = !hasAccess && lang.id !== "javascript";
                const isSelected = language === lang.id;
                const isFocused = focusIndex === index;

                return (
                  <motion.div
                    key={lang.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group px-2"
                  >
                    <button
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={isLocked}
                      className={cn(
                        "relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                        "transition-all duration-200 focus:outline-none focus:ring-2",
                        "focus:ring-blue-500/40 focus:border-blue-500/40",
                        isSelected && "bg-blue-500/10 text-blue-400",
                        !isSelected && "text-gray-300",
                        isLocked ? "opacity-50" : "hover:bg-[#262637]",
                        isFocused && "ring-2 ring-blue-500/40"
                      )}
                      onClick={() => handleLanguageSelect(lang.id)}
                      disabled={isLocked}
                      tabIndex={isOpen ? 0 : -1}
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg 
                        opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-hidden="true"
                      />

                      <div
                        className={cn(
                          "relative size-8 rounded-lg p-1.5 group-hover:scale-110 transition-transform",
                          isSelected ? "bg-blue-500/10" : "bg-gray-800/50"
                        )}
                      >
                        <div
                          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg 
                          opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-hidden="true"
                        />
                        <Image
                          width={24}
                          height={24}
                          src={lang.logoPath}
                          alt={`${lang.label} logo`}
                          className="w-full h-full object-contain relative z-10"
                        />
                      </div>

                      <span className="flex-1 text-left group-hover:text-white transition-colors">
                        {lang.label}
                      </span>

                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 border-2 border-blue-500/30 rounded-lg"
                          layoutId="selectedBorder"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}

                      {isLocked ? (
                        <Lock className="size-4 text-gray-500" aria-label="Locked" />
                      ) : (
                        isSelected && (
                          <Sparkles
                            className="size-4 text-blue-400 animate-pulse"
                            aria-label="Selected"
                          />
                        )
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LanguageSelector;
