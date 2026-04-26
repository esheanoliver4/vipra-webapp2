"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-primary/10 via-background to-secondary/10 dark:from-primary/25 dark:via-background dark:to-secondary/20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16 px-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground mb-4">
            Premium Brahmin Matrimony
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary leading-tight mb-4 animate-fade-in-up">
            VipraPariwar – संस्कारों से जुड़ा, रिश्तों से बंधा
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Join a sacred, invitation-only platform for the{" "}
            <span className="font-semibold text-primary">Brahmin community</span>,{" "}
            thoughtfully designed to preserve traditions while using{" "}
            <span className="font-semibold">AI</span> to help you discover
            meaningful relationships.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="px-8"
            >
              <Link href="/register">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8"
            >
              <Link href="/login">Already a member?</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
