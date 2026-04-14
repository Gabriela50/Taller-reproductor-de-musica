export interface SongData {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverUrl: string;
  audioUrl: string;
}

class Song {
  public readonly id: string;
  public readonly title: string;
  public readonly artist: string;
  public readonly duration: string;
  public readonly coverUrl: string;
  public readonly audioUrl: string;
  public isFavorite: boolean;

  constructor(data: SongData) {
    this.id = data.id;
    this.title = data.title;
    this.artist = data.artist;
    this.duration = data.duration;
    this.coverUrl = data.coverUrl;
    this.audioUrl = data.audioUrl;
    this.isFavorite = false;
  }

  public toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }
}

export default Song;