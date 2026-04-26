'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';

const values = [
  {
    title: 'Cultural Heritage',
    description: 'We honor and preserve Brahmin traditions, values, and cultural practices in our community.'
  },
  {
    title: 'Family Values',
    description: 'Family is the foundation of our culture. We support family involvement in the matchmaking process.'
  },
  {
    title: 'Educational Excellence',
    description: 'We celebrate the Brahmin commitment to learning, knowledge, and intellectual growth.'
  },
  {
    title: 'Spiritual Beliefs',
    description: 'Our Kundli matching respects astrological compatibility and spiritual harmony.'
  },
  {
    title: 'Community Support',
    description: 'We build a supportive network of verified members who share common values and traditions.'
  },
  {
    title: 'Ethical Conduct',
    description: 'All members are committed to authenticity, honesty, and respectful interactions.'
  }
];

export default function BrahminCulture() {
  return (
    <section id="about" className="py-20 bg-background scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="inline-block mb-4">
              <div className="bg-secondary/10 text-secondary px-4 py-2 rounded-full border border-secondary/20">
                <p className="text-sm font-semibold uppercase tracking-wider">Our Mission</p>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Celebrating Brahmin Community & Tradition
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              VipraPariwaar is dedicated to serving the Brahmin community with authenticity and respect. We understand the importance of cultural values, family involvement, and traditional practices in matrimony.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              Our platform brings together educated, values-driven individuals who wish to build lifelong partnerships rooted in shared culture, faith, and family principles.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-foreground">100% Brahmin Community Members</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-foreground">Traditional Kundli Matching Included</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-foreground">Family-Centered Approach</span>
              </li>
            </ul>
          </div>

          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/brahmin-family.jpg"
              alt="Brahmin Family Values"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>

        {/* Values Grid */}
        <div className="mb-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Our Core Values</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              What makes VipraPariwaar the trusted choice for Brahmin matrimony
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 border-border hover:border-secondary/50 hover:shadow-lg transition-all duration-300 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <div className="w-6 h-6 rounded-full bg-secondary/50" />
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-2">{value.title}</h4>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Wedding Section */}
        <div className="mt-20 pt-20 border-t border-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1">
              <Image
                src="/brahmin-wedding.jpg"
                alt="Traditional Brahmin Wedding"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-block mb-4">
                <div className="bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20">
                  <p className="text-sm font-semibold uppercase tracking-wider">Your Journey</p>
                </div>
              </div>
              <h3 className="text-4xl font-bold text-foreground mb-6">
                From Connection to Marriage
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Every successful match on VipraPariwaar is a beautiful story of two families coming together. We provide a platform where connections turn into lifelong partnerships, honoring every step of the traditional matrimonial journey.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary text-white text-sm font-bold">1</div>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Create Your Profile</p>
                    <p className="text-muted-foreground text-sm">Share your story, values, and what you're looking for</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary text-white text-sm font-bold">2</div>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Explore Matches</p>
                    <p className="text-muted-foreground text-sm">Use Kundli matching and advanced filters to find compatible partners</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary text-white text-sm font-bold">3</div>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Connect & Communicate</p>
                    <p className="text-muted-foreground text-sm">Send requests and have meaningful conversations securely</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary text-white text-sm font-bold">4</div>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Build Your Future</p>
                    <p className="text-muted-foreground text-sm">Meet, involve families, and create your beautiful life together</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
