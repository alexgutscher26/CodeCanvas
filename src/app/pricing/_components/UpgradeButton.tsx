"use client";

import { Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UpgradeButton() {
  const CHECKOUT_URL =
    "https://codecanvass.lemonsqueezy.com/buy/f3209bb0-da06-4c9c-8c0e-f7f0a2945a32";

  return (
    <Link href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
      <Button 
        className="w-full inline-flex items-center justify-center gap-2 px-8 py-4
        bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 
        hover:to-blue-700 transition-all"
      >
        <Zap className="w-5 h-5" />
        Upgrade to Pro
      </Button>
    </Link>
  );
}
