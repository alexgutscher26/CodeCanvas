import { Download, Code } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Editor } from "@monaco-editor/react";
import { LANGUAGE_CONFIG } from "@/app/(root)/_constants";
import { Doc } from "../../../../convex/_generated/dataModel";

interface TemplateCardProps {
  template: Doc<"marketplaceTemplates">;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  // Get first 10 lines of code for preview
  const previewCode = template.code.split('\n').slice(0, 10).join('\n');
  
  return (
    <Link href={`/marketplace/${template._id}`}>
      <motion.div 
        className="group relative bg-[#121218] border border-[#ffffff0a] rounded-2xl overflow-hidden hover:border-[#313244] transition-all duration-200"
        whileHover={{ y: -4 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#ffffff0a]">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-white line-clamp-2">{template.title}</h3>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-[#1e1e2e] text-gray-300 rounded-lg text-xs font-medium">
                PRO
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-4 line-clamp-2">
            {template.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-[#1e1e2e] rounded-lg text-xs text-gray-400">
              <img src={`/${template.language}.png`} alt={template.language} className="w-3.5 h-3.5 object-contain" />
              <span>{template.language}</span>
            </div>
            <span className="px-2 py-1 bg-[#1e1e2e] text-gray-400 rounded-lg text-xs">
              {template.framework}
            </span>
            <span className="px-2 py-1 bg-[#1e1e2e] text-gray-400 rounded-lg text-xs capitalize">
              {template.difficulty.toLowerCase()}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Download className="h-3.5 w-3.5" />
              <span>{template.downloads} downloads</span>
            </div>
            <span>v{template.version}</span>
          </div>
        </div>

        {/* Code Preview */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121218] z-10" />
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#ffffff0a] bg-[#1e1e2e]/50">
            <div className="flex items-center gap-2 text-gray-400">
              <Code className="w-4 h-4" />
              <span className="text-xs">Code Preview</span>
            </div>
          </div>
          <div className="h-[200px] overflow-hidden">
            <Editor
              height="200px"
              language={LANGUAGE_CONFIG[template.language]?.monacoLanguage || "plaintext"}
              value={previewCode}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "off",
                glyphMargin: false,
                folding: false,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 0,
                renderLineHighlight: "none",
                fontSize: 12,
                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
              }}
            />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default TemplateCard;
