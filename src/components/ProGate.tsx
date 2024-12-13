"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { motion } from "framer-motion";
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
  // Always call useQuery with a default value for userId when not signed in
  const userData = useQuery(api.users.getUserById, { 
    userId: isSignedIn ? user?.id : "" // Use empty string as fallback
  });

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
          <p className="text-gray-400">{loadingMessage}</p>
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
        <div className="flex flex-col items-center gap-6 max-w-md text-center p-8">
          <h2 className="text-2xl font-bold text-white">Sign in Required</h2>
          <p className="text-gray-400">Please sign in to access this feature.</p>
          <SignInButton mode="modal">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Sign In
            </button>
          </SignInButton>
        </div>
      </motion.div>
    );
  }

  // Check for pro subscription
  if (!userData?.isPro) {
    return (
      <motion.div 
        className={containerClasses}
        {...fadeInUp}
      >
        <div className="flex flex-col items-center gap-6 max-w-md text-center p-8">
          <h2 className="text-2xl font-bold text-white">Pro Feature</h2>
          <p className="text-gray-400">{upgradeMessage}</p>
          <Link
            href="/pricing"
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
          >
            {ctaText}
          </Link>
          {fallback}
        </div>
      </motion.div>
    );
  }

  return <>{children}</>;
}
