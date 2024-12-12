"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { Editor } from "@monaco-editor/react";
import { Code, FileCode, Share, Sparkles } from "lucide-react";
import { animate, motion, px } from "framer-motion";
import NavigationHeader from "@/components/NavigationHeader";
import { all } from "axios";
import { type } from "os";
import React from "react";
import { text } from "stream/consumers";

type TemplateFormData = {
  name: string;
  description: string;
  language: string;
  framework: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  code: string;
};

export default function CreateTemplatePage() {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const createTemplate = useMutation(api.marketplace.create);

  const [formData, setFormData] = useState<TemplateFormData>({
    name: "",
    description: "",
    language: "typescript",
    framework: "react",
    difficulty: "BEGINNER",
    code: "",
  });

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast.error("Please sign in to create a template");
      return;
    }

    try {
      const templateId = await createTemplate({
        ...formData,
        userId: user.id,
        userName: user.fullName || user.username || "Anonymous",
        isPro: false,
        price: 0
      });

      toast.success("Template created successfully!");
      router.push(`/marketplace/${templateId}`);
    } catch (error) {
      toast.error("Failed to create template");
      console.error(error);
    }
  }, [createTemplate, formData, isSignedIn, router, user]);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />
      
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r
             from-blue-500/10 to-purple-500/10 text-sm text-gray-400 mb-6"
          >
            <FileCode className="w-4 h-4" />
            Create New Template
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text mb-6"
          >
            Share Your Code Templates
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 mb-8"
          >
            Help others by sharing your reusable code templates with the community
          </motion.p>
        </div>

        {/* Form Section */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Title Input */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <input
                  type="text"
                  placeholder="Template Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-4 rounded-xl bg-[#1e1e2e]/80 hover:bg-[#1e1e2e] text-white
                    border border-[#313244] hover:border-[#414155] transition-all duration-200
                    placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>

              {/* Description Input */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-4 rounded-xl bg-[#1e1e2e]/80 hover:bg-[#1e1e2e] text-white
                    border border-[#313244] hover:border-[#414155] transition-all duration-200
                    placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                    min-h-[100px] resize-y"
                  required
                />
              </div>

              {/* Language and Framework Selects */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-4 py-4 rounded-xl bg-[#1e1e2e]/80 hover:bg-[#1e1e2e] text-white
                      border border-[#313244] hover:border-[#414155] transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="typescript">TypeScript</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                  </select>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <select
                    value={formData.framework}
                    onChange={(e) => setFormData({ ...formData, framework: e.target.value })}
                    className="w-full px-4 py-4 rounded-xl bg-[#1e1e2e]/80 hover:bg-[#1e1e2e] text-white
                      border border-[#313244] hover:border-[#414155] transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="react">React</option>
                    <option value="nextjs">Next.js</option>
                    <option value="vue">Vue</option>
                  </select>
                </div>
              </div>

              {/* Difficulty Select */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as TemplateFormData["difficulty"] })}
                  className="w-full px-4 py-4 rounded-xl bg-[#1e1e2e]/80 hover:bg-[#1e1e2e] text-white
                    border border-[#313244] hover:border-[#414155] transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>

              {/* Code Editor */}
              <div className="relative">
                <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e2e] border-b border-[#313244] rounded-t-xl">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Code className="w-4 h-4" />
                    <span className="text-sm">Code Template</span>
                  </div>
                </div>
                <div className="h-[400px] rounded-b-xl overflow-hidden border border-[#313244]">
                  <Editor
                    height="100%"
                    defaultLanguage={formData.language}
                    value={formData.code}
                    onChange={(value) => setFormData({ ...formData, code: value || "" })}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      wordWrap: "on",
                      tabSize: 2,
                      padding: { top: 16 },
                    }}
                  />
                </div>
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-xl
                transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50
                flex items-center justify-center gap-2 text-lg font-medium"
            >
              <Sparkles className="w-5 h-5" />
              Create Template
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}
