import React, { createContext, useContext, useState, useEffect } from 'react';
import { MusicTrack } from '../types';
import { INITIAL_APP_DATA } from '../data/defaultData';

interface PlayerContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  playbackMode: 'music' | 'video';
  isPipOpen: boolean;
  isMinimized: boolean;
  playlist: MusicTrack[];
  volume: number;
  playTrack: (track: MusicTrack, mode?: 'music' | 'video') => void;
  playPlaylist: (tracks: MusicTrack[], startIndex?: number) => void;
  setPlaylist: (tracks: MusicTrack[]) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (vol: number) => void;
  setPlaybackMode: (mode: 'music' | 'video') => void;
  setIsPipOpen: (open: boolean) => void;
  setIsMinimized: (minimized: boolean) => void;
  addToQueue: (track: MusicTrack) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlist, setPlaylist] = useState<MusicTrack[]>(INITIAL_APP_DATA.media.favoriteTracks);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(INITIAL_APP_DATA.media.favoriteTracks[0] || null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackMode, setPlaybackMode] = useState<'music' | 'video'>('music');
  const [isPipOpen, setIsPipOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(80);

  const playPlaylist = (tracks: MusicTrack[], startIndex: number = 0) => {
    if (!tracks || tracks.length === 0) return;
    setPlaylist(tracks);
    const trackToPlay = tracks[startIndex] || tracks[0];
    setCurrentTrack(trackToPlay);
    setIsPlaying(true);
    setIsPipOpen(true);
    setIsMinimized(false);
    const t = trackToPlay.title.toLowerCase();
    const isSong = t.includes('lofi') || t.includes('remix') || t.includes('beats') || t.includes('song') || t.includes('radio') || t.includes('ost') || t.includes('music');
    setPlaybackMode(isSong ? 'music' : 'video');
  };

  const playTrack = (track: MusicTrack, mode?: 'music' | 'video') => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setIsPipOpen(true);
    setIsMinimized(false);
    if (mode) {
      setPlaybackMode(mode);
    } else {
      // Auto-detect mode if not provided
      const t = track.title.toLowerCase();
      const isSong = t.includes('lofi') || t.includes('remix') || t.includes('beats') || t.includes('song') || t.includes('radio') || t.includes('ost') || t.includes('music');
      setPlaybackMode(isSong ? 'music' : 'video');
    }

    // Add to playlist if not present
    if (!playlist.some(p => p.youtubeId === track.youtubeId)) {
      setPlaylist(prev => [track, ...prev]);
    }
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const nextTrack = () => {
    if (!currentTrack || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(p => p.youtubeId === currentTrack.youtubeId);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentTrack(playlist[nextIndex]);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    if (!currentTrack || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(p => p.youtubeId === currentTrack.youtubeId);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrack(playlist[prevIndex]);
    setIsPlaying(true);
  };

  const addToQueue = (track: MusicTrack) => {
    if (!playlist.some(p => p.youtubeId === track.youtubeId)) {
      setPlaylist(prev => [...prev, track]);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playbackMode,
        isPipOpen,
        isMinimized,
        playlist,
        volume,
        playTrack,
        playPlaylist,
        setPlaylist,
        togglePlay,
        nextTrack,
        prevTrack,
        setVolume,
        setPlaybackMode,
        setIsPipOpen,
        setIsMinimized,
        addToQueue
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within a PlayerProvider');
  return context;
};
