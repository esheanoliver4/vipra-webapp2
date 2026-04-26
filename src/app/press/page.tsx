import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export const metadata = {
  title: 'Press & Media - VipraPariwaar',
  description: 'Press releases, media kits, and news coverage of VipraPariwaar.',
};

export default function PressPage() {
  const news = [
    {
      publisher: "TechCrunch",
      date: "August 2023",
      title: "VipraPariwaar redefines traditional matchmaking with modern technology"
    },
    {
      publisher: "The Times of India",
      date: "July 2023",
      title: "How community-specific matrimonial platforms are seeing a massive resurgence"
    }
  ];

  return (
    <main className="min-h-screen bg-background py-12 md:py-16">
      <div className="container max-w-4xl">
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">Press & Media</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Latest news, announcements, and press resources from VipraPariwaar.
          </p>
        </div>

        <div className="bg-muted/30 p-8 rounded-xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-border">
          <div>
            <h2 className="text-2xl font-bold mb-2">Media Inquiries</h2>
            <p className="text-muted-foreground">For press inquiries, interview requests, or media assets, please reach out to our PR team.</p>
          </div>
          <a href="mailto:press@viprapariwaar.com">
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold px-8">
              <Mail className="w-4 h-4 mr-2" />
              press@viprapariwaar.com
            </Button>
          </a>
        </div>

        <h2 className="text-3xl font-bold mb-6">In the News</h2>
        <div className="space-y-4">
          {news.map((item, i) => (
            <Card key={i} className="border-border">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-primary">{item.publisher}</span>
                  <span className="text-sm text-muted-foreground">{item.date}</span>
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <button className="mt-3 text-sm text-muted-foreground hover:text-primary transition-colors underline">
                  Read Article
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
