import { useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

export function useTemplateFavorites() {
  const favorites = useQuery(api.templateFavorites.getFavoriteTemplates);
  const isFavorited = useCallback(
    (templateId: Id<"marketplaceTemplates">) => {
      return favorites?.some((template) => template._id === templateId) ?? false;
    },
    [favorites]
  );

  const addToFavorites = useMutation(api.templateFavorites.addToFavorites);
  const removeFromFavorites = useMutation(api.templateFavorites.removeFromFavorites);

  const toggleFavorite = useCallback(
    async (templateId: Id<"marketplaceTemplates">) => {
      try {
        if (isFavorited(templateId)) {
          await removeFromFavorites({ templateId });
          toast.success("Removed from favorites");
        } else {
          await addToFavorites({ templateId });
          toast.success("Added to favorites");
        }
      } catch (error) {
        toast.error("Error updating favorites");
        console.error("Error toggling favorite:", error);
      }
    },
    [addToFavorites, removeFromFavorites, isFavorited]
  );

  return {
    favorites,
    isFavorited,
    toggleFavorite,
  };
}
