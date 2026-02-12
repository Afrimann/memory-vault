"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { UploadMemoryModal } from "@/components/UploadMemoryModal";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus, MoreVertical, Heart, MessageCircle } from "lucide-react";
import Image from "next/image"; // Standard Next Image
import { MemoryInteractions } from "@/components/MemoryInteractions";
import { InviteMemberModal } from "@/components/InviteMemberModal";

export default function RoomPage() {
    const params = useParams();
    const roomId = params.roomId as Id<"rooms">;

    const room = useQuery(api.rooms.get, { roomId });
    const memories = useQuery(api.memories.list, { roomId });

    if (room === undefined) {
        return (
            <div className="min-h-screen bg-background p-4 md:p-8 space-y-8">
                <Skeleton className="h-64 md:h-96 w-full rounded-3xl" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-64 rounded-2xl" />
                    <Skeleton className="h-64 rounded-2xl" />
                    <Skeleton className="h-64 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (room === null) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="bg-muted p-6 rounded-full">
                    <span className="text-4xl">🔒</span>
                </div>
                <h2 className="text-2xl font-bold">Access Denied</h2>
                <p className="text-muted-foreground max-w-md">This room does not exist or you do not have permission to view it.</p>
                <Button asChild variant="outline">
                    <a href="/dashboard">Return to Dashboard</a>
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Header */}
            <div className="relative h-64 md:h-96 w-full overflow-hidden">
                {room.coverImage ? (
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${room.coverImage})` }} />
                ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-background to-accent/20" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
                    <div className="max-w-7xl mx-auto space-y-4">
                        <div className="flex items-start md:items-end justify-between flex-col md:flex-row gap-4">
                            <div className="space-y-2">
                                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground shadow-sm">{room.name}</h1>
                                <p className="text-muted-foreground text-lg md:text-xl max-w-2xl text-balance font-light leading-relaxed">{room.description}</p>
                            </div>
                            <div className="flex items-center gap-3 bg-background/50 backdrop-blur-md p-2 rounded-full border border-border/50 shadow-sm">
                                <InviteMemberModal roomId={roomId} />
                                <UploadMemoryModal roomId={roomId} />
                                <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="h-5 w-5" /></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Memories Grid */}
            <div className="px-4 md:px-8 max-w-7xl mx-auto mt-8">
                {memories === undefined ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-80 rounded-2xl" />)}
                    </div>
                ) : memories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 border-2 border-dashed border-muted rounded-3xl bg-muted/5">
                        <div className="p-4 bg-background rounded-full shadow-sm">
                            <Heart className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-semibold">This room is empty</h3>
                            <p className="text-muted-foreground">Upload the first memory to start preserving moments.</p>
                        </div>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {memories?.map((memory: any) => (
                            <div key={memory._id} className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-card border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                                {/* Media Display */}
                                <div className="relative w-full bg-muted">
                                    {memory.mediaType === "video" ? (
                                        <video src={memory.mediaUrl!} controls className="w-full h-auto object-cover" />
                                    ) : (
                                        // Using standard img for now to handle signed URLs easily, later optimize with Image
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={memory.mediaUrl!}
                                            alt={memory.caption || "Memory"}
                                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    )}
                                </div>

                                {/* Caption & Actions */}
                                <div className="p-5 space-y-4">
                                    {memory.caption && <p className="text-base text-foreground/90 font-medium leading-normal">{memory.caption}</p>}

                                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                            <Avatar className="h-6 w-6 ring-2 ring-background">
                                                <AvatarImage src={memory.uploader?.image} />
                                                <AvatarFallback>{memory.uploader?.name?.[0] || "?"}</AvatarFallback>
                                            </Avatar>
                                            <span>{memory.uploader?.name?.split(" ")[0] || "Someone"}</span>
                                            <span className="text-muted-foreground/50">•</span>
                                            <span>{new Date(memory._creationTime).toLocaleDateString()}</span>
                                        </div>
                                        <MemoryInteractions memoryId={memory._id} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
