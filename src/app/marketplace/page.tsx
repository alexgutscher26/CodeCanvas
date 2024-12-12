"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import MarketplaceHeader from "./components/MarketplaceHeader";
import TemplateGrid from "./components/TemplateGrid";
import { ProGate } from "../../components/ProGate";
import { useEffect } from "react";
import NavigationHeader from "@/components/NavigationHeader";

export default function MarketplacePage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <ProGate>
      <NavigationHeader />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 py-8">
          <MarketplaceHeader />
          <TemplateGrid />
        </div>
      </div>
    </ProGate>
  );
}
