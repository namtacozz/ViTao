import React, { useState } from 'react';
import {
  Globe,
  ExternalLink,
  Shield,
  RefreshCw,
  Plus,
  Tv,
  ArrowRight,
  Maximize2,
  Lock,
  Smartphone,
  MessageCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { TikTokIcon, FacebookIcon, MessengerIcon, YoutubeIcon, GithubIcon } from './Icons';
import { useAuth } from '../context/AuthContext';

interface WorkspaceTab {
  id: string;
  title: string;
  icon: React.ElementType;
  url: string;
  appWidth?: number;
  appHeight?: number;
  supportsIframe?: boolean;
  category: 'social' | 'entertainment' | 'work' | 'ai';
  description: string;
}

export const BrowserWorkspaceView: React.FC = () => {
  const { isAdmin } = useAuth();

  const defaultTabs: WorkspaceTab[] = [
    {
      id: 'messenger',
      title: 'Messenger Chat',
      icon: MessengerIcon,
      url: 'https://www.messenger.com',
      appWidth: 460,
      appHeight: 760,
      supportsIframe: false,
      category: 'social',
      description: 'Nhắn tin Messenger trực tiếp dạng cửa sổ App mini nổi tiện lợi.'
    },
    {
      id: 'tiktok',
      title: 'TikTok Video',
      icon: TikTokIcon,
      url: 'https://www.tiktok.com',
      appWidth: 460,
      appHeight: 820,
      supportsIframe: false,
      category: 'entertainment',
      description: 'Lướt video ngắn TikTok màn hình dọc mượt mà.'
    },
    {
      id: 'facebook',
      title: 'Facebook Feed',
      icon: FacebookIcon,
      url: 'https://www.facebook.com',
      appWidth: 900,
      appHeight: 850,
      supportsIframe: false,
      category: 'social',
      description: 'Bảng tin Facebook cập nhật thông báo và bạn bè.'
    },
    {
      id: 'youtube',
      title: 'YouTube Hub',
      icon: YoutubeIcon,
      url: 'https://www.youtube.com',
      supportsIframe: true,
      category: 'entertainment',
      description: 'Xem video, nghe nhạc nền không ngắt quãng.'
    },
    {
      id: 'github',
      title: 'GitHub namtacozz',
      icon: GithubIcon,
      url: 'https://github.com/namtacozz',
      appWidth: 1050,
      appHeight: 850,
      supportsIframe: false,
      category: 'work',
      description: 'Quản lý repositories, commit code và pull requests.'
    },
    {
      id: 'metatft',
      title: 'MetaTFT Live Comps',
      icon: Globe,
      url: 'https://www.metatft.com/comps',
      supportsIframe: true,
      category: 'entertainment',
      description: 'Bảng đội hình chuẩn Meta ĐTCL.'
    }
  ];

  const [activeTabId, setActiveTabId] = useState<string>('messenger');
  const [customUrl, setCustomUrl] = useState<string>('https://www.messenger.com');
  const [iframeError, setIframeError] = useState<boolean>(false);

  const activeTab = defaultTabs.find(t => t.id === activeTabId) || defaultTabs[0];

  // Open App in standalone popup window (PWA-style)
  const openAppWindow = (url: string, title: string, width = 480, height = 780) => {
    const left = window.screen.width - width - 40;
    const top = 60;
    window.open(
      url,
      `vitao_app_${title.replace(/\s+/g, '_')}`,
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`
    );
  };

  const handleSwitchTab = (tab: WorkspaceTab) => {
    setActiveTabId(tab.id);
    setCustomUrl(tab.url);
    setIframeError(false);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Explanation Banner on Security & Multi-Tab Browser */}
      <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <span>Trình Duyệt Trong Trình Duyệt — Không Gian Đa Nhiệm ViTao</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                Multi-Web Dock
              </span>
            </h3>
            <p className="text-slate-400 text-xs">
              Tích hợp TikTok, Messenger, Facebook, YouTube và GitHub trên cùng một bảng điều khiển trung tâm.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => openAppWindow(activeTab.url, activeTab.title, activeTab.appWidth, activeTab.appHeight)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-neon-cyan transition-all"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Mở Cửa Sổ App Mini Nổi</span>
          </button>
        </div>
      </div>

      {/* Browser Shell */}
      <div className="rounded-2xl glass-panel border border-slate-700/80 overflow-hidden shadow-2xl">
        {/* Browser Tabs Header Bar */}
        <div className="flex items-center justify-between px-3 pt-2.5 bg-slate-900/90 border-b border-slate-800 overflow-x-auto gap-1">
          <div className="flex items-center gap-1.5">
            {defaultTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTabId === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSwitchTab(tab)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-t-xl text-xs font-semibold transition-all border-t border-x ${
                    isActive
                      ? 'bg-[#07090e] text-cyan-300 border-slate-700 shadow-sm'
                      : 'bg-slate-900/40 text-slate-400 hover:text-white border-transparent hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{tab.title}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 pb-1">
            <button
              onClick={() => openAppWindow('https://www.messenger.com', 'Messenger', 460, 760)}
              title="Mở nhanh Messenger"
              className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-950/50"
            >
              <MessengerIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => openAppWindow('https://www.tiktok.com', 'TikTok', 460, 820)}
              title="Mở nhanh TikTok"
              className="p-1.5 rounded-lg text-pink-400 hover:bg-pink-950/50"
            >
              <TikTokIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => openAppWindow('https://www.facebook.com', 'Facebook', 900, 850)}
              title="Mở nhanh Facebook"
              className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-950/50"
            >
              <FacebookIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* URL Bar & Action Navigation */}
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#0b0f19] border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2 flex-1">
            <span className="p-1 text-slate-400">
              <Globe className="w-4 h-4 text-cyan-400" />
            </span>
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openAppWindow(customUrl, activeTab.title, activeTab.appWidth, activeTab.appHeight)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Mở App Riêng</span>
            </button>
          </div>
        </div>

        {/* Main Viewport */}
        <div className="relative min-h-[620px] bg-[#07090e] p-4 flex flex-col justify-between">
          {/* If the website does not allow standard iframe due to X-Frame-Options (Facebook, Messenger, TikTok) */}
          {!activeTab.supportsIframe ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6 max-w-xl mx-auto">
              {/* App Icon Glow */}
              <div className="w-20 h-20 rounded-3xl p-[2px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 shadow-2xl flex items-center justify-center">
                <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center">
                  {React.createElement(activeTab.icon, { className: 'w-10 h-10 text-cyan-300' })}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">
                  Không Gian {activeTab.title} Đã Sẵn Sàng
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeTab.description}
                </p>
              </div>

              {/* Security note explaining why popup is the professional approach */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Shield className="w-4 h-4" />
                  <span>Cơ Chế Bảo Mật & Lưu Tài Khoản (Same-Origin Policy):</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Các nền tảng như <strong>Facebook, Messenger, TikTok</strong> chặn việc nhúng giao diện bên trong thẻ iframe để chống tấn công Clickjacking.
                  Tuy nhiên, khi mở bằng chế độ <strong>Cửa Sổ App Mini (Popup Workspace)</strong> của ViTao, trình duyệt sẽ <strong>tự động giữ nguyên toàn bộ tài khoản bạn đã đăng nhập</strong> trên máy tính, lướt mượt mà và nhắn tin mà không bao giờ phải đăng nhập lại!
                </p>
              </div>

              {/* Big Action Button to launch App */}
              <button
                onClick={() => openAppWindow(activeTab.url, activeTab.title, activeTab.appWidth, activeTab.appHeight)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:scale-105 text-white font-bold text-sm shadow-neon-cyan transition-all"
              >
                <span>Bật {activeTab.title} Dạng Cửa Sổ Riêng</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick links to switch */}
              <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
                <span>Mở nhanh khác:</span>
                <button
                  onClick={() => openAppWindow('https://www.messenger.com', 'Messenger', 460, 760)}
                  className="hover:text-blue-400 underline"
                >
                  Messenger
                </button>
                <span>•</span>
                <button
                  onClick={() => openAppWindow('https://www.tiktok.com', 'TikTok', 460, 820)}
                  className="hover:text-pink-400 underline"
                >
                  TikTok
                </button>
                <span>•</span>
                <button
                  onClick={() => openAppWindow('https://www.facebook.com', 'Facebook', 900, 850)}
                  className="hover:text-blue-500 underline"
                >
                  Facebook
                </button>
              </div>
            </div>
          ) : (
            /* If the website allows embedding (e.g. MetaTFT, YouTube embed) */
            <div className="w-full h-[620px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <iframe
                src={customUrl}
                title={activeTab.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
