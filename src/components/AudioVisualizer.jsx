import React, { useEffect, useRef } from 'react';
import { useMusic } from '../context/MusicContext';
import { Sparkles, Activity } from 'lucide-react';

export const AudioVisualizer = ({ compact = false, height = 48, barCount = 32 }) => {
  const { isPlaying, analyserNodeRef } = useMusic();
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(barCount);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      const width = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, width, h);

      let hasRealData = false;
      if (analyserNodeRef?.current && isPlaying) {
        try {
          const rawData = new Uint8Array(analyserNodeRef.current.frequencyBinCount);
          analyserNodeRef.current.getByteFrequencyData(rawData);
          // Downsample to barCount
          const step = Math.floor(rawData.length / barCount) || 1;
          for (let i = 0; i < barCount; i++) {
            dataArray[i] = rawData[i * step] || 0;
            if (dataArray[i] > 10) hasRealData = true;
          }
        } catch (e) {
          hasRealData = false;
        }
      }

      // If Web Audio API has no data (or simulated playback), generate realistic rhythmic peaks
      if (!hasRealData) {
        phaseRef.current += isPlaying ? 0.08 : 0.01;
        for (let i = 0; i < barCount; i++) {
          if (isPlaying) {
            const wave1 = Math.sin(phaseRef.current * 1.5 + i * 0.3);
            const wave2 = Math.cos(phaseRef.current * 2.1 + i * 0.15);
            const wave3 = Math.sin(phaseRef.current * 0.7 - i * 0.4);
            const combined = Math.abs(wave1 * 0.5 + wave2 * 0.35 + wave3 * 0.25);
            // Higher energy on bass (lower indices)
            const bassBoost = (barCount - i) / barCount * 0.4 + 0.6;
            dataArray[i] = Math.min(255, Math.floor(combined * 220 * bassBoost));
          } else {
            // Decay gently to a flat warm line when paused
            dataArray[i] = Math.max(4, Math.floor(dataArray[i] * 0.9));
          }
        }
      }

      const barWidth = Math.max(2, (width / barCount) - 2);
      const gradient = ctx.createLinearGradient(0, h, 0, 0);
      gradient.addColorStop(0, '#059669'); // emerald-600
      gradient.addColorStop(0.5, '#1ed760'); // Spotify green
      gradient.addColorStop(1, '#00f2fe'); // Cyan electric glow

      for (let i = 0; i < barCount; i++) {
        const val = dataArray[i];
        const barHeight = Math.max(3, (val / 255) * (h - 4));
        const x = i * (barWidth + 2);
        const y = h - barHeight;

        // Rounded glowing pill bar
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
        ctx.fill();

        // High frequency glow cap
        if (barHeight > 10) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, y - 2, barWidth, 1.5);
        }
      }
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, barCount]);

  return (
    <div className={`relative flex items-center justify-center ${compact ? 'w-28' : 'w-full'}`}>
      <canvas 
        ref={canvasRef} 
        width={compact ? 120 : 360} 
        height={height}
        className="w-full h-full filter drop-shadow-[0_0_8px_rgba(30,215,96,0.4)]"
      />
    </div>
  );
};
