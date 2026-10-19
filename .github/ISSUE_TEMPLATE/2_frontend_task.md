---
name: "2. Công việc Frontend"
about: "Mẫu giao việc giao diện quản trị, xác thực, bàn QR hoặc thực đơn"
title: "[Frontend] "
assignees: []
---

## Thông tin công việc

- **Mã issue / User Story:** US-___
- **Người phụ trách:** Phong (`@[username-phong]`) / Quân (`@[username-quan]`) — ghi rõ một người nhận việc
- **Vai trò:** Frontend Admin/Auth / Frontend Table QR & Menu
- **Hạn Sprint 1:** 19/10/2026
- **Nhánh dự kiến:** `fe-[ten-module]` hoặc `fe_ui_[ten-trang]`
- **Thư mục/tệp mục tiêu:** `frontend/trang/___`, `frontend/thanhPhan/___`, `frontend/dungChung/___`, `frontend/dinhTuyen/___`

## Mô tả và phạm vi

Nêu màn hình hoặc hành trình người dùng cần thực hiện, vai trò sử dụng và phạm vi không thuộc công việc này.

## Hành vi giao diện

- **Trang / thành phần:** `___`
- **Người dùng và quyền truy cập:** `___`
- **Trạng thái tải, rỗng, thành công và lỗi:** `___`
- **Tương tác / điều hướng:** `___`
- **API hoặc sự kiện Socket.io liên quan:** `___`

## Tiêu chí nghiệm thu

- [ ] Hoàn thành đúng hành trình và tiêu chí User Story.
- [ ] Bao gồm trạng thái đang tải, không có dữ liệu, thành công và lỗi thích hợp.
- [ ] Điều hướng và thao tác chỉ khả dụng với vai trò phù hợp.
- [ ] Dữ liệu API được xử lý theo cấu trúc `{ok,data,msg}`.
- [ ] Bố cục dùng được trên kích thước màn hình phù hợp với nghiệp vụ.
- [ ] Đặt tên thư mục, tệp và định danh JavaScript bằng tiếng Việt không dấu camelCase.
- [ ] Có kiểm thử phù hợp hoặc hướng dẫn kiểm tra thao tác.
- [ ] PR liên kết issue, hướng về `develop` và được thành viên khác xem xét.

## Danh sách công việc

- [ ] Xác nhận nội dung thiết kế, quyền truy cập và dữ liệu cần hiển thị.
- [ ] Tạo nhánh từ `develop` theo một trong các mẫu nhánh Frontend.
- [ ] Tạo/cập nhật trang trong `frontend/trang/`.
- [ ] Tạo/cập nhật thành phần dùng chung trong `frontend/thanhPhan/` hoặc `frontend/dungChung/`.
- [ ] Cập nhật tuyến trong `frontend/dinhTuyen/` nếu cần.
- [ ] Tích hợp API hoặc cập nhật giao diện khi nhận sự kiện Socket.io nếu thuộc phạm vi.
- [ ] Xử lý tải, rỗng, thành công, lỗi và quyền truy cập.
- [ ] Kiểm tra luồng thao tác và kích thước màn hình liên quan.
- [ ] Tạo PR vào `develop`, liên kết issue và mô tả cách kiểm tra.
- [ ] Xử lý góp ý xem xét và xác nhận hoàn tất với người phụ trách.

## Ghi chú / phụ thuộc

Ghi API, thiết kế, nội dung, quy tắc phân quyền hoặc issue phụ thuộc: `___`
