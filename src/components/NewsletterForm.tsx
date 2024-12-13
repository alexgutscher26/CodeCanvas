/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
  const subscribe = useMutation(api.newsletter.subscribe);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    try {
      setStatus("loading");
      setErrorMessage("");
      
      await subscribe({ email });
      
      setStatus("success");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to subscribe. Please try again.");
    }
  };

  return (
    <form 
      className="space-y-2"
      onSubmit={handleSubmit}
    >
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-3 py-2 bg-gray-900/50 border border-gray-800 rounded-lg
            text-sm text-gray-300 placeholder:text-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500/50
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200"
          aria-label="Email for newsletter"
          disabled={status === "loading"}
          required
        />
        {status === "loading" && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="size-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}
      </div>
      
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full px-3 py-2 bg-blue-500/10 text-blue-400 rounded-lg text-sm font-medium
          hover:bg-blue-500/20 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500/50
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Subscribing..." : "Subscribe"}
      </button>

      {status === "success" && (
        <p className="text-sm text-green-400 mt-2">
          Thanks for subscribing! We'll keep you updated.
        </p>
      )}

      {status === "error" && (
        <p className="text-sm text-red-400 mt-2">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
