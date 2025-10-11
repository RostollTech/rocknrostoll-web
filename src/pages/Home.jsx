import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InstagramEmbed from "../components/InstagramEmbed";
import aboutActualitatImage from "../assets/img/about-actualitat.jpg";
import aboutOrigensImage from "../assets/img/about-origens.jpg";
import aboutSafareigImage from "../assets/img/about-safareig.jpg";
import contactHeroImage from "../assets/img/contact1.jpg";
import homeHeroImage from "../assets/img/home-hero.jpg";
import rostollImage from "../assets/img/rostoll1.jpg";
import aboutVoluntariatImage from "../assets/img/about-voluntariat.jpg";

const EVENT_DATE = new Date("2026-08-29T19:00:00");

function getTimeLeft(target) {
  const difference = target.getTime() - Date.now();

  if (difference <= 0) {
    return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(EVENT_DATE));

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft(EVENT_DATE)), 1000);
    return () => clearInterval(interval);
  }, []);

  const gallery = useMemo(
    () => [
      { src: homeHeroImage, alt: "Concert Rock’n’Rostoll 2019" },
      { src: rostollImage, alt: "Safareig Dance de matinada" },
      { src: aboutSafareigImage, alt: "Públic ballant al Safareig Dance" },
      { src: aboutActualitatImage, alt: "Voluntariat muntant l’escenari" },
      { src: aboutOrigensImage, alt: "Concert a Son Perot amb llums vermelles" },
      { src: aboutVoluntariatImage, alt: "Equip de voluntariat de Rock’n’Rostoll" },
    ],
    []
  );

  return (
    <>
      <Navbar />
      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="hero-eyebrow">30a edició</p>
            <h1 className="hero-title">30 anys de música, amistat i rostoll</h1>
            <p className="hero-meta">29 d’agost de 2026 · Festival autogestionat a Son Perot (Maria de la Salut)</p>
            <p className="hero-description">
              Rock’n’Rostoll és el festival autogestionat de referència al Pla de Mallorca. Un punt de trobada entre
              generacions, música i llibertat, on el rock i l’electrònica omplen el rostoll de Maria de la Salut cada darrer
              dissabte d’agost. Celebrem 30 anys d’història, germanor i molta festa!
            </p>

            <div className="countdown-grid" aria-label="Countdown to the event">
              <div className="countdown-card">
                <p className="countdown-number">{timeLeft.days}</p>
                <p className="countdown-label">Dies</p>
              </div>
              <div className="countdown-card">
                <p className="countdown-number">{timeLeft.hours}</p>
                <p className="countdown-label">Hores</p>
              </div>
              <div className="countdown-card">
                <p className="countdown-number">{timeLeft.minutes}</p>
                <p className="countdown-label">Minuts</p>
              </div>
              <div className="countdown-card">
                <p className="countdown-number">{timeLeft.seconds}</p>
                <p className="countdown-label">Segons</p>
              </div>
            </div>

            <div className="button-group">
              <a href="/about" className="btn-primary">
                Qui som?
              </a>
              <a href="/contact" className="btn-outline">
                Segueix-nos
              </a>
            </div>
          </div>
        </section>

        <section className="section section-alt" id="tickets">
          <div className="container">
            <div className="section-header">
              <p className="section-eyebrow">Organitza la teva arribada</p>
              <h2 className="section-title">Informació essencial</h2>
              <p className="section-description">
                Tot el que has de saber per gaudir del Rock’n’Rostoll amb comoditat i seguretat. Consulta horaris, accessos i
                normes bàsiques abans d’arribar a Son Perot.
              </p>
            </div>

            <div className="info-grid">
              <article className="info-card">
                <span className="info-label">Quan i on</span>
                <h3 className="info-title">Com sempre, el darrer Dissabte d'Agost</h3>
                <p className="info-text">Dissabte  d’agost · Son Perot, carretera Maria de la Salut &gt; Muro.</p>
              </article>
              <article className="info-card">
                <span className="info-label">Entrada i aparcament</span>
                <h3 className="info-title">Accés gratuït</h3>
                <p className="info-text">
                  Entrada i aparcament gratuït al recinte. Aparcament alternatiu al poble (a 2 km). Venir en cotxades o busos
                  ajuda a evitar embossos i accidents. Prohibit l’acampament defora dels aparcaments habilitats.
                </p>
              </article>
              <article className="info-card">
                <span className="info-label">Normes bàsiques</span>
                <h3 className="info-title">Conviu i respecta</h3>
                <ul className="info-list">
                  <li>Prohibit entrar alcohol.</li>
                  <li>Punts lila i d’Energy Control operatius tota la nit.</li>
                  <li>Servei de foodtrucks i barra amb pagament en efectiu.</li>
                  <li>Opció de comprar consumicions online.</li>
                  <li>Estima la terra · No l’embrutis.</li>
                  <li>Respecte, tolerància i civisme.</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-header">
              <p className="section-eyebrow">Galeria</p>
              <h2 className="section-title">Moments Rock’n’Rostoll</h2>
              <p className="section-description">Un recorregut visual per la història del festival.</p>
            </div>

            <div className="gallery-grid">
              {gallery.map((image) => (
                <img key={image.src} src={image.src} alt={image.alt} loading="lazy" />
              ))}
            </div>
          </div>
        </section>

        <section className="section section-alt">
          <div className="container">
            <div className="section-header">
              <p className="section-eyebrow">Xarxes</p>
              <h2 className="section-title">Reviu l’ambient</h2>
              <p className="section-description">Clips i moments compartits a les xarxes.</p>
            </div>

            <div className="video-frame">
              <div className="instagram-gallery">
                <InstagramEmbed url="https://www.instagram.com/p/DPKAi8BjMNs/" />
                <InstagramEmbed url="https://www.instagram.com/reel/CwdV3M8N9-H/" />
              </div>
            </div>
          </div>
        </section>

        <section className="cta-banner" id="newsletter">
          <h3>Forma part de Rock’n’Rostoll!</h3>
          <p>
            Cada edició és possible gràcies a la gent que hi participa. Si vols ajudar, col·laborar o simplement rebre les
            novetats del festival, apunta’t a la newsletter.
          </p>
          <div className="button-group">
            <a href="#newsletter" className="btn-primary">
              Subscriu-me a la newsletter
            </a>
            <a href="/contact#segueix" className="btn-outline">
              Segueix-nos a les xarxes
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
