import { AppData, TFTComp } from '../types';
import duckAvatar from '../assets/avatar.jpg';

export const INITIAL_APP_DATA: AppData = {
  profile: {
    name: 'Hột Vịt Lộn',
    handle: '@hotvitlon',
    title: 'Fullstack Developer & TFT Tactician',
    bio: 'Đam mê xây dựng web hiện đại, khám phá công nghệ mới, leo rank TFT và tạo ra những công cụ hữu ích cho bản thân. "Tất cả là vì tao" ⚡',
    avatarUrl: duckAvatar,
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    status: {
      text: 'Đang mài giũa ViTao Hub & leo rank Thách Đấu',
      emoji: '⚡',
      activity: 'coding',
    },
    location: 'Việt Nam',
    email: 'namtacozz@gmail.com',
    socials: {
      github: 'https://github.com/namtacozz',
      facebook: 'https://facebook.com',
      discord: 'namtacozz#0001',
      youtube: 'https://youtube.com',
      steam: 'https://steamcommunity.com',
    },
    skills: [
      {
        name: 'Frontend & UI/UX',
        skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'GSAP', 'Vite']
      },
      {
        name: 'Backend & Cloud',
        skills: ['Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'Docker', 'GitHub Actions']
      },
      {
        name: 'Gaming & Strategy',
        skills: ['Teamfight Tactics (Challenger Mindset)', 'League of Legends (Mid/Top)', 'Meta Theorycrafting']
      }
    ],
    showcaseProjects: [
      {
        id: 'vitao',
        title: 'ViTao — Personal Universe OS',
        description: 'Trung tâm điều hành và quản lý cá nhân all-in-one: Quản lý học tập, TFT Meta live, YouTube PiP Player và Profile Showcase.',
        tags: ['React', 'TypeScript', 'Tailwind CSS', 'GitHub API', 'GSAP'],
        demoUrl: 'https://namtacozz.github.io/ViTao/',
        githubUrl: 'https://github.com/namtacozz/ViTao',
        stars: 12,
        highlight: true
      },
      {
        id: 'tft-tactics-helper',
        title: 'TFT Auto Comps Scout',
        description: 'Công cụ phân tích và gợi ý trang bị chuẩn (BIS), lõi công nghệ và đội hình meta DTCL theo thời gian thực.',
        tags: ['TypeScript', 'TFT API', 'Algorithm'],
        githubUrl: 'https://github.com/namtacozz',
        stars: 8,
        highlight: true
      },
      {
        id: 'study-flow-app',
        title: 'Cyberpunk Study Tracker',
        description: 'Theo dõi GPA đại học, tính điểm tích lũy CPA và phân bổ thời gian học tập theo phương pháp Pomodoro.',
        tags: ['React', 'Web Audio', 'Tailwind'],
        githubUrl: 'https://github.com/namtacozz',
        stars: 5,
        highlight: false
      }
    ],
    highlights: [
      { label: 'CPA Tích Lũy', value: '3.62 / 4.0', subtext: 'Xếp loại Xuất sắc' },
      { label: 'TFT Mùa Hiện Tại', value: 'Cao Thủ (Master)', subtext: 'Top 4 Rate: 58.4%' },
      { label: 'GitHub Repos', value: '24+', subtext: 'Projects & Tools' },
      { label: 'Năng suất', value: '1,420+ giờ', subtext: 'Code & Học tập' },
    ]
  },

  study: {
    targetCpa: 3.7,
    semesters: [
      {
        id: 'sem-2025-1',
        name: 'Học kỳ 1 (2025 - 2026)',
        year: '2025-2026',
        gpa10: 8.85,
        gpa4: 3.65,
        courses: [
          { id: 'c1', code: 'IT3020', name: 'Toán Rời Rạc & Cấu Trúc Dữ Liệu', credits: 3, scoreProcess: 9.0, scoreExam: 8.5, score10: 8.7, score4: 3.7, letterGrade: 'A' },
          { id: 'c2', code: 'IT3040', name: 'Lập Trình Hướng Đối Tượng', credits: 3, scoreProcess: 9.5, scoreExam: 9.0, score10: 9.2, score4: 4.0, letterGrade: 'A+' },
          { id: 'c3', code: 'IT4010', name: 'Cơ Sở Dữ Liệu & SQL', credits: 3, scoreProcess: 8.5, scoreExam: 8.0, score10: 8.2, score4: 3.5, letterGrade: 'B+' },
          { id: 'c4', code: 'SSH1120', name: 'Triết Học & Phương Pháp Luận', credits: 2, scoreProcess: 8.0, scoreExam: 8.5, score10: 8.3, score4: 3.5, letterGrade: 'B+' },
          { id: 'c5', code: 'IT4220', name: 'Mạng Máy Tính & An Ninh Mạng', credits: 3, scoreProcess: 9.0, scoreExam: 8.5, score10: 8.7, score4: 3.7, letterGrade: 'A' },
        ]
      },
      {
        id: 'sem-2024-2',
        name: 'Học kỳ 2 (2024 - 2025)',
        year: '2024-2025',
        gpa10: 8.60,
        gpa4: 3.58,
        courses: [
          { id: 'c6', code: 'MI1110', name: 'Giải Tích 1 & Đại Số Tuyến Tính', credits: 4, scoreProcess: 8.0, scoreExam: 8.5, score10: 8.3, score4: 3.5, letterGrade: 'B+' },
          { id: 'c7', code: 'IT1110', name: 'Nhập Môn Tin Học & C/C++', credits: 3, scoreProcess: 9.5, scoreExam: 9.5, score10: 9.5, score4: 4.0, letterGrade: 'A+' },
          { id: 'c8', code: 'FL1010', name: 'Tiếng Anh Học Thuật B2', credits: 3, scoreProcess: 8.5, scoreExam: 8.0, score10: 8.2, score4: 3.5, letterGrade: 'B+' },
        ]
      }
    ],
    tasks: [
      {
        id: 't1',
        title: 'Hoàn thiện đồ án Web ViTao & deploy GitHub Pages',
        description: 'Tích hợp MetaTFT API, Media Player PiP và mã hóa client-side.',
        courseName: 'Dự án cá nhân',
        dueDate: '2026-09-20',
        priority: 'urgent',
        status: 'in-progress'
      },
      {
        id: 't2',
        title: 'Luyện đề thi thử giữa kỳ Môn Cơ Sở Dữ Liệu',
        description: 'Ôn tập chuẩn hóa 3NF, BCNF và truy vấn tối ưu SQL Index.',
        courseName: 'Cơ Sở Dữ Liệu',
        dueDate: '2026-09-28',
        priority: 'normal',
        status: 'todo'
      },
      {
        id: 't3',
        title: 'Nộp báo cáo bài tập lớn Lập trình Hướng đối tượng',
        description: 'Clean code mô hình Factory và Singleton trong C++.',
        courseName: 'Lập Trình Hướng Đối Tượng',
        dueDate: '2026-09-15',
        priority: 'urgent',
        status: 'completed'
      }
    ],
    notes: [
      {
        id: 'n1',
        title: 'Chiến thuật giữ GPA trên 3.6',
        content: '1. Điểm danh và bài tập tuần luôn lấy trọn 10 điểm.\n2. Giữa kỳ học trước 1 tuần, làm hết bài tập ví dụ của thầy cô.\n3. Nhóm đồ án chọn người có trách nhiệm hoặc gánh phần core.',
        updatedAt: '2026-09-10'
      }
    ]
  },

  gaming: {
    riotAccount: {
      gameName: 'Hột Vịt Lộn',
      tagLine: 'VN2',
      region: 'VN'
    },
    lol: {
      rank: 'Kim Cương II',
      tier: 'Diamond II',
      lp: 68,
      winRate: 56.5,
      topChampions: ['Yone', 'Sylas', 'Aatrox', 'Lee Sin']
    },
    tft: {
      rank: 'Cao Thủ',
      tier: 'Master',
      lp: 184,
      top4Rate: 59.2,
      favoriteTraits: ['Thích Khách', 'Học Giả', 'Vệ Binh', 'Đột Biến']
    },
    savedComps: [
      {
        id: 'comp-1',
        name: 'Aphelios Xạ Thủ & Đấu Sĩ Tiên Phong',
        tier: 'S',
        avgPlace: 3.85,
        top4Rate: '62.4%',
        mainCarry: 'Aphelios',
        mainTank: 'Amumu',
        playstyle: 'Fast 8 / Slow Roll lv 7',
        augments: ['Ngọc Quá Khổ', 'Độc Dược Bộc Phát', 'Vé Kim Cương'],
        traits: [
          { name: 'Xạ Thủ', count: 4 },
          { name: 'Tiên Phong', count: 4 },
          { name: 'Thích Ứng', count: 2 }
        ],
        coreUnits: [
          { name: 'Aphelios', cost: 4, star: 2, items: ['Kiếm Tử Thần', 'Cuồng Đao Guinsoo', 'Vô Cực Kiếm'] },
          { name: 'Amumu', cost: 3, star: 3, items: ['Thú Tượng Thạch Giáp', 'Giáp Máu Warmog', 'Vuốt Rồng'] },
          { name: 'Nidalee', cost: 4, star: 2, items: ['Ngọn Giáo Shojin', 'Quyền Trượng Thiên Thần'] },
          { name: 'Diana', cost: 4, star: 2 },
          { name: 'Vi', cost: 2, star: 2 }
        ],
        guide: 'Lên cấp 8 ở 4-2, xả tiền tìm Aphelios và dàn chắn Amumu 2 sao trước. Lắp đồ đấu sĩ sớm giữ máu.'
      },
      {
        id: 'comp-2',
        name: 'Pháp Sư Tối Thượng & Vệ Binh',
        tier: 'A',
        avgPlace: 4.12,
        top4Rate: '56.1%',
        mainCarry: 'KogMaw',
        mainTank: 'Sentinel',
        playstyle: 'Reroll cấp 6 / 3 sao',
        augments: ['Khảm Bảo Thạch', 'Hình Nhân Trợ Thủ', 'Khuyến Mãi Kinh Nghiệm'],
        traits: [
          { name: 'Pháp Sư', count: 6 },
          { name: 'Vệ Binh', count: 2 }
        ],
        coreUnits: [
          { name: 'KogMaw', cost: 2, star: 3, items: ['Bùa Xanh', 'Găng Bảo Thạch', 'Mũ Phù Thủy'] },
          { name: 'Sentinel', cost: 3, star: 3, items: ['Thú Tượng', 'Áo Choàng Gai', 'Nỏ Sét'] }
        ],
        guide: 'Tích 50 vàng slow roll ở cấp 6 kiếm KogMaw 3 sao. Bắt buộc có Nỏ Sét để trừ kháng phép.'
      }
    ]
  },

  media: {
    youtubeChannels: [
      {
        id: 'ch-1',
        name: 'Lofi Girl',
        handle: '@LofiGirl',
        avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80',
        channelUrl: 'https://youtube.com/@LofiGirl',
        category: 'music',
        isLive: true
      },
      {
        id: 'ch-2',
        name: 'ThePrimeagen',
        handle: '@ThePrimeTimeagen',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        channelUrl: 'https://youtube.com/@ThePrimeTimeagen',
        category: 'code',
        isLive: false
      },
      {
        id: 'ch-3',
        name: 'Đấu Trường Chân Lý Official',
        handle: '@DTCLVN',
        avatar: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80',
        channelUrl: 'https://youtube.com',
        category: 'gaming',
        isLive: false
      },
      {
        id: 'ch-4',
        name: 'Fireship',
        handle: '@Fireship',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
        channelUrl: 'https://youtube.com/@Fireship',
        category: 'code',
        isLive: false
      }
    ],
    favoriteTracks: [
      {
        id: 'tr-1',
        title: 'Lofi Hip Hop Radio - Beats to Relax/Study to',
        artist: 'Lofi Girl',
        youtubeId: 'jfKfPfyJRdk',
        duration: 'LIVE',
        thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg'
      },
      {
        id: 'tr-2',
        title: 'Synthwave Radio - Chill synth / Retro beats',
        artist: 'Lofi Girl Synthwave',
        youtubeId: '4xDzrJKXOOY',
        duration: 'LIVE',
        thumbnail: 'https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg'
      },
      {
        id: 'tr-3',
        title: 'Awaken (ft. Valerie Broussard) | League of Legends Cinematic',
        artist: 'Riot Games Music',
        youtubeId: 'zF5Ddo9JDPY',
        duration: '3:20',
        thumbnail: 'https://i.ytimg.com/vi/zF5Ddo9JDPY/hqdefault.jpg'
      },
      {
        id: 'tr-4',
        title: 'Legends Never Die | Worlds 2017 Theme Song',
        artist: 'Against The Current',
        youtubeId: 'r6zIGXunKCg',
        duration: '3:55',
        thumbnail: 'https://i.ytimg.com/vi/r6zIGXunKCg/hqdefault.jpg'
      }
    ],
    playlists: [
      {
        id: 'pl-fav',
        name: 'Bài Hát Yêu Thích',
        description: 'Tập hợp các bài nhạc ruột nghe hàng ngày',
        createdAt: '2026-09-15',
        tracks: [
          {
            id: 'tr-1',
            title: 'Lofi Hip Hop Radio - Beats to Relax/Study to',
            artist: 'Lofi Girl',
            youtubeId: 'jfKfPfyJRdk',
            duration: 'LIVE',
            thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg'
          },
          {
            id: 'tr-3',
            title: 'Awaken (ft. Valerie Broussard) | League of Legends',
            artist: 'Riot Games Music',
            youtubeId: 'zF5Ddo9JDPY',
            duration: '3:20',
            thumbnail: 'https://i.ytimg.com/vi/zF5Ddo9JDPY/hqdefault.jpg'
          }
        ]
      },
      {
        id: 'pl-lofi',
        name: 'Lofi Chill & Code',
        description: 'Giai điệu thư giãn tập trung viết code và học tập',
        createdAt: '2026-09-15',
        tracks: [
          {
            id: 'tr-1',
            title: 'Lofi Hip Hop Radio - Beats to Relax/Study to',
            artist: 'Lofi Girl',
            youtubeId: 'jfKfPfyJRdk',
            duration: 'LIVE',
            thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg'
          },
          {
            id: 'tr-2',
            title: 'Synthwave Radio - Chill synth / Retro beats',
            artist: 'Lofi Girl Synthwave',
            youtubeId: '4xDzrJKXOOY',
            duration: 'LIVE',
            thumbnail: 'https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg'
          }
        ]
      },
      {
        id: 'pl-gaming',
        name: 'Gaming Hype & TFT',
        description: 'Nhạc bốc lửa leo rank Thách Đấu và clutch combat',
        createdAt: '2026-09-15',
        tracks: [
          {
            id: 'tr-3',
            title: 'Awaken (ft. Valerie Broussard) | League of Legends Cinematic',
            artist: 'Riot Games Music',
            youtubeId: 'zF5Ddo9JDPY',
            duration: '3:20',
            thumbnail: 'https://i.ytimg.com/vi/zF5Ddo9JDPY/hqdefault.jpg'
          },
          {
            id: 'tr-4',
            title: 'Legends Never Die | Worlds 2017 Theme Song',
            artist: 'Against The Current',
            youtubeId: 'r6zIGXunKCg',
            duration: '3:55',
            thumbnail: 'https://i.ytimg.com/vi/r6zIGXunKCg/hqdefault.jpg'
          }
        ]
      }
    ],
    quickLinks: [
      { id: 'ql-1', title: 'MetaTFT Comps', url: 'https://www.metatft.com/comps', icon: 'Shield', category: 'TFT' },
      { id: 'ql-2', title: 'GitHub Profile', url: 'https://github.com/namtacozz', icon: 'Github', category: 'Dev' },
      { id: 'ql-3', title: 'OP.GG Vietnam', url: 'https://vn.op.gg', icon: 'Gamepad2', category: 'LoL' },
      { id: 'ql-4', title: 'ChatGPT / Claude', url: 'https://chat.openai.com', icon: 'Bot', category: 'AI' }
    ]
  },

  vault: {
    isEncrypted: true,
    items: [
      {
        id: 'v-1',
        title: 'Kế hoạch phát triển ViTao tương lai',
        category: 'journal',
        content: 'Mục tiêu: Đưa ViTao thành bảng điều khiển không thể thiếu mỗi sáng mở máy tính lên. Tích hợp AI Agent tóm tắt bài tập và thông báo meta TFT mới nhất.',
        updatedAt: '2026-09-12'
      },
      {
        id: 'v-2',
        title: 'Danh sách server API dự phòng',
        category: 'secret',
        content: 'Invidious instances: https://api.invidious.io\nMetaTFT cluster API: https://api-hc.metatft.com/tft-comps-api/',
        updatedAt: '2026-09-14'
      }
    ]
  }
};
