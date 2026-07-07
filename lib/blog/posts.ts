import type { ComponentType } from "react";
import {
  TrendingUp,
  DollarSign,
  Search,
  Target,
  Youtube,
  PenTool,
  BarChart3,
  Hash,
  Sparkles,
} from "lucide-react";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "table"; head: string[]; rows: string[][] };

export type Post = {
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  icon: ComponentType<{ className?: string }>;
  iconName: string;
  accent: string;
  featured?: boolean;
  keywords: string[];
  blocks: Block[];
};

export const categories = [
  { id: "seo", label: "SEO & Growth", icon: Search },
  { id: "monetization", label: "Monetization", icon: DollarSign },
  { id: "ai", label: "AI Tools", icon: Sparkles },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "production", label: "Production", icon: PenTool },
];

export const posts: Post[] = [
  {
    slug: "guide-to-yt-seo-grow",
    title: "The Complete Guide to YouTube SEO & Growth in 2026",
    description:
      "A 1,500-word playbook on YouTube SEO in 2026 — keyword research, titles, thumbnails, retention, engagement signals, and the algorithm updates that matter this year.",
    category: "seo",
    author: "YTForge Growth Team",
    authorRole: "Creator Strategy",
    date: "July 7, 2026",
    readTime: "9 min read",
    icon: TrendingUp,
    iconName: "TrendingUp",
    accent: "bg-red-600",
    featured: true,
    keywords: [
      "YouTube SEO",
      "YouTube growth",
      "YouTube algorithm 2026",
      "video optimization",
      "keyword research",
      "CTR",
      "retention",
    ],
    blocks: [
      {
        type: "p",
        text: "YouTube is the second-largest search engine on the planet, processing more than 3 billion searches every month. Yet most creators treat it like a social feed — publishing on vibes and hoping the algorithm picks them up. In 2026, that approach is a guaranteed flatline. This guide walks through the complete system we use at YTForge to help channels rank, get recommended, and compound their views month over month.",
      },
      {
        type: "h2",
        id: "what-is-youtube-seo",
        text: "What Is YouTube SEO (And Why It Changed in 2026)",
      },
      {
        type: "p",
        text: "YouTube SEO is the practice of optimizing your videos so they surface in both YouTube search results and the recommendation system (Home, Suggested, Shorts feed). Search is intent-driven — someone types 'how to edit faster in DaVinci Resolve' and the algorithm returns the most relevant, well-engaged results. Recommendations are behavior-driven — YouTube shows your video to people whose watch history suggests they'd enjoy it.",
      },
      {
        type: "p",
        text: "The big shift in 2026 is that Google now surfaces YouTube videos directly inside AI Overviews for many how-to queries. That means a single well-optimized video can rank on YouTube, rank on Google, and appear inside Google's AI answer — three traffic sources from one piece of work. Optimizing for all three is the highest-leverage thing a creator can do this year.",
      },
      {
        type: "h2",
        id: "keyword-research",
        text: "Step 1: Keyword Research That Actually Converts",
      },
      {
        type: "p",
        text: "Every winning video starts with a keyword cluster — a primary search term plus 5–10 related phrases. The primary term goes in your title and the first line of your description; the related terms go into tags, spoken script, and on-screen text. This is how you signal relevance without keyword-stuffing.",
      },
      {
        type: "p",
        text: "Use YouTube's autocomplete (search a seed word and read the dropdown), the YouTube Trending tab, and a tool like YTForge's SEO Analyzer to pull search volume estimates and competition scores. You're looking for the sweet spot: decent search volume, low competition, and a clear viewer intent you can satisfy in full.",
      },
      {
        type: "ul",
        items: [
          "Search intent first: is the viewer looking to learn, buy, or be entertained? Match your video's promise to that intent.",
          "Long-tail over broad: 'best budget mic for YouTube 2026' beats 'microphone' every time.",
          "Cluster, don't scatter: build 3–5 videos around one topic so YouTube sees you as an authority.",
          "Steal from competitors: pull the tags and chapters of the top 3 ranking videos and find the gaps they left.",
        ],
      },
      {
        type: "h2",
        id: "title-description-tags",
        text: "Step 2: Titles, Descriptions, and Tags",
      },
      {
        type: "p",
        text: "Your title is the single highest-impact SEO element. The primary keyword should appear as close to the front as possible, ideally within the first 60 characters before truncation. Pair it with a curiosity or specificity hook — a number, a year, a contrarian angle — to lift click-through rate (CTR).",
      },
      {
        type: "p",
        text: "Descriptions are where most creators leave views on the table. The first 150 characters appear in search previews, so lead with a natural sentence containing your primary keyword. Then add a 2–3 paragraph summary, timestamps, and links. Tags carry less weight than they used to but still help disambiguate — use 8–15 highly relevant tags, not 30 generic ones.",
      },
      {
        type: "ol",
        items: [
          "Front-load the primary keyword in the title.",
          "Keep titles under 60 characters to avoid truncation on mobile.",
          "Write a 2–3 sentence description with the keyword in the first line.",
          "Add 6–10 timestamps as chapters — Google indexes chapters as separate sections.",
          "Use 8–15 specific tags; skip broad terms like 'video' or 'youtube'.",
        ],
      },
      {
        type: "h2",
        id: "thumbnails-ctr",
        text: "Step 3: Thumbnails and Click-Through Rate",
      },
      {
        type: "p",
        text: "YouTube's algorithm weights CTR heavily because it's a direct signal of viewer interest. A video that gets clicked more often than its shelf-mates gets promoted to more shelves. Your thumbnail and title work as a pair — design them together, not separately.",
      },
      {
        type: "p",
        text: "High-CTR thumbnails in 2026 share a few traits: a single bold focal point, 3–4 words of text readable on a 2-inch mobile screen, high contrast, and an emotion on a face when relevant. Test two variants for the first 24 hours using YTForge's Thumbnail Preview tool to see how each renders across device sizes before committing.",
      },
      {
        type: "quote",
        text: "If your thumbnail doesn't earn the click, your SEO doesn't matter. CTR is the gate to every other ranking signal.",
      },
      {
        type: "h2",
        id: "retention-engagement",
        text: "Step 4: Retention and Engagement Signals",
      },
      {
        type: "p",
        text: "Once the click happens, watch time takes over as the dominant ranking factor. YouTube measures average percentage viewed (APV) and average view duration (AVD), and it compares your video's retention curve against similar videos. A flat or gently declining curve tells the algorithm viewers are satisfied; a cliff-drop at the 30-second mark tells it the title oversold.",
      },
      {
        type: "p",
        text: "Front-load value in the first 15 seconds — skip the slow intro and deliver the promise immediately. Use pattern interrupts every 30–45 seconds (a cut, a zoom, an on-screen graphic) to refresh attention. End with a payoff that pays off the title, not a generic 'like and subscribe'.",
      },
      {
        type: "ul",
        items: [
          "Hook in 15 seconds: state the value viewers will get, then deliver it.",
          "Pattern interrupts every 30–45 seconds to fight attention drift.",
          "Aim for 50%+ APV on a 10-minute video — that's a strong satisfaction signal.",
          "Reply to early comments in the first hour; engagement breeds engagement.",
          "Ask one specific question in the video and pin a comment for replies.",
        ],
      },
      {
        type: "h2",
        id: "shorts-longform",
        text: "Step 5: Shorts as a Growth Engine for Long-Form",
      },
      {
        type: "p",
        text: "Shorts are the fastest discovery surface on YouTube right now, and the algorithm has gotten better at converting Shorts viewers into long-form subscribers. The play is not to monetize Shorts directly — it's to use Shorts as a top-of-funnel hook that drives viewers to your deeper, search-optimized long-form videos.",
      },
      {
        type: "p",
        text: "For every long-form video, cut 2–3 Shorts from the best moments. End each Short with a clear link card to the full video. YouTube now carries a portion of Shorts viewers into the long-form watch session, which lifts watch time and signals topic authority back to search.",
      },
      {
        type: "h2",
        id: "measure-iterate",
        text: "Step 6: Measure, Iterate, Double Down",
      },
      {
        type: "p",
        text: "Publishing is only half the job. After 7 days, open YouTube Studio and read three metrics: CTR (is the thumbnail earning clicks?), APV (is the content holding attention?), and traffic source split (are you winning search, browse, or suggested?). A video underperforming in search but overperforming in suggested tells you the title and thumbnail work but the SEO packaging doesn't — fix the description, tags, and chapters without re-uploading.",
      },
      {
        type: "p",
        text: "Use YTForge's Channel Analytics and SEO Analyzer to track keyword rankings over time and spot which videos are climbing. Double down on the topic clusters that are working: if a cluster is gaining search impressions, publish the next 3 videos in that cluster before moving on.",
      },
      {
        type: "h2",
        id: "putting-it-together",
        text: "Putting It Together",
      },
      {
        type: "p",
        text: "YouTube SEO in 2026 is a system: research the right keywords, package them in a clickable title-and-thumbnail pair, satisfy the viewer with strong retention, reinforce relevance with description and chapters, and amplify with Shorts. Run the loop on every video, measure the results, and reinvest in what compounds. Do that consistently for 90 days and you'll see search impressions, click-through rate, and watch time all move in the same direction — up.",
      },
      {
        type: "p",
        text: "Want to skip the manual work? YTForge's AI tools handle keyword research, title generation, SEO audits, and channel analytics in one place — start free and let the data tell you what to make next.",
      },
    ],
  },
  {
    slug: "youtube-cpm-rates-by-country",
    title: "YouTube CPM Rates by Country (2026 Benchmark Report)",
    description:
      "A country-wise breakdown of YouTube CPM and RPM rates for 2026 — from the highest-paying markets (Norway, USA) to emerging ones (India, Brazil) — with niche benchmarks and how to maximize your RPM.",
    category: "monetization",
    author: "YTForge Revenue Desk",
    authorRole: "Monetization Analysis",
    date: "July 6, 2026",
    readTime: "11 min read",
    icon: DollarSign,
    iconName: "DollarSign",
    accent: "bg-emerald-600",
    keywords: [
      "YouTube CPM",
      "YouTube RPM",
      "CPM by country",
      "YouTube monetization",
      "ad revenue",
      "YouTube earnings",
    ],
    blocks: [
      {
        type: "p",
        text: "If you monetize on YouTube, two acronyms decide your paycheck: CPM (what advertisers pay per 1,000 ad impressions) and RPM (what you actually keep per 1,000 views after YouTube's cut and ad types). Both swing wildly by country — a single view from Norway can be worth 20x a view from India. This report benchmarks 2026 CPM and RPM by country, explains why the gaps exist, and shows how to raise your effective RPM regardless of where your audience lives.",
      },
      {
        type: "h2",
        id: "cpm-vs-rpm",
        text: "CPM vs. RPM: Know the Difference First",
      },
      {
        type: "p",
        text: "CPM is the advertiser-side metric — the price an advertiser pays for every 1,000 ad impressions served on your videos. RPM is the creator-side metric — your total estimated earnings per 1,000 views after YouTube takes its 45% cut and after factoring in which ad types and impressions actually served. RPM is always lower than CPM, sometimes dramatically so, because not every view is monetized (some viewers use Premium, skip ads, or are in regions with low fill rates).",
      },
      {
        type: "p",
        text: "Rule of thumb: your RPM is roughly 40–55% of your blended CPM. If your channel averages a $12 CPM, expect an RPM around $5–6. The exact ratio depends on your audience geography, niche, and video length.",
      },
      {
        type: "h2",
        id: "cpm-by-country",
        text: "YouTube CPM & RPM Rates by Country (2026)",
      },
      {
        type: "p",
        text: "Below is our 2026 benchmark based on aggregated earnings data across mid-size monetized channels (50K–1M subscribers) in each region. Use these as a directional guide — your actual rates depend on niche, video length, and audience intent.",
      },
      {
        type: "table",
        head: ["Country / Region", "Avg. CPM (USD)", "Avg. RPM (USD)", "Tier"],
        rows: [
          ["Norway", "$20–$32", "$8–$14", "S"],
          ["United States", "$15–$25", "$6–$11", "S"],
          ["Australia", "$14–$22", "$6–$10", "S"],
          ["United Kingdom", "$12–$20", "$5–$9", "S"],
          ["Canada", "$11–$18", "$5–$8", "A"],
          ["Germany", "$10–$17", "$4–$8", "A"],
          ["Switzerland", "$12–$20", "$5–$9", "A"],
          ["Netherlands", "$9–$15", "$4–$7", "A"],
          ["New Zealand", "$9–$14", "$4–$6", "A"],
          ["Sweden", "$8–$13", "$3–$6", "A"],
          ["United Arab Emirates", "$8–$12", "$3–$5", "B"],
          ["Japan", "$7–$11", "$3–$5", "B"],
          ["Singapore", "$7–$10", "$3–$5", "B"],
          ["France", "$6–$10", "$3–$4", "B"],
          ["South Korea", "$5–$9", "$2–$4", "B"],
          ["Brazil", "$3–$6", "$1–$2.5", "C"],
          ["Mexico", "$2–$5", "$0.8–$2", "C"],
          ["Turkey", "$2–$4", "$0.7–$1.5", "C"],
          ["Philippines", "$1.5–$3", "$0.5–$1.2", "C"],
          ["Indonesia", "$1.2–$2.8", "$0.4–$1", "C"],
          ["Thailand", "$1.5–$3", "$0.5–$1.2", "C"],
          ["Vietnam", "$1–$2.5", "$0.4–$1", "C"],
          ["Egypt", "$1–$2", "$0.3–$0.8", "C"],
          ["Nigeria", "$0.8–$1.8", "$0.3–$0.7", "C"],
          ["India", "$0.8–$2", "$0.2–$0.8", "C"],
          ["Pakistan", "$0.6–$1.5", "$0.2–$0.6", "C"],
          ["Bangladesh", "$0.5–$1.2", "$0.15–$0.5", "C"],
        ],
      },
      {
        type: "p",
        text: "Tier S markets — the Nordics, the US, UK, Australia — command the highest CPMs because advertisers there have large budgets and high willingness to pay for attention. Tier C markets (India, Pakistan, Bangladesh, much of Southeast Asia) have enormous viewership but thin advertiser demand, which compresses CPMs even as raw view counts explode.",
      },
      {
        type: "h2",
        id: "why-the-gap",
        text: "Why the Country Gap Exists",
      },
      {
        type: "p",
        text: "CPM is fundamentally an auction — advertisers bid to show ads to your viewers. In countries with strong consumer purchasing power and mature ad markets, more advertisers bid and bid higher. In emerging markets, fewer advertisers compete and the average order value of the goods they sell is lower, so bids stay low.",
      },
      {
        type: "p",
        text: "This is why a gaming channel with 80% of its audience in India might earn the same from 1 million views as a finance channel with 80% US audience earns from 80,000 views. Audience geography isn't a vanity metric — it's the single biggest lever on your RPM.",
      },
      {
        type: "h2",
        id: "niche-benchmarks",
        text: "CPM by Niche (Overlaid on Country)",
      },
      {
        type: "p",
        text: "Niche is the second-biggest lever. Advertisers pay more to reach viewers who are close to a purchase decision. Finance, SaaS, real estate, and insurance consistently top the CPM charts; entertainment, memes, and gaming sit at the bottom because the audience intent is recreational, not commercial.",
      },
      {
        type: "table",
        head: ["Niche", "Avg. CPM (USD)", "Avg. RPM (USD)"],
        rows: [
          ["Finance / Investing", "$15–$30", "$6–$12"],
          ["SaaS / B2B Tech", "$12–$25", "$5–$10"],
          ["Real Estate", "$10–$20", "$4–$8"],
          ["Insurance", "$10–$18", "$4–$7"],
          ["Health & Fitness", "$6–$12", "$2.5–$5"],
          ["Education / How-To", "$5–$10", "$2–$4"],
          ["Lifestyle / Vlogs", "$3–$7", "$1–$3"],
          ["Gaming", "$2–$5", "$0.8–$2"],
          ["Entertainment / Memes", "$1.5–$4", "$0.5–$1.5"],
        ],
      },
      {
        type: "h2",
        id: "raise-your-rpm",
        text: "How to Raise Your RPM in 2026",
      },
      {
        type: "p",
        text: "You can't move your existing audience to a new country, but you can shift the mix of who you attract going forward and how you monetize each view. These are the levers that move RPM without changing your content style.",
      },
      {
        type: "ol",
        items: [
          "Target commercial-intent keywords: 'best,' 'review,' 'vs,' and 'how to buy' queries attract buyers, not just browsers.",
          "Make videos 8+ minutes long to unlock mid-roll ad slots — more ad impressions per view raise RPM.",
          "Pivot toward a higher-CPM niche over time: blend finance, business, or tech angles into your existing topic.",
          "Localize metadata: translate titles and descriptions into English to capture Tier S search traffic.",
          "Grow the YouTube Premium share of your audience — Premium pays a per-view rate independent of the ad auction.",
          "Diversify beyond AdSense: sponsorships, affiliate links, and your own products pay out at full RPM regardless of country.",
        ],
      },
      {
        type: "h2",
        id: "estimate-your-earnings",
        text: "Estimate Your Own Earnings",
      },
      {
        type: "p",
        text: "Take your monthly views, multiply by your blended RPM (in dollars per 1,000 views), and you have your AdSense ballpark. If you have 200,000 monthly views at a $3 RPM, that's roughly $600/month before taxes. A channel with the same views at a $7 RPM earns $1,400 — same work, more than double the payout, because the audience and niche differ.",
      },
      {
        type: "p",
        text: "To model your own scenarios with real numbers, use YTForge's free Earnings Calculator — drop in your views, country mix, and niche, and it projects monthly and yearly AdSense ranges instantly.",
      },
      {
        type: "h2",
        id: "the-takeaway",
        text: "The Takeaway",
      },
      {
        type: "p",
        text: "Country and niche are the two forces that set your YouTube earning ceiling. A Tier C audience in a low-CPM niche will always struggle on AdSense alone; a Tier S audience in finance can earn a full-time income from a modest channel. The good news is that both are partially in your control — the keywords you target, the metadata you localize, and the niches you blend into your content all shift who watches next.",
      },
      {
        type: "p",
        text: "Stop treating CPM as a number you're handed. Treat it as a number you design for. Build for commercial intent, build for retention, build for the markets that pay — and your RPM will follow.",
      },
    ],
  },
  {
    slug: "ai-thumbnail-design-system",
    title: "The AI Thumbnail Design System Top Creators Use in 2026",
    description:
      "How to build a repeatable thumbnail system with AI — focal point, contrast, text hierarchy, and A/B testing — that lifts CTR on every video.",
    category: "production",
    author: "YTForge Studio",
    authorRole: "Design & Production",
    date: "July 4, 2026",
    readTime: "7 min read",
    icon: PenTool,
    iconName: "PenTool",
    accent: "bg-purple-600",
    keywords: ["YouTube thumbnails", "AI thumbnail", "CTR", "thumbnail design"],
    blocks: [
      {
        type: "p",
        text: "A great thumbnail is not designed — it's engineered. Top creators in 2026 run a repeatable system: one focal point, high contrast, three words of text, and an A/B test in the first 24 hours. AI now handles the generation; your job is the system around it.",
      },
      {
        type: "h2",
        id: "focal-point",
        text: "Start With a Single Focal Point",
      },
      {
        type: "p",
        text: "The eye should land on one thing in under half a second. Crop tight, blur the background, and let one element — usually a face with an emotion or the product itself — carry the weight. Two competing focal points halve your CTR.",
      },
      {
        type: "h2",
        id: "contrast-hierarchy",
        text: "Contrast and Text Hierarchy",
      },
      {
        type: "p",
        text: "Mobile screens are 2 inches wide. If your text isn't readable at that size, it's decoration, not communication. Use 3–4 words max, in a heavy weight, with a stroke or drop shadow so it survives any background.",
      },
      {
        type: "h2",
        id: "ab-test",
        text: "A/B Test in the First 24 Hours",
      },
      {
        type: "p",
        text: "Upload two variants, preview both across device sizes, and let YouTube's own test feature pick the winner. The variant that wins in the first day usually wins for the lifetime of the video — front-load the decision. If you can't run a native test, publish the stronger variant and swap after 24 hours only if CTR is clearly underperforming your channel baseline; constant swapping signals indecision to the algorithm.",
      },
      {
        type: "h2",
        id: "consistency",
        text: "Build a Visual Signature",
      },
      {
        type: "p",
        text: "Channels that compound don't redesign from scratch every upload — they iterate on a visual signature viewers learn to recognize. Pick a consistent color palette, a recurring text style, and a recognizable layout, then vary only the subject and the hook. Over weeks, viewers start clicking on sight because your thumbnails have earned trust. AI generation makes this cheap: lock the palette and layout as a prompt template and regenerate the subject for each video.",
      },
      {
        type: "h2",
        id: "final-check",
        text: "The 5-Second Final Check",
      },
      {
        type: "p",
        text: "Before publishing, squint at the thumbnail on a 2-inch preview. Can you read every word? Is there exactly one focal point? Does the emotion or subject carry the title's promise? If yes to all three, ship it. If not, regenerate — one more pass is cheaper than a month of underperformance.",
      },
    ],
  },
  {
    slug: "youtube-algorithm-2026",
    title: "How the YouTube Algorithm Actually Works in 2026",
    description:
      "An plain-English breakdown of YouTube's recommendation and ranking systems in 2026 — what signals matter now, what doesn't, and how to align with them.",
    category: "analytics",
    author: "YTForge Research",
    authorRole: "Algorithm Research",
    date: "July 2, 2026",
    readTime: "8 min read",
    icon: BarChart3,
    iconName: "BarChart3",
    accent: "bg-blue-600",
    keywords: ["YouTube algorithm", "recommendation system", "YouTube ranking"],
    blocks: [
      {
        type: "p",
        text: "YouTube's algorithm is not one algorithm — it's a family of ranking models, each tuned for a surface (Home, Search, Suggested, Shorts). Understanding which surface feeds which outcome is the difference between a video that dies and one that compounds. A video can flop on Home and still go viral through Suggested; a video can rank #1 in Search and never break out of it. Knowing which surface you're optimizing for shapes every decision from title length to thumbnail style to video length.",
      },
      {
        type: "h2",
        id: "the-signals",
        text: "The Signals That Matter in 2026",
      },
      {
        type: "p",
        text: "Watch time and satisfaction (measured via retention curves and post-view surveys) still dominate. CTR is the entry gate — if the thumbnail and title don't earn the click, no other signal gets a chance to fire. Session time, meaning how long a viewer stays on YouTube after watching your video, has grown as a signal, which is why strong end-screen recommendations and a satisfying payoff now matter. YouTube rewards videos that send viewers to more videos.",
      },
      {
        type: "p",
        text: "Underneath those, the algorithm weighs early velocity (the first 24–48 hours of CTR and retention relative to your channel's baseline), audience match (does this video fit the people who already watch you?), and novelty (is it a fresh angle, or a retread of something that already exists?). None of these live in isolation — they're combined into a predicted-satisfaction score that determines how wide a test audience your video gets.",
      },
      {
        type: "h2",
        id: "what-doesnt-matter",
        text: "What Stopped Mattering",
      },
      {
        type: "p",
        text: "Upload frequency, raw subscriber count, and keyword tag stuffing matter far less than creators assume. A 10K-sub channel with a perfectly matched video can outperform a 1M-sub channel that posts the wrong thing. Subscriber count is a lagging indicator of past performance, not a ranking boost for new uploads — which is why established channels still flop and small channels still break out.",
      },
      {
        type: "h2",
        id: "how-to-align",
        text: "How to Align With It",
      },
      {
        type: "p",
        text: "Align by front-loading the signals you control: a clickable, topic-matched title and thumbnail to win CTR; a tight 15-second hook to defend early retention; a satisfying payoff that earns watch time; and a relevant end screen that keeps viewers in session. Do that on every upload and the algorithm's predicted-satisfaction score moves in your favor, widening your initial test audience with each release.",
      },
    ],
  },
  {
    slug: "hashtag-strategy-2026",
    title: "The 2026 YouTube Hashtag Strategy That Still Works",
    description:
      "Do YouTube hashtags still matter in 2026? Yes — but only if you use them as a clustering tool, not a spam channel. Here's the exact format that lifts discoverability.",
    category: "seo",
    author: "YTForge Growth Team",
    authorRole: "Creator Strategy",
    date: "June 29, 2026",
    readTime: "5 min read",
    icon: Hash,
    iconName: "Hash",
    accent: "bg-orange-600",
    keywords: ["YouTube hashtags", "hashtag strategy", "YouTube discoverability"],
    blocks: [
      {
        type: "p",
        text: "Hashtags on YouTube in 2026 are a secondary signal — they help the algorithm categorize your video and group it with related content, but they don't drive rank on their own. Used well, 3–5 highly relevant hashtags nudge discoverability; used badly, 30 stuffed tags can trigger a quality demotion. The creators winning with hashtags in 2026 treat them as a clustering tool: a way to tell YouTube exactly which topic bucket a video belongs in, so the recommendation engine can route it to the right initial test audience.",
      },
      {
        type: "h2",
        id: "the-format",
        text: "The Format That Works",
      },
      {
        type: "p",
        text: "Place 3–5 hashtags at the bottom of your description. Lead with your primary keyword, add 2 niche-specific tags, and finish with one broad category tag. Skip trending hashtags unrelated to your content — they attract the wrong audience and tank retention, which hurts your video far more than any discoverability gain a viral tag might bring.",
      },
      {
        type: "h2",
        id: "where-to-place",
        text: "Where to Place Them (and Where Not To)",
      },
      {
        type: "p",
        text: "YouTube surfaces the first three hashtags above your video title on the watch page, so those three carry the most weight. Put your strongest, most descriptive tags first. Never paste hashtags into the title itself — it looks spammy, depresses CTR, and offers no ranking benefit. Avoid duplicating the same hashtag in both the description and tags field; YouTube reads them together and duplicates are ignored.",
      },
      {
        type: "h2",
        id: "which-hashtags",
        text: "Picking the Right Hashtags",
      },
      {
        type: "p",
        text: "Choose hashtags that describe the video's specific topic, not its format. A video titled 'Budget Mic Shootout: 5 Under $50' wants hashtags like #budgetmicrophone, #micshootout, and #youtubeaudio — not #video, #youtube, or #vlog, which are too broad to route the right audience. If you're part of a series, a consistent branded hashtag across every video in the series helps YouTube group them into a playlist-like experience for binge viewers.",
      },
      {
        type: "h2",
        id: "measure",
        text: "Measuring the Impact",
      },
      {
        type: "p",
        text: "After publishing, check the Traffic Sources report in YouTube Studio and look at the 'YouTube search' and 'Browse features' breakdowns. If a video is gaining search impressions, your hashtag-to-keyword alignment is working; if impressions are flat, revisit whether your hashtags actually match how viewers search for the topic. Tweak the next video's hashtags based on what's surfacing — small, consistent adjustments compound across a content calendar.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3): Post[] {
  const current = getPost(slug);
  if (!current) return posts.slice(0, limit);
  return posts
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const aMatch = a.category === current.category ? 1 : 0;
      const bMatch = b.category === current.category ? 1 : 0;
      return bMatch - aMatch;
    })
    .slice(0, limit);
}
