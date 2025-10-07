import { useEffect } from "react";

export default function InstagramEmbed({ url }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url]);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{ width: "100%", maxWidth: "540px", margin: "0 auto" }}
    ></blockquote>
  );
}
