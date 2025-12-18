export default function ProductCard({ name, price, image, url }) {
  return (
    <article className="merch-card">
      <img src={image} alt={name} loading="lazy" />
      <div className="merch-content">
        <h3>{name}</h3>
        <p className="merch-price">{price}</p>
        <div className="merch-actions">
          <a href={url} className="btn-outline" target="_blank" rel="noopener noreferrer">
            Comprar ara!!!
          </a>
        </div>
      </div>
    </article>
  );
}
