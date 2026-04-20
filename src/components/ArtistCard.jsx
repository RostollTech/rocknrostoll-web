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
              <h3 style={{margin: "0 0 0.5rem 0", fontSize: "2.2rem", color: "#fff", textTransform: "uppercase", fontWeight: "900", letterSpacing: "1px"}}>{artist.name}</h3>
              <p style={{margin: 0, color: "rgba(255, 255, 255, 0.9)", fontSize: "1.1rem", lineHeight: "1.4", fontStyle: "italic"}}>{artist.description}</p>
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
              
              {artist.spotifyUrl && (
                <div className="artist-modal-links">
                  <a href={artist.spotifyUrl} target="_blank" rel="noopener noreferrer" className="btn-spotify-large">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style={{marginRight: '8px'}}>
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.3 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.54-1.02.72-1.56.3z"/>
                    </svg>
                    Escolta a Spotify
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
