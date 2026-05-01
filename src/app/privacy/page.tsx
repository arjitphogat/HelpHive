'use client';

import { Header, Footer } from '@/components/layout';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6">
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: May 1, 2026</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                HELPHIVE (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, website, and services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li><strong>Account Information:</strong> Name, email address, phone number, profile picture, and password</li>
                <li><strong>Verification Documents:</strong> Government-issued ID (for hosts and guides), driving license</li>
                <li><strong>Payment Information:</strong> Credit/debit card details, UPI ID (processed securely through third-party payment providers)</li>
                <li><strong>Location Data:</strong> Current location for finding nearby vehicles and experiences</li>
                <li><strong>Communication Data:</strong> Messages exchanged through our platform</li>
                <li><strong>Vehicle/Experience Data:</strong> Photos, descriptions, pricing (for hosts)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Create and manage your account</li>
                <li>Process bookings and payments</li>
                <li>Connect users with hosts and guides</li>
                <li>Send booking confirmations and updates</li>
                <li>Provide customer support</li>
                <li>Improve our services and user experience</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Detect and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We may share your information with:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li><strong>Hosts/Guides:</strong> Your name and contact details for booking purposes</li>
                <li><strong>Service Providers:</strong> Third parties who help us operate our platform (payment processing, cloud storage, analytics)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In case of a merger, acquisition, or sale of assets</li>
              </ul>
              <p className="text-gray-600 mb-4">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
              <p className="text-gray-600 mb-4">
                We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your account at any time, and we will delete your information within 30 days, except where retention is required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate technical and organizational measures to protect your information, including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Encryption of data in transit using SSL/TLS</li>
                <li>Secure storage with encryption at rest</li>
                <li>Regular security audits and testing</li>
                <li>Access controls and authentication measures</li>
                <li>Employee training on data protection</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
              <p className="text-gray-600 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt out of promotional communications</li>
                <li>Export your data in a portable format</li>
                <li>Object to certain processing activities</li>
                <li>Lodge a complaint with a data protection authority</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking</h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Remember your preferences and login status</li>
                <li>Understand how you use our platform</li>
                <li>Deliver personalized content and recommendations</li>
                <li>Show relevant advertisements</li>
              </ul>
              <p className="text-gray-600 mb-4">
                You can control cookies through your browser settings. Disabling cookies may affect some features of our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Location Services</h2>
              <p className="text-gray-600 mb-4">
                Our app may request access to your device&apos;s location to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Show nearby vehicles and experiences</li>
                <li>Enable ride tracking during active bookings</li>
                <li>Calculate distances for pricing</li>
              </ul>
              <p className="text-gray-600 mb-4">
                Location data is only collected with your explicit permission and can be revoked at any time through your device settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Third-Party Links</h2>
              <p className="text-gray-600 mb-4">
                Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Children&apos;s Privacy</h2>
              <p className="text-gray-600 mb-4">
                Our services are not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">12. International Transfers</h2>
              <p className="text-gray-600 mb-4">
                Your information may be transferred to and processed in countries other than India. When we transfer data internationally, we ensure appropriate safeguards are in place.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Changes to This Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">14. Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions or concerns about this Privacy Policy, please contact our Data Protection Officer:
                <br /><br />
                <span className="font-medium">Email:</span> privacy@helphive.com
                <br />
                <span className="font-medium">Phone:</span> +91 98765 43210
                <br />
                <span className="font-medium">Address:</span> HELPHIVE, Mumbai, India
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}