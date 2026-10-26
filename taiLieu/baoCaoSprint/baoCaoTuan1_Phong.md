# BÁO CÁO TIẾN ĐỘ CÁ NHÂN – TUẦN 1 (SPRINT 1)
**HỌC PHẦN: CÔNG NGHỆ PHẦN MỀM**  
**DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR (QUANMOC.COM)**

---

### I. THÔNG TIN CHUNG
- **Họ và tên sinh viên:** Phong
- **Mã sinh viên:** *(Điền mã sinh viên)*
- **Lớp học phần:** N07 – Trường Đại học CMC
- **Nhóm thực hiện:** Nhóm 1
- **Vai trò trong nhóm:** Frontend Admin & Auth Lead (Phụ trách Khung kiến trúc Admin Layout, Xác thực bảo mật, Quản lý Nhân sự, Phân quyền RBAC, Quản trị nền tảng & Cấu hình hệ thống)
- **Thời gian thực hiện:** Tuần 1 (Sprint 1)
- **Nhánh làm việc Git:** `fe-phong-sprint1` / `fe-admin-core`
- **Tài khoản GitHub:** `@username-phong`

---

### II. MỤC TIÊU CỦA BẢN THÂN TRONG TUẦN 1 (SPRINT 1)
1. **Nghiên cứu & Phân tích yêu cầu:** Nắm vững Product Backlog và Acceptance Criteria của các User Stories được giao trong Sprint 1 (US-003, US-004, US-007 → US-014, US-015 → US-018, US-019 → US-022, US-041 → US-044).
2. **Xây dựng Khung nền tảng & Bảo mật Frontend (US-003, US-004, US-019 → US-021):**
   - Xây dựng Router Guard phía Client: Kiểm soát phiên làm việc, tự động đăng xuất khi hết hạn token (US-003).
   - Chặn truy cập trái phép vào các màn hình quản trị nội bộ nếu chưa đăng nhập (US-004).
   - Phân luồng hiển thị menu Sidebar và kiểm soát quyền truy cập chi tiết theo từng vai trò: Quản lý, Thu ngân, Đầu bếp, Phục vụ (US-019 → US-021).
3. **Xây dựng Giao diện Tài khoản & Xác thực (US-007 → US-010):**
   - Màn hình Đăng nhập (US-007) thiết kế chuẩn nhận diện thương hiệu Quán Mộc, tích hợp sẵn tính năng 1-Click Test cho 5 vai trò kiểm thử.
   - Chức năng Đăng xuất thiết bị an toàn, thu hồi phiên làm việc (US-008).
   - Chức năng Đổi mật khẩu cá nhân có xác thực an toàn và kiểm tra độ dài (US-009).
   - Màn hình xem thông tin tài khoản và cập nhật hồ sơ cá nhân (US-010).
4. **Xây dựng Giao diện Quản lý Nhân sự (US-011 → US-014):**
   - Modal tạo mới tài khoản nhân viên kèm kiểm tra trùng username và email (US-011).
   - Bảng danh sách nhân sự hỗ trợ tìm kiếm tức thì, bộ lọc theo vai trò và trạng thái hoạt động (US-012).
   - Modal cập nhật thông tin và chức năng đặt lại mật khẩu ngẫu nhiên cho nhân viên (US-013).
   - Chức năng Khóa / Mở khóa tài khoản nhân viên nghỉ việc tức thì (US-014).
5. **Xây dựng Giao diện Vai trò & Ma trận Phân quyền RBAC (US-015 → US-018, US-022):**
   - Xem danh sách các vai trò trong nhà hàng kèm số lượng nhân sự tương ứng (US-015).
   - Modal tạo mới và cập nhật mô tả vai trò (US-016).
   - Cấu hình ma trận phân quyền chi tiết (Permission Matrix) với bảng checkbox theo 6 nhóm quyền chức năng (US-018).
   - Bảng ghi nhận và tra cứu lịch sử thay đổi quyền hạn nhân sự (Audit Log - US-022).
6. **Xây dựng Giao diện Quản trị Nền tảng & Cấu hình (US-041 → US-044):**
   - Cấu hình thông tin chung nhà hàng, hotline, địa chỉ và hạ tầng Wi-Fi cho khách (US-041).
   - Cấu hình tỷ lệ thuế VAT và phí dịch vụ mặc định kèm mô phỏng tính bill trực quan (US-042).
   - Cấu hình tài khoản ngân hàng nhận thanh toán VietQR kèm xem trước mã VietQR Napas 247 động (US-043).
   - Bảng tra cứu nhật ký hoạt động an ninh hệ thống (System Logs) (US-044).
7. **Đồng bộ hóa toàn diện với các phân hệ khác:**
   - Tích hợp liền mạch với phân hệ Bàn & Thực đơn của Quân thành một hệ thống SPA hoàn chỉnh mà không chỉnh sửa bất kỳ dòng code nào trong tệp của thành viên khác.

---

### III. KẾT QUẢ CÔNG VIỆC ĐÃ HOÀN THÀNH

#### 1. Bảng tiến độ các User Stories phụ trách (100% Hoàn thành)
| Nhóm tính năng | Mã US | Nội dung công việc | Kết quả bàn giao | Trạng thái |
|---|---|---|---|:---:|
| **Bảo mật & Router Guard** | US-003 | Tự động đăng xuất khi hết hạn phiên làm việc | Quản lý token, kiểm tra thời hạn phiên trong `boDieuHuong.js` | **Hoàn thành** |
| | US-004 | Chặn truy cập trái phép qua Client Guard | Chuyển hướng về Đăng nhập nếu chưa xác thực | **Hoàn thành** |
| | US-019 | Phân quyền tài khoản Đầu bếp (KDS) | Chỉ cho phép truy cập Thực đơn/Bếp, ẩn module nhạy cảm | **Hoàn thành** |
| | US-020 | Phân quyền tài khoản Thu ngân (POS) | Cho phép xem sơ đồ bàn, thanh toán hóa đơn | **Hoàn thành** |
| | US-021 | Phân quyền Quản trị tối cao (Chủ quán) | Toàn quyền truy cập Nhân sự, Phân quyền, Cấu hình | **Hoàn thành** |
| **Xác thực & Hồ sơ** | US-007 | Giao diện Đăng nhập hệ thống | Form đăng nhập + Nút 1-Click Test cho 5 vai trò | **Hoàn thành** |
| | US-008 | Chức năng Đăng xuất an toàn | Xóa Token, Session, ghi log và điều hướng | **Hoàn thành** |
| | US-009 | Giao diện Đổi mật khẩu cá nhân | Kiểm tra độ dài, trùng khớp và cập nhật mật khẩu | **Hoàn thành** |
| | US-010 | Xem và cập nhật hồ sơ cá nhân | Thẻ thông tin tài khoản + Form sửa thông tin liên hệ | **Hoàn thành** |
| **Quản lý Nhân sự** | US-011 | Modal tạo mới tài khoản nhân viên | Form thêm nhân viên, chọn vai trò, mật khẩu ban đầu | **Hoàn thành** |
| | US-012 | Xem danh sách và tìm kiếm nhân sự | Bảng hiển thị, lọc theo vai trò, trạng thái, tìm kiếm tức thì | **Hoàn thành** |
| | US-013 | Cập nhật thông tin & Đặt lại mật khẩu | Modal sửa nhân viên + Modal sinh mật khẩu ngẫu nhiên | **Hoàn thành** |
| | US-014 | Khóa / Mở khóa tài khoản nhân viên | Nút khóa nhanh, đổi trạng thái, chặn đăng nhập | **Hoàn thành** |
| **Vai trò & Phân quyền** | US-015 | Xem danh sách các vai trò trong quán | Thẻ trực quan Quản lý, Thu ngân, Bếp, Phục vụ | **Hoàn thành** |
| | US-016 | Tạo mới hoặc sửa mô tả vai trò | Modal thêm vai trò mới có mã định danh | **Hoàn thành** |
| | US-017 | Gán vai trò cho từng nhân viên | Tích hợp trong form tạo/sửa nhân viên | **Hoàn thành** |
| | US-018 | Cấu hình ma trận quyền hạn (RBAC) | Bảng tích chọn checkbox theo 6 nhóm quyền chức năng | **Hoàn thành** |
| | US-022 | Ghi nhận lịch sử phân quyền (Audit Log) | Tự động ghi vết và bảng tra cứu lịch sử thay đổi quyền | **Hoàn thành** |
| **Quản trị nền tảng** | US-041 | Cấu hình thông tin nhà hàng & Wi-Fi | Form lưu thông tin quán, hotline, Wi-Fi khách | **Hoàn thành** |
| | US-042 | Cấu hình thuế VAT & Phí phục vụ | Form cấu hình %, ví dụ minh họa tính bill trực quan | **Hoàn thành** |
| | US-043 | Cấu hình tài khoản VietQR Napas | Chọn ngân hàng, STK, cú pháp + Xem trước mã VietQR | **Hoàn thành** |
| | US-044 | Bảng tra cứu System Logs | Bộ lọc mức độ (Info, Warn, Error) & tìm kiếm hành vi | **Hoàn thành** |

#### 2. Các sản phẩm kỹ thuật bàn giao trong mã nguồn (`frontend/`)
- `frontend/dinhTuyen/boDieuHuong.js`: Module Router & Auth Guard điều phối phân quyền RBAC và quản lý phiên làm việc.
- `frontend/trang/dangNhap/dangNhap.js`: Giao diện Đăng nhập kèm bộ nút chuyển nhanh vai trò kiểm thử 1-Click.
- `frontend/trang/taiKhoan/hoSoCaNhan.js`: Giao diện xem/sửa hồ sơ nhân viên và đổi mật khẩu an toàn.
- `frontend/trang/nhanVien/quanLyNhanVien.js`: Quản lý danh sách nhân sự, tìm kiếm, lọc vai trò, thêm/sửa, khóa tài khoản.
- `frontend/trang/nhanVien/phanQuyen.js`: Quản lý danh sách vai trò, bảng ma trận phân quyền RBAC, nhật ký lịch sử phân quyền.
- `frontend/trang/quanTri/cauHinhHeThong.js`: 4 tab cấu hình thông tin quán, thuế VAT, tài khoản VietQR Napas và tra cứu System Logs.
- `frontend/dungChung/hangSo.js` & `dungChung/api.js`: Bộ hằng số, cơ sở dữ liệu mẫu ngoại tuyến (Seed Data), tầng dịch vụ API Auth/Nhân sự/Cấu hình.
- `frontend/tepGiaoDien.css`: Mở rộng hệ thống CSS cho bảng dữ liệu, form đăng nhập, thẻ hồ sơ, ma trận quyền và Header.
- `frontend/index.html` & `frontend/ungDung.js`: Bố cục Sidebar thống nhất, nạp toàn bộ các phân hệ và đồng bộ thông tin thương hiệu.

#### 3. Cơ chế đồng bộ hóa toàn diện giữa các phân hệ (Không chỉnh sửa file của người khác)
- **Đồng bộ thông tin thương hiệu toàn cục:** Khi Phong cập nhật thông tin nhà hàng, Hotline, Wi-Fi trong `cauHinhHeThong.js`, hàm `dongBoThongTinNhaHangToanCuc()` trong `ungDung.js` lập tức đồng bộ sang Header, Sidebar, Tiêu đề trang và đối tượng `HANG_SO.NHA_HANG_MAC_DINH` mà mã nguồn Standee của Quân đang sử dụng.
- **Đồng bộ bảo mật RBAC với các chức năng của Quân:** Tích hợp thanh đổi vai trò nhanh (Quick Role Switcher) trên Header (`👑 Quản lý`, `💵 Thu ngân`, `👨‍🍳 Bếp`, `🏃 Phục vụ`). Khi bấm đổi vai trò, Router Guard tự động điều hướng và phân quyền chuẩn xác đến màn hình Bàn & QR hoặc Thực đơn của Quân.
- **Đồng bộ vết kiểm toán tự động (Automatic Audit Logging):** Lớp `ApiService` trong `api.js` tự động ghi vết mọi hành động lưu bàn ăn, khu vực và món ăn của Quân vào Nhật ký hệ thống (System Logs) của Phong mà không cần can thiệp một dòng code nào vào tệp `quanLyBanQr.js` hay `quanLyThucDon.js` của Quân.
- **Bảo toàn tính toàn vẹn 100%:** Các tệp của Quân (`quanLyBanQr.js` - 29.633 bytes, `quanLyThucDon.js` - 36.149 bytes) được giữ nguyên vẹn tuyệt đối.

---

### IV. KHÓ KHĂN GẶP PHẢI VÀ BIỆN PHÁP XỬ LÝ
1. **Bài toán kiểm soát truy cập phân quyền phía Client (Client-side RBAC Guard):**
   - *Khó khăn:* Ứng dụng hoạt động theo kiến trúc Single Page Application (SPA), nếu chỉ ẩn nút trên giao diện thì người dùng am hiểu kỹ thuật vẫn có thể gọi hàm chuyển tab qua console.
   - *Giải pháp:* Xây dựng lớp `BoDieuHuong` với phương thức `kiemTraQuyenTruyCapTab(tab)` đóng vai trò là chốt chặn bảo mật (Guard). Mọi yêu cầu chuyển trang đều phải đi qua chốt chặn này; nếu tài khoản không đủ quyền (ví dụ: Đầu bếp cố vào trang Quản lý nhân sự) thì hệ thống lập tức chặn lại, thông báo Toast cảnh báo và tự động điều hướng về màn hình hợp lệ.
2. **Đồng bộ dữ liệu đa phân hệ mà không được sửa code của thành viên khác:**
   - *Khó khăn:* Phân hệ Quản lý Bàn và Thực đơn do bạn Quân xây dựng độc lập từ trước. Cần làm sao để khi Phong cập nhật thông tin quán (Wi-Fi, Hotline, tên chi nhánh) thì giao diện và Standee của Quân tự động nhận diện mà không được sửa code của bạn.
   - *Giải pháp:* Sử dụng mô hình cầu nối tại tầng dùng chung (`api.js` và `ungDung.js`). Khi lưu cấu hình, hệ thống đồng thời cập nhật cả khóa lưu trữ `quanmoc_cau_hinh_he_thong` và `quanmoc_cau_hinh_quan` (khóa bạn Quân dùng), đồng thời cập nhật đè vào `HANG_SO.NHA_HANG_MAC_DINH` trong bộ nhớ runtime. Nhờ vậy, hai phân hệ tự động ăn khớp 100%.
3. **Ghi nhận lịch sử kiểm toán (Audit Log) cho các hành vi toàn hệ thống:**
   - *Khó khăn:* Cần ghi nhận mọi thao tác nhạy cảm (thay đổi giá, đổi trạng thái bàn, khóa nhân viên) vào System Logs để phục vụ yêu cầu kiểm toán an ninh US-044.
   - *Giải pháp:* Tích hợp cơ chế tự động ghi log vào các hàm xử lý dữ liệu chung trong `api.js`. Mỗi khi bất kỳ module nào gọi cập nhật dữ liệu, một bản ghi nhật ký chuẩn sẽ được tự động sinh kèm thời gian, địa chỉ IP giả lập và tên tài khoản đang thao tác.
4. **Xử lý xung đột mã nguồn và giải pháp hợp nhất (Merge Strategy) với bạn Quân:**
   - *Khó khăn / Tình huống xung đột:* Trong quá trình phát triển song song Sprint 1, cả Phong và Quân đều tạo và chỉnh sửa trên các tệp khung dùng chung (`index.html`, `ungDung.js`, `tepGiaoDien.css`, `dungChung/api.js`). Bạn Quân phát triển cơ chế chịu lỗi ngoại tuyến (LocalStorage fallback 200ms) và bộ tạo mã QR SVG thuần JavaScript. Trong khi đó, Phong phát triển khung Admin Layout, cơ chế điều hướng Route Guard bảo mật phía Client, ma trận phân quyền RBAC và hệ thống kiểm toán tự động. Nếu không xử lý cẩn thận, mã nguồn sẽ bị ghi đè gây mất mát tính năng.
   - *Giải pháp & Thống nhất giải trình:*
     + *Về khung giao diện và điều hướng:* Thống nhất sử dụng khung Admin Layout của Phong làm bố cục chuẩn, phân chia cấu trúc Sidebar thành hai nhóm nghiệp vụ trực quan ("VẬN HÀNH NHÀ HÀNG - Quân" và "QUẢN TRỊ & HỆ THỐNG - Phong"), kết hợp thanh Quick Role Switcher trên Header cho phép Giảng viên kiểm thử chuyển đổi nhanh giữa các vai trò (Quản lý, Thu ngân, Bếp, Phục vụ) để chứng minh tính năng bảo mật Route Guard.
     + *Về tầng API dùng chung:* Tích hợp toàn bộ hàm sinh mã QR SVG offline và cơ chế timeout 200ms của Quân cùng với các API Đăng nhập, Hồ sơ, Nhân viên, Phân quyền RBAC, Cấu hình hệ thống và Ghi log kiểm toán của Phong vào chung một tệp `dungChung/api.js` duy nhất, chuẩn hóa đầu ra `{ok, data, msg}`.
     + *Bảo toàn mã nguồn độc lập:* Giữ nguyên vẹn 100% hai tệp chức năng nghiệp vụ của Quân (`quanLyBanQr.js` - 29.633 bytes và `quanLyThucDon.js` - 36.149 bytes), đảm bảo không xảy ra bất kỳ xung đột logic nào.


---

### V. BÀI HỌC KINH NGHIỆM & KHAI THÁC AI CÓ TRÁCH NHIỆM
- **Kỹ năng chuyên môn:** Nắm vững kiến trúc ứng dụng SPA dạng module hóa, cơ chế bảo mật xác thực Token/Session phía Client, mô hình phân quyền dựa trên vai trò (Role-Based Access Control - RBAC), kỹ thuật thiết kế biểu mẫu và bảng dữ liệu chuyên nghiệp.
- **Kỹ năng làm việc nhóm & Tích hợp:** Hiểu sâu sắc về nguyên tắc "Open/Closed Principle" trong công nghệ phần mềm: mở rộng tính năng mới thông qua các tầng trung gian (Adapter/Middleware) mà không sửa đổi hoặc làm ảnh hưởng đến mã nguồn ổn định sẵn có của đồng đội.
- **Khai thác công cụ AI:** Sử dụng AI hỗ trợ sinh khung mã nguồn ban đầu, tối ưu cú pháp JavaScript và rà soát lỗi giao diện. Luôn chủ động kiểm tra từng luồng logic nghiệp vụ, đối chiếu với đặc tả User Story và đảm bảo tuân thủ nghiêm ngặt quy tắc đặt tên camelCase/snake_case của nhóm.

---

### VI. KẾ HOẠCH CHO TUẦN 2 (SPRINT 2)
1. **Giao diện Đặt món & Tạo đơn (US-063 → US-066):** Xây dựng luồng bấm gửi Order từ giỏ hàng bàn khách, hiệu ứng đặt món thành công và tạo mã đơn hàng.
2. **Theo dõi tiến độ đơn hàng thời gian thực (US-067 → US-070):** Trang "Món đã gọi" hiển thị các lượt gọi món trong phiên bàn, trạng thái từng món (Chờ duyệt, Đang nấu, Đã phục vụ), tổng tiền lũy kế và nút hủy món khi chưa chế biến.
3. **Tương tác hỗ trợ tại bàn (US-071 → US-074):** Giao diện gửi yêu cầu "Gọi phục vụ" (thêm đá, khăn giấy, bát đũa) và "Yêu cầu thanh toán" từ điện thoại của khách về màn hình điều hành.
4. **Tích hợp WebSockets / Socket.io Client (US-075 → US-078):** Phối hợp với bạn Nhật (Backend) để kết nối kênh Socket thời gian thực, đồng bộ tức thời giữa điện thoại khách, màn hình Bếp và quầy Thu ngân.

---

### VII. TỰ ĐÁNH GIÁ MỨC ĐỘ HOÀN THÀNH
- **Khối lượng công việc hoàn thành:** 100% mục tiêu Sprint 1 (22/22 User Stories được giao).
- **Chất lượng sản phẩm:** Chạy ổn định, giao diện hoàn thiện, bảo mật vững chắc, tích hợp mượt mà với phần của bạn Quân.
- **Đánh giá cá nhân:** Hoàn thành xuất sắc nhiệm vụ được giao (**Mức A**).

---
*Hà Nội, ngày 21 tháng 10 năm 2026*  
**Người làm báo cáo**  
*(Ký và ghi rõ họ tên)*  
**Phong**
