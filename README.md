# Timestamped Lyrics

A TypeScript package for fetching and displaying timestamped lyrics for songs. This library provides an easy way to search for lyrics and retrieve synced lyrics with timestamps, perfect for karaoke applications or music players.

## Features

- 🎵 **Search for lyrics** by song title and artist name
- ⏱️ **Timestamped lyrics** with precise timing information
- 🎯 **Duration-based matching** to find the most accurate lyrics
- 🔄 **Synced lyrics parsing** with start/end times for each line
- 📦 **TypeScript support** with full type definitions
- 🎤 **Karaoke-ready** format with properly parsed lyric lines

## Installation

```bash
npm install timestamped-lyrics
```

## Quick Start

```typescript
import { LyricalClient } from 'timestamped-lyrics';

const client = new LyricalClient();

// Search for lyrics
const searchResults = await client.querySongLyrics('Shape of You', 'Ed Sheeran');
console.log(searchResults);

// Get the best matching lyrics (with optional duration filtering)
const lyrics = await client.getLyrics('Shape of You', 'Ed Sheeran', {
  duration: 263, // Optional: duration in seconds for better matching
  syncedOnly: true // Optional: only return results with synced lyrics
});
console.log(lyrics);

// Get parsed lyric lines with timestamps
const lyricLines = await client.getLyricLines('Shape of You', 'Ed Sheeran');
lyricLines.forEach(line => {
  console.log(`${line.start}s - ${line.end}s: ${line.text}`);
});
```

## API Reference

### LyricalClient

The main client class for interacting with the lyrics API.

#### Constructor

```typescript
const client = new LyricalClient(options?: LyricalClientOptions);
```

#### Methods

##### `querySongLyrics(song: string, artist: string, options?: QuerySongOptions): Promise<LyricSearchResult[]>`

Search for lyrics and return up to 20 results.

**Parameters:**
- `song` - The title of the song
- `artist` - The name of the artist
- `options` - Optional query parameters

**Options:**
- `syncedOnly?: boolean` - If true, only returns results with synced lyrics (default: false)

##### `getLyrics(song: string, artist: string, options?: GetLyricsOptions): Promise<LyricSearchResult>`

Get the closest matching lyrics for a song.

**Parameters:**
- `song` - The title of the song
- `artist` - The name of the artist
- `options` - Optional parameters for lyrics retrieval

**Options:**
- `duration?: number` - Optional duration in seconds for better matching
- `syncedOnly?: boolean` - If true, only returns results with synced lyrics (default: false)

##### `getLyricLines(song: string, artist: string, options?: GetLyricsOptions): Promise<LyricLine[]>`

Get parsed synced lyric lines with timestamps.

**Parameters:**
- `song` - The title of the song
- `artist` - The name of the artist
- `options` - Optional parameters (syncedOnly defaults to true for this method)

**Returns:** Array of `LyricLine` objects with start time, end time, and text.

##### `static parseSyncedLyrics(lyrics: LyricSearchResult): LyricLine[]`

Static method to parse synced lyrics from a `LyricSearchResult` object.

### Types

#### `LyricSearchResult`

```typescript
type LyricSearchResult = {
  id: number;
  name: string;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number; // in seconds
  instrumental: boolean;
  plainLyrics: string; // unformatted lyrics
  syncedLyrics: string; // formatted lyrics with timestamps
};
```

#### `LyricLine`

```typescript
type LyricLine = {
  start: number; // start time in seconds
  end: number;   // end time in seconds
  text: string;  // the lyric text
};
```

## Examples

### Basic Usage

```typescript
import { LyricalClient } from 'timestamped-lyrics';

const client = new LyricalClient();

try {
  // Search for multiple results
  const results = await client.querySongLyrics('Bohemian Rhapsody', 'Queen');
  console.log(`Found ${results.length} results`);

  // Get the best match
  const lyrics = await client.getLyrics('Bohemian Rhapsody', 'Queen');
  console.log(`Song: ${lyrics.trackName} by ${lyrics.artistName}`);
  console.log(`Duration: ${lyrics.duration} seconds`);
  
  if (lyrics.syncedLyrics) {
    console.log('Synced lyrics available!');
  }
} catch (error) {
  console.error('Error fetching lyrics:', error.message);
}
```

### Karaoke Application

```typescript
import { LyricalClient } from 'timestamped-lyrics';

const client = new LyricalClient();

async function createKaraokeDisplay(song: string, artist: string) {
  try {
    const lyricLines = await client.getLyricLines(song, artist);
    
    // Display lyrics with timing information
    lyricLines.forEach((line, index) => {
      console.log(`Line ${index + 1}: "${line.text}"`);
      console.log(`  Timing: ${line.start}s to ${line.end}s`);
      console.log(`  Duration: ${line.end - line.start}s`);
    });
    
    return lyricLines;
  } catch (error) {
    console.error('Failed to get karaoke lyrics:', error.message);
    return [];
  }
}

// Usage
createKaraokeDisplay('Yesterday', 'The Beatles');
```

### Duration-Based Matching

```typescript
import { LyricalClient } from 'timestamped-lyrics';

const client = new LyricalClient();

// When you know the exact duration of your audio file
async function getAccurateLyrics(song: string, artist: string, audioDuration: number) {
  try {
    const lyrics = await client.getLyrics(song, artist, {
      duration: audioDuration,
      syncedOnly: true
    });
    
    console.log(`Matched song with ${Math.abs(lyrics.duration - audioDuration)}s difference`);
    return lyrics;
  } catch (error) {
    console.error('No matching lyrics found:', error.message);
    return null;
  }
}
```

## Error Handling

The library throws descriptive errors for common scenarios:

```typescript
try {
  const lyrics = await client.getLyrics('Unknown Song', 'Unknown Artist');
} catch (error) {
  if (error.message.includes('No lyrics found')) {
    console.log('Song not found in database');
  } else if (error.message.includes('Failed to fetch')) {
    console.log('Network error occurred');
  } else if (error.message.includes('No synced lyrics available')) {
    console.log('Song exists but no timestamped lyrics available');
  }
}
```

## Development

### Building

```bash
npm run build
# or
tsc
```

### Testing

```bash
npm test
```

The project uses Jest for testing with TypeScript support.

### Project Structure

```
src/
├── Client.ts              # Main LyricalClient class
└── types/
    ├── LyricLine.ts       # LyricLine type definition
    └── LyricalSearchResult.ts # LyricSearchResult type definition
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Credits

This library uses the [LRCLib API](https://lrclib.net) for fetching lyrics data.