#!/usr/bin/env bash

# Hướng dẫn Git Bash cho kho WebsiteQuanLyNhaHang.
# Kho GitHub của dự án đã được chọn; tên hiển thị dự án không đổi tên kho.

set -e
REPO=QUAN-LY-NHA-HANG-CMC/QUAN-LY-NHA-HANG

cat <<'HUONG_DAN'
HƯỚNG DẪN GIT BASH - WebsiteQuanLyNhaHang

Trước khi bắt đầu:
- Nhật cần có quyền quản trị kho GitHub và GitHub CLI (gh) đã đăng nhập.
- Không đổi tên kho GitHub chỉ để trùng với tên WebsiteQuanLyNhaHang.
- Hạn Sprint 1: 19/10/2026

Trong mỗi phiên Git Bash cần dùng các lệnh bên dưới, khai báo kho:

REPO=QUAN-LY-NHA-HANG-CMC/QUAN-LY-NHA-HANG

PHẦN A - Nhật khởi tạo kho và cấu hình nhánh

1. Nếu kho GitHub chưa được tạo, tạo kho rỗng trên GitHub với tên đã thống nhất.
Không chọn tạo README, .gitignore hay giấy phép mẫu nếu các tệp này đã có ở máy.

2. Mở Git Bash tại thư mục dự án, khởi tạo nhánh main và đẩy lên kho:

git init -b main
git add .
git commit -m "chore: khởi tạo cấu trúc dự án"
git remote add origin "https://github.com/$REPO.git"
git push -u origin main

3. Tạo develop từ main và đẩy lên:

git switch -c develop
git push -u origin develop

4. Cài GitHub CLI nếu chưa có, đăng nhập rồi chọn đúng kho:

gh auth login
gh repo set-default "$REPO"

5. Bật yêu cầu Pull Request, ít nhất một lượt phê duyệt và giải quyết hội thoại
cho cả main và develop. Chạy lệnh cho main, sau đó chạy lại cho develop:

BRANCH=main
gh api --method PUT "repos/$REPO/branches/$BRANCH/protection" --input - <<< '{"required_status_checks":null,"enforce_admins":true,"required_pull_request_reviews":{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":false},"restrictions":null,"required_linear_history":false,"allow_force_pushes":false,"allow_deletions":false,"block_creations":false,"required_conversation_resolution":true,"lock_branch":false,"allow_fork_syncing":true}'

BRANCH=develop
gh api --method PUT "repos/$REPO/branches/$BRANCH/protection" --input - <<< '{"required_status_checks":null,"enforce_admins":true,"required_pull_request_reviews":{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":false},"restrictions":null,"required_linear_history":false,"allow_force_pushes":false,"allow_deletions":false,"block_creations":false,"required_conversation_resolution":true,"lock_branch":false,"allow_fork_syncing":true}'

Nếu kho có quy trình CI, thay null của required_status_checks bằng danh sách
các kiểm tra bắt buộc đã xác nhận trên GitHub. Tài khoản cần quyền sửa quy tắc.

6. Thêm thành viên vào kho với quyền phù hợp; chia sẻ URL clone và quy ước
issue/PR. Nhật tạo issue và giao đúng người phụ trách.

PHẦN B - Minh, Phát, Phong và Quân clone và tạo nhánh công việc

1. Mỗi thành viên thực hiện:

git clone "https://github.com/$REPO.git"
cd QUAN-LY-NHA-HANG
git switch develop
git pull --ff-only origin develop

2. Tạo nhánh riêng từ develop, thay tên ví dụ bằng nội dung công việc không dấu.
Các phần trong ngoặc vuông là chỗ thay thế, không gõ nguyên dấu ngoặc:

# Backend: BE_[ten-module] hoặc feature/be-[ten-chuc-nang]
git switch -c BE_quanLyBan
# Hoặc: git switch -c feature/be-quan-ly-ban

# Frontend: fe-[ten-module] hoặc fe_ui_[ten-trang]
git switch -c fe-thuc-don
# Hoặc: git switch -c fe_ui_trang-thuc-don

# Cơ sở dữ liệu: db-[ten-noi-dung]
git switch -c db-luoc-do-ban

Chỉ chạy một lệnh tạo nhánh phù hợp với công việc. Dùng tên ngắn, không dấu.

3. Trong khi làm việc, xem trạng thái, thêm đúng tệp và commit:

# Ví dụ: thay đường dẫn bằng các tệp/thư mục của công việc đã rà soát.
git status
git add backend/modules/quanLyBan
git commit -m "feat: mô tả ngắn gọn"

Dùng tiền tố Conventional Commits phù hợp: feat, fix, docs, test, refactor,
chore. Không đưa mật khẩu, khóa bí mật hoặc dữ liệu khách hàng vào commit.

4. Đồng bộ thay đổi mới nhất từ develop trước khi mở PR:

git fetch origin
git merge origin/develop
# Nếu có xung đột, giải quyết từng tệp, kiểm tra lại rồi commit nếu cần.
git push -u origin HEAD

5. Thay #SO_ISSUE bằng mã issue thật; mở Pull Request hướng vào develop và điền
mô tả cùng cách kiểm tra:

gh pr create --base develop --title "feat: mô tả công việc" --body "Liên kết issue: #SO_ISSUE

Mô tả:
- ...

Cách kiểm tra:
- ..."

Chờ thành viên khác xem xét, xử lý ý kiến và bảo đảm các kiểm tra bắt buộc đạt.
Không tự merge nếu không được giao quyền/quy trình cho phép.

6. Sau khi PR được merge, cập nhật develop và xóa nhánh công việc cũ:

git switch develop
git pull --ff-only origin develop
git branch -d BE_quanLyBan

Nếu dùng nhánh khác, thay BE_quanLyBan bằng tên nhánh đó.

Nếu nhánh đã được xóa trên GitHub và muốn xóa tham chiếu cũ ở máy:
git fetch --prune

QUY TRÌNH PHÁT HÀNH

Nhật mở PR từ develop vào main khi Sprint đủ điều kiện phát hành, tóm tắt thay đổi,
kiểm tra và liên kết issue. Quy tắc bảo vệ main vẫn được áp dụng; chỉ merge sau khi
được xem xét và các kiểm tra bắt buộc đều đạt.
HUONG_DAN
