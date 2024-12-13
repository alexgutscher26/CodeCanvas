/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { TemplateLoadingSkeleton } from "./_components/TemplateLoadingSkeleton";
import { TemplateDetails } from "./_components/TemplateDetails";
import { CodePreview } from "./_components/CodePreview";
import TemplateRatings from "@/components/templates/TemplateRatings";
import TemplateComments from "@/components/templates/TemplateComments";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TemplateDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const template = useQuery(api.marketplace.get, {
    id: params.id,
  });

  useEffect(() => {
    if (!template) {
      console.error("Failed to fetch template");
    }
  }, [template]);

  if (!template) {
    return <TemplateLoadingSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <TemplateDetails template={template} />
          <CodePreview template={template} />
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <TemplateComments templateId={template._id} />
          </div>
        </div>
        <div className="lg:col-span-1">
          <TemplateRatings templateId={template._id} />
        </div>
      </div>
    </div>
  );
}
