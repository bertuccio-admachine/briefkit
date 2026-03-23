// Output formatters: markdown, text, json

export function formatOutput(data, format, mode) {
  if (format === 'json') return JSON.stringify(data, null, 2);
  if (format === 'text') return formatText(data, mode);
  return formatMarkdown(data, mode);
}

function formatMarkdown(data, mode) {
  const parts = [];

  if (mode === 'both') {
    parts.push(formatMarkdownBrief(data.brief));
    parts.push('\n---\n');
    parts.push(formatMarkdownScript(data.script));
    return parts.join('\n');
  }
  if (mode === 'script') return formatMarkdownScript(data);
  return formatMarkdownBrief(data);
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

  // Hooks
  lines.push(`## Hook Options\n`);
  s.hook_options.forEach((h, i) => {
    lines.push(`${i + 1}. **[${h.category}]** ${h.hook} ${h.platform_fit}`);
  });
  lines.push('');

  // Scenes
  lines.push(`## Scene Breakdown\n`);
  s.scenes.forEach(scene => {
    lines.push(`### Scene ${scene.scene}: ${scene.label} (${scene.duration})`);
    lines.push(`**Duration:** ${scene.seconds}s\n`);
    lines.push(`**Direction:** ${scene.direction}\n`);
    if (scene.visual) lines.push(`**Visual:** ${scene.visual}\n`);
    if (scene.audio) lines.push(`**Audio:** ${scene.audio}\n`);
    if (scene.text_overlay) lines.push(`**Text overlay:** ${scene.text_overlay}\n`);
  });

  // Production notes
  lines.push(`## Production Notes\n`);
  s.production_notes.forEach(n => lines.push(`- ${n}`));
  lines.push('');

  // B-roll
  lines.push(`## B-Roll Suggestions\n`);
  s.b_roll_suggestions.forEach(b => lines.push(`- ${b}`));

  return lines.join('\n');
}

function formatText(data, mode) {
  // Strip markdown formatting for plain text
  const md = formatMarkdown(data, mode);
  return md
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*/g, '')
    .replace(/\|[^\n]+\|/g, (line) => {
      return line.replace(/\|/g, '  ').replace(/\-+/g, '').trim();
    })
    .replace(/^>\s+/gm, '  ')
    .replace(/\n{3,}/g, '\n\n');
}
