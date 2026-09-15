import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { PlayerProvider } from './context/PlayerContext';
import { Navbar, TabType } from './components/Navbar';
import { ProfileView } from './components/ProfileView';
import { StudyView } from './components/StudyView';
import { GamingView } from './components/GamingView';
import { MediaView } from './components/MediaView';
import { VaultView } from './components/VaultView';
import { FloatingPlayer } from './components/FloatingPlayer';
import { CommandPalette } from './components/CommandPalette';
import { AdminAuthModal } from './components/AdminAuthModal';
import { HabitTracker } from './components/HabitTracker';
import { Heart, Sparkles } from 'lucide-react';
import { GithubIcon } from './components/Icons';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 pb-24 md:pb-12 space-y-6">
        {activeTab === 'overview' && (
          <>
            <ProfileView />
            <HabitTracker />
          </>
        )}

        {activeTab === 'study' && <StudyView />}

        {activeTab === 'gaming' && <GamingView />}

        {activeTab === 'media' && <MediaView />}

        {activeTab === 'vault' && (
          <VaultView onOpenAuthModal={() => setIsAuthModalOpen(true)} />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 py-6 text-center text-xs text-slate-500 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span>ViTao Universe OS</span>
            <span>•</span>
            <span className="text-cyan-400">Tất cả là vì tao ⚡</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Xây dựng với tâm huyết cho</span>
            <strong className="text-slate-300">namtacozz</strong>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/namtacozz/ViTao"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
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
