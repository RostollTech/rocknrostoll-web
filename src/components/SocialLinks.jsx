import links from "../data/socialLinks";

export default function SocialLinks() {
  return (
    <div className="footer-social">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.ariaLabel}
        >
          <span className="icon icon--social" aria-hidden="true">
            {/* SEO: Alt descriptiu i càrrega mandrosa per a icones socials */}
            <img src={link.icon} alt={link.label} loading="lazy" />
          </span>
          <div>
            <span>{link.label}</span>
            <strong>{link.detail}</strong>
          </div>
        </a>
      ))}
    </div>
  );
}
