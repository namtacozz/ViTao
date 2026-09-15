import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppData, UserProfile, StudyData, GamingData, MediaData, VaultData, TFTComp } from '../types';
import { INITIAL_APP_DATA } from '../data/defaultData';
import { commitFileToGitHub, GitHubRepoConfig } from '../services/githubService';
import { useAuth } from './AuthContext';
import { encryptData } from '../services/cryptoService';

interface DataContextType {
  data: AppData;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  saveMessage: string | null;
  saveError: string | null;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateStudy: (study: Partial<StudyData>) => void;
  updateGaming: (gaming: Partial<GamingData>) => void;
  updateMedia: (media: Partial<MediaData>) => void;
  updateVault: (vault: Partial<VaultData>) => void;
  saveCompToGaming: (comp: TFTComp) => void;
  deleteSavedComp: (compId: string) => void;
  commitToGitHub: () => Promise<boolean>;
  resetToDefault: () => void;
  exportBackup: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'vitao_app_data_v2';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { repoConfig, masterKey } = useAuth();
  const [data, setData] = useState<AppData>(() => {
    // Check v2 key or migrate from v1 key
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem('vitao_app_data_v1');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Ensure new avatar and name take precedence over legacy defaults
        if (!parsed.profile || parsed.profile.avatarUrl?.includes('unsplash.com') || parsed.profile.name === 'Namtacozz') {
          parsed.profile = {
            ...parsed.profile,
            name: 'Hột Vịt Lộn',
            avatarUrl: INITIAL_APP_DATA.profile.avatarUrl
          };
        }
        if (!parsed.media?.playlists) {
          parsed.media = {
            ...parsed.media,
            playlists: INITIAL_APP_DATA.media.playlists
          };
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse cached data', e);
      }
    }
    return INITIAL_APP_DATA;
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Sync to local cache whenever data changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateProfile = (profileUpdate: Partial<UserProfile>) => {
    setData(prev => ({
      ...prev,
      profile: { ...prev.profile, ...profileUpdate }
    }));
    setHasUnsavedChanges(true);
  };

  const updateStudy = (studyUpdate: Partial<StudyData>) => {
    setData(prev => ({
      ...prev,
      study: { ...prev.study, ...studyUpdate }
    }));
    setHasUnsavedChanges(true);
  };

  const updateGaming = (gamingUpdate: Partial<GamingData>) => {
    setData(prev => ({
      ...prev,
      gaming: { ...prev.gaming, ...gamingUpdate }
    }));
    setHasUnsavedChanges(true);
  };

  const updateMedia = (mediaUpdate: Partial<MediaData>) => {
    setData(prev => ({
      ...prev,
      media: { ...prev.media, ...mediaUpdate }
    }));
    setHasUnsavedChanges(true);
  };

  const updateVault = (vaultUpdate: Partial<VaultData>) => {
    setData(prev => ({
      ...prev,
      vault: { ...prev.vault, ...vaultUpdate }
    }));
    setHasUnsavedChanges(true);
  };

  const saveCompToGaming = (comp: TFTComp) => {
    setData(prev => {
      const existing = prev.gaming.savedComps || [];
      const updated = existing.some(c => c.name === comp.name)
        ? existing.map(c => c.name === comp.name ? comp : c)
        : [comp, ...existing];
      return {
        ...prev,
        gaming: { ...prev.gaming, savedComps: updated }
      };
    });
    setHasUnsavedChanges(true);
  };

  const deleteSavedComp = (compId: string) => {
    setData(prev => ({
      ...prev,
      gaming: {
        ...prev.gaming,
        savedComps: (prev.gaming.savedComps || []).filter(c => c.id !== compId)
      }
    }));
    setHasUnsavedChanges(true);
  };

  const commitToGitHub = async (): Promise<boolean> => {
    if (!repoConfig.token) {
      setSaveError('Chưa có GitHub Token! Vui lòng nhập token trong phần Cài đặt Admin để commit dữ liệu.');
      return false;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveMessage('Đang chuẩn bị gói dữ liệu...');

    try {
      const timestamp = new Date().toLocaleString('vi-VN');

      // 1. Commit profile.json
      setSaveMessage('Đang lưu thông tin Profile lên GitHub...');
      const profileRes = await commitFileToGitHub(
        'public/data/profile.json',
        JSON.stringify(data.profile, null, 2),
        `Update Profile data via ViTao Hub [${timestamp}]`,
        repoConfig
      );

      if (!profileRes.success) {
        throw new Error(`Lỗi lưu profile: ${profileRes.error}`);
      }

      // 2. Commit study.json
      setSaveMessage('Đang lưu dữ liệu Học tập & Bảng điểm...');
      await commitFileToGitHub(
        'public/data/study.json',
        JSON.stringify(data.study, null, 2),
        `Update Study & Grades data via ViTao Hub [${timestamp}]`,
        repoConfig
      );

      // 3. Commit gaming.json
      setSaveMessage('Đang lưu dữ liệu Gaming & TFT...');
      await commitFileToGitHub(
        'public/data/gaming.json',
        JSON.stringify(data.gaming, null, 2),
        `Update Gaming & TFT data via ViTao Hub [${timestamp}]`,
        repoConfig
      );

      // 4. Commit media.json
      setSaveMessage('Đang lưu dữ liệu Kênh YouTube & Nhạc...');
      await commitFileToGitHub(
        'public/data/media.json',
        JSON.stringify(data.media, null, 2),
        `Update Media & Channels data via ViTao Hub [${timestamp}]`,
        repoConfig
      );

      // 5. Encrypt and commit vault if masterKey is available
      if (masterKey && data.vault.items.length > 0) {
        setSaveMessage('Đang mã hóa an toàn dữ liệu Riêng tư (AES-GCM)...');
        const encryptedStr = await encryptData(data.vault, masterKey);
        await commitFileToGitHub(
          'public/data/vault.enc',
          encryptedStr,
          `Update Encrypted Vault via ViTao Hub [${timestamp}]`,
          repoConfig
        );
      }

      setIsSaving(false);
      setHasUnsavedChanges(false);
      setSaveMessage(`Đã commit thành công lên branch ${repoConfig.branch} (Mã commit: ${profileRes.commitSha || 'mới nhất'})!`);
      setTimeout(() => setSaveMessage(null), 5000);
      return true;
    } catch (err) {
      setIsSaving(false);
      setSaveError(err instanceof Error ? err.message : 'Lỗi không xác định khi commit về GitHub');
      return false;
    }
  };

  const resetToDefault = () => {
    if (window.confirm('Bạn có chắc muốn khôi phục về dữ liệu mặc định ban đầu?')) {
      setData(INITIAL_APP_DATA);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setHasUnsavedChanges(true);
    }
  };

  const exportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `vitao_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <DataContext.Provider
      value={{
        data,
        hasUnsavedChanges,
        isSaving,
        saveMessage,
        saveError,
        updateProfile,
        updateStudy,
        updateGaming,
        updateMedia,
        updateVault,
        saveCompToGaming,
        deleteSavedComp,
        commitToGitHub,
        resetToDefault,
        exportBackup
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
