import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";

export default function NotFound() {
    return (
        <>
            <SEO
                title="Pàgina no trobada · Rock’n’Rostoll"
                description="Sembla que t'has perdut en el bosc del rock."
                keywords={["404", "error", "no trobat"]}
                noIndex={true}
            />
            <Navbar />
            <main>
                <PageHero
                    className="hero-not-found"
                    eyebrow="Error 404"
                    title="T'has perdut?"
                    description="Aquesta pàgina no existeix... o s'ha perdut en un mosh pit."
                />
            </main>
            <Footer />
        </>
    );
}
