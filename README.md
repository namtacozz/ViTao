# ⚡ ViTao — Personal Universe OS & All-in-One Dashboard

> **"Tất cả là vì tao"** — Không gian quản lý cá nhân, học tập, gaming và giải trí đỉnh cao hoạt động mượt mà trên Desktop lẫn Mobile Web.

Deploy trực tiếp miễn phí lên **GitHub Pages** và đồng bộ / commit dữ liệu tức thì lên GitHub branch thông qua **GitHub REST API** (Không cần server backend tốn kém).

---

## 🚀 Tính Năng Nổi Bật

### 1. 🌟 Profile Showcase & Chế Độ Kép (Dual Mode)
- **Chế độ Khách (Public)**: Bento Grid hiện đại phong cách Cyberpunk / Dark Glassmorphism, hiển thị Bio, Avatar, Kỹ năng, Dự án nổi bật và Thống kê thành tích.
- **Chế độ Chủ Nhân (Master / Admin)**: Mở khóa bằng mã PIN / Mật khẩu chủ nhân để chỉnh sửa trực tiếp nội dung trên giao diện (In-place editing) và truy cập két sắt mật.

### 2. 📚 Quản Lý Học Tập & Công Việc (Study & Work Hub)
- **Bảng điểm theo học kỳ**: Quản lý tín chỉ, điểm quá trình, điểm thi, tự động tính điểm hệ 10, hệ 4 và điểm chữ.
- **Tính toán CPA / GPA**: Đo lường tiến độ đạt mục tiêu CPA tích lũy.
- **Kanban Task Board**: Phân loại việc cần làm (To Do, In Progress, Done) kèm deadline và độ ưu tiên.
- **Pomodoro Focus Timer**: Đồng hồ đếm ngược 25/5 phút kết hợp bật nhanh nhạc Lo-Fi học bài.

### 3. 🎮 Gaming Center (LoL & TFT Meta Tracker)
- **Hồ sơ Summoner**: Thống kê Rank Liên Minh Huyền Thoại & Đấu Trường Chân Lý, tỷ lệ thắng, tướng tủ.
- **Đội hình chuẩn Meta ĐTCL (MetaTFT.com)**:
  - Tích hợp trực tiếp dữ liệu MetaTFT thời gian thực (Tier S, A, B, average placement, top 4 rate).
  - Tướng cốt lõi, kích hoạt Tộc/Hệ, trang bị chuẩn (BIS Items), vị trí xếp cờ và lõi công nghệ.
  - 1-Click lưu đội hình vào danh sách bài tủ cá nhân.

### 4. 🎵 YouTube Hub & Floating PiP Media Player
- **Trình phát nổi Picture-in-Picture**: Cửa sổ phát có thể thu nhỏ thành thanh nổi hoặc phóng to tùy ý, không ngắt quãng trải nghiệm khi chuyển tab.
- **Chế độ Nghe Nhạc (Cyberpunk Music Player)**: Đĩa than xoay tròn, dải sóng âm thanh (Audio Visualizer), điều khiển Play/Pause/Next/Prev, thanh âm lượng và danh sách phát.
- **Tìm kiếm YouTube thông minh**: Thanh tìm kiếm Spotlight (`Ctrl + K`) tìm kiếm mọi bài hát / video và phát ngay lập tức.
- **Theo dõi Kênh YouTube**: Danh sách kênh lập trình, game, âm nhạc yêu thích.

### 5. 🔐 Két Sắt Bí Mật Mã Hóa (AES-256 Client-Side Vault)
- Mã hóa toàn bộ ghi chú nhạy cảm, mật khẩu hoặc nhật ký bằng **Web Crypto API (AES-GCM 256)** với mật khẩu chủ nhân trước khi lưu.
- Tuyệt đối an toàn ngay cả khi repository ở chế độ Public.

### 6. 🔥 Chuỗi Thói Quen (Habit Tracker)
- Theo dõi thói quen hàng ngày với biểu đồ heatmap mini phong cách GitHub commit.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4.
- **Animation & Motion**: GSAP, CSS Animations, Transitions.dev standard motion tokens.
- **Icons**: Lucide React + Custom SVG Brand Icons.
- **Storage & Sync**: GitHub REST API (`octokit`/`fetch`), LocalStorage Cache, Web Crypto API.
- **CI/CD**: GitHub Actions tự động build và deploy lên GitHub Pages.

---

## 📦 Cài Đặt & Chạy Cục Bộ (Local Development)

```bash
# 1. Clone repository
git clone https://github.com/namtacozz/ViTao.git
cd ViTao

# 2. Cài đặt dependencies
npm install

# 3. Khởi động môi trường phát triển
npm run dev

# 4. Build sản phẩm production
npm run build
```

---

## 🌐 Hướng Dẫn Kích Hoạt GitHub Pages

1. Vào repository **ViTao** trên GitHub: `https://github.com/namtacozz/ViTao/settings/pages`.
2. Tại mục **Build and deployment** -> **Source**, chọn **GitHub Actions**.
3. Mỗi khi push code lên branch `main`, GitHub Actions sẽ tự động kích hoạt workflow `.github/workflows/deploy.yml` để build và phát hành trang web lên:
   👉 `https://namtacozz.github.io/ViTao/`

---

## 🔑 Hướng Dẫn Đồng Bộ Dữ Liệu Qua GitHub API

1. Bấm nút **Chế độ Khách** trên thanh điều hướng hoặc nhấn `Ctrl + K`.
2. Nhập mật mã mở khóa mặc định: `123456` hoặc `namtacozz`.
3. Nhập **GitHub Personal Access Token (PAT)** (cần quyền `repo` hoặc `contents:write`).
4. Khi chỉnh sửa bất kỳ mục nào, bấm nút **"Lưu lên GitHub"** ở góc phải — ViTao sẽ tự động tạo commit và đẩy thẳng dữ liệu mới vào repo của bạn!
