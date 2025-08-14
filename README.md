# Demo: Đăng nhập Google trên GitHub Pages (Không cần backend)

> Dự án mẫu dùng **Google Identity Services (GIS)** để đăng nhập Google **client-side**. Phù hợp cho **demo** host trên **GitHub Pages**.  
> Lưu ý: Chỉ hiển thị thông tin từ **ID Token** trên trình duyệt. Nếu muốn **xác thực an toàn** hoặc tạo phiên bảo mật, bạn cần **backend** để verify token phía server.

## Tính năng
- Nút "Sign in with Google" (popup / One Tap).
- Giải mã **ID token (JWT)** trên client để hiện tên, email, ảnh đại diện.
- Demo "Đăng xuất" (xóa token khỏi `localStorage` và tắt auto select).

## Triển khai nhanh
1. Tạo **OAuth Consent Screen** (External) và **OAuth Client** trong **Google Cloud Console**.
2. Ở phần **Authorized JavaScript origins**, thêm:
   - `https://<username>.github.io` (khi deploy)
   - `http://localhost:8000` hoặc `http://127.0.0.1:8000` (khi chạy local)
3. Lấy **Client ID** dạng `xxxxx.apps.googleusercontent.com`.
4. Sao chép `assets/config.example.js` thành `assets/config.js` và điền:
   ```js
   window.APP_CONFIG = {
     GOOGLE_CLIENT_ID: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
   };
   ```
5. Deploy lên GitHub Pages:
   - Tạo repo, push toàn bộ mã nguồn.
   - Vào **Settings → Pages**: chọn **Deploy from a branch** (nhánh `main`, thư mục `/root`).
   - Chờ GitHub Pages build xong, truy cập `https://<username>.github.io/<repo>/`.

## Chạy local để test
Dùng Python HTTP server (hoặc bất kỳ static server nào):
```bash
# Python 3
python -m http.server 8000
# Mở http://localhost:8000
```
> Không mở file `index.html` trực tiếp bằng `file://` vì nhiều API sẽ bị chặn.

## Bảo mật & hạn chế
- **Client ID có thể public**. **Client Secret không** xuất hiện ở đây.
- Đây **không** phải là giải pháp auth hoàn chỉnh. Ở môi trường production:
  - Xác thực ID token **trên server** (verify chữ ký với Google).
  - Tạo **session / cookie** an toàn (HTTPOnly, SameSite, Secure).
  - Hạn chế scope ở mức tối thiểu (`openid email profile`).
- Nếu bạn cần bản **full-stack** (Node/Go/Python) để verify token, tạo JWT riêng và API session, bạn có thể mở issue hoặc mở rộng từ bản này.

## Cấu trúc thư mục
```
.
├── index.html
├── assets
│   ├── app.js
│   ├── styles.css
│   └── config.example.js  # copy thành config.js rồi điền CLIENT_ID
└── README.md
```

## Giấy phép
MIT
