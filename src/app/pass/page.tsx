'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui';
import { Check, Sparkles, Crown, Shield, Zap, Gift, Award } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Basic access to all features',
    features: [
      'Browse all vehicles & experiences',
      'Book rentals & tours',
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
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'HelpHive Pass',
    price: 199,
    period: 'month',
    description: 'For frequent explorers',
    features: [
      'Everything in Free',
      '0% booking fees',
      'Priority 24/7 support',
      '10% tournament discount',
      'Access to exclusive events',
      'Early access to new cities',
      '1.5x reward multiplier',
      'Free upgrades on bookings',
    ],
    notIncluded: [],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
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
    cta: 'Contact Sales',
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
  const yearlyDiscount = 20; // 2 months free

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
                <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>HelpHive Pass</span>
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-[var(--color-text)] mb-4">
                Explore More. Save More.
              </h1>
              <p className="text-lg text-[var(--color-text-secondary)]">
                Unlock exclusive benefits, zero fees, and priority access. The smarter way to explore India's best destinations.
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-[var(--radius-xl)] p-6 lg:p-8 ${
                    plan.popular
                      ? 'bg-[var(--color-text)] text-white shadow-xl scale-105'
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
                    <span className="text-4xl font-bold">₹{billingCycle === 'yearly' ? Math.round(plan.price * 12 * (1 - yearlyDiscount / 100)) : plan.price * 12}</span>
                    {plan.price > 0 && (
                      <span className={`text-sm ${plan.popular ? 'text-white/70' : 'text-[var(--color-text-secondary)]'}`}>
                        /{billingCycle === 'yearly' ? 'year' : plan.period}
                      </span>
                    )}
                  </div>

                  <Button
                    variant={plan.popular ? 'secondary' : 'outline'}
                    size="lg"
                    className={`w-full mb-6 ${plan.popular ? 'bg-white text-[var(--color-text)] hover:bg-gray-100' : ''}`}
                  >
                    {plan.cta}
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
                Designed to make every trip better
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
                <p className="text-3xl lg:text-4xl font-bold text-[var(--color-text)]">4.9★</p>
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
                { q: 'How does the free trial work?', a: 'Start with a 7-day free trial on the HelpHive Pass. No payment required until your trial ends.' },
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
              Ready to Unlock Your Best Trips?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Join thousands of explorers who save time and money with HelpHive Pass.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-[var(--color-text)] hover:bg-gray-100">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Talk to Sales
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
