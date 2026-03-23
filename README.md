# briefkit

**Generate production-ready UGC creative briefs and ad scripts from the command line.**

No AI API keys needed. No subscriptions. Just instant, framework-driven creative briefs and video scripts that would take a strategist 30-60 minutes to write manually.

```bash
npx briefkit "Organic protein powder, plant-based, 30g per serving"
```

## Why

Brands and agencies spend **$300-500+ per creative brief**. Freelance UGC creators wait days for briefs that are often vague, incomplete, or missing key details. Media buyers need rapid creative iteration but bottleneck on the brief.

**briefkit** fixes this by generating complete, actionable creative briefs and UGC video scripts in seconds — using proven copywriting frameworks that top direct response marketers actually use.

## What You Get

- **Creative briefs** with hooks, framework-guided creative direction, tone guides, dos/don'ts, and platform specs
- **UGC video scripts** with scene-by-scene breakdowns, timing, visual direction, audio notes, and B-roll suggestions
- **Hook variants** generated from battle-tested hook formulas (question, bold claim, story, contrast, urgency, social proof)
- **8 copywriting frameworks** — AIDA, PAS, BAB, FAB, Hook-Story-Offer, 4Ps, QUEST, STAR
- **Platform-optimized** output for TikTok, Instagram, Facebook/Meta, YouTube, and X
- **Multiple tones** — casual, professional, urgent, playful, luxury
- **JSON, Markdown, or plain text** output

## Install

```bash
npm install -g briefkit
```

Or use without installing:

```bash
npx briefkit "your product description"
```

## Quick Start

### Generate a creative brief

```bash
briefkit "AI email automation tool for small businesses"
```

### Generate a UGC video script

```bash
briefkit "Anti-aging serum with retinol" --script --platform tiktok --tone playful
```

### Generate both brief + script

```bash
briefkit "Noise-canceling earbuds for remote workers" --both --audience "remote workers 25-40"
```

### Pick a specific framework

```bash
briefkit "Organic dog treats, grain-free" --framework pas
briefkit "SaaS analytics dashboard" --framework aida --platform x
```

### Get JSON output (pipe to other tools)

```bash
briefkit "Fitness app with AI coaching" --json | jq '.hooks'
```

### Read product description from a file

```bash
briefkit --file product-brief.txt --both --hooks 5
```

### Pipe from stdin

```bash
echo "Premium coffee subscription, single-origin, freshly roasted" | briefkit --script
```

## Frameworks

| Framework | Flow | Best For |
|-----------|------|----------|
| **AIDA** | Attention → Interest → Desire → Action | Cold audiences, awareness |
| **PAS** | Problem → Agitate → Solution | Problem-aware audiences |
| **BAB** | Before → After → Bridge | Lifestyle, transformation |
| **FAB** | Features → Advantages → Benefits | Technical, feature-rich products |
| **Hook-Story-Offer** | Hook → Story → Offer | UGC video ads, social |
| **4Ps** | Promise → Picture → Proof → Push | Conversion campaigns |
| **QUEST** | Qualify → Understand → Educate → Stimulate → Transition | Complex/high-ticket |
| **STAR** | Situation → Task → Action → Result | Testimonials, case studies |

Use `--framework auto` (default) to let briefkit pick the best framework for your platform and content type.

## Options

```
--framework, -f   Copywriting framework (default: auto)
--format, -o      Output format: text, json, markdown (default: markdown)
--platform, -p    Target platform: tiktok, instagram, facebook, youtube, meta, x (default: meta)
--tone, -t        Tone: casual, professional, urgent, playful, luxury (default: casual)
--audience, -a    Target audience description
--cta, -c         Call to action
--hooks, -h       Number of hook variants (default: 3)
--brief           Generate creative brief (default)
--script          Generate UGC video script
--both            Generate both
--file            Read product description from file
--list            List all frameworks
--json            Shortcut for --format json
```

## Programmatic Use

```js
import { generateBrief } from 'briefkit';

const output = generateBrief({
  product: 'AI writing tool for content marketers',
  framework: 'pas',
  platform: 'tiktok',
  tone: 'casual',
  audience: 'content creators',
  hooks: 5,
  mode: 'both',       // 'brief' | 'script' | 'both'
  format: 'json',     // 'markdown' | 'json' | 'text'
});

console.log(output);
```

## Example Output

Running `briefkit "Premium matcha powder, ceremonial grade, organic" --framework bab --platform instagram`:

```
# Creative Brief: Premium matcha powder, ceremonial grade, organic

## Brief Details

| Field | Value |
|-------|-------|
| **framework** | BAB (Before → After → Bridge) |
| **platform** | instagram |
| **tone** | casual — Conversational, friendly, relatable |

## Hook Options (3 variants)

### Hook 1 — bold claim
> I tried 20+ supplements — this is the only one that actually works.

### Hook 2 — story
> 3 months ago, I was choosing the right supplements...

### Hook 3 — contrast
> Before: choosing the right supplements. After: peak performance.

## Creative Direction

### Before
Paint the "before" picture. What does life look like without this? Be specific and relatable.

### After
Show the transformation. What does life look like after? Be vivid and aspirational.

### Bridge
Connect before → after with the product. This is how you get there.

...
```

## Use Cases

- **Brands**: Generate briefs for UGC creators in seconds instead of hours
- **Agencies**: Rapid creative concepting across multiple frameworks
- **UGC creators**: Self-serve brief generation when clients don't provide one
- **Media buyers**: Quick creative iteration for ad testing
- **Freelancers**: Professional brief templates that look agency-quality
- **Content teams**: Consistent, framework-driven creative direction

## Zero Dependencies

briefkit has **no dependencies**. It's a single Node.js package that works offline, runs instantly, and never sends your product data anywhere.

## License

MIT

## Credits

Built by [Ad Machine](https://github.com/admachineio) — open-source marketing tools for the AI era.
