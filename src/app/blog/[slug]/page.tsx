import { getBlogPostBySlug } from '@/lib/actions/cms';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const result = await getBlogPostBySlug(slug);
  const post = result.data;

  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} | VipraPariwar Blog`,
    description: post.excerpt || 'Read the full article on VipraPariwar Blog.',
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featured_image ? [post.featured_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const result = await getBlogPostBySlug(slug);
  const post = result.data;

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50/30 pb-20 pt-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors font-bold text-sm mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to all posts
        </Link>

        <article className="bg-white border-2 border-slate-900 rounded-3xl overflow-hidden shadow-xl">
          {/* Featured Image */}
          {post.featured_image && (
            <div className="aspect-[21/9] w-full relative overflow-hidden border-b-2 border-slate-900">
              <img 
                src={post.featured_image} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 md:p-12 space-y-8">
            {/* Header */}
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3 items-center">
                <Badge className="bg-red-50 text-red-600 border-red-100 font-bold uppercase tracking-widest text-[10px] px-3 py-1">
                  {post.BlogCategory?.name || 'Updates'}
                </Badge>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-xl text-slate-500 font-medium leading-relaxed italic border-l-4 border-red-200 pl-6">
                  {post.excerpt}
                </p>
              )}
            </div>

            {/* Content */}
            <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900 prose-a:text-red-600 prose-img:rounded-2xl prose-img:border-2 prose-img:border-slate-900">
              {/* This handles simple markdown-like newline support if no real MD parser is used */}
              <div className="whitespace-pre-wrap font-medium text-slate-700 leading-loose">
                {post.content}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Written By</p>
                  <p className="font-bold text-slate-900">VipraPariwar Team</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="rounded-xl border-2 border-slate-200 font-bold hover:bg-slate-50">
                  Share Post
                </Button>
                <Link href="/register">
                  <Button className="rounded-xl bg-red-600 hover:bg-red-700 font-black px-8">
                    Join VipraPariwar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
