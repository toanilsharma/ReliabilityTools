
import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  image?: string;
  schema?: object;
}

const SEO: React.FC<SEOProps> = ({ title, description, keywords, canonicalUrl, image, schema }) => {
  useEffect(() => {
    // 1. Update Title
    if (title) {
      document.title = `${title} | Reliability Tools`;
    }

    // 2. Helper to update/create meta tags
    const updateMetaTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const updateOgTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Update Description
    if (description) {
      updateMetaTag('description', description);
      updateOgTag('og:description', description);
      updateOgTag('twitter:description', description);
    }

    // 4. Update Keywords
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    // 5. Update Canonical URL
    if (canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonicalUrl);
      updateOgTag('og:url', canonicalUrl);
    }

    // 6. Update OG Title
    if (title) {
      updateOgTag('og:title', title);
      updateOgTag('twitter:title', title);
    }

    // 7. Update Social Image
    const socialImage = image || 'https://reliabilitytools.co.in/social-preview.png';
    updateOgTag('og:image', socialImage);
    updateOgTag('twitter:image', socialImage);
    updateOgTag('twitter:card', 'summary_large_image');

    // 8. Inject Schema
    if (schema) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [title, description, keywords, canonicalUrl, schema, image]);

  return null;
};

export default SEO;