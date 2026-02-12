"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileFabProps {
    children: React.ReactNode;
}

export function MobileFab({ children }: MobileFabProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 md:hidden flex flex-col items-end gap-3">
            {/* Speed Dial Actions */}
            <div className={cn(
                "flex flex-col gap-3 transition-all duration-300 ease-in-out origin-bottom",
                isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none absolute bottom-16 right-0"
            )}>
                {children}
            </div>

            {/* Main Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="icon"
                className={cn(
                    "h-14 w-14 rounded-full shadow-2xl transition-transform duration-300",
                    isOpen && "rotate-45"
                )}
            >
                <Plus className="h-6 w-6" />
            </Button>
        </div>
    );
}
