'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addScene } from '@/store/slices/videoEditorSlice';

interface KeyboardShortcutsProps {
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function KeyboardShortcuts({ onShowToast }: KeyboardShortcutsProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to add scene
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        dispatch(addScene({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          startTime: 0,
          endTime: 10,
        }));
        onShowToast('New scene added', 'success');
      }

      // Ctrl/Cmd + Z to undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        onShowToast('Undo not implemented yet', 'info');
      }

      // Ctrl/Cmd + Y to redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        onShowToast('Redo not implemented yet', 'info');
      }

      // Space to play/pause video
      if (e.key === ' ') {
        e.preventDefault();
        const video = document.querySelector('video');
        if (video) {
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [dispatch, onShowToast]);

  return null;
} 