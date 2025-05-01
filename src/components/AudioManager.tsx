'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { addAudioTrack, toggleAudioMute, updateAudioTrack } from '@/store/slices/videoEditorSlice';
import { AudioWaveform } from './AudioWaveform';

interface AudioManagerProps {
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function AudioManager({ onShowToast }: AudioManagerProps) {
  const dispatch = useDispatch();
  const audioTracks = useSelector((state: RootState) => state.videoEditor.audioTracks);
  const [newTrackUrl, setNewTrackUrl] = useState('');
  const [isBackgroundMusic, setIsBackgroundMusic] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTrackId, setDraggedTrackId] = useState<string | null>(null);

  const handleAddTrack = () => {
    if (newTrackUrl.trim()) {
      const newTrack = {
        id: Date.now().toString(),
        url: newTrackUrl,
        startTime: 0,
        endTime: 30,
        muted: false,
        volume: 1,
      };
      dispatch(addAudioTrack(newTrack));
      setNewTrackUrl('');
      onShowToast('Audio track added', 'success');
    }
  };

  const handleVolumeChange = (id: string, volume: number) => {
    dispatch(updateAudioTrack({ id, volume }));
  };

  const handleDragStart = (id: string) => {
    setIsDragging(true);
    setDraggedTrackId(id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedTrackId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedTrackId && draggedTrackId !== targetId) {
      const tracks = [...audioTracks];
      const draggedIndex = tracks.findIndex(track => track.id === draggedTrackId);
      const targetIndex = tracks.findIndex(track => track.id === targetId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [draggedTrack] = tracks.splice(draggedIndex, 1);
        tracks.splice(targetIndex, 0, draggedTrack);
        
        // Update track order in Redux
        tracks.forEach((track, index) => {
          dispatch(updateAudioTrack({ id: track.id, order: index }));
        });
        
        onShowToast('Audio track reordered', 'success');
      }
    }
  };

  return (
    <div className="bg-white/90 rounded-2xl shadow-xl p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728" />
        </svg>
        Audio Tracks
      </h2>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTrackUrl}
            onChange={(e) => setNewTrackUrl(e.target.value)}
            placeholder="Enter audio URL"
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={handleAddTrack}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
          >
            Add Track
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="backgroundMusic"
            checked={isBackgroundMusic}
            onChange={(e) => setIsBackgroundMusic(e.target.checked)}
            className="w-4 h-4 text-indigo-500"
          />
          <label htmlFor="backgroundMusic" className="text-sm text-gray-600">
            Add as background music
          </label>
        </div>

        <div className="space-y-4">
          {audioTracks.map((track) => (
            <div
              key={track.id}
              draggable
              onDragStart={() => handleDragStart(track.id)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, track.id)}
              className={`p-4 bg-gray-50 rounded-lg border border-gray-200 transition-all ${
                isDragging && draggedTrackId === track.id ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <div className="text-sm text-gray-700 font-semibold">
                    Track {track.id.slice(-4)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {track.startTime}s - {track.endTime}s
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={track.volume}
                    onChange={(e) => handleVolumeChange(track.id, Number(e.target.value))}
                    className="w-24"
                  />
                  <button
                    onClick={() => {
                      dispatch(toggleAudioMute(track.id));
                      onShowToast(track.muted ? 'Track unmuted' : 'Track muted', 'info');
                    }}
                    className={`px-3 py-1 rounded ${
                      track.muted
                        ? 'bg-gray-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {track.muted ? 'Unmute' : 'Mute'}
                  </button>
                </div>
              </div>
              <AudioWaveform
                audioUrl={track.url}
                muted={track.muted}
                volume={track.volume}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 