export interface ProjectShowcase {
  id: string;
  title: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  stars?: number;
  highlight?: boolean;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface UserProfile {
  name: string;
  handle: string;
  title: string;
  bio: string;
  avatarUrl: string;
  coverUrl?: string;
  status: {
    text: string;
    emoji: string;
    activity: 'coding' | 'gaming' | 'studying' | 'chilling';
  };
  location: string;
  email: string;
  socials: {
    github: string;
    facebook?: string;
    discord?: string;
    youtube?: string;
    steam?: string;
  };
  skills: SkillCategory[];
  showcaseProjects: ProjectShowcase[];
  highlights: {
    label: string;
    value: string;
    subtext: string;
  }[];
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  scoreProcess?: number; // Điểm quá trình
  scoreExam?: number;    // Điểm thi kết thúc môn
  score10: number;       // Thang 10
  score4: number;        // Thang 4
  letterGrade: string;   // A, B+, B, C, D, F
}

export interface Semester {
  id: string;
  name: string;
  year: string;
  courses: Course[];
  gpa10: number;
  gpa4: number;
}

export interface StudyTask {
  id: string;
  title: string;
  description?: string;
  courseName?: string;
  dueDate: string;
  priority: 'urgent' | 'normal' | 'low';
  status: 'todo' | 'in-progress' | 'completed';
}

export interface StudyData {
  targetCpa: number;
  semesters: Semester[];
  tasks: StudyTask[];
  notes: {
    id: string;
    title: string;
    content: string;
    updatedAt: string;
  }[];
}

export interface TFTComp {
  id: string;
  name: string;
  tier: 'S' | 'A' | 'B';
  avgPlace?: number;
  top4Rate?: string;
  coreUnits: {
    name: string;
    cost: number;
    star?: number;
    items?: string[];
  }[];
  traits: {
    name: string;
    count: number;
  }[];
  mainCarry: string;
  mainTank: string;
  augments: string[];
  playstyle: string;
  guide?: string;
}

export interface GamingData {
  riotAccount: {
    gameName: string;
    tagLine: string;
    region: string;
  };
  lol: {
    rank: string;
    tier: string;
    lp: number;
    winRate: number;
    topChampions: string[];
  };
  tft: {
    rank: string;
    tier: string;
    lp: number;
    top4Rate: number;
    favoriteTraits: string[];
  };
  savedComps: TFTComp[];
}

export interface YouTubeChannel {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  channelUrl: string;
  category: 'code' | 'gaming' | 'music' | 'podcast';
  isLive?: boolean;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  duration?: string;
  thumbnail?: string;
}

export interface MediaData {
  youtubeChannels: YouTubeChannel[];
  favoriteTracks: MusicTrack[];
  quickLinks: {
    id: string;
    title: string;
    url: string;
    icon: string;
    category: string;
  }[];
}

export interface VaultItem {
  id: string;
  title: string;
  category: 'secret' | 'journal' | 'credential';
  content: string;
  updatedAt: string;
}

export interface VaultData {
  isEncrypted: boolean;
  items: VaultItem[];
}

export interface AppData {
  profile: UserProfile;
  study: StudyData;
  gaming: GamingData;
  media: MediaData;
  vault: VaultData;
}
