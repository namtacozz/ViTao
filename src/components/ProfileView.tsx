import React, { useState } from 'react';
import {
  Camera,
  Edit,
  Plus,
  MoreHorizontal,
  GraduationCap,
  MapPin,
  Mail,
  Briefcase,
  Globe,
  ExternalLink,
  ThumbsUp,
  MessageSquare,
  Share2,
  Smile,
  Image as ImageIcon,
  Video,
  Star,
  Check,
  Award,
  Sparkles,
  Flame,
  ShieldAlert
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../types';
import { GithubIcon, FacebookIcon, YoutubeIcon } from './Icons';

export const ProfileView: React.FC = () => {
  const { data, updateProfile } = useData();
  const { isAdmin } = useAuth();
  const profile = data.profile;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({ p1: false, p2: false });
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({ p1: 42, p2: 28 });

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => {
      const current = !!prev[postId];
      setLikeCounts(c => ({ ...c, [postId]: current ? c[postId] - 1 : c[postId] + 1 }));
      return { ...prev, [postId]: !current };
    });
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-10">
      {/* 1. Facebook Profile Header Container */}
      <div className="bg-[#242526] rounded-b-2xl border-b border-[#393a3b] shadow-sm overflow-hidden">
        {/* Cover Photo */}
        <div className="relative w-full h-56 sm:h-80 bg-[#18191a] overflow-hidden">
          <img
            src={isEditing ? formData.coverUrl : profile.coverUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          {isAdmin && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#242526]/80 hover:bg-[#3a3b3c] text-white text-xs font-semibold backdrop-blur-md transition-colors"
            >
              <Camera className="w-4 h-4" />
              <span>{isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa ảnh bìa'}</span>
            </button>
          )}
        </div>

        {/* Profile Info Row */}
        <div className="px-6 pb-4">
          <div className="relative flex flex-col md:flex-row items-center md:items-end justify-between -mt-16 sm:-mt-24 gap-4">
            {/* Avatar overlapping cover */}
            <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
              <div className="relative group">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1 bg-[#242526] shadow-xl">
                  <img
                    src={isEditing ? formData.avatarUrl : profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover bg-[#18191a]"
                  />
                </div>
                {/* Active Green Dot */}
                <span className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-[#31a24c] border-4 border-[#242526]"></span>
              </div>

              {/* Name & Bio */}
              <div className="space-y-1 pb-2">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-[#e4e6eb] tracking-tight">
                    {profile.name}
                  </h1>
                  <span className="text-xs font-mono text-[#b0b3b8] bg-[#3a3b3c] px-2 py-0.5 rounded-full">
                    {profile.handle}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-[#b0b3b8]">
                  {profile.title}
                </p>
                <div className="text-xs text-[#b0b3b8] flex items-center justify-center md:justify-start gap-1 pt-0.5">
                  <span className="text-[#e4e6eb] font-bold">1,420</span> người theo dõi • <span className="text-[#e4e6eb] font-bold">24</span> dự án • GPA <span className="text-[#1877f2] font-bold">3.62</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pb-2">
              {isAdmin ? (
                <button
                  onClick={() => {
                    if (isEditing) handleSave();
                    else {
                      setFormData(profile);
                      setIsEditing(true);
                    }
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold text-xs shadow-md transition-all"
                >
                  {isEditing ? <Check className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  <span>{isEditing ? 'Lưu Thay Đổi' : 'Chỉnh sửa trang cá nhân'}</span>
                </button>
              ) : (
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold text-xs shadow-md transition-all"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>Theo dõi trên GitHub</span>
                </a>
              )}

              {profile.socials.facebook && (
                <a
                  href={profile.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="fb-circle-btn"
                  title="Facebook cá nhân"
                >
                  <FacebookIcon className="w-4 h-4 text-[#1877f2]" />
                </a>
              )}

              {profile.socials.youtube && (
                <a
                  href={profile.socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="fb-circle-btn"
                  title="Kênh YouTube"
                >
                  <YoutubeIcon className="w-4 h-4 text-[#e41e3f]" />
                </a>
              )}
            </div>
          </div>

          {/* Sub Navigation Bar */}
          <div className="flex items-center gap-1 mt-4 pt-1 border-t border-[#393a3b] overflow-x-auto text-xs font-semibold">
            <button className="px-4 py-3 text-[#1877f2] border-b-2 border-[#1877f2]">
              Bài viết
            </button>
            <button className="px-4 py-3 text-[#b0b3b8] hover:bg-[#3a3b3c] rounded-lg transition-colors">
              Giới thiệu
            </button>
            <button className="px-4 py-3 text-[#b0b3b8] hover:bg-[#3a3b3c] rounded-lg transition-colors">
              Bạn bè (Dự án)
            </button>
            <button className="px-4 py-3 text-[#b0b3b8] hover:bg-[#3a3b3c] rounded-lg transition-colors">
              Ảnh & Thành tích
            </button>
            <button className="px-4 py-3 text-[#b0b3b8] hover:bg-[#3a3b3c] rounded-lg transition-colors">
              Xem thêm
            </button>
          </div>
        </div>
      </div>

      {/* 2. Facebook Two-Column Profile Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (Intro, Details, Skills) - 5 cols */}
        <div className="lg:col-span-5 space-y-4">
          {/* Intro Box */}
          <div className="fb-card p-4 space-y-3">
            <h3 className="text-base font-bold text-[#e4e6eb]">Giới thiệu</h3>
            
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full p-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-xs text-[#e4e6eb]"
                rows={3}
              />
            ) : (
              <p className="text-xs text-[#e4e6eb] text-center italic leading-relaxed">
                "{profile.bio}"
              </p>
            )}

            <div className="space-y-2.5 pt-2 border-t border-[#393a3b] text-xs text-[#e4e6eb]">
              <div className="flex items-center gap-2.5 text-[#b0b3b8]">
                <Briefcase className="w-4 h-4 text-[#b0b3b8] shrink-0" />
                <span>Làm việc tại: <strong className="text-[#e4e6eb]">Fullstack Dev & TFT Master</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-[#b0b3b8]">
                <GraduationCap className="w-4 h-4 text-[#b0b3b8] shrink-0" />
                <span>Học tập: <strong className="text-[#e4e6eb]">CNTT • CPA {profile.highlights[0].value}</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-[#b0b3b8]">
                <MapPin className="w-4 h-4 text-[#b0b3b8] shrink-0" />
                <span>Đến từ: <strong className="text-[#e4e6eb]">{profile.location}</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-[#b0b3b8]">
                <Mail className="w-4 h-4 text-[#b0b3b8] shrink-0" />
                <span>Liên hệ: <strong className="text-[#e4e6eb]">{profile.email}</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-[#b0b3b8]">
                <Globe className="w-4 h-4 text-[#1877f2] shrink-0" />
                <a href={profile.socials.github} target="_blank" rel="noreferrer" className="text-[#1877f2] hover:underline truncate">
                  {profile.socials.github}
                </a>
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-1.5 rounded-lg bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#e4e6eb] text-xs font-semibold transition-colors mt-2"
              >
                Chỉnh sửa chi tiết
              </button>
            )}
          </div>

          {/* Highlights / Badges Box */}
          <div className="fb-card p-4 space-y-3">
            <h3 className="text-base font-bold text-[#e4e6eb] flex items-center justify-between">
              <span>Đáng chú ý</span>
              <span className="text-[11px] text-[#1877f2] font-normal hover:underline cursor-pointer">Xem tất cả</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {profile.highlights.map((hl, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#3a3b3c]/50 border border-[#393a3b] text-center">
                  <div className="text-[10px] text-[#b0b3b8] uppercase font-semibold">{hl.label}</div>
                  <div className="text-base font-extrabold text-[#e4e6eb] mt-0.5">{hl.value}</div>
                  <div className="text-[10px] text-[#1877f2] font-medium">{hl.subtext}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills / Hobbies Box */}
          <div className="fb-card p-4 space-y-3">
            <h3 className="text-base font-bold text-[#e4e6eb]">Sở thích & Kỹ năng</h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.flatMap(c => c.skills).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-[#3a3b3c] hover:bg-[#4e4f50] text-xs text-[#e4e6eb] border border-[#393a3b] font-medium"
                >
                  ⚡ {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Feed Posts & Showcase) - 7 cols */}
        <div className="lg:col-span-7 space-y-4">
          {/* "Bạn đang nghĩ gì thế?" Status Creator Box */}
          <div className="fb-card p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[#3a3b3c] shrink-0 border border-[#393a3b]">
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 py-2 px-4 rounded-full bg-[#3a3b3c] hover:bg-[#4e4f50] text-xs text-[#b0b3b8] cursor-pointer">
                Bạn đang nghĩ gì thế, {profile.name}?
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#393a3b] text-xs font-semibold text-[#b0b3b8]">
              <button className="flex items-center justify-center gap-2 flex-1 py-2 hover:bg-[#3a3b3c] rounded-lg transition-colors text-[#e41e3f]">
                <Video className="w-5 h-5" />
                <span className="text-[#b0b3b8]">Video trực tiếp</span>
              </button>
              <button className="flex items-center justify-center gap-2 flex-1 py-2 hover:bg-[#3a3b3c] rounded-lg transition-colors text-[#31a24c]">
                <ImageIcon className="w-5 h-5" />
                <span className="text-[#b0b3b8]">Ảnh/video</span>
              </button>
              <button className="flex items-center justify-center gap-2 flex-1 py-2 hover:bg-[#3a3b3c] rounded-lg transition-colors text-[#f7b125]">
                <Smile className="w-5 h-5" />
                <span className="text-[#b0b3b8]">Cảm xúc/hoạt động</span>
              </button>
            </div>
          </div>

          {/* Feed Post 1: Showcase Project */}
          <div className="fb-card space-y-3 overflow-hidden">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4 pb-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#3a3b3c] border border-[#393a3b]">
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#e4e6eb] flex items-center gap-1.5">
                    <span>{profile.name}</span>
                    <span className="text-[11px] font-normal text-[#b0b3b8]">đã phát hành dự án mới.</span>
                  </h4>
                  <div className="text-[11px] text-[#b0b3b8] flex items-center gap-1">
                    <span>Vừa xong</span> • <Globe className="w-3 h-3" />
                  </div>
                </div>
              </div>
              <button className="fb-circle-btn">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Post Text */}
            <div className="px-4 text-xs text-[#e4e6eb] leading-relaxed">
              ⚡ Chính thức ra mắt <strong>ViTao — Personal Universe OS</strong>! Hệ thống quản lý học tập, tra cứu đội hình chuẩn Meta ĐTCL thời gian thực và trình phát nhạc nổi Cyberpunk all-in-one. Mời anh em trải nghiệm ngay!
            </div>

            {/* Project Link Preview (Facebook style card) */}
            <div className="border-y border-[#393a3b] bg-[#18191a] hover:bg-[#202122] transition-colors cursor-pointer group">
              <div className="p-4 space-y-1.5">
                <div className="text-[11px] uppercase font-mono text-[#b0b3b8]">Namtacozz.github.io/ViTao</div>
                <h5 className="font-bold text-sm text-[#e4e6eb] group-hover:text-[#1877f2] transition-colors">
                  ViTao — Personal Universe OS & Dashboard All-in-One
                </h5>
                <p className="text-xs text-[#b0b3b8] line-clamp-2">
                  Quản lý học tập, tính GPA/CPA, bảng bài đánh chuẩn Meta ĐTCL từ MetaTFT và trình phát nhạc PiP nổi.
                </p>
              </div>
            </div>

            {/* Reaction Counters */}
            <div className="px-4 py-1.5 flex items-center justify-between text-xs text-[#b0b3b8] border-b border-[#393a3b]">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#1877f2] flex items-center justify-center text-white text-[10px]">
                  👍
                </span>
                <span>{likeCounts.p1} người thích</span>
              </div>
              <div>12 bình luận • 4 lượt chia sẻ</div>
            </div>

            {/* Action Buttons */}
            <div className="px-2 py-1 flex items-center justify-between text-xs font-semibold text-[#b0b3b8]">
              <button
                onClick={() => toggleLike('p1')}
                className={`flex items-center justify-center gap-2 flex-1 py-2 hover:bg-[#3a3b3c] rounded-lg transition-colors ${
                  likedPosts.p1 ? 'text-[#1877f2] font-bold' : ''
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${likedPosts.p1 ? 'fill-current' : ''}`} />
                <span>Thích</span>
              </button>
              <button className="flex items-center justify-center gap-2 flex-1 py-2 hover:bg-[#3a3b3c] rounded-lg transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span>Bình luận</span>
              </button>
              <button className="flex items-center justify-center gap-2 flex-1 py-2 hover:bg-[#3a3b3c] rounded-lg transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>

          {/* Feed Post 2: Gaming & TFT Achievement Post */}
          <div className="fb-card space-y-3 overflow-hidden">
            <div className="flex items-center justify-between p-4 pb-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#3a3b3c] border border-[#393a3b]">
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#e4e6eb] flex items-center gap-1.5">
                    <span>{profile.name}</span>
                    <span className="text-[11px] font-normal text-[#b0b3b8]">đã cập nhật thành tích Gaming.</span>
                  </h4>
                  <div className="text-[11px] text-[#b0b3b8] flex items-center gap-1">
                    <span>1 giờ trước</span> • <Globe className="w-3 h-3" />
                  </div>
                </div>
              </div>
              <button className="fb-circle-btn">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 text-xs text-[#e4e6eb] leading-relaxed">
              🏆 Mùa giải mới leo rank thần tốc: Đã cán mốc <strong>{data.gaming.tft.rank} ({data.gaming.tft.lp} LP)</strong> tại Đấu Trường Chân Lý! Tỉ lệ Top 4 đạt <strong>{data.gaming.tft.top4Rate}%</strong> với các bài tủ Xạ Thủ và Tiên Phong.
            </div>

            <div className="p-4 bg-[#18191a] border-y border-[#393a3b] grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-lg bg-[#242526] border border-[#393a3b]">
                <div className="text-xs text-[#b0b3b8]">Rank Hiện Tại</div>
                <div className="text-lg font-black text-[#1877f2] mt-1">{data.gaming.tft.rank}</div>
                <div className="text-[11px] text-[#31a24c]">{data.gaming.tft.lp} Điểm LP</div>
              </div>
              <div className="p-3 rounded-lg bg-[#242526] border border-[#393a3b]">
                <div className="text-xs text-[#b0b3b8]">Liên Minh Huyền Thoại</div>
                <div className="text-lg font-black text-[#e4e6eb] mt-1">{data.gaming.lol.rank}</div>
                <div className="text-[11px] text-[#b0b3b8]">Thắng {data.gaming.lol.winRate}%</div>
              </div>
            </div>

            <div className="px-4 py-1.5 flex items-center justify-between text-xs text-[#b0b3b8] border-b border-[#393a3b]">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#1877f2] flex items-center justify-center text-white text-[10px]">
                  👍
                </span>
                <span>{likeCounts.p2} người thích</span>
              </div>
              <div>6 bình luận</div>
            </div>

            <div className="px-2 py-1 flex items-center justify-between text-xs font-semibold text-[#b0b3b8]">
              <button
                onClick={() => toggleLike('p2')}
                className={`flex items-center justify-center gap-2 flex-1 py-2 hover:bg-[#3a3b3c] rounded-lg transition-colors ${
                  likedPosts.p2 ? 'text-[#1877f2] font-bold' : ''
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${likedPosts.p2 ? 'fill-current' : ''}`} />
                <span>Thích</span>
              </button>
              <button className="flex items-center justify-center gap-2 flex-1 py-2 hover:bg-[#3a3b3c] rounded-lg transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span>Bình luận</span>
              </button>
              <button className="flex items-center justify-center gap-2 flex-1 py-2 hover:bg-[#3a3b3c] rounded-lg transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
