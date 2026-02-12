"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function InvitePage() {
    const params = useParams();
    const token = params.token as string;
    const router = useRouter();
    const { user } = useUser(); // Ensure auth

    const data = useQuery(api.invitations.getByToken, { token });
    const acceptInvite = useMutation(api.invitations.accept);

    const [isAccepting, setIsAccepting] = useState(false);
    const [error, setError] = useState("");

    const handleJoin = async () => {
        setIsAccepting(true);
        try {
            const roomId = await acceptInvite({ token });
            router.push(`/rooms/${roomId}`);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to join room");
            setIsAccepting(false);
        }
    };

    if (data === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (data === null) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-red-500">Invalid Invite</CardTitle>
                        <CardDescription>
                            This invitation link is invalid, expired, or has already been used.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="outline" onClick={() => router.push("/dashboard")}>
                            Go to Dashboard
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-background via-muted/30 to-primary/5">
            <Card className="w-full max-w-md text-center shadow-xl border-border/50 animate-in fade-in zoom-in-95 duration-500">
                <CardHeader>
                    <CardTitle>You've been invited!</CardTitle>
                    <CardDescription>
                        You have been invited to join the <strong>{data.room?.name}</strong> memory vault.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-24 w-full bg-muted rounded-md mb-4 overflow-hidden relative">
                        {data.room?.coverImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={data.room.coverImage} alt="Cover" className="w-full h-full object-cover" />
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Join as <strong>{data.invite.role}</strong> using {user?.primaryEmailAddress?.emailAddress}
                    </p>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </CardContent>
                <CardFooter className="flex justify-center gap-2">
                    <Button variant="outline" onClick={() => router.push("/dashboard")}>Cancel</Button>
                    <Button onClick={handleJoin} disabled={isAccepting}>
                        {isAccepting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Join Room
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
