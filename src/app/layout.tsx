import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import UXProvider from "@/components/providers/UXProvider";
import ClerkClientProvider from "@/components/providers/ClerkClientProvider";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Code Canvas Share And Run Code Snippets",
    template: "%s | Code Canvas",
  },
  description: "Share and run code snippets with real-time collaboration",
  keywords: ["code editor", "snippets", "collaboration", "development", "programming"],
  authors: [
    {
      name: "Code Canvas Team",
    },
  ],
  creator: "Code Canvas Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://codecanvas.dev",
    title: "Code Canvas",
    description: "Share and run code snippets with real-time collaboration",
    siteName: "Code Canvas",
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Canvas",
    description: "Share and run code snippets with real-time collaboration",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkClientProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 flex flex-col`}
        >
          <ConvexClientProvider>
            <UXProvider>
              {children}
            </UXProvider>
          </ConvexClientProvider>

          <Footer />
          <Toaster />
        </body>
      </html>
    </ClerkClientProvider>
  );
}

// https://emkc.org/api/v2/piston/runtimes
