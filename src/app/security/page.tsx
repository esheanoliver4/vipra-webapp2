import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, Server } from 'lucide-react';

export const metadata = {
  title: 'Security - VipraPariwaar',
  description: 'Learn about how VipraPariwaar keeps your data secure.',
};

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-background py-12 md:py-16">
      <div className="container max-w-4xl">
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">Security & Privacy</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Your trust is our top priority. We implement bank-level security to protect your data.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Lock className="w-6 h-6" />
                Data Encryption
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              All data transmitted to and from VipraPariwaar is encrypted using industry-standard TLS protocols. Your sensitive information is safely encrypted in our databases.
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-secondary">
                <Shield className="w-6 h-6" />
                Verified Profiles
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              We employ strict identity verification processes to ensure that all profiles on our platform are genuine, keeping scammers and fake accounts out.
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-6 h-6" />
                Privacy Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              You have complete control over who sees your profile, contact details, and photos. Our advanced privacy settings let you decide your visibility.
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Server className="w-6 h-6" />
                Secure Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Our servers are hosted in secure, ISO-certified data centers with 24/7 monitoring and strict access controls to prevent unauthorized data breaches.
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
