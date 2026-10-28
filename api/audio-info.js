import { Ytdl } from '@distube/ytdl-core';

const ytdl = new Ytdl();

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Missing video ID' });
  }

  try {
    const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`);
    const format = info.formats.find(f => f.hasAudio && !f.hasVideo && f.container === 'mp4') ||
                   info.formats.find(f => f.hasAudio && !f.hasVideo);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({
      title: info.videoDetails.title,
      author: info.videoDetails.author.name,
      duration: info.videoDetails.lengthSeconds,
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]?.url,
      streamUrl: format ? format.url : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch video info' });
  }
}
