import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VideoState {
  videoUrl: string | null;
  scenes: Array<{
    id: string;
    startTime: number;
    endTime: number;
  }>;
  audioTracks: Array<{
    id: string;
    url: string;
    startTime: number;
    endTime: number;
    muted: boolean;
    volume: number;
  }>;
  subtitles: Array<{
    id: string;
    text: string;
    startTime: number;
    endTime: number;
    position: 'top' | 'bottom';
    font: string;
    color: string;
    size: number;
  }>;
  overlays: Array<{
    id: string;
    type: 'text' | 'image';
    content: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    style: string;
    opacity: number;
  }>;
}

const initialState: VideoState = {
  videoUrl: null,
  scenes: [],
  audioTracks: [],
  subtitles: [],
  overlays: [],
};

const videoEditorSlice = createSlice({
  name: 'videoEditor',
  initialState,
  reducers: {
    setVideoUrl: (state, action: PayloadAction<string>) => {
      state.videoUrl = action.payload;
    },
    addScene: (state, action: PayloadAction<{ id: string; startTime: number; endTime: number }>) => {
      state.scenes.push(action.payload);
    },
    removeScene: (state, action: PayloadAction<string>) => {
      state.scenes = state.scenes.filter(scene => scene.id !== action.payload);
    },
    updateScene: (state, action: PayloadAction<{ id: string; startTime: number; endTime: number }>) => {
      const scene = state.scenes.find(scene => scene.id === action.payload.id);
      if (scene) {
        scene.startTime = action.payload.startTime;
        scene.endTime = action.payload.endTime;
      }
    },
    addAudioTrack: (state, action: PayloadAction<typeof initialState.audioTracks[0]>) => {
      state.audioTracks.push(action.payload);
    },
    toggleAudioMute: (state, action: PayloadAction<string>) => {
      const track = state.audioTracks.find(track => track.id === action.payload);
      if (track) {
        track.muted = !track.muted;
      }
    },
    updateAudioTrack: (state, action: PayloadAction<{ id: string; volume: number }>) => {
      const track = state.audioTracks.find(track => track.id === action.payload.id);
      if (track) {
        track.volume = action.payload.volume;
      }
    },
    addSubtitle: (state, action: PayloadAction<typeof initialState.subtitles[0]>) => {
      state.subtitles.push(action.payload);
    },
    updateSubtitle: (state, action: PayloadAction<Partial<typeof initialState.subtitles[0]> & { id: string }>) => {
      const subtitle = state.subtitles.find(subtitle => subtitle.id === action.payload.id);
      if (subtitle) {
        Object.assign(subtitle, action.payload);
      }
    },
    addOverlay: (state, action: PayloadAction<typeof initialState.overlays[0]>) => {
      state.overlays.push(action.payload);
    },
    updateOverlay: (state, action: PayloadAction<Partial<typeof initialState.overlays[0]> & { id: string }>) => {
      const overlay = state.overlays.find(overlay => overlay.id === action.payload.id);
      if (overlay) {
        Object.assign(overlay, action.payload);
      }
    },
  },
});

export const {
  setVideoUrl,
  addScene,
  removeScene,
  updateScene,
  addAudioTrack,
  toggleAudioMute,
  updateAudioTrack,
  addSubtitle,
  updateSubtitle,
  addOverlay,
  updateOverlay,
} = videoEditorSlice.actions;

export default videoEditorSlice.reducer; 