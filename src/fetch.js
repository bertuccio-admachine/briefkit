/**
 * fetch.js — Zero-dependency URL fetcher and product context extractor
 * Uses only Node.js built-ins (https, http, url modules)
 */

import https from 'node:https';
import http from 'node:http';
import { URL } from 'node:url';

/**
 * Check if a string looks like a URL
 */
export function isUrl(str) {
  return /^https?:\/\//i.test(str.trim());
}

/**
 * Fetch a URL and extract product context from HTML
 * Follows up to 3 redirects, 8s timeout
 */
export async function fetchProductContext(url) {
  const html = await fetchUrl(url, 3);
  return extractContext(html, url);
}

function fetchUrl(url, redirectsLeft) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const lib = parsed.protocol === 'https:' ? https : http;

    const req = lib.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; briefkit/2.0)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      timeout: 8000,
    }, (res) => {
      // Handle redirects
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirectsLeft > 0) {
        const nextUrl = new URL(res.headers.location, url).href;
        res.resume();
        resolve(fetchUrl(nextUrl, redirectsLeft - 1));
        return;
      }

      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      res.on('error', reject);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });
    req.on('error', reject);
  });
}

function extractContext(html, url) {
  const get = (pattern) => {
    const m = html.match(pattern);
    return m ? decodeHtmlEntities(m[1].trim()) : null;
  };

  const title =
    get(/<title[^>]*>([^<]+)<\/title>/i) ||
    get(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
    get(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);

  const description =
    get(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
    get(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i) ||
    get(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
    get(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);

  const h1 = get(/<h1[^>]*>([^<]+)<\/h1>/i);

  // Extract first few paragraphs of body text
  const bodyText = extractBodyText(html);

  const domain = new URL(url).hostname.replace('www.', '');

  const context = [
    title && `Product: ${title}`,
    description && `Description: ${description}`,
    h1 && h1 !== title && `Headline: ${h1}`,
    bodyText && `About: ${bodyText}`,
  ].filter(Boolean).join('\n');

  return {
    url,
    domain,
    title: title || domain,
    description: description || '',
    h1: h1 || '',
    bodyText,
    productDescription: context || `Product from ${domain}`,
    extracted: { title, description, h1, bodyText },
  };
}

function extractBodyText(html) {
  // Remove script, style, nav, header, footer blocks
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '');

  // Extract <p> content
  const paragraphs = [];
  const pMatches = text.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi);
  for (const m of pMatches) {
    const clean = m[1].replace(/<[^>]+>/g, '').trim();
    if (clean.length > 40) {
      paragraphs.push(clean);
    }
    if (paragraphs.length >= 3) break;
  }

  return paragraphs.join(' ').slice(0, 400) || null;
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)));
}
