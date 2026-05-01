'use client';

import { Header, Footer } from '@/components/layout';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6">
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-500 mb-8">Last updated: May 1, 2026</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using HELPHIVE (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-600 mb-4">
                HELPHIVE is a platform that connects users with vehicle rental services (tuk-tuks, motorcycles, scooters) and local tour/experience guides. We facilitate bookings but are not a transportation or tour company ourselves.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-600 mb-4">
                To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>You must provide accurate and complete information</li>
                <li>You must be at least 18 years old to use our services</li>
                <li>You are responsible for any activity on your account</li>
                <li>You must notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Booking and Cancellations</h2>
              <p className="text-gray-600 mb-4">
                When you make a booking through our platform:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>You agree to pay the displayed price plus applicable fees</li>
                <li>Cancellations made 24+ hours before the booking are fully refundable</li>
                <li>Cancellations within 24 hours may be subject to a cancellation fee</li>
                <li>No-shows are non-refundable</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Host Responsibilities</h2>
              <p className="text-gray-600 mb-4">
                Hosts listing vehicles or experiences on our platform agree to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Provide accurate descriptions of their vehicle or experience</li>
                <li>Maintain vehicles in safe, roadworthy condition</li>
                <li>Have valid insurance and licensing as required by law</li>
                <li>Be present or have a representative available at agreed times</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Rental Requirements</h2>
              <p className="text-gray-600 mb-4">
                For vehicle rentals, users must:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Possess a valid driving license</li>
                <li>Be at least 18 years old (21+ for certain vehicle types)</li>
                <li>Provide a valid ID proof at pickup</li>
                <li>Follow all traffic rules and regulations</li>
                <li>Return the vehicle in the same condition</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Damage and Liability</h2>
              <p className="text-gray-600 mb-4">
                Users are responsible for any damage to vehicles during their rental period. HELPHIVE provides basic insurance coverage, but excess fees may apply for damages. We recommend reviewing insurance terms before booking.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Payment Terms</h2>
              <p className="text-gray-600 mb-4">
                All payments are processed securely through our platform. We accept major credit cards, debit cards, and UPI payments. Funds are held until the service is completed successfully.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. User Conduct</h2>
              <p className="text-gray-600 mb-4">
                Users agree not to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Use our platform for any illegal purpose</li>
                <li>Violate any laws in your jurisdiction</li>
                <li>Harass or abuse hosts, guides, or other users</li>
                <li>Submit false or misleading information</li>
                <li>Interfere with the proper operation of our platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                All content on our platform, including logos, designs, and text, is the property of HELPHIVE or its licensors and may not be reproduced without permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                HELPHIVE acts as an intermediary between users and hosts. We are not liable for any injuries, damages, or losses that occur during bookings. Users book services at their own risk and should exercise appropriate caution.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Privacy</h2>
              <p className="text-gray-600 mb-4">
                Your use of our platform is also governed by our Privacy Policy. Please review it to understand how we collect, use, and protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify these terms at any time. Continued use of our platform after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">14. Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about these Terms of Service, please contact us at:
                <br />
                <span className="font-medium">Email:</span> legal@helphive.com
                <br />
                <span className="font-medium">Phone:</span> +91 98765 43210
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}