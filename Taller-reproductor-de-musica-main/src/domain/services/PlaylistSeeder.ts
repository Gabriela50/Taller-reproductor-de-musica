import Song from "../models/Song";
import DoublyLinkedPlaylist from "../structures/DoublyLinkedPlaylist";

class PlaylistSeeder {
  public static createDefaultPlaylist(): DoublyLinkedPlaylist {
    const playlist = new DoublyLinkedPlaylist();

    const songs = [
      new Song({
        id: "song-1",
        title: "Battle Theme",
        artist: "King Moses",
        duration: "3:20",
        coverUrl: "/covers/girl-headphones.png",
        audioUrl: "/audio/song1.mp3",
      }),
      new Song({
        id: "song-2",
        title: "King Of Kings",
        artist: "Wrenwest25",
        duration: "3:45",
        coverUrl: "/covers/girl-headphones.png",
        audioUrl: "/audio/song2.mp3",
      }),
      new Song({
        id: "song-3",
        title: "Our Kingdom",
        artist: "Twowingbeats",
        duration: "3:10",
        coverUrl: "/covers/girl-headphones.png",
        audioUrl: "/audio/song3.mp3",
      }),
    ];

    songs.forEach((song) => {
      playlist.insertAtEnd(song);
    });

    return playlist;
  }
}

export default PlaylistSeeder;