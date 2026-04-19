'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import {
  Building2,
  Users,
  Trophy,
  Calendar,
  MapPin,
  Sparkles,
  PartyPopper,
  Target,
  Award,
  ChevronRight,
  Check,
  Phone,
  Mail
} from 'lucide-react';

const eventTypes = [
  {
    icon: PartyPopper,
    title: 'Team Building',
    description: 'Adventure challenges, scavenger hunts, and collaborative games',
    minGroup: 20,
    duration: '4-8 hours',
  },
  {
    icon: Trophy,
    title: 'Corporate Tournaments',
    description: 'Inter-team competitions with prizes and leaderboards',
    minGroup: 30,
    duration: '1-3 days',
  },
  {
    icon: MapPin,
    title: 'City Exploration',
    description: 'Guided tours, heritage walks, and local experiences',
    minGroup: 10,
    duration: '1-2 days',
  },
  {
    icon: Sparkles,
    title: 'Offsite Adventures',
    description: 'Complete event management for company offsites',
    minGroup: 50,
    duration: '2-5 days',
  },
];

const clients = [
  'Google', 'Microsoft', 'Amazon', 'Flipkart', 'Paytm', 'Swiggy', 'Zomato', 'Ola'
];

const inclusions = [
  'Custom event planning & logistics',
  'Professional guides & coordinators',
  'Premium fleet of vehicles',
  'Safety equipment & insurance',
  'Photography & videography',
  'Catering coordination',
  'Branded merchandise',
  'Post-event analytics',
];

export default function CorporateEventsPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    eventType: '',
    expectedDate: '',
    groupSize: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-16 lg:pt-[72px]">
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-[var(--color-surface-muted)] to-white py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary-10)] rounded-full mb-6">
                  <Building2 className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>Corporate Events</span>
                </div>
                <h1 className="text-3xl lg:text-5xl font-bold text-[var(--color-text)] mb-4 leading-tight">
                  Build Teams Through
                  <br />
                  <span style={{ color: 'var(--color-primary)' }}>Adventure</span>
                </h1>
                <p className="text-lg text-[var(--color-text-secondary)] mb-8">
                  Transform your team building from boring boardroom sessions to unforgettable adventures. We handle everything from planning to execution.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg">
                    Get a Quote <ChevronRight className="h-5 w-5 ml-1" />
                  </Button>
                  <Button size="lg" variant="outline">
                    View Case Studies
                  </Button>
                </div>
              </div>

              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                  alt="Corporate team building"
                  className="rounded-[var(--radius-2xl)] shadow-xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-[var(--radius-xl)] shadow-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white" style={{ background: 'var(--color-primary)' }}>
                      200+
                    </div>
                    <div>
                      <p className="font-bold text-[var(--color-text)]">Events Completed</p>
                      <p className="text-sm text-[var(--color-text-secondary)]">Across 12 cities</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By */}
        <section className="py-8 border-b border-[var(--color-border-light)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-[var(--color-text-muted)] mb-4">Trusted by teams at</p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {clients.map((client) => (
                <span key={client} className="text-lg font-bold text-[var(--color-text-muted)]">{client}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Event Types */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-4xl font-bold text-[var(--color-text)] mb-4">
                Event Types
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)]">
                From team challenges to full-scale offsites, we've got you covered
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {eventTypes.map((event, index) => (
                <div
                  key={event.title}
                  className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-surface-muted)] hover:shadow-lg transition-shadow cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-[var(--radius-lg)] flex items-center justify-center" style={{ background: 'var(--color-primary-10)' }}>
                      <event.icon className="h-7 w-7" style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">{event.title}</h3>
                      <p className="text-[var(--color-text-secondary)] mb-4">{event.description}</p>
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1 text-[var(--color-text-muted)]">
                          <Users className="h-4 w-4" />
                          <span>Min {event.minGroup}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[var(--color-text-muted)]">
                          <Calendar className="h-4 w-4" />
                          <span>{event.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Inclusions */}
        <section className="py-16 bg-[var(--color-surface-muted)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl lg:text-4xl font-bold text-[var(--color-text)] mb-4">
                  Everything Included
                </h2>
                <p className="text-lg text-[var(--color-text-secondary)] mb-8">
                  We handle the entire event so you can focus on your team. Our packages include:
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {inclusions.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-[var(--color-success)]" />
                      <span className="text-sm text-[var(--color-text)]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop"
                  alt="Corporate event"
                  className="rounded-[var(--radius-2xl)] shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl lg:text-5xl font-bold text-[var(--color-text)]">200+</p>
                <p className="text-[var(--color-text-secondary)]">Events Hosted</p>
              </div>
              <div>
                <p className="text-3xl lg:text-5xl font-bold text-[var(--color-text)]">50K+</p>
                <p className="text-[var(--color-text-secondary)]">Participants</p>
              </div>
              <div>
                <p className="text-3xl lg:text-5xl font-bold text-[var(--color-text)]">98%</p>
                <p className="text-[var(--color-text-secondary)]">Satisfaction Rate</p>
              </div>
              <div>
                <p className="text-3xl lg:text-5xl font-bold text-[var(--color-text)]">12</p>
                <p className="text-[var(--color-text-secondary)]">Cities Covered</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-[var(--color-text)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4">
                Plan Your Corporate Event
              </h2>
              <p className="text-lg text-white/70">
                Get a custom quote within 24 hours
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-[var(--radius-2xl)] p-6 lg:p-8">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Your Name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Company"
                  placeholder="Acme Corp"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Work Email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Event Type"
                  placeholder="Team Building"
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                />
                <Input
                  label="Expected Date"
                  type="date"
                  value={formData.expectedDate}
                  onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <Input
                  label="Group Size"
                  placeholder="50-100 people"
                  value={formData.groupSize}
                  onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                  Additional Details
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  rows={4}
                  placeholder="Tell us about your event requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <Button type="submit" size="lg" className="w-full">
                Get Custom Quote
              </Button>
            </form>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
              <a href="tel:+919876543210" className="flex items-center gap-2 text-white hover:text-white/80 transition-colors">
                <Phone className="h-5 w-5" />
                <span>+91 98765 43210</span>
              </a>
              <a href="mailto:corporate@helphive.in" className="flex items-center gap-2 text-white hover:text-white/80 transition-colors">
                <Mail className="h-5 w-5" />
                <span>corporate@helphive.in</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
