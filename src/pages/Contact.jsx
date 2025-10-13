import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import SocialLinks from "../components/SocialLinks";
import contactMapImage from "/img/contact-map.webp";
import qrFacebookImage from "/qr/qr_facebook_blanc.png";
import qrInstagramImage from "/qr/qr_instagram_blanc.png";

export default function Contact() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          className="contact-hero"
          eyebrow="Contacte"
          title="Contacta amb Rock’n’Rostoll"
          description="Som un festival autogestionat per joves de Maria de la Salut. Si vols col·laborar, participar o simplement saludar, ens trobaràs a baix. Sempre és benvinguda una mà més!"
        />

        <section className="page-section section-alt">
          <div className="page-content info-grid contact-grid">
            <article className="info-card contact-card">
              <span className="info-label">Contacte general</span>
              <h3 className="info-title">Consultes i dubtes</h3>
              <p className="info-text">
                Si tens dubtes o vols informació sobre el festival, escriu-nos i t&rsquo;respondrem ben aviat.
              </p>
              <p className="info-text contact-card__email">rocknrostoll@gmail.com</p>
            </article>
            <article className="info-card contact-card">
              <span className="info-label">Col·laboracions i premsa</span>
              <h3 className="info-title">Fem equip amb tu</h3>
              <p className="info-text">
                Som oberts a col·laboracions amb artistes, entitats i mitjans que comparteixin la nostra filosofia: música,
                joventut i cultura local.
              </p>
              <p className="info-text">
                Escriu-nos i parlarem de com sumar esforços per fer créixer la comunitat del Rock&rsquo;n&rsquo;Rostoll.
              </p>
            </article>
            <article className="info-card contact-card">
              <span className="info-label">Grups i DJ</span>
              <h3 className="info-title">Volem escoltar-te</h3>
              <p className="info-text">
                Si tens un grup o ets DJ i t&rsquo;agradaria actuar al Rock&rsquo;n&rsquo;Rostoll, envia&rsquo;ns informació sobre el teu projecte
                musical i les teves necessitats tècniques.
              </p>
            </article>
          </div>
        </section>

        <section className="page-section">
          <div className="page-content contact-layout">
            <div className="section-header section-header--left contact-intro">
              <p className="section-eyebrow">Segueix-nos</p>
              <h2 className="section-title">Segueix Rock’n’Rostoll</h2>
              <p className="section-description">
                Troba’ns a les nostres xarxes o escriu-nos directament per col·laborar o resoldre qualsevol dubte.
              </p>
            </div>
            <div className="contact-social-links">
              <SocialLinks />
              {/* SEO: Imatge amb alt descriptiu i càrrega mandrosa */}
              <img
                className="contact-social-img"
                src={contactMapImage}
                alt="Vista del camp de rostoll on se celebra el festival"
                loading="lazy"
              />
            </div>
            <div className="contact-qr-grid">
              <div className="qr-card">
                <img
                  src={qrInstagramImage}
                  alt="Codi QR d'Instagram de Rock’n’Rostoll"
                  className="qr-image"
                  loading="lazy"
                />
                <p>Escaneja per seguir-nos a Instagram</p>
              </div>
              <div className="qr-card">
                <img
                  src={qrFacebookImage}
                  alt="Codi QR de Facebook de Rock’n’Rostoll"
                  className="qr-image"
                  loading="lazy"
                />
                <p>Escaneja per seguir-nos a Facebook</p>
              </div>
            </div>
          </div>
        </section>

        <section className="page-section section-alt">
          <div className="page-content">
            <div className="map-frame">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1459.9425136729283!2d3.0653078102838998!3d39.68329810760899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1297cb42046d8b09%3A0x194899cbb6f7f09d!2sRock'n'Rostoll!5e1!3m2!1sca!2ses!4v1759844635351!5m2!1sca!2ses"
                width="100%"
                height="400"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa del Rock’n’Rostoll a Maria de la Salut"
              ></iframe>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
