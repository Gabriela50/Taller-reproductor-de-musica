import Song from "../models/Song";

class PlaylistItem {
  public song: Song;
  public next: PlaylistItem | null;
  public previous: PlaylistItem | null;

  constructor(song: Song) {
    this.song = song;
    this.next = null;
    this.previous = null;
  }
}

export default PlaylistItem;