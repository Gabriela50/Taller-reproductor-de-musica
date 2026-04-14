import { useMemo, useRef, useState } from "react";
import PlaylistSeeder from "../../domain/services/PlaylistSeeder";

function HomePage() {
  const playlist = useMemo(() => PlaylistSeeder.createDefaultPlaylist(), []);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [songs, setSongs] = useState(() => playlist.toArray());
  const [currentSong, setCurrentSong] = useState(() => playlist.getCurrentSong());

  const refreshState = () => {
    setSongs([...playlist.toArray()]);
    setCurrentSong(playlist.getCurrentSong());
  };

  const playSong = async () => {
    if (!audioRef.current) return;

    try {
      audioRef.current.pause();
      audioRef.current.load();
      await audioRef.current.play();
    } catch (error) {
      console.error("No se pudo reproducir el audio:", error);
    }
  };

  const nextSong = () => {
    playlist.moveNext();
    refreshState();

    setTimeout(() => {
      void playSong();
    }, 150);
  };

  const previousSong = () => {
    playlist.movePrevious();
    refreshState();

    setTimeout(() => {
      void playSong();
    }, 150);
  };

  const selectSong = (index: number) => {
    playlist.setCurrentByIndex(index);
    refreshState();

    setTimeout(() => {
      void playSong();
    }, 150);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fdf6fb",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          borderRadius: "24px",
          padding: "30px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ color: "#6b2d5c", fontSize: "48px", marginBottom: "10px" }}>
          PetalPlay
        </h1>

        <p style={{ color: "#666", marginBottom: "30px" }}>
          Reproductor para tu día a día
        </p>

        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "center",
            marginBottom: "30px",
            flexWrap: "wrap",
          }}
        >
          <img
            src={currentSong?.coverUrl || "/covers/girl-headphones.png"}
            alt="cover"
            style={{
              width: "180px",
              height: "180px",
              objectFit: "cover",
              borderRadius: "20px",
            }}
          />

          <div style={{ flex: 1, minWidth: "280px" }}>
            <p style={{ color: "#cc6fa3", fontWeight: 700, letterSpacing: "2px" }}>
              NOW PLAYING
            </p>

            <h2 style={{ fontSize: "40px", margin: "10px 0" }}>
              {currentSong?.title || "Sin canción"}
            </h2>

            <p style={{ fontSize: "22px", color: "#666", margin: "8px 0" }}>
              {currentSong?.artist || "-"}
            </p>

            <p style={{ color: "#888", marginBottom: "20px" }}>
              {currentSong?.duration || "0:00"}
            </p>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
              <button type="button" onClick={previousSong}>
                ← Anterior
              </button>

              <button type="button" onClick={() => void playSong()}>
                Reproducir
              </button>

              <button type="button" onClick={nextSong}>
                Siguiente →
              </button>
            </div>

            <audio ref={audioRef} controls style={{ width: "100%" }}>
              <source src={currentSong?.audioUrl} type="audio/mpeg" />
              Tu navegador no soporta audio.
            </audio>
          </div>
        </div>

        <div>
          <h3 style={{ color: "#6b2d5c" }}>Lista de reproducción</h3>

          {songs.map((song, index) => (
            <div
              key={song.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                marginBottom: "10px",
                border: currentSong?.id === song.id ? "2px solid #d97ca6" : "1px solid #eee",
                borderRadius: "14px",
                background: currentSong?.id === song.id ? "#fff0f7" : "#fff",
                gap: "12px",
              }}
            >
              <div>
                <strong>{song.title}</strong>
                <div style={{ color: "#666" }}>
                  {song.artist} · {song.duration}
                </div>
              </div>

              <button type="button" onClick={() => selectSong(index)}>
                Escuchar
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default HomePage;