import { useState } from "react";
import "./ArtistCard.css";

export default function ArtistCard({ artist }) {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleClickOutside = (e) => {
    if (e.target.className === "artist-modal-overlay") {
      setModalOpen(false);
    }
  };

  return (
    <>
      <article className="artist-card">
        <div
          className={`artist-card-header ${artist.photo ? 'has-photo' : ''}`}
          style={{
            backgroundColor: artist.photo ? "#111" : (artist.color || "#215b77"),
            ...(artist.photo ? {
              backgroundImage: `url(${artist.photo})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            } : {})
          }}
        >
          {!artist.photo && (
            <>
              <div className="artist-card-rings">
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="artist-initials">{artist.initials}</div>
              </div>
              <div className="artist-header-info">
                <p className="artist-full-name">{artist.name}</p>
                <p className="artist-subtitle">ARTISTA</p>
              </div>
            </>
          )}
        </div>

        <div className="artist-card-body">
          <div className="artist-title-row">
            <h3 className="artist-name">{artist.name}</h3>
            {artist.origin && <span className="artist-badge-primary">{artist.origin}</span>}
          </div>

          <div className="artist-genres">
            {artist.genres?.map(genre => (
              <span key={genre} className="artist-badge-secondary">{genre}</span>
            ))}
          </div>

          <div className="artist-actions">
            <button className="btn-veure-mes" onClick={toggleModal}>
              ⓘ Veure més
            </button>
          </div>
        </div>
      </article>

      {modalOpen && (
        <div className="artist-modal-overlay" onClick={handleClickOutside}>
          <div className="artist-modal-content">
            <button className="artist-modal-close" onClick={toggleModal}>&times;</button>
            <div
              style={{
                backgroundColor: artist.color || "#215b77",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderBottom: "2px solid rgba(0, 0, 0, 0.5)",
                borderRadius: "var(--radius-md) var(--radius-md) 0 0"
              }}
            >
            <div className="artist-modal-header-content">
              <h3 className="artist-modal-name">{artist.name}</h3>
              <p className="artist-modal-short-desc">{artist.description}</p>
            </div>
            </div>
            <div className="artist-modal-body">
              <div className="artist-genres">
                {artist.genres?.map(genre => (
                  <span key={genre} className="artist-badge-secondary">{genre}</span>
                ))}
              </div>

              {artist.youtubeId && (
                <div className="artist-modal-video">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${artist.youtubeId}?rel=0`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              <div className="artist-modal-links" style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap", width: "100%" }}>
                {artist.spotifyUrl && (
                  <a href={artist.spotifyUrl} target="_blank" rel="noopener noreferrer" className="btn-spotify-large">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.3 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.54-1.02.72-1.56.3z" />
                    </svg>
                    <span className="btn-label">Spotify</span>
                  </a>
                )}
                {artist.appleMusicUrl && (
                  <a href={artist.appleMusicUrl} target="_blank" rel="noopener noreferrer" className="btn-apple-large">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M18.89 12.01c-.04-1.93 1.57-2.86 1.64-2.91-1.34-1.96-3.41-2.22-4.14-2.25-1.75-.18-3.41 1.03-4.3 1.03-.89 0-2.25-1.01-3.71-.97-1.92.03-3.69 1.12-4.68 2.84C1.68 13.3 3.19 18.66 5.18 21.53c.97 1.4 2.12 2.97 3.64 2.91 1.46-.06 2.01-.94 3.77-.94 1.76 0 2.26.94 3.79.91 1.58-.03 2.58-1.41 3.55-2.81 1.11-1.62 1.57-3.19 1.59-3.27-.03-.02-3.07-1.18-3.11-4.69zM15.11 4.54c.78-.95 1.31-2.27 1.16-3.59-1.13.04-2.5 0-3.32 1.93-.72.84-1.34 2.18-1.17 3.48 1.25.1 2.54-.87 3.33-1.82z" />
                    </svg>
                    <span className="btn-label">Apple Music</span>
                  </a>
                )}
                {artist.instagramUrl && (
                  <a href={artist.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn-instagram-large">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span className="btn-label">Instagram</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
