'use client';

import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";
import { useEffect } from "react";

export default function MigratePage() {
  const migrate = useMutation(api.migrations.migrateSnippets);
  
  useEffect(() => {
    const runMigration = async () => {
      try {
        const result = await migrate();
        console.log('Migration completed:', result);
      } catch (error) {
        console.error('Migration failed:', error);
      }
    };
    
    runMigration();
  }, [migrate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Running Migration...</h1>
        <p>Please check the console for results.</p>
      </div>
    </div>
  );
}
