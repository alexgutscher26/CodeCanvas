/* eslint-disable react-hooks/rules-of-hooks */
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";

interface ProGateProps {
  children: React.ReactNode;
}

export function ProGate({ children }: ProGateProps) {
  const { user, isLoaded } = useUser();
  const userData = user ? useQuery(api.users.getUserById, { userId: user.id }) : null;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!userData?.isPro) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center space-y-6 p-8 max-w-2xl">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Pro Feature
          </h1>
          <p className="text-gray-400 text-lg">
            The marketplace is exclusively available to Pro subscribers. Upgrade your account to access premium code templates.
          </p>
          <Link
            href="/pricing"
            className="inline-block px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
