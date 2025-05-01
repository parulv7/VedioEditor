'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { addSubtitle, updateSubtitle } from '@/store/slices/videoEditorSlice';

const FONTS = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana',
];

const COLORS = [
  '#FFFFFF',
  '#000000',
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
];

export function SubtitlesManager() {
  const dispatch = useDispatch();
  const subtitles = useSelector((state: RootState) => state.videoEditor.subtitles);
  const [newSubtitle, setNewSubtitle] = useState({
    text: '',
    startTime: 0,
    endTime: 5,
    position: 'bottom' as const,
    font: 'Arial',
    color: '#FFFFFF',
    size: 16,
  });

  const handleAddSubtitle = () => {
    if (newSubtitle.text.trim()) {
      const subtitle = {
        ...newSubtitle,
        id: Date.now().toString(),
      };
      dispatch(addSubtitle(subtitle));
      setNewSubtitle({
        text: '',
        startTime: 0,
        endTime: 5,
        position: 'bottom',
        font: 'Arial',
        color: '#FFFFFF',
        size: 16,
      });
    }
  };

  const handleUpdateSubtitle = (id: string, updates: Partial<typeof newSubtitle>) => {
    dispatch(updateSubtitle({ id, ...updates }));
  };

  return (
    <div className="bg-white/90 rounded-2xl shadow-xl p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        Subtitles
      </h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <input
            type="text"
            value={newSubtitle.text}
            onChange={(e) => setNewSubtitle({ ...newSubtitle, text: e.target.value })}
            placeholder="Enter subtitle text"
            className="w-full px-3 py-2 border rounded"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Start Time (s)</label>
              <input
                type="number"
                value={newSubtitle.startTime}
                onChange={(e) => setNewSubtitle({ ...newSubtitle, startTime: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">End Time (s)</label>
              <input
                type="number"
                value={newSubtitle.endTime}
                onChange={(e) => setNewSubtitle({ ...newSubtitle, endTime: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Font</label>
              <select
                value={newSubtitle.font}
                onChange={(e) => setNewSubtitle({ ...newSubtitle, font: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              >
                {FONTS.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Color</label>
              <select
                value={newSubtitle.color}
                onChange={(e) => setNewSubtitle({ ...newSubtitle, color: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              >
                {COLORS.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Size</label>
              <input
                type="number"
                value={newSubtitle.size}
                onChange={(e) => setNewSubtitle({ ...newSubtitle, size: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded"
                min="8"
                max="72"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Position</label>
              <select
                value={newSubtitle.position}
                onChange={(e) => setNewSubtitle({ ...newSubtitle, position: e.target.value as 'top' | 'bottom' })}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleAddSubtitle}
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
          >
            Add Subtitle
          </button>
        </div>

        <div className="space-y-2">
          {subtitles.map((subtitle) => (
            <div
              key={subtitle.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div
                className="text-center p-2 rounded"
                style={{
                  fontFamily: subtitle.font,
                  color: subtitle.color,
                  fontSize: `${subtitle.size}px`,
                }}
              >
                {subtitle.text}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {subtitle.startTime}s - {subtitle.endTime}s ({subtitle.position})
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 