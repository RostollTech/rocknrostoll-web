import iconFacebook from "../assets/icons/facebook.png";
import  iconInstagram from "../assets/icons/instagram.png";
import iconMail from "../assets/icons/mail.png";

const links = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/rocknrostoll/",
    icon: iconInstagram,
    ariaLabel: "Instagram @rocknrostoll",
    detail: "@rocknrostoll",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/RadioRostoll/",
    icon: iconFacebook,
    ariaLabel: "Facebook RadioRostoll",
    detail: "RadioRostoll",
  }, 
  {
    label: "Email",
    href: "mailto:rocknrostoll@gmail.com",
    icon: iconMail,
    ariaLabel: "Email rocknrostoll@gmail.com",
    detail: "@gmail.com",
  },
];

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
            <img src={link.icon} alt="" />
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
