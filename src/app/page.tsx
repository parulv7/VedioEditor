'use client';

import { useState } from 'react';
import { VideoUpload } from '@/components/VideoUpload';
import { VideoTimeline } from '@/components/VideoTimeline';
import { AudioManager } from '@/components/AudioManager';
import { SubtitlesManager } from '@/components/SubtitlesManager';
import { OverlayManager } from '@/components/OverlayManager';
import { VideoPreview } from '@/components/VideoPreview';
import { Toast } from '@/components/Toast';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';

export default function Home() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  return (
    <main className="min-h-screen py-10 px-2 sm:px-6 bg-transparent">
      <KeyboardShortcuts onShowToast={showToast} />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-2">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">Create & Edit Your Video</h1>
          <div className="flex items-center gap-4">
            <span className="text-base text-gray-500 font-medium hidden md:block">All changes are local and instant</span>
            <button
              onClick={() => showToast('Keyboard shortcuts: Ctrl+S (Add Scene), Space (Play/Pause)', 'info')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Help
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <VideoUpload onShowToast={showToast} />
            <VideoPreview onShowToast={showToast} />
            <div className="border-t border-gray-200 pt-6">
              <VideoTimeline onShowToast={showToast} />
            </div>
          </div>
          <div className="space-y-8">
            <AudioManager onShowToast={showToast} />
            <SubtitlesManager onShowToast={showToast} />
            <OverlayManager onShowToast={showToast} />
          </div>
        </div>
      </div>
    </main>
  );
}
