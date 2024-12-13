"use client";

import { useQuery } from "convex/react";
import { LoadingSpinner } from "@/components/UXEnhancements";
import TemplateRatings from "@/components/templates/TemplateRatings";
import TemplateComments from "@/components/templates/TemplateComments";
import { api } from "../../../../convex/_generated/api";

export default function TemplateDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const template = useQuery(api.marketplace.get, {
    id: params.id,
  });

  if (!template) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Template Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4">{template.title}</h1>
            <p className="text-muted-foreground mb-4">{template.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Language:</span> {template.language}
              </div>
              <div>
                <span className="font-medium">Framework:</span> {template.framework}
              </div>
              <div>
                <span className="font-medium">Difficulty:</span> {template.difficulty}
              </div>
            </div>
          </div>

          {/* Code Preview */}
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Code Preview</h2>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{template.code}</code>
            </pre>
          </div>

          {/* Comments Section */}
          <div className="bg-card rounded-lg p-6">
            <TemplateComments templateId={template._id} />
          </div>
        </div>

        {/* Ratings & Reviews */}
        <div className="lg:col-span-1">
          <TemplateRatings templateId={template._id} />
        </div>
      </div>
    </div>
  );
}
