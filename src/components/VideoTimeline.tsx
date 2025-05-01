'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { addScene, removeScene, updateScene } from '@/store/slices/videoEditorSlice';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRef, useState } from 'react';

interface VideoTimelineProps {
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const ItemType = { SCENE: 'scene' };

function FrameMarker({ time }: { time: number }) {
  return (
    <div className="absolute h-full w-px bg-gray-300" style={{ left: `${time}%` }}>
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
        {time}s
      </div>
    </div>
  );
}

function DraggableScene({ scene, index, moveScene, onRemove, onUpdate, onShowToast }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [trimStart, setTrimStart] = useState(scene.startTime);
  const [trimEnd, setTrimEnd] = useState(scene.endTime);

  const [, drop] = useDrop({
    accept: ItemType.SCENE,
    hover(item: any) {
      if (!ref.current || item.index === index) return;
      moveScene(item.index, index);
      item.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.SCENE,
    item: { index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));

  const handleTrimUpdate = () => {
    if (trimStart >= trimEnd) {
      onShowToast('Start time must be less than end time', 'error');
      return;
    }
    onUpdate(scene.id, { startTime: trimStart, endTime: trimEnd });
    setIsEditing(false);
    onShowToast('Scene updated', 'success');
  };

  return (
    <div
      ref={ref}
      className={`relative flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow transition-all mb-2 border border-gray-200 ${
        isDragging ? 'opacity-50 ring-2 ring-indigo-400' : ''
      }`}
      style={{ cursor: 'grab' }}
    >
      <div className="flex-1">
        <div className="text-sm text-gray-700 font-semibold flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16M4 14h16" />
          </svg>
          Scene {scene.id.slice(-4)}
        </div>
        <div className="relative h-8 mt-2 bg-gray-200 rounded">
          <div
            className="absolute h-full bg-indigo-500 rounded"
            style={{
              left: `${(scene.startTime / 60) * 100}%`,
              width: `${((scene.endTime - scene.startTime) / 60) * 100}%`,
            }}
          />
          {isEditing && (
            <div className="absolute inset-0 flex items-center">
              <input
                type="range"
                min="0"
                max="60"
                value={trimStart}
                onChange={(e) => setTrimStart(Number(e.target.value))}
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max="60"
                value={trimEnd}
                onChange={(e) => setTrimEnd(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {scene.startTime}s - {scene.endTime}s
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded transition-colors"
          title="Edit scene"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        {isEditing && (
          <button
            onClick={handleTrimUpdate}
            className="text-green-500 hover:text-green-700 px-2 py-1 rounded transition-colors"
            title="Save changes"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        )}
        <button
          onClick={() => {
            onRemove(scene.id);
            onShowToast('Scene removed', 'success');
          }}
          className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition-colors"
          title="Remove scene"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function VideoTimeline({ onShowToast }: VideoTimelineProps) {
  const dispatch = useDispatch();
  const scenes = useSelector((state: RootState) => state.videoEditor.scenes);
  const [showMarkers, setShowMarkers] = useState(true);

  const moveScene = (from: number, to: number) => {
    if (from === to) return;
    const updated = [...scenes];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    updated.forEach((scene, idx) => (scene.id = `${scene.id.split('-')[0]}-${idx}`));
    while (scenes.length) dispatch(removeScene(scenes[0].id));
    updated.forEach((scene) => dispatch(addScene(scene)));
    onShowToast('Scene reordered', 'success');
  };

  const handleAddScene = () => {
    const newScene = {
      id: `${Date.now()}-${scenes.length}`,
      startTime: scenes.length * 10,
      endTime: scenes.length * 10 + 10,
    };
    dispatch(addScene(newScene));
    onShowToast('New scene added', 'success');
  };

  const handleRemoveScene = (id: string) => {
    dispatch(removeScene(id));
  };

  const handleUpdateScene = (id: string, updates: { startTime: number; endTime: number }) => {
    dispatch(updateScene({ id, ...updates }));
  };

  return (
    <div className="bg-white/90 rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16M4 14h16" />
          </svg>
          Timeline
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowMarkers(!showMarkers)}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
          >
            {showMarkers ? 'Hide Markers' : 'Show Markers'}
          </button>
          <button
            onClick={handleAddScene}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-semibold shadow"
          >
            + Add Scene
          </button>
        </div>
      </div>
      <div className="relative h-12 bg-gray-100 rounded-lg mb-4">
        {showMarkers && (
          <>
            <FrameMarker time={0} />
            <FrameMarker time={20} />
            <FrameMarker time={40} />
            <FrameMarker time={60} />
          </>
        )}
      </div>
      <DndProvider backend={HTML5Backend}>
        <div className="space-y-2">
          {scenes.map((scene, idx) => (
            <DraggableScene
              key={scene.id}
              scene={scene}
              index={idx}
              moveScene={moveScene}
              onRemove={handleRemoveScene}
              onUpdate={handleUpdateScene}
              onShowToast={onShowToast}
            />
          ))}
        </div>
      </DndProvider>
    </div>
  );
} 