/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./UXEnhancements";

interface ProGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  loadingMessage?: string;
  upgradeMessage?: string;
  ctaText?: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.2 }
};

export function ProGate({ 
  children, 
  fallback,
  className,
  loadingMessage = "Loading...",
  upgradeMessage = "The marketplace is exclusively available to Pro subscribers. Upgrade your account to access premium code templates.",
  ctaText = "Upgrade to Pro"
}: ProGateProps) {
  const { user, isLoaded, isSignedIn } = useUser();
  const userData = isSignedIn ? useQuery(api.users.getUserById, { userId: user.id }) : null;

  const containerClasses = cn(
    "min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center",
    className
  );

  if (!isLoaded) {
    return (
      <motion.div 
        className={containerClasses}
        {...fadeInUp}
      >
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner />
          <span className="text-gray-400">{loadingMessage}</span>
        </div>
      </motion.div>
    );
  }

  if (!isSignedIn) {
    return (
      <motion.div 
        className={containerClasses}
        {...fadeInUp}
      >
        {fallback || (
          <div className="text-center space-y-6 p-8 max-w-2xl">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Sign In Required
            </h1>
            <p className="text-gray-400 text-lg">
              Please sign in to access this feature.
            </p>
            <SignInButton mode="modal">
              <button className="inline-block px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors">
                Sign In
              </button>
            </SignInButton>
          </div>
        )}
      </motion.div>
    );
  }

  if (!userData?.isPro) {
    return (
      <motion.div 
        className={containerClasses}
        {...fadeInUp}
      >
        <div className="text-center space-y-6 p-8 max-w-2xl">
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            Pro Feature
          </motion.h1>
          <motion.p 
            className="text-gray-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {upgradeMessage}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/pricing"
              className="inline-block px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            >
              {ctaText}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div {...fadeInUp}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
