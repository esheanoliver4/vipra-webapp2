"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const BANNERS = [
  {
    src: "https://images.unsplash.com/photo-1621801306185-8c0ccf9c8eb8?q=80&w=1400",
    alt: "Traditional Indian wedding ceremony",
    title: "संस्कारों से जुड़ा, रिश्तों से बंधा",
    subtitle: "Premium Brahmin Matrimony",
    cta: "Find Your Match",
    href: "/register",
  },
  {
    src: "https://images.unsplash.com/photo-1647949940712-bfcf82015d9b?q=80&w=2025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Hindu marriage celebration",
    title: "VipraPariwar",
    subtitle: "Sacred platform for the Brahmin community",
    cta: "Get Started",
    href: "/register",
  },
  {
    src: "https://images.unsplash.com/photo-1587271339318-2e78fdf79586?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Wedding traditions",
    title: "Meaningful Connections",
    subtitle: "Tradition meets trust",
    cta: "Join Now",
    href: "/register",
  },
  {
    src: "https://images.unsplash.com/photo-1688790026521-b7b14a885116?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Traditional wedding",
    title: "Your Journey Begins Here",
    subtitle: "Find your life partner with VipraPariwar",
    cta: "Register",
    href: "/register",
  },
];

export function BannerCarousel() {
  const [api, setApi] = useState<CarouselApi>(undefined);
  const [current, setCurrent] = useState(0);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      const next = (current + 1) % BANNERS.length;
      api.scrollTo(next);
    }, 5000);
    return () => clearInterval(interval);
  }, [api, current]);

  return (
    <section className="w-full overflow-hidden border-b border-border bg-muted/30 relative">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "start" }}
        className="w-full relative"
      >
        <CarouselContent className="-ml-0">
          {BANNERS.map((banner, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] min-h-[180px] sm:min-h-[280px] md:min-h-[360px]">
                <Image
                  src={banner.src}
                  alt={banner.alt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 sm:pb-16 md:pb-20 px-4 text-center">
                  <h2 className="text-base sm:text-2xl md:text-4xl font-bold text-white drop-shadow-lg">
                    {banner.title}
                  </h2>
                  <p className="text-xs sm:text-sm md:text-lg text-white/90 mt-1 sm:mt-2 max-w-2xl">
                    {banner.subtitle}
                  </p>
                  <Button asChild size="sm" className="mt-2 sm:mt-4 sm:size-lg">
                    <Link href={banner.href}>{banner.cta}</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 sm:left-4 h-9 w-9 rounded-full border-border bg-background/90 shadow-md hover:bg-muted text-foreground" />
        <CarouselNext className="right-2 sm:right-4 h-9 w-9 rounded-full border-border bg-background/90 shadow-md hover:bg-muted text-foreground" />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {BANNERS.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all ${
                index === current
                  ? "w-6 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
}
