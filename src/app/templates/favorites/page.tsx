"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FavoriteTemplates } from "@/components/templates/favorite-templates";
import NavigationHeader from "@/components/NavigationHeader";

export default function FavoritesPage() {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn) {
    redirect("/");
  }

  return (
    <><NavigationHeader /><div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Favorite Templates</h1>
          <p className="text-muted-foreground">
            Your collection of favorite templates
          </p>
        </div>
        <FavoriteTemplates />
      </div>
    </div></>
  );
}
