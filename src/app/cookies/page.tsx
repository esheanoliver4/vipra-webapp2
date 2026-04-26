import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Cookie Policy - VipraPariwaar',
  description: 'Our policy regarding the use of cookies and tracking technologies.',
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-background py-12 md:py-16">
      <div className="container max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground">Last updated: October 2023</p>
        </div>

        <Card className="border-border">
          <CardContent className="p-8 prose prose-slate dark:prose-invert max-w-none space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">1. What are cookies?</h2>
              <p className="text-muted-foreground">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">2. How we use cookies</h2>
              <p className="text-muted-foreground mb-4">We use cookies for several reasons:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Essential Cookies:</strong> Required for the operation of our platform. They include, for example, cookies that enable you to log into secure areas of our website.</li>
                <li><strong>Analytical/Performance Cookies:</strong> Allow us to recognize and count the number of visitors and see how visitors move around our platform when they are using it.</li>
                <li><strong>Functionality Cookies:</strong> Used to recognize you when you return to our platform, enabling us to personalize content and remember your preferences.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">3. Managing cookies</h2>
              <p className="text-muted-foreground">
                Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit internetcookies.org.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
