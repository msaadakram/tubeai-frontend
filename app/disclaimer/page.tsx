"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  AlertTriangle,
  Info,
  Shield,
  Scale,
  Mail,
  Sparkles,
  Eye,
  Bot,
  ExternalLink,
  TrendingUp,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const sections = [
  { id: "general", title: "1. General Disclaimer" },
  { id: "ai", title: "2. AI-Generated Content" },
  { id: "results", title: "3. No Guaranteed Results" },
  { id: "earnings", title: "4. Earnings & Financial" },
  { id: "analytics", title: "5. Analytics Accuracy" },
  { id: "third-party", title: "6. Third-Party Content" },
  { id: "youtube", title: "7. YouTube Compliance" },
  { id: "professional", title: "8. Not Professional Advice" },
  { id: "external", title: "9. External Links" },
  { id: "trademarks", title: "10. Trademarks" },
  { id: "fair-use", title: "11. Fair Use" },
  { id: "errors", title: "12. Errors & Omissions" },
  { id: "liability", title: "13. Limitation of Liability" },
  { id: "changes", title: "14. Changes to Disclaimer" },
  { id: "contact", title: "15. Contact" },
];

const callouts = [
  { icon: Bot, t: "AI is not infallible", d: "Verify outputs before publishing — AI can be wrong, biased, or outdated." },
  { icon: TrendingUp, t: "Results vary", d: "Channel growth depends on niche, effort, and execution — not just our tools." },
  { icon: Eye, t: "Estimates only", d: "Earnings, analytics, and predictions are approximations, not guarantees." },
  { icon: Shield, t: "Use at your own risk", d: "You're responsible for compliance with YouTube's policies and the law." },
];

export default function DisclaimerPage() {
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
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" /> Last updated May 10, 2026
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4 [text-shadow:_3px_3px_0_rgb(0_0_0_/_30%)]">
              Disclaimer
            </h1>
            <p className="text-base sm:text-lg text-red-50 leading-relaxed max-w-2xl mx-auto">
              Important context about YTForge's tools, AI outputs, and the limits of what we promise. Read this before relying on anything we generate.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Callouts strip */}
      <section className="bg-white border-b-2 border-black py-8 sm:py-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-6xl mx-auto">
            {callouts.map((c, i) => (
              <motion.div
                key={c.t}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white border-2 border-black rounded-xl p-4 flex items-start gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="w-9 h-9 rounded-lg bg-yellow-300 text-black flex items-center justify-center border-2 border-black shrink-0">
                  <c.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-black text-sm">{c.t}</div>
                  <div className="text-[11px] text-neutral-500 font-bold leading-snug">{c.d}</div>
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
                  <Info className="w-4 h-4 text-red-600" />
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

            {/* Article */}
            <article className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-10">
              <div className="prose prose-neutral max-w-none [&_h2]:text-2xl [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-24 first:[&_h2]:mt-0 [&_h3]:font-black [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-neutral-700 [&_p]:leading-relaxed [&_p]:mb-4 [&_a]:text-red-600 [&_a]:font-black [&_a]:underline [&_strong]:font-black [&_strong]:text-black [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:text-neutral-700 [&_li]:mb-1.5">
                <p className="text-sm text-neutral-500 font-bold border-b-2 border-dashed border-neutral-200 pb-4 mb-6">
                  Effective Date: May 10, 2026 · Version 2.1
                </p>

                <h2 id="general">1. General Disclaimer</h2>
                <p>The information, tools, AI-generated content, analytics, estimates, and other materials made available on the YTForge website and any related applications, APIs, or services (collectively, the "Service") are provided for general informational and educational purposes only. By accessing or using the Service, you acknowledge that you do so entirely at your own risk and discretion.</p>
                <p>While we work hard to keep the Service accurate, current, and useful, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the Service or any of its contents.</p>

                <h2 id="ai">2. AI-Generated Content</h2>
                <p>YTForge's tools use artificial intelligence and machine learning models to generate titles, scripts, thumbnails, transcripts, channel analyses, and other outputs. <strong>AI-generated content is probabilistic — it may be inaccurate, incomplete, biased, outdated, or factually wrong.</strong></p>
                <h3>Verify before publishing</h3>
                <p>You are solely responsible for reviewing, fact-checking, editing, and verifying any AI-generated output before publishing it on YouTube or any other platform. Do not assume that anything generated by YTForge is accurate or appropriate for your specific situation.</p>
                <h3>Hallucination warning</h3>
                <p>AI models can occasionally "hallucinate" — confidently producing information that sounds plausible but is fabricated. This is a known limitation of current generative AI technology and not a defect of YTForge specifically. Treat all factual claims, statistics, quotes, and citations in AI output as suggestions to verify, not as authoritative truth.</p>
                <h3>Bias and sensitivity</h3>
                <p>AI models reflect patterns in their training data, which may include cultural, demographic, or linguistic biases. If you produce content that targets specific audiences, communities, or sensitive topics, exercise additional editorial judgment.</p>

                <h2 id="results">3. No Guaranteed Results</h2>
                <p>We do not guarantee any specific outcomes from using YTForge. References to view counts, subscriber growth, click-through rates, retention improvements, monetization eligibility, earnings, or any other channel metrics are <strong>illustrative examples and aspirational goals — not promises</strong>.</p>
                <p>Channel performance depends on countless variables outside our control, including:</p>
                <ul>
                  <li>The creator's effort, consistency, and production quality</li>
                  <li>Niche competitiveness and audience demand</li>
                  <li>The current state of the YouTube algorithm</li>
                  <li>Cultural, geographic, and seasonal factors</li>
                  <li>YouTube policy changes and platform updates</li>
                  <li>Existing channel history, reputation, and audience</li>
                </ul>
                <p>Testimonials and case studies featured on YTForge represent individual experiences and are not typical. Your results will differ.</p>

                <h2 id="earnings">4. Earnings & Financial Estimates</h2>
                <p>The Earnings Calculator, Monetization Checker, RPM benchmarks, and any other financial figures presented on YTForge are <strong>estimates based on industry averages and publicly available data</strong>. They are not guarantees, projections, or financial forecasts.</p>
                <p>Actual YouTube revenue varies dramatically based on niche, audience geography, ad inventory, seasonality, brand-suitability filters, and many other factors. YTForge is not a financial advisor and does not provide tax, accounting, or investment advice. Consult a qualified professional before making business decisions based on our estimates.</p>

                <h2 id="analytics">5. Analytics Accuracy</h2>
                <p>Channel Analytics, Channel ID Finder, and similar research tools rely on a combination of YouTube's public APIs, public CDN endpoints, and our own statistical models. While we work to keep the data current and accurate:</p>
                <ul>
                  <li>YouTube does not expose all metrics publicly — some figures are estimated</li>
                  <li>Channel data may be cached and reflect a delayed view of reality</li>
                  <li>Channels can hide or restrict their public data, in which case our outputs are limited or unavailable</li>
                  <li>Subscriber counts above 1,000 are rounded by YouTube itself, not YTForge</li>
                </ul>
                <p>Do not rely on YTForge analytics for legal, financial, or investment-grade decisions about a creator or channel.</p>

                <h2 id="third-party">6. Third-Party Content</h2>
                <p>YTForge's research tools display publicly available content from YouTube and other third parties — including channel names, thumbnails, video titles, and metadata. This content remains the property of its respective owners. Reference to any creator, channel, brand, or product does not imply endorsement, partnership, or affiliation with YTForge.</p>
                <p>If you believe any content displayed via YTForge infringes your rights, contact <a href="mailto:dmca@ytforge.app">dmca@ytforge.app</a> with a valid DMCA-style notice and we'll respond promptly.</p>

                <h2 id="youtube">7. YouTube Compliance</h2>
                <p>YTForge is an independent third-party tool. <strong>We are not affiliated with, endorsed by, or sponsored by YouTube, Google, or Alphabet Inc.</strong> "YouTube" is a trademark of Google LLC.</p>
                <p>You are solely responsible for ensuring your use of YTForge complies with:</p>
                <ul>
                  <li>YouTube's Terms of Service</li>
                  <li>YouTube Community Guidelines</li>
                  <li>YouTube Partner Program policies</li>
                  <li>YouTube API Services Terms (where applicable)</li>
                  <li>All applicable laws in your jurisdiction</li>
                </ul>
                <p>Generating content with AI does not exempt you from YouTube's rules around authenticity, copyright, deepfakes, misinformation, monetization, or any other policy. YTForge is not liable for strikes, demonetization, or terminations resulting from your content.</p>

                <h2 id="professional">8. Not Professional Advice</h2>
                <p>Nothing on YTForge constitutes professional advice — legal, financial, medical, psychological, accounting, or otherwise. Articles, tool outputs, blog posts, and support replies are educational and informational. Consult a licensed professional for advice specific to your situation.</p>

                <h2 id="external">9. External Links</h2>
                <p>The Service may contain links to third-party websites, services, or resources operated by parties other than YTForge. These links are provided for convenience and do not imply endorsement. We have no control over the content, privacy practices, or accuracy of external sites and accept no responsibility for them. Visit external links at your own risk.</p>

                <h2 id="trademarks">10. Trademarks</h2>
                <p>"YTForge" and the YTForge logo are trademarks of YTForge Inc. All other trademarks, service marks, logos, and brand names referenced on the Service — including YouTube, Google, Stripe, Slack, Notion, TubeBuddy, VidIQ, and others — are the property of their respective owners. References are made for descriptive and informational purposes only.</p>

                <h2 id="fair-use">11. Fair Use</h2>
                <p>Some features (like the Thumbnail Downloader and SEO Analyzer) display or download content from public YouTube videos for purposes of research, commentary, education, and inspiration. This usage is intended to fall within the bounds of <strong>fair use under U.S. copyright law and equivalent doctrines internationally</strong>.</p>
                <p>You are responsible for ensuring your own use of any downloaded or referenced material complies with copyright law. Republishing copyrighted thumbnails, audio, or video as your own — without permission — is not protected by fair use and may infringe the rights of the original creator.</p>

                <h2 id="errors">12. Errors, Omissions & Updates</h2>
                <p>Despite our best efforts, the Service may contain typographical errors, inaccuracies, or outdated information. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update content at any time without prior notice. We do not warrant that any errors will be corrected.</p>

                <h2 id="liability">13. Limitation of Liability</h2>
                <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, YTFORGE INC., ITS OFFICERS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES — INCLUDING LOST PROFITS, LOST REVENUE, LOST SUBSCRIBERS, COPYRIGHT STRIKES, DEMONETIZATION, OR ACCOUNT TERMINATION — ARISING OUT OF OR RELATED TO YOUR USE OR INABILITY TO USE THE SERVICE OR ANY AI-GENERATED OUTPUT.</p>
                <p>For our complete liability terms, see Section 12 of our <Link href="/terms">Terms of Service</Link>.</p>

                <h2 id="changes">14. Changes to This Disclaimer</h2>
                <p>We may update this Disclaimer at any time. The "Last updated" date at the top of the page reflects the most recent revision. Material changes will be communicated via email and a banner on the Service. Continued use after the effective date constitutes acceptance.</p>

                <h2 id="contact">15. Contact</h2>
                <p>Questions, concerns, or DMCA notices? Reach out:</p>
                <ul>
                  <li><strong>General:</strong> <a href="mailto:support@ytforge.app">support@ytforge.app</a></li>
                  <li><strong>Legal:</strong> <a href="mailto:legal@ytforge.app">legal@ytforge.app</a></li>
                  <li><strong>DMCA:</strong> <a href="mailto:dmca@ytforge.app">dmca@ytforge.app</a></li>
                  <li><strong>Mail:</strong> YTForge Inc., 548 Market St #65512, San Francisco, CA 94104</li>
                </ul>

                <div className="mt-10 p-5 bg-yellow-50 border-2 border-black rounded-xl flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-black text-sm mb-1">The 30-second summary</div>
                    <p className="text-xs text-neutral-700 leading-relaxed">
                      YTForge is a powerful set of AI tools — but AI isn't perfect. Verify everything before you publish. We don't guarantee growth, earnings, or YouTube compliance — that's on you. Treat estimates as estimates, not promises.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Cross-link banner */}
          <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/terms" className="bg-white border-2 border-black rounded-2xl p-5 sm:p-6 flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center border-2 border-black shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-base">Terms of Service</div>
                <div className="text-xs text-neutral-500 font-bold">The full agreement</div>
              </div>
              <ExternalLink className="w-4 h-4 text-neutral-400 shrink-0" />
            </Link>
            <Link href="/privacy" className="bg-white border-2 border-black rounded-2xl p-5 sm:p-6 flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center border-2 border-black shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-base">Privacy Policy</div>
                <div className="text-xs text-neutral-500 font-bold">How we handle your data</div>
              </div>
              <ExternalLink className="w-4 h-4 text-neutral-400 shrink-0" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
