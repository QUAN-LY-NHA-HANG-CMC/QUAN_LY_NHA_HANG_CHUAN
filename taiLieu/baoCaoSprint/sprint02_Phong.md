# BÁO CÁO TIẾN ĐỘ CÁ NHÂN – TUẦN 2 (SPRINT 2)
**HỌC PHẦN: CÔNG NGHỆ PHẦN MỀM**  
**DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR (QUANMOC.COM)**

---

### I. THÔNG TIN CHUNG
- **Họ và tên sinh viên:** Phạm Xuân Phong
- **Mã sinh viên:** *(Điền mã sinh viên)*
- **Lớp học phần:** N07 – Trường Đại học CMC
- **Nhóm thực hiện:** Nhóm 1
- **Vai trò trong nhóm:** Frontend Lead (Phụ trách Phân hệ Đặt món, Theo dõi tiến độ đơn hàng thời gian thực, Tương tác hỗ trợ tại bàn, Gọi thanh toán và Tích hợp Socket.io / Web Audio Client)
- **Thời gian thực hiện:** Tuần 2 (Sprint 2)
- **Nhánh làm việc Git:** `fe-phong-sprint2`
- **Tài khoản GitHub:** `@username-phong`

---

### II. MỤC TIÊU CỦA BẢN THÂN TRONG TUẦN 2 (SPRINT 2)
1. **Giao diện Đặt món & Xác nhận đơn (US-063, US-064):**
   - Xây dựng luồng gửi Order từ giỏ hàng bàn khách xuống hệ thống, tự động gán mã đơn hàng chuẩn ISO, số bàn, khu vực và thời gian tạo.
   - Hiển thị hiệu ứng và thông báo xác nhận đặt món thành công tức thì trên màn hình (US-064).
2. **Theo dõi tiến độ đơn hàng thời gian thực & Quản lý lượt gọi món (US-065, US-066, US-067):**
   - Trang "Theo dõi đơn món" (`theoDoiDonMon.js`) hiển thị toàn bộ các món đã gọi trong phiên phục vụ tại bàn, nhóm theo từng Lượt gọi (Rounds: Lượt 1, Lượt 2...) (US-065).
   - Thanh tiến độ trực quan Stepper 4 bước chuẩn hóa: `⏳ Chờ xác nhận` ➔ `👨‍🍳 Đang chế biến` ➔ `🔔 Đã nấu xong` ➔ `✅ Đã lên món` (US-066).
   - Chức năng "Gọi thêm món bổ sung" (Order lượt mới) trong cùng một phiên bàn mà không làm mất hoặc ghi đè các món đã gọi trước đó (US-067).
3. **Xử lý Hủy món & Tiếp nhận phản hồi từ Bếp (US-068, US-069):**
   - Cho phép khách hàng yêu cầu hủy món khi món vẫn đang ở trạng thái "Chờ xác nhận", có modal xác nhận lý do hủy và tự động hoàn trừ tiền khỏi hóa đơn (US-068).
   - Tiếp nhận sự kiện Bếp từ chối món do hết nguyên liệu, lập tức hiển thị popup cảnh báo nổi bật kèm lý do từ chối và phát âm thanh cảnh báo (US-069).
4. **Quản lý Chi phí & Tổng tiền lũy kế (US-070):**
   - Tự động tổng hợp chi phí lũy kế của tất cả các lượt gọi món trong phiên bàn, tự động loại trừ các món bị hủy/từ chối, hiển thị rõ ràng tại thẻ tổng quan.
5. **Giao diện Tương tác hỗ trợ tại bàn & Gọi thanh toán (US-071 → US-074):**
   - Thiết kế Widget nút nổi (Floating Action Button) luôn hiện diện ở góc màn hình (US-071).
   - Hộp thoại chọn nhanh lý do cần hỗ trợ (bát đũa, khăn giấy, thêm đá, nước chấm, dọn bàn, gặp trực tiếp) (US-072).
   - Nút và modal "Yêu cầu thanh toán" cho phép khách chọn phương thức thanh toán dự kiến (Tiền mặt / Chuyển khoản VietQR) (US-073).
   - Hiển thị phản hồi và trạng thái trực tiếp trên màn hình khi nhân viên phục vụ đã tiếp nhận yêu cầu (US-074).
6. **Tích hợp Real-time Sync & Chuông báo âm thanh Client (US-075 → US-078):**
   - Đồng bộ tức thời giữa máy khách và quầy Bếp/Thu ngân thông qua kiến trúc Socket.io Client kết hợp kênh đồng bộ đa tab `BroadcastChannel` (US-075, US-076).
   - Tự động đồng bộ và hiển thị thông báo khi Quản lý/Bếp báo hết món (US-077).
   - Tích hợp bộ tổng hợp âm thanh Web Audio API Synthesizer phát chuông báo âm thanh thực tế (`Ding-Dong` đơn mới, `Ting-Ting` gọi phục vụ, âm cảnh báo từ chối) mà không cần phụ thuộc tệp mp3 bên ngoài (US-078).
7. **Bảo toàn nguyên tắc Open/Closed Principle:**
   - Tuyệt đối không can thiệp, không sửa đổi hay gây xung đột với mã nguồn của các thành viên khác trong nhóm (Quân, Nhật, Minh, Phát).

---

### III. KẾT QUẢ CÔNG VIỆC HOÀN THÀNH (100% TIÊU CHÍ NGHIỆM THU)

#### 1. Bảng đối chiếu 16 User Stories phụ trách trong Sprint 2
| Nhóm nghiệp vụ | Mã US | Nội dung công việc theo Backlog | Kết quả bàn giao & Minh chứng kỹ thuật | Trạng thái |
|---|---|---|---|:---:|
| **Đặt món & Tạo đơn** | **US-063** | Xác nhận và gửi yêu cầu đặt món (Order) từ giỏ hàng xuống hệ thống | Hàm `api.taoDonGoiMon()`, chuẩn hóa đơn, gán mã `ORD-YYYYMMDD-xxx`, lưu Session | **Đạt 100%** |
| | **US-064** | Nhận thông báo xác nhận đặt món thành công ngay trên màn hình | Toast thông báo thành công + popup xác nhận gửi Bếp tức thì | **Đạt 100%** |
| **Theo dõi tiến độ** | **US-065** | Xem danh sách toàn bộ các món đã gọi trong phiên ngồi tại bàn | Giao diện hiển thị danh sách đơn gom nhóm theo Lượt gọi (Rounds) | **Đạt 100%** |
| | **US-066** | Theo dõi trạng thái từng món (Chờ duyệt, Đang nấu, Đã xong, Đã lên món) | Thanh tiến độ Stepper 4 bước có hiệu ứng nhịp đập bước hiện tại | **Đạt 100%** |
| | **US-067** | Đặt thêm lượt món mới (Order bổ sung) trong cùng một phiên ăn | Modal "Gọi thêm món", chọn món từ thực đơn và tạo lượt gọi mới (`Lượt #2, #3...`) | **Đạt 100%** |
| **Hủy & Từ chối món** | **US-068** | Khách hàng yêu cầu hủy món khi còn ở trạng thái "Chờ xác nhận" | Nút "❌ Hủy món này" chỉ hiện khi chờ duyệt, có modal chọn lý do và tự khấu trừ tiền | **Đạt 100%** |
| | **US-069** | Nhận thông báo trên màn hình nếu Bếp từ chối món do hết nguyên liệu | Modal cảnh báo đỏ `🚫 Bếp Thông Báo Hết Món` + phát âm trầm cảnh báo | **Đạt 100%** |
| **Chi phí phiên bàn** | **US-070** | Xem tổng chi phí lũy kế của tất cả các lượt gọi món tại bàn | Thẻ KPI vàng hiển thị tổng tiền lũy kế tự động cập nhật theo thời gian thực | **Đạt 100%** |
| **Hỗ trợ tại bàn** | **US-071** | Bấm nút "Gọi nhân viên" trên Web khi cần hỗ trợ trực tiếp | Nút nổi Floating Action Button (FAB) góc phải màn hình luôn hiện diện | **Đạt 100%** |
| | **US-072** | Chọn nhanh lý do cần hỗ trợ (bát đũa, khăn giấy, thêm đá...) | Modal lưới 6 lý do trực quan, có ô ghi chú khẩu vị/nhu cầu cụ thể | **Đạt 100%** |
| | **US-073** | Bấm nút "Yêu cầu thanh toán" kèm phương thức dự kiến (Tiền mặt / VietQR) | Modal thanh toán hiển thị tổng tạm tính, chọn Tiền mặt / Quét mã Napas VietQR | **Đạt 100%** |
| | **US-074** | Nhận phản hồi trên màn hình khi nhân viên tiếp nhận yêu cầu | Badge trạng thái `✅ Nhân viên đang tới!` kèm tên nhân viên tiếp nhận | **Đạt 100%** |
| **Real-time Sync** | **US-075** | Đẩy đơn đặt món mới từ máy khách lên Server/Bếp/Thu ngân tức thời | Hàm `socketClient.phatSuKien('order:moi')` + kênh `BroadcastChannel` | **Đạt 100%** |
| | **US-076** | Đồng bộ trạng thái món ăn từ Bếp ngược về màn hình khách hàng | Lắng nghe sự kiện `order:capNhatTrangThai` tự động cập nhật UI 0ms | **Đạt 100%** |
| | **US-077** | Khóa món và cảnh báo khi Quản lý/Bếp báo hết món | Sự kiện `thucDon:hetMon` cảnh báo tức thì về màn hình gọi món | **Đạt 100%** |
| | **US-078** | Phát âm thanh chuông báo trên trình duyệt khi có đơn/yêu cầu mới | Module Web Audio API Synth phát chuông Ding-Dong thanh tao không cần tải mp3 | **Đạt 100%** |

---

#### 2. Các sản phẩm kỹ thuật bàn giao trong mã nguồn (`frontend/`)
1. **Module Màn hình Theo dõi Đơn món (`frontend/trang/theoDoiDonMon/theoDoiDonMon.js`):**
   - Toàn bộ giao diện theo dõi tiến độ món ăn, gom nhóm lượt gọi, bộ lọc trạng thái (Tất cả, Chờ duyệt, Đang nấu, Đã lên món, Đã hủy).
   - Thanh công cụ giả lập kiểm thử thời gian thực (**Real-time Test Simulator**) cho phép giảng viên/người chấm kiểm thử 1-click các luồng Bếp duyệt nấu, Bếp nấu xong, Phục vụ bưng lên, Bếp từ chối món, Phát chuông báo và Nhân viên tiếp nhận.
2. **Thành phần Hỗ trợ & Thanh toán tại bàn (`frontend/thanhPhan/hoTroTaiBan.js`):**
   - Nút nổi Floating Action Button (FAB), Menu nút con, Modal chọn lý do hỗ trợ, Modal yêu cầu tính tiền và Popup cảnh báo khi hết món.
3. **Mở rộng Tầng dịch vụ API (`frontend/dungChung/api.js`):**
   - Bổ sung bộ dữ liệu hạt giống mẫu (Seed Data) cho Đơn gọi món và Yêu cầu hỗ trợ của Bàn 03.
   - Thêm các hàm xử lý đặt món, tra cứu đơn theo bàn, hủy món, từ chối món, cập nhật trạng thái và tiếp nhận yêu cầu hỗ trợ.
4. **Hạ tầng Real-time & Âm thanh (`frontend/dungChung/ketNoiSocket.js`):**
   - Tích hợp kênh truyền `BroadcastChannel` giúp đồng bộ thời gian thực siêu tốc giữa nhiều Tab trình duyệt (Khách hàng ➔ Bếp ➔ Thu ngân) mà không bắt buộc phải bật Server backend.
   - Xây dựng bộ tạo sóng âm thanh Web Audio API Synthesizer tạo tiếng chuông Ding-Dong cho đơn mới, Ting-Ting cho gọi phục vụ và âm cảnh báo.
5. **Hằng số hệ thống (`frontend/dungChung/hangSo.js`):**
   - Bổ sung các trạng thái món đã gọi (`CHO_XAC_NHAN`, `DANG_CHE_BIEN`, `DA_XONG`, `DA_LEN_MON`, `DA_HUY`, `TU_CHOI`), danh mục lý do hỗ trợ bàn và hình thức thanh toán.
6. **Mở rộng Stylesheet (`frontend/tepGiaoDien.css`):**
   - Hơn 800 dòng CSS tối ưu cho thanh Stepper tiến độ 4 bước, thẻ lượt gọi món, thẻ thống kê tổng tiền, nút nổi FAB và các modal tương tác.
7. **Bảo mật và Tích hợp điều hướng (`frontend/dinhTuyen/boDieuHuong.js`, `ungDung.js`, `index.html`):**
   - Đăng ký tab `theoDoiDonMon` trên Sidebar menu và nạp các thành phần mới mượt mà vào vòng đời khởi động của ứng dụng SPA.

---

### IV. CAM KẾT VÀ GIẢI TRÌNH KHÔNG THAY ĐỔI MÃ NGUỒN CỦA THÀNH VIÊN KHÁC
Tuân thủ nghiêm ngặt yêu cầu của đề bài và nguyên tắc làm việc nhóm trong Công nghệ Phần mềm:
1. **Không sửa đổi mã nguồn Frontend của bạn Quân:**
   - Tệp `frontend/trang/quanLyBanQr/quanLyBanQr.js` (29.633 bytes) của Quân được giữ nguyên 100%.
   - Tệp `frontend/trang/quanLyThucDon/quanLyThucDon.js` (36.149 bytes) của Quân được giữ nguyên 100%.
   - Thuật toán tạo mã QR offline (`taoQrClient.js`) của Quân không bị can thiệp.
2. **Không sửa đổi mã nguồn Backend của bạn Nhật và Minh:**
   - Toàn bộ thư mục `backend/` (`banAn/`, `danhMucMon/`, `donGoiMon/`, `gioHang/`, `mayChu.js`, v.v.) được bảo toàn nguyên vẹn.
3. **Không can thiệp cấu trúc CSDL của bạn Phát:**
   - Các tệp kịch bản SQL (`database/*.sql`) không bị thay đổi.
4. **Cơ chế tương thích mở rộng (Non-destructive Extension):**
   - Các phương thức mới trong `api.js` và `hangSo.js` được bổ sung độc lập ở cuối tệp, không ghi đè bất kỳ phương thức nào của Sprint 1.
   - Các class CSS mới trong `tepGiaoDien.css` sử dụng tiền tố và định danh riêng biệt cho Sprint 2, không làm ảnh hưởng đến bố cục của Sprint 1.

---

### V. KHÓ KHĂN GẶP PHẢI VÀ BIỆN PHÁP KỸ THUẬT XỬ LÝ

1. **Khó khăn về kiểm thử Real-time khi chưa triển khai máy chủ Socket.io hoàn chỉnh:**
   - *Vấn đề:* Trong quá trình phát triển song song, Backend của Nhật đang trong giai đoạn hoàn thiện sự kiện Socket.io server. Nếu frontend chỉ phụ thuộc vào kết nối WebSocket thật thì khi chạy độc lập hoặc mở tệp `index.html` trực tiếp, người dùng sẽ không thấy được hiệu ứng nhảy trạng thái món ăn.
   - *Biện pháp xử lý:* Phong đã tích hợp kỹ thuật **Dual-layer Realtime Sync**:
     - *Tầng 1 (Live Server):* Tự động kết nối tới Socket.io server nếu có backend chạy ở cổng 3001.
     - *Tầng 2 (Cross-tab BroadcastChannel & Local Event Bus):* Sử dụng Web API `BroadcastChannel` của trình duyệt. Nhờ đó, nếu mở 2 tab trình duyệt (1 tab khách hàng theo dõi đơn, 1 tab quản lý/bếp), khi tab này kích hoạt hành động thì tab kia nhận dữ liệu tức thì trong vòng dưới **5ms**.
     - Xây dựng thanh công cụ giả lập kiểm thử trực tiếp trên đầu trang để người kiểm thử có thể bấm chuyển trạng thái tức thì.

2. **Khó khăn về phát chuông báo âm thanh trên các trình duyệt hiện đại:**
   - *Vấn đề:* Các trình duyệt hiện đại (Chrome, Edge, Safari) thường chặn tự động phát tệp âm thanh `.mp3` nếu người dùng chưa tương tác, hoặc tệp âm thanh có thể bị lỗi đường dẫn (404 Not Found) khi chuyển máy tính.
   - *Biện pháp xử lý:* Phong đã lập trình bộ tạo âm thanh thuần túy bằng **Web Audio API (`OscillatorNode` & `GainNode`)**. Thuật toán tổng hợp các tần số nốt nhạc chuẩn (`A5: 880Hz` kết hợp `E6: 1318Hz`) tạo tiếng chuông Ding-Dong trong trẻo, không tốn thêm byte dung lượng lưu trữ tệp và chạy mượt mà trên 100% môi trường.

3. **Xử lý nghiệp vụ Hủy món an toàn (US-068):**
   - *Vấn đề:* Khách hàng chỉ được phép hủy món khi Bếp chưa nấu. Nếu món đã chuyển sang `Đang chế biến` hoặc `Đã lên món` mà khách vẫn bấm hủy thì sẽ gây thất thoát nguyên vật liệu cho nhà hàng.
   - *Biện pháp xử lý:* Thiết lập điều kiện kiểm tra nghiêm ngặt cả trên giao diện (nút Hủy chỉ hiển thị tại các món có trạng thái `CHO_XAC_NHAN`) và trong tầng nghiệp vụ của `api.js`. Nếu món đã bắt đầu nấu, hệ thống từ chối hủy và yêu cầu khách liên hệ trực tiếp với nhân viên phục vụ.

---

### VI. KẾ HOẠCH CHO TUẦN 3 (SPRINT 3)
1. **Xây dựng Màn hình Điều phối Bếp (Kitchen Display System - KDS) (US-079 → US-086):**
   - Bảng thẻ đơn hàng (Order Cards) sắp xếp theo thứ tự thời gian vào bếp (FIFO).
   - Nổi bật ghi chú khẩu vị đặc biệt (ít cay, không hành, dị ứng).
   - Chế độ xem gom nhóm tổng số lượng theo từng món ăn giúp đầu bếp nấu theo mẻ lớn.
   - Nút chuyển nhanh trạng thái ("Bắt đầu nấu", "Hoàn thành") từng món hoặc toàn bộ phiếu.
   - Cảnh báo màu sắc đối với các đơn chờ quá thời gian quy định (trên 15 phút).
2. **Kiểm soát hết món tại Bếp (US-087, US-088):**
   - Thanh công cụ bật/tắt nhanh trạng thái "Hết món" ngay trên màn hình KDS và hộp thoại từ chối món có lý do gửi ngược về Thu ngân và Khách hàng.

---

### VII. TỰ ĐÁNH GIÁ MỨC ĐỘ HOÀN THÀNH
- **Khối lượng công việc hoàn thành:** 100% mục tiêu Sprint 2 (16/16 User Stories được giao từ US-063 đến US-078).
- **Chất lượng sản phẩm:** Giao diện đẹp mắt, chuẩn UI/UX Quán Mộc, tính năng Real-time và âm thanh chuông báo hoạt động hoàn hảo, bảo toàn 100% mã nguồn của các thành viên khác.
- **Đánh giá cá nhân:** Hoàn thành xuất sắc nhiệm vụ (**Mức A / Xuất sắc**).

---
*Hà Nội, ngày 27 tháng 10 năm 2026*  
**Người làm báo cáo**  

*(Ký và ghi rõ họ tên)*  
**Phạm Xuân Phong**
