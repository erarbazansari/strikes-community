"use client";

import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export const Navbar = () => {

    return (
        <nav className="fixed top-0 w-full z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container flex h-14 items-center justify-between px-4 md:px-8 mx-auto">
                <Link href="/">
                    <div
                        className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
                    >
                        <Image src={"/original.jpg"} alt="strikes community" width={32} height={32} className="object-contain rounded-md"/>
                        <span className="font-bold text-xl tracking-tight leading-none">Strikes</span>
                    </div>
                </Link>

                <div className="hidden md:flex items-center gap-4">
                    <ModeToggle />
                    <SignedIn>
                        <Link href={`/setup`}>
                            <Button variant="default" size="sm" className="hover:scale-105 transition-transform">
                               Profile 
                            </Button>
                        </Link>
                        <UserButton />
                    </SignedIn>
                    <SignedOut>
                        <Link href="/sign-in">
                            <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform">
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/sign-up">
                            <Button size="sm" className="hover:scale-105 transition-transform">Sign Up</Button>
                        </Link>
                    </SignedOut>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden flex items-center gap-2">
                    <ModeToggle />
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <SignedOut>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href="/sign-in">Sign In</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/sign-up">Sign Up</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SignedOut>
                </div>
            </div>
        </nav>
    );
};
