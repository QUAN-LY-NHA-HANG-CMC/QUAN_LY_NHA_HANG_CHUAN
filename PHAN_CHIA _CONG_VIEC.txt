================================================================================
              KẾ HOẠCH PHÂN CÔNG CÔNG VIỆC NHÓM (5 THÀNH VIÊN)
        DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR (QUANMOC.COM)
================================================================================

DANH SÁCH THÀNH VIÊN & VAI TRÒ CHÍNH:
1. Nhật  : Trưởng nhóm (Team Lead / PM), phụ trách Kiến trúc Backend, API & Real-time.
2. Minh  : Phụ trách phát triển Backend & RESTful API nghiệp vụ.
3. Phát  : Phụ trách Cơ sở dữ liệu (Thiết kế ERD, Schema, Transaction, Query Optimization).
4. Phong : Phụ trách Frontend (Admin Layout, Real-time Order, Bếp KDS, Dashboard Báo cáo).
5. Quân  : Phụ trách Frontend (Quản lý Bàn/Menu, Web Khách hàng E-Menu QR, POS Thu ngân).


================================================================================
SPRINT 1: NỀN TẢNG, TÀI KHOẢN, PHÂN QUYỀN, SƠ ĐỒ BÀN VÀ THỰC ĐƠN
Thời gian: Tuần 1
================================================================================

1. PHÁT (DATABASE)
- Nhiệm vụ chính: Thiết kế ERD Sprint 1, khởi tạo CSDL nền tảng và dữ liệu mẫu (Seed Data).
- Hạng mục ERD & Bảng dữ liệu phụ trách:
  + Tài khoản, hồ sơ nhân viên, phiên đăng nhập và xác thực.
  + Vai trò, quyền hạn và các bảng trung gian liên kết tài khoản - vai trò - quyền hạn.
  + Khu vực / Tầng phục vụ, Bàn ăn và mã QR định danh bàn.
  + Danh mục thực đơn, Món ăn, Hình ảnh món ăn và Tùy chọn đi kèm (Size, Topping, Đá/Đường/Độ cay).
  + Nhật ký hệ thống (System Logs) và Cấu hình thông tin nhà hàng dùng chung.
- Mã công việc phối hợp dữ liệu: Hỗ trợ cấu trúc bảng cho US-001 đến US-044.
- Sản phẩm bàn giao: Bản vẽ ERD Sprint 1 hoàn chỉnh, file SQL/Migration khởi tạo CSDL.

2. NHẬT (TRƯỞNG NHÓM / PM, BACKEND & API)
- Nhiệm vụ Quản lý dự án (PM):
  + Khởi tạo Git Repository, dựng khung dự án (Boilerplate) cho Backend và Frontend.
  + Thống nhất chuẩn RESTful API, quy tắc đặt tên nhánh Git, review Pull Request (PR) và theo dõi tiến độ tuần 1.
- Nhiệm vụ Backend & API:
  + Bảo mật nền tảng (US-001 -> US-006): Mã hóa mật khẩu băm (bcrypt), xác thực JWT/Session Token, cơ chế Refresh Token, Middleware chặn truy cập trái phép, Rate Limiting và Input Validation.
  + Tài khoản cá nhân (US-007 -> US-010): API đăng nhập, đăng xuất, đổi mật khẩu, xem và cập nhật hồ sơ cá nhân.
  + Vai trò và quyền hạn (US-015 -> US-022): API xem/tạo/sửa vai trò, gán vai trò cho nhân viên, cấu hình quyền truy cập chi tiết (Quản lý, Thu ngân, Bếp, Phục vụ) và lưu lịch sử thay đổi quyền.
  + Quản trị nền tảng (US-041 -> US-044): API cấu hình thông tin nhà hàng, thuế VAT/phí phục vụ, tài khoản ngân hàng VietQR và truy xuất nhật ký hệ thống (System Logs).
- Sản phẩm bàn giao: Khung project Backend, bộ API Auth/RBAC/System Config và tài liệu API (Swagger/Postman).

3. MINH (BACKEND & API)
- Nhiệm vụ chính: Xây dựng các API quản lý hồ sơ nhân sự, sơ đồ bàn/mã QR và danh mục thực đơn.
- Mã User Story phụ trách (BE):
  + Quản lý hồ sơ nhân sự (US-011 -> US-014): API tạo tài khoản nhân viên mới, lấy danh sách/tìm kiếm nhân viên, cập nhật thông tin/đặt lại mật khẩu, khóa/mở khóa tài khoản nghỉ việc.
  + Khu vực và sơ đồ bàn (US-023 -> US-030): API thêm/sửa/xóa khu vực và bàn ăn, tự động sinh URL định danh & mã QR riêng cho từng bàn, làm mới token bảo mật QR bàn.
  + Danh mục và thực đơn (US-031 -> US-040): API CRUD danh mục món ăn, CRUD món ăn (có phân trang, bộ lọc), API upload hình ảnh món ăn, thiết lập tùy chọn (size, topping), bật/tắt nhanh trạng thái "Đang bán"/"Tạm hết", đánh dấu món bán chạy và xóa mềm (ẩn) món ăn.
- Sản phẩm bàn giao: Bộ API Nhân sự, Bàn ăn, Mã QR và Thực đơn hoạt động chuẩn xác.

4. PHONG (FRONTEND)
- Nhiệm vụ chính: Xây dựng khung giao diện Quản trị (Admin), màn hình Xác thực, Quản lý nhân sự, Phân quyền và Cấu hình hệ thống.
- Mã User Story phụ trách (FE):
  + Khung nền tảng & Bảo mật FE (US-003, US-004, US-019 -> US-021): Dựng Admin Layout (Sidebar, Header), cấu hình Router, lưu trữ Token và phân luồng hiển thị menu theo đúng quyền (Quản lý, Thu ngân, Bếp).
  + Giao diện Tài khoản & Nhân sự (US-007 -> US-014): Trang Đăng nhập, Đăng xuất, Hồ sơ cá nhân, Đổi mật khẩu; Trang danh sách, tìm kiếm, thêm mới và khóa/mở khóa tài khoản nhân viên.
  + Giao diện Vai trò & Quyền hạn (US-015 -> US-018, US-022): Trang quản lý vai trò, bảng tích chọn phân quyền chức năng và xem lịch sử phân quyền.
  + Giao diện Quản trị nền tảng (US-041 -> US-044): Trang cấu hình thông tin quán, thuế VAT, ngân hàng VietQR và bảng tra cứu System Logs.
- Sản phẩm bàn giao: Giao diện Admin Core, module Auth, Nhân sự và Cấu hình.

5. QUÂN (FRONTEND)
- Nhiệm vụ chính: Xây dựng giao diện Quản lý Khu vực, Sơ đồ bàn, Xuất mã QR và Quản lý Thực đơn.
- Mã User Story phụ trách (FE):
  + Giao diện Khu vực & Sơ đồ bàn (US-023 -> US-030): Trang quản lý khu vực/tầng, danh sách bàn ăn, modal thêm/sửa/xóa bàn; Giao diện xem trước, tải xuống và in hàng loạt mã QR của từng bàn.
  + Giao diện Danh mục & Thực đơn (US-031 -> US-040): Trang quản lý danh mục (kéo thả/sắp xếp thứ tự hiển thị); Trang danh sách món ăn phía Admin (tìm kiếm, lọc theo danh mục/trạng thái); Form thêm/sửa món ăn kèm upload ảnh, cấu hình Size/Topping, nút gạt (Toggle) bật/tắt nhanh trạng thái "Đang bán/Tạm hết" và gắn nhãn "Món bán chạy".
- Sản phẩm bàn giao: Giao diện Quản lý Bàn/QR và Quản lý Thực đơn hoàn chỉnh.


================================================================================
SPRINT 2: TRẢI NGHIỆM KHÁCH HÀNG (E-MENU QR), GIỎ HÀNG VÀ ĐẶT MÓN THỜI GIAN THỰC
Thời gian: Tuần 2
================================================================================

1. PHÁT (DATABASE)
- Nhiệm vụ chính: Thiết kế ERD Sprint 2, xây dựng các bảng phục vụ phiên đặt món tại bàn và thiết lập Transaction đặt hàng.
- Hạng mục ERD & Bảng dữ liệu phụ trách:
  + Phiên phục vụ tại bàn (Table Sessions) và Giỏ hàng tạm thời tại bàn.
  + Đơn đặt món (Orders), Chi tiết món ăn trong đơn (Order Items) và Tùy chọn/Ghi chú riêng từng món.
  + Lịch sử cập nhật trạng thái đơn hàng.
  + Yêu cầu hỗ trợ tại bàn (Gọi phục vụ, xin thêm đồ, gọi thanh toán) và Thông báo thời gian thực (Real-time Notifications).
- Kỹ thuật chuyên sâu: Thiết lập Database Transaction cho quá trình ghi nhận Order và Order Items (hỗ trợ US-049, US-063 -> US-070), đảm bảo không bị lỗi dữ liệu khi nhiều điện thoại cùng bàn bấm đặt món cùng lúc.
- Sản phẩm bàn giao: ERD Sprint 2, Migration CSDL luồng Order và kịch bản Transaction.

2. NHẬT (TRƯỞNG NHÓM / PM, BACKEND & API)
- Nhiệm vụ Quản lý dự án (PM):
  + Thiết kế kiến trúc sự kiện WebSockets (Socket.io Events) thống nhất giữa Backend và 2 bạn Frontend.
  + Điều phối kiểm thử tích hợp luồng đặt món thời gian thực cuối Sprint 2.
- Nhiệm vụ Backend & API:
  + Xác thực phiên bàn qua QR (US-045 -> US-049): API giải mã QR bàn, khởi tạo hoặc nối tiếp phiên phục vụ bàn (Table Session), chặn đặt món nếu bàn khóa/QR sai, cho phép nhiều khách cùng bàn tham gia đặt món chung.
  + Xử lý Đặt món & Tiến độ đơn hàng (US-063 -> US-070): API nhận yêu cầu tạo Order từ giỏ hàng, xử lý gọi thêm lượt món mới (Order bổ sung), API hủy món khi còn ở trạng thái "Chờ xác nhận", tính tổng chi phí lũy kế của bàn.
  + Đồng bộ thời gian thực - Real-time Sync (US-075 -> US-078): Cấu hình Socket.io Server phân chia theo Room (Room Bàn khách, Room Bếp, Room Thu ngân); Bắn sự kiện đơn mới xuống Bếp/Thu ngân, đồng bộ trạng thái món về máy khách, khóa món tức thời khi hết hàng và phát tín hiệu chuông báo.
- Sản phẩm bàn giao: WebSocket Server, bộ API Table Session và Order Processing.

3. MINH (BACKEND & API)
- Nhiệm vụ chính: Xây dựng các API phục vụ hiển thị E-Menu cho khách, xử lý logic Giỏ hàng và Yêu cầu hỗ trợ tại bàn.
- Mã User Story phụ trách (BE):
  + Tra cứu và duyệt thực đơn E-Menu (US-050 -> US-056): API trả về dữ liệu trang chủ E-Menu kèm thông tin bàn, danh sách món theo danh mục, danh sách món đặc sắc/bán chạy, API tìm kiếm theo từ khóa, lọc theo khoảng giá và xem chi tiết món ăn.
  + Giỏ hàng và tùy chỉnh món (US-057 -> US-062): API/Logic kiểm tra tính hợp lệ của món và tùy chọn (size, topping) trong giỏ hàng, tính tổng tiền tạm tính chính xác từ phía Server, đồng bộ trạng thái giỏ hàng tại bàn.
  + Tương tác hỗ trợ tại bàn (US-071 -> US-074): API gửi yêu cầu "Gọi nhân viên" (kèm lý do: thêm bát đũa, khăn giấy, thêm đá...), API gửi "Yêu cầu thanh toán" và cập nhật trạng thái khi nhân viên đã tiếp nhận.
- Sản phẩm bàn giao: Bộ API Public E-Menu, Cart Validation và Table Support Requests.

4. QUÂN (FRONTEND)
- Nhiệm vụ chính: Xây dựng giao diện Web E-Menu khi khách quét mã QR, Tìm kiếm/Lọc món và Giỏ hàng trên điện thoại.
- Mã User Story phụ trách (FE):
  + Giao diện Quét QR & Nhận diện bàn (US-045 -> US-049): Màn hình chào mừng khi quét QR, hiển thị rõ số bàn/khu vực, màn hình cảnh báo nếu mã QR không hợp lệ hoặc bàn đang đóng.
  + Giao diện Duyệt thực đơn E-Menu (US-050 -> US-056): Thiết kế Mobile-first mượt mà, banner quán, thanh cuộn ngang chọn danh mục, khu vực món bán chạy, ô tìm kiếm nhanh, bộ lọc giá, Bottom Sheet xem chi tiết món ăn; Làm mờ và khóa nút chọn đối với món "Tạm hết hàng".
  + Giao diện Giỏ hàng & Tùy chỉnh (US-057 -> US-062): Modal chọn Size/Topping, nhập ghi chú khẩu vị từng món (ít cay, không hành...) và ghi chú chung cả đơn; Tăng/giảm số lượng, tự động tính tổng tạm tính và lưu giỏ hàng vào LocalStorage/Session để không mất khi tải lại trang.
- Sản phẩm bàn giao: Giao diện Web E-Menu và Giỏ hàng hoàn chỉnh trên thiết bị di động.

5. PHONG (FRONTEND)
- Nhiệm vụ chính: Xây dựng giao diện Đặt món, Theo dõi trạng thái đơn hàng Real-time, Gọi nhân viên và Tích hợp Socket.io phía Client.
- Mã User Story phụ trách (FE):
  + Giao diện Đặt món & Theo dõi đơn (US-063 -> US-070): Luồng bấm gửi Order từ giỏ hàng, hiệu ứng xác nhận đặt món thành công; Trang "Món đã gọi" hiển thị toàn bộ các lượt gọi món trong phiên, tổng tiền lũy kế, nút hủy món (khi chờ xác nhận) và nút gọi thêm món mới.
  + Giao diện Tương tác hỗ trợ tại bàn (US-071 -> US-074): Nút nổi "Gọi nhân viên" (menu chọn nhanh lý do hỗ trợ) và nút "Yêu cầu thanh toán" (chọn Tiền mặt / Chuyển khoản), hiển thị trạng thái nhân viên đã tiếp nhận.
  + Tích hợp Real-time Client (US-075 -> US-078): Kết nối Socket.io trên web khách hàng để tự động nhảy trạng thái món ăn (Chờ xác nhận -> Đang chế biến -> Đã xong -> Đã lên món), hiển thị popup báo nếu Bếp từ chối món, và phát âm thanh chuông báo trên trình duyệt Bếp/Thu ngân khi có đơn/yêu cầu mới.
- Sản phẩm bàn giao: Giao diện Theo dõi đơn hàng, Gọi hỗ trợ và module kết nối Real-time.


================================================================================
SPRINT 3: ĐIỀU PHỐI BẾP (KDS), QUẢN LÝ BÀN PHỤC VỤ, THU NGÂN VÀ THANH TOÁN
Thời gian: Tuần 3
================================================================================

1. PHÁT (DATABASE)
- Nhiệm vụ chính: Thiết kế ERD Sprint 3, xây dựng bảng cho Bếp, Hóa đơn, Khuyến mãi và xử lý Transaction Thanh toán / Chuyển ghép bàn.
- Hạng mục ERD & Bảng dữ liệu phụ trách:
  + Hàng đợi chế biến tại bếp và Nhật ký cập nhật trạng thái món của bếp.
  + Phiếu yêu cầu hủy món / đổi trả món; Lịch sử chuyển bàn và ghép bàn.
  + Chương trình khuyến mãi và mã giảm giá.
  + Hóa đơn thanh toán (Invoices), Chi tiết dòng hóa đơn (Invoice Items) và Giao dịch thanh toán (Tiền mặt, Chuyển khoản VietQR).
- Kỹ thuật chuyên sâu: Xây dựng Database Transaction cho nghiệp vụ Chuyển bàn (US-097), Ghép bàn (US-098), Tách hóa đơn (US-108) và Thanh toán đóng phiên bàn (US-109, US-110) nhằm đảm bảo số liệu tiền tệ chính xác tuyệt đối.
- Sản phẩm bàn giao: ERD Sprint 3, cấu trúc bảng Hóa đơn/Thanh toán và các Stored Procedure/Transaction.

2. NHẬT (TRƯỞNG NHÓM / PM, BACKEND & API)
- Nhiệm vụ Quản lý dự án (PM):
  + Kiểm soát luồng đồng bộ trạng thái giữa 3 phân hệ (Khách hàng - Bếp - Thu ngân).
  + Tổ chức kiểm thử chéo các kịch bản phức tạp: báo hết món giữa chừng, hủy món, chuyển bàn, ghép bàn.
- Nhiệm vụ Backend & API:
  + Điều phối chế biến tại Bếp - KDS (US-079 -> US-086): API lấy danh sách đơn chờ theo FIFO, API gom nhóm tổng số lượng món giống nhau từ nhiều bàn, API chuyển trạng thái món (Đang chế biến, Hoàn thành), bắn thông báo cho Phục vụ bưng món và tra cứu lịch sử món vừa nấu xong.
  + Kiểm soát hết món & Hủy/Trả món (US-087 -> US-091): API bật/tắt nhanh "Hết món" từ Bếp, API Bếp từ chối món kèm lý do, API Thu ngân/Quản lý hủy món hoặc đổi/trả món và ghi nhận lịch sử thất thoát.
  + Vận hành sơ đồ bàn (US-092 -> US-098): API lấy trạng thái toàn bộ sơ đồ bàn kèm thời gian ngồi & tạm tính, API mở bàn thủ công & đặt món hộ khách, xác nhận "Đã phục vụ", API xử lý nghiệp vụ Chuyển bàn và Ghép bàn.
- Sản phẩm bàn giao: Bộ API Điều phối Bếp (KDS) và Quản lý vận hành Sơ đồ bàn.

3. MINH (BACKEND & API)
- Nhiệm vụ chính: Xây dựng các API Quản lý Hóa đơn, Khuyến mãi, Tính tiền, Sinh mã VietQR động và Thanh toán.
- Mã User Story phụ trách (BE):
  + Quản lý hóa đơn, phụ phí và khuyến mãi (US-099 -> US-104): API CRUD chương trình khuyến mãi/mã giảm giá, kiểm tra điều kiện và áp dụng mã giảm giá vào bàn, cộng phụ phí/chiết khấu trực tiếp, tự động tổng hợp tất cả lượt gọi món thành một hóa đơn, tính thuế VAT/tổng tiền phải thu và xuất dữ liệu in phiếu tạm tính.
  + Thanh toán và đóng phiên bàn (US-105 -> US-110): API ghi nhận thanh toán Tiền mặt (tính tiền thừa), API tạo mã VietQR động chuẩn Napas (chứa sẵn số tiền và nội dung chuyển khoản theo mã hóa đơn), API tách món thanh toán riêng, xác nhận hoàn tất thanh toán, tự động đóng Table Session và đưa bàn về trạng thái "Bàn trống".
- Sản phẩm bàn giao: Bộ API Khuyến mãi, Hóa đơn, VietQR và Thanh toán hoàn chỉnh.

4. PHONG (FRONTEND)
- Nhiệm vụ chính: Xây dựng phân hệ màn hình Điều phối Bếp (Kitchen Display System - KDS).
- Mã User Story phụ trách (FE):
  + Màn hình Điều phối Bếp KDS (US-079 -> US-086): Giao diện bảng thẻ đơn hàng (Order Cards) sắp xếp theo thứ tự thời gian (FIFO), làm nổi bật ghi chú khẩu vị (ít cay, dị ứng...); Tab xem gom nhóm tổng số lượng theo từng món ăn; Nút bấm chuyển nhanh trạng thái ("Bắt đầu nấu", "Hoàn thành" từng món hoặc cả phiếu); Đổi màu cảnh báo đỏ với các đơn chờ quá thời gian quy định; Tab xem lịch sử món vừa hoàn thành trong ca.
  + Kiểm soát hết món tại Bếp (US-087, US-088): Thanh công cụ gạt bật/tắt nhanh trạng thái "Hết món" ngay trên màn hình KDS và hộp thoại từ chối món kèm chọn lý do gửi về Thu ngân/Khách.
- Sản phẩm bàn giao: Phân hệ giao diện Bếp (KDS) hoạt động thời gian thực.

5. QUÂN (FRONTEND)
- Nhiệm vụ chính: Xây dựng phân hệ màn hình POS Thu ngân / Phục vụ, Sơ đồ bàn trực quan và Thanh toán.
- Mã User Story phụ trách (FE):
  + Giao diện Vận hành Sơ đồ bàn (US-089 -> US-098): Sơ đồ bàn trực quan chia theo khu vực với màu sắc trạng thái (Trống, Đang ăn, Chờ thanh toán, Có yêu cầu hỗ trợ), hiển thị thời gian khách ngồi và tổng tiền trên ô bàn; Giao diện mở bàn, gọi món hộ khách, sửa/hủy/trả món, đánh dấu "Đã phục vụ", cùng Modal thao tác Chuyển bàn và Ghép bàn.
  + Giao diện Hóa đơn & Thanh toán (US-099 -> US-110): Trang quản lý mã khuyến mãi; Màn hình chi tiết hóa đơn của bàn, ô nhập mã giảm giá/phụ phí, nút xem trước & in phiếu tạm tính (CSS Print); Giao diện thanh toán Tiền mặt (nhập tiền khách đưa, tự tính tiền thừa), hiển thị mã VietQR động để khách quét, chức năng tách món thanh toán riêng và nút hoàn tất thanh toán giải phóng bàn.
- Sản phẩm bàn giao: Phân hệ giao diện POS Thu ngân và Thanh toán hoàn chỉnh.


================================================================================
SPRINT 4: BÁO CÁO DOANH THU, ĐÁNH GIÁ KHÁCH HÀNG, CA LÀM VIỆC VÀ HOÀN THIỆN HỆ THỐNG
Thời gian: Tuần 4
================================================================================

1. PHÁT (DATABASE)
- Nhiệm vụ chính: Thiết kế ERD Sprint 4, hoàn thiện ERD tổng thể toàn dự án, tối ưu hóa truy vấn thống kê và triển khai CSDL lên Cloud.
- Hạng mục ERD & Bảng dữ liệu phụ trách:
  + Đánh giá chất lượng dịch vụ/món ăn từ khách hàng và Phản hồi của quản lý.
  + Ca làm việc của nhân viên, Biên bản giao ca và đối soát quỹ tiền mặt thu ngân.
  + Bảng tổng hợp doanh thu theo ngày/tháng, Thống kê sản lượng/doanh thu theo từng món ăn và Lịch sử xuất tệp báo cáo.
- Kỹ thuật chuyên sâu:
  + Đánh chỉ mục (Indexing) và tối ưu hóa các câu lệnh SQL Aggregation phức tạp phục vụ thống kê doanh thu, Top món bán chạy, khung giờ cao điểm (hỗ trợ US-123 -> US-134).
  + Phối hợp cùng Nhật triển khai CSDL lên Cloud Server, cấu hình sao lưu (Backup) và tạo bộ dữ liệu mẫu hoàn chỉnh phục vụ bảo vệ đồ án (US-139, US-140).
- Sản phẩm bàn giao: ERD Sprint 4, ERD tổng thể toàn hệ thống và Cloud Database hoàn chỉnh.

2. NHẬT (TRƯỞNG NHÓM / PM, BACKEND & API)
- Nhiệm vụ Quản lý dự án (PM):
  + Điều phối kiểm thử tích hợp toàn trình (End-to-End Testing) từ lúc khách quét QR -> Bếp nấu -> Thu ngân thanh toán -> Báo cáo doanh thu.
  + Tổng hợp tài liệu dự án, rà soát nghiệm thu toàn bộ 140 User Story và chuẩn bị kịch bản Demo bảo vệ đồ án.
- Nhiệm vụ Backend & API:
  + Thống kê và báo cáo doanh thu (US-123 -> US-130): API Dashboard tổng quan trong ngày, biểu đồ doanh thu theo ngày/tuần/tháng, tỷ trọng phương thức thanh toán, doanh thu theo danh mục, bảng xếp hạng Top món bán chạy / món ít người gọi, thống kê khung giờ cao điểm và tỷ lệ hủy món.
  + Tối ưu hệ thống và Triển khai - Deployment (US-136 -> US-140): Xử lý cơ chế tự động kết nối lại (Auto-reconnect) cho WebSockets, rà soát bảo mật phân quyền & chống giả mạo request đặt món; Thiết lập biến môi trường, CI/CD triển khai Frontend lên Vercel (quanmoc.com) và Backend lên Cloud Server.
- Sản phẩm bàn giao: Bộ API Analytics/Dashboard, hệ thống Live trên Production và Báo cáo tổng kết dự án.

3. MINH (BACKEND & API)
- Nhiệm vụ chính: Xây dựng API Đánh giá khách hàng, Quản lý ca thu ngân và Xuất dữ liệu báo cáo (Excel/CSV).
- Mã User Story phụ trách (BE):
  + Đánh giá và phản hồi khách hàng (US-111 -> US-116): API khách gửi chấm sao (1-5 sao) và nhận xét món ăn sau bữa ăn; API Quản lý xem danh sách đánh giá, lọc theo số sao/ngày/phản hồi tiêu cực, ghi chú phản hồi và tính điểm đánh giá trung bình của quán/món ăn.
  + Quản lý ca làm việc và kết ca thu ngân (US-117 -> US-122): API thiết lập ca làm việc, mở ca (ghi nhận tiền mặt đầu ca), ghi nhận phiếu thu/chi phát sinh trong ca, tự động tổng hợp doanh thu tiền mặt/chuyển khoản trong ca, đóng ca đối soát chênh lệch và xem lịch sử biên bản giao ca.
  + Xuất dữ liệu và đối soát lịch sử (US-131 -> US-134): API tra cứu lịch sử hóa đơn đã thanh toán, xem chi tiết hóa đơn cũ, API xuất báo cáo doanh thu & danh sách hóa đơn ra file CSV/Excel và xuất danh mục thực đơn.
- Sản phẩm bàn giao: Bộ API Feedback, Quản lý Ca thu ngân và Export CSV/Excel.

4. PHONG (FRONTEND)
- Nhiệm vụ chính: Xây dựng giao diện Quản lý Ca thu ngân, Dashboard Thống kê Doanh thu và Tra cứu Lịch sử Hóa đơn.
- Mã User Story phụ trách (FE):
  + Giao diện Quản lý Ca làm việc & Kết ca (US-117 -> US-122): Modal Mở ca nhập tiền đầu ca khi Thu ngân bắt đầu làm việc, form tạo phiếu thu/chi tiền mặt phát sinh, màn hình Đóng ca nhập tiền kiểm đếm thực tế để đối soát lệch quỹ, và trang lịch sử bàn giao ca cho Quản lý.
  + Giao diện Dashboard & Biểu đồ Doanh thu (US-123 -> US-130): Trang tổng quan số liệu trong ngày, tích hợp thư viện biểu đồ (Chart.js / Recharts) hiển thị doanh thu theo thời gian, biểu đồ tròn tỷ trọng Tiền mặt vs Chuyển khoản, bảng xếp hạng Top món bán chạy/bán chậm, biểu đồ khung giờ cao điểm và thống kê đơn hủy.
  + Giao diện Đối soát Lịch sử & Xuất file (US-131 -> US-134): Trang tra cứu lịch sử hóa đơn theo ngày/mã/bàn, modal xem lại chi tiết hóa đơn cũ và nút bấm tải xuống báo cáo Excel/CSV.
- Sản phẩm bàn giao: Giao diện Kết ca Thu ngân, Dashboard Thống kê và Lịch sử Hóa đơn.

5. QUÂN (FRONTEND)
- Nhiệm vụ chính: Xây dựng giao diện Đánh giá của khách hàng, Quản trị phản hồi, Tối ưu hóa UI/UX Responsive và Kiểm thử E2E.
- Mã User Story phụ trách (FE):
  + Giao diện Đánh giá & Phản hồi (US-111 -> US-116): Màn hình mời khách chấm điểm (1-5 sao) và viết nhận xét từng món ăn sau khi dùng bữa trên E-Menu; Trang Quản trị xem danh sách phản hồi, bộ lọc đánh giá tiêu cực cần xử lý gấp, form phản hồi của quản lý và hiển thị điểm sao trung bình.
  + Tối ưu hóa Giao diện & Kiểm thử toàn trình (US-135, US-138, US-140): Rà soát và tối ưu tốc độ tải trang (Lazy loading ảnh món ăn), hoàn thiện độ tương thích Responsive trên mọi kích thước màn hình điện thoại/máy tính bảng; Phối hợp cùng Nhật cấu hình tên miền trên Vercel và thực hiện kiểm thử End-to-End toàn bộ luồng nghiệp vụ.
- Sản phẩm bàn giao: Giao diện Đánh giá dịch vụ, giao diện UI/UX tối ưu hoàn chỉnh và biên bản kiểm thử E2E.
================================================================================