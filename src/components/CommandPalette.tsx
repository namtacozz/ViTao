import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Music, Play, LayoutDashboard, GraduationCap, Gamepad2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { YoutubeIcon } from './Icons';
import { TabType } from './Navbar';
import { usePlayer } from '../context/PlayerContext';
import { useData } from '../context/DataContext';
import { searchYouTube, YouTubeSearchResult, convertSearchResultToTrack } from '../services/youtubeService';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: TabType) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  setActiveTab,
}) => {
  const [query, setQuery] = useState('');
  const [ytResults, setYtResults] = useState<YouTubeSearchResult[]>([]);
  const [isSearchingYt, setIsSearchingYt] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { playTrack } = usePlayer();
  const { data } = useData();

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Search YouTube with debounce
  useEffect(() => {
    if (!query.trim()) {
      setYtResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingYt(true);
      try {
        const results = await searchYouTube(query);
        setYtResults(results);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearchingYt(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  // Filter internal tasks & comps
  const qLower = query.toLowerCase();
  const filteredTasks = data.study.tasks.filter(t => t.title.toLowerCase().includes(qLower));
  const filteredComps = data.gaming.savedComps.filter(c => c.name.toLowerCase().includes(qLower));

  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab);
    onClose();
  };

  const handlePlaySong = (item: YouTubeSearchResult) => {
    const track = convertSearchResultToTrack(item);
    playTrack(track, item.isMusic ? 'music' : 'video');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#242526] rounded-2xl border border-[#393a3b] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#393a3b] bg-[#242526]">
          <Search className="w-5 h-5 text-[#1877f2] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm bài hát YouTube, đội hình TFT, đồ án học tập, hoặc chuyển tab..."
            className="w-full bg-transparent text-sm text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none"
          />
          {isSearchingYt && <Loader2 className="w-4 h-4 text-[#1877f2] animate-spin shrink-0 mr-2" />}
          {query && (
            <button onClick={() => setQuery('')} className="text-[#b0b3b8] hover:text-white mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline font-mono text-[10px] px-2 py-0.5 rounded bg-[#3a3b3c] text-[#b0b3b8] border border-[#393a3b]">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[65vh] overflow-y-auto p-3 space-y-4">
          {/* Quick Navigation suggestions */}
          {!query && (
            <div>
              <div className="text-[11px] font-semibold text-[#b0b3b8] uppercase tracking-wider px-3 mb-1.5">
                Chuyển Nhanh Khu Vực
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleSelectTab('overview')}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#3a3b3c]/60 hover:bg-[#3a3b3c] text-[#e4e6eb] text-xs font-semibold text-left transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#1877f2]" />
                  <span>Trang Cá Nhân (Profile)</span>
                </button>
                <button
                  onClick={() => handleSelectTab('study')}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#3a3b3c]/60 hover:bg-[#3a3b3c] text-[#e4e6eb] text-xs font-semibold text-left transition-colors"
                >
                  <GraduationCap className="w-4 h-4 text-[#31a24c]" />
                  <span>Bảng Điểm & GPA</span>
                </button>
                <button
                  onClick={() => handleSelectTab('gaming')}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#3a3b3c]/60 hover:bg-[#3a3b3c] text-[#e4e6eb] text-xs font-semibold text-left transition-colors"
                >
                  <Gamepad2 className="w-4 h-4 text-[#1877f2]" />
                  <span>TFT Meta Comps</span>
                </button>
                <button
                  onClick={() => handleSelectTab('media')}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#3a3b3c]/60 hover:bg-[#3a3b3c] text-[#e4e6eb] text-xs font-semibold text-left transition-colors"
                >
                  <YoutubeIcon className="w-4 h-4 text-[#e41e3f]" />
                  <span>Kênh YouTube & Nhạc</span>
                </button>
                <button
                  onClick={() => handleSelectTab('vault')}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#3a3b3c]/60 hover:bg-[#3a3b3c] text-[#e4e6eb] text-xs font-semibold text-left transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-[#f7b125]" />
                  <span>Két Sắt Bảo Mật</span>
                </button>
              </div>
            </div>
          )}

          {/* YouTube Video / Music Search Results */}
          {ytResults.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-[#1877f2] uppercase tracking-wider px-3 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <YoutubeIcon className="w-3.5 h-3.5" />
                  Kết Quả YouTube ({ytResults.length})
                </span>
                <span className="text-[10px] text-[#b0b3b8] lowercase">bấm để phát nổi</span>
              </div>
              <div className="space-y-1">
                {ytResults.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handlePlaySong(item)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#3a3b3c] text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="relative w-12 h-9 rounded-lg overflow-hidden bg-black shrink-0">
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-medium text-[#e4e6eb] group-hover:text-[#1877f2] truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-[#b0b3b8] flex items-center gap-2">
                          <span>{item.author}</span>
                          {item.duration && <span>• {item.duration}</span>}
                          {item.isMusic && (
                            <span className="px-1.5 py-0.2 rounded bg-[#3a3b3c] text-[#1877f2] text-[10px] font-bold">
                              Nhạc
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 pl-2">
                      <Play className="w-4 h-4 text-[#b0b3b8] group-hover:text-[#1877f2]" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TFT Meta Comps Filter */}
          {filteredComps.length > 0 && query && (
            <div>
              <div className="text-[11px] font-semibold text-[#1877f2] uppercase tracking-wider px-3 mb-1.5">
                Đội Hình TFT Phù Hợp ({filteredComps.length})
              </div>
              <div className="space-y-1">
                {filteredComps.map(comp => (
                  <button
                    key={comp.id}
                    onClick={() => handleSelectTab('gaming')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#3a3b3c] text-left transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#e4e6eb] flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${comp.tier === 'S' ? 'bg-[#f7b125]/20 text-[#f7b125]' : 'bg-[#1877f2]/20 text-[#1877f2]'}`}>
                          Tier {comp.tier}
                        </span>
                        {comp.name}
                      </div>
                      <div className="text-[11px] text-[#b0b3b8] mt-0.5">
                        Carry: {comp.mainCarry} • Tank: {comp.mainTank} • {comp.playstyle}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#b0b3b8]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Study Tasks Filter */}
          {filteredTasks.length > 0 && query && (
            <div>
              <div className="text-[11px] font-semibold text-[#31a24c] uppercase tracking-wider px-3 mb-1.5">
                Nhiệm Vụ Học Tập ({filteredTasks.length})
              </div>
              <div className="space-y-1">
                {filteredTasks.map(task => (
                  <button
                    key={task.id}
                    onClick={() => handleSelectTab('study')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#3a3b3c] text-left transition-colors"
                  >
                    <div>
                      <div className="text-xs font-medium text-[#e4e6eb]">{task.title}</div>
                      <div className="text-[11px] text-[#b0b3b8]">
                        {task.courseName || 'Học tập'} • Hạn chót: {task.dueDate}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#b0b3b8]" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
