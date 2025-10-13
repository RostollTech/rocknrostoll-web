import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import navigationItems from "../data/navigation";

export default function Navbar() {
  const path = useLocation().pathname;
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <picture>
            <source srcSet="icon/icon-page.avif" type="image/avif" />
            <source srcSet="icon/icon-page.webp" type="image/webp" />
            {/* SEO: Logotip amb càrrega mandrosa per optimitzar */}
            <img src="icon/icon-page.png" alt="Logotip" loading="lazy" />
          </picture>
          Rock'N'Rostoll
        </Link>

        <button className="nav-toggle" type="button" onClick={toggleMenu} aria-expanded={isOpen}>
          <span className="sr-only">Toggle navigation</span>
          {isOpen ? "✕" : "☰"}
        </button>

        <ul className={`nav-links${isOpen ? " open" : ""}`}>
          {navigationItems.map((item) => (
            <li key={item.to} className={path === item.to ? "active" : ""}>
              <Link to={item.to} onClick={closeMenu}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
