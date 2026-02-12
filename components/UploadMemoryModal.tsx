"use client";

import { useState, useRef } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, Image as ImageIcon, Video } from "lucide-react";

export function UploadMemoryModal({ roomId, trigger }: { roomId: Id<"rooms">, trigger?: React.ReactNode }) {
    const generateUploadUrl = useMutation(api.memories.generateUploadUrl);
    const createMemory = useMutation(api.memories.create);

    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [caption, setCaption] = useState("");
    const [location, setLocation] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setIsLoading(true);
        try {
            // 1. Get upload URL
            const postUrl = await generateUploadUrl();

            // 2. Upload file
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });

            if (!result.ok) throw new Error("Upload failed");
            const { storageId } = await result.json();

            // 3. Create memory
            const type = file.type.startsWith("video") ? "video" : "image"; // simplified logic
            await createMemory({
                roomId,
                mediaStorageId: storageId,
                mediaType: type,
                caption,
                location,
            });

            setOpen(false);
            setFile(null);
            setCaption("");
        } catch (error) {
            console.error("Failed to upload memory:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Upload className="mr-2 h-4 w-4" /> Add Memory
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add to the Vault</DialogTitle>
                    <DialogDescription>
                        Upload a photo or video to share with the room.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg border-muted cursor-pointer hover:bg-accent/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}>

                            {file ? (
                                <div className="text-center">
                                    <p className="text-sm font-medium">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">Click to change</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <div className="flex gap-2">
                                        <ImageIcon className="h-8 w-8" />
                                        <Video className="h-8 w-8" />
                                    </div>
                                    <span className="text-sm">Click to select media</span>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,video/*"
                                className="hidden"
                                onChange={handleFileChange}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="caption">Caption</Label>
                            <Textarea
                                id="caption"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="What's happening in this moment?"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="location">Location (optional)</Label>
                            <Input
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g. Paris, France"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading || !file}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Upload
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
