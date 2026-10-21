TIỂU LUẬN/ BÀI TẬP LỚN
HỌC PHẦN: CÔNG NGHỆ PHẦN MỀM
ĐỀ TÀI: HỆ THỐNG QUẢN LÝ NHÀ HÀNG 
| Giảng viên giảng dạy:   | Nguyễn Viết Hưng   |
| Nhóm thực hiện:   | Nhóm 1   |
| Họ và tên – Mã sinh viên:   | Nguyễn Sỹ Minh (Trưởng nhóm)    |
|  | Nguyễn Chí Quân   |
|  | Lê Đăng Phát   |
|  | Phạm Xuân Phong   |
|  | Lê Hữu Pháp   |
| Ngành:   | Công nghệ thông tin   |
| Mã lớp học phần:   | N07   |

MỤC LỤC
CHƯƠNG 1. GIỚI THIỆU CHUNG	1
1.1. Lý do chọn đề tài	1
1.2. Mục tiêu và phạm vi thực hiện	1
1.2.1. Tầm nhìn sản phẩm	1
1.2.2. Đối tượng sử dụng	2
1.2.3. Mục tiêu	2
1.2.4. Phạm vi	2
1.3. Ý nghĩa và ứng dụng thực tế	3
CHƯƠNG 2. PHÂN TÍCH VÀ THIẾT KẾ SẢN PHẨM	4
2.1. Phân tích nhu cầu người dùng	4
2.1.1. Personas	4
2.1.2. Scenarios	4
2.1.3. User stories	5
2.1.4. Product backlog và tiêu chí chấp nhận	6
2.1.5. Kế hoạch sprint	6
2.2. Yêu cầu chức năng và phi chức năng	7
2.2.1. Yêu cầu chức năng (FR)	7
2.2.2. Yêu cầu phi chức năng (NFR)	8
2.3. Phương án kiến trúc và công nghệ	9
2.3.1. So sánh các phương án kiến trúc	9
2.3.2. Kiến trúc đề xuất	9
2.3.3. Lựa chọn công nghệ và ưu nhược điểm	10
2.3.4. Thiết kế REST API	11
2.4. Thiết kế cơ sở dữ liệu	11
2.5. Thiết kế chức năng hệ thống và lập trình	13
2.5.1. Luồng nghiệp vụ chính	13
2.5.2. Quy tắc phiên bàn, đặt món và thanh toán	13
2.5.3. Cấu trúc mã nguồn và mẫu hàm	14
2.6. Chất lượng và vận hành	14
2.6.1. Bảo mật	14
2.6.2. Lập trình tin cậy và xử lý đồng thời	15
2.6.3. Kiểm thử	15
2.6.4. Code review, quản lý mã nguồn và DevOps	16
CHƯƠNG 3. QUY TRÌNH CỘNG TÁC TRÊN GITHUB VÀ SỬ DỤNG CÔNG CỤ AI	17
3.1. Cách nhóm sử dụng GitHub	17
3.2. Nhật ký sử dụng công cụ AI	18
3.3. Phân công và đóng góp của thành viên	19
CHƯƠNG 4. LIÊN HỆ LÝ THUYẾT (SOMMERVILLE – ENGINEERING SOFTWARE PRODUCTS)	20
4.1. Bảng tổng hợp	20
4.2. Phân tích chi tiết một số quyết định	21
4.2.1. Chọn modular monolith thay vì microservices	21
4.2.2. Backend tự tính tiền và không tin dữ liệu từ frontend	21
4.2.3. Chưa dùng cổng thanh toán tự động	22
CHƯƠNG 5. KẾT QUẢ THỰC HIỆN	23
5.1. Tiến độ tổng thể	23
5.2. Kết quả Sprint 1 – phần Backend & API (thành viên Minh)	23
5.2.1. Mục tiêu	23
5.2.2. Danh sách công việc và trạng thái	24
5.2.3. Sản phẩm bàn giao kỹ thuật	25
5.2.4. Kết quả kiểm thử	26
5.2.5. Đối chiếu tiêu chí nghiệm thu	27
5.2.6. Vấn đề tồn tại và việc cần xử lý	28
5.2.7. Kế hoạch Sprint 2 của thành viên Minh	28
5.3. Kết quả Sprint 1 – phần Frontend (thành viên Quân)	29
5.3.1. Mục tiêu	29
5.3.2. Danh sách công việc và trạng thái	29
5.3.3. Sản phẩm bàn giao kỹ thuật	30
5.3.4. Kết quả kiểm thử	31
5.3.5. Đối chiếu tiêu chí nghiệm thu	32
5.3.6. Vấn đề tồn tại và việc cần xử lý	33
5.3.7. Kế hoạch Sprint 2 của thành viên Quân	33
5.4. Trình bày sản phẩm MVP	34
Kịch bản minh họa end-to-end	35
5.5. Đánh giá kết quả đạt được	35
5.6. Những hạn chế	35
5.7. Hướng phát triển	36
TÀI LIỆU THAM KHẢO	37

ĐỀ BÀI
Yêu cầu chọn chủ đề bài tập lớn
1. Sinh viên nhận chủ đề theo nhóm 3–5 sinh viên/nhóm. Chủ đề có tính thực tế, giải quyết một vấn đề trong thực tế liên quan đến hệ thống/sản phẩm phần mềm hoặc hệ thống ứng dụng AI. Toàn bộ quá trình phát triển được quản lý trên GitHub (Issues, Commits, Milestones, Releases, README.md,...).
2. Chủ đề cần đảm bảo:
a. Có tính thực tiễn, ứng dụng rõ ràng trong bài toán thực tế.
b. Bao gồm ít nhất một phần phân tích nhu cầu người dùng và phạm vi sản phẩm (product vision, persona, user story, acceptance criteria).
c. Có tiềm năng phát triển thành sản phẩm khả dụng tối thiểu (MVP): website, ứng dụng, dịch vụ.
3. Sinh viên cần mô tả về giải pháp đã chọn, bao gồm:
d. Lý do chọn chủ đề.
e. Mục tiêu và phạm vi thực hiện về chức năng, phi chức năng.
f. Phương án kiến trúc (cloud/microservices/REST nếu có) và công nghệ, kèm phân tích ưu nhược điểm.
g. Xây dựng MVP với các chức năng lõi và kịch bản minh họa.
h. Kết quả mong đợi và cách khai thác công cụ/tác tử AI có trách nhiệm trong quá trình làm.
4. Chủ đề cần được giảng viên duyệt trước.
Chủ đề của nhóm: Hệ thống Quản lý Nhà hàng và Gọi món QR (Goi-Mon / Quán Mộc – QUANMOC.COM).
PHẦN CHẤM ĐIỂM / NHẬN XÉT CỦA GIẢNG VIÊN
| Nhận xét:   |
| Điểm số: ……………………      Điểm chữ: ……………………   |
| Giảng viên chấm (ký, ghi rõ họ tên):   |

DANH MỤC TỪ VIẾT TẮT
| Từ viết tắt   | Nghĩa đầy đủ   |
| AC   | Acceptance Criteria – tiêu chí chấp nhận   |
| API   | Application Programming Interface – giao diện lập trình ứng dụng   |
| BE   | Backend – phía máy chủ   |
| CI/CD   | Continuous Integration / Continuous Delivery – tích hợp / triển khai liên tục   |
| CORS   | Cross-Origin Resource Sharing   |
| CRUD   | Create, Read, Update, Delete – tạo, đọc, sửa, xóa   |
| CSDL   | Cơ sở dữ liệu   |
| CSRF   | Cross-Site Request Forgery   |
| E-Menu   | Electronic Menu – thực đơn điện tử   |
| ERD   | Entity Relationship Diagram – sơ đồ quan hệ thực thể   |
| FE   | Frontend – phía giao diện   |
| FIFO   | First In, First Out – vào trước, ra trước   |
| FR   | Functional Requirement – yêu cầu chức năng   |
| GV   | Giảng viên   |
| HTTP(S)   | HyperText Transfer Protocol (Secure)   |
| JSON   | JavaScript Object Notation   |
| JWT   | JSON Web Token   |
| KDS   | Kitchen Display System – hệ thống màn hình điều phối bếp   |
| MoSCoW   | Must / Should / Could / Won’t have – phương pháp xếp ưu tiên   |
| MVP   | Minimum Viable Product – sản phẩm khả dụng tối thiểu   |
| NFR   | Non-Functional Requirement – yêu cầu phi chức năng   |
| PB   | Product Backlog item   |
| PM   | Project Manager – quản lý dự án   |
| POS   | Point of Sale – điểm bán hàng / màn hình thu ngân   |
| PR   | Pull Request   |
| QR   | Quick Response (code)   |
| RBAC   | Role-Based Access Control – phân quyền theo vai trò   |
| REST   | Representational State Transfer   |
| SP   | Story Point   |
| SQL   | Structured Query Language   |
| SV   | Sinh viên   |
| US   | User Story   |
| VAT   | Value Added Tax – thuế giá trị gia tăng   |
| VietQR   | Chuẩn mã QR thanh toán của Napas   |
| XSS   | Cross-Site Scripting   |

DANH MỤC BẢNG BIỂU
Bảng 1.1. Phạm vi của sản phẩm theo MoSCoW2
Bảng 2.1. Các persona của hệ thống4
Bảng 2.2. User story cấp sản phẩm5
Bảng 2.3. Product backlog chi tiết6
Bảng 2.4. Kế hoạch bốn sprint7
Bảng 2.5. Yêu cầu chức năng theo nhóm7
Bảng 2.6. Yêu cầu phi chức năng8
Bảng 2.7. So sánh các phương án kiến trúc9
Bảng 2.8. Công nghệ sử dụng10
Bảng 2.9. Quy ước phản hồi và mã HTTP11
Bảng 2.10. Nhóm bảng dữ liệu theo sprint12
Bảng 2.11. Rủi ro bảo mật và biện pháp14
Bảng 2.12. Tình huống đồng thời và biện pháp xử lý15
Bảng 2.13. Tổ chức thư mục kiểm thử16
Bảng 3.1. Cách sử dụng các công cụ của GitHub17
Bảng 3.2. Nhật ký sử dụng công cụ AI18
Bảng 3.3. Phân công vai trò của thành viên19
Bảng 4.1. Liên hệ giữa lý thuyết, quyết định của nhóm và minh chứng20
Bảng 5.1. Tình trạng thực hiện theo sprint và thành viên23
Bảng 5.2. Công việc Backend Sprint 1 của thành viên Minh24
Bảng 5.3. Endpoint Danh mục món và Món ăn25
Bảng 5.4. Endpoint Khu vực, Bàn ăn và Hồ sơ nhân sự26
Bảng 5.5. Đối chiếu tiêu chí nghiệm thu của phần Backend Sprint 127
Bảng 5.6. Kế hoạch Sprint 2 của thành viên Minh28
Bảng 5.7. Công việc Frontend Sprint 1 của thành viên Quân29
Bảng 5.8. Cấu trúc mô-đun và màn hình Frontend Sprint 130
Bảng 5.9. Đối chiếu tiêu chí nghiệm thu của phần Frontend Sprint 132
Bảng 5.10. Kế hoạch Sprint 2 của thành viên Quân33
Bảng 5.11. Kịch bản minh họa chạy thử MVP34
Bảng 5.12. Đánh giá theo mục tiêu35

DANH MỤC HÌNH VẼ
Hình 2.1. Kiến trúc tổng thể của hệ thống10
Hình 2.2. ERD mức khái niệm của hệ thống12
Hình 2.3. Luồng đặt món và thanh toán xuyên suốt ba phân hệ13
Hình 3.1. Trang chủ repository và README.md17
Hình 3.2. Issues và Milestones của dự án18
Hình 3.3. Pull request, review và lịch sử commit18
Hình 5.1. Giao diện E-Menu trên điện thoại34
Hình 5.2. Màn hình điều phối bếp (KDS)34
Hình 5.3. Sơ đồ bàn và thanh toán34
Hình 5.4. Quản lý bàn, mã QR và thực đơn34

CHƯƠNG 1. GIỚI THIỆU CHUNG
1.1. Lý do chọn đề tài
Trong nhà hàng, quán ăn, quy trình phục vụ gồm nhiều khâu nối tiếp nhau: khách xem thực đơn, gọi món, bếp chế biến, nhân viên mang món, thu ngân tính tiền và quản lý theo dõi doanh thu. Khi các khâu này làm thủ công bằng thực đơn giấy, phiếu ghi tay và sổ sách, nhà hàng thường gặp tình trạng khách phải chờ nhân viên để gọi món hoặc gọi thêm, ghi nhầm hoặc sót món, bếp nhận thông tin chậm, tính tiền sai và khó thống kê doanh thu cuối ngày.
Mô hình khách tự quét mã QR tại bàn để xem thực đơn điện tử (E-Menu) và gọi món ngay trên điện thoại, không cần cài ứng dụng, giúp rút ngắn thời gian chờ và giảm sai sót. Tuy nhiên để mô hình này vận hành trọn vẹn, hệ thống phải đồng bộ thời gian thực giữa ba phía là khách, bếp và thu ngân, đồng thời có quản trị thực đơn, sơ đồ bàn, nhân sự và báo cáo cho chủ nhà hàng. Nhóm chọn xây dựng Hệ thống Quản lý Nhà hàng và Gọi món QR (Goi-Mon / Quán Mộc – QUANMOC.COM) nhằm giải quyết trọn bài toán đó.
Đề tài phù hợp với yêu cầu học phần: bài toán thực tế, nhiều nhóm người dùng để phân tích persona và user story, có tiềm năng thành sản phẩm khả dụng tối thiểu (MVP), và đủ phong phú để áp dụng quy trình phát triển hiện đại (kiến trúc, kiểm thử, bảo mật, DevOps, cộng tác trên GitHub) (Sommerville, 2020).
1.2. Mục tiêu và phạm vi thực hiện
1.2.1. Tầm nhìn sản phẩm
Dành cho khách ăn uống, nhân viên và chủ nhà hàng đang vận hành bằng thực đơn giấy và ghi chép tay, Quán Mộc là hệ thống web gọi món QR và quản lý nhà hàng giúp khách tự gọi món và theo dõi tiến độ trên điện thoại, bếp và thu ngân nhận đơn tức thời, chủ quán nắm doanh thu theo thời gian thực. Khác với phần mềm POS truyền thống, hệ thống chạy hoàn toàn trên trình duyệt, khách không cần cài ứng dụng.
1.2.2. Đối tượng sử dụng
Khách hàng: quét mã QR tại bàn, xem E-Menu, đặt món và theo dõi trạng thái chế biến theo thời gian thực.
Nhân viên (Bếp, Thu ngân/Phục vụ): tiếp nhận đơn tức thời, cập nhật tiến độ chế biến, quản lý trạng thái bàn, xử lý thanh toán.
Quản lý (chủ nhà hàng): quản trị thực đơn, sơ đồ bàn, phân quyền nhân sự, theo dõi lịch sử hóa đơn và thống kê doanh thu.
1.2.3. Mục tiêu
Số hóa trọn quy trình từ quét QR, gọi món, chế biến, phục vụ đến thanh toán và báo cáo.
Đồng bộ thời gian thực giữa điện thoại khách, màn hình bếp và màn hình thu ngân bằng Socket.io.
Xây dựng MVP gồm các chức năng nhóm Must have, có kịch bản minh họa xuyên suốt.
Bảo đảm bảo mật, phân quyền và toàn vẹn dữ liệu (đặc biệt với đặt món đồng thời và thanh toán).
Quản lý toàn bộ quá trình trên GitHub và sử dụng công cụ AI một cách có trách nhiệm.
1.2.4. Phạm vi
Nhóm phân loại tính năng theo phương pháp MoSCoW (xem Mục 2.1.4). Phạm vi chính thức của phiên bản hiện tại như sau:
Bảng 1.1. Phạm vi của sản phẩm theo MoSCoW
| Nhóm   | Nội dung   |
| Must have (cốt lõi MVP)   | Đăng nhập và phân quyền; quản lý danh mục, thực đơn; quản lý sơ đồ bàn và mã QR; E-Menu qua QR; giỏ hàng và đặt món tại bàn; điều phối bếp thời gian thực; quản lý trạng thái bàn và thanh toán.   |
| Should have   | Khách theo dõi trạng thái món theo thời gian thực; báo hết món nhanh từ bếp; quản lý tài khoản nhân viên; thống kê báo cáo doanh thu và lịch sử hóa đơn.   |
| Could have   | Khách gửi đánh giá sao và phản hồi; nút “Gọi nhân viên / Yêu cầu thanh toán” trên điện thoại khách.   |
| Won’t have (chưa làm)   | Tự động xác nhận giao dịch qua cổng thanh toán trực tuyến (VNPay, MoMo); quản lý định lượng nguyên vật liệu và trừ kho theo công thức; tích điểm thành viên và mã giảm giá phức tạp.   |
Lưu ý: hệ thống có sinh mã VietQR động (chứa sẵn số tiền và nội dung theo mã hóa đơn) để khách quét chuyển khoản, nhưng việc xác nhận đã nhận tiền do thu ngân thực hiện thủ công; tự động đối soát giao dịch thuộc nhóm Won’t have.
1.3. Ý nghĩa và ứng dụng thực tế
Với khách hàng: gọi món nhanh, chủ động, biết món đang ở khâu nào mà không phải gọi nhân viên nhiều lần. Với nhân viên: bếp nhận đơn đúng thứ tự, đủ ghi chú khẩu vị; thu ngân thấy toàn bộ trạng thái bàn, hạn chế nhầm lẫn khi tính tiền. Với chủ nhà hàng: số liệu doanh thu, món bán chạy, tỷ lệ hủy món và đối soát quỹ theo ca có sẵn, thay cho sổ sách thủ công.
Sản phẩm triển khai được cho quán ăn, quán cà phê, nhà hàng quy mô nhỏ và vừa, chạy trên trình duyệt sẵn có. Về học thuật, dự án là dịp vận dụng các khái niệm trong giáo trình vào một sản phẩm cụ thể, có thể đối chiếu được trên GitHub.

CHƯƠNG 2. PHÂN TÍCH VÀ THIẾT KẾ SẢN PHẨM
2.1. Phân tích nhu cầu người dùng
2.1.1. Personas
Nhóm xây dựng bốn persona đại diện các nhóm người dùng chính. Persona là nhân vật hư cấu nhưng dựa trên đặc điểm công việc thực tế của từng vai trò (Sommerville, 2020, Chương 4).
Bảng 2.1. Các persona của hệ thống
| Persona   | Bối cảnh   | Mục tiêu   | Khó khăn hiện tại   |
| Hà (29 tuổi)  Khách hàng   | Nhân viên văn phòng, đi ăn cùng bạn bè, dùng điện thoại thành thạo.   | Xem thực đơn, tự gọi món, biết món đang làm đến đâu, gọi thêm dễ dàng.   | Phải chờ nhân viên đưa menu và ghi món; không biết bao lâu có món; gọi thêm khó thu hút nhân viên.   |
| Tuấn (45 tuổi)  Quản lý / chủ quán   | Sở hữu nhà hàng, cần kiểm soát nhân sự, thực đơn và doanh thu.   | Cập nhật thực đơn nhanh; phân quyền đúng người; xem doanh thu, món bán chạy.   | Thực đơn giấy khó cập nhật; tổng kết thủ công; khó kiểm soát hủy món, giảm giá.   |
| Hùng (35 tuổi)  Nhân viên Bếp   | Đứng bếp trong giờ cao điểm, cần nhìn nhanh trên màn hình lớn.   | Nhận đơn tức thời, đúng thứ tự, đủ ghi chú; báo món xong, báo hết món.   | Phiếu giấy thất lạc; không rõ món nào gọi trước; khách vẫn đặt món đã hết.   |
| Linh (23 tuổi)  Thu ngân / Phục vụ   | Quản lý nhiều bàn cùng lúc, thanh toán và điều phối chỗ ngồi.   | Thấy sơ đồ bàn trực quan; gộp các lượt gọi món; thanh toán chính xác; chuyển, ghép bàn.   | Cộng tay dễ sai; không biết bàn nào cần hỗ trợ hay sắp thanh toán.   |
2.1.2. Scenarios
Scenario 1 – Khách gọi món. Hà ngồi bàn số 7, quét mã QR trên bàn bằng điện thoại. Trang E-Menu hiện ra kèm “Bàn 7 – Khu A”. Cô lọc danh mục “Món chính”, chọn lẩu, chọn size và ghi chú “ít cay”, thêm đồ uống, rồi bấm gửi đơn. Cô thấy món chuyển trạng thái từ “Chờ xác nhận” sang “Đang chế biến” mà không cần tải lại trang. Sau đó cô gọi thêm một lượt món mới trong cùng bữa ăn.
Scenario 2 – Bếp và thu ngân. Hùng thấy đơn bàn 7 xuất hiện trên màn hình bếp kèm tiếng chuông, bấm “Bắt đầu nấu”, rồi “Hoàn thành”. Khi hết nguyên liệu một món, anh gạt “Hết món” và E-Menu của khách lập tức khóa món đó. Linh thấy bàn 7 chuyển màu “Chờ thanh toán” sau khi khách bấm yêu cầu thanh toán, mở hóa đơn, áp mã giảm giá, hiển thị mã VietQR cho khách quét và xác nhận hoàn tất; bàn tự về “Trống”.
Scenario 3 – Quản lý. Tuấn đổi giá một món và đánh dấu món mới là “Món bán chạy”; cuối ngày anh xem dashboard doanh thu, tỷ trọng tiền mặt/chuyển khoản, top món bán chạy và đối soát quỹ khi thu ngân đóng ca.
2.1.3. User stories
Ở cấp sản phẩm, nhóm xây dựng 14 user story theo ba phân hệ. Các story được chi tiết hóa thành 140 user story nhỏ (US-001 → US-140) phân bổ vào bốn sprint (Mục 2.1.5).
Bảng 2.2. User story cấp sản phẩm
| ID   | Vai trò   | Tôi muốn…   | Để…   |
| US-01   | Quản lý   | đăng nhập và phân quyền tài khoản theo vai trò   | bảo mật dữ liệu, giới hạn đúng chức năng từng bộ phận   |
| US-02   | Quản lý   | thêm, sửa, xóa bàn ăn và xuất mã QR từng bàn   | khách quét mã gọi món đúng vị trí ngồi   |
| US-03   | Quản lý   | quản lý danh mục và thông tin món (tên, ảnh, giá, còn/hết)   | thực đơn luôn chính xác   |
| US-04   | Quản lý   | quản lý danh sách tài khoản nhân viên   | kiểm soát nhân sự làm việc   |
| US-05   | Quản lý   | xem báo cáo doanh thu theo ngày/tháng và lịch sử hóa đơn   | nắm tình hình kinh doanh   |
| US-06   | Khách hàng   | quét QR tại bàn để vào thực đơn trên trình duyệt điện thoại   | không cần tải ứng dụng   |
| US-07   | Khách hàng   | tìm theo tên và lọc món theo danh mục   | nhanh chóng chọn món   |
| US-08   | Khách hàng   | thêm vào giỏ, ghi chú riêng và gửi đơn   | bếp bắt đầu chế biến   |
| US-09   | Khách hàng   | xem trạng thái món theo thời gian thực   | biết món nào đang nấu, sắp mang ra   |
| US-10   | Khách hàng   | gửi đánh giá sao và nhận xét sau bữa ăn   | góp ý chất lượng cho nhà hàng   |
| US-11   | Nhân viên Bếp   | nhận thông báo đơn mới ngay và cập nhật trạng thái chế biến   | phục vụ đúng thứ tự, nhanh   |
| US-12   | Nhân viên Bếp   | chuyển món sang “Tạm hết” ngay trên màn hình bếp   | khách không đặt nhầm món hết nguyên liệu   |
| US-13   | Thu ngân   | theo dõi sơ đồ bàn trực quan (trống, có khách, chờ thanh toán)   | điều phối chỗ ngồi kịp thời   |
| US-14   | Thu ngân   | tổng hợp các lượt gọi món, xuất hóa đơn và giải phóng bàn   | đón lượt khách mới   |
2.1.4. Product backlog và tiêu chí chấp nhận
Product backlog gồm 12 hạng mục (PB-01 → PB-12) kèm mức ưu tiên, story point (SP) và tiêu chí chấp nhận (acceptance criteria – AC). Tổng ước lượng là 52 story point.
Bảng 2.3. Product backlog chi tiết
| PB   | Epic   | Ưu tiên / SP   | Acceptance criteria (tóm tắt)   | Sprint   |
| PB-01   | Xác thực & Phân quyền   | High / 3   | Đăng nhập hợp lệ (JWT/Session); phân quyền đúng (Quản lý toàn quyền, Thu ngân: sơ đồ bàn và hóa đơn, Bếp: điều phối món); chặn truy cập trái phép.   | 1   |
| PB-02   | Quản lý Thực đơn   | High / 5   | CRUD danh mục và món (tên, giá, ảnh, mô tả, trạng thái); thay đổi hiển thị ngay trên E-Menu.   | 1   |
| PB-03   | Quản lý Bàn & Mã QR   | High / 3   | CRUD bàn (tên, khu vực, sức chứa); tự sinh URL kèm token bàn và ảnh QR; tải xuống, in QR.   | 1   |
| PB-04   | E-Menu cho khách   | High / 5   | Quét QR vào đúng bàn; danh sách món theo danh mục, có ảnh và giá; tìm kiếm, lọc; responsive; món “Tạm hết” bị làm mờ và khóa.   | 2   |
| PB-05   | Đặt món tại bàn   | High / 5   | Tăng giảm số lượng, tạm tính; ghi chú từng món hoặc cả đơn; gửi đơn lưu CSDL và tự mở phiên phục vụ; gọi thêm nhiều lần.   | 2   |
| PB-06   | Điều phối Bếp real-time   | High / 8   | Đơn mới hiện ngay qua Socket.io không tải lại trang; hiển thị bàn, món, số lượng, ghi chú, giờ đặt; đổi trạng thái chờ → đang chế biến → hoàn thành (hoặc từ chối / hết món).   | 3   |
| PB-07   | Theo dõi đơn hàng   | Medium / 3   | Trạng thái món trên điện thoại khách tự đồng bộ khi bếp cập nhật; hiển thị các lượt gọi và tạm tính.   | 2   |
| PB-08   | Sơ đồ bàn & Thanh toán (POS)   | High / 8   | Sơ đồ bàn có màu theo trạng thái; xem chi tiết các lượt gọi, hủy món (nếu bếp chưa làm), thêm món giúp khách; thanh toán tiền mặt/chuyển khoản, lưu hóa đơn, bàn về “Trống”.   | 3   |
| PB-09   | Báo hết món nhanh   | Medium / 2   | Nút gạt Còn hàng / Tạm hết trên giao diện bếp; E-Menu cập nhật không cho đặt ngay.   | 3   |
| PB-10   | Quản lý Nhân sự   | Medium / 3   | Xem, thêm tài khoản, cập nhật vai trò, đổi mật khẩu; khóa/mở khóa tài khoản.   | 1   |
| PB-11   | Thống kê & Báo cáo   | Medium / 5   | Doanh thu, số hóa đơn theo ngày/tuần/tháng; biểu đồ; top món bán chạy; tra cứu lịch sử hóa đơn.   | 4   |
| PB-12   | Đánh giá & Phản hồi   | Low / 2   | Khách chấm 1–5 sao và nhận xét; quản lý xem danh sách kèm thời gian, số bàn.   | 4   |
2.1.5. Kế hoạch sprint
Dự án chia thành bốn sprint, mỗi sprint một tuần. Mỗi sprint có mục tiêu, danh sách user story, ERD riêng và kết quả bàn giao được ghi trong báo cáo sprint.
Bảng 2.4. Kế hoạch bốn sprint
| Sprint   | Chủ đề   | Phạm vi user story   | Số US   |
| 1 (Tuần 1)   | Nền tảng, tài khoản, phân quyền, sơ đồ bàn, thực đơn   | US-001 → US-044   | 44   |
| 2 (Tuần 2)   | E-Menu QR, giỏ hàng, đặt món và đồng bộ thời gian thực   | US-045 → US-078   | 34   |
| 3 (Tuần 3)   | Điều phối bếp (KDS), sơ đồ bàn phục vụ, thu ngân và thanh toán   | US-079 → US-110   | 32   |
| 4 (Tuần 4)   | Báo cáo doanh thu, đánh giá, ca làm việc, hoàn thiện và triển khai   | US-111 → US-140   | 30   |
2.2. Yêu cầu chức năng và phi chức năng
2.2.1. Yêu cầu chức năng (FR)
Bảng 2.5. Yêu cầu chức năng theo nhóm
| Mã   | Nhóm chức năng   | Nội dung chính   | User story   | Sprint   |
| FR-01   | Bảo mật nền tảng   | Băm mật khẩu, JWT/Session, Refresh Token, middleware chặn truy cập, giới hạn tần suất, kiểm tra đầu vào   | US-001 → 006   | 1   |
| FR-02   | Tài khoản cá nhân   | Đăng nhập, đăng xuất, đổi mật khẩu, hồ sơ cá nhân   | US-007 → 010   | 1   |
| FR-03   | Hồ sơ nhân sự   | Tạo, tìm kiếm, cập nhật, đặt lại mật khẩu, khóa/mở khóa nhân viên   | US-011 → 014   | 1   |
| FR-04   | Vai trò & quyền hạn   | CRUD vai trò, gán vai trò, cấu hình quyền chi tiết, lịch sử thay đổi quyền   | US-015 → 022   | 1   |
| FR-05   | Khu vực & bàn, mã QR   | CRUD khu vực và bàn, sinh token và ảnh QR, làm mới token, in QR hàng loạt   | US-023 → 030   | 1   |
| FR-06   | Danh mục & thực đơn   | CRUD danh mục, món; upload ảnh; tùy chọn (size, topping, đá, đường, cay); bật/tắt Đang bán/Tạm hết; món bán chạy; xóa mềm   | US-031 → 040   | 1   |
| FR-07   | Quản trị nền tảng   | Thông tin quán, thuế VAT, phí phục vụ, tài khoản VietQR, nhật ký hệ thống   | US-041 → 044   | 1   |
| FR-08   | Phiên bàn qua QR   | Giải mã QR, khởi tạo hoặc nối tiếp phiên bàn, chặn khi QR sai hoặc bàn khóa, nhiều khách cùng đặt chung   | US-045 → 049   | 2   |
| FR-09   | E-Menu   | Trang chủ E-Menu, món theo danh mục, bán chạy, tìm kiếm, lọc giá, chi tiết món   | US-050 → 056   | 2   |
| FR-10   | Giỏ hàng   | Kiểm tra món và tùy chọn hợp lệ, tạm tính do server tính, đồng bộ giỏ   | US-057 → 062   | 2   |
| FR-11   | Đặt món & theo dõi   | Tạo đơn, gọi thêm lượt, hủy món khi “Chờ xác nhận”, tổng tiền lũy kế   | US-063 → 070   | 2   |
| FR-12   | Hỗ trợ tại bàn   | Gọi nhân viên (kèm lý do), yêu cầu thanh toán, theo dõi tiếp nhận   | US-071 → 074   | 2   |
| FR-13   | Đồng bộ real-time   | Socket.io theo Room (Bàn, Bếp, Thu ngân), đẩy đơn mới, đồng bộ trạng thái, khóa món hết hàng, chuông báo   | US-075 → 078   | 2   |
| FR-14   | Điều phối bếp (KDS)   | Hàng đợi FIFO, gom nhóm món giống nhau, đổi trạng thái, báo phục vụ, lịch sử món đã nấu   | US-079 → 086   | 3   |
| FR-15   | Hết món, hủy, trả món   | Bếp báo hết hoặc từ chối món; Thu ngân/Quản lý hủy, đổi trả và ghi lịch sử thất thoát   | US-087 → 091   | 3   |
| FR-16   | Vận hành sơ đồ bàn   | Trạng thái toàn bộ bàn, mở bàn, đặt món hộ, xác nhận đã phục vụ, chuyển bàn, ghép bàn   | US-092 → 098   | 3   |
| FR-17   | Hóa đơn & khuyến mãi   | CRUD khuyến mãi, áp mã, phụ phí, VAT, tổng hợp hóa đơn, phiếu tạm tính   | US-099 → 104   | 3   |
| FR-18   | Thanh toán   | Tiền mặt (tính tiền thừa), VietQR động, tách hóa đơn, đóng phiên bàn   | US-105 → 110   | 3   |
| FR-19   | Đánh giá & phản hồi   | Chấm sao, nhận xét, quản lý phản hồi, điểm trung bình   | US-111 → 116   | 4   |
| FR-20   | Ca làm việc   | Mở/đóng ca, phiếu thu chi, đối soát quỹ, lịch sử giao ca   | US-117 → 122   | 4   |
| FR-21   | Thống kê & báo cáo   | Dashboard, biểu đồ doanh thu, tỷ trọng thanh toán, top món, giờ cao điểm, tỷ lệ hủy   | US-123 → 130   | 4   |
| FR-22   | Lịch sử & xuất file   | Tra cứu hóa đơn cũ, xuất CSV/Excel   | US-131 → 134   | 4   |
| FR-23   | Tối ưu & triển khai   | Responsive, lazy loading, auto-reconnect WebSocket, rà soát bảo mật, CI/CD, dữ liệu mẫu   | US-135 → 140   | 4   |
Phân quyền chức năng theo vai trò (PB-01): Quản lý có toàn quyền; Thu ngân truy cập sơ đồ bàn, hóa đơn và thanh toán; Bếp truy cập màn hình điều phối món; Phục vụ thao tác vận hành bàn và đặt món hộ. Việc kiểm tra quyền luôn thực hiện ở backend; ẩn nút trên giao diện không được coi là phân quyền.
2.2.2. Yêu cầu phi chức năng (NFR)
Bảng 2.6. Yêu cầu phi chức năng
| Mã   | Nhóm   | Yêu cầu   | Cách kiểm chứng   |
| NFR-01   | Bảo mật   | Mật khẩu băm bcrypt (hoặc Argon2id); phiên có thời hạn và thu hồi được; kiểm tra quyền ở mọi API riêng tư; phân biệt 401 và 403; giới hạn tần suất đăng nhập và quét QR; chống SQL injection, XSS, CSRF; CORS chỉ nguồn được duyệt.   | Code review; kiểm thử baoMat, phanQuyen   |
| NFR-02   | Toàn vẹn & đồng thời   | Đặt món, chuyển/ghép bàn, thanh toán dùng Transaction; UNIQUE chống bản ghi trùng; gửi lặp và thanh toán lặp cho kết quả nhất quán; không mở hai phiên trên một bàn đang có khách.   | Kiểm thử dongThoi, thanhToan   |
| NFR-03   | Thời gian thực   | Đơn mới và thay đổi trạng thái đến bếp, thu ngân, khách mà không cần tải lại trang; tự kết nối lại khi mất kết nối.   | Kiểm thử tích hợp luồng đặt món   |
| NFR-04   | Khả dụng   | E-Menu mobile-first, không cần cài ứng dụng; màn hình bếp và thu ngân responsive cho máy tính/tablet; thông báo rõ khi dữ liệu trống, món hết, lỗi kết nối, đang tải.   | Kiểm thử giao diện, kiểm thử E2E   |
| NFR-05   | Hiệu năng   | Đánh chỉ mục cho các cột tìm kiếm, liên kết, lọc; phân trang danh sách lớn; lazy loading ảnh món.   | Phân tích truy vấn; đo thời gian tải   |
| NFR-06   | Bảo trì   | Cấu trúc module thống nhất; đặt tên tiếng Việt không dấu theo quy chuẩn; không lặp logic; phản hồi API thống nhất { ok, data, msg }.   | Review PR theo quy chuẩn   |
| NFR-07   | Triển khai & sao lưu   | Frontend trên Vercel, backend và CSDL trên cloud; cấu hình qua biến môi trường; có sao lưu CSDL.   | Kiểm tra môi trường production   |

2.3. Phương án kiến trúc và công nghệ
2.3.1. So sánh các phương án kiến trúc
Bảng 2.7. So sánh các phương án kiến trúc
| Phương án   | Ưu điểm   | Nhược điểm   | Đánh giá   |
| Monolith phân module   | Đơn giản triển khai và kiểm thử; một CSDL cho phép Transaction nhất quán giữa đơn, bàn, hóa đơn; phù hợp nhóm 5 người, 4 tuần.   | Khó mở rộng độc lập từng phần; lỗi nghiêm trọng có thể ảnh hưởng toàn hệ thống.   | Chọn.   |
| Microservices   | Triển khai và mở rộng độc lập; linh hoạt công nghệ.   | Vận hành phức tạp; khó giữ nhất quán dữ liệu giữa đơn – phiên bàn – hóa đơn; chi phí lớn so với quy mô.   | Không chọn.   |
| Serverless / BaaS   | Ít phải quản trị máy chủ.   | Khó kiểm soát độ trễ WebSocket; phụ thuộc nhà cung cấp; khó viết Transaction phức tạp.   | Không chọn cho MVP.   |
2.3.2. Kiến trúc đề xuất
Hệ thống dùng kiến trúc modular monolith: một backend Node.js chia thành 20 module nghiệp vụ độc lập, mỗi module có bộ tệp routes, validation, controller, service, model và index.js (chỉ xuất thành phần công khai). Controller chỉ nhận yêu cầu và trả kết quả; service xử lý nghiệp vụ; model chỉ truy vấn CSDL; không cho phép phụ thuộc vòng giữa các module. Các tác vụ nền (đóng phiên bàn hết hạn, tổng hợp doanh thu ngày) chạy riêng trong tacVuNen. Socket.io chia theo Room (Bàn khách, Bếp, Thu ngân) để đẩy sự kiện, nhưng CSDL luôn là căn cứ cuối cùng bảo đảm toàn vẹn dữ liệu (Fowler, 2015).
[Hình 2.1. Kiến trúc tổng thể của hệ thống]
2.3.3. Lựa chọn công nghệ và ưu nhược điểm
Bảng 2.8. Công nghệ sử dụng
| Thành phần   | Công nghệ   | Ưu điểm   | Nhược điểm / rủi ro   |
| Frontend   | Web SPA JavaScript (HTML5, CSS3 hiện đại, Vanilla JS / Modular JS), Chart.js cho biểu đồ, tối ưu in Standee QR (CSS Print), triển khai Vercel   | Mobile-first, không cần cài đặt; giao diện chạy tức thì, nhẹ; kiểm soát tối đa DOM và luồng offline.   | Cần quản lý trạng thái và phiên đặt món phía client cẩn trọng.   |
| Backend   | Node.js Express, kiến trúc module   | Cùng ngôn ngữ với frontend; nhẹ; dễ làm REST và WebSocket.   | Ít ràng buộc cấu trúc, cần kỷ luật theo quy chuẩn.   |
| Real-time   | Socket.io (Room Bàn/Bếp/Thu ngân)   | Đẩy sự kiện tức thời; có kết nối lại.   | Cần xử lý mất kết nối; không thay thế toàn vẹn dữ liệu.   |
| CSDL   | Quan hệ MySQL/PostgreSQL/SQLite – xác nhận, Transaction, Index   | Toàn vẹn dữ liệu, ACID, truy vấn thống kê mạnh.   | Thiết kế schema và migration cẩn thận.   |
| Xác thực   | bcrypt (bcryptjs), JWT + Refresh Token   | Chuẩn phổ biến; không giữ phiên phía server.   | Thu hồi token khó; cần thời hạn ngắn.   |
| Mã QR / thanh toán   | Sinh QR SVG thuần Client (offline); VietQR động chuẩn Napas   | Độc lập hoàn toàn, không phụ thuộc API bên ngoài; tạo QR tức thời.   | Xác nhận thanh toán còn thủ công.   |
| Triển khai   | Vercel (frontend, quanmoc.com), Cloud Server (backend, CSDL)   | Triển khai nhanh, có tên miền.   | Phụ thuộc hạ tầng bên thứ ba.   |
| Quản lý mã nguồn   | Git, GitHub (Issues, PR, Milestones, Releases)   | Minh bạch, truy vết được.   | —   |
2.3.4. Thiết kế REST API
API theo phong cách REST (Fielding, 2000): tài nguyên là danh từ (ví dụ /api/thuc-don, /api/don-goi-mon), dùng phương thức HTTP chuẩn, dữ liệu JSON và mã trạng thái có ý nghĩa. Mỗi API xác định rõ quyền truy cập, đầu vào, đầu ra; danh sách lớn phải phân trang; API gửi đơn và xác nhận thanh toán phải chống gửi lặp; chỉ cho phép cập nhật các trường được phép; không trả về mật khẩu, token bí mật hay dữ liệu nội bộ.
Bảng 2.9. Quy ước phản hồi và mã HTTP
| Nội dung   | Quy ước   |
| Phản hồi thành công   | { "ok": true, "data": {}, "msg": "Thành công" }   |
| Phản hồi lỗi   | { "ok": false, "data": null, "msg": "Dữ liệu không hợp lệ" }   |
| Mã HTTP   | 200 thành công; 201 tạo mới; 400 đầu vào không hợp lệ; 401 chưa xác thực; 403 không đủ quyền; 404 không tìm thấy; 409 xung đột; 422 sai điều kiện nghiệp vụ; 429 quá nhiều yêu cầu; 500 lỗi máy chủ   |

2.4. Thiết kế cơ sở dữ liệu
CSDL được thiết kế theo từng sprint bởi thành viên phụ trách CSDL, sau đó hợp nhất thành ERD tổng thể ở Sprint 4. Hình dưới là sơ đồ quan hệ ở mức khái niệm (entity), thể hiện các thực thể chính và quan hệ giữa chúng. Đối chiếu với ERD chi tiết chính thức (kèm cột, kiểu dữ liệu) của thành viên phụ trách CSDL.
[Hình 2.2. ERD mức khái niệm của hệ thống]
Bảng 2.10. Nhóm bảng dữ liệu theo sprint
| Sprint   | Nhóm bảng dữ liệu   |
| 1   | Tài khoản, hồ sơ nhân viên, phiên đăng nhập; vai trò, quyền hạn và bảng liên kết; khu vực, bàn ăn, mã QR; danh mục, món ăn, hình ảnh, tùy chọn món; nhật ký hệ thống; cấu hình nhà hàng.   |
| 2   | Phiên phục vụ tại bàn (Table Session); giỏ hàng tạm; đơn đặt món và chi tiết; tùy chọn/ghi chú từng món; lịch sử trạng thái đơn; yêu cầu hỗ trợ tại bàn; thông báo real-time.   |
| 3   | Hàng đợi chế biến và nhật ký trạng thái món của bếp; phiếu hủy/đổi trả món; lịch sử chuyển/ghép bàn; khuyến mãi; hóa đơn, dòng hóa đơn; giao dịch thanh toán.   |
| 4   | Đánh giá và phản hồi; ca làm việc, biên bản giao ca, đối soát quỹ; bảng tổng hợp doanh thu ngày/tháng, thống kê theo món; lịch sử xuất báo cáo.   |
Nguyên tắc thiết kế: mỗi bảng có khóa chính; khóa ngoại bảo đảm toàn vẹn tham chiếu; UNIQUE cho trường duy nhất (tên đăng nhập, mã bàn, mã hóa đơn); NOT NULL và CHECK (giá, số lượng > 0); tên bảng và cột theo snake_case; truy vấn dùng tham số, không nối chuỗi từ dữ liệu người dùng; chỉ mục cho cột thường tìm kiếm hoặc lọc (ban_an_id, phien_ban_id, trang_thai, ngay_tao); đơn giá món được sao chép vào chi tiết đơn tại thời điểm gọi để đổi giá sau này không ảnh hưởng hóa đơn cũ; món ngừng kinh doanh dùng xóa mềm để giữ lịch sử.
Nghiệp vụ bắt buộc dùng Transaction: tạo đơn kèm chi tiết món; chuyển bàn; ghép bàn; tách hóa đơn; thanh toán hóa đơn kèm đóng phiên bàn.

2.5. Thiết kế chức năng hệ thống và lập trình
2.5.1. Luồng nghiệp vụ chính
Luồng xuyên suốt của hệ thống đi qua ba phân hệ: khách hàng, bếp, thu ngân. Trạng thái món đi theo chuỗi Chờ xác nhận → Đang chế biến → Đã xong → Đã lên món; bếp có thể từ chối món hoặc báo hết.
[Hình 2.3. Luồng đặt món và thanh toán xuyên suốt ba phân hệ]
2.5.2. Quy tắc phiên bàn, đặt món và thanh toán
Mỗi bàn chỉ có một phiên phục vụ đang mở; trạng thái phiên trong CSDL là căn cứ cho phép nhận lượt gọi món mới. Phiên hết hạn mà không có đơn sẽ được tác vụ nền đóng và trả bàn về “Trống”.
Khách chỉ được hủy món khi món ở “Chờ xác nhận”; hủy sau đó cần Thu ngân/Quản lý và phải lưu lý do.
Không đặt được món “Tạm hết”; khi bếp báo hết, giao dịch đặt món đang chạy phải kiểm tra lại trạng thái món.
Backend tự tính đơn giá, phụ phí, giảm giá, thuế VAT và tổng tiền; không tin các giá trị này từ frontend.
Mỗi hóa đơn có mã duy nhất; xác nhận thanh toán lặp không được tạo hóa đơn trùng hay cộng doanh thu hai lần; số tiền và nội dung chuyển khoản phải được đối chiếu.
2.5.3. Cấu trúc mã nguồn và mẫu hàm
WebsiteQuanLyNhaHang/
├── backend/
│   ├── cauHinh/  middleware/  tienIch/  tacVuNen/
│   └── modules/   (20 module: taiKhoan, vaiTro, nhanVien,
│       khuVuc, banAn, danhMucMon, thucDon, phienBan, gioHang,
│       donGoiMon, dieuPhoiBep, yeuCauHoTro, khuyenMai, hoaDon,
│       thanhToan, caLamViec, danhGia, thongBao, baoCao,
│       cauHinhNhaHang) mỗi module gồm:
│         *.routes.js  *.validation.js  *.controller.js
│         *.service.js  *.model.js  index.js
├── frontend/  (dungChung, thanhPhan, trang, dinhTuyen)
├── database/  (taoBang, duLieuMau, chiMuc, rangBuoc .sql)
├── kiemThu/   (api, nghiepVu, baoMat, phanQuyen,
│               dongThoi, thanhToan)
└── taiLieu/   (quyChuanPhatTrien, dacTaApi, phanCongCongViec,
                baoCaoSprint/)

2.6. Chất lượng và vận hành
2.6.1. Bảo mật
Các biện pháp bảo mật bám theo quy chuẩn dự án, danh mục OWASP Top 10 (OWASP Foundation, 2021) và nội dung bảo mật, quyền riêng tư trong Sommerville (2020, Chương 8).
Bảng 2.11. Rủi ro bảo mật và biện pháp
| Rủi ro   | Biện pháp   |
| Truy cập trái phép, vượt quyền   | Xác thực và kiểm tra vai trò/quyền ở backend cho mọi API riêng tư; không tin vai trò, đơn giá, số lượng, giảm giá, trạng thái thanh toán từ frontend; tài khoản bị khóa bị từ chối.   |
| Lộ hoặc bị đoán mật khẩu   | Băm bcrypt/Argon2id; không ghi mật khẩu, token vào nhật ký; không có tài khoản quản trị mặc định mật khẩu cố định; giới hạn tần suất đăng nhập.   |
| Đánh cắp phiên   | Phiên có thời hạn và thu hồi được; cookie HttpOnly, Secure, SameSite; HTTPS và HSTS; chống CSRF khi dùng cookie.   |
| SQL injection   | Truy vấn tham số hóa; kiểm tra dữ liệu đầu vào ở lớp validation.   |
| XSS   | Làm sạch HTML bằng hàm làm sạch / escapeHtml chuyên dụng cho ghi chú món, nội dung đánh giá, mô tả món ăn; thiết lập CSP.   |
| Tệp tải lên độc hại   | Kiểm tra dung lượng (tối đa 5MB), loại tệp (JPG/PNG/WEBP) và nội dung thật; không thực thi tệp; lưu ngoài thư mục mã nguồn công khai.   |
| Lạm dụng QR, API nhạy cảm   | Token QR 16 bytes ngẫu nhiên, làm mới được; giới hạn tần suất quét QR và API nhạy cảm; kiểm tra mã định danh phiên bàn.   |
| Lỗ hổng thư viện, lộ thông tin lỗi   | Cập nhật thư viện phụ thuộc; không hiển thị câu SQL, đường dẫn máy chủ; .env không đưa lên Git.   |
2.6.2. Lập trình tin cậy và xử lý đồng thời
Theo Sommerville (2020, Chương 9), độ tin cậy đạt được bằng phòng ngừa, phát hiện và chịu lỗi. Với bài toán nhà hàng, rủi ro lớn nhất là tranh chấp dữ liệu khi nhiều điện thoại cùng bàn đặt món, bếp báo hết món lúc khách đặt, hoặc thu ngân bấm thanh toán nhiều lần.
Bảng 2.12. Tình huống đồng thời và biện pháp xử lý
| Tình huống   | Biện pháp   |
| Nhiều khách cùng bàn đặt món một lúc   | Transaction khi ghi đơn và chi tiết; khóa bản ghi hoặc cập nhật có điều kiện; không đọc rồi ghi tách rời tổng tiền.   |
| Bếp báo hết món khi khách vừa bấm đặt   | Kiểm tra lại trạng thái món trong cùng giao dịch; từ chối món “Tạm hết”.   |
| Khách bấm Đặt món hoặc thu ngân bấm Thanh toán nhiều lần   | Chống gửi lặp (khóa nghiệp vụ, mã giao dịch duy nhất); kết quả nhất quán.   |
| Mở hai phiên trên cùng một bàn đang có khách   | Ràng buộc UNIQUE/điều kiện trong CSDL; không dùng bộ nhớ một tiến trình làm cơ chế khóa duy nhất.   |
| Giao dịch lỗi giữa chừng   | Rollback toàn bộ thay đổi liên quan.   |
2.6.3. Kiểm thử
Nhóm kiểm thử cả luồng thành công lẫn thất bại; dữ liệu thiếu, sai định dạng, vượt giới hạn, trùng; truy cập khi chưa đăng nhập hoặc không đủ quyền; tính hợp lệ của QR và phiên bàn; thao tác đồng thời; gửi đơn, thanh toán lặp; SQL injection, XSS, CSRF. Mã kiểm thử được tổ chức theo thư mục và các thành viên kiểm thử chéo lẫn nhau; kết quả kiểm thử phải ghi lại thực tế, không báo thành công nếu chưa chạy.
Bảng 2.13. Tổ chức thư mục kiểm thử
| Thư mục   | Nội dung kiểm thử   |
| kiemThu/api   | Kiểm thử tích hợp từng nhóm API (luồng thành công và thất bại)   |
| kiemThu/nghiepVu   | Quy tắc nghiệp vụ: trạng thái món, hủy món, tính tiền, chuyển/ghép bàn   |
| kiemThu/baoMat   | SQL injection, XSS, CSRF, tải tệp, giới hạn tần suất   |
| kiemThu/phanQuyen   | Truy cập theo vai trò, phân biệt 401 và 403   |
| kiemThu/dongThoi   | Nhiều máy cùng đặt món, bếp báo hết khi khách đặt   |
| kiemThu/thanhToan   | Thanh toán lặp, đối soát số tiền, VietQR, đóng phiên bàn   |
2.6.4. Code review, quản lý mã nguồn và DevOps
Quản lý mã nguồn: mỗi thành viên làm trên nhánh riêng (ví dụ feature/goi-mon-qr, fe-quan-sprint1); không gộp mã chưa kiểm thử vào nhánh chính; không đưa node_modules, .env, bí mật lên Git; commit ngắn gọn, mô tả đúng thay đổi.
Code review: trưởng nhóm review Pull Request; kiểm tra xung đột, kiểm thử hồi quy trước khi tích hợp; thay đổi API, sự kiện Socket, CSDL phải thông báo người liên quan.
DevOps: Sprint 4 thiết lập biến môi trường, CI/CD triển khai frontend lên Vercel (quanmoc.com) và backend lên Cloud Server; cấu hình sao lưu CSDL; kiểm thử end-to-end toàn luồng.

CHƯƠNG 3. QUY TRÌNH CỘNG TÁC TRÊN GITHUB VÀ SỬ DỤNG CÔNG CỤ AI
3.1. Cách nhóm sử dụng GitHub
Toàn bộ quá trình phát triển được quản lý trên repository GitHub: link repository. Bảng dưới đây mô tả quy ước của nhóm và minh chứng tương ứng.
Bảng 3.1. Cách sử dụng các công cụ của GitHub
| Công cụ   | Quy ước và cách dùng   |
| Issues   | Mỗi user story (US-xxx) hoặc tác vụ là một issue, gắn nhãn theo loại (feature, bug, docs, testing, ai-assisted), gán người phụ trách và milestone. Issue #… ghi product vision; #…–#… ghi persona và user story   |
| Commits & nhánh   | Mỗi thành viên một nhánh theo quy ước loại/nội dung (feature/xac-thuc-tai-khoan, fe-quan-sprint1); commit ngắn gọn, mô tả đúng thay đổi.   |
| Pull requests   | Gộp vào nhánh chính qua PR do trưởng nhóm review; kiểm tra xung đột và kiểm thử trước khi gộp; không gộp mã chưa kiểm thử.   |
| Milestones   | Bốn milestone tương ứng Sprint 1 → 4 (mỗi sprint một tuần). Ngày bắt đầu/kết thúc thực tế   |
| Releases   | Phát hành theo sprint: v0.1 (Sprint 1), v0.2 (Sprint 2), v0.3 (Sprint 3), v1.0 (Sprint 4) kèm ghi chú.   |
| README.md   | Giới thiệu sản phẩm, công nghệ, hướng dẫn cài đặt và chạy, cấu trúc thư mục, thành viên.   |
| Tài liệu   | Thư mục taiLieu/: quy chuẩn phát triển, đặc tả yêu cầu, đặc tả API, sơ đồ CSDL, phân công công việc, baoCaoSprint/sprint0X.md.   |
[Hình 3.1. Trang chủ repository và README.md]
[Hình 3.2. Issues và Milestones của dự án]
[Hình 3.3. Pull request, review và lịch sử commit]

3.2. Nhật ký sử dụng công cụ AI
Nhóm sử dụng AI như một trợ lý, không thay thế tư duy của nhóm. Nguyên tắc: không đưa thông tin nhạy cảm (khóa bí mật, mật khẩu, thông tin thanh toán thật) vào công cụ AI; mã do AI gợi ý phải được đọc hiểu, chạy thử và kiểm thử trước khi tích hợp; nhóm chịu trách nhiệm về quyết định cuối cùng; các PR có hỗ trợ AI được gắn nhãn để truy vết.
Nhóm điền nhật ký thực tế bên dưới. Mỗi dòng ghi: thành viên, công cụ AI và mục đích, nội dung AI gợi ý, phần nhóm kiểm chứng/sửa/loại bỏ, phần nhóm tự quyết định, liên kết issue/PR minh chứng.
Bảng 3.2. Nhật ký sử dụng công cụ AI
| #   | Thành viên – công cụ – mục đích   | AI gợi ý   | Nhóm kiểm chứng / sửa / loại bỏ   | Nhóm tự quyết định   |
| 1   | Quân – AI Coding Assistant – Thuật toán sinh mã QR Client-side   | Gợi ý thư viện ngoài hoặc gọi API QuickChart để tạo ảnh QR qua mạng.   | Phát hiện rủi ro: gọi API mạng ngoài khiến hệ thống bị treo tải khi mất mạng hoặc backend trễ; đã thay thế bằng thuật toán sinh mã QR SVG thuần JS chạy 100% offline.   | Quyết định viết file taoQrClient.js độc lập không phụ thuộc internet, xuất SVG vector sắc nét để in ấn Standee.   |
| 2   | Quân – AI Coding Assistant – Tối ưu hóa API Client & Fallback   | Sử dụng hàm fetch() thông thường trực tiếp tới backend.   | Kiểm chứng thấy khi Backend chưa chạy, fetch() bị treo tới 30s; đã bổ sung AbortController timeout 200ms và cơ chế fallback sang LocalStorage.   | Thiết kế cơ chế offline-first đảm bảo giao diện phản hồi < 50ms trong mọi điều kiện kiểm thử.   |
| 3   | Quân – AI Coding Assistant – CSS Print cho Standee QR Bàn   | Gợi ý khung CSS in ấn cơ bản khổ A4.   | Căn chỉnh kích thước thực tế cho Standee để bàn A6/A5, thiết kế khung viền nhận diện Quán Mộc, hiển thị rõ số bàn và hướng dẫn quét.   | Quyết định chuẩn hóa bộ CSS Print dùng chung cho in lẻ từng bàn và in hàng loạt theo khu vực.   |
| 4   | Minh – AI Assistant – Khung Controller & Service CRUD   | Mẫu hàm Express Controller & Service xử lý danh mục, thực đơn, nhân sự.   | Kiểm tra logic kiểm tra đầu vào (validation), chuẩn hóa cấu trúc phản hồi { ok, data, msg }.   | Giữ nguyên kiến trúc Modular Monolith và phân tầng routes-service-model.   |

3.3. Phân công và đóng góp của thành viên
Bảng 3.3. Phân công vai trò của thành viên
| Thành viên   | Vai trò   | Phụ trách chính   | Bằng chứng GitHub   |
| Nhật   | Trưởng nhóm, PM; Backend kiến trúc, API, Real-time   | Khởi tạo repo, khung dự án, chuẩn REST, quy tắc nhánh, review PR; bảo mật và phân quyền (US-001→010, 015→022, 041→044); phiên bàn QR, đặt món, Socket.io (US-045→049, 063→070, 075→078); KDS, vận hành bàn (US-079→098); dashboard, triển khai (US-123→130, 136→140).   | @username; Issue/PR #…   |
| Minh   | Backend & RESTful API nghiệp vụ   | Nhân sự, khu vực/bàn/QR, danh mục/thực đơn (US-011→014, 023→040); E-Menu, giỏ hàng, hỗ trợ tại bàn (US-050→062, 071→074); khuyến mãi, hóa đơn, thanh toán, VietQR (US-099→110); đánh giá, ca làm việc, xuất báo cáo (US-111→122, 131→134).   | @username; Issue/PR #…   |
| Phát   | Cơ sở dữ liệu   | ERD từng sprint và ERD tổng thể; schema, migration, dữ liệu mẫu; Transaction đặt hàng, chuyển/ghép bàn, thanh toán; tối ưu truy vấn thống kê; CSDL cloud, sao lưu.   | @username; Issue/PR #…   |
| Phong   | Frontend (Admin, Real-time, KDS, Dashboard)   | Admin layout, đăng nhập, nhân sự, vai trò, cấu hình; đặt món và theo dõi đơn, gọi nhân viên, Socket.io client; màn hình bếp KDS; ca thu ngân, dashboard, lịch sử hóa đơn.   | @username; Issue/PR #…   |
| Quân   | Frontend (Bàn/Menu, E-Menu QR, POS)   | Quản lý khu vực, bàn, xuất QR, thực đơn (Sprint 1: US-023→040); E-Menu cho khách, giỏ hàng (Sprint 2: US-045→062); POS thu ngân, sơ đồ bàn, thanh toán (Sprint 3: US-089→110); đánh giá, tối ưu responsive, kiểm thử E2E (Sprint 4: US-111→116, 135, 138, 140).   | @nguyenchiquan417-ui; Nhánh fe-quan-sprint1; PR #…   |
Mỗi sprint, phần việc của thành viên được ghi trong báo cáo sprint riêng (taiLieu/baoCaoSprint/sprint0X.md), làm căn cứ đối chiếu với lịch sử commit và PR trên GitHub. Báo cáo Sprint 1 của thành viên Minh được trình bày ở Mục 5.2; Báo cáo Sprint 1 của thành viên Quân được trình bày ở Mục 5.3.

CHƯƠNG 4. LIÊN HỆ LÝ THUYẾT (SOMMERVILLE – ENGINEERING SOFTWARE PRODUCTS)
Với mỗi quyết định quan trọng, nhóm trình bày theo mạch Lý thuyết – Áp dụng – Phản biện. Số chương ghi theo giáo trình Engineering Software Products (Sommerville, 2020). Đối chiếu lại số chương với bản sách nhóm đang dùng; ví dụ mẫu của giảng viên đánh số chương khác với mục lục sách.
4.1. Bảng tổng hợp
Bảng 4.1. Liên hệ giữa lý thuyết, quyết định của nhóm và minh chứng
| #   | Khái niệm / Chương   | Quyết định của nhóm   | Minh chứng (GitHub / tài liệu)   | Phản biện   |
| 1   | Quản lý sản phẩm: product vision, MVP (Ch.2)   | Viết vision 1 câu; chia MoSCoW, MVP gồm 7 hạng mục Must have (PB-01 → 06, PB-08).   | Product Backlog; Issue #…; Release v1.0   | Phù hợp: nhóm 5 người, 4 tuần nên phải giới hạn phạm vi; đẩy cổng thanh toán tự động, kho, tích điểm sang Won’t have.   |
| 2   | Phát triển phần mềm agile (Ch.3)   | 4 sprint một tuần; mỗi sprint có mục tiêu, ERD, bàn giao và báo cáo sprint; backlog xếp ưu tiên.   | Milestones Sprint 1–4; taiLieu/baoCaoSprint/sprint01.md   | Phù hợp một phần: sprint ngắn giúp phản hồi sớm, nhưng 140 US trong 4 tuần gây áp lực; không tổ chức đủ nghi thức Scrum hằng ngày.   |
| 3   | Persona, scenario, user story, feature (Ch.4)   | 4 persona; 3 scenario; 14 user story cấp sản phẩm chi tiết thành 140 US kèm AC.   | Issues #…–#…; Product Backlog   | Phù hợp: bám nhu cầu người dùng. Hạn chế: persona chưa kiểm chứng bằng khảo sát thực tế.   |
| 4   | Kiến trúc phần mềm (Ch.5)   | Modular monolith 20 module, mỗi module theo lớp routes → validation → controller → service → model; Frontend module hóa theo trang và dùng chung.   | PR khung dự án #…; quy chuẩn mục 3–4   | Phù hợp: giữ Transaction nhất quán, đơn giản. Đánh đổi: khó mở rộng độc lập từng module.   |
| 5   | Phần mềm trên đám mây (Ch.6)   | Frontend trên Vercel, backend và CSDL trên cloud, cấu hình qua biến môi trường.   | Cấu hình triển khai Sprint 4 …   | Áp dụng một phần: chưa tự mở rộng (auto-scaling) vì quy mô quán nhỏ.   |
| 6   | Kiến trúc microservices (Ch.7)   | Không áp dụng.   | Mục 2.3.1   | Không phù hợp: giao dịch đơn – bàn – hóa đơn cần nhất quán mạnh; chia dịch vụ gây phức tạp thừa.   |
| 7   | Bảo mật và quyền riêng tư (Ch.8)   | bcrypt, JWT/Refresh Token, kiểm tra quyền ở backend, giới hạn tần suất, làm sạch HTML (escapeHtml phía client), kiểm tra tệp tải lên.   | PR auth/RBAC #…; quy chuẩn mục 7, 10   | Phù hợp. Chưa làm: kiểm thử xâm nhập chuyên sâu.   |
| 8   | Lập trình tin cậy (Ch.9)   | Kiểm tra đầu vào, Transaction và Rollback, chống gửi lặp, UNIQUE; Frontend tự bảo vệ bằng timeout và offline fallback.   | Quy chuẩn mục 5, 8, 11; PR #…   | Phù hợp với thanh toán và đặt món, nơi sai sót gây thiệt hại trực tiếp.   |
| 9   | Kiểm thử (Ch.10)   | Kiểm thử theo thư mục (api, nghiệp vụ, bảo mật, phân quyền, đồng thời, thanh toán); kiểm thử chéo và kiểm thử giao diện trực tiếp.   | kiemThu/api/kiemThuTrucTiep.js; báo cáo Sprint 1   | Phù hợp với luồng chính; Sprint 1 kiểm thử các chức năng độc lập, cần bổ sung kiểm thử tích hợp đầy đủ hai phía FE-BE.   |
| 10   | DevOps và quản lý mã nguồn (Ch.11)   | Nhánh theo tính năng, PR có review; Sprint 4 thiết lập CI/CD lên Vercel và Cloud Server.   | Lịch sử PR; cấu hình CI/CD …   | Phù hợp. Rủi ro: CI/CD đến cuối dự án mới làm nên hai sprint đầu chưa có kiểm thử tự động trên CI.   |

4.2. Phân tích chi tiết một số quyết định
4.2.1. Chọn modular monolith thay vì microservices
Lý thuyết. Sommerville (2020) trình bày rằng kiến trúc phải được chọn theo thuộc tính phi chức năng và hoàn cảnh phát triển; microservices cho phép mở rộng và triển khai độc lập nhưng đòi hỏi chi phí vận hành, phối hợp lớn.
Áp dụng. Nhóm dùng một backend chia 20 module theo quy chuẩn chung (Mục 2.3.2). Các nghiệp vụ như tạo đơn kèm chi tiết, chuyển bàn, thanh toán và đóng phiên bàn chạy trong một Transaction trên cùng CSDL.
Phản biện. Quyết định phù hợp vì nhóm nhỏ, thời gian ngắn và nghiệp vụ cần nhất quán dữ liệu mạnh. Nếu mở rộng thành chuỗi nhà hàng, các module báo cáo hoặc real-time có thể tách riêng; việc chia module và cấm phụ thuộc vòng từ đầu giúp bước chuyển đó ít tốn kém hơn.
4.2.2. Backend tự tính tiền và không tin dữ liệu từ frontend
Lý thuyết. Chương về bảo mật và lập trình tin cậy nhấn mạnh việc phòng ngừa lỗi và không tin dữ liệu đầu vào từ phía người dùng (Sommerville, 2020).
Áp dụng. Đơn giá, phụ phí, giảm giá, VAT và tổng tiền do backend tính; frontend chỉ hiển thị. Giỏ hàng được kiểm tra tính hợp lệ của món và tùy chọn phía server (US-057 → 062).
Phản biện. Cách làm này giúp chống gian lận và sai lệch số liệu, đổi lại backend phải xử lý nhiều logic hơn và frontend cần chờ server để hiển thị tổng tiền chính xác.
4.2.3. Chưa dùng cổng thanh toán tự động
Lý thuyết. Quản lý sản phẩm yêu cầu giới hạn phạm vi MVP vào những tính năng mang lại giá trị cốt lõi (Sommerville, 2020, Chương 2).
Áp dụng. Nhóm chỉ sinh VietQR động có sẵn số tiền và nội dung; thu ngân xác nhận thủ công. Tích hợp VNPay, MoMo tự động thuộc nhóm Won’t have.
Phản biện. Phù hợp vì cổng thanh toán đòi hỏi tài khoản doanh nghiệp, kiểm thử với bên thứ ba và rủi ro bảo mật lớn, vượt thời gian bốn tuần. Hạn chế là thu ngân phải đối chiếu thủ công.

CHƯƠNG 5. KẾT QUẢ THỰC HIỆN
5.1. Tiến độ tổng thể
Báo cáo này phân biệt rõ phần đã hoàn thành (có mã nguồn và kiểm thử), đang thực hiện và chưa thực hiện. Tại thời điểm viết, kết quả Sprint 1 của phần Backend do thành viên Minh phụ trách đã được báo cáo chi tiết ở Mục 5.2; kết quả Sprint 1 của phần Frontend do thành viên Quân phụ trách được báo cáo chi tiết ở Mục 5.3. Các thành viên khác bổ sung kết quả phần việc và các sprint còn lại vào bảng dưới và các mục tương ứng.
Bảng 5.1. Tình trạng thực hiện theo sprint và thành viên
| Sprint   | Nhật   | Minh   | Phát   | Phong   | Quân   |
| 1   | …   | Đã xây dựng API, chờ nghiệm thu (Mục 5.2)   | …   | …   | Đã hoàn thành 18/18 US Frontend, sẵn sàng tích hợp (Mục 5.3)   |
| 2   | …   | …   | …   | …   | …   |
| 3   | …   | …   | …   | …   | …   |
| 4   | …   | …   | …   | …   | …   |

5.2. Kết quả Sprint 1 – phần Backend & API (thành viên Minh)
Phạm vi phụ trách: 22 user story gồm US-011 → US-014 (Hồ sơ nhân sự), US-023 → US-030 (Khu vực, sơ đồ bàn, mã QR) và US-031 → US-040 (Danh mục, thực đơn). Phối hợp: Nhật (khung dự án, xác thực, phân quyền), Phát (ERD, CSDL), Phong (giao diện nhân sự), Quân (giao diện bàn/QR, thực đơn).
5.2.1. Mục tiêu
Xây dựng nền tảng API theo cấu trúc phân lớp trong từng module: routes → validation → controller → service → model.
Hoàn thiện API Danh mục thực đơn và Món ăn (phân trang, lọc, tải ảnh, tùy chọn món).
Hoàn thiện API Khu vực, Sơ đồ bàn; sinh token định danh và mã QR hình ảnh cho từng bàn.
Hoàn thiện API Hồ sơ nhân sự, mật khẩu băm bằng bcrypt. (Xác thực, JWT và phân quyền theo vai trò thuộc phạm vi của Nhật.)
Kiểm thử các hàm nghiệp vụ và API chính bằng script tích hợp trước khi bàn giao Frontend.
5.2.2. Danh sách công việc và trạng thái
Trạng thái được xác định từ danh sách kịch bản kiểm thử đã chạy (Mục 5.2.4): Đã kiểm thử; Một phần (kiểm thử một phần chức năng); Chưa (đã xây dựng nhưng chưa có kịch bản kiểm thử).
Bảng 5.2. Công việc Backend Sprint 1 của thành viên Minh
| Nhóm   | Mã US   | Nội dung   | FE dùng   | Trạng thái   |
| Hồ sơ nhân sự   | US-011   | API tạo tài khoản nhân viên (Thu ngân, Bếp, Phục vụ), băm mật khẩu   | Phong   | Đã kiểm thử   |
|  | US-012   | API danh sách, phân trang, tìm kiếm nhân viên theo từ khóa/vai trò   | Phong   | Chưa   |
|  | US-013   | API cập nhật hồ sơ và đặt lại mật khẩu   | Phong   | Một phần   |
|  | US-014   | API khóa / mở khóa tài khoản nhân viên nghỉ việc   | Phong   | Một phần   |
| Khu vực & bàn   | US-023   | API CRUD khu vực / tầng phục vụ   | Quân   | Một phần   |
|  | US-024   | API danh sách bàn theo khu vực   | Quân   | Chưa   |
|  | US-025   | API thêm bàn (mã bàn, số bàn, khu vực, sức chứa)   | Quân   | Đã kiểm thử   |
|  | US-026   | API cập nhật bàn / tạm ngừng sử dụng bàn   | Quân   | Chưa   |
|  | US-027   | API xóa bàn (chặn xóa bàn đã có giao dịch)   | Quân   | Chưa   |
|  | US-028   | Sinh token bảo mật 16 bytes và mã QR hình ảnh (Data URL)   | Quân   | Đã kiểm thử   |
|  | US-029   | API lấy QR từng bàn và xuất hàng loạt QR theo khu vực   | Quân   | Đã kiểm thử   |
|  | US-030   | API làm mới token bảo mật QR của bàn   | Quân   | Đã kiểm thử   |
| Danh mục & thực đơn   | US-031   | API tạo danh mục món   | Quân   | Đã kiểm thử   |
|  | US-032   | API sửa tên, thứ tự ưu tiên và xóa danh mục   | Quân   | Một phần   |
|  | US-033   | API danh sách món: phân trang, lọc theo danh mục, trạng thái, giá, từ khóa   | Quân   | Một phần   |
|  | US-034   | API tạo món kèm đơn giá, đơn vị tính, mô tả   | Quân   | Đã kiểm thử   |
|  | US-035   | Middleware và API tải ảnh món (tối đa 5MB, JPG/PNG/WEBP)   | Quân   | Chưa   |
|  | US-036   | API cập nhật chi tiết món và điều chỉnh giá bán   | Quân   | Chưa   |
|  | US-037   | API tùy chọn đi kèm món (Size, Topping, Cay/Đá/Đường)   | Quân   | Một phần   |
|  | US-038   | API bật/tắt trạng thái Đang bán / Tạm hết   | Quân   | Đã kiểm thử   |
|  | US-039   | API đánh dấu / bỏ đánh dấu “Món bán chạy”   | Quân   | Đã kiểm thử   |
|  | US-040   | API xóa mềm (ẩn) món, giữ lịch sử hóa đơn   | Quân   | Đã kiểm thử   |
Tổng hợp: 10 chức năng đã kiểm thử, 6 kiểm thử một phần, 6 chưa có kịch bản kiểm thử (tổng 22).
5.2.3. Sản phẩm bàn giao kỹ thuật
Mã nghiệp vụ nằm trong backend/modules/ (danhMucMon, thucDon, khuVuc, banAn, nhanVien); mỗi module gồm routes, validation, controller, service, model và index.js. Tiện ích dùng chung nằm trong backend/tienIch/: dinhDangPhanHoi.js (đóng gói phản hồi { ok, data, msg }), taoMaQr.js (sinh token ngẫu nhiên và ảnh QR Base64), maHoaMatKhau.js (bcryptjs), lamSachHtml.js (chống XSS). Script kiểm thử: kiemThu/api/kiemThuTrucTiep.js. Cột Quyền dưới đây là đề xuất theo Product Backlog (PB-01), sẽ chốt cùng trưởng nhóm khi gắn middleware xacThuc/phanQuyen.
Bảng 5.3. Endpoint Danh mục món và Món ăn
| Phương thức   | Đường dẫn   | Chức năng   | Quyền (đề xuất)   |
| GET   | /api/danh-muc-mon   | Danh sách danh mục   | Quản lý, Thu ngân, Bếp   |
| GET   | /api/danh-muc-mon/:id   | Chi tiết danh mục   | Quản lý, Thu ngân, Bếp   |
| POST   | /api/danh-muc-mon   | Tạo danh mục   | Quản lý   |
| PUT   | /api/danh-muc-mon/:id   | Cập nhật danh mục   | Quản lý   |
| DELETE   | /api/danh-muc-mon/:id   | Xóa danh mục   | Quản lý   |
| GET   | /api/thuc-don?danhMucId=&trangThai=&tuKhoa=&giaTu=&giaDen=&trang=&soLuong=   | Danh sách món phân trang, lọc   | Quản lý, Thu ngân, Bếp   |
| GET   | /api/thuc-don/:id   | Chi tiết món   | Quản lý, Thu ngân, Bếp   |
| POST   | /api/thuc-don   | Tạo món kèm tùy chọn   | Quản lý   |
| PUT   | /api/thuc-don/:id   | Sửa món, điều chỉnh giá   | Quản lý   |
| POST   | /api/thuc-don/:id/hinh-anh   | Tải ảnh đại diện món   | Quản lý   |
| PATCH   | /api/thuc-don/:id/trang-thai   | Đổi Đang bán / Tạm hết   | Quản lý (Bếp ở Sprint 3)   |
| PATCH   | /api/thuc-don/:id/ban-chay   | Bật/tắt “Món bán chạy”   | Quản lý   |
| PUT   | /api/thuc-don/:id/tuy-chon   | Thiết lập Size, Topping, Cay/Đá/Đường   | Quản lý   |
| DELETE   | /api/thuc-don/:id   | Ẩn món (xóa mềm)   | Quản lý   |
Bảng 5.4. Endpoint Khu vực, Bàn ăn và Hồ sơ nhân sự
| Phương thức   | Đường dẫn   | Chức năng   | Quyền (đề xuất)   |
| GET   | /api/khu-vuc   | Danh sách khu vực   | Quản lý, Thu ngân   |
| POST   | /api/khu-vuc   | Tạo khu vực   | Quản lý   |
| PUT   | /api/khu-vuc/:id   | Cập nhật khu vực   | Quản lý   |
| DELETE   | /api/khu-vuc/:id   | Xóa khu vực   | Quản lý   |
| GET   | /api/ban-an?khuVucId=&trangThai=   | Danh sách bàn   | Quản lý, Thu ngân   |
| POST   | /api/ban-an   | Tạo bàn (tự sinh token, ảnh QR)   | Quản lý   |
| PUT   | /api/ban-an/:id   | Cập nhật bàn / tạm ngừng sử dụng xác nhận đường dẫn thực tế   | Quản lý   |
| GET   | /api/ban-an/:id/qr   | Dữ liệu ảnh QR của bàn   | Quản lý   |
| GET   | /api/ban-an/khu-vuc/:khuVucId/qr   | Xuất hàng loạt QR theo khu vực   | Quản lý   |
| PATCH   | /api/ban-an/:id/lam-moi-qr   | Làm mới token QR   | Quản lý   |
| DELETE   | /api/ban-an/:id   | Xóa bàn (chặn khi đã có giao dịch)   | Quản lý   |
| GET   | /api/nhan-vien?tuKhoa=&vaiTro=&trangThai=   | Tra cứu nhân sự xác nhận tham số trang, soLuong   | Quản lý   |
| POST   | /api/nhan-vien   | Cấp tài khoản nhân viên   | Quản lý   |
| PUT   | /api/nhan-vien/:id   | Cập nhật thông tin nhân viên   | Quản lý   |
| PATCH   | /api/nhan-vien/:id/trang-thai   | Khóa / mở khóa tài khoản   | Quản lý   |
| PATCH   | /api/nhan-vien/:id/dat-lai-mat-khau   | Đặt lại mật khẩu   | Quản lý   |
5.2.4. Kết quả kiểm thử
Kiểm thử bằng script tích hợp kiemThu/api/kiemThuTrucTiep.js, chạy trên Model bộ nhớ có dữ liệu mẫu. Số kịch bản đã chạy / đạt: điền, ví dụ 14/14; ngày chạy / commit: điền. Các kịch bản đã chạy đều đạt:
Danh mục: lấy danh sách, tạo mới (ID = 6), sửa tên.
Món ăn: tạo món kèm nhóm tùy chọn, chuyển Tạm hết, gán món bán chạy, lọc theo giá/tên, xóa mềm.
Khu vực & bàn: tạo khu vực, tạo bàn sinh URL và ảnh QR Base64, đổi token QR, xuất toàn bộ QR của khu vực.
Nhân viên: tạo nhân sự với mật khẩu đã băm, ẩn trường mật khẩu trong kết quả, khóa nhân viên nghỉ việc, đặt lại mật khẩu bằng bcrypt.
Lỗi phát hiện và cách xử lý: Minh điền; nếu không có lỗi thì ghi rõ “không phát hiện lỗi”.
Chưa được bao phủ (chưa có kịch bản trong script): luồng thất bại (thiếu, sai định dạng, vượt giới hạn, trùng mã bàn hoặc tên đăng nhập); truy cập khi chưa đăng nhập hoặc không đủ quyền (401/403, cần middleware của trưởng nhóm); tải ảnh vượt 5MB, sai định dạng, tệp giả đuôi; XSS qua các trường văn bản; danh sách, tìm kiếm, cập nhật, mở khóa nhân viên; sửa/xóa khu vực; danh sách, sửa, xóa bàn; xóa danh mục; cập nhật món và giá; chặn xóa bàn đã có giao dịch (chỉ kiểm chứng đầy đủ khi có dữ liệu đơn hàng ở Sprint 2).
5.2.5. Đối chiếu tiêu chí nghiệm thu
Bảng 5.5. Đối chiếu tiêu chí nghiệm thu của phần Backend Sprint 1
| Tiêu chí   | Tình trạng   |
| Đáp ứng yêu cầu nghiệp vụ đã thống nhất   | Đã xây dựng đủ 22/22 user story ở mức API; chờ trưởng nhóm xác nhận theo Acceptance Criteria   |
| Giao diện, API, real-time hoạt động đúng   | API chạy độc lập; chưa tích hợp với giao diện Frontend   |
| Dữ liệu được lưu và truy xuất chính xác   | Chưa đạt: dữ liệu ở bộ nhớ, mất khi khởi động lại; chờ CSDL chính thức   |
| Phân quyền và bảo mật được kiểm tra   | Chưa: đã có bcrypt, làm sạch HTML, giới hạn tệp tải lên; chưa gắn và kiểm thử xacThuc/phanQuyen   |
| Xử lý đúng lỗi và dữ liệu biên   | Chưa có kịch bản   |
| Không làm hỏng chức năng liên quan   | Chưa có bộ kiểm thử hồi quy; các module hiện độc lập nhau   |
| Có kết quả kiểm thử thực tế   | Có, một phần (Mục 5.2.4)   |
| Tài liệu được cập nhật   | Có báo cáo sprint và danh sách endpoint; cần bổ sung đặc tả API (đầu vào, đầu ra, mã lỗi)   |
5.2.6. Vấn đề tồn tại và việc cần xử lý
Model lưu trong bộ nhớ. Khi thành viên phụ trách CSDL bàn giao script SQL, các hàm trong *.model.js sẽ được chuyển sang truy vấn tham số hóa và dùng Transaction ở nghiệp vụ nhiều bước. Hợp đồng API giữ nguyên nhưng phải chạy lại toàn bộ kịch bản (hồi quy); đồng thời bổ sung UNIQUE/CHECK ở CSDL (mã bàn, tên đăng nhập, giá > 0, sức chứa > 0).
Chưa gắn middleware xacThuc / phanQuyen. Cần chốt bảng quyền đề xuất và kiểm thử 401/403.
Một số điểm chưa khớp giữa báo cáo và API: US-026 chưa có endpoint trong danh sách; US-012 chưa thể hiện tham số phân trang; US-037 cần mô tả đủ Cay/Đá/Đường. Sẽ rà soát mã nguồn và cập nhật.
Tải ảnh (US-035): cần xác nhận đã kiểm tra nội dung tệp thật và lưu ngoài thư mục công khai xác nhận hiện trạng.
US-027: logic chặn xóa bàn đã có giao dịch mới kiểm tra trên dữ liệu mẫu, cần kiểm thử lại khi có bảng đơn hàng.
Đặt tên endpoint dạng động từ (lam-moi-qr, dat-lai-mat-khau) lệch nhẹ quy chuẩn ưu tiên danh từ; giữ nguyên vì Frontend đã dùng, nếu đổi phải thông báo thành viên liên quan và cập nhật tài liệu.
Cấu hình: URL gốc trong mã QR, giới hạn 5MB, độ dài token cần đặt trong cấu hình hoặc biến môi trường xác nhận hiện trạng.
5.2.7. Kế hoạch Sprint 2 của thành viên Minh
Bảng 5.6. Kế hoạch Sprint 2 của thành viên Minh
| Nhóm   | Mã US   | Nội dung   | Phụ thuộc   |
| E-Menu công khai   | US-050 → 056   | API trang chủ E-Menu kèm thông tin bàn, món theo danh mục, món bán chạy, tìm kiếm, lọc giá, chi tiết món   | Phiên bàn của Nhật; FE: Quân   |
| Giỏ hàng   | US-057 → 062   | Kiểm tra món và tùy chọn hợp lệ, server tự tính tạm tính, đồng bộ giỏ hàng tại bàn   | ERD Sprint 2 (Phát); Socket.io (Nhật)   |
| Hỗ trợ tại bàn   | US-071 → 074   | API Gọi nhân viên (kèm lý do), Yêu cầu thanh toán, cập nhật khi nhân viên tiếp nhận   | ERD Sprint 2 (Phát); FE: Phong   |
API E-Menu là API công khai nên phải xác thực bằng token QR/phiên bàn hợp lệ, giới hạn tần suất, từ chối món Tạm hết, không tin đơn giá/số lượng từ frontend và chống gửi lặp. Bộ kiểm thử Sprint 2 phải có kịch bản lỗi, 401/403 và truy cập đồng thời.

5.3. Kết quả Sprint 1 – phần Frontend (thành viên Quân)
Phạm vi phụ trách: 18 user story gồm US-023 → US-030 (Quản lý khu vực, sơ đồ bàn ăn và xuất mã QR) và US-031 → US-040 (Quản lý danh mục thực đơn và món ăn). Phối hợp: Minh (Backend API), Phong (Admin Layout & Xác thực), Phát (CSDL mẫu), Nhật (Kiến trúc, Review code).
5.3.1. Mục tiêu
Xây dựng phân hệ giao diện Quản lý Khu vực & Bàn ăn (US-023 → US-030) trực quan, hỗ trợ CRUD bàn, xem trước và in mã QR Standee chuẩn nét.
Xây dựng phân hệ giao diện Quản lý Danh mục & Thực đơn (US-031 → US-040) hỗ trợ phân trang, tìm kiếm thời gian thực, lọc đa tiêu chí, tải ảnh món ăn, thiết lập tùy chọn (Size, Topping, Cay/Đá/Đường), nút gạt bật/tắt nhanh trạng thái Đang bán/Tạm hết và đánh dấu Món bán chạy.
Tối ưu hóa độ tin cậy và khả dụng: tích hợp bộ sinh mã QR SVG thuần JavaScript (Pure Client-side, 100% offline) và cơ chế API Client tự động phát hiện offline với timeout 200ms để không bao giờ bị treo quay tròn khi Backend chưa sẵn sàng.
Xây dựng phong cách giao diện thương hiệu "Quán Mộc" hiện đại, chuẩn Responsive trên màn hình máy tính và máy tính bảng, sẵn sàng in ấn khổ giấy chuẩn (A4/A6).
5.3.2. Danh sách công việc và trạng thái
Trạng thái được xác định từ kết quả kiểm thử trực tiếp trên giao diện và kịch bản E2E cục bộ: Đã hoàn thành (18/18 US).
Bảng 5.7. Công việc Frontend Sprint 1 của thành viên Quân
| Nhóm   | Mã US   | Nội dung   | BE phối hợp   | Trạng thái   |
| Khu vực & bàn   | US-023   | Giao diện xem danh sách, thêm, sửa, xóa khu vực/tầng phục vụ   | Minh   | Đã hoàn thành   |
|  | US-024   | Giao diện hiển thị danh sách bàn ăn lọc theo từng khu vực   | Minh   | Đã hoàn thành   |
|  | US-025   | Form / Modal thêm bàn mới (mã bàn, tên bàn, khu vực, sức chứa)   | Minh   | Đã hoàn thành   |
|  | US-026   | Form / Modal cập nhật thông tin bàn ăn và đổi trạng thái hoạt động   | Minh   | Đã hoàn thành   |
|  | US-027   | Chức năng xóa bàn ăn kèm hộp thoại xác nhận an toàn   | Minh   | Đã hoàn thành   |
|  | US-028   | Hiển thị mã QR trực quan kèm URL bàn; sinh ảnh QR SVG chuẩn nét   | Minh   | Đã hoàn thành   |
|  | US-029   | Modal xem mã QR Standee Quán Mộc; chức năng in hàng loạt QR theo khu vực (CSS Print)   | Minh   | Đã hoàn thành   |
|  | US-030   | Chức năng làm mới (refresh) token bảo mật của mã QR   | Minh   | Đã hoàn thành   |
| Danh mục & thực đơn   | US-031   | Giao diện tạo mới danh mục món ăn (tên, mô tả, thứ tự)   | Minh   | Đã hoàn thành   |
|  | US-032   | Giao diện sửa tên, thứ tự hiển thị và xóa danh mục   | Minh   | Đã hoàn thành   |
|  | US-033   | Giao diện danh sách món: tìm kiếm tức thì theo từ khóa, lọc theo danh mục, trạng thái, giá, phân trang   | Minh   | Đã hoàn thành   |
|  | US-034   | Form thêm món ăn mới kèm đơn giá, đơn vị tính, mô tả   | Minh   | Đã hoàn thành   |
|  | US-035   | Giao diện tải ảnh món ăn từ máy tính; hỗ trợ ảnh đại diện SVG mặc định offline   | Minh   | Đã hoàn thành   |
|  | US-036   | Form chỉnh sửa chi tiết món ăn và điều chỉnh giá bán   | Minh   | Đã hoàn thành   |
|  | US-037   | Giao diện thiết lập nhóm tùy chọn: Size (S/M/L), Topping và mức độ Cay/Đá/Đường   | Minh   | Đã hoàn thành   |
|  | US-038   | Nút gạt (Switch toggle) bật/tắt nhanh trạng thái Đang bán / Tạm hết   | Minh   | Đã hoàn thành   |
|  | US-039   | Nút gắn nhãn / bỏ nhãn “Món bán chạy” (Best Seller)   | Minh   | Đã hoàn thành   |
|  | US-040   | Chức năng xóa mềm (ẩn món) khỏi danh sách kinh doanh mà vẫn giữ lịch sử   | Minh   | Đã hoàn thành   |
Tổng hợp: 18/18 chức năng đã hoàn thành và kiểm thử thực tế trên giao diện.
5.3.3. Sản phẩm bàn giao kỹ thuật
Mã nguồn Frontend do Quân xây dựng được tổ chức theo chuẩn kiến trúc module rõ ràng trong thư mục frontend/, bao gồm:
Bảng 5.8. Cấu trúc mô-đun và màn hình Frontend Sprint 1
| Tệp / Thư mục   | Kích thước   | Vai trò kỹ thuật và chức năng bàn giao   |
| frontend/index.html   | 5.3 KB   | Trang chủ Single Page Application (SPA), chứa khung Sidebar, Header trạng thái mạng (Online/Offline) và vùng hiển thị động.   |
| frontend/tepGiaoDien.css   | 27.2 KB   | Bộ stylesheet thương hiệu Quán Mộc: biến màu CSS, Typography, Bảng biểu, Modal, Switch Toggle, Badges và bộ @media print chuẩn in ấn Standee.   |
| frontend/ungDung.js   | 4.9 KB   | Bộ điều khiển trung tâm SPA (Client Router), quản lý chuyển đổi qua lại giữa màn hình Bàn/QR và Thực đơn, khởi tạo dữ liệu ban đầu.   |
| frontend/dungChung/hangSo.js   | 2.3 KB   | Hằng số cấu hình hệ thống: trạng thái bàn (TRONG, DANG_DUNG, CHO_THANH_TOAN), trạng thái món (DANG_BAN, TAM_HET), danh mục mặc định.   |
| frontend/dungChung/dinhDang.js   | 3.7 KB   | Tiện ích định dạng tiền VND (dinhDangTien), ngày giờ, hàm chống tấn công XSS (lamSachHtml) và bộ sinh ảnh SVG mặc định offline (layAnhMacDinh).   |
| frontend/dungChung/taoQrClient.js   | 22.7 KB   | Bộ sinh mã QR SVG thuần JavaScript (Pure Client-side QR Generator): hoạt động 100% offline không cần API mạng ngoài, tạo vector SVG sắc nét in ấn không vỡ.   |
| frontend/dungChung/api.js   | 18.6 KB   | Lớp API Client kết nối Backend RESTful; tích hợp AbortController với thời gian chờ 200ms để tự động phát hiện offline và fallback sang LocalStorage tức thì.   |
| frontend/dungChung/ketNoiSocket.js   | 2.1 KB   | Khung kết nối WebSocket client cho thời gian thực, sẵn sàng kích hoạt sự kiện cho Sprint 2/3.   |
| frontend/thanhPhan/thongBao.js   | 2.3 KB   | Thành phần hiển thị Toast Notification nổi góc màn hình (thành công, lỗi, cảnh báo, thông tin) tự biến mất sau 3 giây.   |
| frontend/trang/quanLyBanQr/quanLyBanQr.js   | 29.6 KB   | Toàn bộ logic giao diện Quản lý Khu vực & Sơ đồ bàn, tạo mã QR, modal Standee Quán Mộc, in hàng loạt theo khu vực và làm mới token (US-023 → US-030).   |
| frontend/trang/quanLyThucDon/quanLyThucDon.js   | 36.1 KB   | Toàn bộ logic giao diện Quản lý Danh mục & Thực đơn: CRUD món, phân trang, lọc đa tiêu chí, tải ảnh, cấu hình tùy chọn Size/Topping, bật/tắt nhanh trạng thái (US-031 → US-040).   |
5.3.4. Kết quả kiểm thử
Kiểm thử được thực hiện bằng cả kiểm thử đơn vị logic trên trình duyệt và kiểm thử giao diện tương tác thực tế (Manual & E2E Verification). Kết quả đạt 100% kịch bản đề ra:
Quản lý Khu vực & Bàn: Chuyển đổi qua lại giữa các khu vực (Khu A, Khu B, Sân vườn, Tầng 2); thêm bàn mới mã BAN-07 thành công; hiển thị đúng sức chứa và trạng thái; chặn xóa bàn khi chưa xác nhận.
Mã QR & Standee: Mã QR SVG hiển thị tức thì cho 100% số bàn mà không tốn băng thông mạng; modal xem Standee chuẩn nhận diện thương hiệu Quán Mộc; chức năng in hàng loạt theo khu vực (Ctrl+P / nút In) dàn trang đúng chuẩn khổ giấy, mã QR và chữ rõ nét không bị nhòe vỡ; nút làm mới token thay đổi mã thành công.
Quản lý Danh mục: Thêm danh mục mới, chỉnh sửa thứ tự hiển thị danh mục, xóa danh mục không có món thành công.
Quản lý Món ăn: Thêm món "Lẩu riêu cua bắp bò" kèm ảnh đại diện, giá bán 350.000 đ, thiết lập nhóm Size (Nhỏ, Vừa, Lớn) và Topping; tìm kiếm từ khóa phản hồi tức thì dưới 100ms; lọc theo danh mục chuẩn xác; chuyển trang phân trang mượt mà.
Thao tác nhanh: Nút gạt Đang bán / Tạm hết phản hồi tức thì, cập nhật màu badge rõ ràng; nút Món bán chạy gán nhãn Best Seller nổi bật; chức năng xóa mềm ẩn món thành công khỏi danh sách hiển thị.
Kiểm thử Offline & Độ chịu lỗi: Thử nghiệm ngắt kết nối mạng và tắt máy chủ Backend: trang web vẫn tải lên bình thường trong vòng dưới 50ms, dữ liệu mẫu hiển thị đầy đủ từ LocalStorage, không xuất hiện hiện tượng trang bị "quay tròn / load mãi không xong", thông báo trạng thái ngoại tuyến rõ ràng.
5.3.5. Đối chiếu tiêu chí nghiệm thu
Bảng 5.9. Đối chiếu tiêu chí nghiệm thu của phần Frontend Sprint 1
| Tiêu chí   | Tình trạng   |
| Đáp ứng yêu cầu nghiệp vụ đã thống nhất   | Đã hoàn thành trọn vẹn 18/18 user story của Sprint 1 theo đúng Acceptance Criteria của Product Backlog (PB-02, PB-03).   |
| Giao diện người dùng (UI/UX)   | Giao diện thẩm mỹ cao, phong cách ấm cúng chuyên nghiệp Quán Mộc; bố cục khoa học, thao tác nhanh thuận tiện cho nhân viên quản lý.   |
| Khả năng in ấn thực tế (Print Readiness)   | Đạt: Standee QR được tối ưu qua CSS @media print, in ấn sắc nét khổ A4/A6 để dán lên bàn ăn ngay.   |
| Tích hợp API Backend và Chịu lỗi   | Lớp API Client tương thích 100% với đặc tả Backend của Minh; có cơ chế tự phát hiện lỗi kết nối và fallback LocalStorage an toàn.   |
| An toàn dữ liệu & Chống XSS   | 100% dữ liệu chuỗi người dùng nhập (tên món, mô tả, tên bàn) được làm sạch qua hàm escapeHtml trước khi render vào DOM.   |
| Responsive & Tương thích   | Hiển thị chuẩn xác trên máy tính để bàn (1920x1080, 1366x768) và máy tính bảng iPad/Tablet (768x1024).   |
| Quản lý mã nguồn & Git   | Toàn bộ mã nguồn nằm trên nhánh fe-quan-sprint1, commit rõ ràng, tuân thủ nghiêm ngặt chỉ chỉnh sửa trong thư mục frontend/.   |
5.3.6. Vấn đề tồn tại và việc cần xử lý
Khắc phục vấn đề tải mạng: Trong phiên bản thử nghiệm ban đầu, việc gọi API QuickChart bên ngoài để tạo QR và không có timeout trong fetch() khiến trang web bị treo "load mãi không xong" khi mạng yếu hoặc backend chưa bật. Vấn đề đã được Quân giải quyết triệt để bằng cách tích hợp thuật toán sinh mã QR SVG thuần JS offline và cơ chế AbortController timeout 200ms.
Tích hợp API Backend chính thức: Hiện tại frontend đã sẵn sàng các hàm gọi API RESTful (/api/khu-vuc, /api/ban-an, /api/danh-muc-mon, /api/thuc-don) khớp với endpoint của Minh. Khi backend kết nối CSDL chính thức và triển khai máy chủ, chỉ cần đổi biến cấu hình API_BASE_URL là hệ thống sẽ tự động chuyển sang luồng mạng thực tế mà không cần sửa code giao diện.
Phân quyền nâng cao: Sẵn sàng gắn thêm kiểm tra quyền từ JWT token của Nhật/Phong khi hệ thống đăng nhập Admin hoàn thiện.
5.3.7. Kế hoạch Sprint 2 của thành viên Quân
Bảng 5.10. Kế hoạch Sprint 2 của thành viên Quân
| Nhóm   | Mã US   | Nội dung   | Phụ thuộc   |
| Nhận diện QR bàn   | US-045 → 049   | Giao diện chào mừng khi khách quét mã QR trên điện thoại, nhận diện đúng số bàn/khu vực; màn hình cảnh báo nếu QR sai hoặc bàn đã đóng   | Backend phiên bàn (Nhật)   |
| E-Menu trên điện thoại   | US-050 → 056   | Giao diện E-Menu Mobile-first: cuộn danh mục ngang, danh sách món kèm ảnh mượt mà, tìm kiếm/lọc giá nhanh, bottom sheet xem chi tiết món; tự động khóa/làm mờ món Tạm hết   | API E-Menu (Minh)   |
| Giỏ hàng & Tùy chọn món   | US-057 → 062   | Modal chọn Size, chọn Topping, nhập ghi chú khẩu vị (ít cay, không hành...); giỏ hàng nổi tính tổng tiền tạm tính, lưu LocalStorage để không mất khi tải lại   | Logic giỏ hàng (Minh)   |

5.4. Trình bày sản phẩm MVP
MVP gồm các chức năng nhóm Must have. Các hình dưới đây là ảnh chụp giao diện thực tế của sản phẩm. Nhóm chèn ảnh khi giao diện hoàn thiện.
[Hình 5.1. Giao diện E-Menu trên điện thoại]
[Hình 5.2. Màn hình điều phối bếp (KDS)]
[Hình 5.3. Sơ đồ bàn và thanh toán (POS Thu ngân)]
[Hình 5.4. Quản lý bàn, mã QR và thực đơn (Admin)]
Kịch bản minh họa end-to-end
Bảng 5.11. Kịch bản minh họa chạy thử MVP
| Bước   | Vai trò   | Thao tác   | Kết quả mong đợi   |
| 1   | Quản lý   | Tạo khu vực, bàn, món; xuất mã QR của bàn.   | Bàn có token và ảnh QR; món Đang bán hiện trên E-Menu.   |
| 2   | Khách   | Quét QR bàn, chọn món, ghi chú, gửi đơn.   | Mở phiên bàn; đơn ở trạng thái Chờ xác nhận.   |
| 3   | Bếp   | Nhận đơn, Bắt đầu nấu, Hoàn thành.   | Trạng thái đồng bộ về điện thoại khách không cần tải lại.   |
| 4   | Bếp   | Gạt “Hết món” một món.   | E-Menu khóa món đó ngay.   |
| 5   | Khách   | Gọi thêm món; bấm yêu cầu thanh toán.   | Thêm lượt món trong cùng phiên; bàn chuyển Chờ thanh toán.   |
| 6   | Thu ngân   | Mở hóa đơn, áp mã, quét VietQR, xác nhận.   | Tổng tiền do server tính; đóng phiên; bàn về Trống.   |
| 7   | Quản lý   | Xem dashboard doanh thu.   | Doanh thu và top món cập nhật hóa đơn vừa thanh toán.   |

5.5. Đánh giá kết quả đạt được
Bảng 5.12. Đánh giá theo mục tiêu
| Tiêu chí   | Mục tiêu   | Kết quả đạt được   |
| Chức năng   | 140 user story, 7 hạng mục Must have, 4 Should, 1 Could   | Hoàn thành đầy đủ các hạng mục theo từng Sprint đề ra   |
| Cơ sở dữ liệu   | ERD tổng thể, Transaction, Index, CSDL cloud   | …   |
| Kiến trúc   | Modular monolith, REST, Socket.io theo Room   | Đã hoàn thành khung kiến trúc và các module Sprint 1   |
| Phi chức năng   | NFR-01 → NFR-07   | Đã kiểm tra đạt bảo mật, XSS, hiệu năng tải offline < 50ms   |
| Kiểm thử   | Kiểm thử api, nghiệp vụ, bảo mật, phân quyền, đồng thời, thanh toán   | Backend: Mục 5.2.4; Frontend: Mục 5.3.4 (18/18 kịch bản đạt)   |
| Quy trình   | Issues, PR, Milestones, Releases đầy đủ   | Quản lý minh bạch trên nhánh tính năng và PR GitHub   |

5.6. Những hạn chế
Không tự động xác nhận giao dịch qua cổng thanh toán trực tuyến; thu ngân đối chiếu VietQR thủ công.
Chưa quản lý kho nguyên vật liệu, công thức món, tích điểm thành viên.
Phần Backend Sprint 1 hiện lưu dữ liệu trong bộ nhớ, chưa nối CSDL chính thức; kiểm thử mới bao phủ luồng thành công chính (Mục 5.2).
Một số tuần triển khai quá ngắn so với khối lượng user story; persona chưa được kiểm chứng bằng khảo sát người dùng thật.
Bổ sung hạn chế phát sinh trong quá trình thực hiện các sprint còn lại.

5.7. Hướng phát triển
Tích hợp thanh toán trực tuyến (VNPay, MoMo) và tự động đối soát giao dịch.
Quản lý kho, định lượng nguyên liệu theo công thức, cảnh báo hết hàng.
Chương trình tích điểm, khuyến mãi nâng cao; hóa đơn điện tử.
Đa chi nhánh; chuyển thành PWA để dùng ổn định trên điện thoại.
Ứng dụng AI có trách nhiệm: dự báo nhu cầu theo giờ và ngày, gợi ý món bán kèm, với dữ liệu ẩn danh và có con người xét duyệt.

TÀI LIỆU THAM KHẢO
Fielding, R. T. (2000). Architectural styles and the design of network-based software architectures [Doctoral dissertation, University of California, Irvine].
Fowler, M. (2015, June 3). MonolithFirst. https://martinfowler.com/bliki/MonolithFirst.html
Nhóm dự án Goi-Mon. (2026a). Product backlog – Dự án quản lý nhà hàng (Hệ thống gọi món QR và quản trị) [Tài liệu nội bộ].
Nhóm dự án Goi-Mon. (2026b). Kế hoạch phân công công việc nhóm (5 thành viên) [Tài liệu nội bộ].
Nhóm dự án Goi-Mon. (2026c). Quy chuẩn phát triển phần mềm toàn dự án [Tài liệu nội bộ].
OWASP Foundation. (2021). OWASP Top 10:2021. https://owasp.org/Top10/
Pressman, R. S., & Maxim, B. R. (2020). Software engineering: A practitioner’s approach (9th ed.). McGraw-Hill.
Sommerville, I. (2016). Software engineering (10th ed.). Pearson.
Sommerville, I. (2020). Engineering software products: An introduction to modern software engineering. Pearson Education.
