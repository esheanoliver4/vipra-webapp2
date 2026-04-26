'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Sparkles } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    description: 'Get started',
    price: 0,
    billingPeriod: 'forever',
    features: [
      'Create your profile',
      'Browse profiles (limited)',
      'Send 5 connection requests',
      'View basic info',
      'Save favorites',
      'Family tree section'
    ],
    cta: 'Get Started',
    href: '/register',
    popular: false
  },
  {
    name: 'Premium Monthly',
    description: 'Most popular',
    price: 9.99,
    billingPeriod: '/month',
    features: [
      'Everything in Free',
      'Unlimited connection requests',
      'See who visited your profile',
      'Message unlimited matches',
      'Advanced search filters',
      'Profile analytics',
      'Kundli matching',
      'Priority visibility',
      'Block & report features'
    ],
    cta: 'Subscribe Now',
    href: '/checkout/monthly',
    popular: true
  },
  {
    name: 'Premium Quarterly',
    description: 'Save 20%',
    price: 23.97,
    billingPeriod: '/3 months',
    pricePerMonth: 7.99,
    features: [
      'Everything in Monthly',
      '20% savings',
      'Exclusive member events',
      'Personal matchmaker consultation',
      'Verified badge',
      'Featured profile placement'
    ],
    cta: 'Subscribe Now',
    href: '/checkout/quarterly',
    popular: false
  },
  {
    name: 'Premium Annual',
    description: 'Save 40%',
    price: 71.88,
    billingPeriod: '/year',
    pricePerMonth: 5.99,
    features: [
      'Everything in Quarterly',
      '40% savings',
      'Monthly profile boost',
      '24/7 priority support',
      'Family review access',
      'VIP treatment'
    ],
    cta: 'Subscribe Now',
    href: '/checkout/annual',
    popular: false
  }
];

export default function PricingComponent() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-bold text-foreground mb-6">
            Simple, Transparent
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for you. All plans include access to our matching algorithm and family tree features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`rounded-xl border-2 transition-all duration-300 flex flex-col ${
                plan.popular
                  ? 'border-primary shadow-lg lg:scale-105'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {plan.popular && (
                <div className="px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-t-[calc(0.65rem-2px)]">
                  <div className="flex items-center gap-2 justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="text-sm font-semibold text-white">Most Popular</span>
                  </div>
                </div>
              )}

              <CardHeader className={plan.popular ? '' : ''}>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      ${plan.price.toFixed(2)}
                    </span>
                    <span className="text-muted-foreground text-sm">{plan.billingPeriod}</span>
                  </div>
                  {plan.pricePerMonth && (
                    <p className="text-sm text-muted-foreground mt-2">
                      ${plan.pricePerMonth.toFixed(2)}/month
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <Link href={plan.href} className="mb-6">
                  <Button
                    className={`w-full rounded-lg h-10 font-medium ${
                      plan.popular
                        ? 'bg-primary hover:bg-primary/90 text-white'
                        : 'border border-border text-foreground hover:bg-muted'
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>

                {/* Features */}
                <div className="space-y-3 flex-1">
                  <p className="text-sm font-semibold text-foreground">Includes:</p>
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            <div className="p-6 bg-muted/50 rounded-xl border border-border">
              <h4 className="font-semibold text-foreground mb-2">Can I cancel anytime?</h4>
              <p className="text-muted-foreground">
                Yes! You can cancel your subscription at any time. Your access will continue until the end of your billing period.
              </p>
            </div>
            <div className="p-6 bg-muted/50 rounded-xl border border-border">
              <h4 className="font-semibold text-foreground mb-2">Is my payment information secure?</h4>
              <p className="text-muted-foreground">
                Absolutely. We use industry-leading encryption and never store complete credit card information.
              </p>
            </div>
            <div className="p-6 bg-muted/50 rounded-xl border border-border">
              <h4 className="font-semibold text-foreground mb-2">What if I don't find a match?</h4>
              <p className="text-muted-foreground">
                Our premium members have access to a personal matchmaker consultation to help guide your search.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
