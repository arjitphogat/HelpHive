'use client';

import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui';
import { Shield, Heart, Clock, Phone, CheckCircle, Star, Users, Lock, Eye } from 'lucide-react';

const safetyFeatures = [
  {
    icon: Shield,
    title: 'Verified Fleet',
    description: 'Every vehicle undergoes rigorous safety checks. Our team verifies documents, inspects conditions, and ensures all vehicles meet our high standards.',
    details: ['Government ID verification', 'Vehicle inspection', 'Insurance verification', 'Background checks'],
  },
  {
    icon: Heart,
    title: 'Safety Gear Included',
    description: 'Every rental comes with complimentary safety gear. Helmets, reflectors, and first-aid kits are provided to ensure your safety on the road.',
    details: ['Quality helmets', 'Reflective vests', 'First-aid kit', 'Emergency contacts'],
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Our dedicated support team is available round the clock. Whether it\'s a flat tire or a question, we\'re here to help anytime.',
    details: ['Live chat support', 'Emergency hotline', 'WhatsApp assistance', 'Quick response team'],
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    description: 'Your transactions are protected with bank-level security. We never store your card details and all payments are encrypted.',
    details: ['256-bit encryption', 'Secure checkout', 'Fraud protection', 'Money-back guarantee'],
  },
];

const tips = [
  { title: 'Always wear a helmet', icon: '🪖' },
  { title: 'Check vehicle before riding', icon: '🔧' },
  { title: 'Follow traffic rules', icon: '🚦' },
  { title: 'Share trip details', icon: '📍' },
  { title: 'Stay hydrated', icon: '💧' },
  { title: 'Know emergency numbers', icon: '📞' },
];

const insuranceFeatures = [
  'Third-party liability coverage',
  'Personal accident cover',
  'Vehicle damage protection',
  'Theft protection',
  'Roadside assistance',
  'Medical emergency support',
];

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-16 lg:pt-[72px]">
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-[var(--color-surface-muted)] to-white py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'var(--color-primary-10)' }}>
                <Shield className="h-10 w-10" style={{ color: 'var(--color-primary)' }} />
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-[var(--color-text)] mb-4">
                Your Safety is Our
                <span style={{ color: 'var(--color-primary)' }}> Priority</span>
              </h1>
              <p className="text-lg text-[var(--color-text-secondary)]">
                We've built comprehensive safety measures so you can explore with complete peace of mind. From verified vehicles to 24/7 support, we've got you covered.
              </p>
            </div>
          </div>
        </section>

        {/* Trust Stats */}
        <section className="py-8 bg-[var(--color-surface-muted)] border-y border-[var(--color-border-light)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-[var(--color-text)]">50K+</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Safe Trips</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[var(--color-text)]">99.9%</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Safety Record</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[var(--color-text)]">24/7</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Support Available</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[var(--color-text)]">100%</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Verified Hosts</p>
              </div>
            </div>
          </div>
        </section>

        {/* Safety Features */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-4xl font-bold text-[var(--color-text)] mb-4">
                How We Keep You Safe
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)]">
                Comprehensive safety measures at every step
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {safetyFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                  className="p-6 lg:p-8 rounded-[var(--radius-xl)] bg-[var(--color-surface-muted)] animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-[var(--radius-lg)] flex items-center justify-center" style={{ background: 'var(--color-primary-10)' }}>
                      <feature.icon className="h-7 w-7" style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">{feature.title}</h3>
                      <p className="text-[var(--color-text-secondary)]">{feature.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {feature.details.map((detail) => (
                      <div key={detail} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-[var(--color-success)]" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency SOS */}
        <section className="py-16 bg-[var(--color-error-light)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-error)] text-white rounded-full mb-4">
                  <Phone className="h-4 w-4" />
                  <span className="font-semibold">Emergency SOS</span>
                </div>
                <h2 className="text-2xl lg:text-4xl font-bold text-[var(--color-text)] mb-4">
                  Help is Always Just a Tap Away
                </h2>
                <p className="text-[var(--color-text-secondary)] mb-6">
                  In any emergency situation, tap the SOS button in the app. You'll be immediately connected to our 24/7 emergency response team who can dispatch help, contact authorities, and assist you in any language.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-[var(--color-error)] hover:bg-[var(--color-error)]">
                    <Phone className="h-4 w-4 mr-2" />
                    Emergency Helpline
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Share Live Location
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 rounded-full flex items-center justify-center" style={{ background: 'var(--color-error)' }}>
                    <Phone className="h-20 w-20 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Insurance */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl lg:text-4xl font-bold text-[var(--color-text)] mb-4">
                  Comprehensive Insurance
                </h2>
                <p className="text-lg text-[var(--color-text-secondary)] mb-6">
                  Every booking includes comprehensive insurance coverage. Ride with confidence knowing you're protected against unforeseen circumstances.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {insuranceFeatures.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-[var(--color-success)]" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/insurance" className="inline-block mt-6">
                  <Button variant="outline">Learn More About Insurance</Button>
                </Link>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
                  alt="Safe travel"
                  className="rounded-[var(--radius-2xl)] shadow-xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-white rounded-[var(--radius-xl)] shadow-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--color-success-light)' }}>
                      <Shield className="h-6 w-6 text-[var(--color-success)]" />
                    </div>
                    <div>
                      <p className="font-bold text-[var(--color-text)]">Fully Insured</p>
                      <p className="text-sm text-[var(--color-text-secondary)]">All bookings covered</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Safety Tips */}
        <section className="py-16 bg-[var(--color-surface-muted)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-4xl font-bold text-[var(--color-text)] mb-4">
                Safety Tips for Riders
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)]">
                Follow these guidelines for a safe and enjoyable experience
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {tips.map((tip, index) => (
                <div
                  key={tip.title}
                  className="flex items-center gap-3 p-4 bg-white rounded-[var(--radius-xl)] shadow-sm"
                >
                  <span className="text-2xl">{tip.icon}</span>
                  <span className="font-medium text-[var(--color-text)]">{tip.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ratings */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-4xl font-bold text-[var(--color-text)] mb-4">
                What Our Users Say
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Priya S.', location: 'Goa', text: 'Felt completely safe throughout my trip. The emergency support was incredibly responsive when I had a minor issue.', rating: 5 },
                { name: 'Rahul M.', location: 'Jaipur', text: 'The safety gear provided was top quality. Helmets were clean and well-maintained. Great attention to detail!', rating: 5 },
                { name: 'Anita K.', location: 'Rishikesh', text: 'Love the live tracking feature. My family could see my location throughout the trip. Very reassuring.', rating: 5 },
              ].map((review) => (
                <div key={review.name} className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-surface-muted)]">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[var(--color-primary)]" style={{ color: 'var(--color-primary)' }} />
                    ))}
                  </div>
                  <p className="text-[var(--color-text-secondary)] mb-4">"{review.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'var(--color-primary)' }}>
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--color-text)]">{review.name}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">{review.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[var(--color-text)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4">
              Ready to Explore Safely?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Book your next adventure with complete peace of mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/explore/vehicles">
                <Button size="lg" className="bg-white text-[var(--color-text)] hover:bg-gray-100">
                  Book Your Ride
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Support
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
