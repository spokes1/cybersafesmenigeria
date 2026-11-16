export const ABOUT_REDIRECTS = Object.freeze({
  '/about/mission': '/about#mission',
  '/about/team': '/about#team',
  '/about/contact': '/about#contact',
});

export const PAGE_REDIRECTS = Object.freeze({...ABOUT_REDIRECTS, '/privacy':'/about'});

/** Update visitor links while keeping old URLs usable as redirects. */
export function updateAboutLinks(html) {
  return html.replace(/href="(\/about\/(?:mission|team|contact))\/?(?:#[^"]*)?"/g,
    (_match, path) => `href="${ABOUT_REDIRECTS[path]}"`);
}

export function aboutRedirectDocument(target) {
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${target}"><link rel="canonical" href="${SITE.origin}/about"><title>This page has moved | CyberSafe SME Nigeria</title></head><body><p>Continue to our About page. <a href="${target}">Continue to About CyberSafe SME Nigeria</a>.</p></body></html>`;
}
import { SITE } from '../content/nav.mjs';
