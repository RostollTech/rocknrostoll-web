export default function FacebookEmbed({ url, title = "Publicació de Facebook", height = 654 }) {
  return (
    <iframe
      src={url}
      title={title}
      style={{ border: "none", overflow: "hidden", width: "100%", maxWidth: "500px" }}
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
