# BÁO CÁO KẾT QUẢ SPRINT 3 (TUẦN 3)

* **Dự án:** Hệ thống Quản lý Nhà hàng & Gọi món QR (QUANMOC.COM)
* **Thành viên thực hiện:** Minh (Phụ trách phát triển Backend & RESTful API)
* **Thời gian thực hiện:** Tuần 3 (Sprint 3)
* **Trạng thái:** Hoàn thành 100% mục tiêu Sprint 3 theo kế hoạch phân công

---

## 1. MỤC TIÊU SPRINT 3
1. Xây dựng phân hệ Quản lý Khuyến mãi và Mã giảm giá (US-099, US-100): hỗ trợ giảm theo % (kèm mức trần tối đa) hoặc số tiền cố định, kiểm tra điều kiện áp dụng (hạn dùng, đơn tối thiểu, số lượt dùng).
2. Xây dựng phân hệ Đơn gọi món (Rounds) và Hóa đơn thanh toán (US-101 -> US-104): tự động gom toàn bộ các lượt gọi món của bàn thành một hóa đơn duy nhất, hỗ trợ tùy chỉnh chiết khấu/phụ phí của Quản lý, tính thuế VAT 8% và xuất phiếu tạm tính chuẩn in ấn (CSS Print).
3. Xây dựng nghiệp vụ Tách món thanh toán riêng (Split Bill - US-108): cho phép tách các món cụ thể sang một hóa đơn con mới và tự động khấu trừ, tính lại tiền hóa đơn gốc.
4. Xây dựng phân hệ Thanh toán hoàn chỉnh (US-105 -> US-110): xử lý thanh toán tiền mặt (tính tiền thừa), sinh mã thanh toán VietQR động chuẩn Napas 247 kèm ảnh DataURL Base64, xác nhận thanh toán, tự động đóng Table Session và đưa bàn về trạng thái "Bàn trống".
5. Viết kịch bản kiểm thử tự động toàn diện và biên soạn tài liệu đặc tả API bàn giao cho nhóm Frontend.

---

## 2. DANH SÁCH USER STORY HOÀN THÀNH

| Nhóm chức năng | Mã User Story | Nội dung công việc | Trạng thái |
|---|---|---|:---:|
| **Khuyến mãi & Giảm giá** | US-099 | Bộ API CRUD chương trình khuyến mãi / mã giảm giá (% hoặc tiền cố định) | **Đã hoàn thành** |
| | US-100 | API kiểm tra điều kiện hợp lệ và tự động tính số tiền giảm giá | **Đã hoàn thành** |
| **Hóa đơn & Tính tiền** | US-101 | Tùy chỉnh chiết khấu trực tiếp hoặc cộng phụ phí (quyền Quản lý) | **Đã hoàn thành** |
| | US-102 | API tự động tổng hợp toàn bộ các lượt gọi món của bàn thành một hóa đơn | **Đã hoàn thành** |
| | US-103 | Tự động tính tiền hàng, chiết khấu, phụ phí, thuế VAT và tổng tiền phải thu | **Đã hoàn thành** |
| | US-104 | Xuất dữ liệu in phiếu tạm tính kèm mã QR thanh toán nhanh (CSS Print) | **Đã hoàn thành** |
| **Nghiệp vụ nâng cao** | US-108 | Nghiệp vụ tách món trong bàn để thanh toán riêng (Split Bill) | **Đã hoàn thành** |
| **Thanh toán & Đóng bàn** | US-105 | Xử lý thanh toán Tiền mặt (nhập tiền khách đưa, tự động tính tiền thừa) | **Đã hoàn thành** |
| | US-106 | Tạo mã VietQR động chứa sẵn số tiền và nội dung theo mã hóa đơn | **Đã hoàn thành** |
| | US-107 | Xác nhận hoàn tất giao dịch thanh toán và xuất hóa đơn chính thức | **Đã hoàn thành** |
| | US-109 | Tự động đóng phiên phục vụ bàn (Table Session) ngay sau thanh toán | **Đã hoàn thành** |
| | US-110 | Tự động chuyển trạng thái bàn về "Bàn trống" và làm mới token QR | **Đã hoàn thành** |

---

## 3. SẢN PHẨM BÀN GIAO KỸ THUẬT

### 3.1. Các module xây dựng mới trong mã nguồn (`backend/`)
1. `backend/modules/khuyenMai/`: Quản lý chương trình khuyến mãi, voucher ưu đãi (Model, Service, Controller, Routes, Validation, Index).
2. `backend/modules/donGoiMon/`: Quản lý các lượt gọi món (Orders/Rounds) của bàn, tính tổng tiền lũy kế (Model, Service, Controller, Routes, Validation, Index).
3. `backend/modules/hoaDon/`: Quản lý tổng hợp hóa đơn, tính tiền VAT, in phiếu tạm tính, tách hóa đơn con (Model, Service, Controller, Routes, Validation, Index).
4. `backend/modules/thanhToan/`: Quản lý giao dịch tiền mặt, chuyển khoản VietQR, đóng phiên bàn (Model, Service, Controller, Routes, Validation, Index).
5. `backend/tienIch/vietQr.js`: Tiện ích tạo QuickLink VietQR và sinh mã QR DataURL Base64 chuẩn Napas 247.

### 3.2. Kết quả kiểm thử tự động
* **Script kiểm thử:** `node kiemThu/api/kiemThuSprint3.js`
* **Kết quả:** **17/17 kịch bản kiểm thử đạt 100%**, bao gồm:
  - Áp dụng voucher % và tiền cố định, chặn khi chưa đạt đơn tối thiểu.
  - Đặt nhiều lượt gọi món và tính tổng lũy kế bàn.
  - Tổng hợp hóa đơn, khấu trừ voucher, cộng phụ phí, tính VAT 8%.
  - Xuất phiếu tạm tính và sinh mã VietQR Base64.
  - Tách món sang hóa đơn con mới và cập nhật hóa đơn gốc.
  - Thanh toán tiền mặt, tính đúng tiền thừa, tự động đóng session và giải phóng bàn ăn về trạng thái "Trong".
  - Sinh mã VietQR động và xác nhận chuyển khoản ngân hàng.

---

## 4. KẾ HOẠCH SPRINT 4 TIẾP THEO
* **US-111 -> US-116:** API Đánh giá chất lượng dịch vụ (1-5 sao) và phản hồi của khách hàng sau bữa ăn.
* **US-117 -> US-122:** API Quản lý ca làm việc của nhân viên thu ngân (Mở ca, phiếu thu/chi, đối soát quỹ tiền mặt, kết ca).
* **US-131 -> US-134:** API Tra cứu lịch sử hóa đơn và xuất báo cáo doanh thu ra file Excel/CSV.
