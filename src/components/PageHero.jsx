export default function PageHero({ eyebrow, title, description, className = "", children }) {
  return (
    <section className={`page-hero ${className}`.trim()}>
      <div aria-hidden="true" className="page-hero__image" />
      <div aria-hidden="true" className="page-hero__overlay" />
      <div className="container page-hero__inner">
        {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
        {title ? <h1 className="page-title">{title}</h1> : null}
        {description ? <p className="page-description">{description}</p> : null}
        {children}
      </div>
    </section>
  );
}
