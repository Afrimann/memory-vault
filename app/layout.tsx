import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider"; // Updated to named import

import UserSyncProvider from "@/components/UserSyncProvider";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs"; // Added ClerkProvider import
import { MobileHeader } from "@/components/MobileHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Keepsake | Private Memory Vault",
  description: "A secure, private space for your most indented memories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <ClerkProvider>
          <ConvexClientProvider>
            <UserSyncProvider>
              <MobileHeader />
              {children}
            </UserSyncProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
