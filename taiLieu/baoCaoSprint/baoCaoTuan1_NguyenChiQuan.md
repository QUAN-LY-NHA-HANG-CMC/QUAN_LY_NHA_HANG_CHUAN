# BÁO CÁO TIẾN ĐỘ CÁ NHÂN – TUẦN 1 (SPRINT 1)
**HỌC PHẦN: CÔNG NGHỆ PHẦN MỀM**  
**DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR (QUANMOC.COM)**

---

### I. THÔNG TIN CHUNG
- **Họ và tên sinh viên:** Nguyễn Chí Quân
- **Mã sinh viên:** *(Điền mã sinh viên)*
- **Lớp học phần:** N07 – Trường Đại học CMC
- **Nhóm thực hiện:** Nhóm 1
- **Vai trò trong nhóm:** Frontend Developer (Phụ trách phân hệ Quản lý Bàn, Mã QR, Thực đơn món ăn, Web E-Menu khách hàng và POS Thu ngân)
- **Thời gian thực hiện:** Tuần 1 (Sprint 1)
- **Nhánh làm việc Git:** `fe-quan-sprint1`
- **Tài khoản GitHub:** `nguyenchiquan417-ui` (https://github.com/nguyenchiquan417-ui)

---

### II. MỤC TIÊU CỦA BẢN THÂN TRONG TUẦN 1
1. **Nghiên cứu & Phân tích:** Nắm vững Product Backlog và Acceptance Criteria của 18 User Stories được giao (từ US-023 đến US-040).
2. **Xây dựng giao diện Quản lý Khu vực & Bàn ăn (US-023 → US-030):**
   - CRUD khu vực/tầng phục vụ và danh sách bàn ăn.
   - Tự động sinh mã QR cho từng bàn, thiết kế modal Standee để bàn thương hiệu Quán Mộc.
   - Xây dựng tính năng in hàng loạt mã QR theo khu vực chuẩn khổ giấy in ấn (CSS Print).
   - Chức năng làm mới token bảo mật cho mã QR bàn.
3. **Xây dựng giao diện Quản lý Danh mục & Thực đơn (US-031 → US-040):**
   - CRUD danh mục thực đơn và món ăn (phân trang, lọc theo danh mục/giá/trạng thái, tìm kiếm tức thì).
   - Thiết lập tùy chọn nâng cao cho món ăn (Size S/M/L kèm giá, nhóm Topping, tùy chỉnh Cay/Đá/Đường).
   - Nút gạt chuyển nhanh trạng thái Đang bán / Tạm hết; gắn nhãn Món bán chạy (Best Seller); xóa mềm món ăn.
4. **Đảm bảo khả dụng và độ tin cậy (Non-Functional Requirements):**
   - Tự xây dựng bộ sinh mã QR SVG thuần Client (100% offline, không phụ thuộc API mạng bên ngoài).
   - Xây dựng cơ chế Fast Offline Fallback (timeout 200ms) để hệ thống luôn phản hồi tức thì < 50ms, không bao giờ bị treo quay tròn khi Backend chưa bật.

---

### III. KẾT QUẢ CÔNG VIỆC ĐÃ HOÀN THÀNH

#### 1. Bảng tiến độ 18 User Stories phụ trách (18/18 US đạt 100%)
| Nhóm chức năng | Mã US | Nội dung công việc | Kết quả bàn giao | Trạng thái |
|---|---|---|---|:---:|
| **Khu vực & Bàn ăn** | US-023 | Giao diện CRUD khu vực / tầng | Modal thêm/sửa, danh sách khu vực | **Hoàn thành** |
| | US-024 | Hiển thị bàn ăn lọc theo từng khu vực | Tab lọc khu vực, bảng hiển thị trực quan | **Hoàn thành** |
| | US-025 | Form thêm bàn mới (mã, tên, sức chứa) | Modal thêm bàn có kiểm tra dữ liệu | **Hoàn thành** |
| | US-026 | Cập nhật thông tin bàn / tạm ngừng sử dụng | Modal chỉnh sửa, đổi trạng thái bàn | **Hoàn thành** |
| | US-027 | Xóa bàn ăn | Hộp thoại xác nhận an toàn | **Hoàn thành** |
| | US-028 | Sinh mã QR và URL định danh bàn | Tự động vẽ mã QR SVG tức thì | **Hoàn thành** |
| | US-029 | Xem Standee và in hàng loạt QR theo khu vực | Modal Standee đẹp + CSS Print in ấn chuẩn | **Hoàn thành** |
| | US-030 | Làm mới (refresh) token bảo mật QR | Nút đổi token cập nhật mã QR ngay | **Hoàn thành** |
| **Danh mục & Thực đơn** | US-031 | Giao diện tạo mới danh mục | Modal thêm danh mục món | **Hoàn thành** |
| | US-032 | Sửa tên, thứ tự và xóa danh mục | Thao tác cập nhật/xóa danh mục | **Hoàn thành** |
| | US-033 | Danh sách món ăn: tìm kiếm, lọc, phân trang | Tìm kiếm tức thì, lọc đa tiêu chí, phân trang | **Hoàn thành** |
| | US-034 | Form thêm món mới (giá, đơn vị tính, mô tả) | Form thêm món có xác thực đầu vào | **Hoàn thành** |
| | US-035 | Tải ảnh món ăn / ảnh mặc định SVG | Hỗ trợ chọn ảnh từ máy & ảnh SVG offline | **Hoàn thành** |
| | US-036 | Cập nhật chi tiết món và đổi giá bán | Form chỉnh sửa món và cập nhật giá | **Hoàn thành** |
| | US-037 | Cấu hình tùy chọn món (Size, Topping, Vị) | Giao diện thêm nhóm Size, Topping, Cay/Đá | **Hoàn thành** |
| | US-038 | Nút gạt bật/tắt nhanh Đang bán / Tạm hết | Switch toggle đổi trạng thái tức thì | **Hoàn thành** |
| | US-039 | Bật/tắt nhãn “Món bán chạy” | Nút gắn huy hiệu Best Seller nổi bật | **Hoàn thành** |
| | US-040 | Xóa mềm (ẩn) món ăn khỏi thực đơn | Ẩn món khỏi menu, bảo lưu lịch sử | **Hoàn thành** |

#### 2. Các sản phẩm kỹ thuật bàn giao trong mã nguồn (`frontend/`)
- `frontend/index.html` & `ungDung.js`: Cấu trúc Single Page Application (SPA), thanh điều hướng Sidebar, hiển thị trạng thái mạng Online/Offline.
- `frontend/tepGiaoDien.css`: 27KB giao diện phong cách "Quán Mộc" mộc mạc ấm cúng; định nghĩa bộ `@media print` dàn trang in Standee QR cực đẹp.
- `frontend/dungChung/taoQrClient.js`: Thuật toán sinh mã QR SVG thuần Client **100% offline**, không cần gọi API mạng ngoài.
- `frontend/dungChung/api.js`: Lớp API kết nối Backend của bạn Minh, tích hợp cơ chế `AbortController` phát hiện offline 200ms và fallback LocalStorage an toàn.
- `frontend/trang/quanLyBanQr/quanLyBanQr.js`: Toàn bộ xử lý giao diện Sơ đồ bàn, tạo Standee và in ấn QR.
- `frontend/trang/quanLyThucDon/quanLyThucDon.js`: Toàn bộ xử lý giao diện Danh mục & Thực đơn món ăn.

---

### IV. KHÓ KHĂN GẶP PHẢI VÀ BIỆN PHÁP XỬ LÝ
1. **Lỗi tải trang bị treo lâu ("load mãi không xong"):**
   - *Nguyên nhân:* Lúc đầu mã nguồn gọi API `api.quickchart.io` qua mạng để sinh mã QR, kết hợp với lệnh `fetch()` không cài đặt timeout khiến trang web chờ đến 30 giây khi mạng chập chờn hoặc Backend chưa bật.
   - *Giải pháp:* Tự viết thuật toán tạo ma trận QR mã hóa dạng SVG vector trực tiếp trong trình duyệt (`taoQrClient.js`); bổ sung kiểm tra timeout 200ms bằng `AbortController` trong `api.js` để lập tức chuyển sang chế độ LocalStorage dự phòng.
2. **Bài toán in ấn Standee đặt trên bàn nhà hàng:**
   - *Nguyên nhân:* Khi in qua trình duyệt, các thanh menu và nút bấm giao diện bị dính vào bản in.
   - *Giải pháp:* Thiết lập CSS `@media print`, tự động ẩn toàn bộ Sidebar/Header khi bấm lệnh in (Ctrl+P), chỉ giữ lại khung Standee với kích thước chuẩn, viền trang trí và logo Quán Mộc sắc nét.
3. **Quy trình cộng tác trên GitHub:**
   - *Tình huống:* Chưa có quyền ghi trực tiếp vào repo chính của nhóm dẫn đến lỗi `403 Permission Denied`.
   - *Giải pháp:* Áp dụng đúng quy trình phát triển chuyên nghiệp: Fork repo về tài khoản cá nhân `nguyenchiquan417-ui`, tạo nhánh `fe-quan-sprint1`, commit đầy đủ và gửi Pull Request về nhánh `main` cho trưởng nhóm duyệt.
4. **Xử lý xung đột mã nguồn và giải pháp hợp nhất (Merge Strategy) với bạn Phong:**
   - *Khó khăn / Tình huống:* Trong quá trình làm việc song song, cả Quân và Phong đều phát triển trên các tệp dùng chung (`index.html`, `ungDung.js`, `tepGiaoDien.css`, `api.js`). Quân tập trung vào cơ chế LocalStorage chịu lỗi và tạo QR offline, còn Phong phát triển Admin Layout, Route Guard và dữ liệu xác thực RBAC.
   - *Giải pháp & Thống nhất giải trình:*
     + *Về giao diện & điều hướng:* Hai bạn thống nhất sử dụng khung Admin Layout của Phong làm khung tổng thể, đưa các phân hệ Sơ đồ bàn & Thực đơn của Quân vào nhóm menu "VẬN HÀNH NHÀ HÀNG", kết hợp thanh chuyển nhanh vai trò trên Header.
     + *Về tầng API dùng chung:* Gộp chung mã nguồn vào tệp `frontend/dungChung/api.js`, tích hợp thuật toán sinh QR SVG offline và timeout 200ms của Quân với toàn bộ API phân quyền/nhân sự của Phong, đảm bảo hệ thống vừa bảo mật vừa chạy mượt mà ngay cả khi không có kết nối mạng.
     + *Bảo toàn mã nguồn:* Hai tệp nghiệp vụ chính của Quân (`quanLyBanQr.js` và `quanLyThucDon.js`) được giữ nguyên vẹn 100%, không bị xáo trộn logic.


---

### V. BÀI HỌC KINH NGHIỆM & KHAI THÁC AI CÓ TRÁCH NHIỆM
- **Kỹ năng chuyên môn:** Nâng cao tư duy xây dựng ứng dụng Web SPA theo module rõ ràng, xử lý dữ liệu Client-side linh hoạt, thiết kế Responsive và tối ưu hóa CSS Print.
- **Khai thác công cụ AI:** Sử dụng AI làm trợ lý gợi ý khung cấu trúc và giải pháp thuật toán. Tuy nhiên, bản thân em luôn chủ động đọc hiểu từng dòng code, kiểm chứng thực tế và tái cấu trúc lại (như việc kiên quyết chuyển sang thuật toán sinh QR offline để tránh phụ thuộc bên thứ ba).

---

### VI. KẾ HOẠCH CHO TUẦN 2 (SPRINT 2)
1. **Giao diện Quét QR & Nhận diện bàn (US-045 → US-049):** Màn hình chào mừng khách vào bàn, hiển thị số bàn, kiểm tra tính hợp lệ của mã QR.
2. **Giao diện Duyệt E-Menu trên điện thoại (US-050 → US-056):** Thiết kế Mobile-first tối ưu trải nghiệm chạm vuốt, thanh cuộn danh mục ngang, danh sách món bán chạy, tìm kiếm và xem chi tiết món ăn; tự động làm mờ và khóa các món đang "Tạm hết".
3. **Giao diện Giỏ hàng & Tùy biến (US-057 → US-062):** Modal chọn Size, chọn Topping, nhập ghi chú khẩu vị (ít cay, không đá...) và tự động tính tổng tiền tạm tính.

---

### VII. TỰ ĐÁNH GIÁ MỨC ĐỘ HOÀN THÀNH
- **Khối lượng công việc hoàn thành:** 100% mục tiêu Sprint 1 (18/18 User Stories).
- **Chất lượng sản phẩm:** Chạy ổn định, giao diện hoàn thiện, code sạch sẽ, có giải pháp chịu lỗi offline.
- **Đánh giá cá nhân:** Hoàn thành xuất sắc nhiệm vụ được giao (**Mức A**).

---
*Hà Nội, ngày 21 tháng 10 năm 2026*  
**Người làm báo cáo**  
*(Ký và ghi rõ họ tên)*  
**Nguyễn Chí Quân**
