"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export default function UserSyncProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useUser();
    const syncUser = useMutation(api.users.syncUser);

    useEffect(() => {
        if (user) {
            console.log("Syncing user to Convex:", user.id);
            syncUser({
                externalId: user.id,
                email: user.primaryEmailAddress?.emailAddress ?? "",
                name: user.fullName ?? user.username ?? "Anonymous",
                image: user.imageUrl,
            })
                .then((id) => console.log("User synced, ID:", id))
                .catch((err) => {
                    console.error("Failed to sync user with Convex:", err);
                });
        }
    }, [user, syncUser]);

    return <>{children}</>;
}
