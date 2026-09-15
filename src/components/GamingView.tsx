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
  X,
  Plus,
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

  // Edit states for LoL and TFT
  const [isEditingLoL, setIsEditingLoL] = useState(false);
  const [isEditingTFT, setIsEditingTFT] = useState(false);

  // Forms
  const [lolForm, setLolForm] = useState({
    gameName: gaming.riotAccount.gameName,
    tagLine: gaming.riotAccount.tagLine,
    region: gaming.riotAccount.region,
    rank: gaming.lol.rank,
    tier: gaming.lol.tier,
    lp: gaming.lol.lp,
    winRate: gaming.lol.winRate,
    topChampionsStr: gaming.lol.topChampions.join(', ')
  });

  const [tftForm, setTftForm] = useState({
    rank: gaming.tft.rank,
    tier: gaming.tft.tier,
    lp: gaming.tft.lp,
    top4Rate: gaming.tft.top4Rate,
    favoriteTraitsStr: gaming.tft.favoriteTraits.join(', ')
  });

  const handleSaveLoL = () => {
    const champs = lolForm.topChampionsStr
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    updateGaming({
      riotAccount: {
        ...gaming.riotAccount,
        gameName: lolForm.gameName,
        tagLine: lolForm.tagLine,
        region: lolForm.region
      },
      lol: {
        ...gaming.lol,
        rank: lolForm.rank,
        tier: lolForm.tier || lolForm.rank,
        lp: Number(lolForm.lp) || 0,
        winRate: Number(lolForm.winRate) || 50,
        topChampions: champs.length > 0 ? champs : gaming.lol.topChampions
      }
    });
    setIsEditingLoL(false);
  };

  const handleSaveTFT = () => {
    const traits = tftForm.favoriteTraitsStr
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    updateGaming({
      tft: {
        ...gaming.tft,
        rank: tftForm.rank,
        tier: tftForm.tier || tftForm.rank,
        lp: Number(tftForm.lp) || 0,
        top4Rate: Number(tftForm.top4Rate) || 50,
        favoriteTraits: traits.length > 0 ? traits : gaming.tft.favoriteTraits
      }
    });
    setIsEditingTFT(false);
  };

  return (
    <div className="space-y-4">
      {/* Gaming Profiles Bento (LoL & TFT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* League of Legends Summoner Card */}
        <div className="bg-[#242526] rounded-xl p-5 border border-[#393a3b] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1877f2] uppercase tracking-wider">
              <Swords className="w-4 h-4" />
              <span>Liên Minh Huyền Thoại (LoL)</span>
            </div>
            {isAdmin && (
              <button
                onClick={() => {
                  if (isEditingLoL) handleSaveLoL();
                  else {
                    setLolForm({
                      gameName: gaming.riotAccount.gameName,
                      tagLine: gaming.riotAccount.tagLine,
                      region: gaming.riotAccount.region,
                      rank: gaming.lol.rank,
                      tier: gaming.lol.tier,
                      lp: gaming.lol.lp,
                      winRate: gaming.lol.winRate,
                      topChampionsStr: gaming.lol.topChampions.join(', ')
                    });
                    setIsEditingLoL(true);
                  }
                }}
                className="text-xs text-[#1877f2] hover:underline flex items-center gap-1 font-semibold"
              >
                {isEditingLoL ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                <span>{isEditingLoL ? 'Lưu Thông Số' : 'Chỉnh Sửa Rank'}</span>
              </button>
            )}
          </div>

          {isEditingLoL ? (
            <div className="space-y-3 bg-[#18191a] p-4 rounded-xl border border-[#393a3b]">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#b0b3b8] uppercase font-semibold">Tên Ingame</label>
                  <input
                    type="text"
                    value={lolForm.gameName}
                    onChange={e => setLolForm({ ...lolForm, gameName: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#b0b3b8] uppercase font-semibold">TagLine (#)</label>
                  <input
                    type="text"
                    value={lolForm.tagLine}
                    onChange={e => setLolForm({ ...lolForm, tagLine: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-[#b0b3b8] uppercase font-semibold">Rank LMHT</label>
                  <input
                    type="text"
                    value={lolForm.rank}
                    placeholder="VD: Kim Cương II"
                    onChange={e => setLolForm({ ...lolForm, rank: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#b0b3b8] uppercase font-semibold">Điểm LP</label>
                  <input
                    type="number"
                    value={lolForm.lp}
                    onChange={e => setLolForm({ ...lolForm, lp: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#b0b3b8] uppercase font-semibold">Tỉ Lệ Thắng (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={lolForm.winRate}
                    onChange={e => setLolForm({ ...lolForm, winRate: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#b0b3b8] uppercase font-semibold">Tướng Tủ (Phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={lolForm.topChampionsStr}
                  placeholder="VD: Yone, Sylas, Aatrox, Lee Sin"
                  onChange={e => setLolForm({ ...lolForm, topChampionsStr: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setIsEditingLoL(false)}
                  className="px-3 py-1 rounded-lg bg-[#3a3b3c] text-xs text-[#b0b3b8] hover:text-white"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveLoL}
                  className="px-3 py-1 rounded-lg bg-[#1877f2] text-xs text-white font-bold hover:bg-[#166fe5]"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#1877f2]/15 border border-[#1877f2]/30 flex items-center justify-center shrink-0 text-[#1877f2]">
                  <Trophy className="w-7 h-7" />
                </div>

                <div>
                  <h3 className="text-lg font-black text-[#e4e6eb] flex items-center gap-1.5">
                    <span>{gaming.riotAccount.gameName}</span>
                    <span className="text-xs font-mono text-[#b0b3b8] font-normal">#{gaming.riotAccount.tagLine}</span>
                  </h3>
                  <div className="text-xs text-[#1877f2] font-bold mt-0.5">
                    {gaming.lol.rank} • {gaming.lol.lp} LP
                  </div>
                  <div className="text-[11px] text-[#b0b3b8]">
                    Tỉ lệ thắng: <strong className="text-[#31a24c]">{gaming.lol.winRate}%</strong> • Khu vực: {gaming.riotAccount.region}
                  </div>
                </div>
              </div>

              {/* Top Champions */}
              <div className="pt-3 border-t border-[#393a3b]">
                <div className="text-[11px] font-semibold text-[#b0b3b8] uppercase tracking-wider mb-2">
                  Tướng Tủ & Điểm Thông Thạo Cao:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {gaming.lol.topChampions.map((champ, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-[#3a3b3c] border border-[#393a3b] text-xs font-medium text-[#e4e6eb]"
                    >
                      ⚡ {champ}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Teamfight Tactics (TFT) Profile Card */}
        <div className="bg-[#242526] rounded-xl p-5 border border-[#393a3b] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1877f2] uppercase tracking-wider">
              <Gamepad2 className="w-4 h-4" />
              <span>Đấu Trường Chân Lý (TFT)</span>
            </div>
            {isAdmin ? (
              <button
                onClick={() => {
                  if (isEditingTFT) handleSaveTFT();
                  else {
                    setTftForm({
                      rank: gaming.tft.rank,
                      tier: gaming.tft.tier,
                      lp: gaming.tft.lp,
                      top4Rate: gaming.tft.top4Rate,
                      favoriteTraitsStr: gaming.tft.favoriteTraits.join(', ')
                    });
                    setIsEditingTFT(true);
                  }
                }}
                className="text-xs text-[#1877f2] hover:underline flex items-center gap-1 font-semibold"
              >
                {isEditingTFT ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                <span>{isEditingTFT ? 'Lưu Thông Số' : 'Chỉnh Sửa Rank'}</span>
              </button>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#1877f2]/15 text-[#1877f2] border border-[#1877f2]/25">
                Set 18
              </span>
            )}
          </div>

          {isEditingTFT ? (
            <div className="space-y-3 bg-[#18191a] p-4 rounded-xl border border-[#393a3b]">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-[#b0b3b8] uppercase font-semibold">Rank ĐTCL</label>
                  <input
                    type="text"
                    value={tftForm.rank}
                    placeholder="VD: Cao Thủ"
                    onChange={e => setTftForm({ ...tftForm, rank: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#b0b3b8] uppercase font-semibold">Điểm LP</label>
                  <input
                    type="number"
                    value={tftForm.lp}
                    onChange={e => setTftForm({ ...tftForm, lp: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#b0b3b8] uppercase font-semibold">Tỉ Lệ Top 4 (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tftForm.top4Rate}
                    onChange={e => setTftForm({ ...tftForm, top4Rate: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#b0b3b8] uppercase font-semibold">Tộc / Hệ Tủ (Phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={tftForm.favoriteTraitsStr}
                  placeholder="VD: Thợ Săn, Thần Rừng, Tiên Phong, Nguyệt Tộc"
                  onChange={e => setTftForm({ ...tftForm, favoriteTraitsStr: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setIsEditingTFT(false)}
                  className="px-3 py-1 rounded-lg bg-[#3a3b3c] text-xs text-[#b0b3b8] hover:text-white"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveTFT}
                  className="px-3 py-1 rounded-lg bg-[#1877f2] text-xs text-white font-bold hover:bg-[#166fe5]"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#1877f2]/15 border border-[#1877f2]/30 flex items-center justify-center shrink-0 text-[#1877f2]">
                  <Flame className="w-7 h-7" />
                </div>

                <div>
                  <h3 className="text-lg font-black text-[#e4e6eb] flex items-center gap-1.5">
                    <span>{gaming.riotAccount.gameName}</span>
                    <span className="text-xs font-bold text-[#1877f2] bg-[#1877f2]/10 px-2 py-0.5 rounded-full">
                      {gaming.tft.rank}
                    </span>
                  </h3>
                  <div className="text-xs text-[#1877f2] font-bold mt-0.5">
                    Điểm Rank: {gaming.tft.lp} LP
                  </div>
                  <div className="text-[11px] text-[#b0b3b8]">
                    Tỉ lệ vào Top 4: <strong className="text-[#31a24c]">{gaming.tft.top4Rate}%</strong>
                  </div>
                </div>
              </div>

              {/* Favorite Traits */}
              <div className="pt-3 border-t border-[#393a3b]">
                <div className="text-[11px] font-semibold text-[#b0b3b8] uppercase tracking-wider mb-2">
                  Tộc / Hệ Yêu Thích Khi Leo Rank:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {gaming.tft.favoriteTraits.map((trait, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-[#3a3b3c] border border-[#393a3b] text-xs font-medium text-[#e4e6eb]"
                    >
                      🛡️ {trait}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Saved Comps (Danh sách bài đánh tủ cá nhân) */}
      {gaming.savedComps && gaming.savedComps.length > 0 && (
        <div className="bg-[#242526] rounded-xl p-5 border border-[#393a3b] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#f7b125]" />
              <h3 className="font-bold text-[#e4e6eb] text-sm sm:text-base">
                Bài Đánh Tủ Của Bạn ({gaming.savedComps.length})
              </h3>
            </div>
            <span className="text-xs text-[#b0b3b8]">Lưu từ bảng MetaTFT bên dưới</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {gaming.savedComps.map(comp => (
              <div
                key={comp.id}
                className="p-4 rounded-xl bg-[#18191a] border border-[#393a3b] space-y-2 hover:border-[#1877f2]/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f7b125]/20 text-[#f7b125] mr-2">
                      Tier {comp.tier}
                    </span>
                    <strong className="text-xs text-[#e4e6eb]">{comp.name}</strong>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => deleteSavedComp(comp.id)}
                      className="text-[#b0b3b8] hover:text-[#e41e3f] p-1 rounded-full hover:bg-[#3a3b3c]"
                      title="Xóa bài này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="text-[11px] text-[#b0b3b8] flex items-center gap-3">
                  <span>Chủ lực: <strong className="text-[#1877f2]">{comp.mainCarry}</strong></span>
                  <span>Đỡ đòn: <strong className="text-[#e4e6eb]">{comp.mainTank}</strong></span>
                  <span>Lối chơi: {comp.playstyle}</span>
                </div>

                {comp.guide && (
                  <p className="text-[11px] text-[#b0b3b8] border-t border-[#393a3b] pt-2 italic">
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
