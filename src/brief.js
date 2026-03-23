import { frameworks } from './frameworks/index.js';
import { generateHooks } from './hooks.js';

const toneGuides = {
  casual: { voice: 'Conversational, friendly, relatable', words: 'you, honestly, literally, obsessed, game-changer' },
  professional: { voice: 'Polished, credible, authoritative', words: 'proven, deliver, results-driven, optimize' },
  urgent: { voice: 'Time-sensitive, direct, action-oriented', words: 'now, limited, don\'t miss, act fast, today only' },
  playful: { voice: 'Fun, witty, energetic', words: 'obsessed, no cap, vibes, lowkey, iconic' },
  luxury: { voice: 'Elevated, sophisticated, aspirational', words: 'crafted, curated, exclusive, refined, indulge' },
};

const platformSpecs = {
  tiktok: { maxLength: '60 seconds', format: 'Vertical 9:16', style: 'Native UGC, talking head, POV', cta: 'Link in bio / Shop now' },
  instagram: { maxLength: '90 seconds (Reels) / carousel', format: 'Vertical 9:16 or 1:1', style: 'Polished UGC, aesthetic, lifestyle', cta: 'Link in bio / DM us / Shop' },
  facebook: { maxLength: '15-30s primary, up to 60s', format: '1:1 or 4:5', style: 'Thumb-stopping, direct response', cta: 'Shop Now / Learn More / Sign Up' },
  meta: { maxLength: '15-30s primary, up to 60s', format: '1:1 or 4:5', style: 'Direct response, benefit-led', cta: 'Shop Now / Learn More / Sign Up' },
  youtube: { maxLength: '15s bumper or 30-60s pre-roll', format: '16:9', style: 'High production or authentic UGC', cta: 'Visit site / Subscribe / Learn more' },
  x: { maxLength: '280 chars or 2:20 video', format: '16:9 or 1:1', style: 'Sharp, opinionated, quotable', cta: 'Link / Reply / Repost' },
};

export function buildBrief({ product, frameworkKey, platform, tone, audience, cta, hooks: hookCount }) {
  const fw = frameworks[frameworkKey];
  const toneGuide = toneGuides[tone] || toneGuides.casual;
  const platSpec = platformSpecs[platform] || platformSpecs.meta;
  const hookList = generateHooks(product, hookCount, platform);

  const brief = {
    title: `Creative Brief: ${product.slice(0, 60)}${product.length > 60 ? '...' : ''}`,
    meta: {
      framework: `${fw.name} (${fw.full})`,
      platform,
      tone: `${tone} — ${toneGuide.voice}`,
      audience: audience || 'Inferred from product',
      format: platSpec.format,
      max_length: platSpec.maxLength,
      style: platSpec.style,
    },
    product_summary: product,
    hooks: hookList,
    framework_sections: buildFrameworkSections(fw, product, tone, audience),
    cta: cta || platSpec.cta,
    tone_guide: {
      voice: toneGuide.voice,
      power_words: toneGuide.words,
    },
    do_list: generateDos(platform, tone),
    dont_list: generateDonts(platform),
  };

  return brief;
}

function buildFrameworkSections(fw, product, tone, audience) {
  const sections = {};
  const generators = {
    // AIDA
    attention: () => `Open with a pattern interrupt. Stop the scroll with something unexpected about ${extractCore(product)}.`,
    interest: () => `Build curiosity. Share a specific detail or angle that makes the viewer lean in. Focus on what makes this different.`,
    desire: () => `Make it personal. Show the transformation — how life changes with this. ${audience ? `Speak directly to ${audience}.` : 'Paint the picture of the better outcome.'}`,
    action: () => `Clear, single CTA. Tell them exactly what to do next. Remove all friction.`,
    // PAS
    problem: () => `Lead with the pain. Name the specific frustration your audience feels about ${extractPainFromProduct(product)}.`,
    agitate: () => `Twist the knife (empathetically). Show you understand how bad this problem really is. Make it visceral.`,
    solution: () => `Reveal the product as the answer. Show exactly how it solves the problem simply and completely.`,
    // BAB
    before: () => `Paint the "before" picture. What does life look like without this? Be specific and relatable.`,
    after: () => `Show the transformation. What does life look like after? Be vivid and aspirational.`,
    bridge: () => `Connect before → after with the product. This is how you get there. Make the bridge feel inevitable.`,
    // FAB
    features: () => `List 2-3 standout features of ${extractCore(product)}. Be specific — numbers, ingredients, specs.`,
    advantages: () => `Why these features matter vs. alternatives. What do they enable that others can't?`,
    benefits: () => `Translate to real-life impact. How does the user's day/week/life improve?`,
    // Hook-Story-Offer
    hook: () => `3 seconds to stop the scroll. Use pattern interrupt, bold claim, or curiosity gap.`,
    story: () => `Share a micro-story (personal experience, customer story, or demo). Keep it under 20 seconds for short-form.`,
    offer: () => `Present the product + deal. Be crystal clear on what they get and why now.`,
    // 4Ps
    promise: () => `Lead with the #1 promise. What's the single biggest outcome you can guarantee?`,
    picture: () => `Help them visualize success. Use sensory language and specific scenarios.`,
    proof: () => `Back it up. Stats, testimonials, before/after, social proof. Make the promise credible.`,
    push: () => `Final nudge. Urgency, scarcity, or a compelling reason to act right now.`,
    // QUEST
    qualify: () => `Call out your ideal viewer. "If you're a [audience] who [situation], keep watching."`,
    understand: () => `Show empathy. Demonstrate you deeply understand their problem.`,
    educate: () => `Teach something valuable. Position the product as the key insight or tool.`,
    stimulate: () => `Build excitement about the outcome. Create emotional momentum.`,
    transition: () => `Move them from viewer to buyer. Smooth, natural CTA.`,
    // STAR
    situation: () => `Set the scene. What was the situation before the product? Be relatable.`,
    task: () => `What needed to happen? What was the goal or challenge?`,
    result: () => `Show the outcome. Numbers, visuals, emotional payoff.`,
  };

  for (const step of fw.steps) {
    sections[step] = {
      label: step.charAt(0).toUpperCase() + step.slice(1),
      direction: generators[step]?.() || `Write the ${step} section.`,
    };
  }

  return sections;
}

function extractCore(product) {
  return product.split(/[,.\-—]/).map(s => s.trim()).filter(Boolean)[0] || product;
}

function extractPainFromProduct(product) {
  const lower = product.toLowerCase();
  if (lower.includes('email')) return 'low email engagement';
  if (lower.includes('automat')) return 'wasting time on manual tasks';
  if (lower.includes('skin') || lower.includes('beauty')) return 'skin concerns';
  if (lower.includes('protein') || lower.includes('fitness')) return 'not seeing results';
  if (lower.includes('market')) return 'marketing that doesn\'t convert';
  return 'the status quo';
}

function generateDos(platform, tone) {
  const base = [
    'Lead with a hook in the first 3 seconds',
    'Show the product in use (not just talking about it)',
    'Include a clear, single CTA',
    'Keep text overlays readable on mobile',
  ];
  if (platform === 'tiktok') base.push('Film vertically, use trending audio if relevant', 'Start mid-action for native feel');
  if (platform === 'instagram') base.push('First frame must work as a thumbnail', 'Use caption for additional context');
  if (['facebook', 'meta'].includes(platform)) base.push('Design for sound-off viewing (captions/text)', 'Front-load the value proposition');
  if (tone === 'casual') base.push('Use natural language — avoid corporate speak');
  if (tone === 'luxury') base.push('Use whitespace and slow pacing to convey quality');
  return base;
}

function generateDonts(platform) {
  const base = [
    'Don\'t bury the hook — if it starts slow, they\'re gone',
    'Don\'t use more than one CTA',
    'Don\'t make claims you can\'t back up',
    'Don\'t forget mobile-first framing',
  ];
  if (platform === 'tiktok') base.push('Don\'t make it look like an ad — native feel is key');
  if (['facebook', 'meta'].includes(platform)) base.push('Don\'t rely on audio for the primary message');
  return base;
}
