import * as React from "react";

export function EmptyPlaceholder({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-[#ffffff0a] bg-[#121218] p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

EmptyPlaceholder.Icon = function EmptyPlaceHolderIcon({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1e1e2e]">
      <div className="h-10 w-10 text-gray-400">{children}</div>
    </div>
  );
};

EmptyPlaceholder.Title = function EmptyPlaceholderTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h2 className="mt-6 text-xl font-semibold text-white">{children}</h2>
  );
};

EmptyPlaceholder.Description = function EmptyPlaceholderDescription({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="mt-3 mb-8 text-center text-sm text-gray-400">
      {children}
    </p>
  );
};
