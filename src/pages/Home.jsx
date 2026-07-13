import { useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InstagramEmbed from "../components/InstagramEmbed";
import FacebookEmbed from "../components/FacebookEmbed";
import Countdown from "../components/Countdown";
import SEO from "../components/SEO";
import LineupCard from "../components/LineupCard";
import galleryImages from "../data/gallery";
import { lineup } from "../data/lineup";
import "../styles/Lineup.css";

// SEO: Recomanat exportar les imatges de la galeria a formats .webp o .avif per reduir el pes

export default function Home() {
  const gallery = useMemo(() => galleryImages, []);
  const rockStageLineup = useMemo(() => lineup.filter((artist) => artist.stage === "rock"), []);
  const safareigStageLineup = useMemo(() => lineup.filter((artist) => artist.stage === "safareig"), []);
  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "MusicEvent",
      name: "Rock’n’Rostoll 2026",
      alternateName: "Rock and Rostoll 2026",
      description:
        "Festival autogestionat de rock i electrònica que se celebra a Son Perot (Maria de la Salut).",
      keywords: [
        "Rock’n’Rostoll",
        "Rock and Rostoll",
        "Rostoll",
        "festival Mallorca",
        "festival malllorca",
        "rock",
        "Maria de la Salut",
      ],
      startDate: "2026-08-29T21:00:00+02:00",
      endDate: "2026-08-30T06:00:00+02:00",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      image: [
        "https://rocknrostoll.cat/img/about-actualitat.jpg",
        "https://rocknrostoll.cat/img/about-voluntariat.jpg",
      ],
      location: {
        "@type": "Place",
        name: "Son Perot",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Camí de Maria de la Salut a Muro",
          addressLocality: "Maria de la Salut",
          addressRegion: "Illes Balears",
          postalCode: "07518",
          addressCountry: "ES",
        },
      },
      organizer: {
        "@type": "Organization",
        name: "Associació Cultural Rock’n’Rostoll",
        url: "https://rocknrostoll.cat",
      },
      performer: {
        "@type": "MusicGroup",
        name: "Line-up Rock’n’Rostoll",
      },
    }),
    [],
  );

  return (
    <>
      <SEO
        title="Rock’n’Rostoll · Festival autogestionat de rock i electrònica a Mallorca"
        description="Rock’n’Rostoll és el festival autogestionat de referència a Maria de la Salut. Consulta informació pràctica, descobreix la història del festival i prepara la teva visita a Son Perot."
        keywords={[
          "Rock’n’Rostoll",
          "Rock and Rostoll",
          "festival Mallorca",
          "festival rock Mallorca",
          "Maria de la Salut",
          "música electrònica Mallorca",
        ]}
        canonicalPath="/"
        image="https://rocknrostoll.cat/img/about-actualitat.jpg"
        structuredData={structuredData}
      />
      <Navbar />
      <main>
        <section className="hero home-hero">
          <div className="hero-content">
            <p className="hero-eyebrow">30a edició</p>
            <h1 className="hero-title">
              <img className="hero-logo" src="/img/fotos2026/logo20262.png" alt="30 edicions de música, amistat i rostoll" />
            </h1>
            <p className="hero-meta">29 d’agost de 2026 · Festival autogestionat a Son Perot (Maria de la Salut)</p>
            <p className="hero-description">
              Rock’n’Rostoll és el festival autogestionat de referència al Pla de Mallorca. Un punt de trobada entre
              generacions, música i llibertat, on el rock i l’electrònica omplen el rostoll de Maria de la Salut cada darrer
              dissabte d’agost. Celebrem 30 edicions d’història, germanor i molta festa!
            </p>

            <Countdown targetDate="2026-08-29T21:00:00" />

            <div className="button-group">
              <Link to="/about" className="btn-primary">
                Qui som?
              </Link>
              <a href="#lineup" className="btn-outline">
                Line-up
              </a>
              <Link to="/contact" className="btn-outline">
                Segueix-nos
              </Link>
            </div>
          </div>
        </section>

        <section className="lineup-section" id="lineup">
          <div className="container">
            <div className="section-header">
              <p className="section-eyebrow">XXX Rock'n'Rostoll</p>
              <h2 className="section-title">Line-up 2026</h2>
              <p className="section-description">
                Més d'una dotzena d'artistes per una nit inoblidable, repartits entre l'Escenari Rock i el Safareig. Segueix-nos a
                Instagram per no perdre't les properes novetats.
              </p>
            </div>
          </div>

          <div className="lineup-stage lineup-stage-rock">
            <div className="container">
              <div className="lineup-stage-header">
                <h3 className="lineup-stage-title">Escenari Rock</h3>
              </div>
              <div className="lineup-grid">
                {rockStageLineup.map((artist) => (
                  <LineupCard key={artist.id} artist={artist} />
                ))}
              </div>
            </div>
          </div>

          <div className="lineup-stage lineup-stage-safareig">
            <div className="container">
              <div className="lineup-stage-header">
                <h3 className="lineup-stage-title">Safareig</h3>
              </div>
              <div className="lineup-grid">
                {safareigStageLineup.map((artist) => (
                  <LineupCard key={artist.id} artist={artist} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section home-warm-section" id="programa">
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

        <section className="section section-alt home-warm-section">
          <div className="container">
            <div className="section-header">
              <p className="section-eyebrow">Galeria</p>
              <h2 className="section-title">Moments Rock’n’Rostoll</h2>
              <p className="section-description">Un recorregut visual pel darrer festival.</p>
            </div>

            <div className="gallery-grid">
              {gallery.map((image) => (
                <img key={image.src} src={image.src} alt={image.alt} loading="lazy" />
              ))}
            </div>
          </div>
        </section>

        {/* <section className="section section-alt">
          <div className="container">
            <div className="section-header">
              <p className="section-eyebrow">Xarxes</p>
              <h2 className="section-title">Reviu l’ambient</h2>
              <p className="section-description">Clips i moments compartits a les xarxes.</p>
            </div>

            <div className="video-frame">
              <div className="instagram-gallery">
                <InstagramEmbed url="https://www.instagram.com/p/DPKAi8BjMNs/" />
                <InstagramEmbed url="https://www.instagram.com/p/DO36Nm4jL5O/?utm_source=ig_web_copy_link&igsh=MWJtdDRjaTFzb3Z3NQ==" />
                <FacebookEmbed url="https://www.facebook.com/RadioRostoll/posts/pfbid0PqP9HPuEtVquNxfLe3T2HMsxCCivqnjZmRmmyuVsprcgcb8w2uSFdDhjBcoBXJkTl" />

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
              Pròximament!
            </a>
            <a href="/contact#segueix" className="btn-outline">
              Segueix-nos a les xarxes
            </a>
          </div>
        </section>*/}
      </main>
      <Footer />
    </>
  );
}
