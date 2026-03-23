/**
 * format.js — Output formatters: markdown, text, json
 * Handles new structure: urlContext, icp, viral_multipliers, production_checklist
 */

import { formatICP } from './icp.js';

export function formatOutput(data, format, mode) {
  if (format === 'json') return JSON.stringify(data, null, 2);
  if (format === 'text') return formatText(data, mode);
  return formatMarkdown(data, mode);
}

function formatMarkdown(data, mode) {
  const parts = [];

  // URL context header
  if (data.urlContext) {
    parts.push(formatURLContext(data.urlContext));
    parts.push('---\n');
  }

  // ICP section (always first)
  if (data.icp) {
    parts.push(formatICP(data.icp));
    parts.push('---\n');
  }

  if (mode === 'both') {
    parts.push(formatMarkdownBrief(data.brief));
    parts.push('\n---\n');
    parts.push(formatMarkdownScript(data.script));
    return parts.join('\n');
  }
  if (mode === 'script') {
    parts.push(formatMarkdownScript(data.script || data));
    return parts.join('\n');
  }

  parts.push(formatMarkdownBrief(data.brief || data));
  return parts.join('\n');
}

function formatURLContext(ctx) {
  const lines = [];
  lines.push(`## 🌐 Product Context (from ${ctx.url})\n`);
  if (ctx.extracted.title) lines.push(`**Title:** ${ctx.extracted.title}`);
  if (ctx.extracted.description) lines.push(`**Description:** ${ctx.extracted.description}`);
  if (ctx.extracted.h1 && ctx.extracted.h1 !== ctx.extracted.title) lines.push(`**Headline:** ${ctx.extracted.h1}`);
  if (ctx.extracted.bodyText) lines.push(`\n**Extracted copy:**\n> ${ctx.extracted.bodyText.slice(0, 300)}...`);
  lines.push('');
  return lines.join('\n');
}

function formatMarkdownBrief(b) {
  const lines = [];
  lines.push(`# ${b.title}\n`);

  // Meta
  lines.push('## Brief Details\n');
  lines.push(`| Field | Value |`);
  lines.push(`|-------|-------|`);
  for (const [k, v] of Object.entries(b.meta)) {
    lines.push(`| **${k.replace(/_/g, ' ')}** | ${v} |`);
  }
  lines.push('');

  // Product
  lines.push(`## Product\n`);
  lines.push(`${b.product_summary}\n`);

  // Hooks
  lines.push(`## Hook Options (${b.hooks.length} variants)\n`);
  b.hooks.forEach((h, i) => {
    lines.push(`### Hook ${i + 1} — ${h.category}`);
    lines.push(`> ${h.hook}\n`);
    lines.push(`Platform fit: ${h.platform_fit}\n`);
  });

  // Framework sections
  lines.push(`## Creative Direction\n`);
  for (const [key, section] of Object.entries(b.framework_sections)) {
    lines.push(`### ${section.label}`);
    lines.push(`${section.direction}\n`);
  }

  // CTA
  lines.push(`## Call to Action\n`);
  lines.push(`**${b.cta}**\n`);

  // Tone
  lines.push(`## Tone Guide\n`);
  lines.push(`- **Voice:** ${b.tone_guide.voice}`);
  lines.push(`- **Power words:** ${b.tone_guide.power_words}\n`);

  // Do/Don't
  lines.push(`## ✅ Do\n`);
  b.do_list.forEach(d => lines.push(`- ${d}`));
  lines.push('');
  lines.push(`## ❌ Don't\n`);
  b.dont_list.forEach(d => lines.push(`- ${d}`));

  return lines.join('\n');
}

function formatMarkdownScript(s) {
  const lines = [];
  lines.push(`# ${s.title}\n`);

  // Meta
  lines.push('## Script Details\n');
  lines.push(`| Field | Value |`);
  lines.push(`|-------|-------|`);
  for (const [k, v] of Object.entries(s.meta)) {
    lines.push(`| **${k.replace(/_/g, ' ')}** | ${v} |`);
  }
  lines.push('');

  // Hook Analysis
  lines.push(`## 🎣 Hook Analysis (${s.hook_analysis.count} variants scored)\n`);
  s.hook_analysis.hooks.forEach((h, i) => {
    const sc = h.scores;
    lines.push(`### ${i + 1}. ${h.type.replace(/\b\w/g, c => c.toUpperCase())} Hook`);
    lines.push(`> ${h.hook}\n`);
    lines.push(`| Dimension | Score |`);
    lines.push(`|-----------|-------|`);
    lines.push(`| Pattern Interrupt | ${'★'.repeat(sc.pattern_interrupt)}${'☆'.repeat(5 - sc.pattern_interrupt)} |`);
    lines.push(`| Emotional Resonance | ${'★'.repeat(sc.emotional_resonance)}${'☆'.repeat(5 - sc.emotional_resonance)} |`);
    lines.push(`| Specificity | ${'★'.repeat(sc.specificity)}${'☆'.repeat(5 - sc.specificity)} |`);
    lines.push(`| Scroll-Stop Power | ${'★'.repeat(sc.scroll_stop_power)}${'☆'.repeat(5 - sc.scroll_stop_power)} |`);
    lines.push(`| **Total** | **${sc.total}/20** |`);
    lines.push('');
  });

  lines.push(`### 🏆 Recommended Hook\n`);
  lines.push(s.hook_analysis.recommended);
  lines.push('');

  // Scenes
  lines.push('---\n');
  lines.push(`## 🎬 Scene Breakdown (30-Second Viral Formula)\n`);
  s.scenes.forEach(scene => {
    lines.push(`### Scene ${scene.scene} — ${scene.label} \`${scene.timing}\` *(${scene.words})*`);
    lines.push(`**Purpose:** ${scene.purpose}\n`);
    lines.push(`📝 **Script:**\n${scene.script}\n`);
    lines.push(`🎥 **Visual:** ${scene.visual}\n`);
    lines.push(`📲 **Text Overlay:** \`${scene.text_overlay}\`\n`);
    lines.push(`🎵 **Audio:** ${scene.audio}\n`);
    lines.push(`🎬 **Director Note:** ${scene.director_note}\n`);
    lines.push('---\n');
  });

  // Viral Multipliers
  lines.push(`## ⚡ Viral Multipliers\n`);
  const vm = s.viral_multipliers;
  lines.push(`**🔗 Hook-to-Hold Tip:**\n${vm.hook_to_hold_tip}\n`);
  lines.push(`**💬 Comment Bait:**\n${vm.comment_bait}\n`);
  lines.push(`**📤 Share Trigger:**\n${vm.share_trigger}\n`);
  lines.push(`**🔁 Rewatch Hook:**\n${vm.rewatch_hook}\n`);
  lines.push(`**📱 Platform Tweaks:**`);
  for (const [platform, tweak] of Object.entries(vm.platform_tweaks)) {
    lines.push(`- **${platform.charAt(0).toUpperCase() + platform.slice(1)}:** ${tweak}`);
  }
  lines.push('');

  // Production Checklist
  lines.push(`## 📋 Production Checklist\n`);
  const pc = s.production_checklist;
  lines.push(`**🖼️ First Frame:**\n${pc.first_frame}\n`);
  lines.push(`**✍️ Caption Openers by Platform:**`);
  for (const [platform, opener] of Object.entries(pc.caption_openers)) {
    lines.push(`- **${platform.charAt(0).toUpperCase() + platform.slice(1)}:** "${opener}"`);
  }
  lines.push('');
  lines.push(`**#️⃣ Hashtag Strategy:**`);
  lines.push(`${pc.hashtag_strategy.hashtags.join(' ')} *(${pc.hashtag_strategy.strategy.slice(0, 80)}...)*\n`);
  lines.push(`**⏰ Optimal Posting Times:**`);
  for (const [platform, time] of Object.entries(pc.optimal_posting)) {
    lines.push(`- **${platform.charAt(0).toUpperCase() + platform.slice(1)}:** ${time}`);
  }
  lines.push('');
  lines.push(`**🎥 Filming Tips:**`);
  pc.filming_tips.forEach(tip => lines.push(`- ${tip}`));
  lines.push('');
  lines.push(`**🔊 Sound Design:** ${pc.sound_design}`);
  lines.push(`**📝 Caption Note:** ${pc.caption_note}`);

  return lines.join('\n');
}

function formatText(data, mode) {
  const md = formatMarkdown(data, mode);
  return md
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*/g, '')
    .replace(/`[^`]+`/g, (s) => s.replace(/`/g, ''))
    .replace(/\|[^\n]+\|/g, (line) => line.replace(/\|/g, '  ').replace(/-+/g, '').trim())
    .replace(/^>\s+/gm, '  ')
    .replace(/★|☆/g, '*')
    .replace(/\n{3,}/g, '\n\n');
}
