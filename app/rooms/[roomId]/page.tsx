"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { UploadMemoryModal } from "@/components/UploadMemoryModal";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical, Heart, ArrowLeft, Upload, UserPlus } from "lucide-react";
import Link from "next/link";
import { MemoryInteractions } from "@/components/MemoryInteractions";
import { InviteMemberModal } from "@/components/InviteMemberModal";
import { BackgroundPattern } from "@/components/ui/background-pattern";
import { MobileFab } from "@/components/MobileFab";

export default function RoomPage() {
    const params = useParams();
    const roomId = params.roomId as Id<"rooms">;

    const room = useQuery(api.rooms.get, { roomId });
    const memories = useQuery(api.memories.list, { roomId });

    if (room === undefined) {
        return (<div className="min-h-screen p-4 md:p-8 space-y-8 relative overflow-hidden"> <BackgroundPattern /> <Skeleton className="h-56 md:h-96 w-full rounded-3xl" /> <div className="space-y-6 max-w-2xl mx-auto">
            {[1, 2, 3].map((i) => (<Skeleton key={i} className="h-80 rounded-2xl" />
            ))} </div> </div>
        );
    }

    if (room === null) {
        return (<div className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-4 relative overflow-hidden"> <BackgroundPattern /> <div className="bg-muted p-6 rounded-full"> <span className="text-4xl">🔒</span> </div> <h2 className="text-2xl font-bold">Access Denied</h2> <p className="text-muted-foreground max-w-md">
            This room does not exist or you do not have permission to view it. </p> <Button asChild variant="outline"> <Link href="/dashboard">Return to Dashboard</Link> </Button> </div>
        );
    }

    return (<div className="min-h-screen pb-24 relative"> <BackgroundPattern />

        {/* HERO HEADER (MOBILE OPTIMIZED) */}
        <div className="relative h-[26vh] min-h-[220px] md:h-[42vh] md:min-h-[420px] w-full overflow-hidden">

            {room.coverImage ? (
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${room.coverImage})` }}
                />
            ) : (
                <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10" />
            )}

            <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />

            {/* Back Button */}
            <div className="absolute top-4 left-4 z-50">
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-background/30 backdrop-blur-md border-white/10"
                    asChild
                >
                    <Link href="/dashboard">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
            </div>

            {/* Title */}
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-10 z-10 text-center space-y-2">
                <h1 className="text-2xl md:text-5xl font-bold tracking-tight animate-in slide-in-from-bottom-2 fade-in duration-700">
                    {room.name}
                </h1>

                {room.description && (
                    <p className="text-muted-foreground text-sm md:text-lg max-w-xl mx-auto">
                        {room.description}
                    </p>
                )}

                <p className="text-xs text-muted-foreground">
                    {memories?.length || 0} memories
                </p>

                {/* Desktop toolbar */}
                <div className="hidden md:flex justify-center gap-3 pt-4">
                    <InviteMemberModal roomId={roomId} />
                    <UploadMemoryModal roomId={roomId} />
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>

        {/* FEED */}
        <div className="px-4 mt-8">
            {memories === undefined ? (
                <div className="space-y-6 max-w-2xl mx-auto">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-80 rounded-2xl" />
                    ))}
                </div>
            ) : memories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 border-2 border-dashed border-muted rounded-3xl bg-muted/5 max-w-xl mx-auto">
                    <div className="p-4 bg-background rounded-full shadow-sm">
                        <Heart className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-semibold">No memories yet</h3>
                        <p className="text-muted-foreground">
                            Upload the first moment in this room ❤️
                        </p>
                    </div>
                </div>
            ) : (

                <div className="max-w-4xl mx-auto pb-20">
                    <div className="flex flex-col gap-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                        {memories.map((memory: any, index: number) => (
                            <div
                                key={memory._id}
                                className="bg-card border border-border/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-500 flex flex-col animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* CARD HEADER */}
                                <div className="flex items-center justify-between p-4 bg-background/50 backdrop-blur-sm">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                                            <AvatarImage src={memory.uploader?.image} />
                                            <AvatarFallback className="text-xs">
                                                {memory.uploader?.name?.[0] || "?"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-foreground">
                                                {memory.uploader?.name?.split(" ")[0] || "Someone"}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">
                                                {new Date(memory._creationTime).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* MEDIA */}
                                <div className="relative aspect-4/5 bg-muted w-full">
                                    {memory.mediaType === "video" ? (
                                        <video
                                            src={memory.mediaUrl}
                                            className="w-full h-full object-cover"
                                            controls
                                        />
                                    ) : (
                                        <img
                                            src={memory.mediaUrl}
                                            alt={memory.caption || "Memory"}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    )}
                                </div>

                                {/* ACTION BAR & CAPTION */}
                                <div className="p-4 space-y-3 bg-background">
                                    {/* Actions */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <MemoryInteractions memoryId={memory._id} />
                                        </div>
                                        {/* Placeholder for bookmark/share if needed later */}
                                    </div>

                                    {/* Caption */}
                                    {memory.caption && (
                                        <div className="space-y-1">
                                            <p className="text-sm leading-relaxed text-foreground/90">
                                                <span className="font-semibold mr-2 text-foreground">
                                                    {memory.uploader?.name?.split(" ")[0]}:
                                                </span>
                                                {memory.caption}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
            }
        </div>

        {/* MOBILE FAB */}
        <MobileFab>
            <div className="flex items-center gap-3">
                <span className="bg-background/80 backdrop-blur px-2 py-1 rounded-md text-xs font-medium shadow-sm">Invite</span>
                <InviteMemberModal
                    roomId={roomId}
                    trigger={
                        <Button size="icon" variant="outline" className="h-10 w-10 rounded-full shadow-lg bg-background">
                            <UserPlus className="h-5 w-5" />
                        </Button>
                    }
                />
            </div>
            <div className="flex items-center gap-3">
                <span className="bg-background/80 backdrop-blur px-2 py-1 rounded-md text-xs font-medium shadow-sm">Upload</span>
                <UploadMemoryModal
                    roomId={roomId}
                    trigger={
                        <Button size="icon" variant="default" className="h-10 w-10 rounded-full shadow-lg">
                            <Upload className="h-5 w-5" />
                        </Button>
                    }
                />
            </div>
        </MobileFab>

    </div>

    );
}
