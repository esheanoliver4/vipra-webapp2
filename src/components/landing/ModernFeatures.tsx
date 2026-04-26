'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Zap, Shield, Search, Sparkles, CheckCircle2 } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Brahmin-Exclusive Network',
    description: 'Connect with community members who share your cultural values and traditions in a trusted environment.',
    gradient: 'from-rose-500/20 to-pink-500/20'
  },
  {
    icon: Users,
    title: 'Family-Centered Approach',
    description: 'Respect tradition with our family portal - involve parents and elders in the beautiful matching process.',
    gradient: 'from-purple-500/20 to-indigo-500/20'
  },
  {
    icon: Zap,
    title: 'Instant Connections',
    description: 'Send requests and start meaningful conversations instantly with compatible matches nearby.',
    gradient: 'from-amber-500/20 to-orange-500/20'
  },
  {
    icon: Shield,
    title: 'Verified & Safe',
    description: 'All profiles verified for authenticity with military-grade security protecting your personal data.',
    gradient: 'from-emerald-500/20 to-teal-500/20'
  },
  {
    icon: Search,
    title: 'Advanced Filtering',
    description: 'Filter by gotra, location, education, occupation, and community-important criteria with precision.',
    gradient: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    icon: Sparkles,
    title: 'Kundli Milan',
    description: 'Traditional astrological matching ensures cosmic and spiritual compatibility with your soulmate.',
    gradient: 'from-violet-500/20 to-purple-500/20'
  }
];

export default function ModernFeatures() {
  return (
    <section id="features" className="relative py-20 md:py-32 bg-gradient-to-b from-background via-blue-50/10 dark:via-blue-950/10 to-background overflow-hidden scroll-mt-24">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 text-primary px-4 py-2 rounded-full border border-primary/30 backdrop-blur-sm">
              <p className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Our Commitment
              </p>
            </div>
          </div>
          <h2 className="text-5xl sm:text-6xl font-bold text-foreground mb-4 leading-tight">
            Designed for
            <br />
            <span className="bg-gradient-to-r from-primary via-rose-500 to-secondary bg-clip-text text-transparent">
              Brahmin Families
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-medium">
            Modern technology meets timeless cultural values. VipraPariwaar is built specifically for our community with features that matter most.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative"
                style={{
                  animation: `fadeInUp 0.6s ease-out forwards`,
                  animationDelay: `${index * 100}ms`,
                  opacity: 0
                }}
              >
                <Card className="relative h-full border border-border/50 hover:border-primary/50 bg-gradient-to-br from-white/50 dark:from-slate-900/50 to-white/30 dark:to-slate-900/30 backdrop-blur-sm hover:shadow-xl transition-all duration-500 rounded-2xl overflow-hidden">
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <CardHeader>
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <CardTitle className="text-xl md:text-2xl text-foreground">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </div>

                  {/* Hover border effect */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/30 transition-colors duration-500 pointer-events-none" />
                </Card>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 md:mt-24 text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 backdrop-blur-sm">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              Ready to Find Your Perfect Match?
            </h3>
            <p className="text-muted-foreground max-w-2xl">
              Join thousands of Brahmin families discovering meaningful connections within our trusted community.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
