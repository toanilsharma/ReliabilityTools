import DOMPurify from 'dompurify';

/**
 * Sanitizes User-Generated Content (UGC) HTML:
 * 1. Strips dangerous tags (scripts, iframes, objects, event handlers).
 * 2. Rewrites all outbound anchor tags to include rel="ugc nofollow noopener noreferrer".
 * 3. Enforces target="_blank" for outbound safety.
 */
export function sanitizeUgcHtml(dirtyHtml: string): string {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') return '';

  // 1. Sanitize with DOMPurify
  const clean = DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 
      'h3', 'h4', 'h5', 'blockquote', 'code', 'pre', 'span', 'hr'
    ],
    ALLOWED_ATTR: ['href', 'title', 'class'],
  });

  // 2. Parse and inject rel="ugc" on all outbound links
  if (typeof window !== 'undefined' && window.DOMParser) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(clean, 'text/html');
      const links = doc.querySelectorAll('a');
      links.forEach(link => {
        link.setAttribute('rel', 'ugc nofollow noopener noreferrer');
        link.setAttribute('target', '_blank');
      });
      return doc.body.innerHTML;
    } catch {
      // Fallback to regex if DOMParser fails
    }
  }

  // Regex fallback: ensure rel="ugc nofollow noopener noreferrer"
  return clean.replace(/<a\s+([^>]*?)href="([^"]*)"([^>]*)>/gi, (match, before, href, after) => {
    const combined = `${before} ${after}`.replace(/\s*(?:rel|target)=["'][^"']*["']/gi, '').trim();
    return `<a href="${href}" ${combined} target="_blank" rel="ugc nofollow noopener noreferrer">`;
  });
}
