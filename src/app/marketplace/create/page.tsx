"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { Editor } from "@monaco-editor/react";
import { Code, FileCode, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import NavigationHeader from "@/components/NavigationHeader";
import { z } from "zod";

const LANGUAGES = ["typescript", "javascript", "python"] as const;
const FRAMEWORKS = ["react", "nextjs", "vue"] as const;
const DIFFICULTIES = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"] as const;

const templateSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name must be less than 50 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
  language: z.enum(LANGUAGES),
  framework: z.enum(FRAMEWORKS),
  difficulty: z.enum(DIFFICULTIES),
  code: z.string().min(1, "Code template is required"),
});

type TemplateFormData = z.infer<typeof templateSchema>;

export default function CreateTemplatePage() {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const createTemplate = useMutation(api.marketplace.create);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof TemplateFormData, string>>>({});

  const [formData, setFormData] = useState<TemplateFormData>({
    name: "",
    description: "",
    language: "typescript",
    framework: "react",
    difficulty: "BEGINNER",
    code: "",
  });

  const validateForm = (): boolean => {
    try {
      templateSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof TemplateFormData, string>> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof TemplateFormData;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast.error("Please sign in to create a template");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      const templateData = {
        ...formData,
        userId: user.id,
        userName: user.fullName || user.username || "Anonymous",
        isPro: false,
      } as const;

      const templateId = await createTemplate(templateData);

      toast.success("Template created successfully!");
      router.push(`/marketplace/${templateId}`);
    } catch (error) {
      toast.error("Failed to create template");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />
      
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-sm text-gray-400 mb-6"
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
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <input
                  type="text"
                  placeholder="Template Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`relative z-10 w-full px-4 py-4 rounded-xl bg-[#1e1e2e]/80 hover:bg-[#1e1e2e] text-white
                    border ${errors.name ? 'border-red-500' : 'border-[#313244] hover:border-[#414155]'} transition-all duration-200
                    placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Description Input */}
              <div className="relative group">
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`relative z-10 w-full px-4 py-4 rounded-xl bg-[#1e1e2e]/80 hover:bg-[#1e1e2e] text-white
                    border ${errors.description ? 'border-red-500' : 'border-[#313244] hover:border-[#414155]'} transition-all duration-200
                    placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                    min-h-[100px] resize-y`}
                  required
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Language and Framework Selects */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value as typeof LANGUAGES[number] })}
                    className={`relative z-10 w-full px-4 py-4 rounded-xl bg-[#1e1e2e]/80 hover:bg-[#1e1e2e] text-white
                      border ${errors.language ? 'border-red-500' : 'border-[#313244] hover:border-[#414155]'} transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <select
                    value={formData.framework}
                    onChange={(e) => setFormData({ ...formData, framework: e.target.value as typeof FRAMEWORKS[number] })}
                    className={`relative z-10 w-full px-4 py-4 rounded-xl bg-[#1e1e2e]/80 hover:bg-[#1e1e2e] text-white
                      border ${errors.framework ? 'border-red-500' : 'border-[#313244] hover:border-[#414155]'} transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  >
                    {FRAMEWORKS.map((framework) => (
                      <option key={framework} value={framework}>
                        {framework === "nextjs" ? "Next.js" : framework.charAt(0).toUpperCase() + framework.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Difficulty Select */}
              <div className="relative group">
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as typeof DIFFICULTIES[number] })}
                  className={`relative z-10 w-full px-4 py-4 rounded-xl bg-[#1e1e2e]/80 hover:bg-[#1e1e2e] text-white
                    border ${errors.difficulty ? 'border-red-500' : 'border-[#313244] hover:border-[#414155]'} transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                >
                  {DIFFICULTIES.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
                    </option>
                  ))}
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
                <div className={`h-[400px] rounded-b-xl overflow-hidden border ${errors.code ? 'border-red-500' : 'border-[#313244]'}`}>
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
                {errors.code && (
                  <p className="mt-1 text-sm text-red-500">{errors.code}</p>
                )}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className={`w-full ${isSubmitting ? 'bg-blue-500/50' : 'bg-blue-500 hover:bg-blue-600'} text-white py-4 px-6 rounded-xl
                transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50
                flex items-center justify-center gap-2 text-lg font-medium`}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              {isSubmitting ? "Creating..." : "Create Template"}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}
