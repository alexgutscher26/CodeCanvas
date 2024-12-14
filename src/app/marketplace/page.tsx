"use client";

import MarketplaceHeader from "./components/MarketplaceHeader";
import TemplateGrid from "./components/TemplateGrid";
import { ProGate } from "../../components/ProGate";
import NavigationHeader from "@/components/NavigationHeader";

export default function MarketplacePage() {
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
