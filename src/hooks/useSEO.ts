import { useEffect } from 'react';
import { apiCall } from '@/lib/api';

interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robots?: string;
}

export const useSEO = (page: string) => {
  useEffect(() => {
    const loadSEO = async () => {
      try {
        const response = await apiCall(`/seo/${page}`);
        const data = await response.json();
        
        if (data.success) {
          const seo: SEOData = data.seo;
          
          // Update document title
          document.title = seo.title;
          
          // Update meta tags
          updateMetaTag('description', seo.description);
          
          if (seo.keywords) {
            updateMetaTag('keywords', seo.keywords);
          }
          
          if (seo.robots) {
            updateMetaTag('robots', seo.robots);
          }
          
          // Update Open Graph tags
          if (seo.ogTitle) {
            updateMetaProperty('og:title', seo.ogTitle);
          } else {
            updateMetaProperty('og:title', seo.title);
          }
          
          if (seo.ogDescription) {
            updateMetaProperty('og:description', seo.ogDescription);
          } else {
            updateMetaProperty('og:description', seo.description);
          }
          
          if (seo.ogImage) {
            updateMetaProperty('og:image', seo.ogImage);
          }
          
          // Update Twitter tags
          if (seo.twitterTitle) {
            updateMetaName('twitter:title', seo.twitterTitle);
          } else if (seo.ogTitle) {
            updateMetaName('twitter:title', seo.ogTitle);
          } else {
            updateMetaName('twitter:title', seo.title);
          }
          
          if (seo.twitterDescription) {
            updateMetaName('twitter:description', seo.twitterDescription);
          } else if (seo.ogDescription) {
            updateMetaName('twitter:description', seo.ogDescription);
          } else {
            updateMetaName('twitter:description', seo.description);
          }
          
          if (seo.twitterImage) {
            updateMetaName('twitter:image', seo.twitterImage);
          } else if (seo.ogImage) {
            updateMetaName('twitter:image', seo.ogImage);
          }
          
          // Update canonical URL
          if (seo.canonicalUrl) {
            updateCanonicalUrl(seo.canonicalUrl);
          }
        }
      } catch (error) {
        console.error('Failed to load SEO data:', error);
      }
    };
    
    loadSEO();
  }, [page]);
};

const updateMetaTag = (name: string, content: string) => {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
};

const updateMetaProperty = (property: string, content: string) => {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.content = content;
};

const updateMetaName = (name: string, content: string) => {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
};

const updateCanonicalUrl = (url: string) => {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = url;
};