import { useMemo } from "react";
import LazyIframe from "./LazyIframe";

export default function FacebookEmbed({ url, title = "Publicació de Facebook", height = 654 }) {
  const minHeight = typeof height === "number" ? `${height}px` : height;

  const embedUrl = useMemo(() => {
    if (!url) return "";
    // Si ja és una URL de plugin, la deixam tal qual
    if (url.includes("plugins/post.php") || url.includes("plugins/video.php")) {
      return url;
    }
    // Si és una URL directa, la convertim al format de plugin
    return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true&width=500`;
  }, [url]);

  return (
    <LazyIframe
      containerClassName="facebook-embed"
      containerStyle={{ minHeight }}
      className="facebook-embed__frame"
      src={embedUrl}
      title={title}
      height={height}
      scrolling="no"
      frameBorder="0"
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; unload"
      referrerPolicy="strict-origin-when-cross-origin"
      style={{ minHeight }}
      placeholder={
        <div className="facebook-embed__placeholder" aria-hidden="true">
          Carregant contingut de Facebook…
        </div>
      }
    />
  );
}
