import { Ytdl, Quality } from '@distube/ytdl-core';

const ytdl = new Ytdl();

export default async function handler(req, res) {
  const { id, download } = req.query;
  if (!id) {
    return res.status(400).send('Missing YouTube video ID');
  }

  try {
    const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`);
    const format = info.formats.find(f => f.hasAudio && !f.hasVideo && f.container === 'mp4') ||
                   info.formats.find(f => f.hasAudio && !f.hasVideo);

    const contentLength = parseInt(format?.contentLength || '0', 10);
    const range = req.headers.range;

    res.setHeader('Content-Type', format ? format.mimeType.split(';')[0] : 'audio/mp4');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (download === '1') {
      const safeTitle = (info.videoDetails.title || 'audio').replace(/[^a-zA-Z0-9_\-\s]/g, '');
      res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.mp3"`);
    }

    if (range && contentLength > 0) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : contentLength - 1;
      const chunksize = (end - start) + 1;

      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${contentLength}`);
      res.setHeader('Content-Length', chunksize);

      const stream = ytdl.download(`https://www.youtube.com/watch?v=${id}`, {
        quality: Quality.HighestAudio,
        filter: { hasAudio: true, hasVideo: false },
        range: { start, end }
      });
      stream.on('error', () => {
        if (!res.headersSent) res.status(500);
        res.end();
      });
      stream.pipe(res);
    } else {
      if (contentLength > 0) res.setHeader('Content-Length', contentLength);
      res.status(200);
      const stream = ytdl.download(`https://www.youtube.com/watch?v=${id}`, {
        quality: Quality.HighestAudio,
        filter: { hasAudio: true, hasVideo: false }
      });
      stream.on('error', () => {
        if (!res.headersSent) res.status(500);
        res.end();
      });
      stream.pipe(res);
    }
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).send(err.message || 'Error streaming audio');
    }
  }
}
