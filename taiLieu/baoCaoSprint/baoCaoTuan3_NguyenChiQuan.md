# BÁO CÁO TIẾN ĐỘ CÁ NHÂN – TUẦN 3 (SPRINT 3)
**HỌC PHẦN: CÔNG NGHỆ PHẦN MỀM**  
**DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR (QUANMOC.COM)**

---

### I. THÔNG TIN CHUNG
- **Họ và tên sinh viên:** Nguyễn Chí Quân
- **Mã sinh viên:** *(Điền mã sinh viên)*
- **Lớp học phần:** N07 – Trường Đại học CMC
- **Nhóm thực hiện:** Nhóm 1
- **Vai trò trong nhóm:** Frontend Developer (Phụ trách Sơ đồ bàn POS, Vận hành phục vụ, Quầy Thu ngân & Thanh toán hóa đơn)
- **Thời gian thực hiện:** Tuần 3 (Sprint 3)
- **Nhánh làm việc Git:** `fe-quan-sprint3`
- **Tài khoản GitHub:** `nguyenchiquan417-ui` (https://github.com/nguyenchiquan417-ui)

---

### II. MỤC TIÊU CỦA BẢN THÂN TRONG SPRINT 3
1. **Phân hệ Sơ đồ bàn POS & Vận hành phục vụ (US-089 → US-098):**
   - Xây dựng giao diện Sơ đồ bàn trực quan theo thời gian thực (Real-time Table Grid), phân chia theo từng khu vực nhà hàng.
   - Hiển thị màu sắc nhận diện trạng thái bàn (Trống: Xanh lá; Đang phục vụ: Xanh dương; Chờ thanh toán: Vàng cam; Cần hỗ trợ: Đỏ nhấp nháy).
   - Hiển thị trực tiếp thời gian khách đã ngồi (số phút) và tổng tiền tạm tính trên từng thẻ bàn.
   - Xử lý mở bàn trực tiếp tại chỗ cho khách vãng lai (US-094); gọi món hộ khách từ quầy hoặc máy tính bảng (US-095).
   - Đánh dấu trạng thái món ăn đã bưng lên bàn ("Đã phục vụ" - US-096).
   - Xử lý nghiệp vụ hủy món / đổi trả món kèm lý do bắt buộc và ghi nhật ký đối soát thất thoát nguyên liệu (US-089, US-090, US-091).
   - Xây dựng Modal nghiệp vụ nâng cao: **Chuyển bàn** (US-097) và **Ghép bàn** (US-098).
2. **Phân hệ Quầy Thu ngân, Hóa đơn & Thanh toán POS (US-099 → US-110):**
   - Thiết kế giao diện POS 2 cột hiện đại: Cột trái quản lý danh sách bàn đang có khách; Cột phải hiển thị chi tiết hóa đơn và bảng điều khiển thanh toán.
   - Quản lý danh sách mã Voucher khuyến mại và tự động kiểm tra điều kiện áp dụng giảm trừ (US-099, US-100).
   - Tùy chỉnh chiết khấu thêm hoặc cộng phụ phí dịch vụ/phòng VIP (US-101).
   - Tự động tổng hợp các lượt gọi món, tính thuế VAT và tổng số tiền thanh toán cuối cùng (US-102, US-103).
   - Thiết kế định dạng và in phiếu tạm tính cho khách chuẩn máy in nhiệt 80mm / K80 (`@media print` - US-104).
   - Thanh toán Tiền mặt: các nút mệnh giá nhanh, tự động tính tiền thừa trả khách (US-105).
   - Thanh toán Chuyển khoản VietQR: tự động sinh mã VietQR động chuẩn Napas 247 bằng thuật toán Client thuần JS, nhúng sẵn số tiền và mã hóa đơn (US-106).
   - Hỗ trợ tách món thanh toán riêng (Split Bill) cho nhóm khách chia tiền (US-108).
   - Tự động đóng phiên phục vụ bàn (`Table Session`), giải phóng bàn về trạng thái "Trống" sau khi thanh toán thành công (US-107, US-109, US-110).

---

### III. KẾT QUẢ CÔNG VIỆC HOÀN THÀNH

#### 1. Bảng tiến độ 22 User Stories phụ trách (22/22 US đạt 100%)
| Phân hệ chức năng | Mã User Story | Nội dung công việc | Kết quả bàn giao | Trạng thái |
|---|---|---|---|:---:|
| **Vận hành bàn POS** | US-089 | Hủy món theo yêu cầu của khách khi chưa nấu | Modal hủy món, kiểm tra trạng thái món | **Hoàn thành** |
| | US-090 | Xử lý đổi trả món kèm ghi nhận lý do | Modal đổi trả món, ghi rõ nguyên nhân lỗi | **Hoàn thành** |
| | US-091 | Lưu nhật ký hủy / trả món để đối soát | Modal nhật ký hiển thị thời gian, người hủy, lý do | **Hoàn thành** |
| | US-092 | Sơ đồ bàn trực quan theo khu vực & màu sắc | Lưới sơ đồ bàn 4 trạng thái màu sắc rõ ràng | **Hoàn thành** |
| | US-093 | Hiển thị thời gian ngồi và tiền tạm tính | Card bàn hiển thị: ⏱️ số phút, 💰 số tiền, 📦 số món | **Hoàn thành** |
| | US-094 | Mở bàn trực tiếp cho khách tại chỗ | Modal mở bàn chọn số khách, ghi chú ban đầu | **Hoàn thành** |
| | US-095 | Nhân viên gọi món hộ khách tại bàn | Modal thực đơn catalog nhanh, tìm kiếm, thêm món | **Hoàn thành** |
| | US-096 | Xác nhận món đã bưng lên bàn ("Đã phục vụ") | Nút 1-click cập nhật trạng thái món sang `DA_PHUC_VU` | **Hoàn thành** |
| | US-097 | Chuyển toàn bộ đơn sang bàn trống khác | Modal chọn bàn đích hợp lệ, cập nhật trạng thái | **Hoàn thành** |
| | US-098 | Ghép đơn của 2 hoặc nhiều bàn vào chung hóa đơn | Modal chọn danh sách bàn phụ, gộp món, giải phóng bàn | **Hoàn thành** |
| **Quầy Thu ngân & POS** | US-099 | Quản lý danh sách mã Voucher khuyến mại | Modal danh sách voucher (BANMOI10, MOCVUI50K, VIP20...) | **Hoàn thành** |
| | US-100 | Kiểm tra điều kiện & áp dụng voucher vào đơn | Kiểm tra đơn tối thiểu, tính số tiền giảm trừ | **Hoàn thành** |
| | US-101 | Tùy chỉnh chiết khấu (%) hoặc cộng phụ phí (đ) | Form nhập chiết khấu quản lý, phụ phí dịch vụ | **Hoàn thành** |
| | US-102 | Tự động tổng hợp toàn bộ các món thành 1 hóa đơn | Bảng chi tiết hóa đơn đầy đủ đơn giá, số lượng, tùy chọn | **Hoàn thành** |
| | US-103 | Tự động tính thành tiền, giảm giá, VAT, tổng tiền | Bảng tổng kết số tiền tự động tính chuẩn xác | **Hoàn thành** |
| | US-104 | Xem trước & in phiếu tạm tính khổ K80 | Định dạng in nhiệt khổ 80mm bằng CSS Print | **Hoàn thành** |
| | US-105 | Thanh toán Tiền mặt & tự tính tiền thối | Nút mệnh giá 500k, 1tr, 2tr; tính tiền thừa tức thì | **Hoàn thành** |
| | US-106 | Sinh mã VietQR động chuẩn Napas 247 | Sinh mã QR SVG chuẩn VietQR nhúng số tiền & mã HĐ | **Hoàn thành** |
| | US-107 | Xác nhận hoàn tất giao dịch & lưu hóa đơn | Lưu lịch sử hóa đơn kèm người thu ngân | **Hoàn thành** |
| | US-108 | Tách món thanh toán riêng (Split bill) | Modal tích chọn món tách bill, tạo hóa đơn phụ | **Hoàn thành** |
| | US-109 | Tự động đóng phiên phục vụ bàn sau thanh toán | Xóa phiên bàn đang hoạt động trong CSDL/LocalStorage | **Hoàn thành** |
| | US-110 | Tự động giải phóng bàn về trạng thái "Trống" | Bàn tự chuyển sang xanh lá, sẵn sàng đón khách mới | **Hoàn thành** |

---

#### 2. Sản phẩm kỹ thuật bàn giao trong mã nguồn (`frontend/`)
1. **`frontend/trang/soDoBan/soDoBanPos.js`**:
   - Module Sơ đồ bàn POS: Bộ lọc khu vực, bộ lọc trạng thái, 6 thẻ thống kê nhanh, lưới thẻ bàn hiển thị trực quan.
   - Tích hợp 5 Modal nghiệp vụ: Mở bàn (US-094), Xem chi tiết món & Đổi trả (US-089, US-090), Gọi món hộ khách (US-095), Chuyển/Ghép bàn (US-097, US-098), Nhật ký thất thoát (US-091).
2. **`frontend/trang/thanhToan/thanhToanPos.js`**:
   - Module Quầy Thu ngân: Bố cục 2 cột (Danh sách bàn đang ăn & Hóa đơn chi tiết).
   - Cơ chế áp dụng Voucher, Chiết khấu, Phụ phí và Thuế VAT.
   - Thanh toán song song VietQR Napas 247 và Tiền mặt.
   - Nghiệp vụ Tách hóa đơn (Split Bill) và In phiếu tạm tính K80.
3. **`frontend/tepGiaoDien.css`**:
   - Bổ sung hơn 700 dòng CSS hoàn chỉnh cho phân hệ POS, hiệu ứng nhấp nháy bàn cần hỗ trợ, lưới sơ đồ bàn responsive, bố cục 2 cột thu ngân và template in ấn K80 `@media print`.
4. **`frontend/dinhTuyen/boDieuHuong.js` & `ungDung.js`**:
   - Bổ sung phân quyền Router Guard cho Sơ đồ bàn (`soDoBanPos`) và Thu ngân (`thanhToanPos`), hỗ trợ URL Hash điều hướng trực tiếp không reload trang.

---

### IV. HÌNH ẢNH MINH CHỨNG HOẠT ĐỘNG
- **Sơ đồ bàn POS thời gian thực:** `taiLieu/hinhAnh/demo_soDoBanPos.png`
- **Quầy Thu ngân & Thanh toán VietQR:** `taiLieu/hinhAnh/demo_thanhToanPos.png`

---

### V. TỰ ĐÁNH GIÁ & KẾ HOẠCH TUẦN TIẾP THEO (SPRINT 4)
- **Tự đánh giá:** Hoàn thành 100% các User Story được giao trong Sprint 3 đúng hạn. Mã nguồn được cấu trúc rõ ràng, hỗ trợ đầy đủ cơ chế hoạt động offline-first và kết nối API backend linh hoạt.
- **Kế hoạch Sprint 4:**
  - Xây dựng giao diện Khách hàng đánh giá sao (1-5 sao) và nhận xét món ăn sau bữa ăn (US-111 → US-116).
  - Tối ưu hóa UI/UX Responsive toàn diện trên mọi màn hình di động/máy tính bảng.
  - Phối hợp cùng Trưởng nhóm (Nhật) kiểm thử End-to-End toàn bộ luồng nghiệp vụ hệ thống.
