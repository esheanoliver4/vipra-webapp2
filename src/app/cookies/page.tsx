import { Card, CardContent } from '@/components/ui/card';
import { getStaticPageBySlug } from '@/lib/actions/cms';

export const metadata = {
  title: 'Cookie Policy - VipraPariwar',
  description: 'Our policy regarding the use of cookies and tracking technologies.',
};

export default async function CookiesPage() {
  const { data: pageData } = await getStaticPageBySlug('cookie-policy');

  return (
    <main className="min-h-screen bg-background py-12 md:py-16">
      <div className="container max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">{pageData?.title || 'Cookie Policy'}</h1>
          <p className="text-muted-foreground">
            Last updated: {pageData?.updated_at ? new Date(pageData.updated_at).toLocaleDateString() : 'October 2023'}
          </p>
        </div>

        <Card className="border-border">
          <CardContent className="p-8 prose prose-slate dark:prose-invert max-w-none space-y-6">
            {pageData?.content ? (
              <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-4">1. What are cookies?</h2>
                  <p className="text-muted-foreground">
                    Cookies are small text files that are placed on your computer or mobile device when you visit a website.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">2. How we use cookies</h2>
                  <p className="text-muted-foreground">We use cookies to ensure the platform works correctly and to analyze usage.</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
