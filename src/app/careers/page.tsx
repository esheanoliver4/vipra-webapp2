import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Users, Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Careers - VipraPariwaar',
  description: 'Join our team to help build families and preserve culture.',
};

export default function CareersPage() {
  const openings = [
    { role: "Senior Full Stack Engineer", department: "Engineering", location: "Remote / India" },
    { role: "Community Manager", department: "Operations", location: "New Delhi, India" },
    { role: "Product Designer", department: "Design", location: "Remote" },
  ];

  return (
    <main className="min-h-screen bg-background py-12 md:py-16">
      <div className="container max-w-4xl">
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">Careers at VipraPariwaar</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Join a mission-driven team dedicated to bringing people together and building lifelong bonds.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Mission Driven
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              We aren't just building an app. We're building families. Everything we do is centered around making a profound impact on people's lives.
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-secondary" />
                Fast Paced
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              We leverage cutting-edge technology and data-driven insights to constantly improve our matchmaking algorithms and user experience.
            </CardContent>
          </Card>
        </div>

        <h2 className="text-3xl font-bold mb-6">Current Openings</h2>
        <div className="space-y-4 mb-12">
          {openings.map((job, i) => (
            <Card key={i} className="border-border">
              <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4">
                <div>
                  <h3 className="text-xl font-bold">{job.role}</h3>
                  <p className="text-muted-foreground">{job.department} • {job.location}</p>
                </div>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
