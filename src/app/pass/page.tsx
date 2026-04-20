'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui';
import { Check, Sparkles, Crown, Shield, Zap, Gift, Award, Loader2 } from 'lucide-react';

const plans = [
  {
    id: 'helphive-pass',
    name: 'HelpHive Pass',
    price: 199,
    period: 'month',
    description: 'For frequent helpers',
    features: [
      'Browse all services & experiences',
      'Book help & tours',
      'Join tournaments',
      'Basic support',
      'Standard checkout',
    ],
    notIncluded: [
      'Fee-free bookings',
      'Priority support',
      'Tournament discounts',
      'Exclusive events',
      'Reward multipliers',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    id: 'explorer-elite',
    name: 'Explorer Elite',
    price: 499,
    period: 'month',
    description: 'For power users & hosts',
    features: [
      'Everything in Pass',
      '15% tournament discount',
      '2x reward multiplier',
      'VIP event access',
      'Dedicated account manager',
      'Listing fee discount',
      'Featured profile badge',
      'Advanced analytics',
    ],
    notIncluded: [],
    cta: 'Get Started',
    popular: true,
  },
  {
    id: 'helphive-pass-yearly',
    name: 'HelpHive Pass Yearly',
    price: 1908,
    period: 'year',
    description: 'Save 20% with yearly',
    features: [
      'Everything in monthly Pass',
      '2 months free',
      'Priority 24/7 support',
      '10% tournament discount',
      '1.5x reward multiplier',
    ],
    notIncluded: [],
    cta: 'Subscribe Yearly',
    popular: false,
  },
  {
    id: 'explorer-elite-yearly',
    name: 'Explorer Elite Yearly',
    price: 4790,
    period: 'year',
    description: 'Save 20% with yearly',
    features: [
      'Everything in monthly Elite',
      '2 months free',
      '15% tournament discount',
      '2x reward multiplier',
      'VIP event access',
    ],
    notIncluded: [],
    cta: 'Subscribe Yearly',
    popular: false,
  },
];

const benefits = [
  { icon: Sparkles, title: 'Zero Fees', description: 'Save up to 15% on every booking with zero platform fees' },
  { icon: Crown, title: 'Priority Support', description: 'Skip the queue with dedicated 24/7 support hotline' },
  { icon: Shield, title: 'Protection Plus', description: 'Extended insurance & damage protection on all bookings' },
  { icon: Zap, title: 'Early Access', description: 'Be first to explore new cities & experiences before anyone else' },
  { icon: Gift, title: 'Exclusive Events', description: 'Invite-only tournaments, parties & experiences' },
  { icon: Award, title: 'Reward Boost', description: 'Earn Hive Coins 2x faster with every activity' },
];

export default function HelpHivePassPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [purchasingPlan, setPurchasingPlan] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const yearlyDiscount = 20;

  useEffect(() => {
    // Check for user session (from Firebase auth)
    const checkUser = async () => {
      // This would integrate with Firebase auth
      // For now, we'll just check localStorage or context
    };
    checkUser();
  }, []);

  const handlePurchase = async (plan: typeof plans[0]) => {
    if (plan.price === 0) {
      alert('This plan is free! You already have access.');
      return;
    }

    setPurchasingPlan(plan.id);

    try {
      // Create order
      const response = await fetch('/api/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          userId: 'demo-user', // Would come from auth
          billing: billingCycle,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.demo) {
          // Demo mode - show success
          alert(`Demo Mode: ${plan.name} subscription created!\nPrice: ₹${data.amount}`);
        } else if (data.orderId) {
          // Real Razorpay checkout
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: data.amount,
            currency: data.currency,
            name: 'Helphive',
            description: `${plan.name} Subscription`,
            order_id: data.orderId,
            prefill: {
              name: user?.displayName || 'User',
              email: user?.email || '',
            },
            handler: async (response: any) => {
              // Update membership status
              await fetch('/api/membership', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  receipt: `membership_${plan.id}_${Date.now()}`,
                  paymentId: response.razorpay_payment_id,
                  status: 'captured',
                }),
              });
              alert('Payment successful! Your membership is now active.');
            },
          };

          const Razorpay = (window as any).Razorpay;
          if (Razorpay) {
            const rzp = new Razorpay(options);
            rzp.on('payment.failed', (response: any) => {
              alert('Payment failed: ' + response.error.description);
            });
            rzp.open();
          }
        }
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Failed to initiate purchase. Please try again.');
    } finally {
      setPurchasingPlan(null);
    }
  };

  const currentPlans = plans.filter(plan =>
    billingCycle === 'monthly'
      ? !plan.id.includes('yearly')
      : plan.id.includes('yearly')
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-16 lg:pt-[72px]">
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-[var(--color-surface-muted)] to-white py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary-10)] rounded-full mb-6">
                <Crown className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Helphive Pass</span>
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-[var(--color-text)] mb-4">
                Get More. Save More.
              </h1>
              <p className="text-lg text-[var(--color-text-secondary)]">
                Unlock exclusive benefits, zero fees, and priority access with Helphive membership.
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-[var(--color-text)] text-white'
                    : 'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-[var(--color-text)] text-white'
                    : 'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]'
                }`}
              >
                Yearly
                <span className="px-2 py-0.5 bg-[var(--color-success)] text-white text-xs rounded-full">
                  Save {yearlyDiscount}%
                </span>
              </button>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {currentPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative rounded-[var(--radius-xl)] p-6 lg:p-8 ${
                    plan.popular
                      ? 'bg-[var(--color-text)] text-white shadow-xl'
                      : 'bg-white border border-[var(--color-border-light)]'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--color-primary)] text-white text-xs font-semibold rounded-full">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className={`text-sm ${plan.popular ? 'text-white/70' : 'text-[var(--color-text-secondary)]'}`}>
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold">₹{plan.price}</span>
                    {plan.price > 0 && (
                      <span className={`text-sm ${plan.popular ? 'text-white/70' : 'text-[var(--color-text-secondary)]'}`}>
                        /{plan.period}
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={() => handlePurchase(plan)}
                    variant={plan.popular ? 'secondary' : 'outline'}
                    size="lg"
                    className={`w-full mb-6 ${plan.popular ? 'bg-white text-[var(--color-text)] hover:bg-gray-100' : ''}`}
                    disabled={purchasingPlan === plan.id}
                  >
                    {purchasingPlan === plan.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      plan.cta
                    )}
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2">
                        <Check className={`h-5 w-5 shrink-0 mt-0.5 ${plan.popular ? 'text-white' : 'text-[var(--color-success)]'}`} />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((feature) => (
                      <div key={feature} className="flex items-start gap-2 opacity-40">
                        <span className="h-5 w-5 shrink-0 mt-0.5 flex items-center justify-center text-sm">—</span>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-4xl font-bold text-[var(--color-text)] mb-4">
                Everything You Get
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)]">
                Designed to make every interaction better
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-surface-muted)] animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: 'var(--color-primary-10)' }}>
                    <benefit.icon className="h-6 w-6" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <h3 className="font-semibold text-[var(--color-text)] mb-2">{benefit.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 bg-[var(--color-surface-muted)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-[var(--color-text)]">10K+</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Active Members</p>
              </div>
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-[var(--color-text)]">₹50L+</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Saved in Fees</p>
              </div>
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-[var(--color-text)]">4.9</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Member Rating</p>
              </div>
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-[var(--color-text)]">500+</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Exclusive Events</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl lg:text-4xl font-bold text-[var(--color-text)] mb-8 text-center">
              Common Questions
            </h2>

            <div className="space-y-4">
              {[
                { q: 'Can I cancel my membership anytime?', a: 'Yes! Cancel anytime from your account settings. You\'ll retain benefits until your billing period ends.' },
                { q: 'How does the free trial work?', a: 'Start with a 7-day free trial on the Helphive Pass. No payment required until your trial ends.' },
                { q: 'Do rewards stack with other offers?', a: 'Yes! Hive Coins and discount multipliers stack with existing promotional codes.' },
                { q: 'Is there a refund policy?', a: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, contact support for a full refund.' },
              ].map((faq) => (
                <details key={faq.q} className="group rounded-[var(--radius-lg)] bg-[var(--color-surface-muted)]">
                  <summary className="flex items-center justify-between p-4 cursor-pointer font-medium">
                    {faq.q}
                    <span className="text-[var(--color-text-muted)] group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="px-4 pb-4 text-sm text-[var(--color-text-secondary)]">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[var(--color-text)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Join thousands of members who save time and money with Helphive Pass.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-[var(--color-text)] hover:bg-gray-100"
                onClick={() => handlePurchase({ id: 'helphive-pass', name: 'Helphive Pass', price: 199, period: 'month', cta: 'Start Free Trial', popular: true, description: '', features: [], notIncluded: [] })}
              >
                Start Free Trial
              </Button>
              <Link href="/auth/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
