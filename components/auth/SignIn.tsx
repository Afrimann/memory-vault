import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-muted/30 to-primary/5 px-4">
            <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
                    <p className="text-muted-foreground mt-2">Sign in to access your memory vault.</p>
                </div>
                <div className="flex justify-center">
                    <SignIn appearance={{
                        elements: {
                            rootBox: "w-full",
                            card: "shadow-xl border border-border/50 rounded-2xl bg-card/80 backdrop-blur-sm",
                        }
                    }} />
                </div>
            </div>
        </div>
    );
}
