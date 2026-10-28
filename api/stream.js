import { Ytdl } from '@distube/ytdl-core';

const ytdl = new Ytdl();
const audioStreamCache = new Map();

async function resolveAudioStream(videoId) {
  if (audioStreamCache.has(videoId)) {
    const entry = audioStreamCache.get(videoId);
    if (Date.now() - entry.time < 3600000) return entry;
  }
  const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`);
  const format = info.formats.find(f => f.hasAudio && !f.hasVideo && f.container === 'mp4') ||
                 info.formats.find(f => f.hasAudio && !f.hasVideo);
  if (!format?.url) throw new Error("No compatible audio format found");
  const data = {
    url: format.url,
    mimeType: format.mimeType?.split(';')[0] || 'audio/mp4',
    title: info.videoDetails.title || 'Audio Track',
    contentLength: format.contentLength,
    time: Date.now()
  };
  audioStreamCache.set(videoId, data);
  return data;
}

export default async function handler(req, res) {
  const { id, download } = req.query;
  if (!id) {
    return res.status(400).send('Missing YouTube video ID');
  }

  try {
    const audioData = await resolveAudioStream(id);
    const upstreamHeaders = {};
    if (req.headers.range) {
      upstreamHeaders['Range'] = req.headers.range;
    }

    const upstream = await fetch(audioData.url, { headers: upstreamHeaders });
    res.statusCode = upstream.status;

    upstream.headers.forEach((val, key) => {
      const k = key.toLowerCase();
      if (['content-type', 'content-length', 'content-range', 'accept-ranges'].includes(k)) {
        res.setHeader(k, val);
      }
    });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (download === '1') {
      const safeTitle = (audioData.title || 'audio').replace(/[^a-zA-Z0-9_\-\s]/g, '');
      res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.mp3"`);
    }

    if (req.method === 'HEAD' || !upstream.body) {
      res.end();
      return;
    }

    const reader = upstream.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  } catch (err) {
    console.error('Audio stream serverless error:', err.message);
    if (!res.headersSent) {
      res.status(500).send(err.message || 'Error streaming audio');
    }
  }
}
