import { selectFramework, frameworks } from './frameworks/index.js';
import { buildBrief } from './brief.js';
import { buildScript } from './script.js';
import { formatOutput } from './format.js';
import { generateICP } from './icp.js';
import { fetchProductContext, isUrl } from './fetch.js';

export async function generateBrief(opts) {
  let {
    product,
    framework = 'auto',
    format = 'markdown',
    platform = 'meta',
    tone = 'casual',
    audience,
    cta,
    hooks = 6,
    mode = 'brief',
  } = opts;

  // ── URL resolution ──────────────────────────────────────────────
  let urlContext = null;
  if (isUrl(product)) {
    urlContext = await fetchProductContext(product);
    // Use a clean product description — title + description only (not the full dump)
    product = [
      urlContext.title,
      urlContext.description,
    ].filter(Boolean).join('. ');
  }

  // ── ICP generation ──────────────────────────────────────────────
  const icp = generateICP(product, audience || null);

  // ── Framework selection ─────────────────────────────────────────
  const frameworkKey = framework === 'auto'
    ? selectFramework(platform, mode)
    : framework;

  if (!frameworks[frameworkKey]) {
    throw new Error(`Unknown framework: ${frameworkKey}. Use --list to see available frameworks.`);
  }

  const config = { product, frameworkKey, platform, tone, audience, cta, hooks, icp };

  if (mode === 'both') {
    const brief = buildBrief(config);
    const script = buildScript(config);
    return formatOutput({ brief, script, icp, urlContext }, format, mode);
  }

  if (mode === 'script') {
    const script = buildScript(config);
    return formatOutput({ script, icp, urlContext }, format, mode);
  }

  const brief = buildBrief(config);
  return formatOutput({ brief, icp, urlContext }, format, mode);
}

export { frameworks, selectFramework } from './frameworks/index.js';
export { buildBrief } from './brief.js';
export { buildScript } from './script.js';
export { formatOutput } from './format.js';
export { generateICP, formatICP } from './icp.js';
export { fetchProductContext, isUrl } from './fetch.js';
