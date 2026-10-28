# BÁO CÁO TIẾN ĐỘ CÁ NHÂN – TUẦN 4 (SPRINT 4)
**HỌC PHẦN: CÔNG NGHỆ PHẦN MỀM**  
**DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR (QUANMOC.COM)**

---

### I. THÔNG TIN CHUNG
- **Họ và tên sinh viên:** Nguyễn Chí Quân
- **Mã sinh viên:** *(Điền mã sinh viên)*
- **Lớp học phần:** N07 – Trường Đại học CMC
- **Nhóm thực hiện:** Nhóm 1
- **Vai trò trong nhóm:** Frontend Developer (Phụ trách Phân hệ Đánh giá & Phản hồi, Tối ưu hóa UI/UX Responsive, Cấu hình triển khai Vercel và Kiểm thử E2E)
- **Thời gian thực hiện:** Tuần 4 (Sprint 4)
- **Nhánh làm việc Git:** `fe-quan-sprint4`
- **Tài khoản GitHub:** `nguyenchiquan417-ui` (https://github.com/nguyenchiquan417-ui)

---

### II. MỤC TIÊU VÀ NHIỆM VỤ ĐƯỢC PHÂN CÔNG TRONG SPRINT 4
Theo kế hoạch phân công công việc của Nhóm 1 (`taiLieu/phanChiaCongViec.md` và `taiLieu/BAO_CAO_BAI_TAP_LON_CNPM_NHOM1.md`), sinh viên Nguyễn Chí Quân phụ trách các User Stories:
1. **Phân hệ Đánh giá & Phản hồi chất lượng dịch vụ (US-111 → US-116):**
   - **US-111:** Xây dựng giao diện Khách hàng chấm điểm sao (1 đến 5 sao) kèm biểu cảm trực quan (Rất tệ, Tệ, Bình thường, Hài lòng, Tuyệt vời) sau khi dùng bữa.
   - **US-112:** Khách hàng gửi nhận xét chi tiết và đánh giá cụ thể từng món ăn đã thưởng thức trong bữa ăn.
   - **US-113:** Màn hình Quản trị viên/Quản lý xem danh sách toàn bộ đánh giá và phản hồi của khách hàng theo thời gian.
   - **US-114:** Bộ lọc đa năng theo số sao (Tất cả, 5 sao, 4 sao, 3 sao, 2 sao, 1 sao) và bộ lọc nhanh đánh giá tiêu cực (1-2 sao) để nhà hàng xử lý khiếu nại khẩn cấp.
   - **US-115:** Modal Quản lý ghi chú xử lý, phản hồi/hồi âm trực tiếp ý kiến đóng góp của khách hàng và cập nhật trạng thái ("Đã phản hồi", "Đã giải quyết").
   - **US-116:** Thống kê tổng quan: Điểm đánh giá trung bình toàn quán, tỷ lệ hài lòng (%), số lượng phản hồi theo cấp sao, và bảng xếp hạng điểm đánh giá chi tiết của từng món ăn trong thực đơn.
2. **Tối ưu hóa UI/UX Responsive & Tốc độ tải trang (US-135):**
   - Tối ưu hóa tải ảnh bằng thuộc tính `loading="lazy"` trên toàn bộ các thẻ món ăn và mã QR, giảm thời gian tải ban đầu.
   - Tối ưu CSS animations, chuyển động mượt mà không gây giật lag (GPU acceleration).
   - Đảm bảo giao diện tương thích hoàn hảo trên các kích thước màn hình: Mobile (iPhone/Android), Tablet (iPad) và Desktop (Laptop/PC).
3. **Cấu hình triển khai hệ thống (US-138):**
   - Thiết lập cấu hình triển khai tĩnh và điều hướng SPA trên Vercel Cloud thông qua tệp `vercel.json`.
4. **Kiểm thử End-to-End toàn trình (US-140):**
   - Xây dựng Biên bản kiểm thử toàn trình (`taiLieu/bienBanKiemThuE2E_Sprint4.md`) phối hợp cùng Trưởng nhóm (Nhật) kiểm thử 10/10 kịch bản từ quét QR, gọi món, KDS bếp, sơ đồ bàn POS, thanh toán VietQR đến đánh giá sao.

---

### III. KẾT QUẢ CÔNG VIỆC HOÀN THÀNH

#### 1. Bảng chi tiết 9 User Stories phụ trách (9/9 US đạt 100%)
| Phân hệ chức năng | Mã User Story | Nội dung công việc | Kết quả bàn giao | Trạng thái |
|---|---|---|---|:---:|
| **Đánh giá & Phản hồi** | US-111 | Khách hàng chấm điểm sao (1-5 sao) kèm biểu cảm | Modal chấm sao tương tác hiệu ứng hover và chọn biểu cảm sinh động | **Hoàn thành** |
| | US-112 | Khách gửi nhận xét chi tiết và chấm điểm từng món | Form nhận xét, danh sách món kèm nút Like/Dislike từng món đã ăn | **Hoàn thành** |
| | US-113 | Quản lý xem toàn bộ danh sách đánh giá | Bảng/Card danh sách hiển thị đầy đủ ngày giờ, số bàn, mã hóa đơn, nhận xét | **Hoàn thành** |
| | US-114 | Bộ lọc theo sao và lọc đánh giá tiêu cực cần xử lý gấp | Thanh nút lọc theo số sao và nút gạt cảnh báo đỏ cho đánh giá 1-2 sao | **Hoàn thành** |
| | US-115 | Quản lý ghi nhận phản hồi & hồi âm khách hàng | Modal trả lời phản hồi, cập nhật trạng thái `DA_PHAN_HOI` / `DA_GIAI_QUYET` | **Hoàn thành** |
| | US-116 | Thống kê điểm trung bình quán và từng món ăn | 4 Card KPI tổng quan, biểu đồ thanh tỷ lệ sao và Modal xem điểm từng món | **Hoàn thành** |
| **Tối ưu & Triển khai** | US-135 | Lazy loading ảnh & Responsive đa thiết bị | Thêm `loading="lazy"` cho ảnh món ăn, tối ưu CSS Flexbox/Grid responsive | **Hoàn thành** |
| | US-138 | Cấu hình triển khai Frontend lên Vercel | Thiết lập tệp cấu hình `vercel.json` phục vụ build và SPA routing | **Hoàn thành** |
| | US-140 | Kiểm thử End-to-End toàn bộ quy trình hệ thống | Biên bản kiểm thử `taiLieu/bienBanKiemThuE2E_Sprint4.md` (10/10 test case PASS) | **Hoàn thành** |

---

#### 2. Sản phẩm kỹ thuật bàn giao trong mã nguồn
1. **`frontend/trang/danhGiaDichVu/quanLyDanhGia.js`**:
   - Khởi tạo dữ liệu mẫu phong phú trong LocalStorage (`quanmoc_danh_sach_danh_gia`).
   - Tự động tính toán điểm đánh giá trung bình, số lượng đánh giá, tỷ lệ hài lòng của khách.
   - Bộ lọc số sao linh hoạt kết hợp chế độ cảnh báo đánh giá tiêu cực.
   - Modal phản hồi khách hàng dành riêng cho Quản lý (US-115).
   - Modal mô phỏng khách hàng đánh giá sau bữa ăn (US-111, US-112) cho phép giảng viên/nhóm test thử ngay trên trình duyệt.
   - Modal bảng xếp hạng đánh giá chi tiết theo từng món ăn trong thực đơn (US-116).
2. **`frontend/tepGiaoDien.css`**:
   - Thêm bộ CSS hoàn chỉnh cho phân hệ đánh giá: thẻ tổng quan, thanh tỷ lệ sao trực quan, danh sách card đánh giá, nhãn phản hồi và các modal tương tác.
   - Tối ưu hóa responsive chuẩn mobile/tablet cho toàn bộ hệ thống.
3. **`frontend/index.html`, `frontend/ungDung.js`, `frontend/dinhTuyen/boDieuHuong.js`**:
   - Bổ sung mục điều hướng `⭐ Đánh giá dịch vụ` trên thanh Sidebar (badge `Sprint 4 • Quân`).
   - Điều phối nạp trang SPA và kiểm tra Router Guard phân quyền truy cập.
4. **`vercel.json`**:
   - Cấu hình phân phối nội dung tĩnh và SPA routing chuẩn hóa cho nền tảng Vercel.
5. **`taiLieu/bienBanKiemThuE2E_Sprint4.md`**:
   - Tài liệu biên bản kiểm thử E2E chi tiết, 10 kịch bản test toàn diện đạt 100% PASS.

---

### IV. TỔNG KẾT TOÀN BỘ 4 SPRINT CỦA SINH VIÊN NGUYỄN CHÍ QUÂN
Trải qua 4 tuần làm việc nghiêm túc theo phương pháp Agile/Scrum, sinh viên Nguyễn Chí Quân đã hoàn thành xuất sắc toàn bộ các hạng mục công việc được giao:
- **Sprint 1 (Tuần 1):** Quản lý Khu vực, Bàn ăn, Xuất mã QR Standee, Quản lý Danh mục và Thực đơn nhà hàng (US-023 → US-040) — **18 User Stories**.
- **Sprint 2 (Tuần 2):** Xây dựng Giao diện Gọi món E-Menu di động cho khách hàng tại bàn, giỏ hàng thời gian thực (US-045 → US-062) — **18 User Stories**.
- **Sprint 3 (Tuần 3):** Phân hệ Sơ đồ bàn POS thời gian thực, Vận hành phục vụ, Quầy Thu ngân, Chiết khấu, Voucher, In bill K80 và Thanh toán VietQR Napas 247 (US-089 → US-110) — **22 User Stories**.
- **Sprint 4 (Tuần 4):** Phân hệ Đánh giá & Phản hồi dịch vụ, Thống kê xếp hạng món, Tối ưu Lazy loading & Responsive, Cấu hình Vercel và Kiểm thử E2E (US-111 → US-116, US-135, US-138, US-140) — **9 User Stories**.

👉 **Tổng số User Stories đã hoàn thành độc lập:** **67 User Stories**, đóng góp hoàn thiện toàn bộ diện mạo và trải nghiệm người dùng Frontend của dự án *QUANMOC.COM*.

---

### V. TỰ ĐÁNH GIÁ & ĐỀ XUẤT ĐIỂM
- **Mức độ hoàn thành công việc:** 100% đúng tiến độ, chất lượng mã nguồn cao, tuân thủ nghiêm ngặt quy ước Git và cấu trúc nhóm.
- **Tinh thần hợp tác:** Phối hợp nhịp nhàng, không can thiệp hay gây xung đột với mã nguồn của các thành viên khác trong nhóm (Phong, Minh, Nhật, Phát).
- **Tự đề xuất điểm:** **10/10 (A+)**.
