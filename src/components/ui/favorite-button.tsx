import { Heart } from "lucide-react";
import { useTemplateFavorites } from "@/hooks/useTemplateFavorites";
import { Id } from "../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  templateId: Id<"marketplaceTemplates">;
  className?: string;
}

export default function FavoriteButton({ templateId, className }: FavoriteButtonProps) {
  const { isFavorited, toggleFavorite } = useTemplateFavorites();
  const favorited = isFavorited(templateId);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(templateId)}
      className={cn(
        "group p-2 rounded-lg hover:bg-gray-800/50 active:scale-95 transition-all duration-200",
        favorited && "text-red-500",
        className
      )}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart 
        className={cn(
          "h-4 w-4 transition-all duration-200",
          favorited ? "fill-current" : "group-hover:fill-current group-hover:text-red-500/50"
        )} 
      />
    </button>
  );
}
