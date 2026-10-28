# BÁO CÁO KẾT QUẢ SPRINT 2 (TUẦN 2)

* **Dự án:** Hệ thống Quản lý Nhà hàng & Gọi món QR (QUANMOC.COM)
* **Thành viên thực hiện:** Minh (Phụ trách phát triển Backend & RESTful API)
* **Thời gian thực hiện:** Tuần 2
* **Trạng thái:** Hoàn thành 100% mục tiêu Sprint 2 theo kế hoạch phân công

---

## 1. MỤC TIÊU SPRINT 2
1. Xây dựng bộ Public API E-Menu phục vụ khách hàng quét mã QR trên điện thoại: xem banner, thông tin bàn, duyệt danh mục, tìm kiếm, lọc theo giá và xem chi tiết món ăn kèm tùy chọn.
2. Xây dựng cơ chế kiểm tra tính hợp lệ và tự động tính toán tổng tiền giỏ hàng phía máy chủ (Server-side Cart Validation & Pricing), chống gian lận giá từ client và cảnh báo món hết hàng tức thời.
3. Xây dựng phân hệ tiếp nhận và xử lý yêu cầu hỗ trợ tại bàn (gọi nhân viên kèm lý do nhanh, gọi thanh toán VietQR / tiền mặt, nhân viên tiếp nhận và hoàn tất yêu cầu).
4. Viết kịch bản kiểm thử tự động toàn bộ 3 phân hệ của Sprint 2, đảm bảo tương thích 100% với Frontend của Quân và Phong.

---

## 2. DANH SÁCH USER STORY HOÀN THÀNH

| Nhóm chức năng | Mã User Story | Nội dung công việc | Trạng thái |
|---|---|---|:---:|
| **E-Menu Khách hàng** | US-050 | API trả về dữ liệu trang chủ E-Menu kèm thông tin bàn & đối soát token QR | **Đã hoàn thành** |
| | US-051 | API duyệt danh sách món ăn phân chia theo từng tab danh mục | **Đã hoàn thành** |
| | US-052 | API lấy danh sách các món đặc sắc / bán chạy gợi ý cho khách | **Đã hoàn thành** |
| | US-053 | API tìm kiếm nhanh theo từ khóa tên món hoặc thành phần | **Đã hoàn thành** |
| | US-054 | API lọc món ăn theo khoảng giá tùy chọn (`giaMin`, `giaMax`) | **Đã hoàn thành** |
| | US-055 | API xem chi tiết món ăn kèm cấu hình tùy chọn (Size, Topping) | **Đã hoàn thành** |
| | US-056 | Đánh dấu trạng thái `TamHet` để Frontend làm mờ và khóa chọn món | **Đã hoàn thành** |
| **Giỏ hàng & Tính tiền** | US-057 | Tiếp nhận danh sách món ăn và tùy chọn kèm theo từ giỏ hàng | **Đã hoàn thành** |
| | US-058 | Tiếp nhận số lượng tăng giảm của từng món ăn | **Đã hoàn thành** |
| | US-059 | Tiếp nhận ghi chú khẩu vị riêng cho từng món ăn (ít cay, không hành...) | **Đã hoàn thành** |
| | US-060 | Tiếp nhận ghi chú chung cho toàn bộ lượt gọi món | **Đã hoàn thành** |
| | US-061 | Tự động tính toán lại đơn giá gốc, tiền tùy chọn và thành tiền chuẩn từ CSDL | **Đã hoàn thành** |
| | US-062 | Kiểm tra chặn đặt món và báo danh sách món nếu có món bị báo Tạm Hết | **Đã hoàn thành** |
| **Yêu cầu hỗ trợ tại bàn** | US-071 | API khách hàng gửi yêu cầu "Gọi nhân viên" từ giao diện web | **Đã hoàn thành** |
| | US-072 | Tiếp nhận danh mục lý do hỗ trợ nhanh (bát đũa, khăn giấy, thêm đá...) | **Đã hoàn thành** |
| | US-073 | API khách hàng gửi "Yêu cầu thanh toán" (Tiền mặt / Chuyển khoản VietQR) | **Đã hoàn thành** |
| | US-074 | API cập nhật trạng thái khi nhân viên tiếp nhận (`DangXuLy`) và xong (`DaHoanThanh`) | **Đã hoàn thành** |

---

## 3. SẢN PHẨM BÀN GIAO KỸ THUẬT

### 3.1. Các module xây dựng mới trong Sprint 2
1. `backend/modules/thucDon/thucDonPublic.controller.js` & `thucDonPublic.routes.js`: Định tuyến và xử lý các API công khai cho khách hàng khi quét mã QR.
2. `backend/modules/gioHang/`: Module độc lập thực hiện validate giỏ hàng và tính tiền Server-side.
3. `backend/modules/yeuCauHoTro/`: Module quản lý yêu cầu hỗ trợ bàn (Model, Service, Controller, Routes, Validation).
4. `taiLieu/dacTaApiSprint2.md`: Tài liệu đặc tả API chi tiết bàn giao cho nhóm Frontend.

### 3.2. Danh sách Endpoints mới bàn giao
* **Public E-Menu:**
  - `GET /api/public/e-menu?banId=&token=` (Xem E-Menu bàn)
  - `GET /api/public/e-menu/danh-muc` (Danh sách danh mục)
  - `GET /api/public/e-menu/mon-ban-chay` (Món bán chạy)
  - `GET /api/public/e-menu/mon-an?danhMucId=&tuKhoa=&giaMin=&giaMax=` (Lọc & tìm kiếm)
  - `GET /api/public/e-menu/mon-an/:id` (Chi tiết món)
* **Giỏ hàng:**
  - `POST /api/gio-hang/kiem-tra-va-tinh-tien` (Kiểm tra & tính tiền chuẩn Server)
* **Yêu cầu hỗ trợ:**
  - `POST /api/yeu-cau-ho-tro` (Khách gửi yêu cầu)
  - `GET /api/yeu-cau-ho-tro?trangThai=` (Nhân viên xem danh sách yêu cầu)
  - `PATCH /api/yeu-cau-ho-tro/:id/trang-thai` (Đổi trạng thái: Đang xử lý / Hoàn thành)

---

## 4. KẾT QUẢ KIỂM THỬ TỰ ĐỘNG (100% ĐẠT)
Chạy script kiểm thử `kiemThu/api/kiemThuSprint2.js`:
- ✅ 1. Truy cập trang chủ E-Menu qua QR hợp lệ: ĐẠT
- ✅ 2. Chặn truy cập E-Menu khi token QR sai: ĐẠT (Mã 403)
- ✅ 3. Lọc món ăn (từ khóa 'Bò', 100k - 300k): tìm thấy 2 món
- ✅ 4. Server tự động tính toán tổng tiền giỏ hàng (chuẩn giá gốc + phụ thu tùy chọn): ĐẠT
- ✅ 5. Cảnh báo và chặn đặt món khi món trong giỏ bị báo Tạm Hết: ĐẠT (Mã 400 kèm `danhSachMonHetHang`)
- ✅ 6. Khách gửi yêu cầu "Gọi nhân viên": ĐẠT
- ✅ 7. Khách gửi yêu cầu "Thanh toán VietQR": ĐẠT
- ✅ 8. Nhân viên bấm tiếp nhận yêu cầu (`DangXuLy`): ĐẠT
- ✅ 9. Nhân viên hoàn tất phục vụ yêu cầu (`DaHoanThanh`): ĐẠT

---

## 5. KẾ HOẠCH CHO SPRINT 3 (TUẦN 3)
1. Xây dựng phân hệ Quản lý Hóa đơn, Phụ phí và Khuyến mãi (US-099 -> US-104).
2. Xây dựng cơ chế Thanh toán Tiền mặt (tính tiền thừa) và sinh mã VietQR động chuẩn Napas có sẵn số tiền & mã hóa đơn (US-105 -> US-107).
3. Hỗ trợ tách món thanh toán riêng và tự động đóng phiên bàn về trạng thái "Bàn trống" (US-108 -> US-110).

---
*Người lập báo cáo: Minh (Backend API)*
