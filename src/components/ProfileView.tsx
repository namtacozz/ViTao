import React, { useState } from 'react';
import {
  Globe,
  Mail,
  MapPin,
  Sparkles,
  ExternalLink,
  Star,
  Edit3,
  Check,
  Code2,
  Gamepad2,
  GraduationCap,
  Flame,
  Award
} from 'lucide-react';
import { GithubIcon, FacebookIcon, YoutubeIcon } from './Icons';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../types';

export const ProfileView: React.FC = () => {
  const { data, updateProfile } = useData();
  const { isAdmin } = useAuth();
  const profile = data.profile;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Admin in-place edit toggle */}
      {isAdmin && (
        <div className="flex justify-end">
          <button
            onClick={() => {
              if (isEditing) handleSave();
              else {
                setFormData(profile);
                setIsEditing(true);
              }
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isEditing
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                : 'bg-slate-900 border border-slate-700/80 text-cyan-300 hover:border-cyan-500/50'
            }`}
          >
            {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'Lưu Thông Tin Profile' : 'Chỉnh Sửa Profile (Admin)'}</span>
          </button>
        </div>
      )}

      {/* Hero Bento Card */}
      <div className="relative rounded-3xl glass-panel border border-cyan-500/20 overflow-hidden p-6 sm:p-8">
        {/* Neon ambient glow in background */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar with cyber ring */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl p-[2px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 shadow-neon-cyan">
              <img
                src={isEditing ? formData.avatarUrl : profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full rounded-[14px] object-cover bg-slate-950"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-slate-950/90 border border-cyan-400/60 text-cyan-300 text-[10px] font-mono flex items-center gap-1 shadow-sm">
              <span>{profile.status.emoji}</span>
              <span className="capitalize">{profile.status.activity}</span>
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white font-black text-xl"
                />
              ) : (
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {profile.name}
                </h1>
              )}
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800/60">
                {profile.handle}
              </span>
              <span className="text-xs font-medium text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-800/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>ViTao Creator</span>
              </span>
            </div>

            {isEditing ? (
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-cyan-400 text-sm font-semibold"
              />
            ) : (
              <p className="text-sm font-semibold text-cyan-300/90">{profile.title}</p>
            )}

            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={2}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs"
              />
            ) : (
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {profile.bio}
              </p>
            )}

            {/* Meta info & socials */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>{profile.email}</span>
              </div>

              {/* Social buttons */}
              <div className="flex items-center gap-2 sm:ml-auto">
                {profile.socials.github && (
                  <a
                    href={profile.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.facebook && (
                  <a
                    href={profile.socials.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-blue-400 border border-slate-700 transition-colors"
                  >
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                )}
                {profile.socials.youtube && (
                  <a
                    href={profile.socials.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-rose-400 border border-slate-700 transition-colors"
                  >
                    <YoutubeIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Live Status Message Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-400">Trạng thái hiện tại:</span>
            {isEditing ? (
              <input
                type="text"
                value={formData.status.text}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: { ...formData.status, text: e.target.value }
                  })
                }
                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-emerald-300 text-xs"
              />
            ) : (
              <span className="text-emerald-300 font-medium">"{profile.status.text}"</span>
            )}
          </div>
          <span className="text-slate-500 text-[11px] font-mono">
            Deploy tự động qua GitHub Actions
          </span>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {profile.highlights.map((hl, idx) => (
          <div
            key={idx}
            className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-cyan-500/30 transition-all group"
          >
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {hl.label}
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-white mt-1 group-hover:text-cyan-300 transition-colors">
              {hl.value}
            </div>
            <div className="text-[11px] text-cyan-400/80 mt-0.5 font-medium">{hl.subtext}</div>
          </div>
        ))}
      </div>

      {/* Skills & Tech Stack */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
          <Code2 className="w-4 h-4" />
          <span>Kỹ Năng & Công Nghệ Thành Thạo</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profile.skills.map((category, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center justify-between">
                <span>{category.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400">
                  {category.skills.length}
                </span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {category.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Showcase Projects */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Dự Án Tâm Đắc & Sản Phẩm Nổi Bật</span>
          </div>
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
          >
            Xem tất cả repos trên GitHub ↗
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profile.showcaseProjects.map((project) => (
            <div
              key={project.id}
              className="glass-card rounded-2xl p-5 border border-slate-800/90 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h4>
                  {project.stars !== undefined && (
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{project.stars}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-cyan-300 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80 text-xs">
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>Mã nguồn</span>
                  </a>
                ) : <span />}

                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Trải nghiệm</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
