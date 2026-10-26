# BÁO CÁO KẾT QUẢ SPRINT 1 (TUẦN 1)

* **Dự án:** Hệ thống Quản lý Nhà hàng & Gọi món QR (QUANMOC.COM)
* **Thành viên thực hiện:** Minh (Phụ trách phát triển Backend & RESTful API)
* **Thời gian thực hiện:** Tuần 1
* **Trạng thái:** Hoàn thành 100% mục tiêu Sprint 1 theo kế hoạch phân công

---

## 1. MỤC TIÊU SPRINT 1
1. Xây dựng nền tảng API nghiệp vụ cốt lõi theo kiến trúc 3 lớp: `Route` -> `Validation` -> `Controller` -> `Service` -> `Model`.
2. Hoàn thiện toàn bộ các API quản lý Danh mục thực đơn và Món ăn (hỗ trợ phân trang, lọc, tải ảnh, tùy chọn món).
3. Hoàn thiện toàn bộ các API quản lý Khu vực, Sơ đồ bàn ăn và thuật toán sinh token định danh, tạo mã QR hình ảnh cho từng bàn.
4. Hoàn thiện các API quản lý Hồ sơ nhân sự, phân quyền cơ bản, mã hóa mật khẩu bảo mật bằng bcrypt.
5. Kiểm thử tự động toàn diện các hàm nghiệp vụ và API trước khi bàn giao cho nhóm Frontend.

---

## 2. DANH SÁCH CÔNG VIỆC PHỤ TRÁCH & TRẠNG THÁI HOÀN THÀNH

| Nhóm chức năng | Mã User Story | Nội dung công việc | Trạng thái |
|---|---|---|:---:|
| **Quản lý Hồ sơ nhân sự** | US-011 | API tạo mới tài khoản nhân viên (Thu ngân, Bếp, Phục vụ) kèm băm mật khẩu | **Đã hoàn thành** |
| | US-012 | API lấy danh sách, phân trang và tìm kiếm nhân viên theo từ khóa/vai trò | **Đã hoàn thành** |
| | US-013 | API cập nhật hồ sơ và đặt lại mật khẩu cho nhân viên | **Đã hoàn thành** |
| | US-014 | API khóa / mở khóa tài khoản nhân viên đã nghỉ việc | **Đã hoàn thành** |
| **Khu vực & Sơ đồ bàn** | US-023 | API CRUD khu vực / tầng phục vụ của nhà hàng | **Đã hoàn thành** |
| | US-024 | API lấy danh sách bàn ăn theo từng khu vực | **Đã hoàn thành** |
| | US-025 | API thêm bàn ăn mới (mã bàn, số bàn, khu vực, sức chứa) | **Đã hoàn thành** |
| | US-026 | API cập nhật thông tin bàn hoặc tạm ngừng sử dụng bàn | **Đã hoàn thành** |
| | US-027 | API xóa bàn ăn (kiểm tra chặn xóa bàn đã phát sinh giao dịch) | **Đã hoàn thành** |
| | US-028 | Thuật toán sinh token bảo mật 16 bytes và sinh mã QR hình ảnh (Data URL) | **Đã hoàn thành** |
| | US-029 | API lấy mã QR riêng từng bàn và xuất hàng loạt QR theo khu vực | **Đã hoàn thành** |
| | US-030 | API làm mới token bảo mật QR định danh bàn | **Đã hoàn thành** |
| **Danh mục & Thực đơn** | US-031 | API tạo mới danh mục món ăn (Khai vị, Món chính, Lẩu, Đồ uống...) | **Đã hoàn thành** |
| | US-032 | API chỉnh sửa tên, thứ tự ưu tiên và xóa danh mục | **Đã hoàn thành** |
| | US-033 | API danh sách món ăn quản trị có phân trang, lọc theo danh mục, trạng thái | **Đã hoàn thành** |
| | US-034 | API tạo món ăn mới kèm đơn giá, đơn vị tính, mô tả | **Đã hoàn thành** |
| | US-035 | Middleware & API tải lên ảnh món ăn (giới hạn 5MB, định dạng JPG/PNG/WEBP) | **Đã hoàn thành** |
| | US-036 | API cập nhật thông tin chi tiết và điều chỉnh giá bán | **Đã hoàn thành** |
| | US-037 | API thiết lập tùy chọn đi kèm món (Size, Topping, Cay/Đá/Đường) | **Đã hoàn thành** |
| | US-038 | API bật/tắt nhanh trạng thái món ăn (`DangBan` / `TamHet`) | **Đã hoàn thành** |
| | US-039 | API đánh dấu / bỏ đánh dấu "Món bán chạy / Đề xuất của quán" | **Đã hoàn thành** |
| | US-040 | API xóa mềm (ẩn) món ăn không còn kinh doanh để bảo toàn lịch sử hóa đơn | **Đã hoàn thành** |

---

## 3. SẢN PHẨM BÀN GIAO KỸ THUẬT

### 3.1. Cấu trúc mã nguồn chuẩn dự án
- Toàn bộ mã nguồn đặt trong thư mục `backend/modules/` theo đúng quy ước tiếng Việt không dấu:
  - `modules/danhMucMon/` (Controller, Service, Model, Routes, Validation, Index)
  - `modules/thucDon/` (Controller, Service, Model, Routes, Validation, Index)
  - `modules/khuVuc/` (Controller, Service, Model, Routes, Validation, Index)
  - `modules/banAn/` (Controller, Service, Model, Routes, Validation, Index)
  - `modules/nhanVien/` (Controller, Service, Model, Routes, Validation, Index)
- Hệ thống tiện ích `tienIch/`:
  - `dinhDangPhanHoi.js`: Đóng gói chuẩn phản hồi JSON `{ ok, data, msg }`.
  - `taoMaQr.js`: Sinh token ngẫu nhiên và ảnh QR Base64.
  - `maHoaMatKhau.js`: Tích hợp thư viện `bcryptjs`.
  - `lamSachHtml.js`: Khử ký tự độc hại chống tấn công XSS.

### 3.2. Danh sách Endpoints sẵn sàng cho Frontend (Phong & Quân)
* **Danh mục món:**
  - `GET /api/danh-muc-mon` - Lấy danh sách danh mục
  - `GET /api/danh-muc-mon/:id` - Xem chi tiết danh mục
  - `POST /api/danh-muc-mon` - Tạo danh mục mới
  - `PUT /api/danh-muc-mon/:id` - Cập nhật danh mục
  - `DELETE /api/danh-muc-mon/:id` - Xóa danh mục
* **Món ăn:**
  - `GET /api/thuc-don?danhMucId=&trangThai=&tuKhoa=&giaTu=&giaDen=&trang=&soLuong=` - Danh sách phân trang & lọc
  - `GET /api/thuc-don/:id` - Chi tiết món ăn
  - `POST /api/thuc-don` - Tạo món mới kèm tùy chọn
  - `PUT /api/thuc-don/:id` - Sửa món ăn
  - `POST /api/thuc-don/:id/hinh-anh` - Upload ảnh đại diện món ăn
  - `PATCH /api/thuc-don/:id/trang-thai` - Toggle Đang bán / Tạm hết
  - `PATCH /api/thuc-don/:id/ban-chay` - Toggle Món bán chạy
  - `PUT /api/thuc-don/:id/tuy-chon` - Thiết lập Size & Topping
  - `DELETE /api/thuc-don/:id` - Ẩn món (xóa mềm)
* **Khu vực & Bàn ăn:**
  - `GET /api/khu-vuc` - Danh sách khu vực
  - `POST /api/khu-vuc` - Tạo khu vực
  - `PUT /api/khu-vuc/:id` - Cập nhật khu vực
  - `DELETE /api/khu-vuc/:id` - Xóa khu vực
  - `GET /api/ban-an?khuVucId=&trangThai=` - Danh sách bàn ăn
  - `POST /api/ban-an` - Tạo bàn ăn (tự động tạo token & ảnh QR)
  - `GET /api/ban-an/:id/qr` - Lấy dữ liệu ảnh QR của bàn
  - `GET /api/ban-an/khu-vuc/:khuVucId/qr` - Tải hàng loạt QR theo khu vực
  - `PATCH /api/ban-an/:id/lam-moi-qr` - Tạo mới token bảo mật QR
  - `DELETE /api/ban-an/:id` - Xóa bàn ăn (an toàn)
* **Hồ sơ nhân sự:**
  - `GET /api/nhan-vien?tuKhoa=&vaiTro=&trangThai=` - Tra cứu nhân sự
  - `POST /api/nhan-vien` - Cấp tài khoản nhân viên
  - `PUT /api/nhan-vien/:id` - Cập nhật thông tin nhân viên
  - `PATCH /api/nhan-vien/:id/trang-thai` - Khóa / Mở khóa tài khoản
  - `PATCH /api/nhan-vien/:id/dat-lai-mat-khau` - Đặt lại mật khẩu

---

## 4. KẾT QUẢ KIỂM THỬ (TESTING REPORT)

* **Phương thức kiểm thử:** Viết script kiểm thử tích hợp tự động (`kiemThu/api/kiemThuTrucTiep.js`).
* **Kết quả thực tế:** 100% kịch bản kiểm thử vượt qua thành công:
  - ✅ [Danh mục]: Lấy danh mục, tạo mới danh mục (ID=6), sửa tên danh mục.
  - ✅ [Món ăn]: Tạo món ăn kèm nhóm tùy chọn, chuyển trạng thái `TamHet`, gán `laMonBanChay`, lọc giá/tên, xóa mềm.
  - ✅ [Khu vực & Bàn]: Tạo khu vực, tạo bàn sinh URL/ảnh QR Base64, đổi token mã QR, xuất toàn bộ QR khu vực.
  - ✅ [Nhân viên]: Tạo nhân sự mã hóa mật khẩu, ẩn trường `matKhau` trong output, khóa nhân viên nghỉ việc, đặt lại mật khẩu bằng bcrypt.

---

## 5. VẤN ĐỀ TỒN TẠI & PHƯƠNG HƯỚNG SPRINT 2

1. **Vấn đề tồn tại:**
   - Dữ liệu hiện tại đang lưu trữ dạng Model cấu trúc chuẩn trong bộ nhớ có sẵn dữ liệu mẫu (Seed Data) để phục vụ test và tích hợp Frontend sớm.
   - Khi bạn Phát (Database) hoàn thiện script SQL khởi tạo CSDL quan hệ chính thức, chỉ cần ánh xạ các hàm trong `*.model.js` sang câu lệnh truy vấn CSDL là toàn bộ API giữ nguyên tính tương thích 100%.

2. **Kế hoạch cho Sprint 2 (Tuần 2):**
   - Xây dựng các API E-Menu Public phục vụ khách hàng quét mã QR trên điện thoại (US-050 -> US-056).
   - Xây dựng API kiểm tra tính hợp lệ và tính toán tổng tiền giỏ hàng phía Server (US-057 -> US-062).
   - Xây dựng API tiếp nhận yêu cầu gọi phục vụ / yêu cầu thanh toán tại bàn (US-071 -> US-074).
   - Phối hợp với Nhật (Lead) để tích hợp Socket.io Room đồng bộ trạng thái đơn hàng.

---
*Người lập báo cáo: Minh (Backend API)*
