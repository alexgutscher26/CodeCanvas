/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { toast } from "sonner";
import { useHotkeys } from "react-hotkeys-hook";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import debounce from "lodash/debounce";
import { cn } from "@/lib/utils";

interface ToastMessage {
  message: string;
  type: "success" | "error";
  timestamp: Date;
}

interface UXEnhancementsConfig {
  debounceDelay?: number;
  errorCooldown?: number;
  shortcuts?: {
    search: string;
    snippets: string;
    home: string;
    escape: string;
  };
}

const defaultConfig: UXEnhancementsConfig = {
  debounceDelay: 5000,
  errorCooldown: 5000,
  shortcuts: {
    search: "ctrl+k",
    snippets: "ctrl+/",
    home: "ctrl+h",
    escape: "esc",
  },
};

export function useUXEnhancements(config: UXEnhancementsConfig = defaultConfig) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastToast, setLastToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      const now = new Date();
      if (
        !lastToast ||
        type !== "error" ||
        now.getTime() - lastToast.timestamp.getTime() > (config.errorCooldown ?? defaultConfig.errorCooldown!)
      ) {
        type === "success" ? toast.success(message) : toast.error(message);
        setLastToast({ message, type, timestamp: now });
      }
    },
    [lastToast, config.errorCooldown]
  );

  const debouncedToast = useCallback(
    debounce(
      (message: string, type: "success" | "error") => showToast(message, type),
      config.debounceDelay ?? defaultConfig.debounceDelay
    ),
    [showToast, config.debounceDelay]
  );

  // Keyboard shortcuts
  useHotkeys(config.shortcuts?.search ?? defaultConfig.shortcuts!.search, (e) => {
    e.preventDefault();
    document.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
  });

  useHotkeys(config.shortcuts?.escape ?? defaultConfig.shortcuts!.escape, () => {
    document.activeElement instanceof HTMLElement && document.activeElement.blur();
  });

  useHotkeys(config.shortcuts?.snippets ?? defaultConfig.shortcuts!.snippets, () => {
    router.push("/snippets");
  });

  useHotkeys(config.shortcuts?.home ?? defaultConfig.shortcuts!.home, () => {
    router.push("/");
  });

  // Error boundary
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Runtime error:", event.error);
      debouncedToast("Something went wrong. Please try again.", "error");
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, [debouncedToast]);

  // Network status
  useEffect(() => {
    const handleOnline = () => debouncedToast("Back online!", "success");
    const handleOffline = () => debouncedToast("You are offline. Some features may be limited.", "error");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [debouncedToast]);

  // Page load progress
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => {
      setIsLoading(false);
      debouncedToast("Navigation complete", "success");
    };
    const handleError = () => setIsLoading(false);

    router.events?.on("routeChangeStart", handleStart);
    router.events?.on("routeChangeComplete", handleComplete);
    router.events?.on("routeChangeError", handleError);

    return () => {
      setIsLoading(false);
      router.events?.off("routeChangeStart", handleStart);
      router.events?.off("routeChangeComplete", handleComplete);
      router.events?.off("routeChangeError", handleError);
    };
  }, [debouncedToast, router]);

  return {
    isLoading,
    showToast,
    debouncedToast,
    currentPath: pathname,
  };
}

export const LoadingSpinner = memo(function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <motion.div
        className="size-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
});

export const PageTransition = memo(function PageTransition({ 
  children,
  className,
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
});

export const CustomTooltip = memo(function CustomTooltip({
  children,
  content,
  shortcut,
  className,
  position = "bottom",
}: {
  children: React.ReactNode;
  content: string;
  shortcut?: string;
  className?: string;
  position?: "top" | "bottom" | "left" | "right";
}) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  };

  return (
    <div
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "absolute z-50 left-1/2 transform -translate-x-1/2",
              positionClasses[position],
              "px-3 py-2 bg-[#1e1e2e]/95 backdrop-blur-xl rounded-lg border border-[#313244] shadow-xl"
            )}
          >
            <div className="flex items-center gap-2 text-sm text-gray-200 whitespace-nowrap">
              <span>{content}</span>
              {shortcut && (
                <kbd className="px-1.5 py-0.5 bg-[#313244] rounded text-xs text-gray-400">
                  {shortcut}
                </kbd>
              )}
            </div>
            <div
              className={cn(
                "absolute left-1/2 transform -translate-x-1/2 size-2 rotate-45 bg-[#1e1e2e] border border-[#313244]",
                position === "top" && "bottom-0 translate-y-1/2 border-t-0 border-l-0",
                position === "bottom" && "top-0 -translate-y-1/2 border-b-0 border-r-0",
                position === "left" && "right-0 translate-x-1/2 border-l-0 border-t-0",
                position === "right" && "left-0 -translate-x-1/2 border-r-0 border-b-0"
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
