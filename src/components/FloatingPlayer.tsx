import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  X,
  Music,
  Tv,
  ListMusic,
  Disc3
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const FloatingPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    playbackMode,
    isPipOpen,
    isMinimized,
    playlist,
    volume,
    togglePlay,
    nextTrack,
    prevTrack,
    setVolume,
    setPlaybackMode,
    setIsPipOpen,
    setIsMinimized,
    playTrack
  } = usePlayer();

  const [showQueue, setShowQueue] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  if (!isPipOpen || !currentTrack) return null;

  const ytEmbedUrl = `https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1&origin=${window.location.origin}`;

  // If minimized into a floating pill
  if (isMinimized) {
    return (
      <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex items-center gap-2 p-2 rounded-full glass-panel border border-cyan-500/40 shadow-neon-cyan animate-in fade-in slide-in-from-bottom-5 duration-200">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-2 text-left focus:outline-none"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-cyan-400/50 animate-spin-slow">
            <img
              src={currentTrack.thumbnail || 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=100&q=80'}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="max-w-[140px] truncate">
            <div className="text-xs font-semibold text-white truncate">{currentTrack.title}</div>
            <div className="text-[10px] text-cyan-400">{currentTrack.artist}</div>
          </div>
        </button>

        {/* Mini equalizer bars */}
        {isPlaying && (
          <div className="flex items-end gap-0.5 h-3 px-1">
            <span className="w-0.5 bg-cyan-400 animate-bar-1"></span>
            <span className="w-0.5 bg-purple-400 animate-bar-2"></span>
            <span className="w-0.5 bg-pink-400 animate-bar-3"></span>
          </div>
        )}

        <button
          onClick={togglePlay}
          className="p-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
        </button>

        <button
          onClick={() => setIsMinimized(false)}
          title="Phóng to"
          className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setIsPipOpen(false)}
          title="Tắt trình phát"
          className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-rose-400"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 rounded-2xl glass-panel border border-slate-700/90 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
      {/* Top Window Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <div className="flex gap-1">
            <button
              onClick={() => setIsPipOpen(false)}
              className="w-2.5 h-2.5 rounded-full bg-rose-500/80 hover:bg-rose-500"
              title="Đóng"
            />
            <button
              onClick={() => setIsMinimized(true)}
              className="w-2.5 h-2.5 rounded-full bg-amber-500/80 hover:bg-amber-500"
              title="Thu nhỏ thành thanh nổi"
            />
            <button
              onClick={() => setPlaybackMode(playbackMode === 'music' ? 'video' : 'music')}
              className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 hover:bg-emerald-500"
              title="Đổi chế độ Video / Nhạc"
            />
          </div>
          <span className="text-[11px] font-mono text-slate-400 ml-1">
            {playbackMode === 'music' ? 'Cyberpunk Hi-Fi Music' : 'YouTube Video PiP'}
          </span>
        </div>

        {/* Switch Mode & Queue Drawer Toggle */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPlaybackMode(playbackMode === 'music' ? 'video' : 'music')}
            title={playbackMode === 'music' ? 'Chuyển sang chế độ xem Video' : 'Chuyển sang chế độ Máy nghe nhạc'}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
              playbackMode === 'music'
                ? 'text-purple-400 hover:bg-purple-950/50'
                : 'text-cyan-400 hover:bg-cyan-950/50'
            }`}
          >
            {playbackMode === 'music' ? <Tv className="w-3.5 h-3.5" /> : <Music className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setShowQueue(!showQueue)}
            title="Danh sách phát tiếp theo"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showQueue ? 'text-cyan-400 bg-cyan-950/60' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListMusic className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsMinimized(true)}
            title="Thu nhỏ"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Viewport Content */}
      <div className="relative bg-[#07090e]">
        {/* If in Video Mode: Render YouTube Iframe */}
        <div className={playbackMode === 'video' ? 'block' : 'hidden'}>
          <div className="relative aspect-video w-full bg-black">
            <iframe
              src={ytEmbedUrl}
              title={currentTrack.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* If in Music Mode: Cyberpunk Music Player UI with Vinyl Record & Waveform */}
        {playbackMode === 'music' && (
          <div className="p-5 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900/90 via-[#0b0f19] to-[#07090e] border-b border-slate-800">
            {/* Spinning Vinyl Disc */}
            <div className="relative my-2">
              <div
                className={`relative w-28 h-28 rounded-full bg-slate-950 border-4 border-slate-800 flex items-center justify-center shadow-2xl shadow-purple-500/20 ${
                  isPlaying ? 'animate-spin-slow' : ''
                }`}
              >
                {/* Vinyl grooved rings */}
                <div className="absolute inset-2 rounded-full border border-slate-800/80"></div>
                <div className="absolute inset-5 rounded-full border border-slate-800/60"></div>
                {/* Center Label / Album art */}
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-400">
                  <img
                    src={currentTrack.thumbnail || 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=150&q=80'}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Center Hole */}
                <div className="absolute w-2.5 h-2.5 rounded-full bg-slate-950 border border-white"></div>
              </div>
            </div>

            {/* Audio Wave Visualizer Bars */}
            <div className="flex items-center justify-center gap-1.5 h-6 my-2">
              <span className={`w-1 rounded-full bg-cyan-400 ${isPlaying ? 'animate-bar-1' : 'h-1'}`}></span>
              <span className={`w-1 rounded-full bg-blue-400 ${isPlaying ? 'animate-bar-2' : 'h-1'}`}></span>
              <span className={`w-1 rounded-full bg-purple-400 ${isPlaying ? 'animate-bar-3' : 'h-1'}`}></span>
              <span className={`w-1 rounded-full bg-pink-400 ${isPlaying ? 'animate-bar-4' : 'h-1'}`}></span>
              <span className={`w-1 rounded-full bg-cyan-400 ${isPlaying ? 'animate-bar-5' : 'h-1'}`}></span>
              <span className={`w-1 rounded-full bg-purple-400 ${isPlaying ? 'animate-bar-2' : 'h-1'}`}></span>
            </div>

            {/* Track Info */}
            <div className="text-center w-full px-2 mt-1">
              <h4 className="text-sm font-bold text-white truncate">{currentTrack.title}</h4>
              <p className="text-xs text-cyan-400 font-medium truncate mt-0.5">{currentTrack.artist}</p>
            </div>

            {/* Hidden Background Iframe for actual audio streaming */}
            <iframe
              src={ytEmbedUrl}
              title={currentTrack.title}
              className="w-0 h-0 opacity-0 pointer-events-none absolute"
              allow="autoplay"
            />
          </div>
        )}

        {/* Global Controls Bar */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 space-y-2">
          {/* Main playback buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-16 h-1 bg-slate-800 rounded-lg accent-cyan-400"
              />
            </div>

            {/* Center Controls: Prev, Play/Pause, Next */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevTrack}
                title="Lùi bài trước"
                className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                <SkipBack className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={togglePlay}
                title={isPlaying ? 'Tạm dừng' : 'Tiếp tục phát'}
                className="p-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-neon-cyan transition-transform hover:scale-105"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              <button
                onClick={nextTrack}
                title="Đổi bài tiếp theo"
                className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
            </div>

            {/* Mode badge indicator */}
            <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
              {playbackMode === 'music' ? 'Hi-Fi Audio' : 'Video Mode'}
            </div>
          </div>
        </div>

        {/* Playlist Queue Drawer (Collapsible) */}
        {showQueue && (
          <div className="p-3 bg-slate-900 border-t border-slate-800 max-h-48 overflow-y-auto space-y-1">
            <div className="text-[10px] font-semibold uppercase text-slate-400 px-1 mb-1">
              Danh sách bài tiếp theo ({playlist.length})
            </div>
            {playlist.map((track, idx) => (
              <button
                key={track.id || idx}
                onClick={() => playTrack(track, playbackMode)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                  track.youtubeId === currentTrack.youtubeId
                    ? 'bg-cyan-950/60 text-cyan-300 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="truncate pr-2">
                  <div className="truncate">{track.title}</div>
                  <div className="text-[10px] text-slate-500">{track.artist}</div>
                </div>
                {track.youtubeId === currentTrack.youtubeId && (
                  <Disc3 className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
