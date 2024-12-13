/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useHotkeys } from 'react-hotkeys-hook';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export function useUXEnhancements() {
  const router = useRouter();

  // Keyboard shortcuts
  useHotkeys('ctrl+k', (e) => {
    e.preventDefault();
    document.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
  });

  useHotkeys('esc', () => {
    document.activeElement instanceof HTMLElement && document.activeElement.blur();
  });

  useHotkeys('ctrl+/', () => {
    router.push('/snippets');
  });

  useHotkeys('ctrl+h', () => {
    router.push('/');
  });

  // Error boundary
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Runtime error:', event.error);
      toast.error('Something went wrong. Please try again.');
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Network status
  useEffect(() => {
    const handleOnline = () => toast.success('Back online!');
    const handleOffline = () => toast.error('You are offline. Some features may be limited.');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Page load progress
  useEffect(() => {
    const handleStart = () => {
      // Show loading indicator
      if (typeof document !== 'undefined') {
        document.body.style.cursor = 'wait';
      }
    };

    const handleComplete = () => {
      // Hide loading indicator
      if (typeof document !== 'undefined') {
        document.body.style.cursor = 'default';
      }
    };

    router.events?.on('routeChangeStart', handleStart);
    router.events?.on('routeChangeComplete', handleComplete);
    router.events?.on('routeChangeError', handleComplete);

    return () => {
      router.events?.off('routeChangeStart', handleStart);
      router.events?.off('routeChangeComplete', handleComplete);
      router.events?.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return null;
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="size-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function CustomTooltip({ 
  children, 
  content,
  shortcut
}: { 
  children: React.ReactNode;
  content: string;
  shortcut?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 
            bg-[#1e1e2e]/95 backdrop-blur-xl rounded-lg border border-[#313244] shadow-xl"
          >
            <div className="flex items-center gap-2 text-sm text-gray-200 whitespace-nowrap">
              <span>{content}</span>
              {shortcut && (
                <span className="px-1.5 py-0.5 bg-[#313244] rounded text-xs text-gray-400">
                  {shortcut}
                </span>
              )}
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 
            size-2 bg-[#1e1e2e] border-r border-b border-[#313244]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
