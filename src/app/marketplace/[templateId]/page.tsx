"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Download, Star } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { ProGate } from "@/components/ProGate";
import NavigationHeader from "@/components/NavigationHeader";
import { toast } from "sonner";

type TemplateDetails = {
  id: string;
  name: string;
  description: string;
  price: number;
  language: string;
  framework: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  code: string;
  preview: string;
  downloads: number;
  rating: number;
  isPro: boolean;
  createdAt: number;
};

export default function TemplateDetailPage() {
  const { templateId } = useParams();
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();
  
  const template = useQuery(api.marketplace.get, { 
    id: templateId as string 
  });

  const purchase = useMutation(api.marketplace.purchase);

  if (!isLoaded || !template) {
    return <TemplateDetailSkeleton />;
  }

  const handlePurchase = async () => {
    try {
      if (!isSignedIn) {
        return router.push("/sign-in");
      }

      await purchase({
        templateId: template.id,
        userId: user.id,
      });

      toast.success("Template purchased successfully!");
    } catch (error) {
      toast.error("Failed to purchase template");
    }
  };

  const difficultyColor = {
    BEGINNER: "bg-green-500/10 text-green-400",
    INTERMEDIATE: "bg-blue-500/10 text-blue-400",
    ADVANCED: "bg-yellow-500/10 text-yellow-400",
    EXPERT: "bg-red-500/10 text-red-400",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/marketplace" 
            className="inline-flex items-center text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">{template.name}</h1>
                  <p className="text-gray-400">{template.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 text-sm rounded-lg bg-[#ffffff08] text-gray-300">
                    {template.language}
                  </span>
                  <span className="px-3 py-1 text-sm rounded-lg bg-[#ffffff08] text-gray-300">
                    {template.framework}
                  </span>
                  <span className={`px-3 py-1 text-sm rounded-lg ${difficultyColor[template.difficulty]}`}>
                    {template.difficulty}
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <div className="relative h-[400px] w-full rounded-xl overflow-hidden mb-6">
                  <Image
                    src={template.preview}
                    alt={template.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="bg-[#0a0a0f] rounded-xl p-4">
                  <SyntaxHighlighter
                    language={template.language.toLowerCase()}
                    style={vscDarkPlus}
                    showLineNumbers
                    customStyle={{
                      margin: 0,
                      padding: '1rem',
                      background: 'transparent',
                    }}
                  >
                    {template.code}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-white mb-2">Purchase Template</h2>
              <p className="text-sm text-gray-400 mb-6">Get instant access to this template</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Price</span>
                  <span className="text-2xl font-bold text-white">
                    {template.price === 0 ? "Free" : `$${template.price}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Downloads</span>
                  <div className="flex items-center text-gray-300">
                    <Download className="h-4 w-4 mr-2" />
                    {template.downloads}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Rating</span>
                  <div className="flex items-center text-gray-300">
                    <Star className="h-4 w-4 mr-2 fill-yellow-400 stroke-yellow-400" />
                    {typeof template.rating === 'number' ? template.rating.toFixed(1) : 'N/A'}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                {template.isPro ? (
                  <ProGate>
                    <button 
                      onClick={handlePurchase}
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors"
                    >
                      Purchase Now
                    </button>
                  </ProGate>
                ) : (
                  <button 
                    onClick={handlePurchase}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors"
                  >
                    {template.price === 0 ? "Download Now" : "Purchase Now"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function TemplateDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="w-32 h-4 bg-[#ffffff08] rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl p-6 backdrop-blur-xl">
              <div className="p-6">
                <div className="h-8 w-2/3 bg-[#ffffff08] rounded animate-pulse" />
                <div className="h-4 w-full mt-2 bg-[#ffffff08] rounded animate-pulse" />
              </div>
              <div className="px-6 pb-6">
                <div className="h-[400px] w-full bg-[#ffffff08] rounded-xl animate-pulse" />
                <div className="h-[200px] w-full mt-6 bg-[#ffffff08] rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl p-6 backdrop-blur-xl">
              <div className="p-6">
                <div className="h-6 w-1/2 bg-[#ffffff08] rounded animate-pulse" />
                <div className="h-4 w-2/3 mt-2 bg-[#ffffff08] rounded animate-pulse" />
              </div>
              <div className="px-6 pb-4">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="h-4 w-20 bg-[#ffffff08] rounded animate-pulse" />
                      <div className="h-4 w-16 bg-[#ffffff08] rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 pb-6">
                <div className="h-10 w-full bg-[#ffffff08] rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
