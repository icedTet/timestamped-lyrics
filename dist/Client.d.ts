import { LyricSearchResult } from "./types/LyricalSearchResult";
import { LyricLine } from "./types/LyricLine";
export type LyricalClientOptions = {};
export type QuerySongOptions = {
    syncedOnly?: boolean;
};
export type GetLyricsOptions = {
    duration?: number;
    syncedOnly?: boolean;
};
export declare class LyricalClient {
    options: LyricalClientOptions;
    constructor(options?: LyricalClientOptions);
    /**
     * Search for lyrics of a song by its name and artist. Returns up to 20 results.
     * @param song The title of the song.
     * @param artist The name of the artist.
     * @param options Optional parameters for the query.
     * @returns Promise<LyricSearchResult[]>
     */
    querySongLyrics(song: string, artist: string, options?: QuerySongOptions): Promise<LyricSearchResult[]>;
    /**
     * Get closest matching lyrics for a song by title + artist, optionally filtered by duration.
     * @param song The title of the song.
     * @param artist The name of the artist.
     * @param duration Optional duration of the song in seconds.
     *                    If provided, the function will try to find the closest matching lyrics based on duration
     *                    If not provided, the first matching lyrics will be returned.
     * @returns Promise<LyricSearchResult>
     *
     */
    getLyrics(song: string, artist: string, options?: GetLyricsOptions): Promise<LyricSearchResult>;
    /**
     * Get synced lyric lines for a song by title + artist.
     * This function retrieves the synced lyrics for a song and returns them as an array of LyricLine objects.
     * Each LyricLine object contains the start time, end time, and text of the lyric line.
     * If no synced lyrics are available, an error is thrown.
     * @param song The title of the song.
     * @param artist The name of the artist.
     * @param options Optional parameters for the lyrics retrieval.
     * @returns
     */
    getLyricLines(song: string, artist: string, options?: GetLyricsOptions): Promise<LyricLine[]>;
    /**
     * Parse synced lyrics from a LyricSearchResult object.
     * @param lyrics The LyricSearchResult object containing synced lyrics.
     * @returns LyricLine[] An array of LyricLine objects representing the parsed synced lyrics.
     * @throws Error if no synced lyrics are available or if the format is incorrect.
     * @example
     * const lyrics = await client.getLyrics("Song Title", "Artist Name");
     * const parsedLyrics = LyricalClient.parseSyncedLyrics(lyrics);
     *
     */
    static parseSyncedLyrics(lyrics: LyricSearchResult): LyricLine[];
}
//# sourceMappingURL=Client.d.ts.map