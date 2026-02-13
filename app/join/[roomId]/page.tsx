"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, ArrowRight } from "lucide-react";
import { BackgroundPattern } from "@/components/ui/background-pattern";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";

export default function JoinRoomPage() {
    const params = useParams();
    const roomId = params.roomId as Id<"rooms">;
    const router = useRouter();
    const { user, isLoaded } = useUser();

    const roomInfo = useQuery(api.rooms.getPublicInfo, { roomId });
    const joinRoom = useMutation(api.rooms.joinRoom);

    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await joinRoom({ roomId, code });
            router.push(`/rooms/${roomId}`);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Incorrect access code");
            setIsLoading(false);
        }
    };

    if (roomInfo === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (roomInfo === null) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-destructive">Room Not Found</CardTitle>
                        <CardDescription>
                            This room does not exist or has been deleted.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="outline" onClick={() => router.push("/dashboard")}>
                            Return to Dashboard
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <BackgroundPattern />

            <Card className="w-full max-w-md shadow-2xl border-border/50 bg-background/80 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-700">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto bg-muted rounded-full p-4 w-16 h-16 flex items-center justify-center mb-2 animate-in zoom-in-50 duration-500 delay-100 fill-mode-both">
                        <Lock className="h-8 w-8 text-muted-foreground animate-pulse" />
                    </div>
                    <CardTitle className="text-2xl font-bold animate-in slide-in-from-bottom-2 duration-500 delay-200 fill-mode-both">{roomInfo.name}</CardTitle>
                    <CardDescription className="animate-in slide-in-from-bottom-2 duration-500 delay-300 fill-mode-both">
                        This room is protected. Enter the access code to join.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SignedOut>
                        <div className="text-center space-y-4 py-4 animate-in fade-in duration-500 delay-400 fill-mode-both">
                            <p className="text-sm text-muted-foreground">
                                You must be signed in to join a private memory vault.
                            </p>
                            <SignInButton mode="modal">
                                <Button className="w-full shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform" size="lg">Sign In to Continue</Button>
                            </SignInButton>
                        </div>
                    </SignedOut>
                    <SignedIn>
                        <form onSubmit={handleJoin} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400 fill-mode-both">
                            <div className="space-y-2">
                                <Label htmlFor="code">Access Code</Label>
                                <Input
                                    id="code"
                                    type="password"
                                    placeholder="Enter secret code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="text-center text-lg tracking-widest transition-all focus:scale-[1.01]"
                                    autoFocus
                                />
                            </div>
                            {error && (
                                <p className="text-sm text-destructive text-center font-medium animate-in slide-in-from-top-1">
                                    {error}
                                </p>
                            )}
                            <Button type="submit" className="w-full shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform" disabled={isLoading || !code}>
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <ArrowRight className="mr-2 h-4 w-4" />
                                )}
                                Verify & Join
                            </Button>
                        </form>
                    </SignedIn>
                </CardContent>
                <CardFooter className="justify-center border-t border-border/50 pt-6">
                    <p className="text-xs text-muted-foreground">
                        Don't have the code? Ask the room owner.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
