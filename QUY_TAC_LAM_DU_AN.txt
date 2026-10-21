# QUY CHUẨN PHÁT TRIỂN PHẦN MỀM TOÀN DỰ ÁN

**Dự án:** Website Quản lý Nhà hàng và Gọi món QR (Goi-Mon / Quán Mộc)

## 1. Nguyên tắc chung

1. Mã nguồn phải dễ đọc, dễ sửa, dễ kiểm thử và dễ mở rộng.
2. Mỗi tệp, hàm và module có nhiệm vụ rõ ràng.
3. Backend chịu trách nhiệm xác thực, phân quyền, kiểm tra dữ liệu và bảo vệ nghiệp vụ.
4. Không tự ý thay đổi cấu trúc cơ sở dữ liệu, API hoặc chức năng của thành viên khác.
5. Không tạo tệp, thư mục, biến hoặc hàm dư thừa.
6. Mọi thay đổi phải được kiểm thử trước khi tích hợp.
7. Ưu tiên tái sử dụng mã nguồn, không sao chép cùng một logic ở nhiều nơi.

## 2. Quy tắc đặt tên

| Đối tượng | Quy tắc | Ví dụ |
|---|---|---|
| Thư mục | Tiếng Việt không dấu, camelCase | taiKhoan, donGoiMon |
| Tệp JavaScript | Tiếng Việt không dấu, camelCase | taiKhoan.service.js, thucDon.controller.js |
| Biến | camelCase | taiKhoanId, banAnId |
| Tham số hàm | camelCase | nguoiDungId, monAnId |
| Hàm | Động từ + đối tượng | layTaiKhoan, taoDonGoiMon |
| Lớp | PascalCase | TaiKhoanService, DonGoiMonService |
| Hằng số | UPPER_SNAKE_CASE | THOI_GIAN_PHIEN_BAN |
| Bảng dữ liệu | snake_case | tai_khoan, don_goi_mon |
| Cột dữ liệu | snake_case | ngay_tao, trang_thai_mon |
| API | Danh từ, phân cấp rõ ràng | /api/thuc-don, /api/don-goi-mon |
| Nhánh Git | Tiền tố + nội dung | feature/goi-mon-qr |
| Báo cáo | Tên sprint + nội dung | sprint01.md |

Quy định bổ sung:
- Tên biến, hàm, tệp và thư mục phải thống nhất toàn dự án.
- Tên vai trò, trạng thái và thông báo hiển thị phải dùng tiếng Việt.
- Không đặt tên mơ hồ như data1, temp, xuLy1 nếu có thể đặt tên rõ nghĩa.
- Tuân theo quy ước bắt buộc của framework khi có xung đột.
- Không dùng tiếng Việt có dấu trong tên biến, hàm, tệp và thư mục mã nguồn.

## 3. Cấu trúc thư mục

WebsiteQuanLyNhaHang/
├── backend/
│   ├── cauHinh/
│   │   ├── cauHinhChung.js
│   │   ├── ketNoiCoSoDuLieu.js
│   │   ├── cauHinhBaoMat.js
│   │   └── cauHinhSocket.js
│   ├── middleware/
│   │   ├── xacThuc.js
│   │   ├── phanQuyen.js
│   │   ├── gioiHanYeuCau.js
│   │   └── xuLyLoi.js
│   ├── modules/
│   │   ├── taiKhoan/
│   │   │   ├── taiKhoan.controller.js
│   │   │   ├── taiKhoan.service.js
│   │   │   ├── taiKhoan.model.js
│   │   │   ├── taiKhoan.routes.js
│   │   │   ├── taiKhoan.validation.js
│   │   │   └── index.js
│   │   ├── vaiTro/
│   │   ├── nhanVien/
│   │   ├── khuVuc/
│   │   ├── banAn/
│   │   ├── danhMucMon/
│   │   ├── thucDon/
│   │   ├── phienBan/
│   │   ├── gioHang/
│   │   ├── donGoiMon/
│   │   ├── dieuPhoiBep/
│   │   ├── yeuCauHoTro/
│   │   ├── khuyenMai/
│   │   ├── hoaDon/
│   │   ├── thanhToan/
│   │   ├── caLamViec/
│   │   ├── danhGia/
│   │   ├── thongBao/
│   │   ├── baoCao/
│   │   └── cauHinhNhaHang/
│   ├── tienIch/
│   │   ├── maHoaMatKhau.js
│   │   ├── lamSachHtml.js
│   │   ├── kiemTraDuLieu.js
│   │   ├── ghiNhatKy.js
│   │   ├── taoMaQr.js
│   │   └── dinhDangPhanHoi.js
│   ├── tacVuNen/
│   │   ├── dongPhienBanHetHan.js
│   │   └── tongHopDoanhThuNgay.js
│   ├── ungDung.js
│   └── mayChu.js
├── frontend/
│   ├── dungChung/
│   │   ├── api.js
│   │   ├── ketNoiSocket.js
│   │   ├── hangSo.js
│   │   └── dinhDang.js
│   ├── thanhPhan/
│   ├── trang/
│   │   ├── dangNhap/
│   │   ├── taiKhoan/
│   │   ├── thucDonQr/
│   │   ├── gioHang/
│   │   ├── theoDoiDonMon/
│   │   ├── danhGiaDichVu/
│   │   ├── dieuPhoiBep/
│   │   ├── soDoBan/
│   │   ├── thanhToan/
│   │   ├── caLamViec/
│   │   ├── quanLyBanQr/
│   │   ├── quanLyThucDon/
│   │   ├── nhanVien/
│   │   ├── baoCaoDoanhThu/
│   │   └── quanTri/
│   ├── dinhTuyen/
│   ├── ungDung.js
│   └── tepGiaoDien.css
├── database/
│   ├── soDoCoSoDuLieu.sql
│   ├── taoBang.sql
│   ├── duLieuMau.sql
│   ├── chiMuc.sql
│   └── rangBuoc.sql
├── kiemThu/
│   ├── api/
│   ├── nghiepVu/
│   ├── baoMat/
│   ├── phanQuyen/
│   ├── dongThoi/
│   └── thanhToan/
├── taiLieu/
│   ├── quyChuanPhatTrien.md
│   ├── dacTaYeuCau.md
│   ├── dacTaApi.md
│   ├── soDoCoSoDuLieu.md
│   ├── huongDanCaiDat.md
│   ├── huongDanSuDung.md
│   ├── phanCongCongViec.md
│   └── baoCaoSprint/
├── tepTaiLen/
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

Đây là cấu trúc định hướng. Chỉ tạo các thư mục và tệp khi có chức năng sử dụng thực tế.

## 4. Quy tắc tổ chức mã nguồn

1. Controller tiếp nhận yêu cầu HTTP, gọi service và trả kết quả.
2. Service xử lý nghiệp vụ, kiểm tra điều kiện và điều phối dữ liệu.
3. Model chịu trách nhiệm truy vấn cơ sở dữ liệu.
4. Routes khai báo phương thức, đường dẫn và middleware.
5. Validation kiểm tra dữ liệu đầu vào.
6. Middleware xử lý xác thực, phân quyền, giới hạn yêu cầu và lỗi chung.
7. File index.js chỉ xuất những thành phần công khai cần sử dụng từ bên ngoài module.
8. Không để controller chứa toàn bộ nghiệp vụ phức tạp.
9. Không để model xử lý giao diện hoặc quyền truy cập của người dùng.
10. Không tạo phụ thuộc vòng giữa các module.
11. Các hàm dùng chung phải được đặt trong module tiện ích hoặc cấu hình chung phù hợp.
12. Không tạo nhiều hàm có cùng chức năng nếu có thể tái sử dụng hàm hiện có.

## 5. Quy tắc viết hàm và giá trị trả về

1. Tên hàm phải thể hiện rõ hành động.
2. Mỗi hàm chỉ đảm nhận một nhiệm vụ chính.
3. Tham số đầu vào phải rõ ràng, đúng kiểu và được kiểm tra khi cần.
4. Hàm phải quy định rõ kết quả trả về, trường hợp không có dữ liệu và trường hợp xảy ra lỗi.
5. Không trả về dữ liệu không cần thiết hoặc dữ liệu nhạy cảm.
6. Không âm thầm bỏ qua lỗi.
7. Không dùng giá trị mặc định để che giấu dữ liệu đầu vào không hợp lệ.
8. Hàm bất đồng bộ phải được xử lý bằng async/await hoặc cơ chế tương đương.
9. Không sử dụng biến toàn cục để truyền dữ liệu nghiệp vụ nếu không cần thiết.
10. Hàm công khai phải có mô tả đầu vào, đầu ra, lỗi có thể xảy ra và quyền sử dụng nếu cần.

Ví dụ:

async function layMonAnTheoId(monAnId) {
    if (!Number.isInteger(Number(monAnId)) || Number(monAnId) <= 0) {
        const loi = new Error("ID món ăn không hợp lệ");
        loi.status = 400;
        throw loi;
    }

    return await thucDonModel.layTheoId(Number(monAnId));
}

module.exports = {
    layMonAnTheoId
};

## 6. Quy tắc hằng số và cấu hình

1. Hằng số dùng chung phải được khai báo tại một vị trí thống nhất.
2. Hằng số dùng riêng cho module có thể đặt trong tệp cấu hình của module.
3. Không viết lặp lại các giá trị như thời gian hiệu lực phiên bàn, giới hạn số lượng món mỗi lần gọi, giới hạn tải tệp ảnh món ăn hoặc số lần thử đăng nhập.
4. Thông tin nhạy cảm phải được lấy từ biến môi trường hoặc hệ thống quản lý bí mật.
5. Không đưa mật khẩu, khóa bí mật hoặc thông tin thanh toán thật vào mã nguồn.
6. File .env không được đưa lên Git.
7. File .env.example chỉ chứa tên biến và giá trị mẫu an toàn.
8. Không sử dụng nhiều nguồn cấu hình mâu thuẫn cho cùng một giá trị.

Ví dụ:

const cauHinh = {
    congBackend: Number(process.env.CONG_BACKEND || 3001),
    thoiGianPhienBanPhut: 180,
    soMonToiDaMoiLanGoi: 20,
    gioiHanTepTaiLenMB: 5
};

module.exports = cauHinh;

## 7. Quy tắc tài khoản và phân quyền

1. Vai trò người dùng (Quản lý, Thu ngân, Bếp, Phục vụ) phải được khai báo trong cơ sở dữ liệu hoặc nguồn dữ liệu được backend quản lý.
2. Không dùng điều kiện frontend làm cơ chế phân quyền bảo mật.
3. Mỗi API riêng tư phải xác thực người dùng ở backend.
4. Mỗi API quản trị hoặc vận hành nội bộ phải kiểm tra vai trò và quyền cụ thể ở backend.
5. Các API truy cập dữ liệu cá nhân hoặc phiên bàn phải kiểm tra quyền sở hữu / mã định danh phiên hợp lệ.
6. Không cho phép người dùng tự thay đổi vai trò, trạng thái duyệt hoặc quyền quản trị.
7. Không tin vai trò, đơn giá món ăn, số lượng món, mức giảm giá hoặc trạng thái thanh toán do frontend gửi lên.
8. Tài khoản nhân viên bị khóa hoặc đã nghỉ việc phải bị từ chối truy cập theo chính sách hệ thống.
9. Mật khẩu phải được băm bằng thuật toán phù hợp như Argon2id hoặc bcrypt.
10. Phiên đăng nhập phải có thời hạn và cơ chế thu hồi.
11. Cookie phiên đăng nhập cần thiết lập HttpOnly, Secure khi dùng HTTPS và SameSite phù hợp.
12. Chức năng đổi mật khẩu, đặt lại mật khẩu và cấp quyền phải được kiểm tra nghiêm ngặt.
13. Việc tạo tài khoản quản trị đầu tiên phải thực hiện bằng quy trình khởi tạo an toàn, không tạo tài khoản quản trị mặc định có mật khẩu cố định.
14. Phải phân biệt lỗi chưa đăng nhập (401) và không đủ quyền (403).

## 8. Quy tắc cơ sở dữ liệu

1. Mỗi bảng phải có khóa chính phù hợp.
2. Dữ liệu liên quan phải có khóa ngoại khi cần bảo đảm toàn vẹn.
3. Dùng UNIQUE để ngăn dữ liệu trùng tại những trường bắt buộc duy nhất (như tên đăng nhập, mã bàn, mã hóa đơn).
4. Dùng NOT NULL, CHECK và các ràng buộc phù hợp (ví dụ: giá món ăn và số lượng phải lớn hơn 0).
5. Đặt tên bảng và cột theo snake_case.
6. Dùng kiểu dữ liệu phù hợp với nội dung lưu trữ.
7. Truy vấn phải sử dụng tham số, không nối trực tiếp dữ liệu người dùng vào câu SQL.
8. Nghiệp vụ cập nhật nhiều bản ghi liên quan (tạo đơn gọi món + chi tiết món, chuyển/ghép bàn, thanh toán hóa đơn + đóng phiên bàn) phải dùng giao dịch (Transaction) khi cần tính nguyên tử.
9. Phải có phương án xử lý dữ liệu đồng thời.
10. Không xóa hoặc đổi cấu trúc bảng đã thống nhất nếu chưa đánh giá ảnh hưởng.
11. Mọi thay đổi cấu trúc phải được ghi nhận bằng tệp SQL hoặc cơ chế quản lý phiên bản cơ sở dữ liệu.
12. Dữ liệu mẫu không được chứa thông tin cá nhân thật hoặc bí mật.
13. Chỉ truy vấn và trả về các trường cần thiết.
14. Cần có chỉ mục (Index) cho những trường thường xuyên tìm kiếm, liên kết hoặc lọc (như ban_an_id, phien_ban_id, trang_thai, ngay_tao) khi phù hợp.

## 9. Quy tắc thiết kế API

1. API phải có phương thức và đường dẫn rõ ràng.
2. Đường dẫn ưu tiên dùng danh từ, thống nhất cách đặt tên.
3. Mỗi API phải xác định quyền truy cập, tham số, dữ liệu đầu vào và kết quả trả về.
4. Dữ liệu đầu vào phải được kiểm tra tại backend.
5. Chỉ cho phép cập nhật những trường được phép.
6. Phản hồi phải thống nhất cấu trúc.
7. Mã HTTP phải phản ánh đúng kết quả.
8. Không trả về mật khẩu, mã xác thực, token bí mật hoặc dữ liệu nội bộ.
9. API danh sách cần phân trang khi lượng dữ liệu có thể lớn.
10. API nhạy cảm phải giới hạn tần suất phù hợp.
11. API thay đổi dữ liệu quan trọng (gửi đơn gọi món, xác nhận thanh toán) cần chống gửi lặp khi nghiệp vụ yêu cầu.
12. Thay đổi hợp đồng API phải được thông báo cho các thành viên liên quan và cập nhật tài liệu.

Mẫu phản hồi thành công:

{
  "ok": true,
  "data": {},
  "msg": "Thành công"
}

Mẫu phản hồi lỗi:

{
  "ok": false,
  "data": null,
  "msg": "Dữ liệu không hợp lệ"
}

Mã HTTP thường dùng:

- 200: Thành công.
- 201: Tạo dữ liệu thành công.
- 400: Dữ liệu đầu vào không hợp lệ.
- 401: Chưa xác thực.
- 403: Không đủ quyền.
- 404: Không tìm thấy dữ liệu.
- 409: Xung đột dữ liệu.
- 422: Dữ liệu hợp lệ về định dạng nhưng không thỏa mãn điều kiện nghiệp vụ, nếu dự án áp dụng mã này.
- 429: Quá nhiều yêu cầu.
- 500: Lỗi máy chủ.

## 10. Quy tắc bảo mật web

1. Chỉ cho phép CORS từ những nguồn frontend đã được phê duyệt.
2. Cấu hình các tiêu đề bảo mật phù hợp như CSP, X-Content-Type-Options và HSTS khi dùng HTTPS.
3. Làm sạch HTML bằng thư viện chuyên dụng trước khi lưu hoặc hiển thị nội dung HTML do người dùng cung cấp (như ghi chú món ăn, nội dung đánh giá).
4. Tệp tải lên (hình ảnh món ăn) phải kiểm tra dung lượng, loại tệp và nội dung; không chỉ tin phần mở rộng.
5. Không cho phép thực thi tệp tải lên.
6. Lưu tệp ngoài thư mục mã nguồn công khai hoặc dùng dịch vụ lưu trữ phù hợp.
7. Giới hạn tần suất đăng nhập, đặt lại mật khẩu, quét QR đặt món và các API nhạy cảm.
8. Bảo vệ các yêu cầu thay đổi dữ liệu trước CSRF khi sử dụng cơ chế xác thực dựa trên cookie.
9. Không ghi mật khẩu, token hoặc thông tin thanh toán nhạy cảm vào nhật ký.
10. Không hiển thị thông báo lỗi nội bộ, câu SQL hoặc đường dẫn máy chủ cho người dùng.
11. Kiểm tra và cập nhật các thư viện phụ thuộc có lỗ hổng.
12. Không dùng dữ liệu giả lập để thay thế xác minh bảo mật thực tế.

## 11. Quy tắc chống lỗi đồng thời

1. Những thao tác ảnh hưởng đến trạng thái bàn ăn, nhiều khách cùng bàn đặt món đồng thời, báo hết món từ bếp, chuyển/ghép bàn hoặc thanh toán hóa đơn phải được bảo vệ trước yêu cầu đồng thời.
2. Sử dụng giao dịch (Transaction), khóa bản ghi hoặc cập nhật có điều kiện tùy nghiệp vụ và hệ quản trị cơ sở dữ liệu.
3. Không chỉ đọc trạng thái hoặc tổng tiền hiện tại rồi cập nhật riêng rẽ mà không có cơ chế chống tranh chấp.
4. Ràng buộc UNIQUE phải được dùng khi cần ngăn bản ghi hoặc giao dịch thanh toán trùng.
5. Xử lý lặp cùng một yêu cầu (khách bấm nút Đặt món hoặc thu ngân bấm Thanh toán nhiều lần liên tiếp) phải cho kết quả nhất quán.
6. Không được cho phép đặt món đã chuyển sang trạng thái "Tạm hết" hoặc mở hai phiên phục vụ độc lập trên cùng một bàn đang có khách.
7. Khi giao dịch thất bại, phải hoàn tác (Rollback) những thay đổi liên quan.
8. Không dùng bộ nhớ của một tiến trình làm cơ chế khóa duy nhất nếu hệ thống có nhiều tiến trình hoặc nhiều máy chủ.

## 12. Quy tắc phiên phục vụ bàn, đặt món và thanh toán

1. Thời gian hiệu lực của một phiên phục vụ bàn (Table Session) phải được quản lý chặt chẽ và có thể điều chỉnh bằng cấu hình.
2. Khi bàn đã thanh toán hoàn tất hoặc phiên bàn hết hạn mà không phát sinh đơn hàng, phiên phục vụ phải được đóng và giải phóng bàn về trạng thái trống theo quy trình an toàn.
3. Trạng thái phiên bàn lưu trong cơ sở dữ liệu là căn cứ xác định bàn có đang mở để nhận lượt gọi món mới hay không.
4. Tác vụ nền xử lý dọn dẹp các phiên bàn treo hoặc giỏ hàng tạm hết hạn.
5. Bộ nhớ đệm hoặc Socket Room có thể hỗ trợ đồng bộ nhanh nhưng không thay thế việc bảo đảm toàn vẹn dữ liệu trong cơ sở dữ liệu.
6. Mỗi hóa đơn và yêu cầu thanh toán phải có mã giao dịch duy nhất.
7. Xử lý lặp xác nhận thanh toán không được tạo hóa đơn trùng hoặc cộng doanh thu hai lần.
8. Phải kiểm tra số tiền, mã hóa đơn và nội dung chuyển khoản khi đối soát thanh toán VietQR / Tiền mặt.
9. Chỉ cho phép khách hàng hủy món khi món ăn đang ở trạng thái "Chờ xác nhận" (Bếp chưa chế biến).
10. Trạng thái bàn ăn, phiên bàn, đơn gọi món, món ăn tại bếp và hóa đơn thanh toán phải nhất quán.
11. Việc hủy món sau khi đã lên đơn hoặc trả món phải có kiểm tra quyền (Thu ngân / Quản lý), điều kiện nghiệp vụ và lưu lịch sử lý do hủy.
12. Backend phải tự tính toán và xác định đơn giá món ăn, phụ phí, giảm giá, thuế VAT và tổng tiền thanh toán.

## 13. Quy tắc frontend

1. Tách giao diện, gọi API, kết nối Socket và xử lý nghiệp vụ hợp lý.
2. Tái sử dụng thành phần giao diện dùng chung khi phù hợp.
3. Kiểm tra dữ liệu ở frontend nhằm hỗ trợ người dùng; backend vẫn phải kiểm tra lại.
4. Mọi thao tác bất đồng bộ phải xử lý trạng thái đang tải, thành công và thất bại.
5. Xử lý phiên đăng nhập nhân viên hoặc phiên đặt món tại bàn hết hạn một cách nhất quán.
6. Không hiển thị dữ liệu quản trị hoặc doanh thu khi người dùng không có quyền.
7. Không lưu khóa bí mật hoặc thông tin xác thực nhạy cảm trong mã frontend.
8. Không để nút giả hoặc chức năng chưa hoạt động trong bản nghiệm thu.
9. Không tự ý thay đổi giao diện hoặc chức năng ngoài phạm vi công việc.
10. Giao diện phải có thông báo rõ ràng khi dữ liệu trống, món tạm hết, lỗi kết nối hoặc đang tải.
11. Kiểm tra hiển thị chuẩn Responsive trên điện thoại (đối với E-Menu QR của khách) và máy tính/máy tính bảng (đối với màn hình Bếp, Thu ngân, Quản lý).
12. Không coi việc ẩn nút trên giao diện là biện pháp phân quyền.

## 14. Quy tắc Git và làm việc nhóm

1. Mỗi thành viên làm việc trên nhánh riêng theo quy ước chung.
2. Tên nhánh phải thể hiện loại công việc và nội dung (ví dụ: feature/xac-thuc-tai-khoan, feature/thuc-don-qr).
3. Commit phải ngắn gọn, mô tả đúng thay đổi.
4. Không đưa node_modules, tệp .env, mật khẩu hoặc dữ liệu nhạy cảm lên Git.
5. Không tự ý sửa hoặc ghi đè công việc của thành viên khác.
6. Trước khi tích hợp phải kiểm tra xung đột và chạy kiểm thử phù hợp.
7. Thay đổi API, sự kiện Socket, cơ sở dữ liệu hoặc thành phần dùng chung phải thông báo cho người liên quan.
8. Phải kiểm tra hồi quy để bảo đảm chức năng cũ không bị hỏng.
9. Không gộp mã chưa được kiểm tra vào nhánh chính.
10. Khi có xung đột nghiệp vụ hoặc kỹ thuật, nhóm phải thống nhất trước khi tiếp tục.

## 15. Quy tắc kiểm thử

1. Kiểm thử luồng thành công và thất bại.
2. Kiểm thử dữ liệu thiếu, sai định dạng, vượt giới hạn và dữ liệu trùng.
3. Kiểm thử khi chưa đăng nhập hoặc không đủ quyền (Bếp không được vào trang Thu ngân/Quản lý).
4. Kiểm thử tính hợp lệ của mã QR bàn và phiên phục vụ bàn.
5. Kiểm thử các thao tác đồng thời có nguy cơ tranh chấp (nhiều máy quét cùng 1 bàn đặt món, bếp vừa báo hết món khi khách bấm đặt).
6. Kiểm thử gửi đơn lặp, thanh toán lặp, hủy món khi bếp đã nấu và đóng phiên bàn.
7. Kiểm thử các lỗ hổng phổ biến như SQL Injection, XSS và CSRF khi phù hợp.
8. Thực hiện kiểm thử chéo giữa các thành viên.
9. Ghi lại kết quả, lỗi phát hiện và cách xử lý.
10. Không báo cáo kiểm thử thành công nếu chưa thực sự chạy.
11. Sau khi sửa lỗi phải kiểm thử lại chức năng liên quan.
12. Các chức năng quan trọng phải có kiểm thử hồi quy trước nghiệm thu.

## 16. Quy tắc viết tài liệu và báo cáo

1. Tài liệu phải dùng tiếng Việt rõ ràng, thống nhất thuật ngữ.
2. Tên tệp phải ngắn gọn, thể hiện đúng nội dung.
3. Tài liệu API phải ghi phương thức, đường dẫn, quyền, đầu vào, đầu ra và lỗi.
4. Tài liệu cơ sở dữ liệu phải thống nhất với cấu trúc thực tế.
5. Báo cáo Sprint phải có mục tiêu, công việc, người thực hiện, kết quả, kiểm thử và vấn đề tồn tại.
6. Phải phân biệt rõ công việc hoàn thành, đang thực hiện và chưa thực hiện.
7. Không ghi chức năng đã hoàn thành nếu mã nguồn hoặc kiểm thử chưa đáp ứng.
8. Khi thay đổi thiết kế hoặc nghiệp vụ, phải cập nhật tài liệu liên quan.
9. Hướng dẫn cài đặt phải nêu công nghệ, phiên bản, cấu hình và lệnh chạy cần thiết.
10. Tài liệu phải đủ để thành viên khác có thể tiếp tục công việc mà không cần đoán.

## 17. Quy tắc nghiệm thu

Một chức năng chỉ được nghiệm thu khi:
- Đáp ứng yêu cầu nghiệp vụ đã thống nhất.
- Giao diện, API và đồng bộ thời gian thực (Real-time) hoạt động đúng.
- Dữ liệu được lưu và truy xuất chính xác.
- Phân quyền và bảo mật được kiểm tra.
- Xử lý đúng các trường hợp lỗi và dữ liệu biên.
- Không làm hỏng chức năng liên quan.
- Có kết quả kiểm thử thực tế.
- Tài liệu liên quan được cập nhật.

## 18. Xử lý ngoại lệ

1. Nếu cần làm khác quy chuẩn, phải thống nhất với người phụ trách (Trưởng nhóm) trước khi thực hiện.
2. Ghi rõ lý do, phạm vi ảnh hưởng và cách kiểm soát rủi ro.
3. Không bỏ qua xác thực, phân quyền, kiểm tra dữ liệu hoặc bảo đảm toàn vẹn chỉ để làm nhanh.
4. Ngoại lệ không được làm ảnh hưởng đến bảo mật và dữ liệu của toàn hệ thống.

## 19. Nguyên tắc cuối cùng

Mọi thành viên phải tuân thủ quy chuẩn chung, bảo đảm mã nguồn dễ hiểu, chức năng hoạt động đúng, dữ liệu nhất quán, phân quyền an toàn và tài liệu đồng bộ với sản phẩm thực tế. Khi có thay đổi ảnh hưởng đến nhiều module, phải thống nhất trước khi triển khai.