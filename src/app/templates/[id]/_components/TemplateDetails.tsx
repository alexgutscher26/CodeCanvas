import { Template } from "@/types/templates";

interface TemplateDetailsProps {
  template: Template;
}

export function TemplateDetails({ template }: TemplateDetailsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {template.title}
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {template.description}
      </p>
      
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
          {template.language}
        </span>
        <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
          {template.framework}
        </span>
        <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
          {template.difficulty}
        </span>
      </div>
    </div>
  );
}
