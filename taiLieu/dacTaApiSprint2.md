# TÀI LIỆU ĐẶC TẢ API SPRINT 2 (DÀNH CHO FRONTEND)
> **Dự án:** Hệ thống Quản lý Nhà hàng & Gọi món QR (QUANMOC.COM)  
> **Người phụ trách Backend:** Minh  
> **Người nhận (Frontend):** Quân (Mobile E-Menu / Giỏ hàng) & Phong (Theo dõi đơn / Hỗ trợ)  
> **Định dạng phản hồi chung:**
> ```json
> // Thành công:
> { "ok": true, "data": { ... }, "msg": "Thông báo thành công" }
> // Lỗi:
> { "ok": false, "data": null, "msg": "Mô tả lỗi cụ thể" }
> ```

---

## 📱 PHẦN 1: BỘ API THỰC ĐƠN ĐIỆN TỬ E-MENU (PUBLIC CHO KHÁCH)
*Khách hàng quét mã QR tại bàn, trình duyệt không cần gửi header Authorization.*

### 1. Khởi tạo / Xem trang chủ E-Menu
* **Mục đích (US-050):** Lấy thông tin bàn, khu vực và toàn bộ thực đơn khi khách vừa quét mã QR.
* **Method:** `GET`
* **URL:** `/api/public/e-menu`
* **Query Params:**
  - `banId`: (bắt buộc) ID của bàn (ví dụ: `1`)
  - `token`: (bắt buộc) Mã token bảo mật của bàn (ví dụ: `a405d1729525dfb8e91350df4e32b0da`)
* **Phản hồi mẫu (200 OK):**
```json
{
  "ok": true,
  "data": {
    "nhaHang": {
      "tenQuan": "Nhà Hàng Quán Mộc",
      "diaChi": "123 Đường Ẩm Thực, Quận 1, TP.HCM",
      "hotline": "1900 6868",
      "banner": "/tepTaiLen/banner-quanmoc.jpg"
    },
    "thongTinBan": {
      "banId": 1,
      "maBan": "B101",
      "tenBan": "Bàn 01",
      "tenKhuVuc": "Tầng 1 - Sảnh chính"
    },
    "danhMuc": [
      { "id": 1, "tenDanhMuc": "Khai vị", "thuTuHienThi": 1 },
      { "id": 2, "tenDanhMuc": "Món chính", "thuTuHienThi": 2 }
    ],
    "monBanChay": [
      {
        "id": 1,
        "tenMon": "Gỏi Bò Bóp Thấu",
        "giaBan": 95000,
        "donViTinh": "Đĩa",
        "hinhAnh": "/tepTaiLen/anhMonAn/goi-bo.jpg",
        "trangThai": "DangBan",
        "laMonBanChay": true
      }
    ]
  },
  "msg": "Lấy thông tin E-Menu thành công"
}
```

---

### 2. Danh sách món ăn (Lọc & Tìm kiếm)
* **Mục đích (US-051, US-053, US-054, US-056):** Duyệt món theo tab danh mục, tìm kiếm theo tên hoặc lọc theo mức giá.
* **Method:** `GET`
* **URL:** `/api/public/e-menu/mon-an`
* **Query Params:**
  - `danhMucId`: (tùy chọn) ID danh mục cần lọc (ví dụ: `1`)
  - `tuKhoa`: (tùy chọn) Từ khóa tìm kiếm (ví dụ: `Bò`)
  - `giaMin`: (tùy chọn) Giá thấp nhất (ví dụ: `50000`)
  - `giaMax`: (tùy chọn) Giá cao nhất (ví dụ: `200000`)
* **Phản hồi mẫu (200 OK):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 2,
      "tenMon": "Bò Tơ Hấp Cuốn Bánh Tráng",
      "danhMucId": 2,
      "giaBan": 185000,
      "donViTinh": "Phần",
      "hinhAnh": "/tepTaiLen/anhMonAn/bo-to-hap.jpg",
      "moTa": "Bò tơ mềm ngọt cuốn rau rừng Tây Ninh chấm mắm nêm đặc sản.",
      "trangThai": "DangBan",
      "laMonBanChay": true
    },
    {
      "id": 3,
      "tenMon": "Lẩu Bò Nhúng Dấm",
      "danhMucId": 3,
      "giaBan": 295000,
      "donViTinh": "Nồi",
      "hinhAnh": "/tepTaiLen/anhMonAn/lau-bo.jpg",
      "moTa": "Nước lẩu chua thanh dịu nhẹ.",
      "trangThai": "TamHet",
      "laMonBanChay": false
    }
  ],
  "msg": "Lấy danh sách món ăn thành công"
}
```
> ⚠️ **Lưu ý cho FE:** Nếu `trangThai === "TamHet"`, FE cần làm mờ thẻ món ăn, hiển thị nhãn "Tạm hết hàng" và khóa nút click/thêm vào giỏ hàng.

---

### 3. Chi tiết món ăn & Tùy chọn (Size / Topping)
* **Mục đích (US-055):** Hiển thị Popup / Bottom Sheet khi khách bấm chọn món để chọn kích cỡ, món thêm và ghi chú.
* **Method:** `GET`
* **URL:** `/api/public/e-menu/mon-an/:id`
* **Phản hồi mẫu (200 OK):**
```json
{
  "ok": true,
  "data": {
    "id": 2,
    "tenMon": "Bò Tơ Hấp Cuốn Bánh Tráng",
    "danhMucId": 2,
    "giaBan": 185000,
    "donViTinh": "Phần",
    "hinhAnh": "/tepTaiLen/anhMonAn/bo-to-hap.jpg",
    "moTa": "Bò tơ mềm ngọt cuốn rau rừng Tây Ninh.",
    "trangThai": "DangBan",
    "tuyChon": [
      {
        "tenNhom": "Kích cỡ",
        "batBuoc": true,
        "loai": "ChonMot",
        "danhSach": [
          { "ten": "Phần vừa (2 người)", "giaThem": 0 },
          { "ten": "Phần lớn (4 người)", "giaThem": 80000 }
        ]
      },
      {
        "tenNhom": "Món thêm",
        "batBuoc": false,
        "loai": "ChonNhieu",
        "danhSach": [
          { "ten": "Thêm bánh tráng", "giaThem": 10000 },
          { "ten": "Thêm rau rừng", "giaThem": 20000 }
        ]
      }
    ]
  },
  "msg": "Lấy chi tiết món ăn thành công"
}
```

---

## 🛒 PHẦN 2: BỘ API KIỂM TRA GIỎ HÀNG & TÍNH TIỀN (SERVER-SIDE)

### 4. Kiểm tra tính hợp lệ & Tính tổng tiền giỏ hàng
* **Mục đích (US-057 ➔ US-062):** Trước khi khách bấm gửi đơn, FE gửi toàn bộ danh sách giỏ hàng lên. Backend sẽ kiểm tra món còn bán không và **tính toán lại giá tiền chuẩn từ CSDL**, trả về tổng tiền tạm tính chính xác.
* **Method:** `POST`
* **URL:** `/api/gio-hang/kiem-tra-va-tinh-tien`
* **Request Body:**
```json
{
  "banId": 1,
  "token": "a405d1729525dfb8e91350df4e32b0da",
  "danhSachMon": [
    {
      "monAnId": 2,
      "soLuong": 2,
      "tuyChonChon": [
        { "tenNhom": "Kích cỡ", "ten": "Phần lớn (4 người)" },
        { "tenNhom": "Món thêm", "ten": "Thêm rau rừng" }
      ],
      "ghiChu": "Ít cay, không hành"
    },
    {
      "monAnId": 1,
      "soLuong": 1,
      "tuyChonChon": [],
      "ghiChu": "Mang ra trước"
    }
  ]
}
```
* **Phản hồi thành công (200 OK):**
```json
{
  "ok": true,
  "data": {
    "danhSachHopLe": [
      {
        "monAnId": 2,
        "tenMon": "Bò Tơ Hấp Cuốn Bánh Tráng",
        "donGiaGoc": 185000,
        "tienTuyChon": 100000,
        "donGiaTong": 285000,
        "soLuong": 2,
        "thanhTien": 570000,
        "ghiChu": "Ít cay, không hành"
      },
      {
        "monAnId": 1,
        "tenMon": "Gỏi Bò Bóp Thấu",
        "donGiaGoc": 95000,
        "tienTuyChon": 0,
        "donGiaTong": 95000,
        "soLuong": 1,
        "thanhTien": 95000,
        "ghiChu": "Mang ra trước"
      }
    ],
    "tongSoLuongMon": 3,
    "tongTienTamTinh": 665000
  },
  "msg": "Giỏ hàng hợp lệ"
}
```
* **Phản hồi lỗi nếu có món đã hết hàng (400 Bad Request):**
```json
{
  "ok": false,
  "data": {
    "danhSachMonHetHang": [
      { "monAnId": 3, "tenMon": "Lẩu Bò Nhúng Dấm" }
    ]
  },
  "msg": "Món 'Lẩu Bò Nhúng Dấm' vừa hết hàng. Vui lòng xóa khỏi giỏ để tiếp tục."
}
```

---

## 🔔 PHẦN 3: BỘ API YÊU CẦU HỖ TRỢ TẠI BÀN (GỌI NV / THANH TOÁN)

### 5. Gửi yêu cầu hỗ trợ (Khách hàng gọi phục vụ / gọi tính tiền)
* **Mục đích (US-071 ➔ US-073):** Khách tại bàn bấm nút nổi "Gọi nhân viên" hoặc "Yêu cầu thanh toán".
* **Method:** `POST`
* **URL:** `/api/yeu-cau-ho-tro`
* **Request Body (Gọi nhân viên):**
```json
{
  "banId": 1,
  "token": "a405d1729525dfb8e91350df4e32b0da",
  "loaiYeuCau": "GoiNhanVien",
  "lyDo": "Xin thêm khăn giấy và đá",
  "ghiChu": "Bàn có trẻ nhỏ"
}
```
* **Request Body (Yêu cầu thanh toán):**
```json
{
  "banId": 1,
  "token": "a405d1729525dfb8e91350df4e32b0da",
  "loaiYeuCau": "YeuCauThanhToan",
  "phuongThucThanhToan": "ChuyenKhoan", 
  "ghiChu": "Cho xin mã VietQR"
}
```
*(Ghi chú: `phuongThucThanhToan` nhận: `"TienMat"` hoặc `"ChuyenKhoan"`)*

* **Phản hồi thành công (201 Created):**
```json
{
  "ok": true,
  "data": {
    "id": 12,
    "banId": 1,
    "maBan": "B101",
    "tenBan": "Bàn 01",
    "loaiYeuCau": "GoiNhanVien",
    "lyDo": "Xin thêm khăn giấy và đá",
    "trangThai": "ChoXuLy",
    "thoiGianTao": "2026-10-26T08:00:00.000Z"
  },
  "msg": "Yêu cầu của quý khách đã được gửi tới nhân viên!"
}
```

---

### 6. Danh sách yêu cầu hỗ trợ (Dành cho Màn hình Thu ngân / Phục vụ)
* **Mục đích:** Nhân viên theo dõi các bàn đang cần phục vụ.
* **Method:** `GET`
* **URL:** `/api/yeu-cau-ho-tro?trangThai=ChoXuLy`
* **Header:** `Authorization: Bearer <TOKEN_NHAN_VIEN>`
* **Phản hồi mẫu (200 OK):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 12,
      "banId": 1,
      "maBan": "B101",
      "tenBan": "Bàn 01",
      "loaiYeuCau": "GoiNhanVien",
      "lyDo": "Xin thêm khăn giấy và đá",
      "trangThai": "ChoXuLy",
      "thoiGianTao": "2026-10-26T08:00:00.000Z"
    }
  ],
  "msg": "Lấy danh sách yêu cầu hỗ trợ thành công"
}
```

---

### 7. Nhân viên Tiếp nhận / Hoàn thành yêu cầu (US-074)
* **Method:** `PATCH`
* **URL:** `/api/yeu-cau-ho-tro/:id/trang-thai`
* **Header:** `Authorization: Bearer <TOKEN_NHAN_VIEN>`
* **Request Body:**
```json
{
  "trangThai": "DangXuLy"
}
```
*(Các trạng thái cho phép: `"ChoXuLy"`, `"DangXuLy"`, `"DaHoanThanh"`, `"HuyBo"`)*
* **Phản hồi thành công (200 OK):**
```json
{
  "ok": true,
  "data": {
    "id": 12,
    "trangThai": "DangXuLy",
    "thoiGianCapNhat": "2026-10-26T08:02:15.000Z"
  },
  "msg": "Đã cập nhật trạng thái yêu cầu"
}
```
