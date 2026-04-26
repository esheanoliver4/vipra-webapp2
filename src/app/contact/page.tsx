import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Contact Us - VipraPariwaar',
  description: 'Get in touch with the VipraPariwaar support team.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background py-12 md:py-16">
      <div className="container max-w-4xl">
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground mb-6">
            We're here to help you on your journey to find the perfect match.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Get in Touch</h2>
            <p className="text-muted-foreground">
              Have questions about our platform, need help with your profile, or want to report an issue? Our dedicated support team is ready to assist you.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Phone Support</p>
                  <p>+91 98765 43210</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Email Support</p>
                  <p>support@viprapariwaar.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Headquarters</p>
                  <p>123 Brahmin Heritage Society, New Delhi, India 110001</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Working Hours</p>
                  <p>Monday - Saturday: 9:00 AM - 7:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                  <input id="name" className="w-full p-2 border rounded-md" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                  <input id="email" type="email" className="w-full p-2 border rounded-md" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <textarea id="message" rows={4} className="w-full p-2 border rounded-md" placeholder="How can we help you?"></textarea>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
