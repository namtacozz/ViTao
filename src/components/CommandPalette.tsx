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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/80">
          <Search className="w-5 h-5 text-cyan-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm bài hát YouTube, đội hình TFT, đồ án học tập, hoặc nhảy tab..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {isSearchingYt && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0 mr-2" />}
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[65vh] overflow-y-auto p-3 space-y-4">
          {/* Quick Navigation suggestions */}
          {!query && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
                Chuyển Nhanh Khu Vực
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleSelectTab('overview')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/40 hover:bg-slate-800 text-slate-300 text-xs text-left"
                >
                  <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                  <span>Tổng Quan / Bio</span>
                </button>
                <button
                  onClick={() => handleSelectTab('study')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/40 hover:bg-slate-800 text-slate-300 text-xs text-left"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span>Bảng Điểm & GPA</span>
                </button>
                <button
                  onClick={() => handleSelectTab('gaming')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/40 hover:bg-slate-800 text-slate-300 text-xs text-left"
                >
                  <Gamepad2 className="w-4 h-4 text-purple-400" />
                  <span>TFT Meta Comps</span>
                </button>
                <button
                  onClick={() => handleSelectTab('media')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/40 hover:bg-slate-800 text-slate-300 text-xs text-left"
                >
                  <YoutubeIcon className="w-4 h-4 text-rose-400" />
                  <span>Kênh YouTube & Nhạc</span>
                </button>
                <button
                  onClick={() => handleSelectTab('vault')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/40 hover:bg-slate-800 text-slate-300 text-xs text-left"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Két Sắt Bảo Mật</span>
                </button>
              </div>
            </div>
          )}

          {/* YouTube Video / Music Search Results */}
          {ytResults.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider px-3 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <YoutubeIcon className="w-3.5 h-3.5" />
                  Kết Quả YouTube ({ytResults.length})
                </span>
                <span className="text-[10px] text-slate-500 lowercase">bấm để phát nổi PiP</span>
              </div>
              <div className="space-y-1">
                {ytResults.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handlePlaySong(item)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="relative w-12 h-9 rounded-lg overflow-hidden bg-slate-950 shrink-0">
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-medium text-slate-200 group-hover:text-cyan-300 truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <span>{item.author}</span>
                          {item.duration && <span>• {item.duration}</span>}
                          {item.isMusic && (
                            <span className="px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 text-[10px]">
                              Nhạc
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 pl-2">
                      <Play className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TFT Meta Comps Filter */}
          {filteredComps.length > 0 && query && (
            <div>
              <div className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider px-3 mb-1.5">
                Đội Hình TFT Phù Hợp ({filteredComps.length})
              </div>
              <div className="space-y-1">
                {filteredComps.map(comp => (
                  <button
                    key={comp.id}
                    onClick={() => handleSelectTab('gaming')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 text-left transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${comp.tier === 'S' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          Tier {comp.tier}
                        </span>
                        {comp.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Carry: {comp.mainCarry} • Tank: {comp.mainTank} • {comp.playstyle}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Study Tasks Filter */}
          {filteredTasks.length > 0 && query && (
            <div>
              <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider px-3 mb-1.5">
                Nhiệm Vụ Học Tập ({filteredTasks.length})
              </div>
              <div className="space-y-1">
                {filteredTasks.map(task => (
                  <button
                    key={task.id}
                    onClick={() => handleSelectTab('study')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 text-left transition-colors"
                  >
                    <div>
                      <div className="text-xs font-medium text-slate-200">{task.title}</div>
                      <div className="text-[11px] text-slate-400">
                        {task.courseName || 'Học tập'} • Hạn chót: {task.dueDate}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
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
