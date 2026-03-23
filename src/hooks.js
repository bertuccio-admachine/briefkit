// Hook pattern library — battle-tested formulas for scroll-stopping openers

const hookPatterns = {
  question: [
    "Are you still {painPoint}?",
    "What if you could {desiredOutcome} in {timeframe}?",
    "Why is nobody talking about {topic}?",
    "Did you know {surprisingFact}?",
    "Want to know the secret to {desiredOutcome}?",
    "Struggling with {painPoint}? You're not alone.",
    "What would you do with {benefit}?",
  ],
  bold_claim: [
    "This {productType} changed everything for me.",
    "I tried 20+ {productCategory} — this is the only one that actually works.",
    "The {productType} that {bigBenefit}. Period.",
    "Stop wasting money on {alternative}.",
    "This is the {productType} your {audience} has been waiting for.",
    "{ProductName} isn't just another {productType}. Here's why.",
  ],
  story: [
    "3 months ago, I was {beforeState}...",
    "I almost gave up on {goal}. Then I found this.",
    "My {person} couldn't believe the difference.",
    "Here's what happened when I switched to {productName}.",
    "I've been using this for {timeframe} and wow.",
    "Nobody believed me until they tried it themselves.",
  ],
  contrast: [
    "Before: {beforeState}. After: {afterState}.",
    "Other {productCategory}: {oldWay}. {ProductName}: {newWay}.",
    "What I used to do vs. what I do now.",
    "The old way: {painPoint}. The new way: {solution}.",
    "Everyone else does {commonApproach}. We do {differentApproach}.",
  ],
  urgency: [
    "If you're a {audience}, stop scrolling.",
    "POV: You finally found {solution}.",
    "This won't last. Here's why you need {productName} now.",
    "The one thing {audience} need to know right now.",
    "Save this before it gets buried in your feed.",
  ],
  social_proof: [
    "{number}+ {audience} already use this daily.",
    "There's a reason this went viral.",
    "Everyone in my {community} switched to this.",
    "The {productType} that {audience} can't stop recommending.",
    "I didn't believe the hype until I tried it.",
  ],
};

export function generateHooks(product, count = 3, platform = 'meta') {
  const info = parseProduct(product);
  const hooks = [];
  const categories = Object.keys(hookPatterns);

  // Ensure variety by picking from different categories
  const usedCategories = new Set();

  for (let i = 0; i < count; i++) {
    let cat;
    do {
      cat = categories[Math.floor(Math.random() * categories.length)];
    } while (usedCategories.has(cat) && usedCategories.size < categories.length);
    usedCategories.add(cat);

    const patterns = hookPatterns[cat];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    hooks.push({
      category: cat.replace('_', ' '),
      hook: fillTemplate(pattern, info),
      platform_fit: getPlatformFit(cat, platform),
    });
  }

  return hooks;
}

function parseProduct(product) {
  const lower = product.toLowerCase();
  // Extract useful signals from product description
  return {
    productName: extractName(product),
    productType: extractType(product),
    productCategory: extractCategory(product),
    painPoint: extractPainPoint(product),
    desiredOutcome: extractBenefit(product),
    benefit: extractBenefit(product),
    bigBenefit: extractBenefit(product),
    solution: extractBenefit(product),
    audience: extractAudience(product),
    beforeState: extractPainPoint(product),
    afterState: extractBenefit(product),
    topic: extractTopic(product),
    surprisingFact: extractFact(product),
    timeframe: '30 days',
    person: 'friends',
    goal: extractGoal(product),
    community: 'circle',
    number: String(Math.floor(Math.random() * 50 + 10) * 1000),
    oldWay: 'the hard way',
    newWay: 'the smart way',
    commonApproach: 'the same old thing',
    differentApproach: 'something better',
    alternative: 'generic alternatives',
    ProductName: extractName(product),
    productCategory: extractCategory(product),
  };
}

function extractName(p) {
  // First few meaningful words
  const words = p.split(/[,.\-—]/).map(s => s.trim()).filter(Boolean);
  return words[0]?.split(' ').slice(0, 3).join(' ') || 'this product';
}

function extractType(p) {
  const types = ['tool', 'app', 'platform', 'software', 'supplement', 'powder', 'cream', 'serum',
    'device', 'gadget', 'course', 'template', 'kit', 'service', 'solution'];
  const lower = p.toLowerCase();
  for (const t of types) {
    if (lower.includes(t)) return t;
  }
  return 'product';
}

function extractCategory(p) {
  const lower = p.toLowerCase();
  if (lower.includes('saas') || lower.includes('software') || lower.includes('app')) return 'software tools';
  if (lower.includes('skin') || lower.includes('beauty') || lower.includes('serum')) return 'beauty products';
  if (lower.includes('protein') || lower.includes('supplement') || lower.includes('vitamin')) return 'supplements';
  if (lower.includes('fitness') || lower.includes('workout')) return 'fitness products';
  if (lower.includes('market') || lower.includes('email')) return 'marketing tools';
  return 'products in this space';
}

function extractPainPoint(p) {
  const lower = p.toLowerCase();
  if (lower.includes('automat')) return 'spending hours on manual tasks';
  if (lower.includes('email')) return 'struggling with email engagement';
  if (lower.includes('protein') || lower.includes('supplement')) return 'choosing the right supplements';
  if (lower.includes('skin') || lower.includes('beauty')) return 'dealing with skin issues';
  if (lower.includes('market')) return 'getting marketing results';
  if (lower.includes('write') || lower.includes('content')) return 'creating content that converts';
  return 'dealing with this problem';
}

function extractBenefit(p) {
  const lower = p.toLowerCase();
  if (lower.includes('automat')) return 'automate your workflow';
  if (lower.includes('email')) return 'better email performance';
  if (lower.includes('protein') || lower.includes('supplement')) return 'peak performance';
  if (lower.includes('skin') || lower.includes('beauty')) return 'glowing skin';
  if (lower.includes('market')) return 'better marketing results';
  if (lower.includes('write') || lower.includes('content')) return 'content that converts';
  if (lower.includes('ai')) return 'AI-powered results';
  return 'better results faster';
}

function extractAudience(p) {
  const lower = p.toLowerCase();
  if (lower.includes('saas') || lower.includes('b2b')) return 'founders';
  if (lower.includes('beauty') || lower.includes('skin')) return 'beauty lovers';
  if (lower.includes('fitness') || lower.includes('protein')) return 'fitness enthusiasts';
  if (lower.includes('market')) return 'marketers';
  if (lower.includes('creator') || lower.includes('content')) return 'creators';
  return 'people like you';
}

function extractTopic(p) {
  return p.split(/[,.]/).map(s => s.trim()).filter(Boolean)[0]?.toLowerCase() || 'this';
}

function extractFact(p) {
  const lower = p.toLowerCase();
  if (lower.includes('ai')) return 'AI can do this 10x faster';
  if (lower.includes('organic')) return 'most products in this space aren\'t actually clean';
  return 'there\'s a better way to do this';
}

function extractGoal(p) {
  const lower = p.toLowerCase();
  if (lower.includes('fitness') || lower.includes('protein')) return 'my fitness goals';
  if (lower.includes('market') || lower.includes('growth')) return 'growing my business';
  if (lower.includes('skin') || lower.includes('beauty')) return 'clear skin';
  return 'finding what actually works';
}

function fillTemplate(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] || key);
}

function getPlatformFit(category, platform) {
  const fits = {
    tiktok: { story: 5, bold_claim: 4, contrast: 4, question: 3, urgency: 3, social_proof: 4 },
    instagram: { story: 4, bold_claim: 4, contrast: 5, urgency: 3, question: 3, social_proof: 5 },
    facebook: { question: 5, bold_claim: 4, social_proof: 5, story: 4, urgency: 4, contrast: 3 },
    meta: { question: 5, bold_claim: 4, social_proof: 5, story: 4, urgency: 4, contrast: 3 },
    youtube: { story: 5, question: 4, bold_claim: 3, contrast: 3, urgency: 2, social_proof: 4 },
    x: { bold_claim: 5, question: 4, contrast: 4, urgency: 3, story: 2, social_proof: 3 },
  };
  const score = fits[platform]?.[category] || 3;
  return '★'.repeat(score) + '☆'.repeat(5 - score);
}

export { hookPatterns };
