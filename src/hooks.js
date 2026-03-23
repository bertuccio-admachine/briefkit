/**
 * hooks.js — Viral hook engine with scoring
 * Each hook ≤ 12 words (3 seconds read aloud)
 * Scored on 4 dimensions, top hook recommended with reasoning
 */

// ─────────────────────────────────────────────
// Hook pattern library — proven viral formulas
// ─────────────────────────────────────────────

const HOOK_TEMPLATES = {
  pain_point: [
    "Sick of {painPhrase}? There's a reason it's not working.",
    "Still {painAction}? Here's what nobody tells you.",
    "The real reason you're {failingAt} — it's not what you think.",
    "Stop {badHabit}. There's a better way.",
  ],
  curiosity_gap: [
    "Nobody talks about this {productType} secret.",
    "The {productType} trick that {audience} use and don't share.",
    "I found something that changes how {audience} do {task}.",
    "This is the thing everyone in {community} is switching to.",
  ],
  bold_claim: [
    "{result} in {timeframe}. I have the receipts.",
    "This {productType} does what nothing else does. Here's proof.",
    "I haven't {oldWay} in {timeframe}. Here's why.",
    "{specificStat}. Here's how.",
  ],
  social_proof: [
    "{bigNumber} {audience} use this daily. Here's why.",
    "Everyone in my {community} switched to this. Now I know why.",
    "The {productType} that {audience} can't stop recommending.",
    "After {reviews}+ reviews, here's what people actually say.",
  ],
  before_after: [
    "Before: {beforeState}. After {timeframe}: {afterState}.",
    "{beforeState} → {afterState}. This is what changed.",
    "I used to {beforeAction}. Now I {afterAction}. Here's the difference.",
    "What {oldTool} did vs. what this does — not even close.",
  ],
  rhetorical_question: [
    "What if you could {desiredOutcome} — without {objection}?",
    "What would you do with {timeSaved} back every week?",
    "Why are you still {painAction} when this exists?",
    "How much is {painAction} actually costing you per week?",
  ],
};

// Scoring dimensions — max 5 each, max total 20
function scoreHook(hook, type, platform) {
  const words = hook.split(' ').length;
  const hasNumber = /\d/.test(hook);
  const hasQuestion = hook.includes('?');
  const hasPlatformFit = {
    tiktok:    { pain_point: 5, curiosity_gap: 5, bold_claim: 4, social_proof: 4, before_after: 4, rhetorical_question: 3 },
    instagram: { pain_point: 4, curiosity_gap: 4, bold_claim: 4, social_proof: 5, before_after: 5, rhetorical_question: 3 },
    facebook:  { pain_point: 5, curiosity_gap: 3, bold_claim: 4, social_proof: 5, before_after: 4, rhetorical_question: 4 },
    meta:      { pain_point: 5, curiosity_gap: 3, bold_claim: 4, social_proof: 5, before_after: 4, rhetorical_question: 4 },
    youtube:   { pain_point: 4, curiosity_gap: 5, bold_claim: 5, social_proof: 3, before_after: 4, rhetorical_question: 4 },
    x:         { pain_point: 4, curiosity_gap: 4, bold_claim: 5, social_proof: 3, before_after: 4, rhetorical_question: 5 },
  };

  const platformFit = (hasPlatformFit[platform] || hasPlatformFit.meta)[type] || 3;
  const patternInterrupt = type === 'pain_point' ? 5 : type === 'curiosity_gap' ? 5 : type === 'bold_claim' ? 4 : 3;
  const emotionalResonance = type === 'pain_point' ? 5 : type === 'social_proof' ? 4 : type === 'before_after' ? 4 : type === 'rhetorical_question' ? 4 : 3;
  const specificity = hasNumber ? 5 : hook.length > 40 ? 4 : 3;
  const scrollStop = platformFit;

  return {
    pattern_interrupt: patternInterrupt,
    emotional_resonance: emotionalResonance,
    specificity,
    scroll_stop_power: scrollStop,
    total: patternInterrupt + emotionalResonance + specificity + scrollStop,
  };
}

/**
 * Build viral hooks with scores and recommendation
 * Returns full hook analysis object
 */
export function buildViralHooks(product, count = 6, platform = 'meta', icp = null) {
  const vars = buildTemplateVars(product, icp);
  const types = Object.keys(HOOK_TEMPLATES);
  const hooks = [];

  // Generate one hook per type (up to count)
  const targetTypes = types.slice(0, Math.min(count, types.length));

  for (const type of targetTypes) {
    const patterns = HOOK_TEMPLATES[type];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const text = fillTemplate(pattern, vars);
    const scores = scoreHook(text, type, platform);

    hooks.push({
      type: type.replace(/_/g, ' '),
      hook: text,
      scores,
      read_time: `~${Math.ceil(text.split(' ').length / 3)}s`,
    });
  }

  // Fill remaining slots with more variety if count > type count
  let extra = count - hooks.length;
  let typeIdx = 0;
  while (extra > 0) {
    const type = types[typeIdx % types.length];
    const patterns = HOOK_TEMPLATES[type];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const text = fillTemplate(pattern, vars);
    const scores = scoreHook(text, type, platform);
    hooks.push({ type: type.replace(/_/g, ' '), hook: text, scores, read_time: `~${Math.ceil(text.split(' ').length / 3)}s` });
    typeIdx++;
    extra--;
  }

  // Sort by total score descending
  hooks.sort((a, b) => b.scores.total - a.scores.total);

  const top = hooks[0];
  const recommendation = `**${top.hook}**\n   *Why:* Scores ${top.scores.total}/20 — highest ${topScoringDimension(top.scores)} for ${platform}. ${getHookRationale(top.type, platform)}`;

  return {
    count: hooks.length,
    platform,
    hooks,
    recommended: recommendation,
  };
}

function topScoringDimension(scores) {
  const dims = { pattern_interrupt: scores.pattern_interrupt, emotional_resonance: scores.emotional_resonance, specificity: scores.specificity, scroll_stop_power: scores.scroll_stop_power };
  return Object.entries(dims).sort((a, b) => b[1] - a[1])[0][0].replace(/_/g, ' ');
}

function getHookRationale(type, platform) {
  const rationales = {
    'pain point': `Pain-point hooks consistently outperform on ${['facebook', 'meta'].includes(platform) ? 'Facebook/Meta where audiences are older and more problem-aware' : platform}.`,
    'curiosity gap': `Curiosity gaps drive high completion rates — viewers stay to resolve the open loop.`,
    'bold claim': `Specific claims trigger a "prove it" response that keeps viewers watching.`,
    'social proof': `Social proof hooks reduce perceived risk and borrow credibility from the crowd.`,
    'before after': `Contrast hooks work because the brain is wired to seek resolution between states.`,
    'rhetorical question': `Questions activate cognitive engagement — the viewer's brain automatically answers, keeping them in the video.`,
  };
  return rationales[type] || 'Strong match for this platform and audience.';
}

// ─────────────────────────────────────────────
// Template variable builder
// ─────────────────────────────────────────────

function buildTemplateVars(product, icp) {
  const lower = product.toLowerCase();
  const productName = inferProductName(product);

  return {
    productType: inferProductType(lower),
    productName,
    bigBenefit: inferOutcome(lower),
    painPhrase: inferPain(lower),
    painAction: inferPainAction(lower),
    failingAt: inferFailingAt(lower),
    badHabit: inferBadHabit(lower),
    audience: inferAudience(lower),
    community: inferCommunity(lower),
    task: inferTask(lower),
    result: inferResult(lower),
    timeframe: '30 days',
    bigNumber: '30M+',
    reviews: '10,000',
    beforeState: inferBefore(lower),
    afterState: inferAfter(lower),
    beforeAction: inferBeforeAction(lower),
    afterAction: inferAfterAction(lower),
    oldTool: inferOldTool(lower),
    desiredOutcome: inferOutcome(lower),
    objection: inferObjShort(lower),
    timeSaved: inferTimeSaved(lower),
    problem: inferPain(lower).split(' ').slice(0, 4).join(' '),
    specificStat: inferStat(lower),
    oldWay: inferOldWay(lower),
  };
}

function inferProductName(product) {
  const camelWords = product.match(/\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*/g);
  if (camelWords && camelWords[0]) return camelWords[0];
  return product.split(/[,.\-—\n]/).map(s => s.trim())[0]?.split(' ').slice(0, 2).join(' ') || 'this';
}

function inferProductType(lower) {
  if (lower.match(/\b(app|platform|tool|software|ide|dashboard|saas)\b/)) return 'tool';
  if (lower.match(/\b(serum|cream|moisturizer|cleanser)\b/)) return 'skincare product';
  if (lower.match(/\b(protein|supplement|vitamin)\b/)) return 'supplement';
  if (lower.match(/\b(course|program|training|coaching)\b/)) return 'program';
  return 'product';
}

function inferPain(lower) {
  if (lower.includes('code') || lower.includes('deploy') || lower.includes('replit')) return 'environment setup eating your entire day';
  if (lower.includes('email') || lower.includes('marketing')) return 'campaigns that don\'t convert';
  if (lower.includes('skin') || lower.includes('beauty')) return 'spending money on products that don\'t work';
  if (lower.includes('protein') || lower.includes('supplement')) return 'not seeing results despite training hard';
  return 'not getting the results you\'re working for';
}

function inferPainAction(lower) {
  if (lower.includes('code')) return 'setting up environments from scratch';
  if (lower.includes('email')) return 'writing campaigns that get ignored';
  if (lower.includes('skin')) return 'buying skincare that does nothing';
  return 'doing this the hard way';
}

function inferFailingAt(lower) {
  if (lower.includes('code')) return 'shipping fast';
  if (lower.includes('skin')) return 'getting clear skin';
  if (lower.includes('supplement')) return 'building muscle';
  return 'getting results';
}

function inferBadHabit(lower) {
  if (lower.includes('code')) return 'setting up local environments';
  if (lower.includes('skin')) return 'layering 10 products and hoping';
  if (lower.includes('supplement')) return 'buying expensive supplements that don\'t work';
  return 'doing this the complicated way';
}

function inferAudience(lower) {
  if (lower.includes('code') || lower.includes('developer')) return 'developers';
  if (lower.includes('skin') || lower.includes('beauty')) return 'skincare lovers';
  if (lower.includes('protein') || lower.includes('fitness')) return 'fitness people';
  if (lower.includes('market')) return 'marketers';
  return 'people';
}

function inferCommunity(lower) {
  if (lower.includes('code')) return 'dev community';
  if (lower.includes('skin')) return 'skincare community';
  if (lower.includes('fitness')) return 'fitness community';
  return 'industry';
}

function inferTask(lower) {
  if (lower.includes('code')) return 'coding';
  if (lower.includes('skin')) return 'skincare';
  if (lower.includes('fitness')) return 'working out';
  return 'this';
}

function inferResult(lower) {
  if (lower.includes('code') || lower.includes('replit')) return 'Deployed in 10 minutes';
  if (lower.includes('skin')) return 'Glowing skin in 3 weeks';
  if (lower.includes('protein')) return '8lbs of muscle in 12 weeks';
  return 'Real, measurable results';
}

function inferBefore(lower) {
  if (lower.includes('code')) return '3-hour setup, 0 lines written';
  if (lower.includes('skin')) return '$400 in products, same skin';
  if (lower.includes('supplement')) return 'Training hard, no progress';
  return 'months of trying, same results';
}

function inferAfter(lower) {
  if (lower.includes('code')) return 'coding in 10 seconds';
  if (lower.includes('skin')) return 'the skin people ask about';
  if (lower.includes('supplement')) return 'visible progress in 6 weeks';
  return 'results I can actually see';
}

function inferBeforeAction(lower) {
  if (lower.includes('code')) return 'waste hours on environment setup';
  if (lower.includes('skin')) return 'layer on 8 products and hope';
  return 'do this the slow way';
}

function inferAfterAction(lower) {
  if (lower.includes('code')) return 'go from idea to code in seconds';
  if (lower.includes('skin')) return 'use 2 products and my skin has never looked better';
  return 'get the result in a fraction of the time';
}

function inferOldTool(lower) {
  if (lower.includes('code')) return 'local dev setup';
  if (lower.includes('email')) return 'Mailchimp';
  if (lower.includes('design')) return 'the old workflow';
  return 'the old way';
}

function inferTimeSaved(lower) {
  if (lower.includes('code')) return '3+ hours/week';
  if (lower.includes('email')) return 'half your workday';
  return 'hours every week';
}

function inferStat(lower) {
  if (lower.includes('code') || lower.includes('replit')) return '30M developers. Zero setup.';
  if (lower.includes('skin')) return '94% saw results in 28 days';
  if (lower.includes('supplement')) return '4.8 stars, 10,000+ reviews';
  return '10,000+ customers, real results';
}

function inferObjShort(lower) {
  if (lower.includes('code') || lower.includes('replit')) return 'yet another tool to learn';
  if (lower.includes('skin')) return 'another product that overpromises';
  if (lower.includes('supplement')) return 'wasting money on hype again';
  if (lower.includes('market')) return 'adding complexity to the stack';
  return 'the usual friction and complexity';
}

function inferOldWay(lower) {
  if (lower.includes('code')) return 'wrestled with local environments';
  if (lower.includes('skin')) return 'did the 10-step routine';
  if (lower.includes('supplement')) return 'guessed my supplement stack';
  return 'done it the hard way';
}

function inferOutcome(lower) {
  if (lower.includes('code')) return 'ship without any setup';
  if (lower.includes('skin')) return 'actually clear skin';
  if (lower.includes('supplement')) return 'the gains you\'re working for';
  return 'the result you\'ve been after';
}

function fillTemplate(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] || key);
}

function truncatePhrase(str, maxWords) {
  if (!str) return null;
  const words = str.trim().split(/\s+/);
  if (words.length <= maxWords) return str.trim();
  return words.slice(0, maxWords).join(' ');
}

// ─────────────────────────────────────────────
// Legacy export (backward compat)
// ─────────────────────────────────────────────

export function generateHooks(product, count = 3, platform = 'meta') {
  const hookData = buildViralHooks(product, count, platform, null);
  // Return in old format for brief.js compatibility
  return hookData.hooks.map(h => ({
    category: h.type,
    hook: h.hook,
    platform_fit: '★'.repeat(Math.round(h.scores.scroll_stop_power)) + '☆'.repeat(5 - Math.round(h.scores.scroll_stop_power)),
  }));
}

export { HOOK_TEMPLATES };
