"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Cookie,
  Globe,
  UserCheck,
  Mail,
  Scale,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const sections = [
  { id: "intro", title: "1. Introduction" },
  { id: "data-we-collect", title: "2. Data We Collect" },
  { id: "how-we-use", title: "3. How We Use Your Data" },
  { id: "newsletter", title: "4. Newsletter & Marketing Email" },
  { id: "ai-training", title: "5. AI Training & Your Content" },
  { id: "sharing", title: "6. How We Share Data" },
  { id: "cookies", title: "7. Cookies & Tracking" },
  { id: "retention", title: "8. Data Retention" },
  { id: "security", title: "9. Security Measures" },
  { id: "rights", title: "10. Your Privacy Rights" },
  { id: "international", title: "11. International Transfers" },
  { id: "children", title: "12. Children's Privacy" },
  { id: "changes", title: "13. Changes to This Policy" },
  { id: "contact", title: "14. Contact & DPO" },
];

const principles = [
  { icon: Lock, t: "Encrypted everywhere", d: "TLS 1.3 in transit, AES-256 at rest" },
  { icon: Database, t: "Never trained on your content", d: "Your scripts, channels, and prompts stay yours" },
  { icon: UserCheck, t: "You're in control", d: "Export, edit, or delete your data anytime" },
  { icon: Globe, t: "GDPR + CCPA compliant", d: "Full data rights for EU and California residents" },
];

export default function PrivacyPage() {
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
              <Shield className="w-3.5 h-3.5 text-red-500" /> Last updated May 10, 2026
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4 [text-shadow:_3px_3px_0_rgb(0_0_0_/_30%)]">
              Privacy Policy
            </h1>
            <p className="text-base sm:text-lg text-red-50 leading-relaxed max-w-2xl mx-auto">
              How we collect, use, and protect your data. No dark patterns, no fine-print traps — just plain-English commitments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Principles strip */}
      <section className="bg-white border-b-2 border-black py-8 sm:py-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-6xl mx-auto">
            {principles.map((p, i) => (
              <motion.div
                key={p.t}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white border-2 border-black rounded-xl p-4 flex items-start gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center border-2 border-black shrink-0">
                  <p.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-black text-sm">{p.t}</div>
                  <div className="text-[11px] text-neutral-500 font-bold leading-snug">{p.d}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <main className="flex-1 bg-neutral-50 py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 max-w-6xl mx-auto">
            {/* TOC */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-red-600" />
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

            <article className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-10">
              <div className="prose prose-neutral max-w-none [&_h2]:text-2xl [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-24 first:[&_h2]:mt-0 [&_h3]:font-black [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-neutral-700 [&_p]:leading-relaxed [&_p]:mb-4 [&_a]:text-red-600 [&_a]:font-black [&_a]:underline [&_strong]:font-black [&_strong]:text-black [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:text-neutral-700 [&_li]:mb-1.5 [&_table]:w-full [&_table]:border-collapse [&_th]:p-3 [&_th]:text-left [&_th]:bg-black [&_th]:text-white [&_th]:font-black [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-wider [&_td]:p-3 [&_td]:border-2 [&_td]:border-black [&_td]:text-sm">
                <p className="text-sm text-neutral-500 font-bold border-b-2 border-dashed border-neutral-200 pb-4 mb-6">
                  Effective Date: May 10, 2026 · Version 3.7 · GDPR + CCPA + LGPD aligned
                </p>

                <h2 id="intro">1. Introduction</h2>
                <p>This Privacy Policy explains how YTForge Inc. ("YTForge", "we", "us") collects, uses, shares, and protects your personal information when you use our website, applications, APIs, and related services (collectively, the "Service"). It applies to all users worldwide, with additional rights for residents of the European Economic Area (EEA), United Kingdom, California, Brazil, and other jurisdictions with comprehensive data-protection laws.</p>
                <p>We've written this in plain English. If anything is unclear, email <a href="mailto:privacy@ytforge.app">privacy@ytforge.app</a> and we'll explain.</p>

                <h2 id="data-we-collect">2. Data We Collect</h2>
                <h3>You provide directly</h3>
                <ul>
                  <li><strong>Account data:</strong> name, email, password (hashed), profile photo, billing address</li>
                  <li><strong>Payment data:</strong> processed by Stripe — we never store full card numbers, only the last 4 digits and expiration</li>
                  <li><strong>Content you submit:</strong> channel URLs, prompts, scripts, transcripts, uploaded images, and any other inputs to AI tools</li>
                  <li><strong>Newsletter sign-ups:</strong> the email address you enter in the footer newsletter form when you subscribe to the weekly creator newsletter</li>
                  <li><strong>Communications:</strong> support tickets, survey responses, community forum posts</li>
                </ul>
                <h3>Collected automatically</h3>
                <ul>
                  <li><strong>Usage data:</strong> pages visited, features used, generation counts, click events, error logs</li>
                  <li><strong>Device data:</strong> IP address, browser type, OS, screen resolution, timezone, language</li>
                  <li><strong>Performance data:</strong> page load times, API latency, anonymized error stack traces</li>
                </ul>
                <h3>From third parties</h3>
                <ul>
                  <li><strong>OAuth providers:</strong> if you sign in with Google or Apple, we receive your email and name from them</li>
                  <li><strong>YouTube public data:</strong> publicly available channel metadata when you paste a URL into a tool</li>
                  <li><strong>Payment processors:</strong> billing confirmation, dispute notifications, fraud signals</li>
                </ul>

                <h2 id="how-we-use">3. How We Use Your Data</h2>
                <p>We use your data only for the specific purposes below. We don't sell personal data, ever.</p>
                <table>
                  <thead>
                    <tr><th>Purpose</th><th>Legal Basis (GDPR)</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Provide and operate the Service</td><td>Performance of contract</td></tr>
                    <tr><td>Process payments and prevent fraud</td><td>Performance of contract / Legal obligation</td></tr>
                    <tr><td>Improve features and infrastructure</td><td>Legitimate interests</td></tr>
                    <tr><td>Send service emails (security alerts, billing)</td><td>Performance of contract</td></tr>
                    <tr><td>Send the weekly creator newsletter (opt-in only)</td><td>Consent</td></tr>
                    <tr><td>Send marketing emails (opt-in only)</td><td>Consent</td></tr>
                    <tr><td>Comply with legal obligations</td><td>Legal obligation</td></tr>
                    <tr><td>Defend against fraud and abuse</td><td>Legitimate interests</td></tr>
                  </tbody>
                </table>

                <h2 id="ai-training">5. AI Training & Your Content</h2>
                <p>This is the most important section, so we're saying it twice: <strong>we never train our public AI models on your private content.</strong> Your scripts, channel data, prompts, and outputs are processed solely to deliver the Service to you.</p>
                <h3>How we actually train models</h3>
                <p>Our AI models are trained on a curated dataset of <strong>4.2 million publicly accessible viral YouTube videos</strong>, plus licensed datasets from third-party data partners. We never include private user content in training data, even in aggregated or anonymized form.</p>
                <h3>Optional opt-in research</h3>
                <p>From time to time we invite Pro and Enterprise customers to opt-in to research programs where their content may be used to improve specific features. Participation is voluntary, fully transparent, and revocable at any time. The default is always "no thanks."</p>
                <h3>Output ownership</h3>
                <p>You own the AI Output you generate. We don't claim any rights to it beyond what's necessary to operate the Service.</p>

                <h2 id="newsletter">4. Newsletter & Marketing Email</h2>
                <p>When you enter your email in the footer "Creator Newsletter" form and click Subscribe, we save only your email address (lowercased, deduplicated) in a dedicated subscribers store. We use it for one purpose: sending the weekly Sunday newsletter containing viral case studies, algorithm updates, and creator tactics.</p>
                <h3>What we store</h3>
                <ul>
                  <li><strong>Email address</strong> — required to send the newsletter</li>
                  <li><strong>Subscription status</strong> — <code>subscribed</code> or <code>unsubscribed</code></li>
                  <li><strong>Source</strong> — where you signed up (e.g. <code>footer-newsletter</code>), for our records</li>
                  <li><strong>Timestamps</strong> — when you subscribed and last updated</li>
                </ul>
                <p>We do <strong>not</strong> link your newsletter sign-up to a YTForge account unless you use the same email to register. We never share, rent, or sell the subscriber list.</p>
                <h3>Consent & unsubscribing</h3>
                <p>Subscribing is explicit consent to receive the weekly newsletter. You can withdraw consent at any time — every email includes a one-click unsubscribe link, and we process opt-outs immediately. You can also email <a href="mailto:privacy@ytforge.app">privacy@ytforge.app</a> with "Unsubscribe" in the subject line.</p>
                <h3>Retention</h3>
                <p>We keep your email for as long as you're subscribed, plus 30 days after you unsubscribe (to honor opt-outs across systems), then it's permanently deleted.</p>

                <h2 id="sharing">6. How We Share Data</h2>
                <p>We share data only with:</p>
                <ul>
                  <li><strong>Service providers (sub-processors):</strong> AWS (hosting), Stripe (payments), Postmark (email), Sentry (error logs), Cloudflare (CDN/security), Datadog (monitoring). All bound by data-processing agreements.</li>
                  <li><strong>Integrations you authorize:</strong> when you connect Slack, Notion, Zapier, etc., data flows only to those integrations per your settings</li>
                  <li><strong>Legal authorities:</strong> when compelled by valid legal process, narrowly scoped to what's required</li>
                  <li><strong>Business transfers:</strong> in the event of merger, acquisition, or asset sale (you'll be notified, with the right to delete your account)</li>
                </ul>
                <p>A live list of sub-processors is published at <a href="#">ytforge.app/sub-processors</a>.</p>

                <h2 id="cookies">7. Cookies & Tracking</h2>
                <p>We use a minimal cookie set:</p>
                <ul>
                  <li><strong>Strictly necessary:</strong> session, CSRF, and load-balancing cookies — cannot be disabled</li>
                  <li><strong>Functional:</strong> remembers your preferences (theme, language, last-used tool)</li>
                  <li><strong>Analytics:</strong> first-party, anonymized — measures feature adoption (no cross-site tracking)</li>
                  <li><strong>Marketing:</strong> only if you accept the cookie banner; powers retargeting on Google and Meta</li>
                </ul>
                <p>Manage preferences anytime via the cookie banner at the bottom of any page.</p>

                <h2 id="retention">8. Data Retention</h2>
                <table>
                  <thead>
                    <tr><th>Data Category</th><th>Retention Period</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Account data (active)</td><td>For the life of your account</td></tr>
                    <tr><td>Account data (after deletion)</td><td>Removed within 30 days</td></tr>
                    <tr><td>Generated outputs</td><td>Until you delete them, or 30 days after account closure</td></tr>
                    <tr><td>Billing records</td><td>7 years (legal/tax requirement)</td></tr>
                    <tr><td>Server logs</td><td>30 days, then aggregated/anonymized</td></tr>
                    <tr><td>Marketing data</td><td>Until you unsubscribe + 30 days</td></tr>
                  </tbody>
                </table>

                <h2 id="security">9. Security Measures</h2>
                <p>YTForge is SOC 2 Type II certified, audited annually by an independent third party. Our security program includes:</p>
                <ul>
                  <li>TLS 1.3 encryption for all data in transit</li>
                  <li>AES-256 encryption for data at rest</li>
                  <li>Multi-factor authentication for all internal access</li>
                  <li>Principle of least privilege across all roles</li>
                  <li>Quarterly third-party penetration tests</li>
                  <li>24/7 intrusion detection and incident response team</li>
                  <li>Encrypted, geo-redundant backups with 30-day point-in-time restore</li>
                </ul>
                <p>If a security incident affects your data, we'll notify you within 72 hours of discovery as required by GDPR.</p>

                <h2 id="rights">10. Your Privacy Rights</h2>
                <p>Depending on your jurisdiction, you have rights to:</p>
                <ul>
                  <li><strong>Access:</strong> request a copy of all data we hold about you</li>
                  <li><strong>Rectify:</strong> correct inaccurate or incomplete data</li>
                  <li><strong>Delete:</strong> request erasure ("right to be forgotten")</li>
                  <li><strong>Port:</strong> receive your data in a machine-readable format</li>
                  <li><strong>Restrict / Object:</strong> limit certain processing activities</li>
                  <li><strong>Withdraw consent:</strong> opt out of marketing or research participation</li>
                  <li><strong>Lodge a complaint:</strong> with your local data-protection authority</li>
                </ul>
                <p>Most rights can be exercised in one click via your account dashboard. Otherwise, email <a href="mailto:privacy@ytforge.app">privacy@ytforge.app</a> — we respond within 30 days, free of charge.</p>
                <p><strong>Do Not Sell My Personal Information:</strong> we don't sell personal data. California residents can confirm this by emailing <a href="mailto:privacy@ytforge.app">privacy@ytforge.app</a>.</p>

                <h2 id="international">11. International Data Transfers</h2>
                <p>YTForge is headquartered in the United States. If you're outside the U.S., your data may be transferred and processed there. For EEA/UK transfers, we rely on the Standard Contractual Clauses approved by the European Commission, plus supplementary measures (encryption, pseudonymization, transparency reports). EU-U.S. Data Privacy Framework certification is in progress.</p>

                <h2 id="children">12. Children's Privacy</h2>
                <p>YTForge is not intended for children under 13 (or 16 in the EEA). We don't knowingly collect data from minors. If you believe a child has provided personal data, contact us and we'll delete it immediately.</p>

                <h2 id="changes">13. Changes to This Policy</h2>
                <p>We'll notify you of material changes via email and a banner on the Service at least 30 days before they take effect. Non-material changes (typo fixes, clarifications) take effect on publication. The "Last updated" date at the top of this page reflects the most recent revision.</p>

                <h2 id="contact">14. Contact & Data Protection Officer</h2>
                <p>For privacy questions or to exercise your rights:</p>
                <ul>
                  <li><strong>Privacy team:</strong> <a href="mailto:privacy@ytforge.app">privacy@ytforge.app</a></li>
                  <li><strong>Data Protection Officer:</strong> <a href="mailto:dpo@ytforge.app">dpo@ytforge.app</a></li>
                  <li><strong>EU Representative:</strong> EuroDataRep B.V., Stationsplein 45, Rotterdam, Netherlands</li>
                  <li><strong>Mail:</strong> YTForge Inc., Attn: Privacy, 548 Market St #65512, San Francisco, CA 94104</li>
                </ul>

                <div className="mt-10 p-5 bg-green-50 border-2 border-black rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-black text-sm mb-1">The 30-second summary</div>
                    <p className="text-xs text-neutral-700 leading-relaxed">
                      We collect what we need to run the Service, store it encrypted, never sell it, never train our public models on it, and let you delete it anytime. Questions? <a href="mailto:privacy@ytforge.app" className="text-red-600 font-black underline">privacy@ytforge.app</a>.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Help banner */}
          <div className="max-w-6xl mx-auto mt-10">
            <div className="bg-black border-2 border-black rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-[6px_6px_0px_0px_rgba(220,38,38,1)]">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center border-2 border-white shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-black text-lg text-white mb-1">Want to exercise a right?</div>
                <p className="text-sm text-neutral-300 leading-relaxed">Most actions are one click in your dashboard. Or email <a href="mailto:privacy@ytforge.app" className="text-red-500 font-black underline">privacy@ytforge.app</a> — we reply within 30 days, free.</p>
              </div>
              <Link href="/terms" className="inline-flex items-center gap-2 px-5 py-3 bg-white text-black font-black rounded-xl border-2 border-white hover:bg-neutral-100 transition-colors uppercase tracking-wider text-xs whitespace-nowrap">
                <Scale className="w-4 h-4" /> Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
