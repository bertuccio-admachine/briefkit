import { generateBrief } from '../src/index.js';

const tests = [
  {
    name: 'Basic brief generation',
    opts: { product: 'Organic protein powder, 30g per serving, vanilla flavor, plant-based' },
  },
  {
    name: 'Script mode with platform',
    opts: { product: 'AI email automation SaaS tool for small businesses', mode: 'script', platform: 'tiktok', tone: 'playful' },
  },
  {
    name: 'Both mode with audience',
    opts: { product: 'Anti-aging serum with retinol and vitamin C', mode: 'both', audience: 'women 30-50', framework: 'bab' },
  },
  {
    name: 'JSON output',
    opts: { product: 'Noise-canceling earbuds for remote workers', format: 'json', framework: 'pas' },
  },
  {
    name: 'All frameworks work',
    frameworks: ['aida', 'pas', 'bab', 'fab', 'hook-story-offer', '4ps', 'quest', 'star'],
  },
];

let passed = 0;
let failed = 0;

for (const test of tests) {
  try {
    if (test.frameworks) {
      for (const fw of test.frameworks) {
        const result = generateBrief({ product: 'Test product', framework: fw });
        if (!result || result.length < 100) throw new Error(`Framework ${fw} produced insufficient output`);
      }
      console.log(`✅ ${test.name}`);
    } else {
      const result = generateBrief(test.opts);
      if (!result || result.length < 50) throw new Error('Output too short');
      if (test.opts.format === 'json') JSON.parse(result); // Validate JSON
      console.log(`✅ ${test.name}`);
    }
    passed++;
  } catch (err) {
    console.log(`❌ ${test.name}: ${err.message}`);
    failed++;
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
