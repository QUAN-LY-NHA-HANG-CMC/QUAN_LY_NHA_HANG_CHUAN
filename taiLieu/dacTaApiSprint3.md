# TÀI LIỆU ĐẶC TẢ RESTFUL API - SPRINT 3 (MINH PHỤ TRÁCH)

* **Dự án:** Hệ thống Quản lý Nhà hàng & Gọi món QR (QUANMOC.COM)
* **Người thực hiện:** Nguyễn Sỹ Minh (Backend Developer)
* **Đối tượng bàn giao:** Nhóm Frontend (Quân - POS Thu ngân/Sơ đồ bàn, Phong - KDS/Real-time/Admin)
* **Phạm vi nghiệp vụ:** Khuyến mãi & Voucher, Đơn gọi món (Lượt gọi/Rounds), Hóa đơn thanh toán, In phiếu tạm tính, Tách hóa đơn, Thanh toán Tiền mặt & VietQR động, Đóng phiên và giải phóng bàn (US-099 -> US-110).

---

## 1. DANH SÁCH USER STORIES BÀN GIAO

| Mã User Story | Nội dung nghiệp vụ | Nhóm Endpoint |
|---|---|---|
| **US-099** | Tạo và quản lý các chương trình khuyến mãi / mã giảm giá (% hoặc số tiền) | `/api/khuyen-mai` |
| **US-100** | Kiểm tra điều kiện hợp lệ và áp dụng mã giảm giá vào hóa đơn bàn | `/api/khuyen-mai/kiem-tra` |
| **US-101** | Tùy chỉnh chiết khấu trực tiếp hoặc cộng phụ phí (quyền Quản lý) | `/api/hoa-don/tong-hop-ban/:banId` |
| **US-102** | Tự động tổng hợp toàn bộ các lượt gọi món tại bàn thành một hóa đơn duy nhất | `/api/hoa-don/tong-hop-ban/:banId` |
| **US-103** | Tự động tính thành tiền, giảm giá, thuế VAT và tổng số tiền khách phải thanh toán | Phía Backend tự tính toán |
| **US-104** | Xem trước và in phiếu tạm tính cho nhân viên mang ra bàn (CSS Print) | `/api/hoa-don/tam-tinh/:idHoacBanId` |
| **US-105** | Xử lý thanh toán Tiền mặt (nhập tiền khách đưa, tính tiền thừa) | `/api/thanh-toan/tien-mat` |
| **US-106** | Tạo mã VietQR động chứa sẵn số tiền và nội dung chuyển khoản theo mã hóa đơn | `/api/thanh-toan/viet-qr/:hoaDonId` |
| **US-107** | Xác nhận hoàn tất giao dịch thanh toán và xuất hóa đơn chính thức | `/api/thanh-toan/xac-nhan-viet-qr` |
| **US-108** | Hỗ trợ tách món trong bàn để thanh toán riêng theo nhu cầu của nhóm khách | `/api/hoa-don/:id/tach-hoa-don` |
| **US-109** | Tự động đóng phiên phục vụ bàn (Table Session) ngay sau khi thanh toán xong | Tự động trigger khi thanh toán |
| **US-110** | Tự động chuyển trạng thái bàn về "Bàn trống" và làm mới token QR | Tự động trigger khi thanh toán |

---

## 2. CHI TIẾT CÁC ENDPOINTS

### 2.1. Phân hệ Khuyến mãi & Mã giảm giá (`/api/khuyen-mai`)

#### 1. Kiểm tra và áp dụng mã voucher (US-100)
* **Phương thức:** `POST /api/khuyen-mai/kiem-tra`
* **Request Body:**
```json
{
  "maKhuyenMai": "GIAM10",
  "tongTienTamTinh": 500000
}
```
* **Response thành công (200 OK):**
```json
{
  "ok": true,
  "data": {
    "hopLe": true,
    "khuyenMaiId": 2,
    "maKhuyenMai": "GIAM10",
    "tenKhuyenMai": "Giảm giá 10% tổng hóa đơn",
    "loai": "PHAN_TRAM",
    "giaTri": 10,
    "soTienGiam": 50000,
    "tongTienSauGiam": 450000,
    "thongBao": "Áp dụng thành công mã 'GIAM10'. Bạn được giảm 50.000đ!"
  },
  "msg": "Áp dụng thành công mã 'GIAM10'. Bạn được giảm 50.000đ!"
}
```

#### 2. Lấy danh sách chương trình khuyến mãi (US-099)
* **Phương thức:** `GET /api/khuyen-mai?trangThai=DangApDung&tuKhoa=`
* **Response thành công (200 OK):** Trả về mảng danh sách voucher ưu đãi đang có hiệu lực.

---

### 2.2. Phân hệ Đơn gọi món & Lượt gọi món (`/api/don-goi-mon`)

#### 1. Đặt món mới / Gọi thêm món theo lượt (US-067)
* **Phương thức:** `POST /api/don-goi-mon`
* **Request Body:**
```json
{
  "banId": 3,
  "ghiChuDon": "Khách ăn ít cay",
  "danhSachMon": [
    {
      "monId": 1,
      "tenMon": "Bò nướng tảng sốt tiêu đen",
      "donGia": 189000,
      "soLuong": 2,
      "size": "Tiêu chuẩn",
      "topping": "",
      "ghiChu": "Chín vừa"
    }
  ]
}
```
* **Response thành công (201 Created):** Trả về đơn đặt món kèm mã đơn `ORD-YYYYMMDD-xxx` và số lượt gọi `luotGoi`.

#### 2. Lấy toàn bộ các lượt gọi món của bàn & Tổng tiền lũy kế (US-070)
* **Phương thức:** `GET /api/don-goi-mon/ban/:banId`
* **Response thành công (200 OK):**
```json
{
  "ok": true,
  "data": {
    "ban": { "id": 3, "maBan": "B103", "tenBan": "Bàn 03", "trangThai": "DangPhucVu" },
    "tongSoDon": 2,
    "tongSoMon": 7,
    "tongTienLuyKe": 585000,
    "danhSachDon": [ ... ]
  }
}
```

---

### 2.3. Phân hệ Hóa đơn thanh toán (`/api/hoa-don`)

#### 1. Tổng hợp hóa đơn từ bàn ăn (US-101, US-102, US-103)
* **Phương thức:** `POST /api/hoa-don/tong-hop-ban/:banId`
* **Request Body (tùy chọn):**
```json
{
  "maKhuyenMai": "CHAOMUNG50K",
  "chietKhauTrucTiep": 20000,
  "lyDoChietKhau": "Khách quen VIP",
  "phuPhi": 30000,
  "lyDoPhuPhi": "Phí phòng riêng ngoài giờ",
  "thueVatPhanTram": 8,
  "thuNganId": 2,
  "tenThuNgan": "Trần Thị Thu Ngân"
}
```
* **Response thành công (200 OK):**
```json
{
  "ok": true,
  "data": {
    "id": 2,
    "maHoaDon": "HD-20261028-002",
    "banId": 3,
    "maBan": "B103",
    "tenBan": "Bàn 03",
    "danhSachMon": [ ... ],
    "tongTienMon": 585000,
    "maKhuyenMai": "CHAOMUNG50K",
    "giamGiaKhuyenMai": 50000,
    "chietKhauTrucTiep": 20000,
    "phuPhi": 30000,
    "tongGiamGia": 70000,
    "tienTruocThue": 545000,
    "thueVatPhanTram": 8,
    "tienThueVat": 43600,
    "tongTienThanhToan": 588600,
    "trangThai": "ChoThanhToan"
  }
}
```

#### 2. Lấy dữ liệu in phiếu tạm tính kèm mã VietQR (US-104)
* **Phương thức:** `GET /api/hoa-don/tam-tinh/:idHoacBanId`
* **Response thành công (200 OK):**
  - Trả về thông tin thương hiệu nhà hàng (Tên, địa chỉ, hotline, Wi-Fi).
  - Chi tiết hóa đơn và các dòng tổng tiền.
  - Mã QR hình ảnh (`qrDataUrl`: Base64 PNG) và `urlQuickLink` VietQR để in trực tiếp lên phiếu tính tiền.

#### 3. Tách món trong hóa đơn (Split Bill - US-108)
* **Phương thức:** `POST /api/hoa-don/:id/tach-hoa-don`
* **Request Body:**
```json
{
  "danhSachMonTach": [
    { "id": 103, "soLuong": 1 }
  ]
}
```
* **Response thành công (200 OK):** Trả về `{ hoaDonGoc, hoaDonTachMoi }` đã được tính lại số tiền độc lập.

---

### 2.4. Phân hệ Thanh toán & Đóng phiên bàn (`/api/thanh-toan`)

#### 1. Tạo mã thanh toán VietQR động (US-106)
* **Phương thức:** `GET /api/thanh-toan/viet-qr/:hoaDonId`
* **Response thành công (200 OK):**
```json
{
  "ok": true,
  "data": {
    "giaoDichId": 2,
    "maGiaoDich": "GD-20261028-002",
    "soTien": 588600,
    "noiDungChuyenKhoan": "THANH TOAN HD-20261028-002 B103",
    "urlQuickLink": "https://img.vietqr.io/image/970422-0988889999-compact2.png?amount=588600&addInfo=THANH%20TOAN%20HD-20261028-002%20B103&accountName=NHA%20HANG%20QUAN%20MOC",
    "qrDataUrl": "data:image/png;base64,iVBORw0KGgo..."
  }
}
```

#### 2. Xử lý thanh toán Tiền mặt (US-105, US-107, US-109, US-110)
* **Phương thức:** `POST /api/thanh-toan/tien-mat`
* **Request Body:**
```json
{
  "hoaDonId": 2,
  "soTienKhachDua": 600000,
  "thuNganId": 2,
  "tenThuNgan": "Nguyễn Sỹ Minh"
}
```
* **Response thành công (200 OK):**
```json
{
  "ok": true,
  "data": {
    "thanhCong": true,
    "soTienCanThanhToan": 588600,
    "soTienKhachDua": 600000,
    "soTienThua": 11400,
    "thongBao": "Thanh toán tiền mặt thành công! Tiền thừa gửi lại khách: 11.400đ"
  }
}
```
* **Hiệu ứng phụ:** Tự động đóng toàn bộ đơn của bàn, giải phóng bàn về `trangThai: 'Trong'` và làm mới token bảo mật QR bàn.

#### 3. Xác nhận chuyển khoản VietQR thành công (US-107)
* **Phương thức:** `POST /api/thanh-toan/xac-nhan-viet-qr`
* **Request Body:**
```json
{
  "hoaDonId": 2,
  "maGiaoDichNganHang": "MBB_REF_99887766",
  "tenThuNgan": "Nguyễn Sỹ Minh"
}
```
