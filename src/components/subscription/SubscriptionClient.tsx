'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  Crown, 
  ShieldCheck, 
  Zap, 
  Star, 
  Loader2, 
  QrCode,
  ArrowRight,
  Info
} from 'lucide-react';
import { 
  getSubscriptionPlans, 
  getPlatformSettings, 
  submitPaymentRequest 
} from '@/lib/actions/cms';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface SubscriptionClientProps {
  user: any;
}

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

interface PlatformSettings {
  qr_code_url: string;
  upipay_id: string;
}

export default function SubscriptionClient({ user }: SubscriptionClientProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Payment Modal State
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isPremium = user.is_premium;
  const currentPlan = user.premium_plan || 'Free';

  useEffect(() => {
    async function loadData() {
      try {
        const [plansRes, settingsRes] = await Promise.all([
          getSubscriptionPlans(),
          getPlatformSettings()
        ]);
        
        if (plansRes.data) {
          setPlans(plansRes.data.filter((p: Plan) => p.is_active));
        }
        if (settingsRes.data) {
          setSettings(settingsRes.data as PlatformSettings);
        }
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectPlan = (plan: Plan) => {
    if (plan.price === 0) return; // Cannot re-select free
    setSelectedPlan(plan);
  };

  const handleSubmitPayment = async () => {
    if (!transactionId.trim()) {
      toast.error('Please enter the transaction ID');
      return;
    }

    if (!selectedPlan) return;

    setIsSubmitting(true);
    try {
      const result = await submitPaymentRequest({
        plan_id: selectedPlan.id,
        transaction_id: transactionId,
        amount: selectedPlan.price
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Success! You have been upgraded to ${selectedPlan.name}`);
        // Refresh page to show new status
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlanIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('annual')) return <Crown className="w-5 h-5 text-amber-500" />;
    if (n.includes('quarter')) return <Star className="w-5 h-5 text-primary" />;
    return <Zap className="w-5 h-5 text-blue-500" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2">My Subscription</h1>
        <p className="text-muted-foreground">Manage your plan and premium features</p>
      </div>

      {/* Current Status Card */}
      <Card className="mb-12 border-primary/20 bg-primary/5">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold">Current Plan: {currentPlan}</h2>
                  {isPremium ? (
                    <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                  ) : (
                    <Badge variant="outline">Free Tier</Badge>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {isPremium 
                    ? 'Enjoy your full access to premium matrimonial features.' 
                    : 'Upgrade to find your perfect match faster with premium tools.'}
                </p>
              </div>
            </div>
            {!isPremium && (
              <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => {
                const premiumPlan = plans.find(p => p.price > 0);
                if (premiumPlan) setSelectedPlan(premiumPlan);
              }}>
                Upgrade Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mb-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-center">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full justify-center">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative flex flex-col border-2 transition-all hover:shadow-lg ${
                plan.is_popular ? 'border-primary ring-1 ring-primary/20' : 'border-border'
              }`}
            >
              {plan.is_popular && (
                <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/2">
                  <Badge className="bg-primary text-white px-3 py-1 border-none">POPULAR</Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {getPlanIcon(plan.name)}
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                </div>
                <CardDescription className="min-h-[40px]">{plan.description}</CardDescription>
                <div className="pt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">₹{plan.price}</span>
                    <span className="text-sm text-muted-foreground">/ {plan.billing_period}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-3 mb-8 flex-1">
                  {Array.isArray(plan.features) && plan.features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className={`w-full ${plan.is_popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                  variant={plan.is_popular ? 'default' : 'outline'}
                  disabled={currentPlan === plan.name}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {currentPlan === plan.name ? 'Current Plan' : 'Select Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={!!selectedPlan} onOpenChange={(open) => !open && setSelectedPlan(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Complete Payment</DialogTitle>
            <DialogDescription>
              Scan the QR code below to pay <strong className="text-foreground">₹{selectedPlan?.price}</strong> for the <strong>{selectedPlan?.name}</strong> plan.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center py-6">
            <div className="bg-white p-4 rounded-xl border-4 border-primary/10 shadow-sm mb-4">
              <div className="w-56 h-56 flex items-center justify-center bg-gray-50 rounded overflow-hidden">
                {settings?.qr_code_url ? (
                  <img src={settings.qr_code_url} alt="Payment QR Code" className="w-full h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <QrCode className="w-12 h-12 mb-2" />
                    <span className="text-xs">QR not set by admin</span>
                  </div>
                )}
              </div>
            </div>
            
            {settings?.upipay_id && (
              <div className="bg-primary/5 px-4 py-2 rounded-full flex items-center gap-2 mb-6">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">UPI ID:</span>
                <span className="text-sm font-mono font-medium">{settings.upipay_id}</span>
              </div>
            )}

            <div className="w-full space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold flex items-center gap-2">
                  Transaction ID / UTR Number
                  <Info className="w-3 h-3 text-muted-foreground" />
                </label>
                <input 
                  type="text" 
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter 12-digit transaction ID"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                />
                <p className="text-[10px] text-muted-foreground">
                  Note: You will get instant access once you submit a valid transaction ID. Our team will verify it later.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="ghost" onClick={() => setSelectedPlan(null)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90" 
              onClick={handleSubmitPayment}
              disabled={isSubmitting || !transactionId}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
              Continue & Upgrade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-12 border-t">
        <div className="flex flex-col items-center text-center p-4">
          <ShieldCheck className="w-10 h-10 text-primary mb-4" />
          <h3 className="font-bold mb-2">Secure Payments</h3>
          <p className="text-sm text-muted-foreground">Your transactions are protected by industry-standard encryption.</p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <Star className="w-10 h-10 text-primary mb-4" />
          <h3 className="font-bold mb-2">Verified Profiles</h3>
          <p className="text-sm text-muted-foreground">Interact with genuine members verified by our safety team.</p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <Zap className="w-10 h-10 text-primary mb-4" />
          <h3 className="font-bold mb-2">Instant Activation</h3>
          <p className="text-sm text-muted-foreground">Get immediate access to all premium features after payment.</p>
        </div>
      </div>
    </div>
  );
}
