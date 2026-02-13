"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CreateRoomModal } from "@/components/CreateRoomModal";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { UserMenu } from "@/components/UserMenu";
import { BackgroundPattern } from "@/components/ui/background-pattern";
import RoomCard from "@/components/RoomCard";

export default function DashboardPage() {
    const rooms = useQuery(api.rooms.list);

    return (
        <div className="min-h-screen p-4 md:p-8 relative overflow-hidden pb-20">
            <BackgroundPattern />
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 md:mb-12 relative z-10 w-full">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-4xl font-black tracking-tight text-foreground animate-in slide-in-from-left-8 fade-in duration-700">Your Rooms</h1>
                    <p className="text-muted-foreground text-sm md:text-base max-w-md animate-in slide-in-from-left-8 fade-in duration-700 delay-100 fill-mode-both">
                        Private spaces for your shared memories.
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto animate-in slide-in-from-right-8 fade-in duration-700 delay-200 fill-mode-both">
                    <div className="flex-1 md:flex-none">
                        <CreateRoomModal />
                    </div>
                    <UserMenu />
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {rooms === undefined ? (
                    // Loading state
                    Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-[200px] md:h-[220px] w-full rounded-2xl bg-muted/50" />
                    ))
                ) : rooms.length === 0 ? (
                    // Empty state
                    <div className="col-span-full flex flex-col items-center justify-center py-16 md:py-24 px-4 border border-dashed rounded-3xl border-muted-foreground/20 bg-muted/5 text-center">
                        <div className="bg-background p-4 rounded-full shadow-sm mb-4 animate-in zoom-in-50 duration-500">
                            <span className="text-4xl">✨</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Your Vault is Empty</h3>
                        <p className="text-muted-foreground mb-8 max-w-sm text-balance">
                            Create your first memory room to start preserving your shared moments safely.
                        </p>
                        <CreateRoomModal />
                    </div>
                ) : (
                    // List rooms
                    rooms.map((room, index) => (
                        <Link
                            key={room._id}
                            href={`/rooms/${room._id}`}
                            className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl animate-in fade-in zoom-in-50 duration-500 fill-mode-both hover:-translate-y-1 transition-transform"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <RoomCard room={room} />
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
