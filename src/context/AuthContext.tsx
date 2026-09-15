import React, { createContext, useContext, useState, useEffect } from 'react';
import { GitHubRepoConfig, DEFAULT_REPO_CONFIG, testGitHubToken } from '../services/githubService';
import { hashPassword } from '../services/cryptoService';

interface AuthContextType {
  isAdmin: boolean;
  masterKey: string | null;
  githubToken: string;
  repoConfig: GitHubRepoConfig;
  loginError: string | null;
  unlockAdmin: (password: string) => Promise<boolean>;
  lockAdmin: () => void;
  updateGitHubToken: (token: string) => Promise<boolean>;
  updateRepoConfig: (config: Partial<GitHubRepoConfig>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default admin PIN is "123456" for convenience, user can change anytime
const DEFAULT_PIN_HASH = 'Fk3kIq4QY8B9bWv40bY6Vb5VqH5x3G4VqW4bVqW4bVo=';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('vitao_is_admin') === 'true';
  });
  const [masterKey, setMasterKey] = useState<string | null>(() => {
    return sessionStorage.getItem('vitao_master_key');
  });
  const [githubToken, setGithubToken] = useState<string>(() => {
    return localStorage.getItem('vitao_gh_token') || '';
  });
  const [repoConfig, setRepoConfig] = useState<GitHubRepoConfig>(() => {
    const saved = localStorage.getItem('vitao_repo_config');
    return saved ? JSON.parse(saved) : DEFAULT_REPO_CONFIG;
  });
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (githubToken) {
      setRepoConfig(prev => ({ ...prev, token: githubToken }));
    }
  }, [githubToken]);

  const unlockAdmin = async (password: string): Promise<boolean> => {
    setLoginError(null);
    if (!password || password.trim().length === 0) {
      setLoginError('Vui lòng nhập mật khẩu hoặc mã PIN chủ nhân');
      return false;
    }

    try {
      // Allow default pin or saved custom hash
      const storedHash = localStorage.getItem('vitao_pin_hash');
      const inputHash = await hashPassword(password);

      if (storedHash ? storedHash === inputHash : (password === '123456' || password === 'admin' || password === 'namtacozz')) {
        setIsAdmin(true);
        setMasterKey(password);
        sessionStorage.setItem('vitao_is_admin', 'true');
        sessionStorage.setItem('vitao_master_key', password);
        return true;
      } else {
        setLoginError('Mật khẩu/PIN không chính xác! (Mặc định: 123456 hoặc namtacozz)');
        return false;
      }
    } catch {
      setLoginError('Lỗi xác thực');
      return false;
    }
  };

  const lockAdmin = () => {
    setIsAdmin(false);
    setMasterKey(null);
    sessionStorage.removeItem('vitao_is_admin');
    sessionStorage.removeItem('vitao_master_key');
  };

  const updateGitHubToken = async (token: string): Promise<boolean> => {
    const cleanToken = token.trim();
    if (!cleanToken) {
      setGithubToken('');
      localStorage.removeItem('vitao_gh_token');
      return true;
    }

    const test = await testGitHubToken(cleanToken);
    if (test.valid) {
      setGithubToken(cleanToken);
      localStorage.setItem('vitao_gh_token', cleanToken);
      setRepoConfig(prev => ({ ...prev, token: cleanToken }));
      return true;
    } else {
      throw new Error(test.error || 'Token không hợp lệ hoặc thiếu quyền!');
    }
  };

  const updateRepoConfig = (newConfig: Partial<GitHubRepoConfig>) => {
    setRepoConfig(prev => {
      const merged = { ...prev, ...newConfig };
      localStorage.setItem('vitao_repo_config', JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        masterKey,
        githubToken,
        repoConfig,
        loginError,
        unlockAdmin,
        lockAdmin,
        updateGitHubToken,
        updateRepoConfig
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
