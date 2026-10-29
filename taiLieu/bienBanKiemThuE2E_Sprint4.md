# BIÊN BẢN KIỂM THỬ TOÀN TRÌNH HỆ THỐNG (END-TO-END TEST PROTOCOL)
**HỌC PHẦN: CÔNG NGHỆ PHẦN MỀM**  
**DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR (QUANMOC.COM)**  
**MÃ USER STORY: US-140 – KIỂM THỬ E2E TOÀN BỘ QUY TRÌNH HỆ THỐNG**  
**NGƯỜI THỰC HIỆN KIỂM THỬ:** NGUYỄN CHÍ QUÂN (Frontend Lead)  
**PHỐI HỢP CÙNG:** TRẦN MINH NHẬT (Trưởng nhóm), NGUYỄN HOÀNG PHONG (Auth/Admin Lead)  

---

### I. MỤC TIÊU VÀ PHẠM VI KIỂM THỬ E2E
- **Mục tiêu:** Xác minh tính toàn vẹn và thông suốt của toàn bộ luồng nghiệp vụ nhà hàng từ lúc khách đến, quét mã QR, duyệt thực đơn, đặt món, bếp chế biến, phục vụ bưng món, thu ngân thanh toán VietQR cho đến đánh giá 5 sao sau bữa ăn.
- **Môi trường kiểm thử:**
  + Trình duyệt: Google Chrome v124+, Microsoft Edge v124+, Safari Mobile (iOS), Chrome Mobile (Android).
  + Môi trường: Localhost & Vercel Preview Cloud.
  + Màn hình kiểm thử: Responsive đa kích cỡ (iPhone 14 Pro 393px, iPad Air 820px, Laptop Full HD 1920x1080).

---

### II. QUY TRÌNH TOÀN TRÌNH KIỂM THỬ (E2E SCENARIOS)

```
[1. Khách quét QR bàn] ──> [2. Duyệt E-Menu & Giỏ hàng] ──> [3. Gửi đơn gọi món]
                                                                     │
                                                                     ▼
[6. Đánh giá 5 sao] <── [5. POS Thu ngân & VietQR] <── [4. KDS Bếp & Phục vụ]
```

---

### III. BẢNG CHI TIẾT KỊCH BẢN & KẾT QUẢ KIỂM THỬ (TEST CASES)

| STT | Kịch bản kiểm thử (Test Scenario) | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|:---:|---|---|---|---|:---:|
| **TC-01** | **Khởi tạo bàn & Sinh mã QR (Sprint 1)** | 1. Đăng nhập tài khoản Quản lý.<br>2. Vào màn hình Bàn & QR.<br>3. Thêm Bàn 05 khu vực Tầng 1.<br>4. Nhấn nút "Tải / In QR Standee". | Hệ thống tạo thành công Bàn 05; Sinh mã QR chứa URL gọi món chuẩn `?banId=5`. File SVG/PNG tải về sắc nét. | Tạo bàn thành công, QR hiển thị đúng URL, quét được bằng camera điện thoại. | **ĐẠT (PASS)** |
| **TC-02** | **Quét QR & Duyệt E-Menu di động (Sprint 2)** | 1. Dùng điện thoại mở URL QR Bàn 05.<br>2. Xem danh sách danh mục (Khai vị, Món chính, Đồ uống).<br>3. Xem chi tiết món Bò nướng chấm sốt me. | Giao diện hiển thị chuẩn mobile; Tải ảnh món theo cơ chế Lazy load nhanh chóng; Thấy tag Best Seller và mô tả chi tiết. | Giao diện mượt mà, cuộn danh mục nhanh, hình ảnh hiển thị đúng. | **ĐẠT (PASS)** |
| **TC-03** | **Chọn Topping & Đặt món tại bàn (Sprint 2)** | 1. Chọn món "Bò né sốt tiêu đen" kèm Topping "Thêm phô mai kéo sợi".<br>2. Nhập ghi chú: "Ít cay".<br>3. Nhấn "Gửi đơn gọi món". | Giỏ hàng tính đúng giá (món + Topping); Hiển thị thông báo đặt món thành công; Cập nhật thời gian thực vào đơn bàn 05. | Đơn gửi thành công, mã đơn #ODR-B05 được tạo với trạng thái Chờ chế biến. | **ĐẠT (PASS)** |
| **TC-04** | **Điều phối Bếp KDS & Bưng món (Sprint 3)** | 1. Bếp nhận đơn mới trên KDS.<br>2. Đầu bếp nhấn "Bắt đầu nấu" -> "Nấu xong".<br>3. Phục vụ xác nhận món đã bưng lên bàn ("Đã phục vụ"). | Màn hình KDS cập nhật trạng thái món; Sơ đồ bàn POS đổi trạng thái món sang xanh lá `Đã phục vụ`. | Món chuyển trạng thái đúng theo quy trình FIFO, không bị nhảy mẻ. | **ĐẠT (PASS)** |
| **TC-05** | **Sơ đồ bàn POS & Nghiệp vụ phục vụ (Sprint 3)** | 1. Bàn 05 hiển thị màu Xanh dương ("Đang phục vụ").<br>2. Thử nghiệm gọi món hộ thêm Trà đào.<br>3. Thử nghiệm đổi trả / hủy món ghi nhận lý do. | Sơ đồ bàn cập nhật ngay số phút khách ngồi và tổng tiền tạm tính; Nhật ký hủy món ghi nhận đầy đủ người hủy và lý do. | Thao tác mượt mà, số liệu đồng bộ tức thì, không reload trang. | **ĐẠT (PASS)** |
| **TC-06** | **Quầy Thu ngân, Voucher & VietQR (Sprint 3)** | 1. Khách yêu cầu thanh toán.<br>2. Thu ngân mở Bàn 05 tại POS.<br>3. Nhập mã voucher `MOCVUI50K`.<br>4. Chọn thanh toán "Chuyển khoản VietQR". | Voucher giảm đúng 50.000đ; Mã VietQR Napas 247 hiển thị động với số tiền chính xác; Quét thanh toán thành công. | Mã QR sinh chuẩn SVG, app ngân hàng quét nhận đúng số tiền và nội dung đơn. | **ĐẠT (PASS)** |
| **TC-07** | **In hóa đơn K80 & Giải phóng bàn (Sprint 3)** | 1. Nhấn nút "In phiếu tạm tính / Hóa đơn".<br>2. Nhấn "Hoàn tất thanh toán". | Xuất định dạng in K80 chuẩn 80mm không vỡ khung; Bàn 05 tự động đóng phiên và chuyển về trạng thái Xanh lá ("Trống"). | In ra đẹp mắt; Bàn giải phóng ngay lập tức, sẵn sàng đón khách tiếp theo. | **ĐẠT (PASS)** |
| **TC-08** | **Khách hàng đánh giá & chấm điểm sao (Sprint 4)** | 1. Sau khi thanh toán, màn hình khách hàng hiện form Đánh giá.<br>2. Khách chấm 5 sao ⭐ kèm biểu cảm "Tuyệt vời".<br>3. Chấm điểm riêng cho món Bò né và gửi nhận xét: "Món ăn rất ngon, phục vụ nhanh chu đáo". | Đánh giá được ghi nhận vào hệ thống; Điểm sao trung bình cập nhật; Hiển thị thông báo cảm ơn khách hàng. | Đánh giá lưu trữ chuẩn xác, điểm trung bình quán tự động tính lại. | **ĐẠT (PASS)** |
| **TC-09** | **Quản lý tiếp nhận phản hồi & Hồi âm (Sprint 4)** | 1. Quản lý mở phân hệ "Đánh giá dịch vụ".<br>2. Xem danh sách đánh giá mới nhất.<br>3. Lọc thử đánh giá 1-2 sao.<br>4. Mở modal phản hồi ý kiến khách hàng. | Danh sách đánh giá phân trang/lọc chuẩn xác; Cảnh báo đánh giá tiêu cực nổi bật; Quản lý gửi lời cảm ơn và lưu trạng thái "Đã phản hồi". | Quản lý xem và phản hồi ngay lập tức; Trạng thái chuyển sang `Đã phản hồi`. | **ĐẠT (PASS)** |
| **TC-10** | **Kiểm thử Responsive & Tối ưu tải trang (Sprint 4)** | 1. Mở DevTools kiểm tra trên iPhone SE, iPhone 14 Pro Max, Galaxy Z Fold.<br>2. Kiểm tra Lazy loading ảnh (`loading="lazy"`).<br>3. Kiểm tra Lighthouse Performance. | Giao diện co giãn tự nhiên không tràn viền (overflow); Ảnh chỉ tải khi cuộn tới; Điểm Performance/SEO đạt trên 90 điểm. | 100% thành phần co giãn chuẩn responsive; Tốc độ tải trang dưới 1.2s. | **ĐẠT (PASS)** |

---

### IV. KẾT LUẬN & ĐÁNH GIÁ TỔNG THỂ
1. **Độ ổn định hệ thống:** 10/10 kịch bản kiểm thử đạt kết quả **PASS**. Không xuất hiện lỗi Crash ứng dụng, rò rỉ bộ nhớ hay xung đột định tuyến Single Page Application.
2. **Tính độc lập và tính tương thích:** Phân hệ của Quân (Quản lý Bàn, Menu, POS Thu ngân, Sơ đồ bàn, Đánh giá) tích hợp liền mạch với phần Quản trị của Phong và Backend API của Minh.
3. **Mức độ sẵn sàng triển khai (Production Ready):** Toàn bộ giao diện Frontend đã được cấu hình tệp `vercel.json` sẵn sàng đẩy lên môi trường Vercel Cloud bất cứ lúc nào.
