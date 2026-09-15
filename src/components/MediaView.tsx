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
  Loader2
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { searchYouTube, YouTubeSearchResult, convertSearchResultToTrack, extractYouTubeId } from '../services/youtubeService';
import { MusicTrack, YouTubeChannel } from '../types';
import { YoutubeIcon } from './Icons';

export const MediaView: React.FC = () => {
  const { data, updateMedia } = useData();
  const { isAdmin } = useAuth();
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const media = data.media;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<YouTubeSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Add Channel Modal State
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [newChannel, setNewChannel] = useState<Partial<YouTubeChannel>>({
    name: '',
    handle: '',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
    channelUrl: 'https://youtube.com',
    category: 'code',
    isLive: false
  });

  // Add Track Modal State
  const [showAddTrack, setShowAddTrack] = useState(false);
  const [newTrackInput, setNewTrackInput] = useState({
    title: '',
    artist: '',
    youtubeUrlOrId: ''
  });

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
      isLive: newChannel.isLive || false
    };

    updateMedia({ youtubeChannels: [...media.youtubeChannels, channelToAdd] });
    setShowAddChannel(false);
    setNewChannel({ name: '', handle: '', channelUrl: 'https://youtube.com', category: 'code' });
  };

  const handleDeleteChannel = (channelId: string) => {
    updateMedia({ youtubeChannels: media.youtubeChannels.filter(c => c.id !== channelId) });
  };

  const handleAddTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vidId = extractYouTubeId(newTrackInput.youtubeUrlOrId);
    if (!vidId || !newTrackInput.title) {
      alert('Vui lòng nhập tiêu đề và link YouTube / ID video hợp lệ!');
      return;
    }

    const trackToAdd: MusicTrack = {
      id: `tr-${Date.now()}`,
      title: newTrackInput.title,
      artist: newTrackInput.artist || 'Nghệ Sĩ',
      youtubeId: vidId,
      thumbnail: `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`
    };

    updateMedia({ favoriteTracks: [trackToAdd, ...media.favoriteTracks] });
    setShowAddTrack(false);
    setNewTrackInput({ title: '', artist: '', youtubeUrlOrId: '' });
  };

  const handleDeleteTrack = (trackId: string) => {
    updateMedia({ favoriteTracks: media.favoriteTracks.filter(t => t.id !== trackId) });
  };

  return (
    <div className="space-y-4">
      {/* YouTube Live Search Banner */}
      <div className="bg-[#242526] rounded-xl p-5 border border-[#393a3b] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1877f2] uppercase tracking-wider">
              <YoutubeIcon className="w-4 h-4" />
              <span>Tìm Kiếm YouTube & Nghe Nhạc / Xem Video Nổi (PiP)</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#e4e6eb] mt-1">
              Phát Mọi Bài Hát & Video Trực Tiếp Trên ViTao
            </h2>
          </div>
          <span className="text-xs text-[#b0b3b8]">
            Hỗ trợ chế độ PiP và Mini Player Facebook Messenger
          </span>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập tên bài hát (lofi, synthwave, rap, ost...) hoặc video muốn xem..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#3a3b3c] border border-[#393a3b] text-sm text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
            />
            <Search className="w-4 h-4 text-[#b0b3b8] absolute left-3.5 top-3" />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-5 py-2.5 rounded-full bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isSearching ? 'Đang tìm...' : 'Tìm Kiếm'}</span>
          </button>
        </form>

        {/* Search Results Grid */}
        {searchResults.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-[#393a3b]">
            <div className="text-xs font-semibold text-[#1877f2]">
              Kết quả tìm kiếm cho "{searchQuery}":
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {searchResults.map(item => (
                <div
                  key={item.id}
                  onClick={() => playTrack(convertSearchResultToTrack(item), item.isMusic ? 'music' : 'video')}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#18191a] border border-[#393a3b] hover:bg-[#3a3b3c]/50 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-12 h-9 rounded-lg object-cover bg-black shrink-0"
                    />
                    <div className="overflow-hidden">
                      <div className="text-xs font-medium text-[#e4e6eb] truncate group-hover:text-[#1877f2]">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-[#b0b3b8]">
                        {item.author} {item.duration && `• ${item.duration}`}
                      </div>
                    </div>
                  </div>
                  <Play className="w-4 h-4 text-[#b0b3b8] group-hover:text-[#1877f2] shrink-0 ml-2" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Favorite Music Tracks (Playlist) */}
      <div className="bg-[#242526] rounded-xl p-5 border border-[#393a3b] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Disc3 className="w-4 h-4 text-[#1877f2]" />
            <h3 className="font-bold text-[#e4e6eb] text-base">Danh Sách Nhạc Yêu Thích Của Bạn</h3>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddTrack(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Bài Hát Mới</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {media.favoriteTracks.map((track) => {
            const isCurrentPlaying = currentTrack?.youtubeId === track.youtubeId && isPlaying;
            return (
              <div
                key={track.id}
                className={`p-3.5 rounded-xl bg-[#18191a] border transition-all flex flex-col justify-between group ${
                  isCurrentPlaying
                    ? 'border-[#1877f2] bg-[#1877f2]/10 shadow-sm'
                    : 'border-[#393a3b] hover:border-[#1877f2]/40 hover:bg-[#2e2f30]'
                }`}
              >
                <div className="space-y-2">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                    <img
                      src={track.thumbnail || `https://i.ytimg.com/vi/${track.youtubeId}/hqdefault.jpg`}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => playTrack(track, 'music')}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#1877f2] text-white flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </button>
                    {track.duration && (
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                        {track.duration}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-[#e4e6eb] truncate group-hover:text-[#1877f2]">
                      {track.title}
                    </h4>
                    <p className="text-[11px] text-[#b0b3b8] truncate">{track.artist}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[#393a3b] text-xs">
                  <button
                    onClick={() => playTrack(track, 'music')}
                    className="text-[#1877f2] hover:underline flex items-center gap-1 text-[11px] font-semibold"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Phát nhạc</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteTrack(track.id)}
                      className="text-[#b0b3b8] hover:text-[#e41e3f] p-1 rounded-full hover:bg-[#3a3b3c]"
                      title="Xóa bài này"
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

      {/* Subscribed YouTube Channels */}
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
                <div className="relative shrink-0">
                  <img
                    src={channel.avatar}
                    alt={channel.name}
                    className="w-11 h-11 rounded-full object-cover bg-black"
                  />
                  {channel.isLive && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e41e3f] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#e41e3f] border-2 border-[#18191a]"></span>
                    </span>
                  )}
                </div>
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

      {/* Quick Links Bookmarks */}
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

      {/* Add Track Modal */}
      {showAddTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleAddTrackSubmit} className="bg-[#242526] p-6 rounded-xl max-w-md w-full border border-[#393a3b] shadow-2xl space-y-4">
            <h4 className="font-bold text-[#e4e6eb] text-base">Thêm Bài Hát Vào Danh Sách Yêu Thích</h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Tên Bài Hát</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Legends Never Die"
                  value={newTrackInput.title}
                  onChange={(e) => setNewTrackInput({ ...newTrackInput, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Nghệ Sĩ / Kênh</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Against The Current"
                  value={newTrackInput.artist}
                  onChange={(e) => setNewTrackInput({ ...newTrackInput, artist: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                />
              </div>
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Link YouTube hoặc Video ID (11 ký tự)</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=r6zIGXunKCg hoặc r6zIGXunKCg"
                  value={newTrackInput.youtubeUrlOrId}
                  onChange={(e) => setNewTrackInput({ ...newTrackInput, youtubeUrlOrId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] placeholder-[#b0b3b8] font-mono focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddTrack(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#b0b3b8] hover:bg-[#3a3b3c] hover:text-[#e4e6eb] transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#1877f2] hover:bg-[#166fe5] text-white transition-colors"
              >
                Thêm Bài Hát
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
