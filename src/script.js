/**
 * script.js — World-class viral UGC script engine
 * Built on proven direct response and platform-native principles
 */

import { frameworks } from './frameworks/index.js';
import { buildViralHooks } from './hooks.js';

// Platform-specific configs
const PLATFORM_CONFIGS = {
  tiktok:    { total: 30, format: '9:16 vertical', sound: 'Sound-on optimized. Trending audio optional under voiceover.', captionNote: 'Captions recommended — auto-generated or manual' },
  instagram: { total: 30, format: '9:16 (Reels) or 4:5 (Feed)', sound: 'Sound-on AND sound-off ready. Captions mandatory.', captionNote: 'First caption line must work as standalone hook' },
  facebook:  { total: 30, format: '1:1 or 4:5', sound: '85% watched without sound. Design for sound-off FIRST.', captionNote: 'Captions burned in or auto-generated — non-negotiable' },
  meta:      { total: 30, format: '1:1 or 4:5', sound: '85% watched without sound. Design for sound-off FIRST.', captionNote: 'Captions burned in or auto-generated — non-negotiable' },
  youtube:   { total: 60, format: '16:9', sound: 'Sound-on. Hook must survive a preroll skip.', captionNote: 'Captions for accessibility and SEO' },
  x:         { total: 30, format: '16:9 or 1:1', sound: 'Often muted. Strong visual + text overlay required.', captionNote: 'Text on screen carries the message' },
};

export function buildScript({ product, frameworkKey, platform, tone, audience, cta, hooks: hookCount, icp }) {
  const fw = frameworks[frameworkKey];
  const config = PLATFORM_CONFIGS[platform] || PLATFORM_CONFIGS.meta;
  const hookData = buildViralHooks(product, hookCount || 6, platform, icp);
  const scenes = buildViralScenes(product, platform, tone, audience, cta, icp, fw);
  const viralMultipliers = buildViralMultipliers(product, platform, icp);
  const productionChecklist = buildProductionChecklist(product, platform, tone);

  return {
    title: `UGC Video Script: ${product.slice(0, 60)}${product.length > 60 ? '...' : ''}`,
    meta: {
      framework: `${fw.name} (${fw.full})`,
      platform,
      tone,
      format: config.format,
      total_duration: `${config.total}s`,
      audience: audience || (icp ? icp.demographics.split('.')[0] : 'Inferred from product'),
      sound_design: config.sound,
    },
    hook_analysis: hookData,
    scenes,
    viral_multipliers: viralMultipliers,
    production_checklist: productionChecklist,
  };
}

function buildViralScenes(product, platform, tone, audience, cta, icp, fw) {
  const config = PLATFORM_CONFIGS[platform] || PLATFORM_CONFIGS.meta;
  const pain = icp?.corePain || inferPain(product);
  const outcome = icp?.desiredOutcome || inferOutcome(product);
  const productName = inferProductName(product);
  const ctaText = cta || inferCTA(product, platform);
  const proofStat = inferProofStat(product, icp);

  return [
    {
      scene: 1,
      label: 'HOOK',
      timing: '0:00 – 0:03',
      words: '~10 words',
      purpose: 'Stop the scroll. Make them physically unable to swipe away.',
      script: inferHookScript(product, pain, icp),
      visual: 'Direct to camera. Tight frame. Eyes locked. Exceptional lighting. First frame must look incredible as a still — this IS the thumbnail.',
      text_overlay: inferHookOverlay(product, pain),
      audio: platform === 'tiktok'
        ? 'High energy. Trending audio at low volume under voice. Or: dead silence followed by sharp word.'
        : 'Sound-off first. The text overlay carries this scene if audio is off.',
      director_note: 'Deliver this like you\'re telling a secret to your best friend that will change their life. Zero hesitation. Maximum conviction. Film 5+ takes.',
    },
    {
      scene: 2,
      label: 'AGITATE',
      timing: '0:03 – 0:08',
      words: '~20 words',
      purpose: 'Twist the knife on the pain. Make them feel seen. Build tension.',
      script: inferAgitateScript(product, pain, icp),
      visual: 'Slight lean forward. Expression shifts — you\'re about to reveal something. Cut or zoom in slightly from Scene 1.',
      text_overlay: extractPainPhrase(pain),
      audio: 'Slightly lower energy. Build the tension. Let the discomfort breathe for a half-second.',
      director_note: 'This scene should make the viewer think "oh my god, this person IS me." That\'s the goal. Be specific — generic pain doesn\'t stop scrolls. Specific pain does.',
    },
    {
      scene: 3,
      label: 'REVEAL',
      timing: '0:08 – 0:15',
      words: '~30 words',
      purpose: 'Introduce the product as the hero. Show, don\'t just tell.',
      script: inferRevealScript(product, productName, outcome),
      visual: `SHOW THE PRODUCT. Hold it up, open the app, demonstrate the mechanism. One clear, confident product interaction. No rambling — let the visual do the talking. Clean background or natural lifestyle context.`,
      text_overlay: `${productName} — ${inferOneLiner(product, outcome)}`,
      audio: 'Energy picks back up. Upbeat. Relief enters the voice. The solution has arrived.',
      director_note: `This is the money shot. Whatever ${productName} does best — show it happening RIGHT NOW in this scene. If it's software: screen record the key feature. If it's physical: hands-on demonstration. The viewer should be able to understand the product with the sound off.`,
    },
    {
      scene: 4,
      label: 'PROOF',
      timing: '0:15 – 0:22',
      words: '~25 words',
      purpose: 'Make them believe it. Kill the skepticism before the objection forms.',
      script: inferProofScript(product, proofStat, icp),
      visual: `${proofStat.visual}. Then cut back to you — genuine reaction. "And I'm not the only one."`,
      text_overlay: proofStat.overlay,
      audio: 'Conversational, credible. Not salesy. This should feel like a friend giving you a real recommendation.',
      director_note: `Lead with the number or specific result — vague proof doesn\'t convert. "${proofStat.stat}" is infinitely more powerful than "it really works." If you have a real screenshot or data — USE IT. Real beats polished every time.`,
    },
    {
      scene: 5,
      label: 'CTA',
      timing: '0:22 – 0:30',
      words: '~15 words',
      purpose: 'One action. Remove all friction. Create urgency without desperation.',
      script: inferCTAScript(ctaText, product, platform, icp),
      visual: `Direct to camera. Confident smile. Product visible. End on a clean, still frame — the last frame will display as the end card.`,
      text_overlay: `${ctaText} →`,
      audio: 'Clear, calm confidence. Not a shout, not a whisper. This is someone who KNOWS this will help you.',
      director_note: `One CTA only. Make the action feel EASY — remove every possible friction word. Instead of "go to our website and check out our products", say "${ctaText}". The goal is zero mental effort between watching and acting.`,
    },
  ];
}

function buildViralMultipliers(product, platform, icp) {
  const productName = inferProductName(product);
  const pain = icp?.corePain || inferPain(product);
  const objection = icp?.topObjection || 'Does this actually work?';

  return {
    hook_to_hold_tip: inferHookToHoldTip(product, platform),
    comment_bait: inferCommentBait(product, pain, icp),
    share_trigger: inferShareTrigger(product, icp),
    rewatch_hook: inferRewatchHook(product, productName),
    platform_tweaks: {
      tiktok: `Start mid-sentence — no intro. Use a trending sound at 15% volume under voice. Add text on screen from frame 1. Hook must land in 1.5s not 3s on TikTok. End with a cliffhanger that drives comment replies.`,
      instagram: `First frame is the thumbnail — make it visually stunning. Add a strong first caption line (shows above the fold). Reels get pushed hard if it gets early saves — include something worth saving (tip, stat, list).`,
      facebook: `Lead with the text overlay — most Facebook users are sound-off in feed. Use the first 2 seconds to demonstrate the problem visually. Social proof numbers perform significantly better here than on other platforms.`,
      youtube: `If pre-roll: assume they're about to skip. Hook needs to survive a 5-second button-spam. State a specific benefit in the first 3 words. End screen with subscribe + next video.`,
    },
  };
}

function buildProductionChecklist(product, platform, tone) {
  const config = PLATFORM_CONFIGS[platform] || PLATFORM_CONFIGS.meta;
  const productName = inferProductName(product);

  return {
    first_frame: inferFirstFrame(product, platform),
    caption_openers: {
      tiktok: `POV: you just found the ${inferProductType(product)} that actually works`,
      instagram: `I tested this so you don't have to — here's what happened →`,
      facebook: `I was skeptical. Then I tried ${productName}. Here's the honest truth:`,
      youtube: `I spent 30 days using ${productName}. Here's my unfiltered honest review:`,
    },
    hashtag_strategy: inferHashtags(product, platform),
    optimal_posting: {
      tiktok: 'Tue–Thu, 7–9am or 7–9pm local time. Avoid weekend mornings.',
      instagram: 'Mon/Wed/Fri, 6–8am or 11am–1pm. Tuesday 9am is the power slot.',
      facebook: 'Wed–Fri, 1–4pm. Thursday 1–2pm historically highest engagement.',
      youtube: 'Thu–Sat, 2–4pm local time. Friday 5pm is the sweet spot.',
    },
    sound_design: config.sound,
    caption_note: config.captionNote,
    filming_tips: [
      'Film the hook 10+ times — you need options. The hook makes or breaks this.',
      'Use a ring light or natural window light. Lighting is the #1 production quality signal.',
      'Stabilize the shot — shaky hand-held in Scene 3 (reveal) kills credibility.',
      'Record audio clean — use a lapel mic or get within 18 inches of the phone mic.',
      'Wear solid colors — patterns are distracting on small mobile screens.',
    ],
  };
}

// ─────────────────────────────────────────────
// Inference helpers — context-aware script copy
// ─────────────────────────────────────────────

function inferProductName(product) {
  // Try to find a proper noun (capitalized word not at start of sentence)
  const camelWords = product.match(/\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*/g);
  if (camelWords && camelWords[0]) return camelWords[0];
  return product.split(/[,.\-—\n]/).map(s => s.trim())[0]?.split(' ').slice(0, 2).join(' ') || 'this product';
}

function inferProductType(product) {
  const lower = product.toLowerCase();
  if (lower.match(/\b(app|platform|tool|software|ide|dashboard)\b/)) return 'tool';
  if (lower.match(/\b(serum|cream|moisturizer|cleanser)\b/)) return 'skincare product';
  if (lower.match(/\b(protein|supplement|vitamin)\b/)) return 'supplement';
  if (lower.match(/\b(course|program|training)\b/)) return 'program';
  return 'product';
}

function inferPain(product) {
  const lower = product.toLowerCase();
  if (lower.includes('code') || lower.includes('deploy') || lower.includes('develop')) return 'wasting hours setting up environments instead of actually building';
  if (lower.includes('email') || lower.includes('marketing')) return 'running campaigns that don\'t convert despite all the effort';
  if (lower.includes('skin') || lower.includes('beauty')) return 'spending money on products that promise results and deliver nothing';
  if (lower.includes('protein') || lower.includes('supplement')) return 'not seeing results despite showing up to train every day';
  if (lower.includes('fitness') || lower.includes('workout')) return 'hitting a plateau that no amount of effort seems to break';
  if (lower.includes('learn') || lower.includes('course')) return 'spending hours learning and ending up with zero practical skills';
  return 'spending time and money on a problem that never actually gets solved';
}

function inferOutcome(product) {
  const lower = product.toLowerCase();
  if (lower.includes('code') || lower.includes('deploy')) return 'go from idea to deployed product in minutes';
  if (lower.includes('email') || lower.includes('marketing')) return 'campaigns that actually convert while you sleep';
  if (lower.includes('skin') || lower.includes('beauty')) return 'the kind of skin people stop and ask you about';
  if (lower.includes('protein') || lower.includes('supplement')) return 'the progress you\'ve been training for, finally showing';
  if (lower.includes('fitness') || lower.includes('workout')) return 'break through the plateau and see visible progress again';
  return 'the result you\'ve been trying to get, without the usual headaches';
}

function inferHookScript(product, pain, icp) {
  const productName = inferProductName(product);
  const lower = product.toLowerCase();

  if (lower.includes('code') || lower.includes('developer') || lower.includes('replit')) {
    return `"I haven't set up a local environment in 6 months. Let me show you why."`;
  }
  if (lower.includes('skin') || lower.includes('serum')) {
    return `"I spent $400 on skincare this year before I found this. Here's what I wish someone told me."`;
  }
  if (lower.includes('protein') || lower.includes('supplement')) {
    return `"The supplement I almost didn't try — that actually changed my results."`;
  }
  if (lower.includes('market') || lower.includes('email')) {
    return `"My last campaign hit 31% open rate. No list-building tricks. Here's the actual reason."`;
  }

  const icpHook = icp ? `"If you're ${icp.demographics.split(',')[0].toLowerCase()} and you're still ${extractPainPhrase(icp.corePain).toLowerCase()}, watch this."` : null;
  return icpHook || `"The ${inferProductType(product)} I wish I'd found 2 years earlier."`;
}

function inferHookOverlay(product, pain) {
  const lower = product.toLowerCase();
  if (lower.includes('code') || lower.includes('replit')) return 'NO setup. NO install. Just code.';
  if (lower.includes('skin')) return 'The skincare thing I wish I knew sooner';
  if (lower.includes('protein')) return 'The supplement that actually worked';
  if (lower.includes('market')) return 'Why my campaigns finally started converting';
  return 'I wish someone told me this sooner';
}

function inferAgitateScript(product, pain, icp) {
  const specificPain = icp?.corePain || pain;
  const lower = product.toLowerCase();

  if (lower.includes('code') || lower.includes('replit') || lower.includes('developer')) {
    return `"You know that feeling when you spend 3 hours on environment setup before writing a single line of code? The Homebrew errors. The conflicting Node versions. The Docker config that worked yesterday and doesn't today. I used to lose entire afternoons to this."`;
  }
  if (lower.includes('skin')) {
    return `"You've bought the serums. You've done the routines. You've watched the tutorials. And your skin still doesn't look like the 'after' photo. You start to wonder if it's just you."`;
  }
  if (lower.includes('protein') || lower.includes('supplement')) {
    return `"You're training consistently. You're eating right. You're doing everything you're 'supposed' to do. And the results still aren't there. That's the most demoralizing feeling in fitness."`;
  }

  // Generic but personalized to ICP
  return `"You've tried the obvious solutions. You've put in the work. And it's still not clicking. That's not a motivation problem — it's a ${inferProductType(product)} problem. There's a better way."`;
}

function inferRevealScript(product, productName, outcome) {
  const lower = product.toLowerCase();

  if (lower.includes('replit') || lower.includes('browser') || lower.includes('cloud ide')) {
    return `"Then I found Replit. Browser tab open. Language selected. Running code in 10 seconds. No Homebrew. No config. Just... a working environment, instantly. I deployed my first project from it an hour later."`;
  }
  if (lower.includes('skin') || lower.includes('serum')) {
    return `"Then I found ${productName}. I was skeptical — I'd been disappointed before. But 3 weeks in, my skin genuinely looked different. Not 'if you squint' different. Actually different."`;
  }
  if (lower.includes('protein') || lower.includes('supplement')) {
    return `"I added ${productName} for 6 weeks. Same training. Same diet. The results that weren't coming before — started coming. My coach noticed before I said anything."`;
  }

  return `"Then I started using ${productName}. The thing I'd been trying to achieve — ${outcome.toLowerCase()} — actually started happening. Not someday. Within weeks."`;
}

function inferProofStat(product, icp) {
  const lower = product.toLowerCase();

  if (lower.includes('replit') || lower.includes('developer')) {
    return {
      stat: '30 million developers',
      visual: 'Screen recording: Replit.com showing community numbers / a project running live in browser',
      overlay: '30M developers. 50+ languages. 0 setup.',
    };
  }
  if (lower.includes('skin') || lower.includes('serum')) {
    return {
      stat: '94% saw visible improvement in 28 days',
      visual: 'Quick B-roll of before/after or product close-up with ingredient callout',
      overlay: '94% saw results in 28 days',
    };
  }
  if (lower.includes('protein') || lower.includes('supplement')) {
    return {
      stat: '4.8 stars across 10,000+ reviews',
      visual: 'Flash of reviews screenshot or product label with certifications',
      overlay: '10,000+ reviews ⭐⭐⭐⭐⭐',
    };
  }
  if (lower.includes('market') || lower.includes('email')) {
    return {
      stat: '31% average open rate, 3x industry standard',
      visual: 'Screen recording of dashboard/analytics',
      overlay: '3x industry average results',
    };
  }

  return {
    stat: 'thousands of customers reporting real results',
    visual: 'Testimonial screenshot or product review flash',
    overlay: 'Real results. Real people.',
  };
}

function inferProofScript(product, proofStat, icp) {
  return `"And it's not just me. ${proofStat.stat}. When ${icp ? icp.demographics.split(',')[0].toLowerCase() + 's' : 'people'} who were exactly where you are start seeing results like this — that's when you know it's not luck."`;
}

function inferCTAScript(cta, product, platform, icp) {
  const lower = product.toLowerCase();
  const urgencyLine = lower.includes('free') ? 'It\'s free to start.' : lower.includes('trial') ? 'Free trial — no credit card.' : 'Link is right below.';

  if (lower.includes('replit')) {
    return `"Go to replit.com. Open a tab. Start coding. No download, no setup, no excuse. ${urgencyLine}"`;
  }

  return `"${cta}. ${urgencyLine} You've been dealing with ${inferPain(product).split(' ').slice(0, 5).join(' ')} long enough."`;
}

function inferOneLiner(product, outcome) {
  return outcome.split('.')[0].slice(0, 60);
}

function extractPainPhrase(pain) {
  // Extract a short version for overlays
  return pain.split(' ').slice(0, 6).join(' ') + '...';
}

function inferHookToHoldTip(product, platform) {
  const lower = product.toLowerCase();
  if (lower.includes('code') || lower.includes('developer')) {
    return 'Cut to a screen recording of Replit working instantly right after the hook. Developers are "show me" people — the fastest way to earn their 3 more seconds is to show the product working before you finish explaining it.';
  }
  if (lower.includes('skin') || lower.includes('beauty')) {
    return 'Show your actual skin close-up in the hook (no filter, slightly imperfect). Authenticity is the pattern interrupt in a sea of filtered beauty content. Then cut to after — the contrast does the work.';
  }
  return `Cut immediately to the most impressive visual you have of the product after the hook line. Don't talk about it first — show it. On ${platform}, you have about 1.5 more seconds before the next swipe decision.`;
}

function inferCommentBait(product, pain, icp) {
  const lower = product.toLowerCase();
  if (lower.includes('code') || lower.includes('replit')) {
    return `"Local dev is dead. Fight me." — This will get developers to defend their setup in the comments. Every comment extends reach.`;
  }
  if (lower.includes('skin') || lower.includes('beauty')) {
    return `"If your skincare routine is more than 3 steps, you're wasting money." — Controversial but defensible. Beauty community debates = algorithm gold.`;
  }
  if (lower.includes('supplement') || lower.includes('protein')) {
    return `"Most gym supplements are a scam. Here are the only ones that have actual science behind them." — Will generate both agreement (saves) and debate (comments).`;
  }
  return `Ask a direct question at the end of the video: "Drop your biggest [pain point] in the comments — I'll reply to every single one." Genuine engagement bait that also shows you care.`;
}

function inferShareTrigger(product, icp) {
  const group = icp ? icp.demographics.split(',')[0].toLowerCase() : 'someone who would benefit from this';
  return `The "I know someone who needs this" impulse. Shares happen when viewers think of a specific friend who has the exact pain you described. Be specific enough about the pain that it maps to a real person in their life. The more niche the pain, the more shareable — "this is SO [friend's name]" is the viral mechanism.`;
}

function inferRewatchHook(product, productName) {
  return `Plant a specific number or claim in Scene 4 without fully explaining it (e.g., "the one feature that took me 3 tries to fully understand..."). Don't pay it off in the video — this creates unresolved curiosity that drives rewatches and comment questions. Rewatches signal quality to the algorithm.`;
}

function inferFirstFrame(product, platform) {
  const lower = product.toLowerCase();
  if (lower.includes('code') || lower.includes('replit')) {
    return 'Close-up of a terminal or IDE with code running. OR: your face, wide-eyed, looking at a screen. The "you won\'t believe what this just did" expression.';
  }
  if (lower.includes('skin') || lower.includes('beauty')) {
    return 'Your face, no filter, good light, genuine expression. A slight imperfection makes it MORE trustworthy on beauty content — it signals authenticity.';
  }
  if (lower.includes('supplement') || lower.includes('protein')) {
    return 'Hold the product at eye level, slightly below camera. You\'re looking slightly up at the viewer. Confident expression. Clean background.';
  }
  return `Direct to camera, tight frame, excellent lighting. Expression: you're about to tell them something that will change their approach to ${inferProductType(product)}. The still frame before play should make them curious.`;
}

function inferHashtags(product, platform) {
  const lower = product.toLowerCase();
  const base = [];

  if (lower.includes('code') || lower.includes('developer') || lower.includes('replit')) {
    base.push('#devtok', '#coding', '#developer', '#buildinpublic', '#indiedev');
  } else if (lower.includes('skin') || lower.includes('beauty')) {
    base.push('#skincare', '#skintok', '#beautyreview', '#skincareroutine', '#glassskin');
  } else if (lower.includes('protein') || lower.includes('supplement')) {
    base.push('#gymmotivation', '#supplements', '#fittok', '#proteinshake', '#gymlife');
  } else if (lower.includes('market') || lower.includes('email')) {
    base.push('#marketing', '#digitalmarketing', '#emailmarketing', '#growthhacking', '#marketingtips');
  } else {
    base.push('#productreview', '#musthave', '#gamechanger', '#review', '#recommended');
  }

  return {
    hashtags: base.slice(0, 5),
    strategy: `Use 3-5 highly specific hashtags over 20+ generic ones. ${platform === 'tiktok' ? 'On TikTok, hashtags primarily help with topic classification — focus on niche tags where your ICP actually browses.' : platform === 'instagram' ? 'On Instagram, mix 1 branded + 2 niche + 2 broad. Niche hashtags punch above their weight for discovery.' : 'Lead with your best performing hashtags — algorithm reads first 2-3 as primary signals.'}`,
  };
}

function inferCTA(product, platform) {
  const lower = product.toLowerCase();
  if (lower.includes('replit') || lower.includes('code')) return 'Start free at replit.com';
  if (lower.includes('free trial') || lower.includes('free tier')) return 'Try it free — link below';
  if (lower.includes('course') || lower.includes('program')) return 'Enroll now — link in bio';
  if (lower.includes('shop') || lower.includes('store')) return 'Shop now — link below';
  return 'Link in bio — try it now';
}
