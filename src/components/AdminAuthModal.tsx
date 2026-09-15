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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${isAdmin ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>
              {isAdmin ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {isAdmin ? 'Quản Trị ViTao — Thiết Lập Chủ Nhân' : 'Mở Khóa Quyền Chủ Nhân (Admin)'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAdmin ? 'Tùy chỉnh GitHub Sync, Token và bảo mật' : 'Nhập mật mã để chỉnh sửa dữ liệu cá nhân'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
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
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mã PIN / Mật khẩu Chủ nhân
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Nhập mật mã (Mặc định: 0357267987)"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    autoFocus
                  />
                  <Key className="w-4 h-4 absolute right-3.5 top-3 text-slate-500" />
                </div>
                {loginError && (
                  <p className="mt-2 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {loginError}
                  </p>
                )}
                <p className="mt-2 text-[11px] text-slate-400">
                  💡 Mẹo: Nhập <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">0357267987</code> để mở khóa quyền chủ nhân.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-neon-cyan transition-all"
                >
                  Xác Thực & Mở Khóa
                </button>
              </div>
            </form>
          ) : (
            /* Admin Settings */
            <div className="space-y-6">
              {/* GitHub Token Setup */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/90 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub Personal Access Token (PAT)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Token này cho phép ViTao commit trực tiếp các thay đổi về branch repository của bạn.
                  Token được lưu trữ hoàn toàn trong trình duyệt cục bộ (Local Storage).
                </p>
                <div className="space-y-2">
                  <input
                    type="password"
                    value={patInput}
                    onChange={(e) => setPatInput(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (Quyền repo hoặc contents:write)"
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                  <div className="flex items-center justify-between">
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo&description=ViTao%20Hub%20Sync"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      Tạo GitHub Token mới trên GitHub ↗
                    </a>
                    <button
                      type="button"
                      onClick={handleSaveToken}
                      disabled={tokenStatus.testing}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white transition-colors disabled:opacity-50"
                    >
                      {tokenStatus.testing ? 'Đang kiểm tra...' : 'Lưu & Kiểm tra Token'}
                    </button>
                  </div>
                  {tokenStatus.message && (
                    <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${tokenStatus.success ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60' : 'bg-rose-950/60 text-rose-300 border border-rose-800/60'}`}>
                      {tokenStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                      <span>{tokenStatus.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Repo & Branch Target */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/90 space-y-3">
                <div className="text-sm font-semibold text-slate-200">
                  Cấu hình Kho Lưu Trữ (Repository Target)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Chủ sở hữu (Owner)</label>
                    <input
                      type="text"
                      value={ownerInput}
                      onChange={(e) => setOwnerInput(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Tên Repo</label>
                    <input
                      type="text"
                      value={repoInput}
                      onChange={(e) => setRepoInput(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Branch</label>
                    <input
                      type="text"
                      value={branchInput}
                      onChange={(e) => setBranchInput(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveRepoSettings}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    Lưu cấu hình Repo
                  </button>
                </div>
              </div>

              {/* Data Tools: Backup & Reset */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={exportBackup}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải file Backup JSON
                  </button>
                  <button
                    type="button"
                    onClick={resetToDefault}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-950/40 text-xs"
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
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-rose-600/80 hover:bg-rose-600 text-white transition-colors"
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
