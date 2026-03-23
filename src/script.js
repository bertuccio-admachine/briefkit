import { frameworks } from './frameworks/index.js';
import { generateHooks } from './hooks.js';

const platformTimings = {
  tiktok: { total: 45, hook: 3, body: 30, cta: 7, outro: 5 },
  instagram: { total: 60, hook: 3, body: 40, cta: 10, outro: 7 },
  facebook: { total: 30, hook: 3, body: 18, cta: 5, outro: 4 },
  meta: { total: 30, hook: 3, body: 18, cta: 5, outro: 4 },
  youtube: { total: 30, hook: 5, body: 17, cta: 5, outro: 3 },
  x: { total: 60, hook: 3, body: 40, cta: 10, outro: 7 },
};

export function buildScript({ product, frameworkKey, platform, tone, audience, cta, hooks: hookCount }) {
  const fw = frameworks[frameworkKey];
  const timing = platformTimings[platform] || platformTimings.meta;
  const hookList = generateHooks(product, hookCount, platform);

  const script = {
    title: `UGC Video Script: ${product.slice(0, 60)}${product.length > 60 ? '...' : ''}`,
    meta: {
      framework: `${fw.name} (${fw.full})`,
      platform,
      tone,
      total_duration: `${timing.total}s`,
      audience: audience || 'Inferred from product',
    },
    hook_options: hookList,
    scenes: buildScenes(fw, product, timing, tone, audience, cta, platform),
    production_notes: getProductionNotes(platform, tone),
    b_roll_suggestions: getBRollSuggestions(product),
  };

  return script;
}

function buildScenes(fw, product, timing, tone, audience, cta, platform) {
  const scenes = [];
  const stepCount = fw.steps.length;

  // Distribute time across framework steps
  const hookTime = timing.hook;
  const ctaTime = timing.cta;
  const bodyTime = timing.body;
  const perStep = Math.floor(bodyTime / (stepCount - 1 || 1));

  fw.steps.forEach((step, i) => {
    if (i === 0) {
      scenes.push({
        scene: i + 1,
        label: `${step.toUpperCase()} (Hook)`,
        duration: `0:00–0:0${hookTime}`,
        seconds: hookTime,
        direction: getSceneDirection(step, product, tone, true),
        visual: getVisualDirection(step, platform, true),
        audio: getAudioDirection(step, platform, tone),
        text_overlay: getTextOverlay(step, product),
      });
    } else if (i === stepCount - 1) {
      const start = hookTime + perStep * (i - 1);
      scenes.push({
        scene: i + 1,
        label: `${step.toUpperCase()} + CTA`,
        duration: `${formatTime(start)}–${formatTime(start + perStep + ctaTime)}`,
        seconds: perStep + ctaTime,
        direction: getSceneDirection(step, product, tone, false) + ` End with CTA: ${cta || 'Link in bio / Shop now'}.`,
        visual: getVisualDirection(step, platform, false),
        audio: getAudioDirection(step, platform, tone),
        text_overlay: cta || 'Shop Now →',
      });
    } else {
      const start = hookTime + perStep * (i - 1);
      scenes.push({
        scene: i + 1,
        label: step.toUpperCase(),
        duration: `${formatTime(start)}–${formatTime(start + perStep)}`,
        seconds: perStep,
        direction: getSceneDirection(step, product, tone, false),
        visual: getVisualDirection(step, platform, false),
        audio: getAudioDirection(step, platform, tone),
        text_overlay: getTextOverlay(step, product),
      });
    }
  });

  return scenes;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getSceneDirection(step, product, tone, isHook) {
  const directions = {
    attention: 'Look directly at camera. Deliver the hook with energy and conviction. Break the fourth wall.',
    interest: 'Share a surprising detail or statistic. Lean in, lower your voice slightly — make it feel like insider info.',
    desire: 'Show the product in action. Let the viewer see themselves using it. Paint the outcome.',
    action: 'Direct, clear CTA. Tell them exactly what to do. Make it feel easy and obvious.',
    problem: isHook ? 'Start with the pain. Name it out loud. Show genuine frustration.' : 'Describe the problem in visceral, relatable terms.',
    agitate: 'Make the problem feel urgent. Show the consequences of doing nothing. Build tension.',
    solution: `Reveal the product. Show it solving the problem in real time. Keep the energy positive.`,
    before: 'Show the "before" state authentically. Don\'t overact — keep it real.',
    after: 'Show the transformation. Smile, relax, let the relief show. The contrast should be obvious.',
    bridge: `Hold up the product. This is the bridge between before and after. Make the connection explicit.`,
    features: 'Show 2-3 key features up close. Use your hands, zoom in, demonstrate.',
    advantages: 'Compare to the old way (without naming competitors). Show why this is better.',
    benefits: 'Show the real-life impact. How does this make your day/week/life better?',
    hook: isHook ? 'Maximum energy. Pattern interrupt. You have 3 seconds.' : 'Reinforce the initial hook.',
    story: 'Tell a quick personal story. Keep it authentic — UGC should feel real, not scripted.',
    offer: 'Present the product + any deal/offer. Be clear on what they get.',
    promise: 'Make one bold, specific promise. Own it completely.',
    picture: 'Help them visualize the outcome. Use sensory language.',
    proof: 'Show evidence — screenshots, before/after, numbers, or a testimonial clip.',
    push: 'Final push. Urgency, scarcity, or emotional appeal. Make NOT buying feel like a loss.',
    qualify: isHook ? '"If you\'re a [audience], stop scrolling." Call out your viewer.' : 'Requalify the audience.',
    understand: 'Show deep empathy. "I know what it\'s like to..." Mirror their experience.',
    educate: 'Teach one valuable thing. Position yourself (and the product) as the expert.',
    stimulate: 'Build excitement. Show what\'s possible. Create momentum.',
    transition: 'Smooth pivot to CTA. "Here\'s how to get started..."',
    situation: 'Set the scene naturally. "Last month, I was..." Keep it conversational.',
    task: 'Explain the challenge. What needed to happen? What was at stake?',
    result: 'Show the payoff. Numbers, visuals, genuine excitement about the outcome.',
  };
  return directions[step] || `Deliver the ${step} section authentically.`;
}

function getVisualDirection(step, platform, isHook) {
  if (isHook) return 'Close-up, direct to camera. Good lighting. Immediately engaging.';
  const visuals = {
    attention: 'Close-up, direct to camera',
    interest: 'Medium shot, leaning in',
    desire: 'Product in use, lifestyle context',
    action: 'Product + CTA text overlay',
    problem: 'Frustrated expression, relatable setting',
    agitate: 'Quick cuts showing the pain points',
    solution: 'Product reveal — clean, well-lit hero shot',
    before: 'Authentic "before" state',
    after: 'Bright, transformed "after" state',
    bridge: 'Product hero shot with hands',
    features: 'Close-up product details, macro shots',
    advantages: 'Side-by-side or comparison visual',
    benefits: 'Lifestyle shot showing the benefit in context',
    hook: 'Pattern interrupt visual — unexpected angle or action',
    story: 'Casual, authentic setting (kitchen, desk, gym)',
    offer: 'Product + price/deal graphic',
    proof: 'Screenshots, testimonials, before/after',
    result: 'Celebration moment, positive outcome visual',
  };
  return visuals[step] || 'Clean, well-lit shot relevant to the message';
}

function getAudioDirection(step, platform, tone) {
  if (platform === 'tiktok') return 'Voiceover or talking head. Optional trending audio underneath.';
  if (['facebook', 'meta'].includes(platform)) return 'Design for sound-off. Include captions.';
  return 'Clear voiceover or talking head audio.';
}

function getTextOverlay(step, product) {
  const overlays = {
    attention: 'Hook text — large, bold, readable',
    problem: 'Pain point in 3-5 words',
    solution: 'Product name + key benefit',
    features: 'Feature callouts',
    benefits: 'Key benefit statement',
    proof: 'Social proof stat or quote',
    result: 'Result/outcome metric',
  };
  return overlays[step] || '';
}

function getProductionNotes(platform, tone) {
  const notes = [
    'Film in natural lighting when possible',
    'Use a lapel mic or close microphone for clear audio',
    'Film multiple takes of the hook — it\'s the most important part',
    'Keep hand movements natural and deliberate',
  ];
  if (platform === 'tiktok') {
    notes.push('Film vertically (9:16)');
    notes.push('Keep it raw — overly polished content underperforms on TikTok');
    notes.push('Jump cuts work well for pacing');
  }
  if (['facebook', 'meta'].includes(platform)) {
    notes.push('Add captions — 85% of Facebook video is watched without sound');
    notes.push('1:1 or 4:5 ratio for feed placement');
  }
  if (tone === 'luxury') {
    notes.push('Slower pacing, more whitespace, premium settings');
  }
  return notes;
}

function getBRollSuggestions(product) {
  const lower = product.toLowerCase();
  const suggestions = ['Product unboxing / first reveal', 'Product in use — hands-on demo'];

  if (lower.includes('food') || lower.includes('protein') || lower.includes('supplement'))
    suggestions.push('Mixing/preparing the product', 'Close-up of ingredients/label', 'Post-workout or meal setting');
  if (lower.includes('skin') || lower.includes('beauty') || lower.includes('serum'))
    suggestions.push('Application routine close-up', 'Before/after skin shots', 'Bathroom/vanity setting');
  if (lower.includes('app') || lower.includes('software') || lower.includes('saas') || lower.includes('tool'))
    suggestions.push('Screen recording of key features', 'Dashboard/results screenshots', 'Typing/using the product on device');
  if (lower.includes('fitness') || lower.includes('workout'))
    suggestions.push('Workout footage', 'Progress photos/videos', 'Gym or home workout setting');

  suggestions.push('Lifestyle context shot (where/when you use it)', 'Reaction shot — genuine excitement or satisfaction');
  return suggestions;
}
