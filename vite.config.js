import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { Ytdl, Quality } from '@distube/ytdl-core'

const ytdl = new Ytdl();

// Custom Vite plugin to stream YouTube audio directly to HTML5 <audio>
// This enables 100% continuous background playback on mobile when screen is locked or app is minimized!
function youtubeAudioStreamPlugin() {
  const handler = async (req, res, next) => {
    if (req.url && req.url.startsWith('/api/stream')) {
      try {
        const urlObj = new URL(req.url, 'http://localhost');
        const videoId = urlObj.searchParams.get('id');
        if (!videoId) {
          res.statusCode = 400;
          res.end('Missing YouTube video ID');
          return;
        }

        const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`);
        const format = info.formats.find(f => f.hasAudio && !f.hasVideo && f.container === 'mp4') ||
                       info.formats.find(f => f.hasAudio && !f.hasVideo);

        const contentLength = parseInt(format?.contentLength || '0', 10);
        const range = req.headers.range;

        res.setHeader('Content-Type', format ? format.mimeType.split(';')[0] : 'audio/mp4');
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');

        if (urlObj.searchParams.get('download') === '1') {
          const safeTitle = (info.videoDetails.title || 'audio').replace(/[^a-zA-Z0-9_\-\s]/g, '');
          res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.mp3"`);
        }

        if (range && contentLength > 0) {
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : contentLength - 1;
          const chunksize = (end - start) + 1;

          res.statusCode = 206;
          res.setHeader('Content-Range', `bytes ${start}-${end}/${contentLength}`);
          res.setHeader('Content-Length', chunksize);

          const stream = ytdl.download(`https://www.youtube.com/watch?v=${videoId}`, {
            quality: Quality.HighestAudio,
            filter: { hasAudio: true, hasVideo: false },
            range: { start, end }
          });
          stream.on('error', (err) => {
            console.warn('Stream range error:', err.message);
            if (!res.headersSent) res.statusCode = 500;
            res.end();
          });
          stream.pipe(res);
        } else {
          if (contentLength > 0) res.setHeader('Content-Length', contentLength);
          res.statusCode = 200;
          const stream = ytdl.download(`https://www.youtube.com/watch?v=${videoId}`, {
            quality: Quality.HighestAudio,
            filter: { hasAudio: true, hasVideo: false }
          });
          stream.on('error', (err) => {
            console.warn('Stream direct error:', err.message);
            if (!res.headersSent) res.statusCode = 500;
            res.end();
          });
          stream.pipe(res);
        }
      } catch (err) {
        console.error('Audio stream middleware error:', err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end(err.message || 'Error streaming audio');
        }
      }
      return;
    }

    if (req.url && req.url.startsWith('/api/audio-info')) {
      try {
        const urlObj = new URL(req.url, 'http://localhost');
        const videoId = urlObj.searchParams.get('id');
        if (!videoId) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Missing id' }));
          return;
        }
        const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`);
        const format = info.formats.find(f => f.hasAudio && !f.hasVideo && f.container === 'mp4') ||
                       info.formats.find(f => f.hasAudio && !f.hasVideo);

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify({
          title: info.videoDetails.title,
          artist: info.videoDetails.author?.name || 'YouTube Artist',
          duration: parseInt(info.videoDetails.lengthSeconds || '180', 10),
          cover: info.videoDetails.thumbnails?.slice(-1)[0]?.url,
          audioUrl: `/api/stream?id=${videoId}`,
          directFormatUrl: format?.url
        }));
      } catch (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    next();
  };

  return {
    name: 'youtube-audio-stream',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    youtubeAudioStreamPlugin()
  ],
  server: {
    port: 3000,
    host: true
  }
})
