import { BackgroundPattern } from "@/components/ui/background-pattern";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-6 overflow-hidden">
      <BackgroundPattern />

      <div className="absolute top-4 right-4 z-50">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="ghost">Sign In</Button>
          </SignInButton>
        </SignedOut>
      </div>

      <div className="relative z-10 max-w-4xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="space-y-6">
          <div className="inline-block rounded-full bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground backdrop-blur-md border border-border/50 mb-4 animate-in fade-in zoom-in-50 duration-700 delay-200">
            ✨ Re-imagining Digital Memory
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight text-foreground drop-shadow-sm leading-tight text-balance">
            Keep what <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-600">matters.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto text-balance">
            A private, permanent vault for your most cherished memories.
            <br className="hidden md:block" />
            Shared only with the people who lived them with you.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <SignedIn>
            <Button asChild size="lg" className="rounded-full px-8 h-12 text-lg font-medium shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all hover:-translate-y-0.5">
              <Link href="/dashboard">Enter Vault</Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="lg" className="rounded-full px-8 h-12 text-lg font-medium shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all hover:-translate-y-0.5">
                Get Started
              </Button>
            </SignInButton>
          </SignedOut>
          <Button variant="outline" asChild size="lg" className="rounded-full px-8 h-12 text-lg border-muted-foreground/20 hover:bg-muted/50 backdrop-blur-sm transition-all hover:-translate-y-0.5">
            <Link href="/about">Our Philosophy</Link>
          </Button>
        </div>

        <div className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground max-w-3xl mx-auto">
          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-muted/30 backdrop-blur-sm border border-border/10 hover:bg-muted/50 transition-colors">
            <span className="bg-background/80 p-3 rounded-xl shadow-sm border border-border/20 text-2xl">🔒</span>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">Private & Secure</p>
              <p className="text-xs text-balance opacity-80">End-to-end encrypted design philosophy.</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-muted/30 backdrop-blur-sm border border-border/10 hover:bg-muted/50 transition-colors">
            <span className="bg-background/80 p-3 rounded-xl shadow-sm border border-border/20 text-2xl">✨</span>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">Full Resolution</p>
              <p className="text-xs text-balance opacity-80">Store memories exactly as you remember them.</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-muted/30 backdrop-blur-sm border border-border/10 hover:bg-muted/50 transition-colors">
            <span className="bg-background/80 p-3 rounded-xl shadow-sm border border-border/20 text-2xl">💌</span>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">Invite Only</p>
              <p className="text-xs text-balance opacity-80">Curated spaces for close circles.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
