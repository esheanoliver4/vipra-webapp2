import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Shield, Star } from 'lucide-react';

export const metadata = {
  title: 'About VipraPariwaar - Brahmin Matrimony',
  description: 'Learn about VipraPariwaar, a trusted matrimony platform for the Brahmin community',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background py-12 md:py-16">
      <div className="container max-w-4xl">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">About VipraPariwaar</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Connecting hearts, honoring traditions, building families
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Heart className="w-6 h-6" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              VipraPariwaar is dedicated to connecting eligible singles from the Brahmin community 
              with a focus on values, traditions, and compatibility. We believe in creating meaningful 
              connections that respect cultural heritage while embracing modern values.
            </p>
            <p>
              Our platform combines traditional matchmaking with modern technology to provide a 
              secure, trustworthy, and efficient matrimonial experience for the entire community.
            </p>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-secondary">
                <Shield className="w-6 h-6" />
                Safety & Trust
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Every profile is verified and validated. We maintain strict privacy standards to 
              ensure your personal information is protected.
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Users className="w-6 h-6" />
                Community Focused
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Proud member of and trusted by thousands of Brahmin families across the world. 
              Our community's happiness is our success.
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-6 h-6" />
                Tradition Meets Technology
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              We honor our cultural values while leveraging modern technology to make the 
              matrimonial journey easier and more meaningful.
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-secondary">
                ✨ Success Stories
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Thousands of successful matches and happy families. Every love story matters 
              to us, and we're honored to be part of your journey.
            </CardContent>
          </Card>
        </div>

        {/* Why Choose Us */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle>Why Choose VipraPariwaar?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Verified profiles from verified members only</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Advanced Kundli Milan compatibility matching</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Dedicated customer support and matchmakers</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Secure messaging and privacy controls</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Family approval workflow and documentation support</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Community events and success celebration</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
