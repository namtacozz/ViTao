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
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-purple-500/20">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono tracking-wider uppercase">
            <Crown className="w-4 h-4" />
            <span>TFT Live Meta Tracker</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            Đội Hình Chuẩn Meta ĐTCL (MetaTFT.com)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dữ liệu thống kê thứ hạng trung bình, tỉ lệ Top 4, đồ chuẩn (BIS) và vị trí cờ theo thời gian thực.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://www.metatft.com/comps"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-medium transition-all"
          >
            <span>Mở MetaTFT</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={loadComps}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-neon-purple transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Đang tải...' : 'Làm mới Meta'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Tier filter buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800 w-full sm:w-auto">
          {(['ALL', 'S', 'A', 'B'] as const).map(tier => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedTier === tier
                  ? tier === 'S'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : tier === 'A'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Comps List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredComps.map(comp => {
          const isCompSaved = (data.gaming.savedComps || []).some(c => c.name === comp.name) || savedStatus[comp.id];

          return (
            <div
              key={comp.id}
              className="glass-card rounded-2xl p-5 space-y-4 hover:border-purple-500/40 transition-all duration-200 group"
            >
              {/* Header Card */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-black tracking-wider uppercase border ${
                        comp.tier === 'S'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                          : comp.tier === 'A'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      }`}
                    >
                      Tier {comp.tier}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Top 4: <strong className="text-emerald-400">{comp.top4Rate || '60%'}</strong> • Hạng TB:{' '}
                      <strong className="text-cyan-400">{comp.avgPlace || '3.9'}</strong>
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                    {comp.name}
                  </h3>
                </div>

                {/* Bookmark / Save Comp */}
                <button
                  onClick={() => handleSaveComp(comp)}
                  title={isCompSaved ? 'Đã lưu vào danh sách tủ' : 'Lưu bài này vào danh sách tủ'}
                  className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition-all ${
                    isCompSaved
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-purple-500/40'
                  }`}
                >
                  {isCompSaved ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                </button>
              </div>

              {/* Traits synergy pills */}
              <div className="flex flex-wrap gap-1.5">
                {comp.traits.map((trait, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-medium text-slate-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    <span>{trait.name}</span>
                    <strong className="text-cyan-400 ml-0.5">{trait.count}</strong>
                  </span>
                ))}
              </div>

              {/* Core Units & BIS Items */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Tướng Cốt Lõi & Trang Bị Chuẩn (BIS):
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {comp.coreUnits.map((unit, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl border ${getCostColor(unit.cost)} flex flex-col justify-between`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs truncate">{unit.name}</span>
                        <span className="text-[10px] font-mono opacity-80">{unit.cost} vàng</span>
                      </div>

                      {/* Items */}
                      {unit.items && unit.items.length > 0 ? (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {unit.items.map((item, i) => (
                            <span
                              key={i}
                              className="text-[9px] px-1 py-0.5 rounded bg-slate-950/80 text-amber-200 border border-amber-500/30 truncate max-w-full"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[9px] text-slate-500 italic mt-1">Đồ kích hệ</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Augments and Strategy Guide */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Lối chơi: {comp.playstyle}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {comp.augments.map((aug, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-800/40 text-[10px]"
                    >
                      {aug}
                    </span>
                  ))}
                </div>
                {comp.guide && (
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-900">
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
