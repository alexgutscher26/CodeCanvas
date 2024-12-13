"use client";

import { useTemplateFavorites } from "@/hooks/useTemplateFavorites";
import { EmptyPlaceholder } from "@/components/ui/empty-placeholder";
import { BookmarkIcon } from "lucide-react";
import TemplateCard from "@/app/marketplace/components/TemplateCard";

export function FavoriteTemplates() {
  const { favorites } = useTemplateFavorites();

  if (!favorites || favorites.length === 0) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon>
          <BookmarkIcon className="h-8 w-8" />
        </EmptyPlaceholder.Icon>
        <EmptyPlaceholder.Title>No favorite templates</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          You haven&apos;t favorited any templates yet. Browse the marketplace to find
          templates you like.
        </EmptyPlaceholder.Description>
      </EmptyPlaceholder>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {favorites.map((template) => (
        <TemplateCard key={template._id} template={template} />
      ))}
    </div>
  );
}
