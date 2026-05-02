import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBlogPosts } from '@/lib/actions/cms';
import { BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any, i: number) => (
            <Link key={i} href={`/blog/${post.slug || '#'}`}>
              <Card className="group overflow-hidden border-2 border-slate-100 hover:border-red-100 hover:shadow-xl transition-all duration-300 rounded-2xl flex flex-col h-full bg-white cursor-pointer">
                <div className="aspect-video relative overflow-hidden bg-slate-100">
                  {post.featured_image ? (
                    <img 
                      src={post.featured_image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <BookOpen className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 backdrop-blur-sm text-red-600 hover:bg-white font-bold border-none shadow-sm px-3 py-1 text-[10px] uppercase tracking-wider">
                      {post.BlogCategory?.name || post.category || 'Updates'}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="p-6 pb-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <CardTitle className="text-xl font-black text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6 pt-0 flex-grow flex flex-col justify-between">
                  <p className="text-slate-500 text-sm font-medium line-clamp-3 leading-relaxed">
                    {post.excerpt || 'Read the latest updates and insights from the VipraPariwar community.'}
                  </p>
                  
                  <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xs font-black text-red-600 group-hover:translate-x-1 transition-transform">
                      READ FULL ARTICLE →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
