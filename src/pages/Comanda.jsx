import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import productsData from "../data/products.json";
import { Link } from "react-router-dom";
import "../styles/Comanda.css";

export default function Comanda() {
  // State for form user fields
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  // State for cart/quantities. 
  // We initialize based on productsData, excluding "Donatiu" which is special case, 
  // but let's handle "Donatiu" specially in the UI.
  const [cart, setCart] = useState({});
  const [donationAmount, setDonationAmount] = useState(0);

  // Cart initialized as empty. Keys will be "Name_Size" => Quantity.
  const SIZES_KIDS = ["5-6", "7-8", "9-11", "12-13", "14-15"];
  const SIZES_ADULTS = ["S", "M", "L", "XL", "XXL"];

  // New State for Products with Sizes (Hoodies, Packs, etc.)
  // Object: { "ProductName": ["M", "L", ""], ... }
  const [productSelections, setProductSelections] = useState({});

  // Sync productSelections to global cart
  useEffect(() => {
    setCart(prevCart => {
      const newCart = { ...prevCart };

      // We need to manage cart entries for all complex products.
      // We iterate over the keys in productSelections to update them.
      Object.entries(productSelections).forEach(([name, selections]) => {
        // Clear existing entries for this product
        Object.keys(newCart).forEach(key => {
          if (key.startsWith(name + '_')) {
            delete newCart[key];
          }
        });

        // Re-populate based on selections
        selections.forEach(size => {
          const sizeKey = size || "PENDING";
          // If size is 'Única', we could just use that, but for consistency in complex products we use the selected size
          const key = `${name}_${sizeKey}`;
          newCart[key] = (newCart[key] || 0) + 1;
        });
      });

      return newCart;
    });
  }, [productSelections]);

  const updateProductQty = (name, delta) => {
    setProductSelections(prev => {
      const currentList = prev[name] || [];
      if (delta > 0) {
        return { ...prev, [name]: [...currentList, ""] }; // Add empty selection
      } else {
        // Remove last item (LIFO)
        if (currentList.length === 0) return prev;
        const newList = currentList.slice(0, -1);
        // If empty, we can keep the empty array or remove the key. keeping array is fine.
        return { ...prev, [name]: newList };
      }
    });
  };

  const updateProductSize = (name, index, newSize) => {
    setProductSelections(prev => {
      const currentList = [...(prev[name] || [])];
      currentList[index] = newSize;
      return { ...prev, [name]: currentList };
    });
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (productName, size, delta) => {
    const key = `${productName}_${size}`;
    setCart(prev => {
      const currentQty = prev[key] || 0;
      const newQty = Math.max(0, currentQty + delta);

      const newCart = { ...prev, [key]: newQty };
      if (newQty === 0) delete newCart[key]; // Clean up empty entries
      return newCart;
    });
  };

  const cleanPrice = (priceStr) => {
    if (!priceStr) return 0;
    // Remove ' €' and parse
    const num = parseFloat(priceStr.replace(' €', '').replace(',', '.'));
    return isNaN(num) ? 0 : num;
  };

  const calculateTotal = () => {
    let total = 0;

    Object.entries(cart).forEach(([key, qty]) => {
      const [name] = key.split('_');
      const product = productsData.find(p => p.name === name);
      if (product) {
        const price = cleanPrice(product.price);
        total += qty * price;
      }
    });

    // Add donation
    total += parseFloat(donationAmount) || 0;

    return total.toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email) {
      alert("Si us plau, omple tots els camps obligatoris (Nom i Email) per continuar.");
      return;
    }

    const total = calculateTotal();
    if (parseFloat(total) <= 0) {
      alert("La cistella és buida. Afegeix algun producte o un donatiu per continuar.");
      return;
    }

    // Enforce minimum donation of 1€ if a donation is present
    if (donationAmount > 0 && parseFloat(donationAmount) < 1) {
      alert("Si fas un donatiu, l'import mínim ha de ser d'1 €");
      return;
    }

    // Check for unselected sizes in any product
    const unselectedParams = Object.values(productSelections).flat().some(s => !s);
    if (unselectedParams) {
      alert("Si us plau, selecciona la talla per a tots els productes.");
      return;
    }

    // Prepare data for backend
    const items = [];

    Object.entries(cart).forEach(([key, qty]) => {
      if (qty > 0) {
        const lastUnderscoreIndex = key.lastIndexOf('_');
        let name = key;
        let size = "";

        if (lastUnderscoreIndex !== -1) {
          name = key.substring(0, lastUnderscoreIndex);
          size = key.substring(lastUnderscoreIndex + 1);
        }

        const product = productsData.find(p => p.name === name);
        if (product) {
          items.push({
            name: name,
            quantity: qty,
            price: cleanPrice(product.price),
            // Pass size only if it's a real variant (not 'Única')
            size: size === "Única" ? null : size
          });
        }
      }
    });

    try {
      const btn = document.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.innerText = "Processant..."; }

      // Call Vercel Function
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items,
          donation: donationAmount,
          customerEmail: formData.email
        })
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Error backend:", data);
        alert("Error al servidor: " + (data.error || "Desconegut"));
        if (btn) { btn.disabled = false; btn.innerText = "Reintentar"; }
      }

    } catch (error) {
      console.error("Error fetch:", error);
      alert("Error de connexió. Si estàs en local, assegura't que uses 'vercel dev'.");
      const btn = document.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = false; btn.innerText = "Pagar amb Targeta"; }
    }
  };

  return (
    <>
      <SEO
        title="Fes la teva Comanda · Rock’n’Rostoll"
        description="Compra les nostres dessuadores, gorres i bosses oficials o fes un donatiu."
        keywords={["botiga", "comanda", "dessuadora", "gorra", "pagament"]}
        canonicalPath="/comanda"
      />
      <Navbar />
      <main>
        <PageHero
          className="shop-hero"
          eyebrow="Botiga Oficial"
          title="Finalitzar Comanda"
          description="Afegeix els productes que desitgis i fes el pagament de forma segura."
        />

        <section className="page-section section-alt">
          <div className="page-content comanda-layout">

            {/* LEFT COLUMN: ORDER FORM */}
            <div className="comanda-form-container">
              <form id="comanda-form" onSubmit={handleSubmit} className="order-form">

                {/* 1. SELECCIÓ DE PRODUCTES */}
                <div className="form-section">
                  <h3 className="form-title">1. Selecciona els Productes</h3>
                  <div className="products-list">
                    {productsData.map((product, index) => {
                      if (product.name === "Donatiu") return null;

                      const needsSize = product.name.toLowerCase().includes('dessu') || product.name.toLowerCase().includes('pack');

                      // Non-hoodie item (Simple)
                      if (!needsSize) {
                        const key = `${product.name}_Única`;
                        const qty = cart[key] || 0;
                        return (
                          <div key={index} className="order-item">
                            <img src={product.image} alt={product.name} className="order-item-img" />
                            <div className="order-item-details">
                              <div className="order-item-header">
                                <h4 className="order-item-title">{product.name}</h4>
                                <span className="order-item-price">{product.price}</span>
                              </div>
                              <div className="qty-selector">
                                <button type="button" onClick={() => handleQuantityChange(product.name, 'Única', -1)} disabled={qty <= 0}>-</button>
                                <span>{qty}</span>
                                <button type="button" onClick={() => handleQuantityChange(product.name, 'Única', 1)}>+</button>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // Complex item (Multiple Sizes)
                      // Logic: Show Total Quantity -> "Triar Talles" button -> List of Selects
                      const currentSelections = productSelections[product.name] || [];
                      const totalVariantQty = currentSelections.length;

                      return (
                        <div key={index} className="order-item">
                          <img src={product.image} alt={product.name} className="order-item-img" />
                          <div className="order-item-details">
                            <div className="order-item-header">
                              <h4 className="order-item-title">
                                {product.name}
                                <a href="/shop#talles" target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', marginLeft: '0.8rem', color: 'var(--color-primary)', textDecoration: 'underline' }}>(Veure Talles)</a>
                              </h4>
                              <span className="order-item-price">{product.price}</span>
                            </div>

                            {/* Main Quantity Controller */}
                            <div className="qty-row">
                              <span style={{ marginRight: '1rem', fontWeight: '500' }}>Quantitat:</span>
                              <div className="qty-selector">
                                <button type="button" onClick={() => updateProductQty(product.name, -1)} disabled={totalVariantQty <= 0}>-</button>
                                <span>{totalVariantQty}</span>
                                <button type="button" onClick={() => updateProductQty(product.name, 1)}>+</button>
                              </div>
                            </div>

                            {/* List of Select Boxes */}
                            {totalVariantQty > 0 && (
                              <div className="hoodie-sizes-list">
                                <p style={{ marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Selecciona les talles:</p>
                                {currentSelections.map((currentSize, i) => (
                                  <div key={i} className="size-select-row">
                                    <span className="size-label">#{i + 1}</span>
                                    <select
                                      className="form-input size-select"
                                      value={currentSize}
                                      onChange={(e) => updateProductSize(product.name, i, e.target.value)}
                                      required
                                    >
                                      <option value="" disabled>Triar Talla...</option>
                                      <optgroup label="Infantil">
                                        {SIZES_KIDS.map(s => <option key={s} value={s}>{s}</option>)}
                                      </optgroup>
                                      <optgroup label="Adult">
                                        {SIZES_ADULTS.map(s => <option key={s} value={s}>{s}</option>)}
                                      </optgroup>
                                    </select>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Donatiu Section */}
                    <div className="order-item donation-item">
                      <div className="order-item-details" style={{ width: '100%' }}>
                        <h4 className="order-item-title">Vols fer un Donatiu extra?</h4>
                        <p className="description-text">Ajuda'ns a seguir fent renou.</p>
                        <div className="donation-input-group">
                          <span className="currency-symbol">€</span>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                            className="form-input donation-input"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. DADES DEL CLIENT */}
                <div className="form-section">
                  <h3 className="form-title">2. Les teves Dades</h3>
                  <div className="fields-grid">
                    <div className="form-group">
                      <label htmlFor="name">Nom i Cognoms *</label>
                      <input
                        type="text" id="name" name="name"
                        required
                        value={formData.name} onChange={handleUserChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email" id="email" name="email"
                        required
                        value={formData.email} onChange={handleUserChange}
                        className="form-input"
                      />
                    </div>

                  </div>
                </div>

                {/* SUBMIT BUTTON MOBILE */}
                <div className="mobile-submit-btn">
                  <button type="submit" className="btn-primary full-width">
                    Pagar {calculateTotal()}€ Ara
                  </button>
                </div>

              </form>
            </div>

            {/* RIGHT COLUMN: SUMMARY (Desktop Sticky) */}
            <div className="comanda-summary-sidebar">
              <div className="summary-card">
                <h3>Resum de la Comanda</h3>
                <ul className="summary-list">
                  {Object.entries(cart).map(([key, qty]) => {
                    if (qty === 0) return null;

                    const [name, size] = key.split('_');
                    const product = productsData.find(p => p.name === name);
                    const price = cleanPrice(product.price);
                    const totalItem = (qty * price).toFixed(2);
                    const isUnique = size === "Única";

                    return (
                      <li key={key} className="summary-item">
                        <div className="summary-item-top">
                          <span>{qty} x {name}</span>
                          <span>{totalItem}€</span>
                        </div>
                        {!isUnique && <div className="summary-item-meta">Talla: {size}</div>}
                      </li>
                    );
                  })}

                  {parseFloat(donationAmount) > 0 && (
                    <li className="summary-item">
                      <span>Donatiu</span>
                      <span>{parseFloat(donationAmount).toFixed(2)}€</span>
                    </li>
                  )}
                </ul>
                <div className="summary-total">
                  <span>Total</span>
                  <span>{calculateTotal()}€</span>
                </div>
                <div className="desktop-submit-btn">
                  <button type="submit" form="comanda-form" className="btn-primary full-width">
                    Pagar amb Targeta
                  </button>
                </div>
                <p className="secure-note">
                  <span className="lock-icon">🔒</span> Pagament 100% segur processat per Stripe.
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />


    </>
  );
}
