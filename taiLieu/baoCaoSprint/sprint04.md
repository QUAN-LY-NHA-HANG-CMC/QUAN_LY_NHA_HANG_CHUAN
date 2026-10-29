# BÁO CÁO KẾT QUẢ SPRINT 4 (TUẦN 4)

* **Dự án:** Hệ thống Quản lý Nhà hàng & Gọi món QR (QUANMOC.COM)
* **Thành viên thực hiện:** Nguyễn Sỹ Minh (Phụ trách phát triển Backend & RESTful API)
* **Thời gian thực hiện:** Tuần 4 (Sprint 4)
* **Trạng thái:** Hoàn thành 100% mục tiêu Sprint 4 theo kế hoạch phân công

---

## 1. MỤC TIÊU SPRINT 4
1. **Phân hệ Đánh giá & Phản hồi khách hàng (US-111 -> US-116):** Cho phép thực khách chấm điểm dịch vụ (1-5 sao), đánh giá chi tiết từng món ăn sau khi thanh toán, quản lý xem/lọc đánh giá tiêu cực (<= 2 sao) để xử lý khẩn cấp, gửi phản hồi giải trình và tổng hợp điểm trung bình.
2. **Phân hệ Quản lý Ca làm việc & Kết ca thu ngân (US-117 -> US-122):** Quản lý ca mẫu, quy trình mở ca với tiền mặt đầu ca trong két, lập phiếu thu/chi phát sinh, tự động tổng hợp tiền bán hàng thời gian thực, đóng ca đối soát tiền thực tế vs lý thuyết và lưu trữ biên bản bàn giao.
3. **Phân hệ Thống kê Dashboard & Phân tích kinh doanh (US-123 -> US-130):** Cung cấp các số liệu tổng quan thời gian thực (doanh thu, số đơn, số khách), biểu đồ doanh thu theo chu kỳ, tỷ trọng thanh toán Tiền mặt vs VietQR, doanh thu theo danh mục món, xếp hạng Top món bán chạy/bán chậm, phân tích khung giờ cao điểm và thống kê tỷ lệ món hủy/thất thoát.
4. **Phân hệ Tra cứu lịch sử & Xuất báo cáo CSV/Excel (US-131 -> US-134):** Tra cứu, lọc lịch sử hóa đơn thanh toán và xuất dữ liệu hóa đơn, thực đơn ra file CSV chuẩn nhúng tiền tố BOM UTF-8 (`\uFEFF`) để mở trực tiếp trên Microsoft Excel tiếng Việt không bị lỗi font.
5. **Kiểm thử tự động & Tài liệu hóa:** Xây dựng bộ test suite tự động 21 kịch bản kiểm thử bao phủ toàn bộ Sprint 4 và biên soạn tài liệu đặc tả API bàn giao cho nhóm Frontend.

---

## 2. DANH SÁCH USER STORY HOÀN THÀNH

| Nhóm chức năng | Mã User Story | Nội dung công việc | Trạng thái |
|---|---|---|:---:|
| **Đánh giá & Phản hồi** | US-111 | Chấm điểm sao dịch vụ (1-5 sao) sau bữa ăn | **Đã hoàn thành** |
| | US-112 | Khách hàng đánh giá chi tiết và chấm điểm từng món ăn | **Đã hoàn thành** |
| | US-113 | Quản lý xem toàn bộ danh sách đánh giá của khách hàng | **Đã hoàn thành** |
| | US-114 | Lọc đánh giá theo số sao hoặc các phản hồi tiêu cực (<= 2 sao) cần xử lý gấp | **Đã hoàn thành** |
| | US-115 | Quản lý phản hồi ý kiến đóng góp và lưu vết người phản hồi | **Đã hoàn thành** |
| | US-116 | Thống kê điểm đánh giá trung bình toàn quán và từng món ăn | **Đã hoàn thành** |
| **Quản lý Ca làm việc** | US-117 | Thiết lập cấu hình danh sách ca làm việc trong ngày | **Đã hoàn thành** |
| | US-118 | Thu ngân mở ca làm việc và nhập tiền mặt ban đầu trong két | **Đã hoàn thành** |
| | US-119 | Lập phiếu thu / chi tiền mặt phát sinh trong ca | **Đã hoàn thành** |
| | US-120 | Tự động tổng hợp doanh thu tiền mặt, chuyển khoản và tiền két lý thuyết | **Đã hoàn thành** |
| | US-121 | Thu ngân đóng ca, kiểm đếm tiền thực tế và đối soát lệch quỹ | **Đã hoàn thành** |
| | US-122 | Lịch sử bàn giao ca và chi tiết biên bản kết ca | **Đã hoàn thành** |
| **Báo cáo & Thống kê** | US-123 | Dashboard tổng quan số liệu trong ngày (Doanh thu, số đơn, số bàn...) | **Đã hoàn thành** |
| | US-124 | Biểu đồ doanh thu trực quan theo mốc thời gian | **Đã hoàn thành** |
| | US-125 | Thống kê tỷ trọng doanh thu: Tiền mặt vs Chuyển khoản VietQR | **Đã hoàn thành** |
| | US-126 | Thống kê doanh thu theo từng danh mục món ăn | **Đã hoàn thành** |
| | US-127 | Xếp hạng Top món ăn bán chạy nhất | **Đã hoàn thành** |
| | US-128 | Xếp hạng các món ăn ít người gọi nhất để tối ưu menu | **Đã hoàn thành** |
| | US-129 | Phân tích các khung giờ cao điểm và lượng khách phục vụ | **Đã hoàn thành** |
| | US-130 | Thống kê tỷ lệ đơn hủy, món hủy và giá trị thất thoát | **Đã hoàn thành** |
| **Tra cứu & Xuất dữ liệu** | US-131, 132 | Tra cứu lịch sử toàn bộ hóa đơn thanh toán và chi tiết món | **Đã hoàn thành** |
| | US-133 | Xuất báo cáo danh sách hóa đơn ra file CSV chuẩn UTF-8 BOM | **Đã hoàn thành** |
| | US-134 | Xuất danh mục thực đơn ra file CSV chuẩn UTF-8 BOM | **Đã hoàn thành** |

---

## 3. SẢN PHẨM BÀN GIAO KỸ THUẬT

### 3.1. Các module xây dựng mới trong mã nguồn (`backend/`)
1. `backend/modules/danhGia/`: Quản lý đánh giá sao, nhận xét dịch vụ, phản hồi từ quản lý và phân tích điểm sao món ăn (Model, Service, Controller, Routes, Validation, Index).
2. `backend/modules/caLamViec/`: Quản lý ca mẫu, phiên ca làm việc, phiếu thu/chi, tổng hợp tiền két tự động và biên bản kết ca (Model, Service, Controller, Routes, Validation, Index).
3. `backend/modules/baoCao/`: Tổng hợp số liệu Dashboard, phân tích doanh thu theo danh mục, khung giờ, tỷ trọng thanh toán, món bán chạy/chậm, tỷ lệ hủy (Service, Controller, Routes, Index).
4. `backend/tienIch/xuatCsv.js`: Module chuyển đổi mảng dữ liệu JSON thành chuỗi CSV định dạng chuẩn RFC 4180 và nhúng UTF-8 BOM (`\uFEFF`) tương thích tuyệt đối với Microsoft Excel tiếng Việt.

### 3.2. Tài liệu đặc tả API bàn giao
* **File tài liệu:** `taiLieu/dacTaApiSprint4.md`
* Bàn giao đầy đủ thông số URL, Method, Request Body, Response mẫu cho 18 endpoints phục vụ nhóm Frontend.

### 3.3. Kết quả kiểm thử tự động
* **Script kiểm thử:** `node kiemThu/api/kiemThuSprint4.js`
* **Kết quả:** **21/21 kịch bản kiểm thử đạt 100%**, bao gồm:
  1. Gửi đánh giá dịch vụ và món ăn (US-111, US-112).
  2. Chặn gửi đánh giá trùng lặp cho cùng một hóa đơn.
  3. Lọc danh sách đánh giá tiêu cực (<= 2 sao) cần xử lý khẩn (US-113, US-114).
  4. Quản lý gửi phản hồi giải trình ý kiến khách hàng (US-115).
  5. Thống kê điểm đánh giá trung bình toàn quán và từng món (US-116).
  6. Lấy danh sách ca mẫu và kiểm tra trạng thái ca hiện tại (US-117, US-120).
  7. Mở ca làm việc mới với tiền két đầu ca (US-118).
  8. Lập phiếu thu tiền phát sinh trong ca (US-119).
  9. Lập phiếu chi tiền phát sinh trong ca (US-119).
  10. Tự động tính toán số dư tiền két lý thuyết theo thời gian thực (US-120).
  11. Đóng ca làm việc và tự động tính lệch quỹ tiền mặt (US-121).
  12. Tra cứu lịch sử bàn giao ca và biên bản kết ca (US-122).
  13. Dashboard tổng quan số liệu trong ngày (US-123).
  14. Biểu đồ doanh thu theo ngày (US-124).
  15. Tỷ trọng thanh toán Tiền mặt vs VietQR (US-125).
  16. Doanh thu theo từng danh mục món ăn (US-126).
  17. Xếp hạng Top món bán chạy và bán chậm (US-127, US-128).
  18. Phân tích khung giờ cao điểm (US-129).
  19. Thống kê tỷ lệ hủy món và giá trị thất thoát (US-130).
  20. Tra cứu lịch sử hóa đơn thanh toán (US-131, US-132).
  21. Xuất báo cáo hóa đơn & thực đơn ra định dạng CSV UTF-8 BOM (US-133, US-134).

---

## 4. TỔNG KẾT DỰ ÁN (BACKEND)
* Toàn bộ 4 Sprint phát triển Backend của dự án Quản lý Nhà hàng QUANMOC.COM đã hoàn thành vượt tiến độ với chất lượng cao nhất:
  - **Sprint 1:** Nền tảng hệ thống, Xác thực JWT/Phân quyền RBAC, Quản lý Bàn ăn & Thực đơn.
  - **Sprint 2:** Gọi món QR theo bàn, Quản lý đơn gọi món theo lượt (Rounds), Điều phối chế biến Bếp/Bar KDS.
  - **Sprint 3:** Khuyến mãi/Voucher, Tổng hợp hóa đơn, In tạm tính, Tách bill, Thanh toán tiền mặt & VietQR tự động.
  - **Sprint 4:** Đánh giá & CSKH, Ca làm việc & Kết ca thu ngân, Dashboard báo cáo quản trị & Xuất dữ liệu CSV.
* 100% các suite kiểm thử tự động (Sprint 1 -> Sprint 4) đều vượt qua kiểm tra, đảm bảo độ ổn định và sẵn sàng cho việc tích hợp toàn diện với Frontend.
