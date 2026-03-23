/**
 * icp.js — Ideal Customer Profile auto-generator
 * Infers ICP from product description using signal-based matching
 */

// Category signal maps
const CATEGORIES = {
  saas: ['saas', 'software', 'platform', 'dashboard', 'api', 'app', 'tool', 'workspace', 'ide', 'code', 'developer', 'deploy', 'cloud', 'devops', 'automation'],
  ecomm_beauty: ['skin', 'serum', 'beauty', 'glow', 'moisturizer', 'cleanser', 'toner', 'makeup', 'cosmetic', 'spf', 'retinol'],
  ecomm_health: ['supplement', 'protein', 'vitamin', 'probiotic', 'collagen', 'creatine', 'omega', 'nutrition', 'wellness'],
  ecomm_fitness: ['workout', 'fitness', 'gym', 'resistance', 'dumbbell', 'yoga', 'training', 'athletic', 'sport'],
  ecomm_food: ['food', 'snack', 'meal', 'organic', 'keto', 'vegan', 'coffee', 'tea', 'drink'],
  marketing: ['marketing', 'email', 'campaign', 'funnel', 'conversion', 'lead', 'ads', 'social media', 'content', 'seo', 'growth'],
  education: ['course', 'learn', 'training', 'masterclass', 'coaching', 'bootcamp', 'curriculum', 'teach', 'skill'],
  finance: ['invest', 'crypto', 'stock', 'money', 'budget', 'finance', 'tax', 'accounting', 'revenue', 'income'],
  creative: ['design', 'creative', 'photo', 'video', 'edit', 'illustration', 'art', 'brand', 'figma', 'canva'],
  b2b: ['enterprise', 'team', 'b2b', 'business', 'sales', 'crm', 'hr', 'recruiting', 'payroll', 'compliance'],
};

const ICP_TEMPLATES = {
  saas: {
    demographics: 'Developers, indie hackers, startup founders, and technical product managers aged 22–40. Often work remotely or at early-stage startups. Individual contributor or small team lead.',
    psychographics: 'Obsessed with efficiency and shipping fast. Hates unnecessary process. Identifies as a builder. Reads Hacker News, follows indie hackers on X, active in dev communities. Measures self-worth in shipped products.',
    corePain: 'Losing hours to environment setup, config hell, and tooling that slows them down instead of speeding them up. Every hour on infrastructure is an hour not spent building.',
    desiredOutcome: 'To go from idea to running code (or deployed product) in minutes, not days. Zero friction between thought and execution.',
    topObjection: '"Is this just another tool I will set up and abandon? Will it actually stick to my workflow?"',
    whereTheyHang: 'Hacker News, Dev.to, r/webdev, r/programming, GitHub trending, X (tech Twitter), Product Hunt, Discord dev servers',
    priceSensitivity: 'Willing to pay for tools that save time; resistant to $50+/mo for solo use; highly responsive to free tiers and usage-based pricing',
  },
  ecomm_beauty: {
    demographics: 'Women aged 22–38, urban, middle-to-upper income. Likely working professionals, health-conscious, heavy social media users. Follows beauty influencers.',
    psychographics: 'Invests in self-care as a form of self-respect. Skeptical of big beauty brands after being burned by products that overpromised. Research-heavy buyer — reads ingredient lists. Shares routine content with friends.',
    corePain: 'Wasted money on products that did not work, caused breakouts, or delivered zero results. Wants visible improvement without complexity or guesswork.',
    desiredOutcome: 'Consistently glowing, clear skin that people notice and ask about — without a 12-step routine.',
    topObjection: '"I have been burned before. What makes this different from the last one I bought?"',
    whereTheyHang: 'Instagram, TikTok (BeautyTok), r/SkincareAddiction, YouTube skincare reviews, Pinterest routines',
    priceSensitivity: 'Will pay premium for proven results. Value social proof (reviews, before/after) over price alone.',
  },
  ecomm_health: {
    demographics: 'Health-conscious adults aged 25–45. Mix of fitness enthusiasts, busy professionals, and aging adults seeking prevention. Income: middle to upper-middle.',
    psychographics: 'Takes their health seriously. Reads labels. Skeptical of "too good to be true" claims but optimistic about optimization. Shares health wins with their community. N=1 experimenter.',
    corePain: 'Supplement confusion (too many products, unclear what works) and feeling like their health is reactive rather than proactive. Wants to feel noticeably better.',
    desiredOutcome: 'Measurable, felt results — more energy, better recovery, clearer thinking — backed by science they can trust.',
    topObjection: '"There are a thousand supplements that promise this. Why is this one actually different?"',
    whereTheyHang: 'r/Supplements, r/fitness, Instagram health accounts, YouTube (health YouTubers), health podcasts, Twitter health/longevity community',
    priceSensitivity: 'Will pay for quality and proven ingredients. Subscription model works well for this audience.',
  },
  ecomm_fitness: {
    demographics: 'Active adults aged 20–45, mix of gym-goers and home workout enthusiasts. Fitness is a core identity, not just a hobby.',
    psychographics: 'Fitness is lifestyle. Tracks progress obsessively (PRs, body comp). Influenced by fitness creators and coaches. Strong community ties. Shares workout content.',
    corePain: 'Plateaus, lack of results despite consistent effort, or not being able to train due to limitations (space, equipment, time).',
    desiredOutcome: 'Visible progress. PRs broken. Body that matches the effort invested.',
    topObjection: '"I already have gear/a gym. Why do I need this?"',
    whereTheyHang: 'r/fitness, r/bodybuilding, Instagram fitness community, YouTube (fitness channels), TikTok FitTok',
    priceSensitivity: 'Willing to invest in quality gear. ROI framing works well (cost per use, cost vs. gym membership).',
  },
  ecomm_food: {
    demographics: 'Health-conscious consumers aged 25–45. Often working professionals or parents trying to eat better without sacrificing convenience.',
    psychographics: 'Food as fuel AND pleasure. Skeptical of processed food. Reads labels. Willing to pay more for clean ingredients. Shares food content with friends and family.',
    corePain: 'Finding food that tastes good AND aligns with dietary goals. The "healthy but cardboard" problem.',
    desiredOutcome: 'Delicious food that supports their goals — they want to eat this, not just tolerate it.',
    topObjection: '"Does it actually taste good? Every healthy alternative I have tried was disappointing."',
    whereTheyHang: 'Instagram food community, TikTok FoodTok, r/keto / r/vegan / r/EatCheapAndHealthy, Pinterest recipes',
    priceSensitivity: 'Will pay a premium for clean ingredients. Taste is non-negotiable — price is secondary.',
  },
  marketing: {
    demographics: 'Growth marketers, performance marketers, CMOs, and agency owners aged 28–45. Often managing significant ad spend.',
    psychographics: 'Lives in spreadsheets and dashboards. Obsessed with ROAS and CAC. Constantly testing. Cynical about over-promised tools. Respects data and case studies.',
    corePain: 'Spending too much time on execution instead of strategy. Reporting that takes hours. Campaigns that could be better but there is no bandwidth to optimize.',
    desiredOutcome: 'More efficient campaigns, lower CAC, more time for strategy, and reports they can actually show leadership.',
    topObjection: '"We already have a stack. Adding another tool means more training, more integrations, more potential breakpoints."',
    whereTheyHang: 'r/PPC, r/marketing, LinkedIn (marketing community), MarketingTwitter, Slack marketing groups, industry newsletters',
    priceSensitivity: 'Will pay for proven ROI. Case studies and data beat feature lists.',
  },
  education: {
    demographics: 'Career changers, ambitious young professionals, and entrepreneurs aged 22–40 seeking skill upgrades with real-world application.',
    psychographics: 'Motivated by career advancement or financial independence. Skeptical of theoretical content — wants actionable frameworks. Compares courses heavily before buying.',
    corePain: 'Courses that overpromise and underdeliver. Learning that does not translate to real results. Hours invested with no measurable outcome.',
    desiredOutcome: 'A tangible skill, a credential, or a direct income improvement they can point to.',
    topObjection: '"I have bought courses before and did not finish them. What makes this worth the investment?"',
    whereTheyHang: 'Reddit (relevant subs), Twitter learning community, LinkedIn, YouTube, Course comparison forums',
    priceSensitivity: 'Highly price-sensitive for unproven courses; will pay premium for names with proven results.',
  },
  finance: {
    demographics: 'Young professionals and entrepreneurs aged 25–40 actively managing or growing their money. Sometimes first-time investors.',
    psychographics: 'Anxious about financial future but motivated to fix it. Distrusts traditional finance institutions. DIY mindset. Consumes financial education content voraciously.',
    corePain: 'Financial anxiety, complexity paralysis, or feeling like their money is standing still while inflation and others race ahead.',
    desiredOutcome: 'Clarity, control, and compounding returns. Feeling financially secure and on track.',
    topObjection: '"Is this legit? There are a lot of scams in this space."',
    whereTheyHang: 'r/personalfinance, r/investing, r/financialindependence, FinancialTwitter, YouTube (finance channels), podcasts',
    priceSensitivity: 'Will pay if ROI is clear and credibility is established. Trust is the #1 barrier.',
  },
  creative: {
    demographics: 'Designers, content creators, freelancers, and brand teams aged 22–40. Mix of solo operators and agency creatives.',
    psychographics: 'Craft-obsessed. Strong aesthetic opinions. Time is money — hates tools that slow the creative process. Shares work and tool recommendations with their community.',
    corePain: 'Slow workflows, inconsistent output quality, or clients/stakeholders who bottleneck the creative process.',
    desiredOutcome: 'Beautiful work delivered faster. A workflow that gets out of the way so creativity can flow.',
    topObjection: '"I already use [Figma/Photoshop/Canva]. How does this fit my existing workflow?"',
    whereTheyHang: 'Dribbble, Behance, r/graphic_design, Design Twitter, Pinterest, YouTube design channels',
    priceSensitivity: 'Will pay for tools that genuinely improve output. Responds to free trials and portfolio examples.',
  },
  b2b: {
    demographics: 'Operations leads, team managers, HR, and C-suite at SMBs and mid-market companies. Decision-makers aged 30–50.',
    psychographics: 'Accountable for team performance and efficiency. Risk-averse (bad vendor choices have consequences). Needs stakeholder buy-in before committing. Values reliability over innovation.',
    corePain: 'Tools that don\'t talk to each other, manual processes that don\'t scale, and lack of visibility into what\'s actually happening.',
    desiredOutcome: 'A system that works, scales, and that the team actually uses.',
    topObjection: '"Implementation will be a nightmare, and my team won\'t adopt it anyway."',
    whereTheyHang: 'LinkedIn, G2/Capterra reviews, industry association communities, Slack B2B groups, Gartner reports',
    priceSensitivity: 'Decision-driven by ROI, support quality, and integration capability — not sticker price.',
  },
};

/**
 * Detect product category from description text
 */
function detectCategory(text) {
  const lower = text.toLowerCase();
  const scores = {};

  for (const [cat, signals] of Object.entries(CATEGORIES)) {
    scores[cat] = signals.filter(s => lower.includes(s)).length;
  }

  // Find top category
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (sorted[0][1] === 0) return 'saas'; // default
  return sorted[0][0];
}

/**
 * Generate ICP from product description
 * Returns structured ICP object
 */
export function generateICP(product, audienceHint = null) {
  const category = detectCategory(product);
  const template = ICP_TEMPLATES[category] || ICP_TEMPLATES.saas;

  // If audience hint provided, use it as the demographics anchor
  const demographics = audienceHint
    ? `${audienceHint}. ${template.demographics}`
    : template.demographics;

  return {
    category,
    demographics,
    psychographics: template.psychographics,
    corePain: template.corePain,
    desiredOutcome: template.desiredOutcome,
    topObjection: template.topObjection,
    whereTheyHang: template.whereTheyHang,
    priceSensitivity: template.priceSensitivity,
    autoGenerated: !audienceHint,
  };
}

/**
 * Format ICP as markdown section
 */
export function formatICP(icp) {
  const badge = icp.autoGenerated ? ' *(auto-generated)*' : '';
  return `## 🎯 Ideal Customer Profile${badge}

| | |
|---|---|
| **Demographics** | ${icp.demographics} |
| **Psychographics** | ${icp.psychographics} |
| **Core Pain** | ${icp.corePain} |
| **Desired Outcome** | ${icp.desiredOutcome} |
| **Top Objection** | ${icp.topObjection} |
| **Where They Hang** | ${icp.whereTheyHang} |
| **Price Sensitivity** | ${icp.priceSensitivity} |
`;
}
