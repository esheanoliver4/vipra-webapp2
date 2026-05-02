import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Shield, Star } from 'lucide-react';
import { getStaticPageBySlug } from '@/lib/actions/cms';

export const metadata = {
  title: 'About VipraPariwar - Brahmin Matrimony',
  description: 'Learn about VipraPariwar, a trusted matrimony platform for the Brahmin community',
};

export default async function AboutPage() {
  const { data: pageData } = await getStaticPageBySlug('about-us');

  return (
    <main className="min-h-screen bg-background py-12 md:py-16">
      <div className="container max-w-4xl">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">{pageData?.title || 'About VipraPariwar'}</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Connecting hearts, honoring traditions, building families
          </p>
        </div>

        {pageData?.content ? (
          <div 
            className="prose prose-lg max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: pageData.content }}
          />
        ) : (
          <>
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
                  VipraPariwar is dedicated to connecting eligible singles from the Brahmin community 
                  with a focus on values, traditions, and compatibility. We believe in creating meaningful 
                  connections that respect cultural heritage while embracing modern values.
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
                </CardContent>
              </Card>
            </div>
          </>
        )}
        
        {pageData?.updated_at && (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            Last updated: {new Date(pageData.updated_at).toLocaleDateString()}
          </p>
        )}
      </div>
    </main>
  );
}
