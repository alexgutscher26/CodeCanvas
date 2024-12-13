/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Link from "next/link";
import { ArrowLeft, Download, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import NavigationHeader from "@/components/NavigationHeader";
import { ProGate } from "@/components/ProGate";
import { useState } from "react";
import TemplateComments from "@/components/templates/TemplateComments";
import TemplateRatings from "@/components/templates/TemplateRatings";
import FavoriteButton from "@/components/ui/favorite-button";

export default function TemplateDetailPage() {
  const { templateId } = useParams();
  const { isSignedIn, user } = useUser();
  const [isCopied, setIsCopied] = useState(false);

  const template = useQuery(api.marketplace.get, {
    id: templateId as string,
  });

  const purchase = useMutation(api.marketplace.purchase);

  if (!template) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <NavigationHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="w-32 h-4 bg-[#ffffff08] rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="h-8 w-2/3 bg-[#ffffff08] rounded animate-pulse mb-4" />
                  <div className="h-4 w-full bg-[#ffffff08] rounded animate-pulse mb-4" />
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-6 w-20 bg-[#ffffff08] rounded animate-pulse" />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-6 w-24 bg-[#ffffff08] rounded animate-pulse" />
                  <div className="h-10 w-32 bg-[#ffffff08] rounded-xl animate-pulse" />
                </div>
              </div>
              <div className="mt-6">
                <div className="bg-[#0a0a0f] rounded-xl p-4">
                  <div className="h-[200px] bg-[#ffffff08] rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handlePurchase = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to download this template");
      return;
    }

    if (template.isPro && !user?.publicMetadata?.isPro) {
      return;
    }

    try {
      await purchase({
        templateId: template._id,
        userId: user.id,
      });

      const blob = new Blob([template.code], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.title.toLowerCase().replace(/\s+/g, '-')}.${getFileExtension(template.language)}`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Template downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download template");
    }
  };

  const getFileExtension = (language: string): string => {
    const extensions: Record<string, string> = {
      typescript: 'ts',
      javascript: 'js',
      python: 'py',
      java: 'java',
      'c++': 'cpp',
      'c#': 'cs',
      ruby: 'rb',
      go: 'go',
      rust: 'rs',
      php: 'php',
      swift: 'swift',
      kotlin: 'kt',
      dart: 'dart',
      // Add more languages as needed
    };
    return extensions[language.toLowerCase()] || 'txt';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/marketplace"
            className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div>
            <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{template.title}</h1>
                  <p className="text-gray-400 mb-4">{template.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#ffffff0a]">
                      {template.language}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#ffffff0a]">
                      {template.framework}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#ffffff0a]">
                      {template.difficulty}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      {template.downloads.toLocaleString()} downloads
                    </div>
                    <FavoriteButton templateId={template._id} />
                  </div>
                  {template.isPro ? (
                    <ProGate>
                      <button
                        onClick={handlePurchase}
                        className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </button>
                    </ProGate>
                  ) : (
                    <button
                      onClick={handlePurchase}
                      className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <div className="bg-[#0a0a0f] rounded-xl p-4 relative">
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(template.code);
                      setIsCopied(true);
                      toast.success("Code copied to clipboard!");
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-[#ffffff0a] hover:bg-[#ffffff15] transition-colors"
                    aria-label="Copy code"
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  <SyntaxHighlighter
                    language={template.language.toLowerCase()}
                    style={oneDark}
                    customStyle={{
                      margin: 0,
                      padding: "1rem",
                    }}
                  >
                    {template.code}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </div>

          {/* Ratings & Comments */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl p-6 backdrop-blur-xl">
                <TemplateRatings templateId={template._id} />
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl p-6 backdrop-blur-xl">
                <TemplateComments templateId={template._id} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
