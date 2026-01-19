"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Shield, Users, Zap, LayoutDashboard, Twitter, Instagram, Facebook, Youtube, LucideLayoutDashboard, LayoutDashboardIcon, CheckCircle2 } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

const featuresListing = [
  "Group conversation",
  "One to one chat",
  "Video calling",
  "Screen sharing",
  "File uploads",
  "Role management",
  "Instant invites",
  "Real-time status",
  "Channel categories"
]

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % featuresListing.length);
    }, 2000); // 2s total: 0.5s fade + 1s solid visibility + 0.5s fade
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary/20">
      <Navbar />

      <main className="flex-1 w-full overflow-hidden">
        {/* Hero Section */}
        <section className="relative w-full pt-20 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center text-center space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10 justify-center">
                <div className="relative h-5 flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="whitespace-nowrap flex items-center"
                    >

                      <span className="flex h-2 w-2 rounded-full bg-primary mr-3 animate-pulse shrink-0"></span>
                      {featuresListing[index]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-5xl">
                Your Place to <span className="text-primary relative inline-block">
                  Talk
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                  </svg>
                </span>, <span className="text-secondary-foreground">Play</span>, and <span className="text-primary">Hang Out</span>
              </h1>

              <p className="mx-auto max-w-2xl text-muted-foreground text-lg md:text-xl leading-relaxed">
                Strikes is the only platform you need to build your community.
                Low-latency voice, HD video, and organized channels for every topic.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
                <SignedOut>
                  <Link href="/sign-up">
                    <Button size="lg" className="h-14 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-lg shadow-primary/25 w-full sm:w-auto">
                      <LayoutDashboardIcon className="mr-2 h-5 w-5" />
                      Create Account
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button variant="secondary" size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg w-full sm:w-auto">
                      Login to Strikes
                    </Button>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link href={`/setup`}>
                    <Button size="lg" className="h-14 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-lg shadow-primary/25 w-full sm:w-auto">
                      <LayoutDashboard className="mr-2 h-5 w-5" />
                      Go to profile
                    </Button>
                  </Link>
                </SignedIn>
              </div>

              {/* Hero Image Mockup */}
              <div className="mt-12 w-full max-w-6xl mx-auto rounded-3xl border border-primary/20 shadow-2xl bg-secondary/20 overflow-hidden relative aspect-video md:aspect-16/8 flex justify-center items-center group">
                <DottedGlowBackground
                  color="#5865F2"
                  glowColor="#5865F2"
                  colorLightVar="--primary-color"
                  colorDarkVar="--primary-color"
                  glowColorLightVar="--primary-color"
                  glowColorDarkVar="--primary-color"
                />

                {/* Content */}
                <div className="flex flex-col items-center justify-center z-10 transition-transform duration-700 group-hover:scale-105">
                  <span className="text-6xl md:text-8xl lg:text-9xl font-black bg-linear-to-b from-foreground to-foreground/50 bg-clip-text text-transparent select-none tracking-tighter leading-none">
                    STRIKES
                  </span>
                  <span className="text-xl md:text-3xl lg:text-4xl font-semibold text-primary tracking-[0.2em] uppercase select-none mt-1 md:mt-2">
                    Community
                  </span>
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid / Feature Highlights */}
        <section className="py-20 bg-muted/30">
          <div className="container px-4 mx-auto">
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Features built for <span className="text-primary">connection</span></h2>
              <p className="text-muted-foreground text-lg">Everything you need to run a world-class community.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Users className="h-10 w-10 text-primary" />}
                title="Community First"
                description="Organized into topic-based channels where you can collaborate, share, and just talk about your day."
              />
              <FeatureCard
                icon={<Zap className="h-10 w-10 text-primary" />}
                title="Super Fast"
                description="Low-latency voice and video feels like you’re in the same room. No more lagging conversations."
              />
              <FeatureCard
                icon={<Shield className="h-10 w-10 text-primary" />}
                title="Safe & Secure"
                description="Robust moderation tools and custom member access ensure your community stays safe."
              />
            </div>
          </div>
        </section>

        {/* Alternating Feature Sections with Images */}
        <section className="py-24">
          {/* Feature 1 */}
          <div className="container px-4 mx-auto mb-32">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
              <div className="lg:w-1/2">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50 aspect-square sm:aspect-video lg:aspect-square group">
                  <Image
                    src="/home/1.webp"
                    alt="Community"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="lg:w-1/2 space-y-6 flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold">Create an invite-only space</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Strikes servers are organized into topic-based channels where you can collaborate, share, and just talk about your day without clogging up a group chat.
                </p>
                <ul className="space-y-3 pt-4">
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Topic-based channels</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Private groups</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature 2 (Reversed) */}
          <div className="container px-4 mx-auto mb-32">
            <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-24">
              <div className="lg:w-1/2 space-y-6 flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold">Where hanging out is easy</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Grab a seat in a voice channel when you free. Friends in your server can see you around and instantly pop in to talk without having to call.
                </p>
              </div>
              <div className="lg:w-1/2">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50 aspect-square sm:aspect-video lg:aspect-square group">
                  <Image
                    src="/home/2.webp"
                    alt="Voice Chat"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="container px-4 mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
              <div className="lg:w-1/2">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50 aspect-square sm:aspect-video lg:aspect-square group">
                  <Image
                    src="/home/3.webp"
                    alt="Moderation"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="lg:w-1/2 space-y-6 flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold">From few to a fandom</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Get any community running with moderation tools and custom member access. Give members special powers, set up private channels, and more.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
            <div className="space-y-8 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">Ready to start your journey?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join millions of other communities on Strikes today.
              </p>
              <SignedOut>
                <Link href="/sign-up">
                  <Button size="lg" className="h-14 px-10 text-xl bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-xl shadow-primary/20">
                    <LucideLayoutDashboard className="mr-2 h-6 w-6" />
                    Join Strikes Now
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href={`/setup`}>
                  <Button size="lg" className="h-14 px-10 text-xl bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-xl shadow-primary/20">
                    <LayoutDashboard className="mr-2 h-6 w-6" />
                    Go to profile 
                  </Button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-16 bg-background border-t">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center mb-12 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Image src={"/original.jpg"} alt="strikes community" width={28} height={28} className="object-contain rounded-lg" />
              </div>
              <span className="font-bold text-2xl tracking-tighter">Strikes</span>
            </Link>

            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-muted-foreground uppercase tracking-widest">
              <Link href="#" className="hover:text-primary transition-colors">Pricing</Link>
              <Link href="#" className="hover:text-primary transition-colors">Blog</Link>
              <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            </nav>
          </div>

          <div className="w-full border-t border-dashed border-border/60 mb-8" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-muted-foreground order-2 md:order-1 font-medium">
              &copy; 2026 Strikes Community. All rights reserved.
            </p>

            <div className="flex items-center gap-6 order-1 md:order-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors hover:scale-110">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors hover:scale-110">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors hover:scale-110">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors hover:scale-110">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div
      className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
    >
      <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-lg">
        {description}
      </p>
    </div>
  );
}
