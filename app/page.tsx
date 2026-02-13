import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, Shield, Heart, Infinity as InfinityIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20">

      {/* Navigation / Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 bg-background/50 backdrop-blur-xl border-b border-white/5 supports-[backdrop-filter]:bg-background/20 animate-in fade-in slide-in-from-top-full duration-1000">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Vault.</span>
        </div>

        <div className="flex items-center gap-4">
          <SignedIn>
            <Button variant="ghost" asChild className="rounded-full">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block mr-4">
              Manifesto
            </Link>
            <SignInButton mode="modal">
              <Button variant="ghost" className="rounded-full">Log in</Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button className="rounded-full px-6 shadow-lg shadow-primary/20">Get Started</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col items-center text-center z-10">
        {/* Atmospheric Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl -z-10 pointer-events-none animate-in fade-in duration-1000" />

        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-md text-xs font-medium text-secondary-foreground animate-in fade-in zoom-in-50 duration-700 delay-100 fill-mode-both">
            <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Re-imagining digital permanence
          </div>

          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9] text-balance bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
            Your memories, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500">safe forever.</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto font-light leading-relaxed text-balance animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both">
            Note just storage. A sanctuary.
            <br className="hidden md:block" />
            Share intimacy without the noise of social media.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both">
            <SignedIn>
              <Button size="lg" className="rounded-full h-14 px-8 text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform" asChild>
                <Link href="/dashboard">
                  Enter Your Vault <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="lg" className="rounded-full h-14 px-8 text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                  Create a Vault
                </Button>
              </SignInButton>
            </SignedOut>
            <Button variant="outline" size="lg" className="rounded-full h-14 px-8 text-lg backdrop-blur-sm bg-background/30 hover:bg-background/50">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive Preview - "The Glass Tablet" */}
      <section className="relative px-4 pb-32 z-10 animate-in fade-in zoom-in-95 duration-1000 delay-700 fill-mode-both">
        <div className="max-w-6xl mx-auto">
          <div className="relative h-[600px] md:h-auto md:aspect-video rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl overflow-hidden group perspective-1000 transition-all duration-1000 hover:rotate-x-2">
            {/* Reflection/Sheen */}
            <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-black/20 pointer-events-none z-20" />

            {/* UI Mockup Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full p-4 md:p-8 flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-hidden snap-x snap-mandatory opacity-80 group-hover:opacity-100 transition-opacity duration-700 scrollbar-hide">
                {/* Fake Masonry Grid of Memories */}
                <div className="space-y-4 md:space-y-6 pt-4 md:pt-12 min-w-[260px] md:min-w-0 snap-center">
                  <div className="relative aspect-3/4 rounded-xl overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700 fill-mode-both">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80"
                      alt="Group laughing"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-8 duration-700 delay-1000 fill-mode-both">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=80"
                      alt="Friends group"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div className="space-y-4 md:space-y-6 min-w-[260px] md:min-w-0 snap-center">
                  <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-8 duration-700 delay-1200 fill-mode-both">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
                      alt="Intimate portrait"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="relative aspect-3/4 rounded-xl bg-linear-to-b from-indigo-500/80 to-purple-600/80 border border-white/20 shadow-lg p-6 flex flex-col justify-end text-white animate-in fade-in slide-in-from-bottom-8 duration-700 delay-1400 fill-mode-both">
                    <div className="absolute inset-0 z-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80"
                        alt="Concert/Party"
                        className="w-full h-full object-cover opacity-60 mix-blend-overlay hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="relative z-10">
                      <p className="font-semibold text-lg drop-shadow-md">Summer Trip '24</p>
                      <p className="text-xs text-white/80">124 photos &bull; 5 videos</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 md:space-y-6 pt-8 md:pt-24 min-w-[260px] md:min-w-0 snap-center">
                  <div className="relative aspect-3/4 rounded-xl overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-8 duration-700 delay-1600 fill-mode-both">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80"
                      alt="Couple hugging"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-8 duration-700 delay-1800 fill-mode-both">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80"
                      alt="Rooftop party"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Overlay Text */}
            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
              <p className="text-sm font-medium tracking-[0.2em] text-white/50 uppercase mix-blend-overlay">
                Encryption &bull; Privacy &bull; Permanence
              </p>
            </div>
          </div>

          {/* Ambient Floor Reflection */}
          <div className="absolute top-[85%] left-1/2 -translate-x-1/2 w-[90%] h-32 bg-primary/20 blur-[100px] -z-10 rounded-[100%]" />
        </div>
      </section>

      {/* Philosophy / Features */}
      <section className="py-32 px-6 bg-muted/30 relative">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-background shadow-sm border flex items-center justify-center text-primary">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">End-to-End Private.</h3>
            <p className="text-muted-foreground leading-relaxed">
              Your memories are encrypted. No ad tracking, no algorithm, no prying eyes. Only those you invite can see.
            </p>
          </div>
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-background shadow-sm border flex items-center justify-center text-primary">
              <InfinityIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Full Fidelity.</h3>
            <p className="text-muted-foreground leading-relaxed">
              We store your photos and videos in their original quality. No compression artifacts. Preserve the moment exactly as it was.
            </p>
          </div>
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-background shadow-sm border flex items-center justify-center text-primary">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Small Circles.</h3>
            <p className="text-muted-foreground leading-relaxed">
              Designed for intimacy, not virality. Create rooms for family, partners, and close friends.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50 bg-background text-muted-foreground text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Memory Vault. Built for the long term.</p>
      </footer>
    </main>
  );
}
