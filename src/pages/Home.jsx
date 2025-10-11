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

  const lineup = useMemo(
    () => [
      {
        stage: "Escenari Rock",
        description: "Aviat anunciarem els grups!",
      },
      {
        stage: "Safareig Dance",
        description: "Aviat anunciarem els DJ i sessions electròniques!",
      },
    ],
    []
  );

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
            <div className="hero-highlight">
              <span>Entrada lliure</span>
              <span>30 anys en directe</span>
            </div>
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
              <a href="#programa" className="btn-primary">
                Consulta el programa
              </a>
              <a href="#newsletter" className="btn-outline">
                Apunta’t al voluntariat
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
          <div className="container two-column">
            <div className="two-column-content">
              <h3>Experiències i ambient</h3>
              <p>
                Descobreix les activitats i l’esperit del festival (aviat disponible). Estam preparant tallers, accions
                comunitàries i sorpreses per celebrar tres dècades d’autogestió i música lliure.
              </p>
              <ul className="two-column-list">
                <li>Aviat compartirem els espais participatius i les rutes pel recinte.</li>
                <li>Preparau-vos per noves instal·lacions artístiques i propostes de proximitat.</li>
                <li>Reforçam el compromís amb la sostenibilitat i l’acollida a tothom.</li>
              </ul>
            </div>
            <div className="media-card">
              <img src={contactHeroImage} alt="Ambient nocturn del Rock’n’Rostoll" />
            </div>
          </div>
        </section>

        <section className="section section-alt" id="programa">
          <div className="container">
            <div className="section-header">
              <p className="section-eyebrow">Line-up</p>
              <h2 className="section-title">Cartell 2025</h2>
              <p className="section-description">Ja anirem anunciant els grups i DJ de cada escenari.</p>
            </div>

            <div className="lineup-grid">
              {lineup.map((item) => (
                <article className="lineup-card" key={item.stage}>
                  <h3 className="lineup-name">{item.stage}</h3>
                  <p className="lineup-note">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-header">
              <p className="section-eyebrow">Horaris</p>
              <h2 className="section-title">Horaris i activitats</h2>
              <p className="section-description">Aviat disponible.</p>
            </div>

            <div className="timeline">
              <div className="timeline-item">
                <span className="timeline-marker" aria-hidden="true"></span>
                <p className="timeline-time">Pròximament</p>
                <h3 className="timeline-title">Programació detallada</h3>
                <p className="timeline-text">
                  Publicarem el cronograma complet amb activitats, concerts i accions comunitàries tan aviat com estigui
                  confirmat.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-alt">
          <div className="container">
            <div className="section-header">
              <p className="section-eyebrow">Viu-ho</p>
              <h2 className="section-title">Experiències i ambient</h2>
              <p className="section-description">Descobreix les activitats i l’esperit del festival (aviat disponible).</p>
            </div>

            <div className="feature-grid">
              <article className="feature-card">
                <span>Espais</span>
                <h4>Aviat</h4>
                <p>Estam treballant en nous espais per experimentar i compartir moments únics.</p>
              </article>
              <article className="feature-card">
                <span>Comunitat</span>
                <h4>En construcció</h4>
                <p>La comunitat voluntària hi posa l’ànima. Ben aviat compartirem les properes propostes.</p>
              </article>
              <article className="feature-card">
                <span>Sabors</span>
                <h4>A punt</h4>
                <p>Foodtrucks, barra i producte local per recarregar energies mentre no atura la música.</p>
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
              <p className="section-eyebrow">Vídeo</p>
              <h2 className="section-title">Reviveix l’ambient</h2>
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
