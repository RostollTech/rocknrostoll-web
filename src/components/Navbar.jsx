import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const path = useLocation().pathname;
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    //{ /*to: "/shop", label: "Shop"*/ },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          Rock'N'Rostoll
        </Link>

        <button className="nav-toggle" type="button" onClick={toggleMenu} aria-expanded={isOpen}>
          <span className="sr-only">Toggle navigation</span>
          {isOpen ? "✕" : "☰"}
        </button>

        <ul className={`nav-links${isOpen ? " open" : ""}`}>
          {navItems.map((item) => (
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
