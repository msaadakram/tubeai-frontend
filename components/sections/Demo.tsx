"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  BarChart, 
  PenTool, 
  DollarSign, 
  CheckCircle2, 
  Search,
  PlayCircle,
  Video,
  Image as ImageIcon,
  Rocket
} from "lucide-react";
import { Button } from "../ui/button";
import { ScriptWritingDemo } from "./demo-animations/ScriptWritingDemo";
import { SeoDemo } from "./demo-animations/SeoDemo";
import { StrategyDemo } from "./demo-animations/StrategyDemo";
import { AnalyticsDemo } from "./demo-animations/AnalyticsDemo";
import { MonetizationDemo } from "./demo-animations/MonetizationDemo";

const tabs = [
  { id: "strategy", label: "Content Strategy", icon: Sparkles },
  { id: "seo", label: "SEO & Ranking", icon: Search },
  { id: "script", label: "Script Writing", icon: PenTool },
  { id: "analytics", label: "Analytics", icon: BarChart },
  { id: "monetization", label: "Monetization", icon: DollarSign },
];

const subFeatures = [
  "Viral Hook Generation", "Thumbnail A/B Testing", 
  "Competitor Analysis", "Trend Prediction", 
  "Audience Retention Insights", "Automated Translations"
];

const tabPipelines: Record<string, { title: string, steps: Array<{ title: string, icon: any, color: string, bg: string }> }> = {
  strategy: {
    title: "Content Strategy Planner",
    steps: [
      { title: "Analyzing YouTube Trends", icon: Search, color: "text-blue-600", bg: "bg-blue-100" },
      { title: "Generating Video Ideas", icon: Sparkles, color: "text-purple-600", bg: "bg-purple-100" },
      { title: "Drafting Viral Script", icon: PenTool, color: "text-green-600", bg: "bg-green-100" },
      { title: "Designing Thumbnail", icon: ImageIcon, color: "text-orange-600", bg: "bg-orange-100" },
      { title: "Ready to Publish", icon: Rocket, color: "text-red-600", bg: "bg-red-100" }
    ]
  },
  seo: {
    title: "SEO & Ranking Optimizer",
    steps: [
      { title: "Scanning Competitor Tags", icon: Search, color: "text-indigo-600", bg: "bg-indigo-100" },
      { title: "Finding High-Volume Keywords", icon: BarChart, color: "text-blue-600", bg: "bg-blue-100" },
      { title: "Optimizing Title & Description", icon: PenTool, color: "text-teal-600", bg: "bg-teal-100" },
      { title: "A/B Testing Thumbnails", icon: ImageIcon, color: "text-orange-600", bg: "bg-orange-100" },
      { title: "Ranking #1 on Search", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" }
    ]
  },
  script: {
    title: "AI Script Writer",
    steps: [
      { title: "Analyzing Audience Retention", icon: Search, color: "text-purple-600", bg: "bg-purple-100" },
      { title: "Writing 3-Second Hook", icon: PenTool, color: "text-red-600", bg: "bg-red-100" },
      { title: "Structuring Story Arc", icon: BarChart, color: "text-blue-600", bg: "bg-blue-100" },
      { title: "Inserting CTA Prompts", icon: Sparkles, color: "text-yellow-600", bg: "bg-yellow-100" },
      { title: "Finalizing Script Draft", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" }
    ]
  },
  analytics: {
    title: "Analytics Engine",
    steps: [
      { title: "Fetching Real-time Views", icon: PlayCircle, color: "text-red-600", bg: "bg-red-100" },
      { title: "Analyzing Watch Time", icon: BarChart, color: "text-indigo-600", bg: "bg-indigo-100" },
      { title: "Tracking Subscriber Growth", icon: Search, color: "text-emerald-600", bg: "bg-emerald-100" },
      { title: "Calculating Click-Through Rate", icon: ImageIcon, color: "text-orange-600", bg: "bg-orange-100" },
      { title: "Generating Insights Report", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-100" }
    ]
  },
  monetization: {
    title: "Monetization Tracker",
    steps: [
      { title: "Analyzing RPM / CPM", icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
      { title: "Finding Sponsor Matches", icon: Search, color: "text-blue-600", bg: "bg-blue-100" },
      { title: "Optimizing Ad Placements", icon: BarChart, color: "text-purple-600", bg: "bg-purple-100" },
      { title: "Projecting Revenue", icon: Sparkles, color: "text-yellow-600", bg: "bg-yellow-100" },
      { title: "Maximizing Earnings", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" }
    ]
  }
};

export function Demo() {
  const [activeTab, setActiveTab] = useState("strategy");
  const [creationStep, setCreationStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCreationStep((prev) => (prev + 1) % 5);
    }, 2000); // loops every 2 seconds
    return () => clearInterval(interval);
  }, [activeTab]);

  const currentPipeline = tabPipelines[activeTab] || tabPipelines.strategy;
  const creationSteps = currentPipeline.steps;

  return (
    <section id="demo" className="py-16 sm:py-20 md:py-24 bg-white border-t border-neutral-200 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-12 md:mb-16 gap-6 md:gap-8">
          <div className="max-w-xl relative">
            {/* Sideways Text */}
            <div className="absolute top-8 -left-12 transform -rotate-90 origin-top-left text-neutral-400 text-xs tracking-[0.2em] font-medium hidden lg:block">
              BY SOLUTIONS
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-black pl-0 lg:pl-6">
              Our Solutions <br />
              <span className="text-neutral-400">for your channel</span>
            </h2>
          </div>
          <div className="max-w-md text-neutral-500 text-sm md:text-base">
            Our AI solutions support the demands of your YouTube channel, shorts strategy, or main content. Use the same tools that empower the top 1% of creators.
          </div>
        </div>

        {/* Horizontal Tabs */}
        <div className="flex md:flex-nowrap items-center justify-start md:justify-between border-b border-neutral-200 mb-8 sm:mb-12 overflow-x-auto pb-4 gap-4 sm:gap-6 md:gap-0 -mx-4 sm:mx-0 px-4 sm:px-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCreationStep(0);
                }}
                className={`relative group flex flex-col items-center gap-2 sm:gap-3 px-4 sm:px-5 pt-3 pb-5 rounded-2xl transition-all duration-300 min-w-[100px] sm:min-w-[130px] shrink-0 ${
                  isActive
                    ? "text-black"
                    : "text-neutral-400 hover:text-black hover:-translate-y-0.5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBg"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]"
                  />
                )}
                <div
                  className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
                    isActive
                      ? "bg-red-600 text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-3"
                      : "bg-neutral-100 text-neutral-500 border-transparent group-hover:bg-red-50 group-hover:text-red-600 group-hover:border-black"
                  }`}
                >
                  <tab.icon className="w-5 h-5 sm:w-5 sm:h-5" />
                </div>
                <span
                  className={`relative z-10 text-[11px] sm:text-xs font-black uppercase tracking-wider whitespace-nowrap transition-colors ${
                    isActive ? "text-black" : ""
                  }`}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabDot"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-600 z-10"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left: Image / Dashboard Mockup */}
          <div className="relative">
            {/* White and Black background style behind the card */}
            <div className="absolute -inset-4 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.05)_25%,rgba(0,0,0,0.05)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.05)_75%,rgba(0,0,0,0.05)_100%)] bg-[length:20px_20px] rounded-3xl" />
            <div className="absolute -inset-2 bg-black rounded-3xl translate-x-2 translate-y-2" />
            
            <div className="relative rounded-2xl border-4 border-black bg-white overflow-hidden shadow-2xl flex flex-col">
              {/* Browser Window Header */}
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b-4 border-black bg-white">
                <div className="flex gap-1.5 sm:gap-2">
                  <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-black" />
                  <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-black" />
                  <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-black" />
                </div>
              </div>
              
              {/* App Content */}
              {activeTab === "strategy" ? (
                <StrategyDemo />
              ) : activeTab === "script" ? (
                <ScriptWritingDemo />
              ) : activeTab === "seo" ? (
                <SeoDemo />
              ) : activeTab === "analytics" ? (
                <AnalyticsDemo />
              ) : activeTab === "monetization" ? (
                <MonetizationDemo />
              ) : (
              <div className="p-6 flex flex-col gap-6 aspect-[4/3] relative bg-white">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between border-b-2 border-black pb-4"
                >
                  <div className="font-black text-black text-xl tracking-tight">{currentPipeline.title}</div>
                  <motion.div 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: [0.9, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black"
                  >
                    AI Sync Active
                  </motion.div>
                </motion.div>

                <div className="grid grid-cols-2 gap-4 flex-1">
                  {/* YouTube Content Creation Loop */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="border-2 border-black rounded-xl p-4 flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white relative overflow-hidden"
                  >
                    <div className="text-xs font-black text-black uppercase tracking-wider mb-4">Auto-Creation Pipeline</div>
                    
                    <div className="flex-1 relative flex flex-col justify-center items-center py-2">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={creationStep}
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col items-center text-center gap-3 w-full"
                        >
                          {(() => {
                            const CurrentIcon = creationSteps[creationStep].icon;
                            return (
                              <>
                                <div className={`w-14 h-14 rounded-full border-2 border-black ${creationSteps[creationStep].bg} flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                                  <CurrentIcon className={`w-7 h-7 ${creationSteps[creationStep].color}`} />
                                </div>
                                <span className="font-bold text-black text-sm">{creationSteps[creationStep].title}</span>
                              </>
                            );
                          })()}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Progress indicators */}
                    <div className="flex gap-1.5 mt-auto pt-4">
                      {creationSteps.map((_, i) => (
                        <div key={i} className="flex-1 h-1.5 bg-neutral-100 border border-neutral-300 rounded-full overflow-hidden">
                          {i <= creationStep && (
                            <motion.div 
                              initial={{ width: i === creationStep ? "0%" : "100%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: i === creationStep ? 2 : 0, ease: "linear" }}
                              className="h-full bg-red-600"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Target Audience & Metrics */}
                  <div className="flex flex-col gap-4">
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-black text-white p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]"
                    >
                      <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Predicted Views</div>
                      <div className="text-3xl font-black text-white">1.2M+</div>
                      <motion.div 
                        className="h-1.5 bg-red-600 mt-3 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: "85%" }}
                        transition={{ delay: 0.5, duration: 1 }}
                      />
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex-1 border-2 border-black rounded-xl p-4 flex flex-col justify-end relative overflow-hidden bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <div className="absolute top-3 left-3 text-xs font-black text-black uppercase tracking-wider">Growth Curve</div>
                      <div className="flex items-end gap-1.5 h-16 mt-6">
                        {[20, 35, 25, 60, 45, 80, 100].map((h, i) => (
                          <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            transition={{ delay: 0.4 + i * 0.05, type: "spring", stiffness: 100 }}
                            className={`flex-1 rounded-t-sm ${i === 6 ? 'bg-red-600 border-x-2 border-t-2 border-black' : 'bg-black'}`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>

          {/* Right: Text and Features List */}
          <div>
            <p className="text-neutral-600 leading-relaxed mb-8">
              AI Tools are disrupting traditional YouTube growth strategies thanks to the adoption of advanced LLMs. YTForge provides highly accurate and cost-effective cloud services, allowing creators to more efficiently manage their content and focus more on creating.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              {subFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0" />
                  <span className="text-sm font-medium text-black">{feature}</span>
                </div>
              ))}
            </div>

            <Button variant="outline" className="mt-10 border-neutral-200 text-black hover:bg-red-50 hover:text-red-600 rounded-full px-6 transition-colors">
              Explore All Features
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}