"use client";

import React from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Button } from "../ui/button";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for new creators getting started.",
    features: [
      "Basic SEO Analyzer",
      "5 AI Title Generations / mo",
      "Tag Generator",
      "Thumbnail Downloader",
      "Standard Support",
    ],
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "Everything you need to scale your channel.",
    popular: true,
    features: [
      "Everything in Starter",
      "Unlimited AI Title Generations",
      "AI Script Writer",
      "Monetization Checker",
      "Advanced Analytics Dashboard",
      "Priority Support",
    ],
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/mo",
    description: "For agencies and large media teams.",
    features: [
      "Everything in Pro",
      "Multiple Channel Management",
      "Team Collaboration",
      "API Access",
      "Custom AI Model Training",
      "24/7 Dedicated Manager",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-16 sm:py-20 md:py-24 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-black mb-4 sm:mb-6">
            Simple, transparent pricing
          </h2>
          <p className="text-base sm:text-lg text-neutral-500">
            Start for free, upgrade when you need more power. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-3xl border p-6 sm:p-8 backdrop-blur-sm transition-shadow ${
                plan.popular
                  ? "border-red-600 bg-white shadow-xl shadow-red-600/10"
                  : "border-neutral-200 bg-neutral-50/50 hover:shadow-md"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-red-600 text-xs font-bold text-white shadow-md uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-medium text-black mb-2">{plan.name}</h3>
                <p className="text-sm text-neutral-500 min-h-[40px]">{plan.description}</p>
              </div>
              
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-black">{plan.price}</span>
                {plan.period && <span className="text-neutral-500 font-medium">{plan.period}</span>}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-neutral-600">
                    <Check className={`w-5 h-5 ${plan.popular ? "text-red-600" : "text-neutral-400"}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "default" : "outline"}
                size="lg"
                className={`w-full rounded-full ${
                  plan.popular 
                  ? "bg-red-600 text-white hover:bg-red-700" 
                  : "border-neutral-200 text-black hover:bg-red-50 hover:text-red-600"
                }`}
              >
                {plan.price === "Free" ? "Get Started" : "Start 14-Day Trial"}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
