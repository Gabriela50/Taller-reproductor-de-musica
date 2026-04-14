import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import Song from "../../domain/models/Song";
import PlaylistSeeder from "../../domain/services/PlaylistSeeder";

type InsertMode = "start" | "end" | "position";

function HomePage() {
  const playlist = useMemo(() => PlaylistSeeder.createDefaultPlaylist(), []);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const appVisual = "/covers/girl-headphones.png";

  const [songs, setSongs] = useState<Song[]>(() => playlist.toArray());
  const [currentSong, setCurrentSong] = useState<Song | null>(() =>
    playlist.getCurrentSong()
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [duration, setDuration] = useState("3:00");
  const [position, setPosition] = useState("0");
  const [insertMode, setInsertMode] = useState<InsertMode>("end");

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.pause();
    audioRef.current.load();
    setIsPlaying(false);
  }, [currentSong]);

  const refreshPlaylistState = () => {
    setSongs([...playlist.toArray()]);
    setCurrentSong(playlist.getCurrentSong());
  };

  const createSong = (): Song => {
    return new Song({
      id: `song-${Date.now()}`,
      title: title.trim(),
      artist: artist.trim(),
      duration: duration.trim() || "3:00",
      coverUrl: appVisual,
      audioUrl: "",
    });
  };

  const handleAddSong = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !artist.trim()) {
      return;
    }

    const newSong = createSong();

    if (insertMode === "start") {
      playlist.insertAtStart(newSong);
    } else if (insertMode === "end") {
      playlist.insertAtEnd(newSong);
    } else {
      playlist.insertAtPosition(newSong, Number(position || 0));
    }

    setTitle("");
    setArtist("");
    setDuration("3:00");
    setPosition("0");

    refreshPlaylistState();
  };

  const handleNext = () => {
    const nextSong = playlist.moveNext();
    setCurrentSong(nextSong);
  };

  const handlePrevious = () => {
    const previousSong = playlist.movePrevious();
    setCurrentSong(previousSong);
  };

  const handleSelectSong = (index: number) => {
    const selectedSong = playlist.setCurrentByIndex(index);
    setCurrentSong(selectedSong);
  };

  const handleDeleteSong = (index: number) => {
    playlist.removeAtPosition(index);
    refreshPlaylistState();
  };

  const handlePlayPause = async () => {
    if (!audioRef.current || !currentSong?.audioUrl) {
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const hasAudio = Boolean(currentSong?.audioUrl);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <img
            src={appVisual}
            alt="Logo de PetalPlay"
            className="brand-logo"
          />

          <div>
            <p className="eyebrow">Elegant Music Player</p>
            <h1>PetalPlay</h1>
            <p className="brand-text">Reproductor para tu día a día.</p>
          </div>
        </div>

        <div className="hero-badge">{songs.length} canciones</div>
      </header>

      <section className="featured-grid">
        <article className="panel now-playing-panel">
          <div className="cover-box">
            <img
              src={currentSong?.coverUrl || appVisual}
              alt={currentSong ? `Portada de ${currentSong.title}` : "Portada"}
              className="cover-image"
            />
          </div>

          <div className="now-playing-info">
            <p className="panel-label">Now Playing</p>

            {currentSong ? (
              <>
                <h2>{currentSong.title}</h2>
                <p className="artist-name">{currentSong.artist}</p>
                <p className="duration-text">{currentSong.duration}</p>
              </>
            ) : (
              <>
                <h2>Sin canción actual</h2>
                <p className="artist-name">Agrega una canción a la lista</p>
              </>
            )}

            <div className="controls">
              <button type="button" onClick={handlePrevious}>
                ⟵ Anterior
              </button>

              <button
                type="button"
                onClick={handlePlayPause}
                disabled={!hasAudio}
              >
                {isPlaying ? "Pausar" : "Reproducir"}
              </button>

              <button type="button" onClick={handleNext}>
                Siguiente ⟶
              </button>
            </div>

            {currentSong && hasAudio ? (
              <audio
                ref={audioRef}
                className="audio-player"
                controls
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              >
                <source src={currentSong.audioUrl} />
                Tu navegador no soporta audio.
              </audio>
            ) : (
              <p className="empty-text">
                Esta canción no tiene audio cargado.
              </p>
            )}
          </div>
        </article>

        <aside className="panel visual-panel">
          <img
            src={appVisual}
            alt="Imagen principal de PetalPlay"
            className="main-visual"
          />

          <div className="visual-copy">
            <p className="panel-label">Signature Visual</p>
            <h2>Soft, cool & premium</h2>
            <p>Todavía tienes suficiente tiempo para escuchar música.</p>
          </div>
        </aside>
      </section>

      <section className="bottom-grid">
        <article className="panel playlist-panel">
          <div className="panel-header">
            <div>
              <p className="panel-label">Playlist</p>
              <h2>Lista de reproducción</h2>
            </div>
          </div>

          {songs.length === 0 ? (
            <p className="empty-text">No hay canciones en la lista.</p>
          ) : (
            <div className="song-list">
              {songs.map((song, index) => {
                const isActive = currentSong?.id === song.id;

                return (
                  <div
                    key={song.id}
                    className={`song-row ${isActive ? "active-song" : ""}`}
                  >
                    <button
                      type="button"
                      className="song-main-button"
                      onClick={() => handleSelectSong(index)}
                    >
                      <span className="song-index">{index}</span>

                      <div className="song-details">
                        <strong>{song.title}</strong>
                        <span>
                          {song.artist} · {song.duration}
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDeleteSong(index)}
                    >
                      Eliminar
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </article>

        <article className="panel form-panel">
          <div className="panel-header">
            <div>
              <p className="panel-label">Manage Playlist</p>
              <h2>Agregar canción</h2>
            </div>
          </div>

          <form className="song-form" onSubmit={handleAddSong}>
            <div className="input-group">
              <label htmlFor="title">Título</label>
              <input
                id="title"
                type="text"
                placeholder="Ej. Moonlight Bloom"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="artist">Artista</label>
              <input
                id="artist"
                type="text"
                placeholder="Ej. Luna Rose"
                value={artist}
                onChange={(event) => setArtist(event.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="duration">Duración</label>
              <input
                id="duration"
                type="text"
                placeholder="3:45"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="insertMode">Insertar en</label>
              <select
                id="insertMode"
                value={insertMode}
                onChange={(event) =>
                  setInsertMode(event.target.value as InsertMode)
                }
              >
                <option value="start">Inicio</option>
                <option value="end">Final</option>
                <option value="position">Posición específica</option>
              </select>
            </div>

            <div className="input-group full-width">
              <label htmlFor="position">Posición</label>
              <input
                id="position"
                type="number"
                min="0"
                value={position}
                onChange={(event) => setPosition(event.target.value)}
                disabled={insertMode !== "position"}
              />
            </div>

            <div className="form-actions">
              <button type="submit">Agregar canción</button>
            </div>
          </form>
        </article>
      </section>
    </main>
  );
}

export default HomePage;