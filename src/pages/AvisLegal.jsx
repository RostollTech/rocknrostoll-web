import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";

export default function AvisLegal() {
  return (
    <>
      <SEO
        title="Avís legal Rock’n’Rostoll · Termes d’ús del lloc web"
        description="Consulta l’avís legal, les condicions d’ús i la informació de contacte oficial de l’Associació Juvenil Rock’n’Rostoll, organitzadora del festival."
        keywords={[
          "avís legal Rock’n’Rostoll",
          "termes d'ús Rock and Rostoll",
          "legal festival Mallorca",
          "política Rock’n’Rostoll",
        ]}
        canonicalPath="/avis-legal"
        image="https://rocknrostoll.cat/img/about-actualitat.jpg"
      />
      <Navbar />
      <main>
        <PageHero className="legal-hero" eyebrow="Avís legal" title="Avís legal i Termes d’ús">
          <p className="page-description">
            El present lloc web (<b>www.rocknrostoll.cat</b>) és propietat de l’<b>Associació Juvenil Rock’n’Rostoll</b>, amb
            domicili a Maria de la Salut (Illes Balears) i correu de contacte {" "}
            <a href="mailto:rocknrostoll@gmail.com">rocknrostoll@gmail.com</a>.
          </p>
        </PageHero>

        <section className="page-section section-alt">
          <div className="page-content legal-content">
            <h2>1. Objecte del lloc web</h2>
            <p>
              Aquest lloc té com a finalitat oferir informació sobre el festival Rock’n’Rostoll, els seus esdeveniments i
              activitats culturals, així com facilitar el contacte amb l’organització i la seva comunitat.
            </p>

            <h2>2. Condicions d’ús</h2>
            <p>
              L’usuari es compromet a fer un ús adequat dels continguts i serveis que ofereix aquest lloc web, respectant la
              llei, la moral i l’ordre públic. Queda prohibida qualsevol actuació que pugui causar danys o impedir el
              funcionament normal del lloc.
            </p>

            <h2>3. Propietat intel·lectual i industrial</h2>
            <p>
              Tots els continguts d’aquest lloc web (textos, imatges, logotips, dissenys, vídeos i altres materials) són
              propietat de l’organització o dels seus autors respectius, i estan protegits per la normativa de propietat
              intel·lectual. No està permesa la reproducció total o parcial dels continguts sense autorització expressa.
            </p>

            <h2>4. Enllaços externs</h2>
            <p>
              Aquest lloc pot contenir enllaços a xarxes socials o altres pàgines web de tercers. L’Associació Juvenil
              Rock’n’Rostoll no es fa responsable del contingut, funcionament o polítiques d’aquests llocs externs.
            </p>

            <h2>5. Dades de contacte i comunicacions</h2>
            <p>
              Per contactar amb l’organització, podeu utilitzar el correu electrònic {" "}
              <a href="mailto:rocknrostoll@gmail.com">rocknrostoll@gmail.com</a> o els perfils oficials de xarxes
              socials:
            </p>
            <ul>
              <li>
                Instagram: <a href="https://instagram.com/rocknrostoll" target="_blank" rel="noreferrer">@rocknrostoll</a>
              </li>
              <li>
                Facebook: <a href="https://facebook.com/RadioRostoll" target="_blank" rel="noreferrer">RadioRostoll</a>
              </li>
            </ul>

            <h2 id="privadesa">6. Privadesa i protecció de dades</h2>
            <p>
              Recopilem les dades que l’usuari decideix facilitar voluntàriament mitjançant correu electrònic, formulari de
              contacte, o en fer una comanda a la botiga en línia (nom i cognoms, adreça electrònica i, si escau, adreça
              d’enviament). Aquestes dades s’utilitzen exclusivament per gestionar la sol·licitud, comanda o enviament
              corresponent, i no es cedeixen a tercers més enllà del necessari per processar el pagament (vegeu el punt
              següent).
            </p>
            <p>
              Els pagaments de la botiga es processen a través de <b>Stripe</b>, un proveïdor extern de serveis de pagament.
              Stripe rep les dades necessàries per tramitar el cobrament (com el nom, l’adreça electrònica i les dades de la
              targeta) directament de l’usuari, sota la seva pròpia política de privacitat, disponible a{" "}
              <a href="https://stripe.com/es/privacy" target="_blank" rel="noreferrer">stripe.com/es/privacy</a>.
              L’Associació Juvenil Rock’n’Rostoll no emmagatzema ni té accés a les dades de la targeta de pagament.
            </p>
            <p>
              L’usuari pot exercir els seus drets d’accés, rectificació, supressió i oposició sobre les seves dades
              personals contactant a {" "}
              <a href="mailto:rocknrostoll@gmail.com">rocknrostoll@gmail.com</a>.
            </p>

            <h2>7. Cookies</h2>
            <p>
              Aquest lloc web no utilitza cookies pròpies amb finalitats comercials o analítiques. El procés de pagament a
              través de Stripe pot establir les seves pròpies cookies tècniques, necessàries per completar la transacció de
              forma segura, gestionades sota la política de privacitat de Stripe esmentada al punt anterior.
            </p>

            <h2>8. Responsabilitat</h2>
            <p>
              L’organització no es fa responsable dels danys derivats d’interrupcions del servei, errors tècnics o continguts
              obsolets. Tot i això, es procurarà mantenir la informació actualitzada i accessible.
            </p>

            <h2>9. Modificacions</h2>
            <p>
              L’Associació Juvenil Rock’n’Rostoll es reserva el dret de modificar en qualsevol moment el contingut d’aquest lloc
              web o dels presents termes per adaptar-los a noves necessitats o canvis normatius.
            </p>

            <h2>10. Legislació aplicable</h2>
            <p>
              Aquest avís legal es regeix per la legislació espanyola i europea vigent. Qualsevol conflicte derivat de l’ús del
              lloc web serà resolt davant els tribunals competents de les Illes Balears.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
