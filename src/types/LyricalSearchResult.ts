export type LyricSearchResult = {
  id: number;
  name: string;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number; // in seconds
  instrumental: boolean;
  plainLyrics: string; // unformatted lyrics
  syncedLyrics: string; // formatted lyrics with timestamps. Each line is in the form of [mm:ss.xx] text
};
