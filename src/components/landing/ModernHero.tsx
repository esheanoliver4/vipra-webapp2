'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Users, Heart, Sparkles } from 'lucide-react';

export default function ModernHero() {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10 md:pb-20">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 z-0">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/30 dark:via-blue-950/20 to-background" />
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary via-rose-400 to-secondary rounded-full opacity-15 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tl from-secondary via-orange-400 to-primary rounded-full opacity-15 blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-300/10 to-purple-300/10 rounded-full blur-3xl" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2">
              <div className="bg-gradient-to-r from-primary/20 to-secondary/20 text-primary px-4 py-2 rounded-full border border-primary/30 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 fill-primary" />
                  <p className="text-sm font-semibold uppercase tracking-wider">
                    Brahmin Community
                  </p>
                </div>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Find Your
              <br />
              <span className="bg-gradient-to-r from-primary via-rose-500 to-secondary bg-clip-text text-transparent animate-pulse">
                Perfect Match
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-xl font-medium">
              Connect with meaningful relationships in the Brahmin community. Respect traditions, embrace modern values.
            </p>
            
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl">
              Join 50,000+ members finding their soulmates through shared values, Kundli matching, and genuine connections.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href="/register" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-rose-500 hover:opacity-90 text-white px-8 py-6 text-base md:text-lg h-auto rounded-xl w-full sm:w-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/browse" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-6 text-base md:text-lg h-auto rounded-xl border-2 border-primary text-primary hover:bg-primary/10 w-full sm:w-auto font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Explore Profiles
                  <Sparkles className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 pt-8 border-t border-border/50">
              <div className="group">
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform">
                  50K+
                </p>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">Active Members</p>
              </div>
              <div className="group">
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform">
                  2.5K+
                </p>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">Happy Matches</p>
              </div>
              <div className="group">
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform">
                  98%
                </p>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-full max-w-md">
              {/* Floating decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-secondary/30 to-transparent rounded-full blur-2xl animate-float" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-2xl animate-float animation-delay-3000" />
              
              {/* Main Image Card */}
              <div className="relative group h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-sm transform hover:scale-105 transition-transform duration-500">
                <Image
                  src="/brahmin-wedding.jpg"
                  alt="Brahmin Wedding Celebration"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  priority
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform group-hover:translate-y-2 transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-5 h-5 fill-white" />
                    <p className="text-xl font-bold">True Love Stories</p>
                  </div>
                  <p className="text-sm text-white/90">
                    Celebrating matches made in tradition and modern values
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="text-primary text-center">
          <p className="text-sm font-semibold mb-2">Scroll to explore</p>
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
