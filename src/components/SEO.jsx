import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://rocknrostoll.cat";

function ensureElement({ selector, create }) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = create();
    document.head.appendChild(element);
  }
  return element;
}

function setMetaName(name, content) {
  if (!content) return;
  const meta = ensureElement({
    selector: `meta[name="${name}"]`,
    create: () => {
      const element = document.createElement("meta");
      element.setAttribute("name", name);
      return element;
    },
  });
  meta.setAttribute("content", content);
}

function setMetaProperty(property, content) {
  if (!content) return;
  const meta = ensureElement({
    selector: `meta[property="${property}"]`,
    create: () => {
      const element = document.createElement("meta");
      element.setAttribute("property", property);
      return element;
    },
  });
  meta.setAttribute("content", content);
}

function setCanonical(url) {
  const link = ensureElement({
    selector: 'link[rel="canonical"]',
    create: () => {
      const element = document.createElement("link");
      element.setAttribute("rel", "canonical");
      return element;
    },
  });
  link.setAttribute("href", url);
}

function setStructuredData(structuredData) {
  const existing = document.head.querySelector('script[id="structured-data"]');
  if (existing) {
    existing.remove();
  }
  if (!structuredData) return;
  const script = document.createElement("script");
  script.id = "structured-data";
  script.type = "application/ld+json";
  script.text = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

export default function SEO({
  title,
  description,
  keywords = [],
  canonicalPath,
  image = "https://rocknrostoll.cat/img/about-actualitat.jpg",
  type = "website",
  robots = "index, follow",
  twitterCard = "summary_large_image",
  structuredData,
}) {
  const { pathname } = useLocation();

  useEffect(() => {
    const canonicalUrl = canonicalPath
      ? `${SITE_URL}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`
      : `${SITE_URL}${pathname}`;

    if (title) {
      document.title = title;
      setMetaProperty("og:title", title);
      setMetaName("twitter:title", title);
    }

    if (description) {
      setMetaName("description", description);
      setMetaProperty("og:description", description);
      setMetaName("twitter:description", description);
    }

    if (keywords.length) {
      setMetaName("keywords", keywords.join(", "));
    }

    setMetaName("robots", robots);
    setCanonical(canonicalUrl);
    setMetaProperty("og:type", type);
    setMetaProperty("og:url", canonicalUrl);
    setMetaProperty("og:image", image);
    setMetaName("twitter:image", image);
    setMetaName("twitter:card", twitterCard);
    setMetaName("twitter:site", "@rocknrostoll");
    setMetaName("author", "Rock’n’Rostoll");

    setStructuredData(structuredData);

    return () => {
      if (!structuredData) return;
      const script = document.head.querySelector('script[id="structured-data"]');
      if (script) {
        script.remove();
      }
    };
  }, [
    title,
    description,
    keywords,
    canonicalPath,
    pathname,
    image,
    type,
    robots,
    twitterCard,
    structuredData,
  ]);

  return null;
}
