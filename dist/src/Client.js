"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LyricalClient = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
class LyricalClient {
    constructor(options) {
        this.options = options || {};
    }
    /**
     * Search for lyrics of a song by its name and artist. Returns up to 20 results.
     * @param song The title of the song.
     * @param artist The name of the artist.
     * @param options Optional parameters for the query.
     * @returns Promise<LyricSearchResult[]>
     */
    querySongLyrics(song, artist, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { syncedOnly = false } = options || {};
            // Format the song and artist for the search query.
            const search = yield (0, node_fetch_1.default)(`https://lrclib.net/api/search?track_name=${song}&artist_name=${artist}`, {
                headers: {
                    accept: "application/json",
                },
                method: "GET",
            });
            if (!search.ok) {
                throw new Error(`Failed to fetch lyrics for ${song} by ${artist}`);
            }
            const data = (yield search.json());
            if (!data || !data.length) {
                throw new Error(`No lyrics found for ${song} by ${artist}`);
            }
            // Filter results based on syncedOnly flag
            if (syncedOnly) {
                return data.filter((item) => item.syncedLyrics && item.syncedLyrics.length > 0);
            }
            // Return all results if syncedOnly is false
            return data;
        });
    }
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
    getLyrics(song, artist, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { duration, syncedOnly = false } = options || {};
            // Check if songduration is a valid number
            if (duration && typeof duration !== "number") {
                throw new Error("songduration must be a number");
            }
            let data = yield this.querySongLyrics(song, artist);
            if (!data || !data.length) {
                throw new Error(`No lyrics found for ${song} by ${artist}`);
            }
            // find the closest match based on duration, or return the first match
            if (syncedOnly) {
                data = data.filter((item) => item.syncedLyrics && item.syncedLyrics.length > 0);
            }
            let lyric = undefined;
            if (duration) {
                const closestLyric = data.reduce((prev, curr) => {
                    const prevDiff = Math.abs(prev.duration - duration);
                    const currDiff = Math.abs(curr.duration - duration);
                    return currDiff < prevDiff ? curr : prev;
                });
                if (closestLyric) {
                    lyric = closestLyric;
                }
            }
            else if (data.length > 0) {
                lyric = data[0]; // return the first matching lyric if no duration is provided
            }
            if (!lyric) {
                throw new Error(`No lyrics found for ${song} by ${artist}`);
            }
            return lyric;
        });
    }
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
    getLyricLines(song, artist, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { syncedOnly = true, duration } = options || {};
            // Get the lyrics for the song
            const lyrics = yield this.getLyrics(song, artist, {
                duration,
                syncedOnly: true, // always get synced lyrics
            });
            // Parse the synced lyrics from the LyricSearchResult object
            return LyricalClient.parseSyncedLyrics(lyrics);
        });
    }
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
    static parseSyncedLyrics(lyrics) {
        const lyricalLines = [];
        if (!lyrics.syncedLyrics || !lyrics.syncedLyrics.length) {
            throw new Error("No synced lyrics available for this song");
        }
        const lyricalArray = lyrics.syncedLyrics.split("\n");
        let startingLines = [];
        for (const line of lyricalArray) {
            if (!line.trim())
                continue; // skip empty lines
            const match = line.match(/^\[(\d{2}):(\d{2}\.\d{2})\](.*)$/);
            if (!match)
                continue; // skip lines that don't match the format
            const start = Number(match[1]) * 60 + parseFloat(match[2]);
            let text = match[3].trim();
            if (!text)
                text = "🎵"; // ensure text is not empty
            if (text.includes("\n")) {
                text = text.replace(/\n/g, " "); // replace newlines with spaces
            }
            startingLines.push({ line: text, start });
        }
        for (let i = 0; i < startingLines.length; i++) {
            const currentLine = startingLines[i];
            const nextLine = startingLines[i + 1];
            const start = currentLine.start;
            const end = nextLine ? nextLine.start : lyrics.duration; // use duration if no next line
            lyricalLines.push({ start, end, text: currentLine.line });
        }
        return lyricalLines;
    }
}
exports.LyricalClient = LyricalClient;
