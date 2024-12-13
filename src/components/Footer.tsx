'use client';

import { Blocks, Github, Twitter, Mail } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import NewsletterForm from "./NewsletterForm";

interface FooterProps {
  className?: string;
}

const footerLinks = [
  { href: "/support", label: "Support" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" }
] as const;

const socialLinks = [
  { 
    href: "https://github.com/codeium", 
    icon: Github, 
    label: "GitHub",
    className: "hover:text-github dark:hover:text-github/90" 
  },
  { 
    href: "https://twitter.com/codeiumdev", 
    icon: Twitter, 
    label: "Twitter",
    className: "hover:text-twitter dark:hover:text-twitter/90" 
  },
  { 
    href: "mailto:support@codeium.com", 
    icon: Mail, 
    label: "Email",
    className: "hover:text-blue-400 dark:hover:text-blue-400/90" 
  }
] as const;

function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn(
      "relative border-t border-gray-800/50 mt-auto bg-gradient-to-b from-transparent to-gray-950/50",
      className
    )}>
      {/* Top border gradient */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gray-800/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative p-1.5 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 ring-1 ring-white/10">
                <Blocks className="size-5 text-blue-400" />
              </div>
              <span className="font-semibold text-gray-200">CodeCanvas</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering developers with intelligent code templates and tools for faster, more efficient development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-200 mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-2" aria-label="Quick links">
              {footerLinks.map(({ href, label }) => (
                <Link 
                  key={href}
                  href={href}
                  className="text-sm text-gray-400 hover:text-gray-300 transition-colors w-fit"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold text-gray-200 mb-4">Connect</h3>
            <div className="flex gap-4">
              {socialLinks.map(({ href, icon: Icon, label, className }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "text-gray-400 transition-colors",
                    className
                  )}
                  aria-label={label}
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-gray-200 mb-4">Stay Updated</h3>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p> {currentYear} CodeCanvas. All rights reserved.</p>
            <p>Built for developers, by developers</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
