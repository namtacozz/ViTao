import React, { useState } from 'react';
import { X, Lock, Unlock, Key, CheckCircle2, AlertCircle, Download, RotateCcw } from 'lucide-react';
import { GithubIcon } from './Icons';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose }) => {
  const { isAdmin, unlockAdmin, lockAdmin, githubToken, updateGitHubToken, repoConfig, updateRepoConfig, loginError } = useAuth();
  const { resetToDefault, exportBackup } = useData();

  const [passwordInput, setPasswordInput] = useState('');
  const [patInput, setPatInput] = useState(githubToken || '');
  const [tokenStatus, setTokenStatus] = useState<{ testing: boolean; message: string | null; success?: boolean }>({
    testing: false,
    message: null
  });

  const [ownerInput, setOwnerInput] = useState(repoConfig.owner);
  const [repoInput, setRepoInput] = useState(repoConfig.repo);
  const [branchInput, setBranchInput] = useState(repoConfig.branch);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await unlockAdmin(passwordInput);
    if (success) {
      setPasswordInput('');
    }
  };

  const handleSaveToken = async () => {
    setTokenStatus({ testing: true, message: 'Đang kiểm tra token với GitHub API...' });
    try {
      await updateGitHubToken(patInput);
      setTokenStatus({ testing: false, message: 'Kết nối thành công! Token có hiệu lực.', success: true });
    } catch (err: any) {
      setTokenStatus({ testing: false, message: err.message || 'Token không hợp lệ.', success: false });
    }
  };

  const handleSaveRepoSettings = () => {
    updateRepoConfig({
      owner: ownerInput.trim(),
      repo: repoInput.trim(),
      branch: branchInput.trim()
    });
    alert('Đã cập nhật cấu hình repository!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#242526] rounded-2xl border border-[#393a3b] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#393a3b] bg-[#242526]">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-full ${isAdmin ? 'bg-[#1877f2]/15 text-[#1877f2]' : 'bg-[#3a3b3c] text-[#b0b3b8]'}`}>
              {isAdmin ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-[#e4e6eb] text-base">
                {isAdmin ? 'Quản Trị ViTao — Thiết Lập Chủ Nhân' : 'Mở Khóa Quyền Chủ Nhân (Admin)'}
              </h3>
              <p className="text-xs text-[#b0b3b8]">
                {isAdmin ? 'Tùy chỉnh GitHub Sync, Token và bảo mật' : 'Nhập mật mã để chỉnh sửa dữ liệu cá nhân'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#b0b3b8] hover:text-white hover:bg-[#3a3b3c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {!isAdmin ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#e4e6eb] mb-1.5">
                  Mã PIN / Mật khẩu Chủ nhân
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Nhập mật mã (Mặc định: 0357267987)"
                    className="w-full px-4 py-2.5 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] placeholder-[#b0b3b8] text-sm focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                    autoFocus
                  />
                  <Key className="w-4 h-4 absolute right-3.5 top-3 text-[#b0b3b8]" />
                </div>
                {loginError && (
                  <p className="mt-2 text-xs text-[#e41e3f] flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {loginError}
                  </p>
                )}
                <p className="mt-2 text-[11px] text-[#b0b3b8]">
                  💡 Mẹo: Nhập <code className="text-[#1877f2] font-mono bg-[#3a3b3c] px-1.5 py-0.5 rounded">0357267987</code> để mở khóa quyền chủ nhân.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#b0b3b8] hover:bg-[#3a3b3c] hover:text-[#e4e6eb] transition-colors"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#1877f2] hover:bg-[#166fe5] text-white shadow-sm transition-all"
                >
                  Xác Thực & Mở Khóa
                </button>
              </div>
            </form>
          ) : (
            /* Admin Settings */
            <div className="space-y-5">
              {/* GitHub Token Setup */}
              <div className="p-4 rounded-xl bg-[#18191a] border border-[#393a3b] space-y-3">
                <div className="flex items-center gap-2 text-[#1877f2] text-sm font-semibold">
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub Personal Access Token (PAT)</span>
                </div>
                <p className="text-xs text-[#b0b3b8] leading-relaxed">
                  Token này cho phép ViTao commit trực tiếp các thay đổi về branch repository của bạn.
                  Token được lưu trữ hoàn toàn trong trình duyệt cục bộ (Local Storage).
                </p>
                <div className="space-y-2">
                  <input
                    type="password"
                    value={patInput}
                    onChange={(e) => setPatInput(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (Quyền repo hoặc contents:write)"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-xs text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  />
                  <div className="flex items-center justify-between">
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo&description=ViTao%20Hub%20Sync"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-[#1877f2] hover:underline flex items-center gap-1 font-semibold"
                    >
                      Tạo GitHub Token mới trên GitHub ↗
                    </a>
                    <button
                      type="button"
                      onClick={handleSaveToken}
                      disabled={tokenStatus.testing}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#1877f2] hover:bg-[#166fe5] text-white transition-colors disabled:opacity-50"
                    >
                      {tokenStatus.testing ? 'Đang kiểm tra...' : 'Lưu & Kiểm tra Token'}
                    </button>
                  </div>
                  {tokenStatus.message && (
                    <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${tokenStatus.success ? 'bg-[#31a24c]/15 text-[#31a24c] border border-[#31a24c]/30' : 'bg-[#e41e3f]/15 text-[#e41e3f] border border-[#e41e3f]/30'}`}>
                      {tokenStatus.success ? <CheckCircle2 className="w-4 h-4 text-[#31a24c] shrink-0" /> : <AlertCircle className="w-4 h-4 text-[#e41e3f] shrink-0" />}
                      <span>{tokenStatus.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Repo & Branch Target */}
              <div className="p-4 rounded-xl bg-[#18191a] border border-[#393a3b] space-y-3">
                <div className="text-sm font-semibold text-[#e4e6eb]">
                  Cấu hình Kho Lưu Trữ (Repository Target)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="block text-[#b0b3b8] mb-1 font-semibold">Chủ sở hữu (Owner)</label>
                    <input
                      type="text"
                      value={ownerInput}
                      onChange={(e) => setOwnerInput(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#b0b3b8] mb-1 font-semibold">Tên Repo</label>
                    <input
                      type="text"
                      value={repoInput}
                      onChange={(e) => setRepoInput(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#b0b3b8] mb-1 font-semibold">Branch</label>
                    <input
                      type="text"
                      value={branchInput}
                      onChange={(e) => setBranchInput(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveRepoSettings}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#e4e6eb] transition-colors"
                  >
                    Lưu cấu hình Repo
                  </button>
                </div>
              </div>

              {/* Data Tools: Backup & Reset */}
              <div className="flex items-center justify-between pt-2 border-t border-[#393a3b]">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={exportBackup}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#e4e6eb] text-xs font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải file Backup JSON
                  </button>
                  <button
                    type="button"
                    onClick={resetToDefault}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3a3b3c] hover:bg-[#e41e3f]/20 text-[#e41e3f] text-xs font-semibold transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset mặc định
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    lockAdmin();
                    onClose();
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#e41e3f] hover:bg-[#d01737] text-white transition-colors"
                >
                  Khóa Quản Trị
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
