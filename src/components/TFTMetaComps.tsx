import React, { useState, useEffect } from 'react';
import {
  Shield,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Search,
  BookmarkPlus,
  Check,
  Sword,
  Target,
  Crown
} from 'lucide-react';
import { TFTComp } from '../types';
import { fetchLiveMetaComps, getFallbackMetaComps } from '../services/tftService';
import { useData } from '../context/DataContext';

export const TFTMetaComps: React.FC = () => {
  const [comps, setComps] = useState<TFTComp[]>(getFallbackMetaComps());
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<'ALL' | 'S' | 'A' | 'B'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});

  const { saveCompToGaming, data } = useData();

  const loadComps = async () => {
    setLoading(true);
    try {
      const live = await fetchLiveMetaComps();
      setComps(live);
    } catch (err) {
      console.error('Error loading meta comps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComps();
  }, []);

  const handleSaveComp = (comp: TFTComp) => {
    saveCompToGaming(comp);
    setSavedStatus(prev => ({ ...prev, [comp.id]: true }));
    setTimeout(() => {
      setSavedStatus(prev => ({ ...prev, [comp.id]: false }));
    }, 2500);
  };

  // Filter comps
  const filteredComps = comps.filter(comp => {
    const matchesTier = selectedTier === 'ALL' || comp.tier === selectedTier;
    const matchesQuery =
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.mainCarry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.mainTank.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.coreUnits.some(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      comp.traits.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTier && matchesQuery;
  });

  // Cost color helper
  const getCostColor = (cost: number) => {
    switch (cost) {
      case 1: return 'border-slate-500 text-slate-300 bg-slate-900/60';
      case 2: return 'border-emerald-500 text-emerald-300 bg-emerald-950/40';
      case 3: return 'border-blue-500 text-blue-300 bg-blue-950/40';
      case 4: return 'border-purple-500 text-purple-300 bg-purple-950/40';
      case 5: return 'border-amber-400 text-amber-300 bg-amber-950/40';
      default: return 'border-slate-600 text-slate-300 bg-slate-900';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#242526] border border-[#393a3b] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-[#1877f2] text-xs font-semibold tracking-wider uppercase">
            <Crown className="w-4 h-4 text-[#f7b125]" />
            <span>TFT Live Meta Tracker</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#e4e6eb] mt-1 flex items-center gap-2">
            Đội Hình Chuẩn Meta ĐTCL (MetaTFT.com)
          </h2>
          <p className="text-xs text-[#b0b3b8] mt-1">
            Dữ liệu thống kê thứ hạng trung bình, tỉ lệ Top 4, đồ chuẩn (BIS) và vị trí cờ theo thời gian thực.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://www.metatft.com/comps"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#e4e6eb] text-xs font-semibold transition-all"
          >
            <span>Mở MetaTFT</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={loadComps}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Đang tải...' : 'Làm mới Meta'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Tier filter buttons */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#242526] border border-[#393a3b] w-full sm:w-auto">
          {(['ALL', 'S', 'A', 'B'] as const).map(tier => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedTier === tier
                  ? 'bg-[#1877f2] text-white shadow-sm'
                  : 'text-[#b0b3b8] hover:text-[#e4e6eb] hover:bg-[#3a3b3c]'
              }`}
            >
              {tier === 'ALL' ? 'Tất cả' : `Tier ${tier}`}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên tướng, bài đánh..."
            className="w-full pl-9 pr-4 py-2 rounded-full bg-[#3a3b3c] border border-[#393a3b] text-xs text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
          />
          <Search className="w-4 h-4 text-[#b0b3b8] absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Comps List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredComps.map(comp => {
          const isCompSaved = (data.gaming.savedComps || []).some(c => c.name === comp.name) || savedStatus[comp.id];

          return (
            <div
              key={comp.id}
              className="bg-[#242526] rounded-xl p-5 border border-[#393a3b] shadow-sm space-y-4 hover:border-[#1877f2]/50 transition-all group"
            >
              {/* Header Card */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase ${
                        comp.tier === 'S'
                          ? 'bg-[#f7b125]/20 text-[#f7b125]'
                          : comp.tier === 'A'
                          ? 'bg-[#1877f2]/20 text-[#1877f2]'
                          : 'bg-[#31a24c]/20 text-[#31a24c]'
                      }`}
                    >
                      Tier {comp.tier}
                    </span>
                    <span className="text-[11px] text-[#b0b3b8] font-mono">
                      Top 4: <strong className="text-[#31a24c]">{comp.top4Rate || '60%'}</strong> • Hạng TB:{' '}
                      <strong className="text-[#1877f2]">{comp.avgPlace || '3.9'}</strong>
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#e4e6eb] group-hover:text-[#1877f2] transition-colors">
                    {comp.name}
                  </h3>
                </div>

                {/* Bookmark / Save Comp */}
                <button
                  onClick={() => handleSaveComp(comp)}
                  title={isCompSaved ? 'Đã lưu vào danh sách tủ' : 'Lưu bài này vào danh sách tủ'}
                  className={`p-2 rounded-full border text-xs flex items-center justify-center transition-all ${
                    isCompSaved
                      ? 'bg-[#31a24c]/20 border-[#31a24c]/40 text-[#31a24c]'
                      : 'bg-[#3a3b3c] border-transparent text-[#b0b3b8] hover:text-white hover:bg-[#4e4f50]'
                  }`}
                >
                  {isCompSaved ? <Check className="w-4 h-4 stroke-[3]" /> : <BookmarkPlus className="w-4 h-4" />}
                </button>
              </div>

              {/* Traits synergy pills */}
              <div className="flex flex-wrap gap-1.5">
                {comp.traits.map((trait, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#3a3b3c] border border-[#393a3b] text-[11px] font-medium text-[#e4e6eb]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1877f2]"></span>
                    <span>{trait.name}</span>
                    <strong className="text-[#1877f2] ml-0.5">{trait.count}</strong>
                  </span>
                ))}
              </div>

              {/* Core Units & BIS Items */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-[#b0b3b8] uppercase tracking-wider">
                  Tướng Cốt Lõi & Trang Bị Chuẩn (BIS):
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {comp.coreUnits.map((unit, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#18191a] border border-[#393a3b] flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#e4e6eb] truncate">{unit.name}</span>
                        <span className="text-[10px] font-mono text-[#b0b3b8]">{unit.cost} vàng</span>
                      </div>

                      {/* Items */}
                      {unit.items && unit.items.length > 0 ? (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {unit.items.map((item, i) => (
                            <span
                              key={i}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-[#3a3b3c] text-[#f7b125] truncate max-w-full font-medium"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[9px] text-[#b0b3b8] italic mt-1">Đồ kích hệ</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Augments and Strategy Guide */}
              <div className="p-3 rounded-lg bg-[#18191a] border border-[#393a3b] space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-[#f7b125] font-semibold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Lối chơi: {comp.playstyle}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {comp.augments.map((aug, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-[#3a3b3c] text-[#e4e6eb] text-[10px]"
                    >
                      {aug}
                    </span>
                  ))}
                </div>
                {comp.guide && (
                  <p className="text-[11px] text-[#b0b3b8] leading-relaxed pt-1.5 border-t border-[#393a3b]">
                    💡 {comp.guide}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
