# WebsiteQuanLyNhaHang

Hệ thống quản lý nhà hàng và gọi món bằng mã QR tại bàn. Phạm vi Sprint 1 gồm US-001–US-044, hạn hoàn thành: **19/10/2026**.

## Công nghệ và kiến trúc

- **Backend:** Node.js, Express, Socket.io.
- **Frontend:** React hoặc Vue (thống nhất lựa chọn trong quá trình khởi tạo ứng dụng).
- **Cơ sở dữ liệu:** MySQL hoặc PostgreSQL (chốt hệ quản trị trước khi triển khai lược đồ).
- **Giao tiếp API:** JSON, thống nhất cấu trúc phản hồi `{ok,data,msg}`.
- **Thư mục và tên tệp:** tiếng Việt không dấu, tên ghép theo camelCase.
- **Tên bảng/cột cơ sở dữ liệu:** tiếng Việt không dấu, snake_case.

```text
WebsiteQuanLyNhaHang/
├── backend/
│   ├── cauHinh/
│   ├── middleware/
│   ├── modules/
│   ├── tienIch/
│   └── tacVuNen/
├── frontend/
│   ├── dungChung/
│   ├── thanhPhan/
│   ├── trang/
│   └── dinhTuyen/
├── database/
│   ├── taoBang.sql
│   ├── rangBuoc.sql
│   ├── chiMuc.sql
│   └── duLieuMau.sql
├── kiemThu/
├── taiLieu/
├── .github/
│   └── ISSUE_TEMPLATE/
├── README.md
└── huongDanGit.sh
```

Các thư mục con và tệp trong cây trên là định hướng kiến trúc. Tạo thêm theo nhu cầu nhưng phải tuân thủ quy tắc đặt tên.

## Phân công đội ngũ

| Thành viên | Vai trò | GitHub | Phạm vi phụ trách |
|---|---|---|---|
| Nhật | PM & Backend Core | `@dinhvietlongnhat` | Khởi tạo kho, kiến trúc, duyệt PR; US-001–006, US-007–010, US-015–022, US-041–044 |
| Minh | Backend API Dev | `@[username-minh]` | US-011–014, US-023–030, US-031–040 |
| Phát | DBA | `@[username-phat]` | ERD, `taoBang.sql`, `rangBuoc.sql`, `chiMuc.sql`, `duLieuMau.sql`; hỗ trợ dữ liệu cho US-001–044 |
| Phong | Frontend Admin/Auth | `@[username-phong]` | US-003, US-004, US-019–021, US-007–014, US-015–018, US-022, US-041–044 |
| Quân | Frontend Table QR & Menu | `@[username-quan]` | US-023–030, US-031–040 |

## Quy tắc mã hóa và đặt tên

- Tên thư mục, tệp, biến, hàm, lớp và thành phần JavaScript dùng **tiếng Việt không dấu**, viết camelCase; ví dụ `quanLyBan`, `layDanhSachMon`, `danhSachMon.js`.
- Tên bảng và cột dùng tiếng Việt không dấu, snake_case; ví dụ `chi_tiet_don_hang`, `ngay_tao`.
- Giữ tên thư mục kiến trúc đúng như cây ở trên. Tên công nghệ, giao thức, cú pháp và tên thuộc tính/API bắt buộc theo chuẩn như `Node.js`, `Socket.io`, `camelCase`, `snake_case`, `ok`, `data`, `msg` được giữ nguyên.
- Phản hồi API thành công và lỗi đều theo dạng `{ok,data,msg}`; `ok` là trạng thái xử lý, `data` là dữ liệu trả về (có thể `null`), `msg` là thông báo.
- Không đưa thông tin bí mật, mật khẩu, khóa bí mật hoặc dữ liệu thật của khách hàng vào mã nguồn hay dữ liệu mẫu.

## Quy trình Git và Pull Request

- Bảo vệ `main` và `develop`; không đẩy trực tiếp. Mọi thay đổi đi qua PR.
- `main` chứa phiên bản ổn định; `develop` là nhánh tích hợp của Sprint. PR tính năng hướng vào `develop`; chỉ Nhật tạo PR phát hành từ `develop` vào `main`.
- Mỗi công việc gắn với issue và nhánh riêng. Dạng nhánh backend: `BE_[ten-module]` hoặc `feature/be-[ten-chuc-nang]`; frontend: `fe-[ten-module]` hoặc `fe_ui_[ten-trang]`; database: `db-[ten-noi-dung]`.
- Tên nhánh dùng nội dung ngắn, không dấu; giữ chính xác tiền tố và dấu phân cách trong các mẫu nêu trên.
- Commit theo Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`; nội dung sau tiền tố nêu ngắn gọn phần việc.
- Mỗi PR cần liên kết issue, mô tả thay đổi, nêu cách kiểm tra, cập nhật tài liệu liên quan và được ít nhất một thành viên khác xem xét. Nhật chịu trách nhiệm duyệt PR và xử lý phát hành.
- Hướng dẫn lệnh Git Bash từng bước nằm tại [`huongDanGit.sh`](huongDanGit.sh).

## Mẫu issue

- Backend: [Tạo công việc Backend](.github/ISSUE_TEMPLATE/1_backend_task.md)
- Frontend: [Tạo công việc Frontend](.github/ISSUE_TEMPLATE/2_frontend_task.md)
- Database: [Tạo công việc Cơ sở dữ liệu](.github/ISSUE_TEMPLATE/3_database_task.md)
