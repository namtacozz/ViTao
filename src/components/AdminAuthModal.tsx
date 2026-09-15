import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  Key,
  CheckCircle2,
  AlertCircle,
  Download,
  RotateCcw,
  ShieldCheck,
  KeyRound,
  FileText,
  Plus,
  Trash2,
  Copy,
  Check,
  Eye,
  EyeOff,
  MessageCircle,
  CloudUpload,
  User,
  Settings
} from 'lucide-react';
import { GithubIcon } from './Icons';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { usePlayer } from '../context/PlayerContext';
import { VaultItem } from '../types';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose }) => {
  const {
    isAdmin,
    unlockAdmin,
    lockAdmin,
    githubToken,
    updateGitHubToken,
    repoConfig,
    updateRepoConfig,
    loginError
  } = useAuth();
  const { data, updateVault, resetToDefault, exportBackup, hasUnsavedChanges, isSaving, commitToGitHub } = useData();
  const { isPlaying, isPipOpen, setIsPipOpen } = usePlayer();
  const vault = data.vault;

  const [activeSettingsTab, setActiveSettingsTab] = useState<'account' | 'vault' | 'github' | 'data'>('account');

  // Login form
  const [passwordInput, setPasswordInput] = useState('');

  // GitHub form
  const [patInput, setPatInput] = useState(githubToken || '');
  const [tokenStatus, setTokenStatus] = useState<{ testing: boolean; message: string | null; success?: boolean }>({
    testing: false,
    message: null
  });
  const [ownerInput, setOwnerInput] = useState(repoConfig.owner);
  const [repoInput, setRepoInput] = useState(repoConfig.repo);
  const [branchInput, setBranchInput] = useState(repoConfig.branch);

  // Vault form & copy
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState<Partial<VaultItem>>({
    title: '',
    category: 'credential',
    content: ''
  });

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

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || !newItem.content) return;

    const itemToAdd: VaultItem = {
      id: `v-${Date.now()}`,
      title: newItem.title,
      category: (newItem.category as any) || 'credential',
      content: newItem.content,
      updatedAt: new Date().toISOString().slice(0, 10)
    };

    updateVault({ items: [itemToAdd, ...vault.items] });
    setShowAddItem(false);
    setNewItem({ title: '', category: 'credential', content: '' });
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Bạn có chắc muốn xóa mục này khỏi két sắt?')) {
      updateVault({ items: vault.items.filter(i => i.id !== itemId) });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#242526] rounded-2xl border border-[#393a3b] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#393a3b] bg-[#242526] shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-[#3a3b3c] border-2 border-[#393a3b]">
                <img
                  src={data.profile.avatarUrl}
                  alt={data.profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#31a24c] border-2 border-[#242526]" />
            </div>
            <div>
              <h3 className="font-bold text-[#e4e6eb] text-base flex items-center gap-2">
                <span>{data.profile.name}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isAdmin
                    ? 'bg-[#1877f2]/15 text-[#1877f2] border-[#1877f2]/30'
                    : 'bg-[#3a3b3c] text-[#b0b3b8] border-[#393a3b]'
                }`}>
                  {isAdmin ? 'Admin Đã Mở Khóa' : 'Chế Độ Khách'}
                </span>
              </h3>
              <p className="text-xs text-[#b0b3b8]">
                {data.profile.handle} • Cài đặt hệ thống & Két sắt bảo mật
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

        {/* Tab Selector */}
        <div className="flex items-center px-4 bg-[#18191a] border-b border-[#393a3b] text-xs font-semibold overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveSettingsTab('account')}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeSettingsTab === 'account'
                ? 'border-[#1877f2] text-[#1877f2]'
                : 'border-transparent text-[#b0b3b8] hover:text-[#e4e6eb]'
            }`}
          >
            {isAdmin ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>Quyền Admin</span>
          </button>

          <button
            onClick={() => setActiveSettingsTab('vault')}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeSettingsTab === 'vault'
                ? 'border-[#1877f2] text-[#1877f2]'
                : 'border-transparent text-[#b0b3b8] hover:text-[#e4e6eb]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Két Sắt Mật ({vault.items.length})</span>
          </button>

          <button
            onClick={() => setActiveSettingsTab('github')}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeSettingsTab === 'github'
                ? 'border-[#1877f2] text-[#1877f2]'
                : 'border-transparent text-[#b0b3b8] hover:text-[#e4e6eb]'
            }`}
          >
            <GithubIcon className="w-4 h-4" />
            <span>GitHub Sync</span>
          </button>

          <button
            onClick={() => setActiveSettingsTab('data')}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeSettingsTab === 'data'
                ? 'border-[#1877f2] text-[#1877f2]'
                : 'border-transparent text-[#b0b3b8] hover:text-[#e4e6eb]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Dữ Liệu & Sao Lưu</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* TAB 1: Account & Admin Lock */}
          {activeSettingsTab === 'account' && (
            <div className="space-y-4">
              {!isAdmin ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#18191a] border border-[#393a3b] space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#e4e6eb]">
                      <Lock className="w-4 h-4 text-[#1877f2]" />
                      <span>Mở Khóa Quyền Quản Trị & Két Sắt</span>
                    </div>
                    <p className="text-xs text-[#b0b3b8] leading-relaxed">
                      Nhập mã PIN hoặc mật khẩu chủ nhân để chỉnh sửa toàn bộ dữ liệu, điểm số, rank game và xem két sắt bảo mật.
                    </p>
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
                      <p className="text-xs text-[#e41e3f] flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {loginError}
                      </p>
                    )}
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg text-xs font-bold bg-[#1877f2] hover:bg-[#166fe5] text-white shadow-sm transition-all"
                    >
                      Xác Thực & Mở Khóa
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#18191a] border border-[#31a24c]/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#31a24c] text-sm font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Quyền Chủ Nhân Đang Hoạt Động</span>
                      </div>
                      <button
                        onClick={lockAdmin}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#e41e3f] hover:bg-[#d01737] text-white transition-colors"
                      >
                        Khóa Lại Ngay
                      </button>
                    </div>
                    <p className="text-xs text-[#b0b3b8]">
                      Bạn có toàn quyền thêm sửa xóa profile, điểm số, rank LMHT/TFT và quản lý két sắt mật.
                    </p>
                  </div>
                </div>
              )}

              {/* Quick Messenger Floating Player Toggle */}
              <div className="p-4 rounded-xl bg-[#18191a] border border-[#393a3b] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-[#1877f2]/15 text-[#1877f2]">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#e4e6eb]">Trình Phát Nhạc Nổi (PiP Player)</h4>
                    <p className="text-[11px] text-[#b0b3b8]">
                      {isPlaying ? 'Đang phát nhạc trong nền' : 'Xem video và nghe nhạc YouTube không gián đoạn'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPipOpen(!isPipOpen)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isPipOpen
                      ? 'bg-[#e41e3f]/20 text-[#e41e3f] hover:bg-[#e41e3f]/30'
                      : 'bg-[#1877f2] text-white hover:bg-[#166fe5]'
                  }`}
                >
                  {isPipOpen ? 'Đóng PiP' : 'Mở PiP Player'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Secret Vault (Két sắt bảo mật đã được đưa vào đây) */}
          {activeSettingsTab === 'vault' && (
            <div className="space-y-4">
              {!isAdmin ? (
                <div className="p-6 rounded-xl bg-[#18191a] border border-[#393a3b] text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#3a3b3c] flex items-center justify-center text-[#1877f2] mx-auto">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-[#e4e6eb]">Két Sắt Riêng Tư Đang Bị Khóa</h4>
                  <p className="text-xs text-[#b0b3b8] max-w-sm mx-auto leading-relaxed">
                    Két sắt được bảo vệ bằng mã hóa chuẩn AES-256. Vui lòng chuyển sang tab <strong>Quyền Admin</strong> để mở khóa bằng mật khẩu.
                  </p>
                  <button
                    onClick={() => setActiveSettingsTab('account')}
                    className="px-4 py-2 rounded-lg bg-[#1877f2] text-white text-xs font-bold hover:bg-[#166fe5]"
                  >
                    Đến Trang Mở Khóa
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-[#b0b3b8]">
                      <ShieldCheck className="w-4 h-4 text-[#31a24c]" />
                      <span>Két sắt được mã hóa an toàn (AES-GCM)</span>
                    </div>
                    <button
                      onClick={() => setShowAddItem(!showAddItem)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-bold transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{showAddItem ? 'Đóng form' : 'Thêm mục mới'}</span>
                    </button>
                  </div>

                  {/* Add Item Form */}
                  {showAddItem && (
                    <form onSubmit={handleAddItemSubmit} className="p-4 rounded-xl bg-[#18191a] border border-[#393a3b] space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] uppercase font-semibold text-[#b0b3b8]">Tiêu đề</label>
                          <input
                            type="text"
                            value={newItem.title}
                            placeholder="VD: Mật khẩu WiFi, Token Riot..."
                            onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-semibold text-[#b0b3b8]">Phân loại</label>
                          <select
                            value={newItem.category}
                            onChange={e => setNewItem({ ...newItem, category: e.target.value as any })}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] text-xs"
                          >
                            <option value="credential">Tài khoản & Mật khẩu</option>
                            <option value="api_key">API Key & Token</option>
                            <option value="journal">Ghi chú riêng tư</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-semibold text-[#b0b3b8]">Nội dung bảo mật</label>
                        <textarea
                          rows={2}
                          value={newItem.content}
                          placeholder="Nhập nội dung cần lưu trữ an toàn..."
                          onChange={e => setNewItem({ ...newItem, content: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] text-xs"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddItem(false)}
                          className="px-3 py-1 rounded-lg bg-[#3a3b3c] text-xs text-[#b0b3b8]"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1 rounded-lg bg-[#1877f2] text-xs text-white font-bold"
                        >
                          Lưu Vào Két Sắt
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Items List */}
                  <div className="space-y-2.5 max-h-[50vh] overflow-y-auto">
                    {vault.items.length === 0 ? (
                      <p className="text-center py-6 text-xs text-[#b0b3b8]">Chưa có mục nào trong két sắt.</p>
                    ) : (
                      vault.items.map(item => {
                        const isRevealed = revealedIds[item.id];
                        const isCopied = copiedId === item.id;
                        return (
                          <div
                            key={item.id}
                            className="p-3 rounded-xl bg-[#18191a] border border-[#393a3b] space-y-2 hover:border-[#1877f2]/30 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {item.category === 'credential' ? (
                                  <KeyRound className="w-4 h-4 text-[#f7b125]" />
                                ) : (
                                  <FileText className="w-4 h-4 text-[#1877f2]" />
                                )}
                                <strong className="text-xs text-[#e4e6eb]">{item.title}</strong>
                                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#3a3b3c] text-[#b0b3b8]">
                                  {item.category}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => toggleReveal(item.id)}
                                  className="p-1 rounded hover:bg-[#3a3b3c] text-[#b0b3b8] hover:text-white"
                                  title={isRevealed ? 'Ẩn' : 'Hiện'}
                                >
                                  {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={() => handleCopy(item.content, item.id)}
                                  className="p-1 rounded hover:bg-[#3a3b3c] text-[#b0b3b8] hover:text-white"
                                  title="Sao chép"
                                >
                                  {isCopied ? <Check className="w-3.5 h-3.5 text-[#31a24c]" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="p-1 rounded hover:bg-[#3a3b3c] text-[#b0b3b8] hover:text-[#e41e3f]"
                                  title="Xóa"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <div className="text-xs font-mono bg-[#242526] px-3 py-1.5 rounded-lg text-[#e4e6eb] break-all border border-[#393a3b]">
                              {isRevealed ? item.content : '••••••••••••••••••••'}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GitHub Sync */}
          {activeSettingsTab === 'github' && (
            <div className="space-y-4">
              {isAdmin && hasUnsavedChanges && (
                <div className="p-3.5 rounded-xl bg-[#1877f2]/15 border border-[#1877f2]/30 flex items-center justify-between">
                  <div className="text-xs text-[#e4e6eb]">
                    Có dữ liệu mới chưa commit lên GitHub repository!
                  </div>
                  <button
                    onClick={() => commitToGitHub()}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-bold transition-all disabled:opacity-50"
                  >
                    <CloudUpload className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Đang lưu...' : 'Commit Ngay'}</span>
                  </button>
                </div>
              )}

              {/* GitHub Token */}
              <div className="p-4 rounded-xl bg-[#18191a] border border-[#393a3b] space-y-3">
                <div className="flex items-center gap-2 text-[#1877f2] text-sm font-semibold">
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub Personal Access Token (PAT)</span>
                </div>
                <div className="space-y-2">
                  <input
                    type="password"
                    value={patInput}
                    onChange={(e) => setPatInput(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-xs text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  />
                  <div className="flex items-center justify-between">
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo&description=ViTao%20Hub%20Sync"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-[#1877f2] hover:underline font-semibold"
                    >
                      Tạo Token mới trên GitHub ↗
                    </a>
                    <button
                      type="button"
                      onClick={handleSaveToken}
                      disabled={tokenStatus.testing}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1877f2] hover:bg-[#166fe5] text-white transition-colors disabled:opacity-50"
                    >
                      {tokenStatus.testing ? 'Đang kiểm tra...' : 'Lưu Token'}
                    </button>
                  </div>
                  {tokenStatus.message && (
                    <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${tokenStatus.success ? 'bg-[#31a24c]/15 text-[#31a24c]' : 'bg-[#e41e3f]/15 text-[#e41e3f]'}`}>
                      {tokenStatus.success ? <CheckCircle2 className="w-4 h-4 text-[#31a24c]" /> : <AlertCircle className="w-4 h-4 text-[#e41e3f]" />}
                      <span>{tokenStatus.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Repo Target */}
              <div className="p-4 rounded-xl bg-[#18191a] border border-[#393a3b] space-y-3">
                <div className="text-xs font-bold text-[#e4e6eb]">Cấu Hình Repository Target</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="block text-[#b0b3b8] mb-1 font-semibold">Chủ sở hữu</label>
                    <input
                      type="text"
                      value={ownerInput}
                      onChange={(e) => setOwnerInput(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#b0b3b8] mb-1 font-semibold">Tên Repo</label>
                    <input
                      type="text"
                      value={repoInput}
                      onChange={(e) => setRepoInput(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#b0b3b8] mb-1 font-semibold">Branch</label>
                    <input
                      type="text"
                      value={branchInput}
                      onChange={(e) => setBranchInput(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb]"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveRepoSettings}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#e4e6eb]"
                  >
                    Lưu cấu hình
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Data Tools */}
          {activeSettingsTab === 'data' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#18191a] border border-[#393a3b] space-y-3">
                <div className="text-xs font-bold text-[#e4e6eb]">Sao Lưu Dữ Liệu</div>
                <p className="text-xs text-[#b0b3b8] leading-relaxed">
                  Xuất toàn bộ cấu hình profile, môn học, bảng điểm, bài TFT và ghi chú thành 1 file JSON độc lập để cất giữ.
                </p>
                <button
                  type="button"
                  onClick={exportBackup}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#e4e6eb] text-xs font-semibold transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải File Backup JSON</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#18191a] border border-[#e41e3f]/30 space-y-3">
                <div className="text-xs font-bold text-[#e41e3f]">Khôi Phục Mặc Định</div>
                <p className="text-xs text-[#b0b3b8] leading-relaxed">
                  Xóa bỏ toàn bộ cache trên trình duyệt và thiết lập lại dữ liệu gốc ban đầu của ViTao OS.
                </p>
                <button
                  type="button"
                  onClick={resetToDefault}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#e41e3f]/20 hover:bg-[#e41e3f] text-[#e41e3f] hover:text-white text-xs font-semibold transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Khôi Phục Ban Đầu</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

