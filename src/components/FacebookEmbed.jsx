import LazyIframe from "./LazyIframe";

export default function FacebookEmbed({ url, title = "Publicació de Facebook", height = 654 }) {
  const minHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <LazyIframe
      containerClassName="facebook-embed"
      containerStyle={{ minHeight }}
      className="facebook-embed__frame"
      src={url}
      title={title}
      height={height}
      scrolling="no"
      frameBorder="0"
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      loading="lazy"
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
