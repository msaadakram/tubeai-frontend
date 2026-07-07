"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { FileText, Shield, Scale, AlertTriangle, Mail } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "account", title: "2. Your Account" },
  { id: "subscription", title: "3. Subscriptions & Billing" },
  { id: "trial", title: "4. Free Trial & Refunds" },
  { id: "use", title: "5. Acceptable Use" },
  { id: "content", title: "6. Your Content & License" },
  { id: "ai", title: "7. AI-Generated Output" },
  { id: "ip", title: "8. Intellectual Property" },
  { id: "third-party", title: "9. Third-Party Services" },
  { id: "termination", title: "10. Termination" },
  { id: "disclaimer", title: "11. Disclaimer of Warranties" },
  { id: "liability", title: "12. Limitation of Liability" },
  { id: "indemnity", title: "13. Indemnification" },
  { id: "governing", title: "14. Governing Law" },
  { id: "changes", title: "15. Changes to Terms" },
  { id: "contact", title: "16. Contact" },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-red-600 border-b-4 border-black pt-16 sm:pt-18">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.25)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 relative">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white text-xs font-black tracking-wider uppercase mb-6 border-2 border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)]">
              <Scale className="w-3.5 h-3.5 text-red-500" /> Legal · Last updated May 10, 2026
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4 [text-shadow:_3px_3px_0_rgb(0_0_0_/_30%)]">
              Terms of Service
            </h1>
            <p className="text-base sm:text-lg text-red-50 leading-relaxed max-w-2xl mx-auto">
              The fine print, written in plain English. By using YTForge, you agree to these terms — please read them carefully.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="flex-1 bg-neutral-50 py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 max-w-6xl mx-auto">
            {/* Sidebar TOC */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-red-600" />
                  <div className="font-black text-sm uppercase tracking-wider">Contents</div>
                </div>
                <nav className="space-y-1 max-h-[60vh] overflow-y-auto">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="block px-3 py-1.5 text-xs font-bold text-neutral-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Body */}
            <article className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-10">
              <div className="prose prose-neutral max-w-none [&_h2]:text-2xl [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-24 first:[&_h2]:mt-0 [&_h3]:font-black [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-neutral-700 [&_p]:leading-relaxed [&_p]:mb-4 [&_a]:text-red-600 [&_a]:font-black [&_a]:underline [&_strong]:font-black [&_strong]:text-black [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:text-neutral-700 [&_li]:mb-1.5">
                <p className="text-sm text-neutral-500 font-bold border-b-2 border-dashed border-neutral-200 pb-4 mb-6">
                  Effective Date: May 10, 2026 · Version 4.2
                </p>

                <h2 id="acceptance">1. Acceptance of Terms</h2>
                <p>Welcome to YTForge. These Terms of Service ("Terms") form a binding agreement between you ("you", "your", "Creator") and YTForge Inc. ("YTForge", "we", "us") governing your access to and use of our website, applications, APIs, and any services we offer (collectively, the "Service"). By creating an account, accessing, or using the Service, you confirm you've read, understood, and agree to be bound by these Terms and our <Link href="/privacy">Privacy Policy</Link>.</p>
                <p>If you're using the Service on behalf of a company, organization, or other legal entity, you represent that you have authority to bind that entity to these Terms. You must be at least 13 years old (or the digital age of consent in your jurisdiction) to use YTForge.</p>

                <h2 id="account">2. Your Account</h2>
                <p>To access most features, you'll need to register an account. You agree to:</p>
                <ul>
                  <li>Provide accurate, current, and complete information during signup</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Notify us immediately of any unauthorized account access</li>
                  <li>Take responsibility for all activity that occurs under your account</li>
                </ul>
                <p>You are responsible for safeguarding your credentials. YTForge is not liable for losses caused by unauthorized use of your account if you fail to follow these obligations.</p>

                <h2 id="subscription">3. Subscriptions & Billing</h2>
                <p>YTForge offers Free, Creator, Pro, and Enterprise plans, detailed on our <Link href="/pricing">pricing page</Link>. Paid subscriptions are billed monthly or annually, in advance, in U.S. dollars unless otherwise specified.</p>
                <h3>Auto-renewal</h3>
                <p>Subscriptions renew automatically at the end of each billing cycle at the then-current rate. You authorize us to charge your payment method for renewals until you cancel. You can cancel anytime in your account settings — cancellation takes effect at the end of your current billing period.</p>
                <h3>Price changes</h3>
                <p>We may change subscription prices with at least 30 days' notice. Price changes take effect at your next renewal. If you don't agree, you may cancel before the change takes effect.</p>
                <h3>Failed payments</h3>
                <p>If a payment fails, we'll retry for up to 14 days. After that, your subscription downgrades to the Free plan and premium features become unavailable until payment is restored.</p>

                <h2 id="trial">4. Free Trial & Refunds</h2>
                <p>New accounts may activate a 7-day free trial of any paid plan. No credit card is required to start the trial; if you provide a payment method, you'll be billed at the end of the trial unless you cancel before day 7.</p>
                <h3>30-Day Money-Back Guarantee</h3>
                <p>If you're unsatisfied with a paid plan, contact <a href="mailto:support@ytforge.app">support@ytforge.app</a> within 30 days of your initial purchase or upgrade for a full refund — no questions asked. The guarantee applies to first-time paid customers and does not stack across multiple plan changes.</p>

                <h2 id="use">5. Acceptable Use</h2>
                <p>You agree NOT to use YTForge to:</p>
                <ul>
                  <li>Generate or distribute content that is illegal, defamatory, hateful, sexually explicit involving minors, or that incites violence</li>
                  <li>Infringe on any third party's intellectual property, privacy, or publicity rights</li>
                  <li>Generate misleading deepfakes, impersonate real people without consent, or spread disinformation</li>
                  <li>Reverse-engineer, scrape, or attempt to extract our AI models or training data</li>
                  <li>Resell the Service or its outputs as a competing AI tool</li>
                  <li>Bypass rate limits, share accounts, or abuse our infrastructure</li>
                  <li>Use the Service to violate YouTube's Terms of Service, Community Guidelines, or any applicable law</li>
                </ul>
                <p>We reserve the right to suspend or terminate accounts that violate these rules, with or without notice.</p>

                <h2 id="content">6. Your Content & License</h2>
                <p>"Your Content" means anything you upload, paste, type, or otherwise submit to the Service — channel URLs, scripts, prompts, images, audio, and so on. You retain full ownership of Your Content.</p>
                <p>You grant YTForge a worldwide, non-exclusive, royalty-free license to host, store, process, and display Your Content solely for the purpose of operating and improving the Service for you. This license ends when you delete Your Content or close your account.</p>
                <p><strong>We will never train our public AI models on Your Content.</strong> Customer data is segregated from training data, and you can request deletion at any time.</p>

                <h2 id="ai">7. AI-Generated Output</h2>
                <p>"Output" means anything generated by YTForge's AI models in response to Your Content — titles, scripts, thumbnails, transcripts, analyses, and so on.</p>
                <h3>Ownership</h3>
                <p>To the extent permitted by law, you own the Output you generate using YTForge. We assign to you any rights we may have in the Output. You're responsible for verifying that Output complies with applicable laws and platform policies before publishing.</p>
                <h3>Accuracy disclaimer</h3>
                <p>AI-generated content can be inaccurate, outdated, or biased. Channel analytics, monetization estimates, and earnings projections are estimates only — not guarantees. You should independently verify critical information before relying on it.</p>
                <h3>Similarity</h3>
                <p>Because AI generates similar outputs from similar inputs, your Output may resemble outputs generated by other users. We make no exclusivity guarantee on AI-generated content.</p>

                <h2 id="ip">8. Intellectual Property</h2>
                <p>YTForge, including all software, models, designs, logos, and content (excluding Your Content and Output), is the property of YTForge Inc. and protected by copyright, trademark, and other laws. You may not copy, modify, distribute, or create derivative works of the Service without prior written permission.</p>
                <p>You may use YTForge's name and logo in non-disparaging contexts (e.g., "Made with YTForge") without prior approval.</p>

                <h2 id="third-party">9. Third-Party Services</h2>
                <p>YTForge integrates with third-party platforms including YouTube, Google, Stripe, Slack, Notion, Zapier, and others. Your use of these integrations is subject to those providers' own terms and policies. YTForge is not responsible for the availability, accuracy, or content of third-party services.</p>

                <h2 id="termination">10. Termination</h2>
                <p>You may delete your account at any time from your account settings. Upon deletion, we'll remove your personal data within 30 days, except where retention is required by law.</p>
                <p>We may suspend or terminate your account if you violate these Terms, abuse the Service, fail to pay, or for any other reason at our reasonable discretion. We'll generally provide notice and a chance to cure where appropriate.</p>

                <h2 id="disclaimer">11. Disclaimer of Warranties</h2>
                <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ACCURACY OF AI OUTPUTS. WE DON'T WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT IT WILL ACHIEVE ANY PARTICULAR RESULT FOR YOUR CHANNEL.</p>

                <h2 id="liability">12. Limitation of Liability</h2>
                <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, YTFORGE'S TOTAL LIABILITY UNDER THESE TERMS WILL NOT EXCEED THE AMOUNT YOU PAID YTFORGE IN THE 12 MONTHS PRECEDING THE CLAIM, OR $100, WHICHEVER IS GREATER. WE WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES — INCLUDING LOST REVENUE, LOST SUBSCRIBERS, OR LOST DATA — EVEN IF WE'VE BEEN ADVISED OF THE POSSIBILITY.</p>

                <h2 id="indemnity">13. Indemnification</h2>
                <p>You agree to indemnify and hold YTForge harmless from any claim, damage, or expense (including reasonable legal fees) arising from your use of the Service, Your Content, your Output, or your violation of these Terms or any third-party rights.</p>

                <h2 id="governing">14. Governing Law & Disputes</h2>
                <p>These Terms are governed by the laws of the State of Delaware, USA, without regard to conflict-of-law principles. Any dispute will be resolved by binding arbitration in San Francisco, California, under the rules of the American Arbitration Association — except for claims for injunctive relief, which may be brought in court. You waive any right to participate in a class action.</p>

                <h2 id="changes">15. Changes to These Terms</h2>
                <p>We may update these Terms from time to time. Material changes will be communicated via email and a prominent notice on the Service at least 30 days before they take effect. Your continued use after the effective date constitutes acceptance. If you don't agree, you may close your account.</p>

                <h2 id="contact">16. Contact</h2>
                <p>Questions about these Terms? Reach out:</p>
                <ul>
                  <li><strong>Email:</strong> <a href="mailto:legal@ytforge.app">legal@ytforge.app</a></li>
                  <li><strong>Support:</strong> <a href="mailto:support@ytforge.app">support@ytforge.app</a></li>
                  <li><strong>Mail:</strong> YTForge Inc., 548 Market St #65512, San Francisco, CA 94104</li>
                </ul>

                <div className="mt-10 p-5 bg-red-50 border-2 border-black rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-black text-sm mb-1">Plain-English summary</div>
                    <p className="text-xs text-neutral-700 leading-relaxed">
                      Use YTForge legally and ethically. You own what you create. We provide the tools "as is" — verify AI output before publishing. Cancel anytime, refund within 30 days. Don't try to break the platform.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Need help banner */}
          <div className="max-w-6xl mx-auto mt-10">
            <div className="bg-black border-2 border-black rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-[6px_6px_0px_0px_rgba(220,38,38,1)]">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center border-2 border-white shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-black text-lg text-white mb-1">Need clarification?</div>
                <p className="text-sm text-neutral-300 leading-relaxed">Our legal team replies within 2 business days. Email <a href="mailto:legal@ytforge.app" className="text-red-500 font-black underline">legal@ytforge.app</a>.</p>
              </div>
              <Link href="/privacy" className="inline-flex items-center gap-2 px-5 py-3 bg-white text-black font-black rounded-xl border-2 border-white hover:bg-neutral-100 transition-colors uppercase tracking-wider text-xs whitespace-nowrap">
                <Shield className="w-4 h-4" /> Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <LegalBreadcrumbJsonLd />
    </div>
  );
}

function LegalBreadcrumbJsonLd() {
  const bc = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://ytforge.app/" },
      { "@type": "ListItem", position: 2, name: "Terms", item: "https://ytforge.app/terms" },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />;
}
