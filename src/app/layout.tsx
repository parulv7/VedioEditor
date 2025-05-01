import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Video Editor Platform",
  description: "A web-based video editing tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100`}>
        <header className="w-full shadow-md bg-white/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="6" fill="#6366F1"/><path d="M7 8.5V15.5C7 16.3284 7.67157 17 8.5 17H15.5C16.3284 17 17 16.3284 17 15.5V8.5C17 7.67157 16.3284 7 15.5 7H8.5C7.67157 7 7 7.67157 7 8.5Z" fill="white"/><rect x="9" y="10" width="6" height="1.5" rx="0.75" fill="#6366F1"/><rect x="9" y="12.5" width="4" height="1.5" rx="0.75" fill="#6366F1"/></svg>
            <span className="text-2xl font-bold text-gray-800 tracking-tight">Video Editor</span>
            <span className="ml-auto text-sm text-gray-400 font-medium">by Your Team</span>
          </div>
        </header>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
