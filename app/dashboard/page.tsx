"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CreateRoomModal } from "@/components/CreateRoomModal";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { UserMenu } from "@/components/UserMenu";
import { RoomCard } from "@/components/RoomCard"; // Added import

export default function DashboardPage() {
    const rooms = useQuery(api.rooms.list);

    return (
        <div className="min-h-screen bg-background p-8">
            <header className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Rooms</h1>
                    <p className="text-muted-foreground mt-1">
                        Private spaces for your shared memories.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <CreateRoomModal />
                    <UserMenu />
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {rooms === undefined ? (
                    // Loading state
                    Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-[220px] w-full rounded-2xl bg-muted/50" />
                    ))
                ) : rooms.length === 0 ? (
                    // Empty state
                    <div className="col-span-full flex flex-col items-center justify-center py-24 px-4 border border-dashed rounded-3xl border-muted-foreground/20 bg-muted/5 text-center">
                        <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                            <span className="text-4xl">✨</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Your Vault is Empty</h3>
                        <p className="text-muted-foreground mb-8 max-w-sm">
                            Create your first memory room to start preserving your shared moments safely.
                        </p>
                        <CreateRoomModal />
                    </div>
                ) : (
                    // List rooms
                    rooms.map((room) => (
                        <Link key={room._id} href={`/rooms/${room._id}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
                            <RoomCard room={room} />
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
