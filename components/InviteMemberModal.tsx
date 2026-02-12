"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, UserPlus, Loader2 } from "lucide-react";

export function InviteMemberModal({ roomId }: { roomId: Id<"rooms"> }) {
    const createInvite = useMutation(api.invitations.create);
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState<"member" | "viewer" | "admin">("member");
    const [inviteLink, setInviteLink] = useState("");
    const [isCopied, setIsCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const token = await createInvite({ roomId, role });
            const link = `${window.location.origin}/invite/${token}`;
            setInviteLink(link);
        } catch (error) {
            console.error("Failed to create invite:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const reset = () => {
        setInviteLink("");
        setIsCopied(false);
    }

    return (
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <UserPlus className="h-4 w-4" /> Invite
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Invite to Room</DialogTitle>
                    <DialogDescription>
                        Generate a unique link to share with someone.
                    </DialogDescription>
                </DialogHeader>

                {!inviteLink ? (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                Role
                            </Label>
                            <Select value={role} onValueChange={(v: any) => setRole(v)}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="viewer">Viewer (Read Only)</SelectItem>
                                    <SelectItem value="member">Member (Can Upload)</SelectItem>
                                    <SelectItem value="admin">Admin (Full Control)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleGenerate} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Generate Link
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 py-4">
                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="link" className="sr-only">
                                    Link
                                </Label>
                                <Input
                                    id="link"
                                    defaultValue={inviteLink}
                                    readOnly
                                />
                            </div>
                            <Button type="submit" size="sm" className="px-3" onClick={copyToClipboard}>
                                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                <span className="sr-only">Copy</span>
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                            This link expires in 7 days and can only be used once.
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
