import { useQuery, useMutation } from "convex/react";
import TemplateCard from "./TemplateCard";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { Search, Tag } from "lucide-react";
import { motion } from "framer-motion";

export default function TemplateGrid() {
  const templates = useQuery(api.marketplace.list, {});
  const createTemplates = useMutation(api.marketplace.createTemplates);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  if (!templates) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-gray-400">No templates found</p>
        <button 
          onClick={() => createTemplates({})}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Create Example Templates
        </button>
      </div>
    );
  }

  const languages = [...new Set(templates.map((t) => t.language))];
  const popularLanguages = languages.slice(0, 5);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.framework.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLanguage = !selectedLanguage || template.language === selectedLanguage;

    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-12">
      {/* Search and Filters */}
      <div className="relative max-w-5xl mx-auto mb-12 space-y-6">
        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates by title, language, or framework..."
              className="w-full pl-12 pr-4 py-4 bg-[#1e1e2e]/80 hover:bg-[#1e1e2e] text-white
                rounded-xl border border-[#313244] hover:border-[#414155] transition-all duration-200
                placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        {/* Language Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-gray-800">
            <Tag className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Languages:</span>
          </div>

          {popularLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang === selectedLanguage ? null : lang)}
              className={`
                group relative px-3 py-1.5 rounded-lg transition-all duration-200
                ${
                  selectedLanguage === lang
                    ? "text-blue-400 bg-blue-500/10 ring-2 ring-blue-500/50"
                    : "text-gray-400 hover:text-gray-300 bg-[#1e1e2e] hover:bg-[#262637] ring-1 ring-gray-800"
                }
              `}
            >
              <div className="flex items-center gap-2">
                <img src={`/${lang}.png`} alt={lang} className="w-4 h-4 object-contain" />
                <span className="text-sm">{lang}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {filteredTemplates.map((template) => (
          <TemplateCard key={template._id} template={template} />
        ))}
      </motion.div>
    </div>
  );
}
