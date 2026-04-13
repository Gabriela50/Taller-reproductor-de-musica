import Song from "../models/Song";
import DoublyLinkedPlaylist from "../structures/DoublyLinkedPlaylist";

class PlaylistSeeder {
  public static createDefaultPlaylist(): DoublyLinkedPlaylist {
    const playlist = new DoublyLinkedPlaylist();
    const sharedCover = "/covers/girl-headphones.png";

    const songs = [
      new Song({
        id: "song-1",
        title: "Pink Skies",
        artist: "Petal Dreams",
        duration: "3:24",
        coverUrl: sharedCover,
        audioUrl: "/audio/song-1.mp3",
      }),
      new Song({
        id: "song-2",
        title: "Velvet Heart",
        artist: "Luna Bloom",
        duration: "4:02",
        coverUrl: sharedCover,
        audioUrl: "/audio/song-2.mp3",
      }),
      new Song({
        id: "song-3",
        title: "Crystal Night",
        artist: "Rosé Waves",
        duration: "3:41",
        coverUrl: sharedCover,
        audioUrl: "/audio/song-3.mp3",
      }),
    ];

    songs.forEach((song) => {
      playlist.insertAtEnd(song);
    });

    return playlist;
  }
}

export default PlaylistSeeder;