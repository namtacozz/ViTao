import React, { useState } from 'react';
import {
  Edit3,
  GraduationCap,
  MapPin,
  Mail,
  Briefcase,
  ExternalLink,
  Sparkles,
  Gamepad2,
  Music,
  Code2,
  FolderGit2,
  Check,
  Flame,
  Award,
  ArrowUpRight,
  Play,
  Pause,
  Layers,
  Terminal,
  Cpu
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { UserProfile } from '../types';
import { GithubIcon, FacebookIcon, YoutubeIcon } from './Icons';

interface ProfileViewProps {
  onNavigateTab?: (tab: 'overview' | 'study' | 'gaming' | 'media') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigateTab }) => {
  const { data, updateProfile } = useData();
  const { isAdmin } = useAuth();
  const { currentTrack, isPlaying, togglePlay, playTrack } = usePlayer();
  const profile = data.profile;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  // Compute academic stats
  const totalCredits = data.study.semesters.reduce(
    (acc, sem) => acc + sem.courses.reduce((cAcc, c) => cAcc + c.credits, 0),
    0
  );
  const totalScoreWeight = data.study.semesters.reduce(
    (acc, sem) => acc + sem.courses.reduce((cAcc, c) => cAcc + c.score4 * c.credits, 0),
    0
  );
  const cumulativeCpa = totalCredits > 0 ? (totalScoreWeight / totalCredits).toFixed(2) : '3.62';

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-10">
      {/* 1. HERO IDENTITY CARD (Bento Header) */}
      <div className="relative rounded-2xl bg-[#242526] border border-[#393a3b] shadow-xl overflow-hidden">
        {/* Subtle Ambient Top Glow */}
        <div className="h-36 sm:h-44 w-full bg-gradient-to-r from-blue-600/25 via-indigo-600/20 to-purple-600/25 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(24,119,242,0.35),transparent_60%)]"></div>
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-mono text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#31a24c] animate-pulse"></span>
              <span>Online & Coding</span>
            </span>
            {isAdmin && (
              <button
                onClick={() => {
                  setFormData(profile);
                  setIsEditing(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs font-bold transition-all shadow-md"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Sửa Hồ Sơ</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Info Overlay */}
        <div className="px-6 pb-6 pt-0">
          <div className="relative flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-5">
            {/* Avatar + Main Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="relative">
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl p-1 bg-[#242526] border-2 border-[#1877f2]/50 shadow-2xl overflow-hidden group">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full rounded-xl object-cover bg-[#18191a]"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-[#1877f2] text-white text-[10px] font-black uppercase tracking-wider shadow">
                  PRO
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-[#e4e6eb] tracking-tight">
                    {profile.name}
                  </h1>
                  <span className="text-xs font-mono text-[#1877f2] bg-[#1877f2]/10 border border-[#1877f2]/20 px-2.5 py-0.5 rounded-full font-bold">
                    {profile.handle}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-[#b0b3b8]">
                  {profile.title}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#b0b3b8] pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#1877f2]" />
                    {profile.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#1877f2]" />
                    {profile.email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-[#31a24c]" />
                    CPA <strong className="text-[#e4e6eb]">{cumulativeCpa}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {profile.socials.github && (
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#e4e6eb] hover:text-white transition-all shadow-sm"
                  title="GitHub Profile"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
              {profile.socials.facebook && (
                <a
                  href={profile.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#1877f2] hover:text-white transition-all shadow-sm"
                  title="Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              )}
              {profile.socials.youtube && (
                <a
                  href={profile.socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#e41e3f] hover:text-white transition-all shadow-sm"
                  title="YouTube"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Bio statement */}
          <div className="mt-5 p-3.5 rounded-xl bg-[#18191a] border border-[#393a3b]/80 text-xs text-[#e4e6eb] italic leading-relaxed flex items-center gap-2">
            <span className="text-[#1877f2] font-black text-lg">“</span>
            <span>{profile.bio}</span>
            <span className="text-[#1877f2] font-black text-lg">”</span>
          </div>
        </div>
      </div>

      {/* 2. BENTO GRID ARCHITECTURE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* BENTO CARD 1: Gaming Battle Station (ĐTCL & LMHT) */}
        <div className="bg-[#242526] rounded-2xl p-5 border border-[#393a3b] shadow-md flex flex-col justify-between hover:border-[#1877f2]/50 transition-all group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#f7b125] uppercase tracking-wider">
                <Gamepad2 className="w-4 h-4" />
                <span>Battle Station</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f7b125]/15 text-[#f7b125] font-bold border border-[#f7b125]/20">
                MetaTFT Live
              </span>
            </div>

            <div>
              <h3 className="text-base font-black text-[#e4e6eb]">Thành Tích Leo Rank</h3>
              <p className="text-xs text-[#b0b3b8]">Chỉ số thi đấu Đấu Trường Chân Lý & LMHT</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-3 rounded-xl bg-[#18191a] border border-[#393a3b]">
                <div className="text-[10px] text-[#b0b3b8] font-semibold">Rank ĐTCL (TFT)</div>
                <div className="text-lg font-black text-[#f7b125] mt-0.5">{data.gaming.tft.rank}</div>
                <div className="text-[10px] text-[#31a24c] font-mono">{data.gaming.tft.lp} LP • Top 4: {data.gaming.tft.top4Rate}%</div>
              </div>

              <div className="p-3 rounded-xl bg-[#18191a] border border-[#393a3b]">
                <div className="text-[10px] text-[#b0b3b8] font-semibold">Rank LMHT (LoL)</div>
                <div className="text-lg font-black text-[#1877f2] mt-0.5">{data.gaming.lol.rank}</div>
                <div className="text-[10px] text-[#b0b3b8] font-mono">Thắng {data.gaming.lol.winRate}%</div>
              </div>
            </div>

            <div className="text-[11px] text-[#b0b3b8] space-y-1 pt-1">
              <div className="flex justify-between">
                <span>Hệ/Tộc tủ ĐTCL:</span>
                <span className="text-[#e4e6eb] font-medium">{(data.gaming.tft.favoriteTraits || []).slice(0, 2).join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span>Tướng tủ LMHT:</span>
                <span className="text-[#e4e6eb] font-medium">{data.gaming.lol.topChampions.slice(0, 3).join(', ')}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab && onNavigateTab('gaming')}
            className="mt-4 w-full py-2 rounded-xl bg-[#3a3b3c] hover:bg-[#1877f2] text-white text-xs font-bold transition-all flex items-center justify-center gap-1 group-hover:shadow-md"
          >
            <span>Mở Gaming & Bảng Bài ĐTCL</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* BENTO CARD 2: Academic Snapshot */}
        <div className="bg-[#242526] rounded-2xl p-5 border border-[#393a3b] shadow-md flex flex-col justify-between hover:border-[#1877f2]/50 transition-all group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#31a24c] uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" />
                <span>Tiến Độ Học Tập</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#31a24c]/15 text-[#31a24c] font-bold border border-[#31a24c]/20">
                Xuất Sắc
              </span>
            </div>

            <div>
              <h3 className="text-base font-black text-[#e4e6eb]">CPA & Điểm Số</h3>
              <p className="text-xs text-[#b0b3b8]">Theo dõi điểm môn học và tín chỉ từng kỳ</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-3 rounded-xl bg-[#18191a] border border-[#393a3b]">
                <div className="text-[10px] text-[#b0b3b8] font-semibold">CPA Toàn Khóa</div>
                <div className="text-2xl font-black text-[#e4e6eb] mt-0.5">
                  {cumulativeCpa} <span className="text-xs font-normal text-[#b0b3b8]">/ 4.0</span>
                </div>
                <div className="text-[10px] text-[#1877f2] font-semibold">Mục tiêu: {data.study.targetCpa}</div>
              </div>

              <div className="p-3 rounded-xl bg-[#18191a] border border-[#393a3b]">
                <div className="text-[10px] text-[#b0b3b8] font-semibold">Tổng Tín Chỉ</div>
                <div className="text-2xl font-black text-[#31a24c] mt-0.5">{totalCredits}</div>
                <div className="text-[10px] text-[#b0b3b8]">{data.study.semesters.length} học kỳ đã lưu</div>
              </div>
            </div>

            {/* CPA Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] text-[#b0b3b8]">
                <span>Tiến trình hoàn thành mục tiêu</span>
                <span className="font-bold text-[#1877f2]">
                  {Math.min(100, Math.round((Number(cumulativeCpa) / data.study.targetCpa) * 100))}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#18191a] overflow-hidden border border-[#393a3b]">
                <div
                  className="h-full rounded-full bg-[#31a24c]"
                  style={{ width: `${Math.min(100, (Number(cumulativeCpa) / data.study.targetCpa) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab && onNavigateTab('study')}
            className="mt-4 w-full py-2 rounded-xl bg-[#3a3b3c] hover:bg-[#31a24c] text-white text-xs font-bold transition-all flex items-center justify-center gap-1 group-hover:shadow-md"
          >
            <span>Xem & Chỉnh Điểm Các Kỳ</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* BENTO CARD 3: Spotify Player & Music Hub */}
        <div className="bg-[#242526] rounded-2xl p-5 border border-[#393a3b] shadow-md flex flex-col justify-between hover:border-[#1877f2]/50 transition-all group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1877f2] uppercase tracking-wider">
                <Music className="w-4 h-4" />
                <span>Spotify & YouTube Music</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-[#1877f2]/15 text-[#1877f2] font-bold border border-[#1877f2]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1877f2] animate-ping"></span>
                <span>Playlists</span>
              </span>
            </div>

            <div>
              <h3 className="text-base font-black text-[#e4e6eb]">Âm Nhạc ViTao</h3>
              <p className="text-xs text-[#b0b3b8]">Playlists tự tạo & Trình phát nổi PiP</p>
            </div>

            {/* Currently Playing / Preview Card */}
            <div className="p-3 rounded-xl bg-[#18191a] border border-[#393a3b] flex items-center gap-3">
              <img
                src={currentTrack?.thumbnail || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80'}
                alt="Track Cover"
                className="w-12 h-12 rounded-lg object-cover bg-black shrink-0 shadow"
              />
              <div className="overflow-hidden flex-1">
                <div className="text-xs font-bold text-[#e4e6eb] truncate">
                  {currentTrack?.title || 'Lofi Hip Hop Radio'}
                </div>
                <div className="text-[10px] text-[#b0b3b8] truncate">
                  {currentTrack?.artist || 'Lofi Girl'}
                </div>
              </div>
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-[#1877f2] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shrink-0 shadow-md"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
            </div>

            <div className="text-[11px] text-[#b0b3b8] flex items-center justify-between pt-1 font-mono">
              <span>{data.media.playlists?.length || 1} Danh sách phát</span>
              <span>{data.media.favoriteTracks?.length || 0} bài hát lưu</span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab && onNavigateTab('media')}
            className="mt-4 w-full py-2 rounded-xl bg-[#3a3b3c] hover:bg-[#1877f2] text-white text-xs font-bold transition-all flex items-center justify-center gap-1 group-hover:shadow-md"
          >
            <span>Mở Trình Phát & Playlists</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* BENTO CARD 4: Tech Stack & Weapon Arsenal (Span 2 cols on LG) */}
        <div className="lg:col-span-2 bg-[#242526] rounded-2xl p-5 border border-[#393a3b] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1877f2] uppercase tracking-wider">
              <Code2 className="w-4 h-4" />
              <span>Vũ Khí Lập Trình & Tech Stack</span>
            </div>
            <span className="text-[10px] font-mono text-[#b0b3b8]">Core Arsenal</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {profile.skills.map((cat, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#18191a] border border-[#393a3b] space-y-2">
                <div className="text-xs font-bold text-[#e4e6eb] flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#1877f2]" />
                  <span>{cat.name}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {cat.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md bg-[#242526] hover:bg-[#3a3b3c] border border-[#393a3b] text-[10px] font-mono text-[#b0b3b8] hover:text-[#e4e6eb] transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BENTO CARD 5: ViTao Universe Manifesto */}
        <div className="bg-[#242526] rounded-2xl p-5 border border-[#393a3b] shadow-md flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1877f2] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>ViTao Universe</span>
            </div>
            <h3 className="text-base font-black text-[#e4e6eb]">Triết Lý ViTao ⚡</h3>
            <p className="text-xs text-[#b0b3b8] leading-relaxed">
              Trình duyệt trong trình duyệt: Gom trọn học tập, bảng bài ĐTCL chuẩn Meta, playlist nhạc YouTube và quản lý cá nhân trong 1 giao diện duy nhất.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#18191a] border border-[#393a3b] flex items-center justify-between text-xs font-mono text-[#b0b3b8]">
            <span>Phiên bản OS</span>
            <span className="text-[#1877f2] font-bold">ViTao v2.5 Meta</span>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleSave}
            className="bg-[#242526] p-6 rounded-2xl max-w-lg w-full border border-[#393a3b] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-lg font-black text-[#e4e6eb] flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-[#1877f2]" />
              <span>Chỉnh Sửa Thông Tin Cá Nhân</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Tên Hiển Thị</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Biệt Danh (@tag)</label>
                <input
                  type="text"
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Chức Danh / Nghề Nghiệp</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Tiểu Sử (Bio)</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Nơi Ở / Trường</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                />
              </div>
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Email Liên Hệ</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Link GitHub</label>
                <input
                  type="url"
                  value={formData.socials.github}
                  onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, github: e.target.value } })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Link Facebook</label>
                <input
                  type="url"
                  value={formData.socials.facebook}
                  onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, facebook: e.target.value } })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#393a3b]">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#b0b3b8] hover:bg-[#3a3b3c] hover:text-[#e4e6eb] transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1877f2] hover:bg-[#166fe5] text-white transition-colors shadow-md"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

