"use client";

import { SignInButton } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface LoginButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

function LoginButton({ 
  variant = "default", 
  size = "md",
  className 
}: LoginButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  const variantClasses = {
    default: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20",
    outline: "border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10",
    ghost: "text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950"
  };

  return (
    <SignInButton mode="modal">
      <button
        className={cn(
          "flex items-center gap-2 rounded-lg font-medium",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Sign in to your account"
      >
        <LogIn 
          className={cn(
            "transition-transform duration-200",
            isHovered && "translate-x-0.5"
          )} 
          size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
          aria-hidden="true"
        />
        <span>Sign In</span>
      </button>
    </SignInButton>
  );
}

export default LoginButton;
