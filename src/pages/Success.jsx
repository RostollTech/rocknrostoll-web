import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";

export default function Success() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [status, setStatus] = useState(sessionId ? "loading" : "no-session");
    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (!sessionId) return;

        let cancelled = false;
        let attempts = 0;

        const poll = async () => {
            attempts += 1;
            try {
                const res = await fetch(`/api/order-status?session_id=${encodeURIComponent(sessionId)}`);
                if (res.ok) {
                    const data = await res.json();
                    if (!cancelled) {
                        setOrder(data);
                        setStatus("ready");
                    }
                    return;
                }
            } catch {
                // ignore, retry below
            }
            // El webhook de Stripe pot trigar uns segons a arribar; reintenta.
            if (!cancelled && attempts < 8) {
                setTimeout(poll, 1500);
            } else if (!cancelled) {
                setStatus("timeout");
            }
        };

        poll();
        return () => { cancelled = true; };
    }, [sessionId]);

    return (
        <>
            <Navbar />
            <main>
                <PageHero
                    title="Pagament Realitzat!"
                    description="Gràcies per col·laborar amb el Rock'n'Rostoll."
                />
                <section className="page-section section-alt" style={{ textAlign: 'center', minHeight: '40vh' }}>
                    <div className="page-content">
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                        <h2>Comanda Confirmada</h2>
                        <p>Hem rebut el teu pagament correctament. Rebràs un correu de confirmació aviat.</p>

                        {status === "loading" && (
                            <p className="section-description">Preparant el teu codi de recollida...</p>
                        )}

                        {status === "ready" && order?.pickupCode && (
                            <div style={{
                                margin: '2rem auto 0',
                                maxWidth: '24rem',
                                padding: '1.5rem',
                                borderRadius: '1rem',
                                border: '2px solid var(--color-accent-yellow)',
                                background: 'rgba(251, 168, 48, 0.08)',
                            }}>
                                <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.85rem', color: 'var(--color-text-soft)' }}>
                                    El teu codi de recollida
                                </p>
                                <p style={{ margin: '0.5rem 0', fontSize: '2.5rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--color-accent-yellow)' }}>
                                    {order.pickupCode}
                                </p>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-soft)' }}>
                                    Fes-ne una captura o apunta'l — l'hauràs de presentar per recollir la comanda en persona.
                                    El lloc i l'horari de recollida s'anunciaran properament per xarxes socials.
                                </p>
                            </div>
                        )}

                        {status === "timeout" && (
                            <p className="section-description">
                                No hem pogut carregar el codi de recollida ara mateix, però la teva comanda ja està confirmada.
                                El podràs consultar més tard, o presentar el rebut de pagament al recollir-la.
                            </p>
                        )}

                        <button
                            onClick={() => navigate('/')}
                            className="btn-primary"
                            style={{ marginTop: '2rem' }}
                        >
                            Tornar a l'Inici
                        </button>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
