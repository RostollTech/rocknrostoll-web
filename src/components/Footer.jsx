import { Link } from "react-router-dom";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>Rock'n'Rostoll</h3>
          <p>
            Festival autogestionat de rock i electrònica nascut a Maria de la Salut el 1995, on
            el darrer dissabte d'agost un camp de rostoll i un safareig es converteixen en una
            nit de música, llibertat i germanor.
          </p>
        </div>

        <div className="footer-column">
          <h4>Xarxes socials</h4>
          <SocialLinks />
        </div>

        <div className="footer-column">
          <h4>Enllaços ràpids</h4>
          <div className="footer-links">
            <Link to="/">Pròxim R'N'R </Link>
            <Link to="/about">Sobre el festival</Link>
            <a href="/shop">Botiga</a>
            <Link to="/contact">Contacte</Link>
          </div>
        </div>

        {/* <div className="footer-column">
          <h4>Butlletí</h4>
          <p className="section-description">
            Subscriu-te per seguir les novetats i històries que mantenen
            viva el Rostoll des de fa ja tres dècades.
          </p>
          <form className="newsletter-form" onSubmit={(event) => event.preventDefault()}>
            <input
              type="email"
              id="newsletter-email"
              name="newsletter-email"
              placeholder="Pròximament!"
              aria-label="Correu electrònic"
              className="newsletter-input"
            />
            <button type="submit" className="btn-primary">
              Pròximament!
            </button>
          </form>
        </div> */}
      </div>

      <p className="footer-note">
        © {new Date().getFullYear()} Rock'n'Rostoll. Tots els drets reservats · {" "}
        <Link to="/avis-legal">Avís legal</Link> · {" "}
        <a href="#politica-privacitat">Política de privacitat</a>
      </p>

      <div className="subfooter">
        <span className="subfooter__text">Pàgina feta per:</span>
        <a
          className="subfooter__brand"
          href="mailto:solucionsuep@gmail.com"
          title="Contacta amb UEP TI Solucions"
        >
          <img
            src="/img/uepsolucions/uep-logo-neg.png"
            alt="UEP TI Solucions"
            className="subfooter__logo"
          />
          <span className="subfooter__name">UEP TI Solucions</span>
          <span className="subfooter__text">- Serveis TI i Digitalització - </span>
          <span className="subfooter__email">solucionsuep@gmail.com</span>
        </a>
      </div>
    </footer>
  );
}
