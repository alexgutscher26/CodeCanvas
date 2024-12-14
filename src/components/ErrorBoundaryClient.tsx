'use client';

import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback() {
  return (
    <div className="text-center py-10">
      <p className="text-red-500">Something went wrong. Please try again later.</p>
    </div>
  );
}

export function ErrorBoundaryClient({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>;
}
