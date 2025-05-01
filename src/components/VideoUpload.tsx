'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { setVideoUrl } from '@/store/slices/videoEditorSlice';
import { RootState } from '@/store/store';

interface VideoUploadProps {
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function VideoUpload({ onShowToast }: VideoUploadProps) {
  const dispatch = useDispatch();
  const videoUrl = useSelector((state: RootState) => state.videoEditor.videoUrl);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        setError('File size exceeds 100MB limit');
        onShowToast('File too large. Maximum size is 100MB', 'error');
        return;
      }

      // Validate file type
      const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Supported formats: MP4, MOV, AVI');
        onShowToast('Invalid file type. Supported formats: MP4, MOV, AVI', 'error');
        return;
      }

      setError(null);
      setUploading(true);
      setFileName(file.name);
      setFileSize(file.size);
      let prog = 0;
      const interval = setInterval(() => {
        prog += 10;
        setProgress(prog);
        if (prog >= 100) {
          clearInterval(interval);
          setUploading(false);
          setProgress(0);
          const videoUrl = URL.createObjectURL(file);
          dispatch(setVideoUrl(videoUrl));
          onShowToast('Video uploaded successfully', 'success');
        }
      }, 80);
    }
  }, [dispatch, onShowToast]);

  const removeVideo = () => {
    dispatch(setVideoUrl(''));
    setFileName('');
    setFileSize(0);
    onShowToast('Video removed', 'info');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi']
    },
    maxFiles: 1
  });

  return (
    <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-gray-100 transition-all hover:shadow-2xl">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700 flex items-center gap-2">
        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Upload Video
      </h2>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}
      {uploading ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className="bg-indigo-500 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-gray-700 font-medium">Uploading... {progress}%</span>
        </div>
      ) : videoUrl ? (
        <div className="flex flex-col items-center gap-4">
          <video
            src={videoUrl}
            className="rounded-lg shadow w-full max-w-xs aspect-video object-cover"
            controls
          />
          <div className="flex flex-col items-center gap-1">
            <span className="text-gray-800 font-semibold">{fileName}</span>
            <span className="text-xs text-gray-500">{(fileSize / 1024 / 1024).toFixed(2)} MB</span>
          </div>
          <button
            onClick={removeVideo}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Remove Video
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center gap-2
            ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 bg-gray-50/60'}`}
        >
          <input {...getInputProps()} />
          <svg className="w-10 h-10 text-indigo-400 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 12l-4-4m4 4l4-4" />
          </svg>
          {isDragActive ? (
            <p className="text-indigo-600 font-semibold">Drop the video here...</p>
          ) : (
            <div>
              <p className="text-gray-700 font-medium">Drag and drop a video file here, or <span className="text-indigo-600 underline">click to select</span></p>
              <p className="text-sm text-gray-500 mt-2">Supported formats: MP4, MOV, AVI (max 100MB)</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 