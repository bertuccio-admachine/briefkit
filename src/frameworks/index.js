export const frameworks = {
  aida: {
    name: 'AIDA',
    full: 'Attention → Interest → Desire → Action',
    description: 'Classic direct response framework. Best for cold audiences and awareness campaigns.',
    steps: ['attention', 'interest', 'desire', 'action'],
    bestFor: ['facebook', 'meta', 'instagram', 'youtube'],
  },
  pas: {
    name: 'PAS',
    full: 'Problem → Agitate → Solution',
    description: 'Pain-first framework. Best for problem-aware audiences.',
    steps: ['problem', 'agitate', 'solution'],
    bestFor: ['facebook', 'meta', 'x', 'youtube'],
  },
  bab: {
    name: 'BAB',
    full: 'Before → After → Bridge',
    description: 'Transformation framework. Best for lifestyle and aspirational products.',
    steps: ['before', 'after', 'bridge'],
    bestFor: ['tiktok', 'instagram', 'facebook', 'meta'],
  },
  fab: {
    name: 'FAB',
    full: 'Features → Advantages → Benefits',
    description: 'Product-centric framework. Best for technical or feature-rich products.',
    steps: ['features', 'advantages', 'benefits'],
    bestFor: ['youtube', 'x', 'facebook', 'meta'],
  },
  'hook-story-offer': {
    name: 'Hook-Story-Offer',
    full: 'Hook → Story → Offer',
    description: 'Narrative framework. Best for UGC-style video ads and social content.',
    steps: ['hook', 'story', 'offer'],
    bestFor: ['tiktok', 'instagram', 'youtube'],
  },
  '4ps': {
    name: '4Ps',
    full: 'Promise → Picture → Proof → Push',
    description: 'Persuasion framework. Best for conversion-focused campaigns.',
    steps: ['promise', 'picture', 'proof', 'push'],
    bestFor: ['facebook', 'meta', 'youtube'],
  },
  quest: {
    name: 'QUEST',
    full: 'Qualify → Understand → Educate → Stimulate → Transition',
    description: 'Educational framework. Best for complex or high-ticket products.',
    steps: ['qualify', 'understand', 'educate', 'stimulate', 'transition'],
    bestFor: ['youtube', 'facebook', 'meta'],
  },
  star: {
    name: 'STAR',
    full: 'Situation → Task → Action → Result',
    description: 'Testimonial framework. Best for case studies and social proof.',
    steps: ['situation', 'task', 'action', 'result'],
    bestFor: ['tiktok', 'instagram', 'youtube'],
  },
};

export function selectFramework(platform, mode) {
  // Score frameworks by platform match
  const scored = Object.entries(frameworks).map(([key, fw]) => {
    let score = 0;
    if (fw.bestFor.includes(platform)) score += 2;
    if (mode === 'script' && ['hook-story-offer', 'bab', 'star', 'pas'].includes(key)) score += 1;
    if (mode === 'brief' && ['aida', 'pas', '4ps', 'fab'].includes(key)) score += 1;
    return { key, score };
  });
  scored.sort((a, b) => b.score - a.score);
  // Pick from top 3 randomly for variety
  const top = scored.slice(0, 3);
  return top[Math.floor(Math.random() * top.length)].key;
}

export function listFrameworks() {
  const lines = ['Available Copywriting Frameworks:', ''];
  for (const [key, fw] of Object.entries(frameworks)) {
    lines.push(`  ${key.padEnd(20)} ${fw.full}`);
    lines.push(`  ${''.padEnd(20)} ${fw.description}`);
    lines.push(`  ${''.padEnd(20)} Best for: ${fw.bestFor.join(', ')}`);
    lines.push('');
  }
  return lines.join('\n');
}
