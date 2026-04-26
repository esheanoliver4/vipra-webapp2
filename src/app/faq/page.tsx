import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const faqs = [
  {
    question: 'How do I create a profile on VipraPariwaar?',
    answer: 'Simply sign up with your email, fill in your basic details, upload a photo, and complete your profile with your preferences and family information. Our team will verify your details within 24-48 hours.'
  },
  {
    question: 'Is my profile information secure?',
    answer: 'Yes, we use industry-standard encryption and security measures to protect your personal information. Your profile is only visible to verified members you allow to see it.'
  },
  {
    question: 'How does the Kundli Milan work?',
    answer: 'Kundli Milan analyzes astrological compatibility based on birth details. It calculates various kutas (compatibility factors) and provides a compatibility score out of 100.'
  },
  {
    question: 'Can I hide my profile from certain members?',
    answer: 'Yes, you can control your profile visibility through privacy settings. You can set it to public, members-only, or hidden from specific people.'
  },
  {
    question: 'How do I send a connection request?',
    answer: 'Browse profiles, find someone you like, and click "Send Connection" on their profile. They will receive your request and can accept or decline it.'
  },
  {
    question: 'What are the subscription plans available?',
    answer: 'We offer Free, Silver (monthly/3-month/yearly), and Gold subscription plans with different features like unlimited connections, priority visibility, and matchmaker support.'
  },
  {
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel anytime from your Settings. Active subscriptions will remain valid until the end of the billing period.'
  },
  {
    question: 'Is there a matchmaker service?',
    answer: 'Premium members can access our matchmaker service who will help find suitable matches based on your preferences and family background.'
  },
];

export const metadata = {
  title: 'FAQ - Frequently Asked Questions | VipraPariwaar',
  description: 'Find answers to common questions about VipraPariwaar matrimony platform',
};

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-background py-12 md:py-16">
      <div className="container max-w-2xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-3">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about VipraPariwaar
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="mt-8 bg-muted/30">
          <CardHeader>
            <CardTitle>Still Have Questions?</CardTitle>
            <CardDescription>Can't find the answer you're looking for?</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Please contact our support team at support@viprapariwar.com or use the chat feature in your dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
