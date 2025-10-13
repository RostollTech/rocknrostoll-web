import { useMemo } from "react";

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
    <div className="instagram-embed">
      <iframe
        src={embedUrl}
        title={title}
        className="instagram-embed__frame"
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      ></iframe>
    </div>
  );
}
