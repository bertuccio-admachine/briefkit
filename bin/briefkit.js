#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateBrief } from '../src/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8'));

const help = `
  briefkit v${pkg.version} — Generate UGC creative briefs & ad scripts

  Usage:
    briefkit <product-description> [options]
    briefkit --file product.txt [options]
    echo "my product" | briefkit [options]

  Options:
    --framework, -f   Copywriting framework (default: auto)
                      aida, pas, bab, fab, hook-story-offer, 4ps, quest, star
    --format, -o      Output format: text, json, markdown (default: markdown)
    --platform, -p    Target platform: tiktok, instagram, facebook, youtube, meta, x (default: meta)
    --tone, -t        Tone: casual, professional, urgent, playful, luxury (default: casual)
    --audience, -a    Target audience description
    --cta, -c         Call to action
    --hooks, -h       Number of hook variants to generate (default: 3)
    --brief           Generate full creative brief (default)
    --script          Generate UGC video script instead
    --both            Generate both brief and script
    --file            Read product description from file
    --list            List all available frameworks
    --json            Shortcut for --format json
    --version, -v     Show version
    --help            Show this help

  Examples:
    briefkit "Organic protein powder, 30g per serving, vanilla flavor"
    briefkit "SaaS tool for email automation" --framework pas --platform x
    briefkit --file product.txt --both --audience "busy moms aged 25-40"
    briefkit "AI writing tool" --script --tone playful --hooks 5
    cat brief.txt | briefkit --framework aida --json

  Frameworks:
    aida              Attention → Interest → Desire → Action
    pas               Problem → Agitate → Solution
    bab               Before → After → Bridge
    fab               Features → Advantages → Benefits
    hook-story-offer  Hook → Story → Offer
    4ps               Promise → Picture → Proof → Push
    quest             Qualify → Understand → Educate → Stimulate → Transition
    star              Situation → Task → Action → Result
`;

function parseCliArgs() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      framework: { type: 'string', short: 'f', default: 'auto' },
      format: { type: 'string', short: 'o', default: 'markdown' },
      platform: { type: 'string', short: 'p', default: 'meta' },
      tone: { type: 'string', short: 't', default: 'casual' },
      audience: { type: 'string', short: 'a' },
      cta: { type: 'string', short: 'c' },
      hooks: { type: 'string', short: 'h', default: '3' },
      brief: { type: 'boolean', default: false },
      script: { type: 'boolean', default: false },
      both: { type: 'boolean', default: false },
      file: { type: 'string' },
      list: { type: 'boolean', default: false },
      json: { type: 'boolean', default: false },
      version: { type: 'boolean', short: 'v', default: false },
      help: { type: 'boolean', default: false },
    },
  });
  return { values, positionals };
}

async function readStdin() {
  if (process.stdin.isTTY) return null;
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8').trim();
}

async function main() {
  const { values, positionals } = parseCliArgs();

  if (values.help) { console.log(help); process.exit(0); }
  if (values.version) { console.log(pkg.version); process.exit(0); }
  if (values.list) {
    const { listFrameworks } = await import('../src/frameworks/index.js');
    console.log(listFrameworks());
    process.exit(0);
  }

  // Get product description from positional, file, or stdin
  let product = positionals.join(' ');
  if (values.file) {
    product = readFileSync(resolve(values.file), 'utf8').trim();
  }
  if (!product) {
    product = await readStdin();
  }
  if (!product) {
    console.error('Error: No product description provided.\n');
    console.error('Usage: briefkit "your product description" [options]');
    console.error('       briefkit --help for more info');
    process.exit(1);
  }

  const format = values.json ? 'json' : values.format;
  const mode = values.both ? 'both' : values.script ? 'script' : 'brief';

  const result = generateBrief({
    product,
    framework: values.framework,
    format,
    platform: values.platform,
    tone: values.tone,
    audience: values.audience,
    cta: values.cta,
    hooks: parseInt(values.hooks, 10),
    mode,
  });

  console.log(result);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
