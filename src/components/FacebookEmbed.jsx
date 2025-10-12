export default function FacebookEmbed({ url, title = "Publicació de Facebook", height = 654 }) {
  return (
    <iframe
      src={url}
      title={title}
      className="facebook-embed"
      height={height}
      scrolling="no"
      frameBorder="0"
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
    ></iframe>
  );
}
