'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { addOverlay, updateOverlay } from '@/store/slices/videoEditorSlice';

const STYLES = [
  { name: 'None', value: 'none' },
  { name: 'Border', value: 'border' },
  { name: 'Shadow', value: 'shadow' },
  { name: 'Glow', value: 'glow' },
];

export function OverlayManager() {
  const dispatch = useDispatch();
  const overlays = useSelector((state: RootState) => state.videoEditor.overlays);
  const [newOverlay, setNewOverlay] = useState({
    type: 'text' as 'text' | 'image',
    content: '',
    position: { x: 0, y: 0 },
    size: { width: 200, height: 100 },
    style: 'none',
    opacity: 1,
  });

  const handleAddOverlay = () => {
    if (newOverlay.content.trim()) {
      const overlay = {
        ...newOverlay,
        id: Date.now().toString(),
      };
      dispatch(addOverlay(overlay));
      setNewOverlay({
        type: 'text',
        content: '',
        position: { x: 0, y: 0 },
        size: { width: 200, height: 100 },
        style: 'none',
        opacity: 1,
      });
    }
  };

  const handleUpdateOverlay = (id: string, updates: Partial<typeof newOverlay>) => {
    dispatch(updateOverlay({ id, ...updates }));
  };

  const getStyleClasses = (style: string) => {
    switch (style) {
      case 'border':
        return 'border-2 border-indigo-500';
      case 'shadow':
        return 'shadow-lg';
      case 'glow':
        return 'shadow-[0_0_10px_rgba(99,102,241,0.5)]';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white/90 rounded-2xl shadow-xl p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Overlays
      </h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <select
            value={newOverlay.type}
            onChange={(e) => setNewOverlay({ ...newOverlay, type: e.target.value as 'text' | 'image' })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="text">Text Overlay</option>
            <option value="image">Image Overlay</option>
          </select>

          {newOverlay.type === 'text' ? (
            <input
              type="text"
              value={newOverlay.content}
              onChange={(e) => setNewOverlay({ ...newOverlay, content: e.target.value })}
              placeholder="Enter overlay text"
              className="w-full px-3 py-2 border rounded"
            />
          ) : (
            <input
              type="text"
              value={newOverlay.content}
              onChange={(e) => setNewOverlay({ ...newOverlay, content: e.target.value })}
              placeholder="Enter image URL"
              className="w-full px-3 py-2 border rounded"
            />
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Position X</label>
              <input
                type="number"
                value={newOverlay.position.x}
                onChange={(e) => setNewOverlay({ ...newOverlay, position: { ...newOverlay.position, x: Number(e.target.value) } })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Position Y</label>
              <input
                type="number"
                value={newOverlay.position.y}
                onChange={(e) => setNewOverlay({ ...newOverlay, position: { ...newOverlay.position, y: Number(e.target.value) } })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Width</label>
              <input
                type="number"
                value={newOverlay.size.width}
                onChange={(e) => setNewOverlay({ ...newOverlay, size: { ...newOverlay.size, width: Number(e.target.value) } })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Height</label>
              <input
                type="number"
                value={newOverlay.size.height}
                onChange={(e) => setNewOverlay({ ...newOverlay, size: { ...newOverlay.size, height: Number(e.target.value) } })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Style</label>
              <select
                value={newOverlay.style}
                onChange={(e) => setNewOverlay({ ...newOverlay, style: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              >
                {STYLES.map((style) => (
                  <option key={style.value} value={style.value}>
                    {style.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Opacity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={newOverlay.opacity}
                onChange={(e) => setNewOverlay({ ...newOverlay, opacity: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>

          <button
            onClick={handleAddOverlay}
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
          >
            Add Overlay
          </button>
        </div>

        <div className="space-y-2">
          {overlays.map((overlay) => (
            <div
              key={overlay.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div
                className={`relative ${getStyleClasses(overlay.style)}`}
                style={{
                  width: overlay.size.width,
                  height: overlay.size.height,
                  opacity: overlay.opacity,
                  transform: `translate(${overlay.position.x}px, ${overlay.position.y}px)`,
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
              <div className="text-xs text-gray-500 mt-2">
                Position: ({overlay.position.x}, {overlay.position.y})
                Size: {overlay.size.width}x{overlay.size.height}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 