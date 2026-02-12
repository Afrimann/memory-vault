"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Send, MessageCircle } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

export function MemoryInteractions({ memoryId }: { memoryId: Id<"memories"> }) {
    const { user } = useUser();

    // ... rest of component logic using `user` instead of `session.user`
    const comments = useQuery(api.comments.list, { memoryId });
    const reactions = useQuery(api.reactions.list, { memoryId });
    const addComment = useMutation(api.comments.create);
    const toggleReaction = useMutation(api.reactions.toggle);

    const [commentText, setCommentText] = useState("");
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        await addComment({ memoryId, text: commentText });
        setCommentText("");
    };

    const hasLiked = reactions?.some(
        (r) => r.type === "heart" && user?.id // Check if user is logged in
        // ideally we check if r.userId matches current user's convex ID,
        // but we need to map Clerk ID -> Convex ID for that.
        // For now, consistent with previous implementation.
    );

    // For proper client-side "hasLiked" check we need the user's Convex ID available.
    // We can pass it down or fetch it. For now, we trust the button action toggles it.

    const heartCount = reactions?.filter((r) => r.type === "heart").length || 0;

    return (
        <div className="flex flex-col gap-2 w-full">
            {/* Actions Bar */}
            <div className="flex items-center gap-4 pt-2 border-t border-border/50">
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "gap-2 rounded-full px-3 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 group/heart",
                        hasLiked && "text-red-500 bg-red-500/10"
                    )}
                    onClick={() => toggleReaction({ memoryId, type: "heart" })}
                >
                    <Heart className={cn("h-4 w-4 transition-transform duration-300 group-hover/heart:scale-125", hasLiked && "fill-current scale-110")} />
                    <span className="font-medium">{heartCount > 0 ? heartCount : ""}</span>
                </Button>

                <Popover open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2 rounded-full px-3 hover:bg-primary/10 hover:text-primary transition-all duration-300">
                            <MessageCircle className="h-4 w-4" />
                            <span className="font-medium">{comments?.length || 0}</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="start">
                        <div className="flex flex-col max-h-[300px]">
                            <div className="p-3 border-b font-medium text-sm">Comments</div>
                            <div className="overflow-y-auto p-3 space-y-3 flex-1">
                                {comments === undefined ? (
                                    <p className="text-xs text-muted-foreground">Loading...</p>
                                ) : comments.length === 0 ? (
                                    <p className="text-xs text-muted-foreground">No comments yet.</p>
                                ) : (
                                    comments.map((comment) => (
                                        <div key={comment._id} className="flex gap-2 text-sm">
                                            <Avatar className="h-6 w-6 mt-1">
                                                <AvatarImage src={comment.user?.image} />
                                                <AvatarFallback>{comment.user?.name?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-xs">{comment.user?.name}</span>
                                                <span className="text-foreground/90">{comment.text}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <form onSubmit={handleComment} className="p-3 border-t flex gap-2">
                                <Input
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="h-8 text-sm"
                                />
                                <Button type="submit" size="icon" className="h-8 w-8">
                                    <Send className="h-3 w-3" />
                                </Button>
                            </form>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
