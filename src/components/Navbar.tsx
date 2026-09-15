import React from 'react';
import {
  Home,
  GraduationCap,
  Gamepad2,
  Tv,
  ShieldCheck,
  Search,
  CloudUpload,
  Lock,
  Unlock,
  MessageCircle,
  Menu,
  Bell,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { usePlayer } from '../context/PlayerContext';

export type TabType = 'overview' | 'study' | 'gaming' | 'media' | 'vault';

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
  const { hasUnsavedChanges, isSaving, commitToGitHub, saveMessage, saveError, data } = useData();
  const { isPlaying, setIsPipOpen } = usePlayer();

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Trang Chủ', icon: Home },
    { id: 'study', label: 'Học Tập & Điểm', icon: GraduationCap },
    { id: 'gaming', label: 'Gaming & TFT', icon: Gamepad2 },
    { id: 'media', label: 'Video & Nhạc', icon: Tv },
    { id: 'vault', label: 'Két Sắt Mật', icon: ShieldCheck },
  ];

  return (
    <>
      {/* Top Banner Alert if saving or error */}
      {(saveMessage || saveError) && (
        <div
          className={`fixed top-0 left-0 right-0 z-50 py-1.5 px-4 text-center text-xs font-semibold backdrop-blur-md transition-all duration-200 ${
            saveError
              ? 'bg-[#e41e3f] text-white'
              : 'bg-[#31a24c] text-white'
          }`}
        >
          {saveError ? `⚠️ ${saveError}` : `✨ ${saveMessage}`}
        </div>
      )}

      {/* Facebook-style Top Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-[#242526] border-b border-[#393a3b] shadow-sm">
        <div className="max-w-[1920px] mx-auto px-4 h-14 flex items-center justify-between gap-2">
          {/* Left: Facebook Logo & Search Pill */}
          <div className="flex items-center gap-2.5 min-w-[240px]">
            {/* Logo circle */}
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center focus:outline-none group"
              title="ViTao Trang Chủ"
            >
              <div className="w-10 h-10 rounded-full bg-[#1877f2] hover:bg-[#166fe5] flex items-center justify-center text-white font-black text-2xl tracking-tighter shadow-md transition-transform group-hover:scale-105">
                v
              </div>
            </button>

            {/* Search Pill Input */}
            <button
              onClick={onOpenSearch}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#b0b3b8] hover:text-[#e4e6eb] text-sm w-56 lg:w-64 transition-colors"
            >
              <Search className="w-4 h-4 text-[#b0b3b8]" />
              <span className="truncate text-xs">Tìm kiếm trên ViTao...</span>
              <kbd className="hidden lg:inline ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#242526] text-[#b0b3b8] border border-[#393a3b]">
                Ctrl K
              </kbd>
            </button>

            {/* Mobile Search Button */}
            <button
              onClick={onOpenSearch}
              className="sm:hidden fb-circle-btn"
              title="Tìm kiếm"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Center: Facebook Navigation Tabs with Blue Underline */}
          <nav className="hidden md:flex items-center justify-center flex-1 max-w-2xl h-full">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  title={tab.label}
                  className={`relative flex items-center justify-center flex-1 h-full px-4 text-center transition-colors group ${
                    isActive
                      ? 'text-[#1877f2]'
                      : 'text-[#b0b3b8] hover:bg-[#3a3b3c] hover:text-[#e4e6eb] rounded-lg'
                  }`}
                >
                  <Icon className={`w-6 h-6 transition-transform group-hover:scale-105 ${isActive ? 'text-[#1877f2]' : ''}`} />
                  {/* Facebook Active Bottom Indicator Bar */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#1877f2] rounded-t-sm" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Quick Action Circle Buttons */}
          <div className="flex items-center justify-end gap-2 min-w-[240px]">
            {/* Save to GitHub button (if unsaved changes) */}
            {isAdmin && hasUnsavedChanges && (
              <button
                onClick={() => commitToGitHub()}
                disabled={isSaving}
                title="Lưu thay đổi lên GitHub"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
              >
                <CloudUpload className="w-4 h-4 animate-bounce" />
                <span className="hidden lg:inline">{isSaving ? 'Đang lưu...' : 'Lưu lên GitHub'}</span>
              </button>
            )}

            {/* Messenger / Music Player floating toggle */}
            <button
              onClick={() => setIsPipOpen(true)}
              title="Mở Trình phát nổi / Nhạc Messenger"
              className={`fb-circle-btn relative ${
                isPlaying ? 'bg-[#1877f2] text-white animate-pulse' : ''
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              {isPlaying && (
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#31a24c] border-2 border-[#242526]"></span>
              )}
            </button>

            {/* Admin Lock / Unlock button */}
            <button
              onClick={onOpenAuthModal}
              title={isAdmin ? 'Thiết lập Chủ nhân (Admin)' : 'Mở khóa quyền Chủ nhân'}
              className="fb-circle-btn"
            >
              {isAdmin ? <Unlock className="w-5 h-5 text-[#1877f2]" /> : <Lock className="w-5 h-5" />}
            </button>

            {/* User Profile Avatar with Online Dot */}
            <button
              onClick={onOpenAuthModal}
              className="relative p-0.5 rounded-full hover:ring-2 hover:ring-[#1877f2] transition-all"
              title={`Trang cá nhân của ${data.profile.name}`}
            >
              <div className="w-9 h-9 rounded-full overflow-hidden bg-[#3a3b3c] border border-[#393a3b]">
                <img
                  src={data.profile.avatarUrl}
                  alt={data.profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#31a24c] border-2 border-[#242526]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Facebook App Style) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#242526] border-t border-[#393a3b] px-2 py-1 flex items-center justify-around">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-[#1877f2]' : 'text-[#b0b3b8] hover:text-[#e4e6eb]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
