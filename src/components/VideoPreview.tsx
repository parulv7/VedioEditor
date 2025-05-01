'use client';

import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { CustomVideoPlayer } from './CustomVideoPlayer';

interface VideoPreviewProps {
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function VideoPreview({ onShowToast }: VideoPreviewProps) {
  const videoUrl = useSelector((state: RootState) => state.videoEditor.videoUrl);
  const subtitles = useSelector((state: RootState) => state.videoEditor.subtitles);
  const overlays = useSelector((state: RootState) => state.videoEditor.overlays);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
  };

  const handleRender = () => {
    if (!videoUrl) {
      onShowToast('Please upload a video first', 'error');
      return;
    }
    setIsRendering(true);
    setRenderProgress(0);
    const interval = setInterval(() => {
      setRenderProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRendering(false);
          onShowToast('Video rendered successfully', 'success');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDownload = () => {
    if (!videoUrl) {
      onShowToast('Please upload a video first', 'error');
      return;
    }
    // Simulate download
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'edited-video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Video downloaded', 'success');
  };

  const visibleSubtitles = subtitles.filter(
    (subtitle) => currentTime >= subtitle.startTime && currentTime <= subtitle.endTime
  );

  const visibleOverlays = overlays.filter(
    (overlay) => currentTime >= 0 && currentTime <= duration
  );

  return (
    <div className="bg-white/90 rounded-2xl shadow-xl p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Video Preview
      </h2>
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {videoUrl ? (
          <div className="relative">
            <CustomVideoPlayer
              src={videoUrl}
              onTimeUpdate={handleTimeUpdate}
              onDurationChange={handleDurationChange}
            />
            {visibleSubtitles.map((subtitle) => (
              <div
                key={subtitle.id}
                className={`absolute left-0 right-0 text-center p-2 ${
                  subtitle.position === 'top' ? 'top-0' : 'bottom-0'
                }`}
                style={{
                  fontFamily: subtitle.font,
                  color: subtitle.color,
                  fontSize: `${subtitle.size}px`,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                {subtitle.text}
              </div>
            ))}
            {visibleOverlays.map((overlay) => (
              <div
                key={overlay.id}
                className={`absolute ${overlay.style === 'border' ? 'border-2 border-indigo-500' : ''} ${
                  overlay.style === 'shadow' ? 'shadow-lg' : ''
                } ${overlay.style === 'glow' ? 'shadow-[0_0_10px_rgba(99,102,241,0.5)]' : ''}`}
                style={{
                  left: overlay.position.x,
                  top: overlay.position.y,
                  width: overlay.size.width,
                  height: overlay.size.height,
                  opacity: overlay.opacity,
                }}
              >
                {overlay.type === 'text' ? (
                  <div className="w-full h-full flex items-center justify-center text-center p-2">
                    {overlay.content}
                  </div>
                ) : (
                  <img
                    src={overlay.content}
                    alt="Overlay"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Upload a video to preview
          </div>
        )}
      </div>
      {videoUrl && (
        <div className="mt-4 space-y-4">
          {isRendering ? (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all"
                  style={{ width: `${renderProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                Rendering video... {renderProgress}%
              </p>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleRender}
                className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
              >
                Render Video
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Download
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 