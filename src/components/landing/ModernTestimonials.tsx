'use client';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote, Heart } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Priya & Rajesh Sharma',
    initials: 'PR',
    location: 'Mumbai, Maharashtra',
    content: 'Found each other through VipraPariwaar! We got married in a beautiful traditional ceremony with our families\' blessings. The Kundli matching gave us confidence.',
    rating: 5
  },
  {
    name: 'Dr. Anjali & Dr. Vikram',
    initials: 'AV',
    location: 'Bangalore, Karnataka',
    content: 'As Brahmin professionals, we appreciated the community-focused approach. The Kundli compatibility feature was incredibly accurate and helped our families.',
    rating: 5
  },
  {
    name: 'Deepa & Arjun Iyer',
    initials: 'DA',
    location: 'Chennai, Tamil Nadu',
    content: 'A truly family-friendly platform. Our parents were comfortable with the process and involvement. We felt supported every step of the way.',
    rating: 5
  },
  {
    name: 'Neha & Sanjay Mishra',
    initials: 'NS',
    location: 'Delhi, India',
    content: 'The gotra filters and cultural values matching made finding the right match so much easier. Finally, a platform that understands Brahmin traditions!',
    rating: 5
  }
];

export default function ModernTestimonials() {
  return (
    <section id="success" className="relative py-20 md:py-32 bg-gradient-to-b from-background via-primary/5 dark:via-primary/10 to-background overflow-hidden scroll-mt-24">
      {/* Decorative background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-20 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 text-primary px-4 py-2 rounded-full border border-primary/30 backdrop-blur-sm">
              <p className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                <Heart className="w-4 h-4 fill-current" />
                Happy Families
              </p>
            </div>
          </div>
          <h2 className="text-5xl sm:text-6xl font-bold text-foreground mb-4 leading-tight">
            Success Stories from
            <br />
            <span className="bg-gradient-to-r from-primary via-rose-500 to-secondary bg-clip-text text-transparent">
              Our Community
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-medium">
            Real couples from the Brahmin community who found love and built lasting relationships through VipraPariwaar.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group"
              style={{
                animation: `fadeInUp 0.6s ease-out forwards`,
                animationDelay: `${index * 100}ms`,
                opacity: 0
              }}
            >
              <Card className="relative h-full p-8 border border-border/50 bg-gradient-to-br from-white/60 dark:from-slate-900/60 to-white/30 dark:to-slate-900/30 backdrop-blur-sm hover:shadow-xl transition-all duration-500 rounded-2xl overflow-hidden group-hover:border-primary/50">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-primary/20 mb-4 group-hover:scale-110 transition-transform duration-300" />
                
                <div className="relative z-10">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-foreground leading-relaxed mb-6 font-medium">
                    "{testimonial.content}"
                  </p>

                  {/* User Info */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border/30">
                    <Avatar className="w-14 h-14">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold text-lg">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Featured Story with Image */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mt-16 md:mt-24 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 backdrop-blur-sm">
          {/* Image */}
          <div className="hidden md:block relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/happy-couple.jpg"
              alt="Happy Brahmin Couple"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-primary fill-current" />
              <span className="text-primary font-semibold">Featured Story</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              A Match Made by Technology & Tradition
            </h3>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Thousands of successful matches happen every month on VipraPariwaar. From the initial connection through our smart matching algorithm to the wedding ceremony honoring our traditions, every success story is unique and beautiful.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                </div>
                <span className="text-foreground font-medium">Verified profiles ensuring authenticity</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                </div>
                <span className="text-foreground font-medium">Accurate Kundli matching for compatibility</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                </div>
                <span className="text-foreground font-medium">Family-centered approach & parental involvement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
