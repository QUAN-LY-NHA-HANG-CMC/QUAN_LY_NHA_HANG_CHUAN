# Hướng dẫn sao lưu CSDL Sprint 4

## Nguyên tắc

- Không đưa thông tin thật, mật khẩu, token hoặc dữ liệu khách hàng vào bản sao lưu dùng để chia sẻ.
- Sao lưu trước mỗi migration và giữ ít nhất một bản backup ngoài máy chủ ứng dụng.
- Kiểm tra khôi phục thử định kỳ; backup chưa được kiểm tra khôi phục thì chưa được xem là backup hợp lệ.

## SQLite phát triển

```bash
sqlite3 database/quan_ly_nha_hang.sqlite ".backup 'backup/quan_ly_nha_hang_YYYYMMDD.sqlite'"
```

## CSDL cloud

Nhật cần chốt MySQL hoặc PostgreSQL trước khi triển khai production. Trên cloud, cấu hình backup tự động hằng ngày, lưu bản backup mã hóa, giới hạn quyền tài khoản ứng dụng và ghi lại lần khôi phục thử trong tài liệu triển khai. Các file `sprint04_*.sql` hiện dùng cú pháp SQLite và cần được chuyển đổi dialect trước khi chạy trên MySQL/PostgreSQL.
