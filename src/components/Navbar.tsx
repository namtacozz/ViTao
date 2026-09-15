import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Gamepad2,
  ShieldCheck,
  Lock,
  Unlock,
  Search,
  CloudUpload,
  Sparkles,
  Music,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { usePlayer } from '../context/PlayerContext';
import { YoutubeIcon } from './Icons';

export type TabType = 'overview' | 'browser' | 'study' | 'gaming' | 'media' | 'vault';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenSearch: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenAuthModal,
}) => {
  const { isAdmin, lockAdmin } = useAuth();
  const { hasUnsavedChanges, isSaving, commitToGitHub, saveMessage, saveError } = useData();
  const { currentTrack, isPlaying, setIsPipOpen } = usePlayer();

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'browser', label: 'Trình Duyệt & Hub', icon: Compass },
    { id: 'study', label: 'Học Tập & Việc', icon: GraduationCap },
    { id: 'gaming', label: 'Gaming & TFT', icon: Gamepad2 },
    { id: 'media', label: 'YouTube & Nhạc', icon: YoutubeIcon },
    { id: 'vault', label: 'Két Sắt Mật', icon: ShieldCheck },
  ];

  return (
    <>
      {/* Top Banner Alert if saving or error */}
      {(saveMessage || saveError) && (
        <div
          className={`fixed top-0 left-0 right-0 z-50 py-2 px-4 text-center text-xs font-medium backdrop-blur-md transition-all duration-300 ${
            saveError
              ? 'bg-red-950/80 text-red-200 border-b border-red-500/30'
              : 'bg-emerald-950/80 text-emerald-200 border-b border-emerald-500/30'
          }`}
        >
          {saveError ? `⚠️ ${saveError}` : `✨ ${saveMessage}`}
        </div>
      )}

      {/* Main Desktop & Tablet Header */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2 group text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-600 p-[1.5px] shadow-neon-cyan group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-lg">
                    VT
                  </span>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-white text-base tracking-wide flex items-center gap-1.5">
                  ViTao <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">OS</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">Tất cả là vì tao ⚡</div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/70 p-1 rounded-xl border border-slate-800/80">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2">
            {/* Quick Search Spotlight Trigger */}
            <button
              onClick={onOpenSearch}
              title="Tìm kiếm thông minh (Ctrl+K)"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:border-cyan-500/50 hover:text-white text-xs font-medium transition-all"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Tìm kiếm...</span>
              <kbd className="hidden lg:inline font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Ctrl K
              </kbd>
            </button>

            {/* Floating Player Indicator (if music is loaded) */}
            {currentTrack && (
              <button
                onClick={() => setIsPipOpen(true)}
                title="Mở Trình phát nổi / Nhạc"
                className={`p-2 rounded-lg border transition-all ${
                  isPlaying
                    ? 'bg-purple-950/60 border-purple-500/50 text-purple-300 shadow-neon-purple animate-pulse-subtle'
                    : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Music className="w-4 h-4" />
              </button>
            )}

            {/* Admin State & Commit Button */}
            {isAdmin ? (
              <div className="flex items-center gap-2">
                {hasUnsavedChanges && (
                  <button
                    onClick={() => commitToGitHub()}
                    disabled={isSaving}
                    title="Commit các thay đổi trực tiếp lên GitHub"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-sm transition-all disabled:opacity-50"
                  >
                    <CloudUpload className="w-3.5 h-3.5 animate-bounce" />
                    <span className="hidden sm:inline">{isSaving ? 'Đang lưu...' : 'Lưu lên GitHub'}</span>
                  </button>
                )}

                <div className="relative group">
                  <button
                    onClick={onOpenAuthModal}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-medium hover:bg-cyan-900/50 transition-all"
                  >
                    <Unlock className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">Chủ Nhân</span>
                  </button>
                </div>

                <button
                  onClick={lockAdmin}
                  title="Khóa lại chế độ Khách"
                  className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                title="Mở khóa quyền quản trị cá nhân"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 text-xs font-medium transition-all"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Chế độ Khách</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0f19]/90 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-medium transition-all ${
                isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
