"use client";

import { useUXEnhancements, PageTransition } from "@/components/UXEnhancements";

export default function UXProvider({ children }: { children: React.ReactNode }) {
  useUXEnhancements();

  return <PageTransition>{children}</PageTransition>;
}
