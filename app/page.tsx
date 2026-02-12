import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-linear-to-b from-background to-muted/20">
      <div className="absolute top-4 right-4">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="ghost">Sign In</Button>
          </SignInButton>
        </SignedOut>
      </div>

      <div className="max-w-3xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground/90">
            Keep what matters.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
            A private, permanent vault for your most cherished memories.
            Shared only with the people who lived them with you.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <SignedIn>
            <Button asChild size="lg" className="rounded-full px-8 h-12 text-lg shadow-lg hover:shadow-xl transition-all">
              <Link href="/dashboard">Enter Vault</Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="lg" className="rounded-full px-8 h-12 text-lg shadow-lg hover:shadow-xl transition-all">
                Get Started
              </Button>
            </SignInButton>
          </SignedOut>
          <Button variant="outline" asChild size="lg" className="rounded-full px-8 h-12 text-lg hover:bg-muted/50">
            <Link href="/about">Our Philosophy</Link>
          </Button>
        </div>

        <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-muted-foreground">
          <div className="flex flex-col items-center gap-2">
            <span className="bg-primary/5 p-3 rounded-full">🔒</span>
            <p>Private & Secure</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="bg-primary/5 p-3 rounded-full">✨</span>
            <p>Full Resolution</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="bg-primary/5 p-3 rounded-full">💌</span>
            <p>Invite Only</p>
          </div>
        </div>
      </div>
    </main>
  );
}
