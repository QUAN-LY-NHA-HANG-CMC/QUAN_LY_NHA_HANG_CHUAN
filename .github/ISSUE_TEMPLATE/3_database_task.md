---
name: "3. Công việc Cơ sở dữ liệu"
about: "Mẫu thiết kế ERD, lược đồ và dữ liệu mẫu cho Sprint 1"
title: "[Database] "
assignees: []
---

## Thông tin công việc

- **Mã issue / User Story:** US-___ (ghi các US-001–US-044 có liên quan)
- **Người phụ trách:** Phát (`@[username-phat]`)
- **Vai trò:** DBA
- **Hạn Sprint 1:** 19/10/2026
- **Nhánh dự kiến:** `db-[ten-noi-dung]`
- **Thư mục/tệp mục tiêu:** `database/`, `taiLieu/` (ERD)
- **Tệp dự kiến:** ERD; `taoBang.sql`, `rangBuoc.sql`, `chiMuc.sql`, `duLieuMau.sql` theo phạm vi

## Mô tả và phạm vi

Nêu nghiệp vụ cần lưu trữ, các US được hỗ trợ, quy tắc lưu giữ dữ liệu và phạm vi không thuộc công việc này.

## Thiết kế dữ liệu

- **Hệ quản trị mục tiêu:** MySQL / PostgreSQL (xác nhận lựa chọn trước khi viết cú pháp phụ thuộc hệ quản trị)
- **Thực thể và quan hệ:** `___`
- **Khóa chính / khóa ngoại:** `___`
- **Ràng buộc nghiệp vụ:** `___`
- **Chỉ mục và lý do:** `___`
- **Dữ liệu mẫu cần thiết:** `___`
- **Ảnh hưởng API / di trú dữ liệu:** `___`

## Tiêu chí nghiệm thu

- [ ] ERD thể hiện đầy đủ thực thể, thuộc tính chính, quan hệ và lực lượng quan hệ.
- [ ] Tên bảng và cột dùng tiếng Việt không dấu theo snake_case.
- [ ] `taoBang.sql` tạo được cấu trúc cho hệ quản trị đã thống nhất.
- [ ] `rangBuoc.sql` khai báo ràng buộc và khóa ngoại theo nghiệp vụ.
- [ ] `chiMuc.sql` chỉ mục hỗ trợ truy vấn cần thiết, không thêm chỉ mục không có lý do.
- [ ] `duLieuMau.sql` dùng dữ liệu giả lập, không chứa dữ liệu cá nhân hoặc bí mật thật.
- [ ] Các script có thể áp dụng theo đúng thứ tự và có thể kiểm tra trên môi trường mục tiêu.
- [ ] Tài liệu giải thích các quyết định dữ liệu và ảnh hưởng tới API/US.
- [ ] PR liên kết issue, hướng về `develop` và được thành viên khác xem xét.

## Danh sách công việc

- [ ] Thu thập yêu cầu dữ liệu từ các US-001–US-044 và nhóm Backend/Frontend.
- [ ] Xác nhận MySQL hoặc PostgreSQL cùng phiên bản mục tiêu.
- [ ] Vẽ/cập nhật ERD và rà soát quan hệ với nhóm.
- [ ] Tạo/cập nhật `database/taoBang.sql`.
- [ ] Tạo/cập nhật `database/rangBuoc.sql`.
- [ ] Tạo/cập nhật `database/chiMuc.sql`.
- [ ] Tạo/cập nhật `database/duLieuMau.sql` bằng dữ liệu giả lập.
- [ ] Kiểm tra thứ tự chạy script, tính toàn vẹn tham chiếu và ràng buộc.
- [ ] Đối chiếu tên bảng/cột theo snake_case và cập nhật tài liệu trong `taiLieu/`.
- [ ] Tạo PR vào `develop`, liên kết issue và nêu cách áp dụng/kiểm tra script.
- [ ] Xử lý góp ý xem xét và xác nhận hoàn tất với người phụ trách.

## Ghi chú / phụ thuộc

Ghi hệ quản trị đã chọn, truy vấn cần tối ưu, quyết định nghiệp vụ hoặc issue phụ thuộc: `___`
