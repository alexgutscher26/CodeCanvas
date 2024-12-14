'use client';

import { SignedIn, SignedOut } from "@clerk/nextjs";
import UpgradeButton from "./UpgradeButton";
import LoginButton from "@/components/LoginButton";

export default function PricingCTA() {
  return (
    <div className="flex justify-center">
      <SignedIn>
        <UpgradeButton />
      </SignedIn>

      <SignedOut>
        <LoginButton />
      </SignedOut>
    </div>
  );
}
