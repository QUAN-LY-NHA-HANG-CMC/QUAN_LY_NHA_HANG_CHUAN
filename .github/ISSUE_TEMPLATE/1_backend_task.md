---
name: "1. Công việc Backend"
about: "Mẫu giao việc API, nghiệp vụ hoặc tác vụ nền cho Sprint 1"
title: "[Backend] "
assignees: []
---

## Thông tin công việc

- **Mã issue / User Story:** US-___
- **Người phụ trách:** Nhật (`@dinhvietlongnhat`) / Minh (`@[username-minh]`) — ghi rõ một người nhận việc
- **Vai trò:** PM & Backend Core / Backend API Dev
- **Hạn Sprint 1:** 19/10/2026
- **Nhánh dự kiến:** `BE_[ten-module]` hoặc `feature/be-[ten-chuc-nang]`
- **Thư mục/tệp mục tiêu:** `backend/modules/___`, `backend/cauHinh/___`, `backend/middleware/___`, `backend/tienIch/___` hoặc `backend/tacVuNen/___`

## Mô tả và phạm vi

Nêu vấn đề cần giải quyết, người dùng bị ảnh hưởng, luồng nghiệp vụ và phạm vi không thuộc công việc này.

## Yêu cầu API / nghiệp vụ

- **Điểm cuối hoặc sự kiện:** `___`
- **Dữ liệu đầu vào:** `___`
- **Quy tắc kiểm tra và phân quyền:** `___`
- **Kết quả mong đợi:** `___`
- **Phản hồi API:** `{ok,data,msg}`
- **Lỗi và trường hợp biên:** `___`

## Tiêu chí nghiệm thu

- [ ] Hoàn thành đúng luồng nghiệp vụ và phạm vi của User Story.
- [ ] Kiểm tra dữ liệu đầu vào, quyền truy cập và các trường hợp lỗi liên quan.
- [ ] API trả cấu trúc `{ok,data,msg}` nhất quán cho cả thành công và lỗi.
- [ ] Không ghi thông tin nhạy cảm vào phản hồi hoặc nhật ký.
- [ ] Có kiểm thử phù hợp và các kiểm thử liên quan chạy đạt.
- [ ] Tài liệu API/cấu hình được cập nhật nếu có thay đổi.
- [ ] PR liên kết issue, hướng về `develop`, có người khác xem xét và không còn lỗi xung đột.

## Danh sách công việc

- [ ] Xác nhận yêu cầu, phụ thuộc và phạm vi với PM/nhóm liên quan.
- [ ] Tạo nhánh từ `develop` theo một trong các mẫu nhánh Backend.
- [ ] Kiểm tra quy ước tên tiếng Việt không dấu camelCase cho thư mục, tệp và định danh JavaScript.
- [ ] Triển khai xử lý nghiệp vụ trong đúng module.
- [ ] Bổ sung kiểm tra đầu vào, phân quyền và xử lý lỗi.
- [ ] Tích hợp cơ sở dữ liệu hoặc Socket.io nếu thuộc phạm vi.
- [ ] Viết hoặc cập nhật kiểm thử trong `kiemThu/`.
- [ ] Chạy kiểm thử và rà soát thay đổi trước khi tạo PR.
- [ ] Tạo PR vào `develop`, liên kết issue và cung cấp hướng dẫn kiểm tra.
- [ ] Xử lý góp ý xem xét và xác nhận hoàn tất với người phụ trách.

## Ghi chú / phụ thuộc

Ghi API, bảng dữ liệu, giao diện, quyết định nghiệp vụ hoặc issue phụ thuộc: `___`
