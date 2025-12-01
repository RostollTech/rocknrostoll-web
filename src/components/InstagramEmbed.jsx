import { useMemo } from "react";

import LazyIframe from "./LazyIframe";

function buildEmbedUrl(permalink) {
  if (!permalink) {
    return null;
  }

  try {
    const parsed = new URL(permalink);

    if (!parsed.hostname.endsWith("instagram.com")) {
      return null;
    }

    parsed.protocol = "https:";
    parsed.search = "";
    parsed.hash = "";

    const trimmedPath = parsed.pathname.replace(/\/$/, "");
    parsed.pathname = `${trimmedPath}/embed`;

    parsed.searchParams.set("cr", "1");
    parsed.searchParams.set("v", "14");
    parsed.searchParams.set("wp", "540");

    return parsed.toString();
  } catch (error) {
    console.warn("Instagram embed: invalid URL", error);
    return null;
  }
}

export default function InstagramEmbed({ url, title = "Publicació d'Instagram" }) {
  const embedUrl = useMemo(() => buildEmbedUrl(url), [url]);

  if (!embedUrl) {
    return (
      <div className="instagram-embed instagram-embed--fallback">
        <a className="instagram-embed__fallback" href={url} target="_blank" rel="noreferrer">
          Veure a Instagram
        </a>
      </div>
    );
  }

  return (
    <LazyIframe
      containerClassName="instagram-embed"
      containerStyle={{ minHeight: "420px" }}
      className="instagram-embed__frame"
      src={embedUrl}
      title={title}
      loading="lazy"
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; unload"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      placeholder={
        <div
          className="instagram-embed__placeholder instagram-embed--fallback"
          aria-hidden="true"
        >
          Carregant contingut d'Instagram…
        </div>
      }
    />
  );
}
