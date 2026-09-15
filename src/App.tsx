import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { PlayerProvider } from './context/PlayerContext';
import { Navbar, TabType } from './components/Navbar';
import { ProfileView } from './components/ProfileView';
import { StudyView } from './components/StudyView';
import { GamingView } from './components/GamingView';
import { MediaView } from './components/MediaView';
import { FloatingPlayer } from './components/FloatingPlayer';
import { CommandPalette } from './components/CommandPalette';
import { AdminAuthModal } from './components/AdminAuthModal';
import { Heart, Sparkles } from 'lucide-react';
import { GithubIcon } from './components/Icons';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#18191a] text-[#e4e6eb] flex flex-col justify-between selection:bg-[#1877f2]/30 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 pb-24 md:pb-12 space-y-6">
        {activeTab === 'overview' && <ProfileView onNavigateTab={setActiveTab} />}

        {activeTab === 'study' && <StudyView />}

        {activeTab === 'gaming' && <GamingView />}

        {activeTab === 'media' && <MediaView />}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#393a3b] bg-[#242526] py-5 text-center text-xs text-[#b0b3b8] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span>ViTao Universe OS</span>
            <span>•</span>
            <span className="text-[#1877f2] font-semibold">Tất cả là vì tao ⚡</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Xây dựng với tâm huyết cho</span>
            <strong className="text-[#e4e6eb]">Hột Vịt Lộn</strong>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/namtacozz/ViTao"
              target="_blank"
              rel="noreferrer"
              className="text-[#b0b3b8] hover:text-white flex items-center gap-1 transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub Repo</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Picture-in-Picture & Music Player */}
      <FloatingPlayer />

      {/* Command Palette (Spotlight Ctrl+K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        setActiveTab={setActiveTab}
      />

      {/* Admin Unlock & Settings Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <PlayerProvider>
          <MainApp />
        </PlayerProvider>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
