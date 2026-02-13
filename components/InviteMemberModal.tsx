"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, UserPlus, Loader2, Lock } from "lucide-react";

export function InviteMemberModal({ roomId, trigger }: { roomId: Id<"rooms">, trigger?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const setAccessCode = useMutation(api.rooms.setAccessCode);
    const room = useQuery(api.rooms.get, { roomId });

    const [step, setStep] = useState<"loading" | "set-code" | "share">("loading");
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // Determine initial step based on room state
    // We can't do this easily in useEffect because `room` loads async.
    // Instead render conditional content.

    const handleSetCode = async () => {
        setIsLoading(true);
        try {
            await setAccessCode({ roomId, code });
            // Move to share state
        } catch (error) {
            console.error("Failed to set code:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const inviteLink = typeof window !== "undefined" ? `${window.location.origin}/join/${roomId}` : "";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const hasCode = room?.hasInviteCode;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="gap-2">
                        <UserPlus className="h-4 w-4" /> Invite
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Invite to Room</DialogTitle>
                    <DialogDescription>
                        {hasCode
                            ? "Share the link and access code with your friends."
                            : "Set a secure access code to invite members."}
                    </DialogDescription>
                </DialogHeader>

                {room === undefined ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : !hasCode ? (
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Create Room Access Code</Label>
                            <Input
                                id="code"
                                type="text"
                                placeholder="ex. secret123"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                This code will be required for anyone to join. It cannot be recovered if forgotten, only reset.
                            </p>
                        </div>
                        <Button onClick={handleSetCode} disabled={isLoading || code.length < 3}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Set Code & Get Link
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 py-4">
                        <div className="space-y-2">
                            <Label>Invite Link</Label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    value={inviteLink}
                                    readOnly
                                    className="bg-muted/50"
                                />
                                <Button type="button" size="icon" variant="outline" onClick={copyToClipboard}>
                                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
                            <div className="flex items-start gap-3">
                                <Lock className="h-5 w-5 text-yellow-600 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-yellow-600">Don't forget the code!</p>
                                    <p className="text-xs text-yellow-600/90 leading-relaxed">
                                        You must share the <strong>Access Code</strong> manually with your friends. For security, we don't display it here.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
