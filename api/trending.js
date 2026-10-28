import CryptoJS from 'crypto-js';

const DES_KEY = CryptoJS.enc.Utf8.parse('38346591');

const POPULAR_YOUTUBE_IDS = [
  "jfKfPfyJRdk", "eVli-tstM5E", "hLSwxX9lHkQ", "TUVcZfQe-Kw",
  "4xDzrJKXOOY", "btPJPFnesV4", "JGwWNGJdvx8", "kXYiU_JCYtU",
  "fJ9rUzIMcZQ", "kJQP7kiw5Fk", "MV_3Dpw-BRY", "5qap5aO4i9A"
];

function decryptMediaUrl(encryptedUrl) {
  if (!encryptedUrl) return '';
  try {
    const decrypted = CryptoJS.DES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(encryptedUrl.trim()) },
      DES_KEY,
      { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
    );
    let url = decrypted.toString(CryptoJS.enc.Utf8);
    if (!url) return '';
    return url.replace('_96.mp4', '_160.mp4').replace('_48.mp4', '_160.mp4');
  } catch (err) {
    return '';
  }
}

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function cleanSongTitle(rawTitle) {
  if (!rawTitle) return "Track";
  return rawTitle
    .replace(/\s*\(Official\s*(?:Music\s*)?(?:Video|Audio|Lyric\s*Video|HD|4K|Visualizer)?\)/gi, '')
    .replace(/\s*\[Official\s*(?:Music\s*)?(?:Video|Audio|Lyric\s*Video|HD|4K|Visualizer)?\]/gi, '')
    .replace(/\s*\(Audio\)/gi, '')
    .replace(/\s*\[Audio\]/gi, '')
    .replace(/\s*\(Lyrics\)/gi, '')
    .replace(/\s*\|.*$/g, '')
    .trim();
}

function formatDurationSeconds(totalSeconds) {
  if (!totalSeconds || isNaN(totalSeconds)) return "3:30";
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const limit = parseInt(req.query.limit || '25', 10);

  try {
    // Top 50 Superhits Chart
    const trendingUrl = `https://www.jiosaavn.com/api.php?__call=playlist.getDetails&_format=json&_marker=0&cc=in&listid=1134548194`;
    const response = await fetch(trendingUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Upstream returned ${response.status}`);
    }

    const data = await response.json();
    const songs = data.songs || [];

    const formattedTracks = [];
    for (let i = 0; i < Math.min(songs.length, limit); i++) {
      const item = songs[i];
      let audioUrl = '';
      if (item.encrypted_media_url) {
        audioUrl = decryptMediaUrl(item.encrypted_media_url);
      } else if (item.media_preview_url) {
        audioUrl = item.media_preview_url;
      }

      if (!audioUrl) continue;

      const durationSec = parseInt(item.duration, 10) || 210;
      const cover = item.image 
        ? item.image.replace('150x150', '500x500') 
        : "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80";

      formattedTracks.push({
        id: `chart-${item.id || i}`,
        trackId: item.id,
        youtubeId: POPULAR_YOUTUBE_IDS[i % POPULAR_YOUTUBE_IDS.length],
        isAudius: false,
        isYouTube: false,
        title: cleanSongTitle(decodeHtmlEntities(item.song)),
        artist: decodeHtmlEntities(item.primary_artists || item.singers || "Top Artist"),
        album: "Global & Regional Top Hits 🔥",
        cover,
        duration: formatDurationSeconds(durationSec),
        durationSec,
        audioUrl, // Full 3-5 minute song stream!
        fallbackUrl: audioUrl,
        plays: `${parseInt(item.play_count || 3500000, 10).toLocaleString()} plays`,
        dateAdded: "Top 50 Hits",
        genre: (item.language || "pop").toLowerCase()
      });
    }

    res.setHeader('Cache-Control', 's-maxage=7200, stale-while-revalidate');
    return res.status(200).json({ results: formattedTracks });
  } catch (err) {
    console.warn("Trending API route error:", err.message);
    return res.status(200).json({ results: [] });
  }
}
