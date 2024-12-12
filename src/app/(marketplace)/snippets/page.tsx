import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Code Snippets Marketplace",
  description: "Browse and download professional code snippets and templates",
};

export default async function SnippetsPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Code Snippets</h1>
          <p className="text-muted-foreground">
            Browse our collection of professional code snippets and templates
          </p>
        </div>
        <div className="flex flex-col gap-6 md:flex-row">
          <aside className="md:w-1/4">
          </aside>
          <main className="flex-1">
          </main>
        </div>
      </div>
    </div>
  );
}
