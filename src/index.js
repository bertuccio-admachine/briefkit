import { selectFramework, frameworks } from './frameworks/index.js';
import { buildBrief } from './brief.js';
import { buildScript } from './script.js';
import { formatOutput } from './format.js';

export function generateBrief(opts) {
  const {
    product,
    framework = 'auto',
    format = 'markdown',
    platform = 'meta',
    tone = 'casual',
    audience,
    cta,
    hooks = 3,
    mode = 'brief',
  } = opts;

  // Select framework
  const frameworkKey = framework === 'auto'
    ? selectFramework(platform, mode)
    : framework;

  if (!frameworks[frameworkKey]) {
    throw new Error(`Unknown framework: ${frameworkKey}. Use --list to see available frameworks.`);
  }

  const config = { product, frameworkKey, platform, tone, audience, cta, hooks };

  if (mode === 'both') {
    const brief = buildBrief(config);
    const script = buildScript(config);
    return formatOutput({ brief, script }, format, mode);
  }

  if (mode === 'script') {
    const script = buildScript(config);
    return formatOutput(script, format, mode);
  }

  const brief = buildBrief(config);
  return formatOutput(brief, format, mode);
}

export { frameworks, selectFramework } from './frameworks/index.js';
export { buildBrief } from './brief.js';
export { buildScript } from './script.js';
export { formatOutput } from './format.js';
