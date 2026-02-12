"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { UserMenu } from "./UserMenu";

export function MobileHeader() {
    const router = useRouter();
    const pathname = usePathname();

    // Show back button if deep in navigation (e.g. /rooms/xyz)
    const showBack = pathname.split('/').length > 2;
    const isDashboard = pathname === '/dashboard';

    if (pathname === '/') return null; // Don't show on landing page

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
            <div className="flex h-14 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    {showBack && (
                        <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    )}
                    <span className="font-semibold text-lg tracking-tight">
                        {isDashboard ? "Keepsake" : "Memory"}
                    </span>
                </div>
                <UserMenu />
            </div>
        </header>
    );
}
