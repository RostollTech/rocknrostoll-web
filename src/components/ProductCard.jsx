import { IS_SHOP_OPEN } from "../utils/shopConfig";

export default function ProductCard({ name, price, image }) {
  return (
    <article className="merch-card">
      <div className="sold-out-container">
        <img src={image} alt={name} loading="lazy" />
        {!IS_SHOP_OPEN && (
          <div className="sold-out-overlay">
            <span className="sold-out-text">No disponible</span>
          </div>
        )}
      </div>
      <div className="merch-content">
        <h3>{name}</h3>
        <p className="merch-price">{price}</p>
      </div>
    </article>
  );
}
