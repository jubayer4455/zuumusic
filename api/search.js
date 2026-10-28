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
    // Use 160kbps AAC for instantaneous buffering & full fidelity
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

  const query = req.query.q || req.query.query || '';
  const limit = parseInt(req.query.limit || '20', 10);

  if (!query || !query.trim()) {
    return res.status(200).json({ results: [] });
  }

  const cleanQuery = query.trim();

  // Helper with 2500ms timeout to avoid hanging cold starts
  const fetchWithTimeout = async (url, options = {}, timeoutMs = 2500) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      return response;
    } catch (e) {
      clearTimeout(timer);
      return null;
    }
  };

  try {
    // 1. Query JioSaavn (full 3-4 min regional & Asian audio) and iTunes (global Western catalog) simultaneously
    const jioUrl = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&cc=in&p=1&n=${limit}&q=${encodeURIComponent(cleanQuery)}`;
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(cleanQuery)}&entity=song&limit=${limit}`;

    const [jioRes, itunesRes] = await Promise.allSettled([
      fetchWithTimeout(jioUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        }
      }, 2500),
      fetchWithTimeout(itunesUrl, {
        headers: { 'Accept': 'application/json' }
      }, 2500)
    ]);

    const formattedTracks = [];
    const seenTitles = new Set();

    // Process JioSaavn tracks (full 3-4 min 160k/320k streams)
    if (jioRes.status === 'fulfilled' && jioRes.value && jioRes.value.ok) {
      try {
        const jioData = await jioRes.value.json();
        const rawResults = jioData.results || [];
        for (let i = 0; i < rawResults.length; i++) {
          const item = rawResults[i];
          let audioUrl = '';
          if (item.encrypted_media_url) {
            audioUrl = decryptMediaUrl(item.encrypted_media_url);
          } else if (item.media_preview_url) {
            audioUrl = item.media_preview_url;
          }

          if (!audioUrl) continue;

          const title = cleanSongTitle(decodeHtmlEntities(item.song));
          const artist = decodeHtmlEntities(item.primary_artists || item.singers || "Artist");
          const dedupKey = `${title.toLowerCase()}_${artist.toLowerCase()}`;
          seenTitles.add(dedupKey);

          const durationSec = parseInt(item.duration, 10) || 210;
          const cover = item.image 
            ? item.image.replace('150x150', '500x500') 
            : "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80";

          formattedTracks.push({
            id: `song-${item.id || i}`,
            trackId: item.id,
            youtubeId: POPULAR_YOUTUBE_IDS[i % POPULAR_YOUTUBE_IDS.length],
            isAudius: false,
            isYouTube: false,
            title,
            artist,
            album: decodeHtmlEntities(item.album || "Single"),
            cover,
            duration: formatDurationSeconds(durationSec),
            durationSec,
            audioUrl,
            fallbackUrl: audioUrl,
            plays: `${parseInt(item.play_count || 1500000, 10).toLocaleString()} plays`,
            dateAdded: item.year || "Official",
            genre: (item.language || "pop").toLowerCase()
          });
        }
      } catch (e) {
        console.warn("Jio parsing notice:", e.message);
      }
    }

    // Process iTunes tracks (for Western, Pop, Hip-Hop, Alan Walker, Drake, Ed Sheeran, etc.)
    if (itunesRes.status === 'fulfilled' && itunesRes.value && itunesRes.value.ok) {
      try {
        const itunesData = await itunesRes.value.json();
        const itunesItems = itunesData.results || [];

        for (let i = 0; i < itunesItems.length; i++) {
          const item = itunesItems[i];
          if (!item.previewUrl && !item.trackName) continue;

          const title = cleanSongTitle(item.trackName || "Track");
          const artist = item.artistName || "Artist";
          const dedupKey = `${title.toLowerCase()}_${artist.toLowerCase()}`;

          // Avoid duplicating identical tracks already provided by full audio source
          if (seenTitles.has(dedupKey)) continue;
          seenTitles.add(dedupKey);

          const cover = item.artworkUrl100 
            ? item.artworkUrl100.replace('100x100bb', '600x600bb')
            : "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80";

          const durationSec = Math.floor((item.trackTimeMillis || 210000) / 1000);

          // If JioSaavn has audio matching this title, link it for full duration
          const matchingJio = formattedTracks.find(t => 
            t.title.toLowerCase().includes(title.toLowerCase()) || 
            title.toLowerCase().includes(t.title.toLowerCase())
          );
          const finalAudio = matchingJio ? matchingJio.audioUrl : (item.previewUrl || "https://discoveryprovider.audius.co/v1/tracks/W08NKdZ/stream?app_name=zuu_music");

          formattedTracks.push({
            id: `itunes-${item.trackId || i}`,
            trackId: item.trackId,
            youtubeId: POPULAR_YOUTUBE_IDS[i % POPULAR_YOUTUBE_IDS.length],
            isAudius: false,
            isYouTube: false,
            title,
            artist,
            album: item.collectionName || "Single",
            cover,
            duration: formatDurationSeconds(durationSec),
            durationSec,
            audioUrl: finalAudio,
            fallbackUrl: finalAudio,
            plays: `${(Math.floor(Math.random() * 8000000) + 1200000).toLocaleString()} plays`,
            dateAdded: item.releaseDate ? new Date(item.releaseDate).getFullYear() + '' : "Official",
            genre: (item.primaryGenreName || "pop").toLowerCase()
          });
        }
      } catch (e) {
        console.warn("iTunes parsing notice:", e.message);
      }
    }

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json({ results: formattedTracks });
  } catch (err) {
    console.warn("Universal search API error:", err.message);
    return res.status(200).json({ results: [] });
  }
}
