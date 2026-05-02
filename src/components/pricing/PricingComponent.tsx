'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getSubscriptionPlans } from '@/lib/actions/cms';

interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  billing_period: string;
  features: any;
  is_popular: boolean;
  is_active: boolean;
}

export default function PricingComponent() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlans() {
      try {
        const result = await getSubscriptionPlans();
        if (result.data) {
          setPlans(result.data.filter((p: Plan) => p.is_active));
        }
      } catch (error) {
        console.error('Error loading plans:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

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
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            plans.map((plan) => (
              <Card
                key={plan.id}
                className={`rounded-xl border-2 transition-all duration-300 flex flex-col ${
                  plan.is_popular
                    ? 'border-primary shadow-lg lg:scale-105'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {plan.is_popular && (
                  <div className="px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-t-[calc(0.65rem-2px)]">
                    <div className="flex items-center gap-2 justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                      <span className="text-sm font-semibold text-white">Most Popular</span>
                    </div>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="min-h-[40px]">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground">
                        ₹{plan.price}
                      </span>
                      <span className="text-muted-foreground text-sm">/ {plan.billing_period}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link href="/register" className="mb-6">
                    <Button
                      className={`w-full rounded-lg h-10 font-medium ${
                        plan.is_popular
                          ? 'bg-primary hover:bg-primary/90 text-white'
                          : 'border border-border text-foreground hover:bg-muted'
                      }`}
                      variant={plan.is_popular ? 'default' : 'outline'}
                    >
                      Get Started
                    </Button>
                  </Link>

                  {/* Features */}
                  <div className="space-y-3 flex-1">
                    <p className="text-sm font-semibold text-foreground">Includes:</p>
                    {Array.isArray(plan.features) && plan.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
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
