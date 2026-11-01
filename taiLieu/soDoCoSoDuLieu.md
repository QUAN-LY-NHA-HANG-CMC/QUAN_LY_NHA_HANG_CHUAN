# ERD Sprint 1 và Sprint 2 - Cơ sở dữ liệu nền tảng và đặt món

## Phạm vi

Schema này phục vụ US-001–US-044: xác thực/tài khoản, nhân viên và phân quyền, khu vực–bàn–QR, danh mục–món ăn–tùy chọn, cấu hình nhà hàng và nhật ký hệ thống.

## Quan hệ chính

```text
vai_tro 1---n nhan_vien n---1 tai_khoan
vai_tro n---n quyen_han (vai_tro_quyen_han)
tai_khoan 1---n phien_dang_nhap
khu_vuc 1---n ban_an 1---1 ma_qr_ban
danh_muc_mon 1---n mon_an 1---n hinh_anh_mon_an
mon_an 1---n nhom_tuy_chon_mon 1---n tuy_chon_mon
tai_khoan 1---n nhat_ky_he_thong
```

## ERD Sprint 2

```text
ban_an 1---n phien_phuc_vu 1---n don_hang 1---n chi_tiet_don_hang
phien_phuc_vu 1---n gio_hang 1---n gio_hang_item
gio_hang_item 1---n gio_hang_item_tuy_chon
chi_tiet_don_hang 1---n chi_tiet_don_hang_tuy_chon
don_hang 1---n lich_su_trang_thai_don_hang
phien_phuc_vu 1---n yeu_cau_ho_tro_ban
phien_phuc_vu 1---n thong_bao_thoi_gian_thuc
mon_an 1---n gio_hang_item
mon_an 1---n chi_tiet_don_hang
```

Các file Sprint 2 chạy sau toàn bộ migration Sprint 1:

1. `database/sprint02_taoBang.sql`
2. `database/sprint02_rangBuoc.sql`
3. `database/sprint02_chiMuc.sql`
4. `database/sprint02_duLieuMau.sql`
5. Không chạy `database/sprint02_giaoDich.sql` như seed; đây là kịch bản transaction để Backend ánh xạ vào service.

`database/sprint02_giaoDich.sql` là kịch bản tham chiếu cho service tạo đơn. Backend cần dùng idempotency key, tính tiền từ snapshot server và chỉ phát Socket event sau khi `COMMIT` thành công.

## Quy ước

- Tên bảng/cột dùng tiếng Việt không dấu và `snake_case` theo quy ước dự án.
- Trạng thái dùng chuỗi để API dễ ánh xạ: `HoatDong`, `Khoa`, `DangBan`, `TamHet`, `Trong`, `DaXoa`.
- Mật khẩu và refresh token chỉ lưu dạng hash; dữ liệu mẫu dùng email `.test` và token dành riêng cho phát triển.
- SQLite bật `PRAGMA foreign_keys = ON`; khi chuyển sang MySQL/PostgreSQL cần ánh xạ `INTEGER PRIMARY KEY AUTOINCREMENT` và `CURRENT_TIMESTAMP` tương ứng.

## Cách khởi tạo

Chạy lần lượt `taoBang.sql`, `rangBuoc.sql`, `chiMuc.sql`, `duLieuMau.sql`, sau đó 4 migration Sprint 2 ở trên. Các script tạo bảng, trigger, index và seed dùng `IF NOT EXISTS`/`INSERT OR IGNORE` để có thể chạy lại an toàn trong môi trường phát triển.
