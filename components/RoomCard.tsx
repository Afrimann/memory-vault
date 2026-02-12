"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RoomCardProps {
    room: {
        _id: string;
        name: string;
        description?: string;
        createdAt?: number; // Convex usually stores timestamp as number
    };
}

export default function RoomCard({ room }: RoomCardProps) {
    return (
        <Card className="group relative h-full overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:bg-card/60 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20">
            <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <CardHeader className="relative space-y-1 pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="line-clamp-1 text-xl font-semibold tracking-tight text-foreground/90 group-hover:text-primary transition-colors">
                        {room.name}
                    </CardTitle>
                    <Lock className="h-4 w-4 text-muted-foreground/50" />
                </div>
            </CardHeader>

            <CardContent className="relative space-y-4">
                <CardDescription className="line-clamp-2 min-h-10 text-sm leading-relaxed">
                    {room.description || "No description provided."}
                </CardDescription>

                <div className="flex items-center justify-between text-xs text-muted-foreground/70">
                    <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>Private Group</span>
                    </div>
                    {room.createdAt && (
                        <span>{formatDistanceToNow(room.createdAt, { addSuffix: true })}</span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
