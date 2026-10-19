1. nhân viên thu ngân:
- Tính năng 1: Quản lý Sơ đồ bàn (Table Management)

    Hiển thị danh sách các bàn dưới dạng Grid (lưới).

    Màu sắc bàn thay đổi theo trạng thái để dễ nhìn:

    Màu xám: Bàn trống.

    Màu xanh: Bàn đang có khách (đang dùng bữa).

    Màu cam chớp nháy: Bàn vừa ấn nút "Yêu cầu thanh toán" hoặc "Gọi nhân viên".

- Tính năng 2: Quản lý chi tiết Đơn hàng (Order Management)

    Click vào một bàn đang có khách, thu ngân sẽ xem được toàn bộ danh sách món khách đã gọi (cả các món đã ra và món đang kẹt trong bếp).

    Có quyền Thêm/Sửa/Xóa món (trong trường hợp khách không biết dùng điện thoại và gọi mồm, hoặc khách yêu cầu hủy món do đợi quá lâu).

- Tính năng 3: Xử lý Thanh toán & Tích điểm (Checkout & Loyalty)

    (Liên kết với luồng Khách hàng Member ở trên).

    Khi tính tiền, nếu là Khách vãng lai, thu ngân chỉ việc thu tiền.

    Nếu là Khách Member, thu ngân xin Số điện thoại của khách -> Nhập vào hệ thống -> Hệ thống hiển thị Tên khách + Điểm đang có. Thu ngân có thể nhập "Số điểm muốn trừ" để giảm giá cho khách.

    Sau khi bấm "Xác nhận thanh toán", hệ thống chuyển trạng thái Đơn hàng thành Đã hoàn thành, giải phóng bàn (chuyển màu bàn về Xám), và tự động cộng điểm cho khách.

- Tính năng 4: Lịch sử giao dịch ca làm việc (Shift History)

    Xem nhanh trong ca của mình đã thanh toán bao nhiêu đơn, tổng tiền thu được (Tiền mặt / Chuyển khoản) để cuối ngày chốt ca nộp lại cho Chủ nhà hàng.
2. nhân viên bếp
- Tính năng 1: Màn hình hiển thị Bếp (KDS - Kitchen Display System)

    Giao diện là một bảng Dashboard (thường chia làm các cột dạng Kanban như Trello).

    Hệ thống tự động hiển thị các món khách vừa đặt. Sắp xếp theo thứ tự thời gian: Đặt trước nấu trước (FIFO).

    Hiển thị rõ: Tên món, Số lượng, Số bàn, và Ghi chú của khách (VD: "Ít đường", "Không hành" - Rất quan trọng).

- Tính năng 2: Chuyển trạng thái món ăn (Item Status)

    Mỗi món ăn có 3 nút trạng thái:

    Chờ chế biến (Màu đỏ/vàng)

    Đang nấu (Màu xanh dương) -> Để các đầu bếp khác biết món này đã có người nhận làm.

    Đã xong / Chờ phục vụ (Màu xanh lá) -> Khi bấm nút này, hệ thống sẽ đẩy thông báo ra màn hình của phục vụ/thu ngân để mang đồ ra bàn cho khách.

- Tính năng 3: Gom nhóm món ăn (Bonus điểm cộng cho đồ án)

    Thay vì hiển thị: Bàn 1 gọi 1 Cơm rang, Bàn 3 gọi 1 Cơm rang. Hệ thống cho phép bếp bấm nút "Gom nhóm", hiển thị "Cơm rang: X 2" để đầu bếp rang 1 mẻ lớn luôn, giúp tối ưu thời gian.
3. quản lý nhà hàng
- tính năng 1: quản lý sản phẩm
    thêm/ sửa/ xóa các món ăn với các trường thông tin cơ bản
    ----> có thể quản lý trạng thái món ăn nhanh chóng bằng nút gạt
- tính năng 2: quản doanh thu
    Thống kê tổng quan (Widget/Thẻ tóm tắt): Hiển thị ngay trên cùng các con số: Doanh thu hôm nay, Doanh thu tuần này, Tổng số đơn hàng trong ngày.

    Lọc theo thời gian: Cho phép Admin chọn khoảng ngày (Từ ngày A đến ngày B) để xem tổng doanh thu kiếm được.
- tính năng 3: Quản lý Hóa đơn (Invoice / Order History)
    Nếu luồng "Thu ngân" chỉ quản lý hóa đơn trong ngày hoặc trong ca, thì Admin có quyền xem tất cả hóa đơn từ trước đến nay.

    Danh sách lịch sử: Bảng hiển thị các hóa đơn đã thanh toán thành công. Gồm: Mã hóa đơn, Thời gian, Tổng tiền, Tên Thu ngân thực hiện.

    Xem chi tiết: Bấm vào mã hóa đơn sẽ hiện ra popup (modal) ghi rõ hóa đơn đó bàn nào gọi, khách đã gọi những món gì, áp dụng mã giảm giá nào không.

    Tìm kiếm: Ô input để tra cứu nhanh hóa đơn theo Mã Hóa Đơn hoặc Số điện thoại của Khách hàng thành viên. (Tính năng này rất thực tế khi khách phàn nàn và cần đối soát lại bill cũ).
- tính năng 4:  Quản lý Nhân sự (Staff / HR Management)
    Tạo mới nhân viên: Admin điền Tên, Số điện thoại, Username và Password (mật khẩu này khi lưu xuống Database bạn nên dùng thư viện như bcrypt để mã hóa).

    Phân quyền (Role): Chọn vai trò cho nhân viên là Thu ngân (Cashier) hoặc Bếp (Kitchen). Tùy vào vai trò này, lúc nhân viên đăng nhập sẽ tự động chuyển hướng (redirect) đến màn hình làm việc tương ứng.

    Khóa tài khoản (Block/Ban): Thay vì xóa hẳn nhân viên đã nghỉ việc (sẽ làm lỗi lịch sử hóa đơn cũ do mất liên kết khóa ngoại), hãy làm nút "Khóa tài khoản" (Status = Active / Inactive).

    thông tin nhân viên: hiển thị thông tin cơ bản của nhân viên, chuyên cần , số công làm việc, lương thưởng và các chi phí phát sinh cho nhân viên

- tính năng 5:  Tiếp nhận Ý kiến khách hàng (Customer Feedback)
    Luồng từ khách: Sau khi Thu ngân bấm "Thanh toán", màn hình QR của khách sẽ hiện ra form đánh giá 1 đến 5 sao và ô nhập bình luận (Feedback).

    Màn hình Admin: Quản lý xem danh sách các đánh giá này.

    Bộ lọc thông minh: Cho phép Admin lọc "Chỉ xem các đánh giá 1-2 sao" để kịp thời phát hiện nhân viên thái độ kém hoặc món ăn có vấn đề và chấn chỉnh nhà hàng.

tính năng 6: Báo cáo (Analytics & Reporting)
    Khác với "Doanh thu" chỉ quan tâm đến tiền, "Báo cáo" đi sâu vào phân tích hiệu quả kinh doanh.

    Top món bán chạy nhất (Best Sellers): Viết câu lệnh truy vấn (SQL) nhóm (GROUP BY) các món ăn trong chi tiết hóa đơn, đếm số lượng bán ra và sắp xếp giảm dần (ORDER BY DESC). Hiển thị top 5 món bán chạy nhất tháng.

    Báo cáo tồn kho Ảo: Liệt kê các món đang bị đánh dấu là "Hết hàng" để nhắc nhở quản lý nhập thêm nguyên liệu.

    trực quan hóa báo cáo về kết quả kinh doanh, độ phủ sóng của cửa hàng, các món ăn bán chạy, độ hài lòng của nhân viên, khách hàng bằng bảng biểu trực quan hóa