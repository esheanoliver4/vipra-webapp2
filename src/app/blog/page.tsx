import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Blog - VipraPariwaar',
  description: 'Read the latest updates, tips, and success stories from VipraPariwaar.',
};

export default function BlogPage() {
  const posts = [
    {
      title: "How to Create an Attractive Matrimony Profile",
      date: "October 12, 2023",
      excerpt: "Your profile is your first impression. Learn the top tips for writing a bio that attracts the right matches.",
      category: "Tips & Advice"
    },
    {
      title: "Understanding Kundli Milan in the Modern Era",
      date: "September 28, 2023",
      excerpt: "Kundli matching has been a core tradition. Discover how to balance astrological compatibility with personal chemistry.",
      category: "Tradition"
    },
    {
      title: "Success Story: How Anjali and Rohan Found Each Other",
      date: "September 15, 2023",
      excerpt: "Read the heartwarming journey of two VipraPariwaar members who connected across continents and built a beautiful family.",
      category: "Success Stories"
    }
  ];

  return (
    <main className="min-h-screen bg-background py-12 md:py-16">
      <div className="container max-w-4xl">
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">VipraPariwaar Blog</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Insights, success stories, and relationship advice tailored for the Brahmin community.
          </p>
        </div>

        <div className="grid gap-6">
          {posts.map((post, i) => (
            <Card key={i} className="border-border hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-primary">{post.category}</span>
                  <span className="text-sm text-muted-foreground">{post.date}</span>
                </div>
                <CardTitle className="text-2xl">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{post.excerpt}</p>
                <button className="mt-4 text-primary font-medium hover:underline">Read More →</button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
