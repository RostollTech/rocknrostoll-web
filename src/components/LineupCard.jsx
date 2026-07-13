import "./LineupCard.css";

export default function LineupCard({ artist }) {
  const stageLabel = artist.stage === "rock" ? "Escenari Rock" : "Escenari Safareig";
  const isDesignedPoster = Boolean(artist.photo);

  return (
    <article className={`lineup-poster stage-${artist.stage}`}>
      {isDesignedPoster ? (
        <div className="lineup-poster-photo">
          <img src={artist.photo} alt={`Cartell ${artist.name}`} loading="lazy" />
        </div>
      ) : (
        <div className="lineup-poster-frame">
          <div className="lineup-poster-top">
            <span className="lineup-poster-place">
              Maria de la Salut
              <br />
              Son Perot
            </span>
            <span className="lineup-poster-date">
              29
              <br />
              AGT
            </span>
          </div>

          <span className="lineup-poster-brand">Rock 'n' Rostoll</span>

          <div className="lineup-poster-bottom">
            <span className="lineup-poster-stage-tag">{stageLabel}</span>
            <h3 className="lineup-poster-name">{artist.name}</h3>
          </div>
        </div>
      )}

      <div className="lineup-card-info">
        {isDesignedPoster && <h3 className="lineup-card-name">{artist.name}</h3>}
        {artist.time && <p className="lineup-card-time">🕒 {artist.time}</p>}
        <div className="lineup-card-genres">
          {artist.origin && <span className="artist-badge-primary">{artist.origin}</span>}
          {artist.genres?.map((genre) => (
            <span key={genre} className="artist-badge-secondary">{genre}</span>
          ))}
        </div>
        <p className="lineup-card-desc">{artist.description}</p>
        {artist.instagramLinks ? (
          <div className="lineup-card-ig-group">
            {artist.instagramLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="lineup-card-ig"
              >
                {link.label} →
              </a>
            ))}
          </div>
        ) : (
          artist.instagramUrl && (
            <a
              href={artist.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="lineup-card-ig"
            >
              Segueix a Instagram →
            </a>
          )
        )}
      </div>
    </article>
  );
}
