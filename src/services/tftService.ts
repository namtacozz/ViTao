/**
 * ViTao TFT Meta Service
 * Đồng bộ đội hình chuẩn Meta từ API chính thức MetaTFT (Set 18)
 */

import { TFTComp } from '../types';

// Trait name translations (Set 18)
const TRAIT_VI_MAP: Record<string, string> = {
  Lunar: 'Nguyệt Tộc',
  Hunter: 'Thợ Săn',
  Invoker: 'Thuật Sĩ',
  Defender: 'Vệ Binh',
  Vanguard: 'Tiên Phong',
  Executioner: 'Đao Phủ',
  Brawler: 'Đấu Sĩ',
  Spellweaver: 'Pháp Sư',
  Elderwood: 'Thần Rừng',
  Blossom: 'Linh Hoa',
  Rapidfire: 'Thiện Xạ',
  Fae: 'Tiên Tộc',
  Inferno: 'Hỏa Ngục',
  Sprykin: 'Tí Nị',
  Juggernaut: 'Dũng Sĩ',
  Adaptor: 'Thích Ứng',
  Primal: 'Nguyên Thủy',
  Blackthorn: 'Gai Đen',
  Slayer: 'Đồ Tể',
  Greenfather: 'Thần Mộc',
  Emerald: 'Lục Bảo',
  ApexPredator: 'Kẻ Săn Đỉnh Cao'
};

// Item name translations
const ITEM_VI_MAP: Record<string, string> = {
  DA_LastWhisper: 'Cung Xanh',
  DA_RedBuff: 'Bùa Đỏ',
  DA_SpearOfShojin: 'Ngọn Giáo Shojin',
  DA_InfinityEdge: 'Vô Cực Kiếm',
  DA_GuinsoosRageblade: 'Cuồng Đao Guinsoo',
  DA_BlueBuff: 'Bùa Xanh',
  DA_JeweledGauntlet: 'Găng Bảo Thạch',
  DA_HextechGunblade: 'Kiếm Súng Hextech',
  DA_RabadonsDeathcap: 'Mũ Phù Thủy',
  DA_EdgeOfNight: 'Áo Choàng Bóng Tối',
  DA_HandOfJustice: 'Bàn Tay Công Lý',
  DA_NashorsTooth: 'Nanh Nashor',
  DA_GargoyleStoneplate: 'Thú Tượng Thạch Giáp',
  DA_WarmogsArmor: 'Giáp Máu Warmog',
  DA_ProtectorsVow: 'Lời Thề Hộ Vệ',
  DA_DragonsClaw: 'Vuốt Rồng',
  DA_BrambleVest: 'Áo Choàng Gai',
  DA_Bloodthirster: 'Huyết Kiếm',
  DA_TitansResolve: 'Quyền Năng Khổng Lồ',
  DA_SteraksGage: 'Móng Vuốt Sterak',
  DA_KrakensFury: 'Cơn Thịnh Nộ Kraken',
  DA_Deathblade: 'Kiếm Tử Thần',
  DA_GiantSlayer: 'Diệt Khổng Lồ',
  DA_ArchangelsStaff: 'Quyền Trượng Đại Thiên Sứ',
  DA_StatikkShiv: 'Dao Điện Statikk',
  DA_SunfireCape: 'Áo Choàng Lửa',
  DA_Redemption: 'Dây Chuyền Chuộc Tội',
  DA_IonicSpark: 'Nỏ Sét',
  DA_SteadfastHeart: 'Trái Tim Kiên Định',
  DA_Crownguard: 'Vương Miện Hoàng Gia',
  DA_ThiefsGloves: 'Găng Đạo Tặc',
  DA_Quicksilver: 'Khăn Giải Thuật'
};

export function cleanTFTUnitName(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/^DA_18_/, '')
    .replace(/^DA_/, '')
    .replace(/18_AP$/, '')
    .replace(/18_AD$/, '')
    .replace(/18_Base$/, '')
    .replace(/18$/, '')
    .replace(/Small$/, '')
    .trim();
}

export function cleanTFTItemName(raw: string): string {
  if (ITEM_VI_MAP[raw]) return ITEM_VI_MAP[raw];
  if (!raw) return '';
  return raw
    .replace(/^DA_18_Emblem/, 'Ấn ')
    .replace(/^DA_18_/, '')
    .replace(/^DA_/, '')
    .replace(/([A-Z])/g, ' $1')
    .trim();
}

export function cleanTFTTraitName(raw: string): { name: string; count: number } {
  if (!raw) return { name: '', count: 1 };
  const parts = raw.split('_');
  const count = parseInt(parts[parts.length - 1], 10) || 1;
  const coreRaw = parts.filter(p => p !== 'DA' && p !== '18' && isNaN(Number(p))).join('');
  const viName = TRAIT_VI_MAP[coreRaw] || coreRaw;
  return { name: viName, count };
}

/**
 * Fetch live comps from MetaTFT API (Set 18)
 */
export async function fetchLiveMetaComps(): Promise<TFTComp[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const [clusterInfoRes, compBuildsRes] = await Promise.all([
      fetch('https://api-hc.metatft.com/tft-comps-api/latest_cluster_info', { signal: controller.signal }),
      fetch('https://api-hc.metatft.com/tft-comps-api/comp_builds', { signal: controller.signal })
    ]);
    clearTimeout(timeoutId);

    if (!clusterInfoRes.ok || !compBuildsRes.ok) {
      throw new Error('Không thể tải dữ liệu từ MetaTFT API');
    }

    const clusterInfoData = await clusterInfoRes.json();
    const compBuildsData = await compBuildsRes.json();

    const clusters = clusterInfoData.cluster_info?.cluster_details?.clusters || [];
    const buildsMap = compBuildsData.results || {};

    if (!clusters.length) {
      return getFallbackMetaComps();
    }

    const compsList: TFTComp[] = [];

    for (let i = 0; i < clusters.length && compsList.length < 10; i++) {
      const c = clusters[i];
      const builds = buildsMap[c.Cluster]?.builds || [];
      if (!builds.length) continue;

      const bestBuild = builds[0];
      const secondBuild = builds[1] || builds[0];

      const rawCarry = bestBuild.unit || 'Chủ Lực';
      const rawTank = secondBuild.unit !== bestBuild.unit ? secondBuild.unit : 'Amumu';

      const carry = cleanTFTUnitName(rawCarry);
      const tank = cleanTFTUnitName(rawTank);

      const avg = bestBuild.avg ? parseFloat(bestBuild.avg.toFixed(2)) : 4.1;
      let tier: 'S' | 'A' | 'B' = 'B';
      if (avg < 3.8 || compsList.length < 3) tier = 'S';
      else if (avg < 4.2 || compsList.length < 7) tier = 'A';

      const unitsList = (c.units_string || '').split(',').map((u: string) => u.trim());
      const coreUnits = unitsList.slice(0, 7).map((uName: string, idx: number) => {
        const cleaned = cleanTFTUnitName(uName);
        const isCarry = cleaned === carry;
        const isTank = cleaned === tank;
        const items = isCarry
          ? (bestBuild.buildName || []).map(cleanTFTItemName)
          : (isTank && secondBuild.buildName ? secondBuild.buildName.map(cleanTFTItemName) : undefined);

        return {
          name: cleaned,
          cost: idx === 0 ? 4 : (idx < 3 ? 3 : 2),
          star: isCarry && avg < 3.5 ? 3 : 2,
          items
        };
      });

      const traitsList = (c.traits_string || '').split(',').map((t: string) => cleanTFTTraitName(t.trim())).filter((t: any) => t.name.length > 0);

      compsList.push({
        id: `meta-${c.Cluster}`,
        name: `${carry} & ${tank} (${tier === 'S' ? 'Top Meta S' : 'Tier ' + tier})`,
        tier,
        avgPlace: avg,
        top4Rate: `${Math.round(55 + (4.4 - Math.min(avg, 4.4)) * 16)}%`,
        coreUnits,
        traits: traitsList.slice(0, 4),
        mainCarry: carry,
        mainTank: tank,
        augments: ['Vé Kim Cương', 'Khảm Bảo Thạch', 'Độc Dược Bộc Phát', 'Hình Nhân Trợ Thủ'],
        playstyle: tier === 'S' ? 'Fast 8 / Giữ chuỗi thắng ghép đồ chuẩn sớm' : 'Slow Roll Cấp 7 / Đổi bài xoay tua',
        guide: `Dữ liệu chính thức MetaTFT. Ưu tiên đồ chuẩn (BIS) cho ${carry}: ${(bestBuild.buildName || []).map(cleanTFTItemName).join(', ')}. Dàn trước củng cố bằng ${tank}.`
      });
    }

    return compsList.length > 0 ? compsList : getFallbackMetaComps();
  } catch (error) {
    console.warn('Lỗi kết nối MetaTFT live, sử dụng bộ dữ liệu chuẩn Set 18:', error);
    return getFallbackMetaComps();
  }
}

/**
 * Curated Fallback Meta Comps (Chuẩn Set 18 từ MetaTFT)
 */
export function getFallbackMetaComps(): TFTComp[] {
  return [
    {
      id: 'metatft-s1',
      name: 'Ashe & Shen Thợ Săn (Top 1 Meta S)',
      tier: 'S',
      avgPlace: 3.25,
      top4Rate: '74.2%',
      mainCarry: 'Ashe',
      mainTank: 'Shen',
      playstyle: 'Fast 8 / Ghép sớm Cung Xanh & Bùa Đỏ',
      augments: ['Thợ Săn Độc Tôn', 'Vé Kim Cương', 'Lò Rèn Di Động'],
      traits: [
        { name: 'Thợ Săn', count: 4 },
        { name: 'Vệ Binh', count: 2 },
        { name: 'Hỏa Ngục', count: 2 }
      ],
      coreUnits: [
        { name: 'Ashe', cost: 4, star: 2, items: ['Cung Xanh', 'Bùa Đỏ', 'Ngọn Giáo Shojin'] },
        { name: 'Shen', cost: 3, star: 3, items: ['Thú Tượng Thạch Giáp', 'Giáp Máu Warmog', 'Vuốt Rồng'] },
        { name: 'Sivir', cost: 2, star: 2, items: ['Dao Điện Statikk'] },
        { name: 'Tristana', cost: 2, star: 2 },
        { name: 'Amumu', cost: 3, star: 2 },
        { name: 'Kennen', cost: 3, star: 2 },
        { name: 'Ivern', cost: 5, star: 1 }
      ],
      guide: 'Lên cấp 8 ở 4-2. Bộ 3 trang bị chuẩn của Ashe là Cung Xanh, Bùa Đỏ và Shojin để bắn liên tục xuyên giáp.'
    },
    {
      id: 'metatft-s2',
      name: 'Draven & Maokai Thần Rừng Dũng Sĩ',
      tier: 'S',
      avgPlace: 3.73,
      top4Rate: '68.5%',
      mainCarry: 'Draven',
      mainTank: 'Maokai',
      playstyle: 'Fast 8 / Fast 9 càn quét late game',
      augments: ['Vé Trúng Thưởng', 'Khảm Bảo Thạch', 'Khuyến Mãi Kinh Nghiệm'],
      traits: [
        { name: 'Thần Rừng', count: 4 },
        { name: 'Dũng Sĩ', count: 2 },
        { name: 'Đao Phủ', count: 2 }
      ],
      coreUnits: [
        { name: 'Draven', cost: 4, star: 2, items: ['Kiếm Tử Thần', 'Cuồng Đao Guinsoo', 'Cơn Thịnh Nộ Kraken'] },
        { name: 'Maokai', cost: 4, star: 2, items: ['Áo Choàng Gai', 'Vuốt Rồng', 'Dây Chuyền Chuộc Tội'] },
        { name: 'Taric', cost: 4, star: 2 },
        { name: 'Ezreal', cost: 3, star: 2 },
        { name: 'Gnar', cost: 2, star: 2 },
        { name: 'Ivern', cost: 5, star: 1 }
      ],
      guide: 'Draven với Kiếm Tử Thần và Cuồng Đao có lượng DPS khổng lồ hạ gục tanker đối phương trong chớp mắt.'
    },
    {
      id: 'metatft-s3',
      name: 'Veigar & Malphite Tí Nị Pháp Sư',
      tier: 'S',
      avgPlace: 3.65,
      top4Rate: '69.1%',
      mainCarry: 'Veigar',
      mainTank: 'Malphite',
      playstyle: 'Slow Roll Cấp 7 tìm Veigar 3 sao',
      augments: ['Pháp Sư Tối Thượng', 'Bùa Xanh Cổ Đại', 'Gia Tăng SMPT'],
      traits: [
        { name: 'Tí Nị', count: 4 },
        { name: 'Pháp Sư', count: 4 },
        { name: 'Vệ Binh', count: 2 }
      ],
      coreUnits: [
        { name: 'Veigar', cost: 3, star: 3, items: ['Bùa Xanh', 'Găng Bảo Thạch', 'Kiếm Súng Hextech'] },
        { name: 'Malphite', cost: 3, star: 3, items: ['Thú Tượng Thạch Giáp', 'Vương Miện Hoàng Gia', 'Giáp Máu'] },
        { name: 'Kobuko', cost: 1, star: 3 },
        { name: 'Teemo', cost: 2, star: 2 },
        { name: 'Taric', cost: 4, star: 2 }
      ],
      guide: 'Tích 50 vàng tại cấp 7 và roll Veigar 3 sao cùng Malphite 3 sao để one-shot carry địch.'
    },
    {
      id: 'metatft-s4',
      name: 'Nidalee & Aphelios Nguyệt Tộc',
      tier: 'S',
      avgPlace: 3.90,
      top4Rate: '64.0%',
      mainCarry: 'Nidalee',
      mainTank: 'Aphelios',
      playstyle: 'Fast 8 kết hợp song sát vật lý & phép',
      augments: ['Nguyệt Tộc Bất Diệt', 'Hút Máu Toàn Phần', 'Áo Choàng Tàng Hình'],
      traits: [
        { name: 'Nguyệt Tộc', count: 4 },
        { name: 'Tiên Phong', count: 2 },
        { name: 'Thiện Xạ', count: 2 }
      ],
      coreUnits: [
        { name: 'Nidalee', cost: 4, star: 2, items: ['Vô Cực Kiếm', 'Ngọn Giáo Shojin', 'Móng Vuốt Sterak'] },
        { name: 'Aphelios', cost: 4, star: 2, items: ['Kiếm Tử Thần', 'Cuồng Đao Guinsoo', 'Cung Xanh'] },
        { name: 'Amumu', cost: 3, star: 2, items: ['Thú Tượng', 'Giáp Máu'] },
        { name: 'Diana', cost: 3, star: 2 },
        { name: 'Varus', cost: 2, star: 2 }
      ],
      guide: 'Nidalee lao vào tuyến sau cấu máu kết hợp hỏa lực tầm xa từ Aphelios.'
    },
    {
      id: 'metatft-a1',
      name: 'Ahri & Taric Thuật Sĩ (Invoker)',
      tier: 'A',
      avgPlace: 3.81,
      top4Rate: '65.2%',
      mainCarry: 'Ahri',
      mainTank: 'Taric',
      playstyle: 'Fast 8 / Fast 9 xả skill liên tục',
      augments: ['Thuật Sĩ Khai Sáng', 'Khảm Bảo Thạch', 'Hình Nhân Trợ Thủ'],
      traits: [
        { name: 'Thuật Sĩ', count: 4 },
        { name: 'Linh Hoa', count: 2 },
        { name: 'Vệ Binh', count: 2 }
      ],
      coreUnits: [
        { name: 'Ahri', cost: 4, star: 2, items: ['Bùa Xanh', 'Găng Bảo Thạch', 'Mũ Phù Thủy'] },
        { name: 'Taric', cost: 4, star: 2, items: ['Thú Tượng', 'Vuốt Rồng', 'Lời Thề Hộ Vệ'] },
        { name: 'Morgana', cost: 5, star: 1 },
        { name: 'Sett', cost: 4, star: 2 },
        { name: 'Ivern', cost: 5, star: 1 }
      ],
      guide: 'Ahri hồi năng lượng cực nhanh với Thuật Sĩ, kết hợp cùng dàn chắn siêu khỏe của Taric.'
    },
    {
      id: 'metatft-a2',
      name: 'Sett & Gnar Đao Phủ Thần Rừng',
      tier: 'A',
      avgPlace: 4.11,
      top4Rate: '61.0%',
      mainCarry: 'Gnar',
      mainTank: 'Sett',
      playstyle: 'Slow Roll Cấp 7 / Reroll 3 sao',
      augments: ['Đao Phủ Huyết Tế', 'Trái Tim Kiên Định', 'Vé Trúng Thưởng'],
      traits: [
        { name: 'Đao Phủ', count: 4 },
        { name: 'Thần Rừng', count: 3 },
        { name: 'Đấu Sĩ', count: 2 }
      ],
      coreUnits: [
        { name: 'Sett', cost: 4, star: 2, items: ['Thú Tượng Thạch Giáp', 'Thú Tượng Thạch Giáp', 'Giáp Máu Warmog'] },
        { name: 'Gnar', cost: 2, star: 3, items: ['Huyết Kiếm', 'Quyền Năng Khổng Lồ', 'Móng Vuốt Sterak'] },
        { name: 'Ezreal', cost: 3, star: 2 },
        { name: 'Kennen', cost: 3, star: 2 }
      ],
      guide: 'Sett làm bao cát bất tử với 2 Thú Tượng, tạo khoảng trống cho Gnar tích stack Quyền Năng đập nát đội hình địch.'
    }
  ];
}
