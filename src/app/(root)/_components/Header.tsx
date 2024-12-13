"use client";

import Link from "next/link";
import { Blocks, Code2, Sparkles, Menu, X } from "lucide-react";
import { SignedIn, useUser } from "@clerk/nextjs";
import ThemeSelector from "./ThemeSelector";
import LanguageSelector from "./LanguageSelector";
import RunButton from "./RunButton";
import HeaderProfileBtn from "./HeaderProfileBtn";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { cn } from "@/lib/utils";

function Header() {
  const { user } = useUser();
  const convexUser = useQuery(api.users.getUser, { userId: user?.id || "" });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { href: "/snippets", icon: Code2, text: "Snippets" },
    { href: "/ai-assistant", icon: Code2, text: "AI Assistant" },
    { href: "/marketplace", icon: Code2, text: "Marketplace" }
  ];

  return (
    <>
      <div className="h-[60px] w-full" /> {/* Spacer for fixed header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto px-4 sm:px-6">
          <div className="relative mx-auto max-w-7xl">
            <div 
              className="flex h-14 items-center justify-between 
              bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95
              shadow-[0_2px_20px_-4px_rgba(0,0,0,0.5)] backdrop-blur-md
              border border-white/[0.05] rounded-full mt-2 px-4"
            >
              {/* Logo Section */}
              <Link 
                href="/" 
                className="relative flex items-center gap-3 group px-2"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-2 rounded-lg ring-1 ring-white/10 group-hover:ring-white/20">
                    <Blocks className="h-5 w-5 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-all duration-300" />
                  </div>
                </div>
                <div className="hidden sm:block">
                  <p className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400">
                    CodeCanvas
                  </p>
                  <p className="text-[10px] text-blue-300/50 font-medium tracking-wider">
                    Interactive Code Editor
                  </p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navigationItems.map(({ href, icon: Icon, text }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group relative px-3 py-2 rounded-lg 
                      text-gray-400 hover:text-white transition-all duration-200
                      hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-blue-400/70 group-hover:text-blue-400 group-hover:rotate-6 transition-all duration-200" />
                      <span className="text-sm font-medium">{text}</span>
                    </div>
                  </Link>
                ))}
              </nav>

              {/* Right Side Actions */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  <ThemeSelector />
                  <LanguageSelector hasAccess={Boolean(convexUser?.isPro)} />
                </div>

                {/* Pro Button */}
                {!convexUser?.isPro && (
                  <Link
                    href="/pricing"
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-full
                      bg-gradient-to-r from-amber-500/10 to-orange-500/10
                      border border-amber-500/20 hover:border-amber-500/30
                      transition-all duration-300"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-amber-300/90 group-hover:text-amber-300">
                      Upgrade
                    </span>
                  </Link>
                )}

                {/* Run Button & Profile */}
                <div className="flex items-center gap-3 pl-3 border-l border-white/[0.08]">
                  <SignedIn>
                    <RunButton />
                  </SignedIn>
                  <HeaderProfileBtn />
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center p-2 rounded-lg
                  text-gray-400 hover:text-white hover:bg-white/[0.05]
                  transition-colors"
              >
                <span className="sr-only">
                  {isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                </span>
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "fixed inset-0 z-40 lg:hidden bg-gray-900/95 backdrop-blur-md transition-all duration-300",
            isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
            {navigationItems.map(({ href, icon: Icon, text }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 text-gray-300 hover:text-white
                  hover:translate-x-1 transition-all duration-200"
              >
                <Icon className="w-5 h-5 text-blue-400" />
                <span className="text-lg font-medium">{text}</span>
              </Link>
            ))}
            
            {/* Mobile Theme & Language Selectors */}
            <div className="flex items-center gap-4 mt-4">
              <ThemeSelector />
              <LanguageSelector hasAccess={Boolean(convexUser?.isPro)} />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;