import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  Unlock,
  Key,
  Plus,
  Trash2,
  Copy,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
  FileText,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { VaultItem } from '../types';

interface VaultViewProps {
  onOpenAuthModal: () => void;
}

export const VaultView: React.FC<VaultViewProps> = ({ onOpenAuthModal }) => {
  const { isAdmin } = useAuth();
  const { data, updateVault } = useData();
  const vault = data.vault;

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState<Partial<VaultItem>>({
    title: '',
    category: 'journal',
    content: ''
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || !newItem.content) return;

    const itemToAdd: VaultItem = {
      id: `v-${Date.now()}`,
      title: newItem.title,
      category: (newItem.category as any) || 'journal',
      content: newItem.content,
      updatedAt: new Date().toISOString().slice(0, 10)
    };

    updateVault({ items: [itemToAdd, ...vault.items] });
    setShowAddItem(false);
    setNewItem({ title: '', category: 'journal', content: '' });
  };

  const handleDeleteItem = (itemId: string) => {
    updateVault({ items: vault.items.filter(i => i.id !== itemId) });
  };

  // If not logged in as Admin, lock the vault
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-14 rounded-xl bg-[#242526] border border-[#393a3b] text-center space-y-5 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#3a3b3c] flex items-center justify-center text-[#1877f2]">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-1.5 max-w-md">
          <h2 className="text-xl font-bold text-[#e4e6eb]">Két Sắt Riêng Tư Được Mã Hóa</h2>
          <p className="text-xs text-[#b0b3b8] leading-relaxed">
            Khu vực này chứa các ghi chú tuyệt mật, nhật ký cá nhân và thông tin nhạy cảm. Dữ liệu được bảo vệ bằng mã hóa chuẩn <strong>AES-256-GCM</strong> (Zero-Knowledge).
          </p>
        </div>

        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Key className="w-4 h-4" />
          <span>Mở Khóa Bằng Mật Mã Chủ Nhân</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-[#242526] rounded-xl p-5 border border-[#393a3b] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-[#31a24c]/20 text-[#31a24c]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#e4e6eb] flex items-center gap-2">
              <span>Két Sắt Bảo Mật — Đã Mở Khóa</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#31a24c]/15 text-[#31a24c] border border-[#31a24c]/30">
                AES-256
              </span>
            </h2>
            <p className="text-xs text-[#b0b3b8]">
              Dữ liệu được mã hóa client-side trước khi đẩy lên GitHub repository.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddItem(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm Ghi Chú Mật</span>
        </button>
      </div>

      {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vault.items.map((item) => (
          <div
            key={item.id}
            className="bg-[#242526] rounded-xl p-5 border border-[#393a3b] shadow-sm hover:border-[#1877f2]/40 transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {item.category === 'credential' ? (
                    <KeyRound className="w-4 h-4 text-[#f7b125] shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 text-[#1877f2] shrink-0" />
                  )}
                  <h3 className="font-bold text-sm text-[#e4e6eb]">{item.title}</h3>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#3a3b3c] text-[#b0b3b8]">
                  {item.category}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#18191a] border border-[#393a3b] font-mono text-xs text-[#e4e6eb] whitespace-pre-wrap break-words leading-relaxed select-all">
                {item.content}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-[#393a3b] text-xs">
              <span className="text-[10px] text-[#b0b3b8] font-mono">
                Cập nhật: {item.updatedAt}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopy(item.content, item.id)}
                  title="Sao chép nội dung"
                  className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#e4e6eb] transition-colors text-[11px] font-semibold"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#31a24c] stroke-[3]" />
                      <span className="text-[#31a24c]">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1.5 rounded-full text-[#b0b3b8] hover:text-[#e41e3f] hover:bg-[#3a3b3c] transition-colors"
                  title="Xóa mục này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Secret Modal */}
      {showAddItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleAddItemSubmit} className="bg-[#242526] p-6 rounded-xl max-w-md w-full border border-[#393a3b] shadow-2xl space-y-4">
            <h4 className="font-bold text-[#e4e6eb] text-base">Thêm Ghi Chú Mật / Thông Tin Nhạy Cảm</h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Tiêu Đề</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Kế hoạch bí mật hoặc API Key"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Phân Loại</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                >
                  <option value="journal">Nhật Ký / Ý Tưởng</option>
                  <option value="secret">Ghi Chú Mật</option>
                  <option value="credential">Tài Khoản / API Key</option>
                </select>
              </div>
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Nội Dung</label>
                <textarea
                  rows={4}
                  placeholder="Nội dung sẽ được mã hóa AES-256 trước khi lưu..."
                  value={newItem.content}
                  onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] placeholder-[#b0b3b8] font-mono focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddItem(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#b0b3b8] hover:bg-[#3a3b3c] hover:text-[#e4e6eb] transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#1877f2] hover:bg-[#166fe5] text-white transition-colors"
              >
                Lưu Mã Hóa
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
