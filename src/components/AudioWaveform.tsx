'use client';

import { useEffect, useRef, useState } from 'react';

interface AudioWaveformProps {
  audioUrl: string;
  muted: boolean;
  volume: number;
}

export function AudioWaveform({ audioUrl, muted, volume }: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setupAudioContext = async () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
        }

        const audio = new Audio(audioUrl);
        audio.volume = volume;
        audio.muted = muted;

        if (!sourceRef.current) {
          sourceRef.current = audioContextRef.current.createMediaElementSource(audio);
        }

        if (!analyserRef.current) {
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 256;
        }

        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);

        audio.addEventListener('loadeddata', () => {
          setIsLoading(false);
          audio.play();
        });

        return () => {
          audio.pause();
          audio.removeEventListener('loadeddata', () => {});
        };
      } catch (error) {
        console.error('Error setting up audio context:', error);
        setIsLoading(false);
      }
    };

    setupAudioContext();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    const drawWaveform = () => {
      if (!canvasRef.current || !analyserRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const analyser = analyserRef.current;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = muted ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.8)';

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }

      animationFrameRef.current = requestAnimationFrame(drawWaveform);
    };

    if (!isLoading) {
      drawWaveform();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isLoading, muted]);

  return (
    <div className="relative h-12 bg-gray-100 rounded-lg p-2">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          width={300}
          height={48}
          className="w-full h-full"
        />
      )}
    </div>
  );
} 