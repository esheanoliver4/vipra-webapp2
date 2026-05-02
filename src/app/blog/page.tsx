import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBlogPosts } from '@/lib/actions/cms';

export const metadata = {
  title: 'Blog - VipraPariwar',
  description: 'Read the latest updates, tips, and success stories from VipraPariwar.',
};

export default async function BlogPage() {
  const result = await getBlogPosts();
  const dbPosts = result.data || [];

  const fallbackPosts = [
    {
      title: "How to Create an Attractive Matrimony Profile",
      created_at: "2023-10-12",
      excerpt: "Your profile is your first impression. Learn the top tips for writing a bio that attracts the right matches.",
      category: "Tips & Advice"
    },
    {
      title: "Understanding Kundli Milan in the Modern Era",
      created_at: "2023-09-28",
      excerpt: "Kundli matching has been a core tradition. Discover how to balance astrological compatibility with personal chemistry.",
      category: "Tradition"
    }
  ];

  const posts = dbPosts.length > 0 ? dbPosts : fallbackPosts;

  return (
    <main className="min-h-screen bg-background py-12 md:py-16">
      <div className="container max-w-4xl">
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">VipraPariwar Blog</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Insights, success stories, and relationship advice tailored for the Brahmin community.
          </p>
        </div>

        <div className="grid gap-6">
          {posts.map((post: any, i: number) => (
            <Card key={i} className="border-border hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-primary">{post.category || 'Updates'}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
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
