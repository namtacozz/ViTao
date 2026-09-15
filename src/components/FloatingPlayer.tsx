import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Minus,
  Maximize2,
  X,
  Tv,
  ListMusic,
  Disc3,
  MessageCircle,
  Headphones
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

  // If Minimized: Facebook Messenger "Chat Head" Circular Widget
  if (isMinimized) {
    return (
      <div className="fixed bottom-20 md:bottom-6 right-6 z-50 animate-in fade-in zoom-in-90 duration-200">
        <div className="relative group">
          <button
            onClick={() => setIsMinimized(false)}
            className="w-14 h-14 rounded-full p-1 bg-[#1877f2] hover:scale-105 shadow-xl transition-transform flex items-center justify-center relative focus:outline-none"
            title={`${currentTrack.title} (Bấm để mở rộng)`}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-[#242526] border-2 border-white">
              <img
                src={currentTrack.thumbnail || 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=150&q=80'}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Pulsing online badge */}
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#31a24c] border-2 border-[#242526]"></span>
          </button>

          {/* Quick Play/Pause on hover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-[#242526] border border-[#393a3b] text-white flex items-center justify-center text-xs shadow-md"
          >
            {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPipOpen(false);
            }}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#3a3b3c] hover:bg-[#e41e3f] text-white flex items-center justify-center text-xs shadow-md transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  // Messenger Chat Box Style Floating Player
  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 sm:right-6 z-50 w-[92vw] sm:w-[360px] rounded-t-2xl rounded-b-xl bg-[#242526] border border-[#393a3b] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
      {/* Facebook Messenger Header Bar */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-[#242526] border-b border-[#393a3b]">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#393a3b] bg-[#18191a]">
              <img
                src={currentTrack.thumbnail || 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=100&q=80'}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#31a24c] border-2 border-[#242526]"></span>
          </div>

          <div className="overflow-hidden">
            <div className="text-xs font-bold text-[#e4e6eb] truncate">
              {currentTrack.title}
            </div>
            <div className="text-[10px] text-[#31a24c] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#31a24c]"></span>
              <span>Đang phát nhạc • ViTao Player</span>
            </div>
          </div>
        </div>

        {/* Messenger Action Icons */}
        <div className="flex items-center gap-0.5 shrink-0 text-[#b0b3b8]">
          <button
            onClick={() => setPlaybackMode(playbackMode === 'music' ? 'video' : 'music')}
            title={playbackMode === 'music' ? 'Xem video' : 'Nghe nhạc'}
            className="p-1.5 hover:bg-[#3a3b3c] rounded-full text-[#1877f2]"
          >
            {playbackMode === 'music' ? <Tv className="w-4 h-4" /> : <Headphones className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowQueue(!showQueue)}
            title="Hàng đợi phát"
            className={`p-1.5 hover:bg-[#3a3b3c] rounded-full ${showQueue ? 'text-[#1877f2]' : ''}`}
          >
            <ListMusic className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMinimized(true)}
            title="Thu nhỏ Chat Head"
            className="p-1.5 hover:bg-[#3a3b3c] rounded-full"
          >
            <Minus className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPipOpen(false)}
            title="Đóng"
            className="p-1.5 hover:bg-[#3a3b3c] hover:text-[#e41e3f] rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Viewport Content */}
      <div className="bg-[#18191a]">
        {/* Video Mode */}
        {playbackMode === 'video' ? (
          <div className="relative aspect-video w-full bg-black">
            <iframe
              src={ytEmbedUrl}
              title={currentTrack.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          /* Music Mode: Spinning Disc & Visualizer */
          <div className="p-4 flex flex-col items-center justify-center bg-gradient-to-b from-[#242526] to-[#18191a]">
            {/* Spinning Disc */}
            <div className="relative my-2">
              <div
                className={`w-24 h-24 rounded-full bg-[#111] border-4 border-[#3a3b3c] flex items-center justify-center shadow-lg ${
                  isPlaying ? 'animate-spin-slow' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#1877f2]">
                  <img
                    src={currentTrack.thumbnail || 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=150&q=80'}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute w-2 h-2 rounded-full bg-white"></div>
              </div>
            </div>

            {/* Audio Wave Visualizer */}
            <div className="flex items-center justify-center gap-1 h-5 my-1">
              <span className={`w-1 rounded-full bg-[#1877f2] ${isPlaying ? 'animate-bar-1' : 'h-1'}`}></span>
              <span className={`w-1 rounded-full bg-[#4599ff] ${isPlaying ? 'animate-bar-2' : 'h-1'}`}></span>
              <span className={`w-1 rounded-full bg-[#1877f2] ${isPlaying ? 'animate-bar-3' : 'h-1'}`}></span>
              <span className={`w-1 rounded-full bg-[#31a24c] ${isPlaying ? 'animate-bar-4' : 'h-1'}`}></span>
              <span className={`w-1 rounded-full bg-[#1877f2] ${isPlaying ? 'animate-bar-5' : 'h-1'}`}></span>
            </div>

            {/* Track Info */}
            <div className="text-center w-full px-2 mt-1">
              <h4 className="text-xs font-bold text-[#e4e6eb] truncate">{currentTrack.title}</h4>
              <p className="text-[11px] text-[#b0b3b8] truncate">{currentTrack.artist}</p>
            </div>

            {/* Hidden iframe for audio */}
            <iframe
              src={ytEmbedUrl}
              title={currentTrack.title}
              className="w-0 h-0 opacity-0 pointer-events-none absolute"
              allow="autoplay"
            />
          </div>
        )}

        {/* Facebook Style Controls Bar */}
        <div className="p-3 bg-[#242526] border-t border-[#393a3b] space-y-2">
          <div className="flex items-center justify-between">
            {/* Volume control */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-[#b0b3b8] hover:text-[#e4e6eb]"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-[#e41e3f]" /> : <Volume2 className="w-4 h-4" />}
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
                className="w-16 h-1 bg-[#3a3b3c] rounded-lg accent-[#1877f2]"
              />
            </div>

            {/* Prev, Play/Pause, Next */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevTrack}
                className="p-1.5 rounded-full hover:bg-[#3a3b3c] text-[#b0b3b8] hover:text-[#e4e6eb]"
              >
                <SkipBack className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-[#1877f2] hover:bg-[#166fe5] text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              <button
                onClick={nextTrack}
                className="p-1.5 rounded-full hover:bg-[#3a3b3c] text-[#b0b3b8] hover:text-[#e4e6eb]"
              >
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
            </div>

            <div className="text-[10px] font-semibold text-[#1877f2] bg-[#1877f2]/10 px-2 py-0.5 rounded-full">
              {playbackMode === 'music' ? 'Audio' : 'Video'}
            </div>
          </div>
        </div>

        {/* Queue Drawer */}
        {showQueue && (
          <div className="p-2.5 bg-[#1e1f20] border-t border-[#393a3b] max-h-44 overflow-y-auto space-y-1">
            <div className="text-[10px] font-bold uppercase text-[#b0b3b8] px-1 mb-1">
              Danh sách bài ({playlist.length})
            </div>
            {playlist.map((track, idx) => (
              <button
                key={track.id || idx}
                onClick={() => playTrack(track, playbackMode)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                  track.youtubeId === currentTrack.youtubeId
                    ? 'bg-[#1877f2]/15 text-[#1877f2] font-bold'
                    : 'text-[#e4e6eb] hover:bg-[#3a3b3c]'
                }`}
              >
                <div className="truncate pr-2">
                  <div className="truncate">{track.title}</div>
                  <div className="text-[10px] text-[#b0b3b8]">{track.artist}</div>
                </div>
                {track.youtubeId === currentTrack.youtubeId && (
                  <Disc3 className="w-3.5 h-3.5 text-[#1877f2] animate-spin shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
