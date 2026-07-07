"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Bot,
  ShieldCheck,
  Cpu,
  Database,
  Eye,
  UserCheck,
  Sparkles,
  AlertTriangle,
  Scale,
  Mail,
  ArrowRight,
} from "lucide-react";

const sections = [
  { id: "overview", title: "1. Overview" },
  { id: "what-we-build", title: "2. What We Build With AI" },
  { id: "models", title: "3. AI Models & Providers" },
  { id: "your-data", title: "4. Your Data & AI Processing" },
  { id: "training", title: "5. Training & Your Content" },
  { id: "output", title: "6. AI Output & Ownership" },
  { id: "limits", title: "7. Limits & Human Oversight" },
  { id: "your-rights", title: "8. Your Rights" },
  { id: "safety", title: "9. Safety & Abuse Prevention" },
  { id: "changes", title: "10. Changes to This Policy" },
  { id: "contact", title: "11. Contact" },
];

const principles = [
  { icon: ShieldCheck, t: "Privacy first", d: "Your private content is never used to train our public models" },
  { icon: Eye, t: "Transparency", d: "Every AI output is labeled as AI-generated" },
  { icon: UserCheck, t: "Human in the loop", d: "You review and approve before anything publishes" },
  { icon: Cpu, t: "Best-in-class models", d: "We route each task to the model that does it best" },
];

export function AiPolicyContent() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-black border-b-4 border-black pt-16 sm:pt-18">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(220,38,38,0.35)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-black tracking-wider uppercase mb-6 border-2 border-white/20 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)]">
              <Bot className="w-3.5 h-3.5" /> AI Policy · Last updated July 7, 2026
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4">
              How YTForge uses AI — responsibly
            </h1>
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl mx-auto">
              AI powers every tool on YTForge. This page explains which models we use, what happens
              to your data, and the rights you keep. No jargon, no buried clauses.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Principles */}
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
              <div className="prose prose-neutral max-w-none [&_h2]:text-2xl [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-24 first:[&_h2]:mt-0 [&_h3]:font-black [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-neutral-700 [&_p]:leading-relaxed [&_p]:mb-4 [&_a]:text-red-600 [&_a]:font-black [&_a]:underline [&_strong]:font-black [&_strong]:text-black [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:text-neutral-700 [&_li]:mb-1.5 [&_code]:bg-neutral-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:text-red-700">

                <h2 id="overview">1. Overview</h2>
                <p>YTForge ("we", "us") builds AI-powered tools that help YouTube creators research, write, design, and analyze their content. This AI Policy explains, in plain language, how our AI features work, which models power them, how your data is processed, and the rights you retain when you use them. It complements our <Link href="/privacy" className="text-red-600 font-black underline">Privacy Policy</Link> and <Link href="/terms" className="text-red-600 font-black underline">Terms of Service</Link>; where anything is unclear, the Privacy Policy is authoritative on data handling.</p>
                <p>Our north star is simple: AI should amplify creators, not replace them and not exploit them. Every feature is designed with a human in the loop — you review, edit, and approve before anything ships.</p>

                <h2 id="what-we-build">2. What We Build With AI</h2>
                <p>YTForge uses AI across four categories of tools:</p>
                <ul>
                  <li><strong>Generative writing:</strong> title ideas, full scripts, descriptions, hashtags, and tags — produced from your inputs (topic, niche, tone, length).</li>
                  <li><strong>Visual generation:</strong> AI thumbnails and short-form video concepts from text prompts and reference imagery.</li>
                  <li><strong>Analysis:</strong> SEO audits, channel analytics, retention analysis, and monetization eligibility checks that interpret public and provided data.</li>
                  <li><strong>Conversational assistance:</strong> the YTForge AI Chat that answers creator questions, suggests next steps, and drafts content.</li>
                </ul>
                <p>Every AI output is labeled as AI-generated inside the product, and every output is editable before you use or publish it.</p>

                <h2 id="models">3. AI Models & Providers</h2>
                <p>We don't build foundation models from scratch. We route each task to the model best suited for it, using a mix of first-party fine-tunes and third-party providers:</p>
                <ul>
                  <li><strong>Large language models:</strong> used for scripts, titles, descriptions, chat, and SEO analysis. We select per-task based on quality, latency, and cost.</li>
                  <li><strong>Image models:</strong> used for AI thumbnail generation and visual concepts.</li>
                  <li><strong>Transcription models:</strong> used for the AI Transcript tool to convert audio to text and translate.</li>
                  <li><strong>First-party models:</strong> trained on a curated corpus of 4.2 million publicly accessible viral YouTube videos for trend detection and title/CTR scoring.</li>
                </ul>
                <p>We evaluate every provider against security, data-handling, and output-quality criteria before integration, and we retain the right to switch providers as the field evolves. Provider APIs are bound by contracts that prohibit them from training on YTForge user data.</p>

                <h2 id="your-data">4. Your Data & AI Processing</h2>
                <p>When you use an AI tool, your inputs (prompts, channel URLs, uploaded images, script drafts) and the model's outputs are processed to deliver the result to you. The specifics:</p>
                <ul>
                  <li><strong>Real-time processing:</strong> inputs are sent to the relevant model provider, processed, and returned to you in your session.</li>
                  <li><strong>Storage:</strong> your generated outputs are stored in your account so you can access them later; you can delete any output at any time.</li>
                  <li><strong>Provider retention:</strong> our providers' default API terms do not retain your inputs beyond the processing window, and do not use them to train their models.</li>
                  <li><strong>Encryption:</strong> all data in transit uses TLS 1.3; data at rest uses AES-256.</li>
                </ul>
                <p>For the full data-handling picture, see our <Link href="/privacy" className="text-red-600 font-black underline">Privacy Policy</Link>.</p>

                <h2 id="training">5. Training & Your Content</h2>
                <p>This is the part most creators care about, so we'll say it directly: <strong>we never train our public AI models on your private content.</strong></p>
                <p>Our first-party models are trained exclusively on a curated dataset of <strong>publicly accessible viral YouTube videos</strong> plus licensed third-party datasets. Your private scripts, prompts, channel data, and uploaded images are never included in training data — not in raw form, not in aggregated or anonymized form.</p>
                <p>From time to time we invite Pro and Enterprise customers to opt in to research programs that may use their content to improve specific features. Participation is voluntary, fully transparent, revocable at any time, and off by default.</p>

                <h2 id="output">6. AI Output & Ownership</h2>
                <p>You own the AI output you generate on YTForge. We don't claim rights to your scripts, titles, thumbnails, or analyses beyond what's required to operate the Service for you.</p>
                <ul>
                  <li><strong>You can use it commercially:</strong> AI-generated output is yours to publish, monetize, and modify.</li>
                  <li><strong>You're responsible for review:</strong> AI can produce inaccurate, biased, or infringing content. Always review before publishing.</li>
                  <li><strong>Provenance:</strong> we encourage labeling AI-assisted content where appropriate, in line with platform and regional requirements.</li>
                </ul>
                <p>Because AI output can reflect patterns in training data, you should verify facts, quotes, statistics, and any claim that could harm someone if wrong.</p>

                <h2 id="limits">7. Limits & Human Oversight</h2>
                <p>AI is powerful but imperfect. To keep you in control:</p>
                <ul>
                  <li><strong>Human review gate:</strong> no AI output auto-publishes. You always review and approve.</li>
                  <li><strong>Fact-check prompt:</strong> for analytical tools, we surface a reminder to verify any specific statistic or claim.</li>
                  <li><strong>Usage limits:</strong> free and paid tiers have daily generation caps to prevent abuse and runaway costs.</li>
                  <li><strong>Quality feedback loop:</strong> the rating widget on each output trains our routing logic (not your content) to pick better models over time.</li>
                </ul>

                <h2 id="your-rights">8. Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                  <li><strong>Access</strong> the AI outputs stored in your account.</li>
                  <li><strong>Delete</strong> any output or your entire account at any time.</li>
                  <li><strong>Opt out</strong> of optional research programs (they're off by default anyway).</li>
                  <li><strong>Withdraw</strong> any consent you've given for AI processing of your data.</li>
                  <li><strong>Lodge a complaint</strong> with your local data-protection authority.</li>
                </ul>
                <p>Exercise most rights in one click from your dashboard, or email <a href="mailto:ai@ytforge.app">ai@ytforge.app</a>.</p>

                <h2 id="safety">9. Safety & Abuse Prevention</h2>
                <p>We don't allow YTForge's AI to be used to generate:</p>
                <ul>
                  <li>Content that sexualizes minors or exploits anyone.</li>
                  <li>Deceptive deepfakes or impersonation of real people without consent.</li>
                  <li>Disinformation, election manipulation, or coordinated inauthentic behavior.</li>
                  <li>Content that infringes others' copyright or trademarks.</li>
                  <li>Content that promotes violence, terrorism, or self-harm.</li>
                </ul>
                <p>We combine automated filters, provider-level safety models, and human review of flagged outputs. Violations can result in output blocking, account suspension, or termination. If you see harmful AI output from YTForge, report it to <a href="mailto:safety@ytforge.app">safety@ytforge.app</a>.</p>

                <h2 id="changes">10. Changes to This Policy</h2>
                <p>AI moves fast, and this policy will evolve with it. We'll notify you of material changes (new providers with different data terms, changes to training practices) via email and an in-product banner at least 30 days before they take effect. The "Last updated" date at the top reflects the most recent revision.</p>

                <h2 id="contact">11. Contact</h2>
                <p>Questions about how YTForge uses AI?</p>
                <ul>
                  <li><strong>AI team:</strong> <a href="mailto:ai@ytforge.app">ai@ytforge.app</a></li>
                  <li><strong>Safety reports:</strong> <a href="mailto:safety@ytforge.app">safety@ytforge.app</a></li>
                  <li><strong>Privacy / DPO:</strong> <a href="mailto:privacy@ytforge.app">privacy@ytforge.app</a></li>
                </ul>

                <div className="mt-10 p-5 bg-yellow-50 border-2 border-black rounded-xl flex items-start gap-3 not-prose">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-black text-sm mb-1 text-black">The 30-second summary</div>
                    <p className="text-xs text-neutral-700 leading-relaxed">
                      AI powers our tools; you own the output; your private content never trains our public models; you always review before anything publishes; and you can delete everything anytime.
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
                <div className="font-black text-lg text-white mb-1">Have a question about our AI?</div>
                <p className="text-sm text-neutral-300 leading-relaxed">Email <a href="mailto:ai@ytforge.app" className="text-red-500 font-black underline">ai@ytforge.app</a> — we reply within 2 business days.</p>
              </div>
              <Link href="/privacy" className="inline-flex items-center gap-2 px-5 py-3 bg-white text-black font-black rounded-xl border-2 border-white hover:bg-neutral-100 transition-colors uppercase tracking-wider text-xs whitespace-nowrap">
                <Scale className="w-4 h-4" /> Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
