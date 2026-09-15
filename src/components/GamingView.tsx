import React, { useState } from 'react';
import {
  Gamepad2,
  Trophy,
  Swords,
  Flame,
  Bookmark,
  Trash2,
  ExternalLink,
  Edit3,
  Check,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { TFTMetaComps } from './TFTMetaComps';

export const GamingView: React.FC = () => {
  const { data, updateGaming, deleteSavedComp } = useData();
  const { isAdmin } = useAuth();
  const gaming = data.gaming;

  const [isEditingRiot, setIsEditingRiot] = useState(false);
  const [riotForm, setRiotForm] = useState(gaming.riotAccount);

  const handleSaveRiot = () => {
    updateGaming({ riotAccount: riotForm });
    setIsEditingRiot(false);
  };

  return (
    <div className="space-y-6">
      {/* Gaming Profiles Bento (LoL & TFT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* League of Legends Summoner Card */}
        <div className="glass-panel rounded-2xl p-6 border border-blue-500/20 space-y-4 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-blue-500/10 blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider">
              <Swords className="w-4 h-4" />
              <span>Liên Minh Huyền Thoại (LoL)</span>
            </div>
            {isAdmin && (
              <button
                onClick={() => {
                  if (isEditingRiot) handleSaveRiot();
                  else {
                    setRiotForm(gaming.riotAccount);
                    setIsEditingRiot(true);
                  }
                }}
                className="text-xs text-blue-300 hover:text-white flex items-center gap-1"
              >
                {isEditingRiot ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                <span>{isEditingRiot ? 'Lưu Riot ID' : 'Sửa'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl p-[1.5px] bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div>
              {isEditingRiot ? (
                <div className="flex gap-1 items-center">
                  <input
                    type="text"
                    value={riotForm.gameName}
                    onChange={(e) => setRiotForm({ ...riotForm, gameName: e.target.value })}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-white text-sm font-bold w-28"
                  />
                  <span className="text-slate-500">#</span>
                  <input
                    type="text"
                    value={riotForm.tagLine}
                    onChange={(e) => setRiotForm({ ...riotForm, tagLine: e.target.value })}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-white text-sm w-16"
                  />
                </div>
              ) : (
                <h3 className="text-lg font-black text-white flex items-center gap-1.5">
                  <span>{gaming.riotAccount.gameName}</span>
                  <span className="text-xs font-mono text-slate-400 font-normal">#{gaming.riotAccount.tagLine}</span>
                </h3>
              )}
              <div className="text-xs text-blue-300 font-semibold mt-0.5">
                {gaming.lol.rank} • {gaming.lol.lp} LP
              </div>
              <div className="text-[11px] text-slate-400">
                Tỉ lệ thắng: <strong className="text-emerald-400">{gaming.lol.winRate}%</strong> • Khu vực: {gaming.riotAccount.region}
              </div>
            </div>
          </div>

          {/* Top Champions */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Tướng Tủ & Điểm Thông Thạo Cao:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {gaming.lol.topChampions.map((champ, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-blue-500/30 text-xs font-medium text-slate-200"
                >
                  ⚡ {champ}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Teamfight Tactics (TFT) Profile Card */}
        <div className="glass-panel rounded-2xl p-6 border border-purple-500/20 space-y-4 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-purple-500/10 blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-wider">
              <Gamepad2 className="w-4 h-4" />
              <span>Đấu Trường Chân Lý (TFT)</span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60">
              Mùa Giải Mới
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl p-[1.5px] bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                <Flame className="w-8 h-8 text-purple-400" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-1.5">
                <span>{gaming.riotAccount.gameName}</span>
                <span className="text-xs font-mono text-purple-400 font-bold bg-purple-950 px-1.5 py-0.2 rounded">
                  {gaming.tft.rank}
                </span>
              </h3>
              <div className="text-xs text-purple-300 font-semibold mt-0.5">
                Điểm Rank: {gaming.tft.lp} LP
              </div>
              <div className="text-[11px] text-slate-400">
                Tỉ lệ vào Top 4: <strong className="text-emerald-400">{gaming.tft.top4Rate}%</strong>
              </div>
            </div>
          </div>

          {/* Favorite Traits */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Tộc / Hệ Yêu Thích Khi Leo Rank:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {gaming.tft.favoriteTraits.map((trait, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-purple-500/30 text-xs font-medium text-slate-200"
                >
                  🛡️ {trait}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Saved Comps (Danh sách bài đánh tủ cá nhân) */}
      {gaming.savedComps && gaming.savedComps.length > 0 && (
        <div className="glass-panel rounded-2xl p-5 border border-amber-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-white text-sm sm:text-base">
                Bài Đánh Tủ Của Bạn ({gaming.savedComps.length})
              </h3>
            </div>
            <span className="text-xs text-slate-400">Lưu từ bảng MetaTFT bên dưới</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {gaming.savedComps.map(comp => (
              <div
                key={comp.id}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 hover:border-amber-500/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 mr-2">
                      Tier {comp.tier}
                    </span>
                    <strong className="text-xs text-white">{comp.name}</strong>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => deleteSavedComp(comp.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Xóa bài này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-3">
                  <span>Chủ lực: <strong className="text-cyan-300">{comp.mainCarry}</strong></span>
                  <span>Đỡ đòn: <strong className="text-purple-300">{comp.mainTank}</strong></span>
                  <span>Lối chơi: {comp.playstyle}</span>
                </div>

                {comp.guide && (
                  <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5 italic">
                    {comp.guide}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Embedded MetaTFT live Comps Hub */}
      <TFTMetaComps />
    </div>
  );
};
