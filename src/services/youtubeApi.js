// YouTube Data API v3 Client
export const YOUTUBE_API_KEY = "AIzaSyCL2U45KILJGgxvYqDDPjGbB0mNgXBRRPg";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

// In-memory cache to optimize quota
const searchCache = new Map();

// Helper to decode HTML entities in titles
export const decodeHtmlEntities = (text) => {
  if (!text) return "";
  const doc = new DOMParser().parseFromString(text, 'text/html');
  return doc.body.textContent || text;
};

// Helper to parse ISO 8601 duration (e.g. PT4M13S) to seconds & formatted string
export const parseISO8601Duration = (durationStr) => {
  if (!durationStr) return { seconds: 180, formatted: "3:00" };
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return { seconds: 180, formatted: "3:00" };

  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const formattedMinutes = hours > 0 ? `${hours * 60 + minutes}` : `${minutes}`;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return {
    seconds: totalSeconds,
    formatted: `${formattedMinutes}:${formattedSeconds}`
  };
};

/**
 * Search YouTube for music tracks
 */
export const searchYouTubeMusic = async (query, maxResults = 20) => {
  if (!query || !query.trim()) return [];

  const cacheKey = `search_${query.trim().toLowerCase()}_${maxResults}`;
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey);
  }

  try {
    const musicQuery = encodeURIComponent(`${query.trim()} song audio`);
    const searchUrl = `${BASE_URL}/search?part=snippet&maxResults=${maxResults}&q=${musicQuery}&type=video&videoCategoryId=10&key=${YOUTUBE_API_KEY}`;
    
    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(`YouTube Search API error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      // Fallback: search without category constraint
      const fallbackUrl = `${BASE_URL}/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query.trim())}&type=video&key=${YOUTUBE_API_KEY}`;
      const fbResponse = await fetch(fallbackUrl);
      const fbData = await fbResponse.json();
      return formatSearchResults(fbData.items || []);
    }

    const formattedTracks = formatSearchResults(data.items);
    searchCache.set(cacheKey, formattedTracks);
    return formattedTracks;
  } catch (error) {
    console.error("YouTube search error:", error);
    return [];
  }
};

/**
 * Fetch YouTube Trending / Most Popular Music
 */
export const fetchTrendingYouTubeMusic = async (maxResults = 20) => {
  const cacheKey = `trending_${maxResults}`;
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey);
  }

  try {
    const url = `${BASE_URL}/videos?part=snippet,contentDetails,statistics&chart=mostPopular&videoCategoryId=10&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`YouTube Trending API error: ${response.status}`);

    const data = await response.json();
    const formattedTracks = (data.items || []).map((item) => {
      const durationInfo = parseISO8601Duration(item.contentDetails?.duration);
      return {
        id: `yt-${item.id}`,
        youtubeId: item.id,
        isYouTube: true,
        title: cleanSongTitle(decodeHtmlEntities(item.snippet.title)),
        artist: decodeHtmlEntities(item.snippet.channelTitle),
        album: "YouTube Trending",
        cover: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
        duration: durationInfo.formatted,
        durationSec: durationInfo.seconds,
        plays: formatViewCount(item.statistics?.viewCount),
        dateAdded: "Trending Now",
        genre: "trending"
      };
    });

    searchCache.set(cacheKey, formattedTracks);
    return formattedTracks;
  } catch (error) {
    console.error("Fetch trending error:", error);
    return [];
  }
};

// Clean titles from noisy metadata like "(Official Music Video)", "[4K]", etc.
export const cleanSongTitle = (rawTitle) => {
  return rawTitle
    .replace(/\s*\(Official\s*(?:Music\s*)?(?:Video|Audio|Lyric\s*Video|HD|4K|Visualizer)?\)/gi, '')
    .replace(/\s*\[Official\s*(?:Music\s*)?(?:Video|Audio|Lyric\s*Video|HD|4K|Visualizer)?\]/gi, '')
    .replace(/\s*\(Audio\)/gi, '')
    .replace(/\s*\[Audio\]/gi, '')
    .replace(/\s*\(Lyrics\)/gi, '')
    .replace(/\s*\|.*$/g, '')
    .trim();
};

const formatSearchResults = (items) => {
  return items.map((item, index) => {
    const videoId = item.id?.videoId || item.id;
    return {
      id: `yt-${videoId}`,
      youtubeId: videoId,
      isYouTube: true,
      title: cleanSongTitle(decodeHtmlEntities(item.snippet.title)),
      artist: decodeHtmlEntities(item.snippet.channelTitle),
      album: "YouTube Music",
      cover: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      duration: "3:30",
      durationSec: 210,
      plays: "Live Stream",
      dateAdded: "YouTube",
      genre: "youtube"
    };
  });
};

const formatViewCount = (count) => {
  if (!count) return "1,000,000+";
  const num = parseInt(count, 10);
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B plays`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M plays`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K plays`;
  return `${num} plays`;
};
