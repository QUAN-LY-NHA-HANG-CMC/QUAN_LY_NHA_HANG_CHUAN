# TÀI LIỆU ĐẶC TẢ RESTFUL API - SPRINT 4 (MINH PHỤ TRÁCH)

* **Dự án:** Hệ thống Quản lý Nhà hàng & Gọi món QR (QUANMOC.COM)
* **Người thực hiện:** Nguyễn Sỹ Minh (Backend Developer)
* **Đối tượng bàn giao:** Nhóm Frontend (Phong - Dashboard Thống kê/Kết ca, Quân - Đánh giá phản hồi)
* **Phạm vi nghiệp vụ:** Đánh giá & phản hồi khách hàng (US-111 -> US-116), Quản lý ca làm việc & Kết ca thu ngân (US-117 -> US-122), Thống kê doanh thu Dashboard (US-123 -> US-130), Xuất báo cáo CSV/Excel (US-131 -> US-134).

---

## 1. DANH SÁCH USER STORIES BÀN GIAO SPRINT 4

| Mã User Story | Nội dung nghiệp vụ | Nhóm Endpoint |
|---|---|---|
| **US-111** | Khách hàng chấm điểm sao (1-5 sao) cho chất lượng dịch vụ | `POST /api/danh-gia` |
| **US-112** | Khách hàng gửi nhận xét chi tiết và đánh giá từng món ăn | `POST /api/danh-gia` |
| **US-113** | Quản lý xem danh sách toàn bộ đánh giá của khách hàng | `GET /api/danh-gia` |
| **US-114** | Lọc đánh giá theo số sao hoặc các phản hồi tiêu cực cần xử lý gấp | `GET /api/danh-gia?canXuLyGap=true&soSao=` |
| **US-115** | Quản lý ghi chú xử lý hoặc phản hồi ý kiến đóng góp của khách | `PATCH /api/danh-gia/:id/phan-hoi` |
| **US-116** | Thống kê điểm đánh giá trung bình của nhà hàng và từng món ăn | `GET /api/danh-gia/thong-ke` |
| **US-117** | Thiết lập cấu hình danh sách ca làm việc trong ngày | `GET /api/ca-lam-viec/danh-sach-ca` |
| **US-118** | Thu ngân mở ca làm việc và nhập số tiền mặt đầu ca trong két | `POST /api/ca-lam-viec/mo-ca` |
| **US-119** | Ghi nhận các phiếu thu / chi tiền mặt phát sinh trong ca | `POST /api/ca-lam-viec/:phienCaId/thu-chi` |
| **US-120** | Tự động tổng hợp doanh thu tiền mặt, chuyển khoản và tiền két theo thời gian thực | `GET /api/ca-lam-viec/hien-tai` |
| **US-121** | Thu ngân đóng ca, nhập tiền kiểm đếm thực tế và đối soát chênh lệch | `POST /api/ca-lam-viec/:phienCaId/dong-ca` |
| **US-122** | Quản lý xem lịch sử bàn giao ca và chi tiết biên bản kết ca | `GET /api/ca-lam-viec/lich-su` |
| **US-123** | Dashboard tổng quan số liệu trong ngày (Doanh thu, số đơn, số bàn...) | `GET /api/bao-cao/tong-quan` |
| **US-124** | Biểu đồ doanh thu trực quan theo ngày/tuần/tháng | `GET /api/bao-cao/bieu-do-doanh-thu` |
| **US-125** | Thống kê tỷ trọng thanh toán Tiền mặt vs Chuyển khoản VietQR | `GET /api/bao-cao/ty-trong-thanh-toan` |
| **US-126** | Thống kê doanh thu theo từng danh mục thực đơn | `GET /api/bao-cao/doanh-thu-danh-muc` |
| **US-127** | Bảng xếp hạng Top món ăn bán chạy nhất | `GET /api/bao-cao/xep-hang-mon-an` |
| **US-128** | Thống kê các món ăn ít người gọi nhất để tối ưu menu | `GET /api/bao-cao/xep-hang-mon-an` |
| **US-129** | Thống kê phân tích khung giờ cao điểm trong ngày | `GET /api/bao-cao/khung-gio-cao-diem` |
| **US-130** | Thống kê tỷ lệ đơn hủy / món hủy và giá trị thất thoát | `GET /api/bao-cao/thong-ke-huy` |
| **US-131, 132** | Tra cứu lịch sử toàn bộ hóa đơn đã thanh toán và chi tiết | `GET /api/bao-cao/lich-su-hoa-don` |
| **US-133** | Xuất báo cáo doanh thu & hóa đơn ra file CSV chuẩn UTF-8 BOM | `GET /api/bao-cao/xuat-csv/hoa-don` |
| **US-134** | Xuất danh mục thực đơn ra file CSV chuẩn UTF-8 BOM | `GET /api/bao-cao/xuat-csv/thuc-don` |

---

## 2. CHI TIẾT CÁC ENDPOINTS

### 2.1. Đánh giá & Phản hồi (`/api/danh-gia`)

#### 1. Khách hàng gửi đánh giá (US-111, US-112)
* **Phương thức:** `POST /api/danh-gia`
* **Request Body:**
```json
{
  "hoaDonId": 3,
  "tenKhachHang": "Hoàng Anh",
  "soDienThoaiKhach": "0977888999",
  "diemDichVu": 5,
  "nhanXetDichVu": "Đồ ăn rất ngon, phục vụ nhanh!",
  "danhGiaMonAn": [
    { "monId": 1, "tenMon": "Bò nướng tảng sốt tiêu đen", "soSao": 5, "nhanXet": "Thịt mềm ngon" },
    { "monId": 4, "tenMon": "Trà đào cam sả", "soSao": 5, "nhanXet": "Rất thanh mát" }
  ]
}
```

#### 2. Thống kê điểm số (US-116)
* **Phương thức:** `GET /api/danh-gia/thong-ke`
* **Response:** Trả về điểm trung bình toàn quán, phân bổ sao 1-5 sao, danh sách món ăn kèm điểm sao trung bình.

#### 3. Quản lý phản hồi đánh giá (US-115)
* **Phương thức:** `PATCH /api/danh-gia/:id/phan-hoi`
* **Request Body:**
```json
{
  "phanHoiCuaQuanLy": "Quán Mộc chân thành cảm ơn quý khách!",
  "nguoiPhanHoiId": 1,
  "tenNguoiPhanHoi": "Nguyễn Sỹ Minh"
}
```

---

### 2.2. Ca làm việc & Kết ca thu ngân (`/api/ca-lam-viec`)

#### 1. Mở ca làm việc (US-118)
* **Phương thức:** `POST /api/ca-lam-viec/mo-ca`
* **Request Body:**
```json
{
  "caId": 2,
  "thuNganId": 2,
  "tenThuNgan": "Trần Thị Thu Ngân",
  "tienDauCa": 2000000
}
```

#### 2. Ghi nhận phiếu thu/chi (US-119)
* **Phương thức:** `POST /api/ca-lam-viec/:phienCaId/thu-chi`
* **Request Body:**
```json
{
  "loai": "CHI",
  "soTien": 150000,
  "lyDo": "Mua thêm túi đựng và khăn giấy"
}
```

#### 3. Lấy thông tin ca hiện tại & đối soát tức thời (US-120)
* **Phương thức:** `GET /api/ca-lam-viec/hien-tai?thuNganId=2`
* **Response:** Trả về doanh thu tiền mặt, chuyển khoản, tiền két lý thuyết theo thời gian thực.

#### 4. Đóng ca và đối soát kết ca (US-121)
* **Phương thức:** `POST /api/ca-lam-viec/:phienCaId/dong-ca`
* **Request Body:**
```json
{
  "tienMatThucTeCuoiCa": 6550000,
  "ghiChuKetCa": "Két tiền khớp hoàn toàn",
  "quanLyId": 1,
  "tenQuanLy": "Nguyễn Sỹ Minh"
}
```

---

### 2.3. Báo cáo Thống kê & Xuất CSV (`/api/bao-cao`)

#### 1. Dashboard tổng quan (US-123)
* **Phương thức:** `GET /api/bao-cao/tong-quan`
* **Response:** Tổng doanh thu, tỷ trọng phương thức, số đơn, giá trị đơn trung bình (AOV), tỷ lệ lấp đầy bàn ăn.

#### 2. Biểu đồ doanh thu (US-124)
* **Phương thức:** `GET /api/bao-cao/bieu-do-doanh-thu?soNgay=7`

#### 3. Xuất tệp CSV báo cáo (US-133, US-134)
* **Hóa đơn:** `GET /api/bao-cao/xuat-csv/hoa-don` ➔ Trả về file `.csv` tải về tự động.
* **Thực đơn:** `GET /api/bao-cao/xuat-csv/thuc-don` ➔ Trả về file `.csv` tải về tự động.
* *Đặc biệt:* Tệp CSV có mã hóa **UTF-8 with BOM (`\uFEFF`)**, mở trực tiếp trên Microsoft Excel tiếng Việt chuẩn 100% không bị vỡ font.
