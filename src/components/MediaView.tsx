import React, { useState } from 'react';
import {
  Music,
  Radio,
  Play,
  Plus,
  Trash2,
  ExternalLink,
  Search,
  Disc3,
  Bookmark,
  Sparkles,
  Loader2,
  ListMusic,
  Link2,
  FolderPlus,
  Check,
  Clock,
  PlayCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import {
  searchYouTube,
  YouTubeSearchResult,
  convertSearchResultToTrack,
  extractYouTubeId,
  fetchYouTubeOEmbed
} from '../services/youtubeService';
import { MusicTrack, Playlist, YouTubeChannel } from '../types';
import { YoutubeIcon } from './Icons';

export const MediaView: React.FC = () => {
  const { data, updateMedia } = useData();
  const { isAdmin } = useAuth();
  const { playTrack, playPlaylist, currentTrack, isPlaying } = usePlayer();
  const media = data.media;

  // Fallback if playlists is empty
  const playlists: Playlist[] = media.playlists && media.playlists.length > 0
    ? media.playlists
    : [
        {
          id: 'pl-favorites',
          name: 'Bài Hát Yêu Thích',
          description: 'Những bản nhạc tuyển chọn nghe lúc học tập và leo rank',
          cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80',
          tracks: media.favoriteTracks || [],
          createdAt: '2026-03-01'
        }
      ];

  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>(playlists[0]?.id || 'pl-favorites');
  const [activeMediaTab, setActiveMediaTab] = useState<'spotify' | 'search' | 'channels' | 'links'>('spotify');

  // New Playlist Modal
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [newPlaylistCover, setNewPlaylistCover] = useState('');

  // Paste YouTube Link Form
  const [youtubeLinkInput, setYoutubeLinkInput] = useState('');
  const [isFetchingOEmbed, setIsFetchingOEmbed] = useState(false);
  const [previewTrack, setPreviewTrack] = useState<MusicTrack | null>(null);
  const [customTrackTitle, setCustomTrackTitle] = useState('');
  const [customTrackArtist, setCustomTrackArtist] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<YouTubeSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Channel & Link modals
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [newChannel, setNewChannel] = useState<Partial<YouTubeChannel>>({
    name: '',
    handle: '',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
    channelUrl: 'https://youtube.com',
    category: 'code'
  });

  const selectedPlaylist = playlists.find(p => p.id === selectedPlaylistId) || playlists[0];

  // Helper: Save playlists to DataContext
  const savePlaylists = (newPlaylists: Playlist[]) => {
    updateMedia({
      playlists: newPlaylists,
      favoriteTracks: newPlaylists[0]?.tracks || media.favoriteTracks
    });
  };

  // Create Playlist
  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    const newPl: Playlist = {
      id: `pl-${Date.now()}`,
      name: newPlaylistName.trim(),
      description: newPlaylistDesc.trim() || 'Playlist cá nhân tự tạo',
      cover: newPlaylistCover.trim() || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80',
      tracks: [],
      createdAt: new Date().toISOString().slice(0, 10)
    };

    const updated = [...playlists, newPl];
    savePlaylists(updated);
    setSelectedPlaylistId(newPl.id);
    setNewPlaylistName('');
    setNewPlaylistDesc('');
    setNewPlaylistCover('');
    setShowCreatePlaylistModal(false);
  };

  // Delete Playlist
  const handleDeletePlaylist = (playlistId: string) => {
    if (playlists.length <= 1) {
      alert('Bạn phải giữ lại ít nhất 1 Playlist!');
      return;
    }
    const updated = playlists.filter(p => p.id !== playlistId);
    savePlaylists(updated);
    if (selectedPlaylistId === playlistId) {
      setSelectedPlaylistId(updated[0].id);
    }
  };

  // Handle URL Paste & Check oEmbed
  const handleResolveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const vidId = extractYouTubeId(youtubeLinkInput);
    if (!vidId) {
      alert('Link YouTube không hợp lệ! Vui lòng nhập link chuẩn (youtube.com/watch?v=... hoặc youtu.be/...)');
      return;
    }

    setIsFetchingOEmbed(true);
    try {
      const resolved = await fetchYouTubeOEmbed(youtubeLinkInput);
      if (resolved) {
        setPreviewTrack(resolved);
        setCustomTrackTitle(resolved.title);
        setCustomTrackArtist(resolved.artist);
      }
    } finally {
      setIsFetchingOEmbed(false);
    }
  };

  // Save resolved track to current playlist
  const handleSavePreviewTrack = () => {
    if (!previewTrack || !selectedPlaylist) return;

    const trackToSave: MusicTrack = {
      ...previewTrack,
      title: customTrackTitle.trim() || previewTrack.title,
      artist: customTrackArtist.trim() || previewTrack.artist
    };

    if (selectedPlaylist.tracks.some(t => t.youtubeId === trackToSave.youtubeId)) {
      alert('Bài hát này đã có trong playlist!');
      return;
    }

    const updatedPlaylists = playlists.map(pl => {
      if (pl.id === selectedPlaylist.id) {
        return { ...pl, tracks: [trackToSave, ...pl.tracks] };
      }
      return pl;
    });

    savePlaylists(updatedPlaylists);
    setPreviewTrack(null);
    setYoutubeLinkInput('');
  };

  // Remove track from playlist
  const handleRemoveTrackFromPlaylist = (playlistId: string, trackId: string) => {
    const updatedPlaylists = playlists.map(pl => {
      if (pl.id === playlistId) {
        return { ...pl, tracks: pl.tracks.filter(t => t.id !== trackId) };
      }
      return pl;
    });
    savePlaylists(updatedPlaylists);
  };

  // Add search result track to a target playlist
  const handleAddTrackToSpecificPlaylist = (targetPlaylistId: string, track: MusicTrack) => {
    const target = playlists.find(p => p.id === targetPlaylistId);
    if (!target) return;

    if (target.tracks.some(t => t.youtubeId === track.youtubeId)) {
      alert(`Bài hát "${track.title}" đã có trong playlist ${target.name}!`);
      return;
    }

    const updatedPlaylists = playlists.map(pl => {
      if (pl.id === targetPlaylistId) {
        return { ...pl, tracks: [track, ...pl.tracks] };
      }
      return pl;
    });

    savePlaylists(updatedPlaylists);
    alert(`Đã thêm vào "${target.name}"!`);
  };

  // Live Search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchYouTube(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // Channel Submit
  const handleAddChannelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannel.name) return;

    const channelToAdd: YouTubeChannel = {
      id: `ch-${Date.now()}`,
      name: newChannel.name,
      handle: newChannel.handle || `@${newChannel.name.toLowerCase().replace(/\s+/g, '')}`,
      avatar: newChannel.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
      channelUrl: newChannel.channelUrl || 'https://youtube.com',
      category: (newChannel.category as any) || 'code',
      isLive: false
    };

    updateMedia({ youtubeChannels: [...media.youtubeChannels, channelToAdd] });
    setShowAddChannel(false);
    setNewChannel({ name: '', handle: '', channelUrl: 'https://youtube.com', category: 'code' });
  };

  const handleDeleteChannel = (channelId: string) => {
    updateMedia({ youtubeChannels: media.youtubeChannels.filter(c => c.id !== channelId) });
  };

  return (
    <div className="space-y-4">
      {/* Top Spotify/YouTube Mode Tabs */}
      <div className="flex flex-wrap items-center justify-between bg-[#242526] p-2 rounded-xl border border-[#393a3b] shadow-sm gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveMediaTab('spotify')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeMediaTab === 'spotify'
                ? 'bg-[#1877f2] text-white shadow-md'
                : 'text-[#b0b3b8] hover:bg-[#3a3b3c] hover:text-[#e4e6eb]'
            }`}
          >
            <ListMusic className="w-4 h-4" />
            <span>Spotify Playlists</span>
          </button>
          <button
            onClick={() => setActiveMediaTab('search')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeMediaTab === 'search'
                ? 'bg-[#1877f2] text-white shadow-md'
                : 'text-[#b0b3b8] hover:bg-[#3a3b3c] hover:text-[#e4e6eb]'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Tìm Kiếm YouTube Trực Tiếp</span>
          </button>
          <button
            onClick={() => setActiveMediaTab('channels')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeMediaTab === 'channels'
                ? 'bg-[#1877f2] text-white shadow-md'
                : 'text-[#b0b3b8] hover:bg-[#3a3b3c] hover:text-[#e4e6eb]'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Kênh Đăng Ký ({media.youtubeChannels.length})</span>
          </button>
          <button
            onClick={() => setActiveMediaTab('links')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeMediaTab === 'links'
                ? 'bg-[#1877f2] text-white shadow-md'
                : 'text-[#b0b3b8] hover:bg-[#3a3b3c] hover:text-[#e4e6eb]'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Web Hay Dùng</span>
          </button>
        </div>

        <span className="text-[11px] text-[#b0b3b8] hidden md:flex items-center gap-1 font-mono pr-2">
          <span>YouTube Music • Spotify UI</span>
        </span>
      </div>

      {/* TAB 1: SPOTIFY EXPERIENCE FOR YOUTUBE */}
      {activeMediaTab === 'spotify' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Sidebar: Playlists Navigation (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#242526] rounded-xl p-4 border border-[#393a3b] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#e4e6eb]">
                  <Disc3 className="w-4 h-4 text-[#1877f2]" />
                  <span>Danh Sách Playlists Của Bạn</span>
                </div>
                <button
                  onClick={() => setShowCreatePlaylistModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1877f2] hover:bg-[#166fe5] text-white text-[11px] font-bold shadow-sm transition-all"
                  title="Tạo playlist mới"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tạo Mới</span>
                </button>
              </div>

              {/* Playlists List */}
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                {playlists.map(pl => {
                  const isSelected = pl.id === selectedPlaylistId;
                  return (
                    <div
                      key={pl.id}
                      onClick={() => setSelectedPlaylistId(pl.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all group ${
                        isSelected
                          ? 'bg-[#1877f2]/15 border border-[#1877f2] text-white'
                          : 'bg-[#18191a] border border-[#393a3b] hover:bg-[#3a3b3c]/50 text-[#b0b3b8] hover:text-[#e4e6eb]'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img
                          src={pl.cover || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80'}
                          alt={pl.name}
                          className="w-12 h-12 rounded-lg object-cover bg-black shrink-0 shadow"
                        />
                        <div className="overflow-hidden">
                          <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-[#1877f2]' : 'text-[#e4e6eb]'}`}>
                            {pl.name}
                          </h4>
                          <p className="text-[10px] text-[#b0b3b8] truncate">
                            {pl.tracks.length} bài hát
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playPlaylist(pl.tracks, 0);
                          }}
                          className="p-1.5 rounded-full bg-[#1877f2] text-white hover:scale-105 transition-transform"
                          title="Phát playlist này"
                        >
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </button>
                        {isAdmin && playlists.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePlaylist(pl.id);
                            }}
                            className="p-1.5 rounded-full text-[#b0b3b8] hover:text-[#e41e3f] hover:bg-[#3a3b3c]"
                            title="Xóa playlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Add from YouTube Link Box */}
            <div className="bg-[#242526] rounded-xl p-4 border border-[#393a3b] shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#e4e6eb]">
                <Link2 className="w-4 h-4 text-[#1877f2]" />
                <span>Dán Link YouTube Để Thêm Bài</span>
              </div>
              <p className="text-[11px] text-[#b0b3b8]">
                Dán bất kỳ link bài nhạc YouTube nào để hệ thống tự quét tiêu đề & nghệ sĩ lưu vào Playlist!
              </p>

              <form onSubmit={handleResolveLink} className="space-y-2">
                <input
                  type="text"
                  value={youtubeLinkInput}
                  onChange={(e) => setYoutubeLinkInput(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-xs text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                />
                <button
                  type="submit"
                  disabled={isFetchingOEmbed || !youtubeLinkInput.trim()}
                  className="w-full py-2 rounded-lg bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isFetchingOEmbed ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang kiểm tra link...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Quét Thông Tin Bài Hát</span>
                    </>
                  )}
                </button>
              </form>

              {/* Preview Resolved Track Card */}
              {previewTrack && (
                <div className="p-3 rounded-xl bg-[#18191a] border border-[#1877f2]/50 space-y-3 pt-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={previewTrack.thumbnail}
                      alt="Thumbnail"
                      className="w-14 h-10 rounded-lg object-cover bg-black shrink-0"
                    />
                    <div className="overflow-hidden flex-1">
                      <div className="text-xs font-bold text-[#e4e6eb] truncate">
                        {previewTrack.title}
                      </div>
                      <div className="text-[10px] text-[#1877f2] font-semibold">
                        {previewTrack.artist}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="block text-[10px] text-[#b0b3b8] mb-0.5">Tiêu đề (có thể sửa):</label>
                      <input
                        type="text"
                        value={customTrackTitle}
                        onChange={(e) => setCustomTrackTitle(e.target.value)}
                        className="w-full px-2 py-1 rounded bg-[#242526] border border-[#393a3b] text-xs text-[#e4e6eb]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#b0b3b8] mb-0.5">Nghệ sĩ / Kênh:</label>
                      <input
                        type="text"
                        value={customTrackArtist}
                        onChange={(e) => setCustomTrackArtist(e.target.value)}
                        className="w-full px-2 py-1 rounded bg-[#242526] border border-[#393a3b] text-xs text-[#e4e6eb]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => playTrack(previewTrack, 'music')}
                      className="flex-1 py-1.5 rounded-lg bg-[#3a3b3c] hover:bg-[#4e4f50] text-white text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Nghe thử</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSavePreviewTrack}
                      className="flex-1 py-1.5 rounded-lg bg-[#31a24c] hover:bg-[#28883f] text-white text-xs font-bold flex items-center justify-center gap-1 shadow"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Lưu Playlist</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Main Column: Spotify Playlist Header & Tracks Table (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Spotify Playlist Banner */}
            <div className="bg-gradient-to-b from-[#1877f2]/30 via-[#242526] to-[#242526] rounded-xl p-6 border border-[#393a3b] shadow-lg flex flex-col md:flex-row items-center md:items-end gap-6">
              <div className="w-40 h-40 rounded-xl overflow-hidden shadow-2xl bg-black shrink-0 border border-white/10">
                <img
                  src={selectedPlaylist?.cover || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80'}
                  alt={selectedPlaylist?.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 text-center md:text-left flex-1">
                <span className="text-[10px] font-mono font-bold tracking-widest text-white/70 uppercase">
                  PUBLIC PLAYLIST
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {selectedPlaylist?.name}
                </h2>
                <p className="text-xs text-[#b0b3b8] max-w-xl">
                  {selectedPlaylist?.description}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-[#e4e6eb] pt-1">
                  <span className="font-bold text-[#1877f2]">Hột Vịt Lộn</span>
                  <span>•</span>
                  <span>{selectedPlaylist?.tracks.length || 0} bài hát</span>
                  <span>•</span>
                  <span className="text-[#b0b3b8]">Tạo ngày {selectedPlaylist?.createdAt}</span>
                </div>
              </div>
            </div>

            {/* Actions Bar (Play All, Track Count) */}
            <div className="bg-[#242526] rounded-xl p-4 border border-[#393a3b] shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  disabled={!selectedPlaylist?.tracks.length}
                  onClick={() => playPlaylist(selectedPlaylist.tracks, 0)}
                  className="w-12 h-12 rounded-full bg-[#1877f2] hover:bg-[#166fe5] hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-lg transition-all disabled:opacity-40"
                  title="Phát tất cả"
                >
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </button>
                <div>
                  <div className="text-xs font-bold text-[#e4e6eb]">Phát Toàn Bộ Playlist</div>
                  <div className="text-[10px] text-[#b0b3b8]">Tự động chuyển bài tiếp theo khi hết nhạc</div>
                </div>
              </div>

              <div className="text-xs font-mono text-[#b0b3b8]">
                {selectedPlaylist?.tracks.length} track(s)
              </div>
            </div>

            {/* Spotify Tracks Table */}
            <div className="bg-[#242526] rounded-xl p-4 border border-[#393a3b] shadow-sm space-y-2">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#393a3b] text-[#b0b3b8] font-semibold">
                      <th className="py-2.5 px-3 w-12 text-center">#</th>
                      <th className="py-2.5 px-3">Tiêu Đề & Nghệ Sĩ</th>
                      <th className="py-2.5 px-3 w-28 text-center">Thời lượng</th>
                      <th className="py-2.5 px-3 w-24 text-right">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#393a3b]/40">
                    {selectedPlaylist?.tracks.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-xs text-[#b0b3b8]">
                          Playlist này chưa có bài hát nào. Hãy dán link YouTube ở cột bên trái hoặc tìm kiếm bài hát để thêm vào!
                        </td>
                      </tr>
                    ) : (
                      selectedPlaylist?.tracks.map((track, idx) => {
                        const isCurrentPlaying = currentTrack?.youtubeId === track.youtubeId && isPlaying;
                        return (
                          <tr
                            key={track.id || idx}
                            className={`group transition-colors ${
                              isCurrentPlaying
                                ? 'bg-[#1877f2]/10 text-white font-bold'
                                : 'hover:bg-[#3a3b3c]/50 text-[#e4e6eb]'
                            }`}
                          >
                            <td className="py-3 px-3 text-center font-mono text-[#b0b3b8]">
                              <span className="group-hover:hidden">{idx + 1}</span>
                              <button
                                onClick={() => playPlaylist(selectedPlaylist.tracks, idx)}
                                className="hidden group-hover:inline-block text-[#1877f2]"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                              </button>
                            </td>

                            <td className="py-3 px-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={track.thumbnail || `https://i.ytimg.com/vi/${track.youtubeId}/hqdefault.jpg`}
                                  alt={track.title}
                                  className="w-10 h-10 rounded-lg object-cover bg-black shrink-0 shadow"
                                />
                                <div className="overflow-hidden">
                                  <div className={`font-semibold truncate max-w-sm sm:max-w-md ${isCurrentPlaying ? 'text-[#1877f2]' : 'text-[#e4e6eb]'}`}>
                                    {track.title}
                                  </div>
                                  <div className="text-[10px] text-[#b0b3b8] truncate font-normal">
                                    {track.artist}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-3 text-center font-mono text-[#b0b3b8] text-[11px]">
                              {track.duration || 'YouTube'}
                            </td>

                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => playTrack(track, 'music')}
                                  className="p-1.5 rounded-full text-[#1877f2] hover:bg-[#1877f2]/20"
                                  title="Phát bài này"
                                >
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                </button>
                                {isAdmin && (
                                  <button
                                    onClick={() => handleRemoveTrackFromPlaylist(selectedPlaylist.id, track.id)}
                                    className="p-1.5 rounded-full text-[#b0b3b8] hover:text-[#e41e3f] hover:bg-[#3a3b3c]"
                                    title="Xóa khỏi playlist"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE YOUTUBE SEARCH */}
      {activeMediaTab === 'search' && (
        <div className="bg-[#242526] rounded-xl p-5 border border-[#393a3b] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1877f2] uppercase tracking-wider">
                <YoutubeIcon className="w-4 h-4" />
                <span>Tìm Kiếm YouTube Thời Gian Thực</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#e4e6eb] mt-1">
                Tìm Bất Kỳ Video, Bài Hát Hay MV Nào Trên YouTube
              </h2>
            </div>
            <span className="text-xs text-[#b0b3b8]">
              Kết nối trực tiếp qua Piped & Invidious Open APIs
            </span>
          </div>

          {/* Search form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên bài hát (ví dụ: Sơn Tùng, Đen Vâu, Lofi hip hop, Riot Games OST...)"
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#3a3b3c] border border-[#393a3b] text-sm text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
              />
              <Search className="w-4 h-4 text-[#b0b3b8] absolute left-3.5 top-3" />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-2.5 rounded-full bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isSearching ? 'Đang tìm...' : 'Tìm Kiếm'}</span>
            </button>
          </form>

          {/* Search suggestions tags */}
          <div className="flex flex-wrap gap-2 items-center text-xs">
            <span className="text-[#b0b3b8]">Gợi ý nhanh:</span>
            {['Lofi Chill Study', 'Against The Current', 'Riot Games Music', 'Synthwave Beats', 'Sơn Tùng M-TP', 'V-Pop Hits'].map(term => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  searchYouTube(term).then(res => setSearchResults(res));
                }}
                className="px-3 py-1 rounded-full bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#e4e6eb] text-[11px] font-semibold transition-colors"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Results Grid */}
          {searchResults.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-[#393a3b]">
              <div className="text-xs font-semibold text-[#1877f2]">
                Kết quả tìm kiếm ({searchResults.length} video tìm thấy):
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {searchResults.map(item => {
                  const asTrack = convertSearchResultToTrack(item);
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-[#18191a] border border-[#393a3b] hover:border-[#1877f2]/50 hover:bg-[#202122] transition-all flex flex-col justify-between group space-y-2"
                    >
                      <div className="flex gap-3">
                        <div className="relative aspect-video w-28 rounded-lg overflow-hidden bg-black shrink-0">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          {item.duration && (
                            <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-[9px] font-mono text-white">
                              {item.duration}
                            </span>
                          )}
                        </div>
                        <div className="overflow-hidden flex-1">
                          <h4 className="text-xs font-bold text-[#e4e6eb] line-clamp-2 group-hover:text-[#1877f2] transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-[#b0b3b8] truncate mt-1">
                            {item.author}
                          </p>
                        </div>
                      </div>

                      {/* Card actions: Play & Add to Playlist */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#393a3b]/60 text-xs">
                        <button
                          onClick={() => playTrack(asTrack, item.isMusic ? 'music' : 'video')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold text-[11px] shadow-sm transition-all"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Phát ngay</span>
                        </button>

                        <div className="relative">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAddTrackToSpecificPlaylist(e.target.value, asTrack);
                                e.target.value = '';
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-[#3a3b3c] hover:bg-[#4e4f50] border border-[#393a3b] text-[#e4e6eb] text-[11px] font-semibold focus:outline-none"
                            defaultValue=""
                          >
                            <option value="" disabled>+ Thêm vào Playlist...</option>
                            {playlists.map(p => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CHANNELS */}
      {activeMediaTab === 'channels' && (
        <div className="bg-[#242526] rounded-xl p-5 border border-[#393a3b] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#1877f2]" />
              <h3 className="font-bold text-[#e4e6eb] text-base">Kênh YouTube Theo Dõi</h3>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowAddChannel(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#e4e6eb] text-xs font-semibold transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Kênh Mới</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {media.youtubeChannels.map((channel) => (
              <div
                key={channel.id}
                className="p-3.5 rounded-xl bg-[#18191a] border border-[#393a3b] hover:border-[#1877f2]/40 hover:bg-[#2e2f30] transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={channel.avatar}
                    alt={channel.name}
                    className="w-11 h-11 rounded-full object-cover bg-black shrink-0"
                  />
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-[#e4e6eb] truncate group-hover:text-[#1877f2]">
                      {channel.name}
                    </div>
                    <div className="text-[10px] text-[#b0b3b8] font-mono truncate">{channel.handle}</div>
                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#3a3b3c] text-[#b0b3b8]">
                      {channel.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <a
                    href={channel.channelUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-full text-[#b0b3b8] hover:text-white hover:bg-[#3a3b3c]"
                    title="Mở kênh trên YouTube"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteChannel(channel.id)}
                      className="p-1.5 rounded-full text-[#b0b3b8] hover:text-[#e41e3f] hover:bg-[#3a3b3c]"
                      title="Xóa kênh này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: QUICK LINKS */}
      {activeMediaTab === 'links' && (
        <div className="bg-[#242526] rounded-xl p-5 border border-[#393a3b] shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#1877f2]" />
            <h3 className="font-bold text-[#e4e6eb] text-base">Liên Kết & Trang Web Hay Dùng</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {media.quickLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-xl bg-[#18191a] border border-[#393a3b] hover:border-[#1877f2]/40 hover:bg-[#3a3b3c]/40 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-[#e4e6eb] group-hover:text-[#1877f2]">
                    {link.title}
                  </div>
                  <div className="text-[10px] text-[#b0b3b8]">{link.category}</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#b0b3b8] group-hover:text-[#1877f2]" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreatePlaylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleCreatePlaylist} className="bg-[#242526] p-6 rounded-xl max-w-md w-full border border-[#393a3b] shadow-2xl space-y-4">
            <h4 className="font-bold text-[#e4e6eb] text-base flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-[#1877f2]" />
              <span>Tạo Playlist Mới (Spotify Style)</span>
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Tên Playlist</label>
                <input
                  type="text"
                  placeholder="Ví dụ: EDM Leo Rank, Nhạc Phim Anime..."
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Mô Tả Playlist</label>
                <input
                  type="text"
                  placeholder="Tuyển tập những bài hát chill nhất..."
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                />
              </div>
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Ảnh Bìa (Cover URL - Tùy chọn)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newPlaylistCover}
                  onChange={(e) => setNewPlaylistCover(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreatePlaylistModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#b0b3b8] hover:bg-[#3a3b3c] hover:text-[#e4e6eb] transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg text-xs font-bold bg-[#1877f2] hover:bg-[#166fe5] text-white transition-colors"
              >
                Tạo Playlist
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Channel Modal */}
      {showAddChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleAddChannelSubmit} className="bg-[#242526] p-6 rounded-xl max-w-md w-full border border-[#393a3b] shadow-2xl space-y-4">
            <h4 className="font-bold text-[#e4e6eb] text-base">Thêm Kênh YouTube Theo Dõi</h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Tên Kênh</label>
                <input
                  type="text"
                  placeholder="Ví dụ: ThePrimeagen"
                  value={newChannel.name}
                  onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Handle (@tag)</label>
                <input
                  type="text"
                  placeholder="@ThePrimeTimeagen"
                  value={newChannel.handle}
                  onChange={(e) => setNewChannel({ ...newChannel, handle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                />
              </div>
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Link Kênh</label>
                <input
                  type="text"
                  placeholder="https://youtube.com/@ThePrimeTimeagen"
                  value={newChannel.channelUrl}
                  onChange={(e) => setNewChannel({ ...newChannel, channelUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddChannel(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#b0b3b8] hover:bg-[#3a3b3c] hover:text-[#e4e6eb] transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#1877f2] hover:bg-[#166fe5] text-white transition-colors"
              >
                Thêm Kênh
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
