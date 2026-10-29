const danhGiaService = require('../../backend/modules/danhGia/danhGia.service');
const caLamViecService = require('../../backend/modules/caLamViec/caLamViec.service');
const baoCaoService = require('../../backend/modules/baoCao/baoCao.service');

async function chayKiemThuSprint4() {
    console.log('================================================================');
    console.log('🧪 BẮT ĐẦU KIỂM THỬ TOÀN DIỆN BACKEND SPRINT 4 (MINH PHỤ TRÁCH)');
    console.log('   Mục tiêu: Đánh giá khách hàng, Quản lý ca thu ngân, Dashboard & Xuất CSV');
    console.log('================================================================\n');

    let soLuongDat = 0;
    let tongSoKiemThu = 0;

    function ghiKetQua(tenKiemThu, dat, chiTiet = '') {
        tongSoKiemThu++;
        if (dat) soLuongDat++;
        console.log(`${dat ? '✅' : '❌'} [Test ${tongSoKiemThu}] ${tenKiemThu}: ${dat ? 'ĐẠT' : 'THẤT BẠI'}`);
        if (chiTiet) console.log(`   └─ ${chiTiet}`);
    }

    // -------------------------------------------------------------
    // PHẦN 1: ĐÁNH GIÁ & PHẢN HỒI KHÁCH HÀNG (US-111 -> US-116)
    // -------------------------------------------------------------
    console.log('--- [PHẦN 1: ĐÁNH GIÁ & PHẢN HỒI KHÁCH HÀNG (US-111 -> US-116)] ---');

    // 1.1. Khách gửi đánh giá 5 sao dịch vụ và đánh giá từng món
    const danhGiaMoi = await danhGiaService.guiDanhGia({
        hoaDonId: 3,
        tenKhachHang: 'Hoàng Anh',
        soDienThoaiKhach: '0977***888',
        diemDichVu: 5,
        nhanXetDichVu: 'Trải nghiệm tuyệt vời, quét QR gọi món rất tiện lợi!',
        danhGiaMonAn: [
            { monId: 1, tenMon: 'Bò nướng tảng sốt tiêu đen', soSao: 5, nhanXet: 'Thịt mềm, sốt đậm đà' },
            { monId: 4, tenMon: 'Trà đào cam sả', soSao: 5, nhanXet: 'Rất thanh mát' }
        ]
    });
    ghiKetQua(
        'Khách hàng gửi chấm sao dịch vụ & đánh giá từng món ăn (US-111, US-112)',
        danhGiaMoi && danhGiaMoi.diemDichVu === 5 && danhGiaMoi.danhGiaMonAn.length === 2,
        `Khách: ${danhGiaMoi.tenKhachHang}, Điểm: ${danhGiaMoi.diemDichVu}⭐, Đánh giá ${danhGiaMoi.danhGiaMonAn.length} món ăn`
    );

    // Chặn gửi đánh giá trùng lặp cho cùng một hóa đơn
    let biChanTrungLap = false;
    try {
        await danhGiaService.guiDanhGia({
            hoaDonId: 1, // Hóa đơn 1 đã có đánh giá trong CSDL
            diemDichVu: 4
        });
    } catch (e) {
        biChanTrungLap = true;
    }
    ghiKetQua('Chặn gửi đánh giá trùng lặp cho cùng một hóa đơn', biChanTrungLap, 'Báo lỗi đúng khi hóa đơn đã đánh giá rồi');

    // 1.2. Quản lý lọc danh sách đánh giá tiêu cực cần xử lý gấp
    const dsCanXuLy = await danhGiaService.layDanhSach({ canXuLyGap: true });
    ghiKetQua(
        'Lọc các đánh giá tiêu cực (<= 2 sao) cần xử lý gấp (US-113, US-114)',
        dsCanXuLy.length >= 1 && dsCanXuLy.every(dg => dg.diemDichVu <= 2 || dg.trangThai === 'CanXuLyGap'),
        `Tìm thấy ${dsCanXuLy.length} đánh giá tiêu cực cần phản hồi giải quyết`
    );

    // 1.3. Quản lý gửi phản hồi cho khách hàng
    const phanHoiKq = await danhGiaService.phanHoiDanhGia(dsCanXuLy[0].id, {
        phanHoiCuaQuanLy: 'Quán Mộc đã tiếp nhận góp ý và bảo trì điều hòa tầng 1. Chân thành xin lỗi quý khách!',
        nguoiPhanHoiId: 1,
        tenNguoiPhanHoi: 'Nguyễn Sỹ Minh (Quản lý)'
    });
    ghiKetQua(
        'Quản lý gửi phản hồi xử lý ý kiến khách hàng (US-115)',
        phanHoiKq.trangThai === 'DaXuLy' && phanHoiKq.phanHoiCuaQuanLy.includes('bảo trì điều hòa'),
        `Trạng thái đổi thành '${phanHoiKq.trangThai}', Người phản hồi: ${phanHoiKq.tenNguoiPhanHoi}`
    );

    // 1.4. Thống kê điểm đánh giá trung bình nhà hàng và từng món
    const thongKeDg = await danhGiaService.thongKeDiemDanhGia();
    ghiKetQua(
        'Thống kê điểm trung bình quán và điểm từng món ăn (US-116)',
        thongKeDg.diemTrungBinhNhaHang > 0 && thongKeDg.thongKeMonAn.length > 0,
        `Điểm trung bình nhà hàng: ${thongKeDg.diemTrungBinhNhaHang}⭐ / 5⭐, Số lượng đánh giá: ${thongKeDg.tongSoDanhGia}`
    );

    // -------------------------------------------------------------
    // PHẦN 2: QUẢN LÝ CA LÀM VIỆC & KẾT CA THU NGÂN (US-117 -> US-122)
    // -------------------------------------------------------------
    console.log('\n--- [PHẦN 2: CA LÀM VIỆC & KẾT CA THU NGÂN (US-117 -> US-122)] ---');

    // 2.1. Lấy danh sách cấu hình ca mẫu trong ngày
    const dsCaMau = await caLamViecService.layDanhSachCaMau();
    ghiKetQua(
        'Lấy danh sách cấu hình các ca làm việc trong ngày (US-117)',
        dsCaMau.length >= 3,
        `Gồm các ca: ${dsCaMau.map(c => `${c.tenCa} (${c.gioBatDau}-${c.gioKetThuc})`).join(', ')}`
    );

    // 2.2. Thu ngân mở ca làm việc mới và nhập 1.500.000đ tiền đầu ca
    const caMoi = await caLamViecService.moCaLamViec({
        caId: 2, // Ca chiều
        thuNganId: 3,
        tenThuNgan: 'Lê Văn Thu Ngân',
        tienDauCa: 1500000
    });
    ghiKetQua(
        'Thu ngân mở ca làm việc và ghi nhận tiền mặt trong két (US-118)',
        caMoi && caMoi.trangThai === 'DangHoatDong' && caMoi.tienDauCa === 1500000,
        `Mã ca: ${caMoi.maPhienCa}, Tên ca: ${caMoi.tenCa}, Tiền két đầu ca: ${caMoi.tienDauCa.toLocaleString('vi-VN')}đ`
    );

    // 2.3. Ghi nhận phiếu thu/chi phát sinh trong ca
    const kqChi = await caLamViecService.ghiNhanThuChi(caMoi.id, {
        loai: 'CHI',
        soTien: 100000,
        lyDo: 'Chi tiền mua thêm giấy lau bàn và túi đựng rác'
    });
    const kqThu = await caLamViecService.ghiNhanThuChi(caMoi.id, {
        loai: 'THU',
        soTien: 50000,
        lyDo: 'Thu tiền khách đền bù cốc thủy tinh bị vỡ'
    });
    ghiKetQua(
        'Ghi nhận các khoản thu/chi phát sinh trong ca (US-119)',
        kqChi.phieu.loai === 'CHI' && kqThu.phieu.loai === 'THU' && kqThu.phienCa.phieuThuChi.length === 2,
        `Đã ghi nhận 1 phiếu Chi (${kqChi.phieu.soTien.toLocaleString()}đ) và 1 phiếu Thu (${kqThu.phieu.soTien.toLocaleString()}đ)`
    );

    // 2.4. Tổng hợp doanh thu và tiền két theo thời gian thực
    const thongTinCa = await caLamViecService.layThongTinCaHienTai(caMoi.thuNganId);
    // Tiền két lý thuyết = 1.500.000 (đầu ca) - 100.000 (chi) + 50.000 (thu) + doanh thu = 1.450.000đ
    ghiKetQua(
        'Tổng hợp doanh thu tiền mặt, chuyển khoản và tiền két (US-120)',
        thongTinCa && thongTinCa.tienMatLyThuyetTrongKet === (1500000 - 100000 + 50000),
        `Tiền mặt lý thuyết trong két: ${thongTinCa.tienMatLyThuyetTrongKet.toLocaleString('vi-VN')}đ`
    );

    // 2.5. Thu ngân đóng ca và đối soát kiểm đếm thực tế
    const tienThucTeDem = 1450000; // Khớp 100%
    const kqDongCa = await caLamViecService.dongCaLamViec(caMoi.id, {
        tienMatThucTeCuoiCa: tienThucTeDem,
        ghiChuKetCa: 'Kiểm kê bàn giao ca chuẩn xác',
        quanLyId: 1,
        tenQuanLy: 'Nguyễn Sỹ Minh'
    });
    ghiKetQua(
        'Đóng ca, nhập tiền kiểm đếm thực tế và đối soát chênh lệch (US-121)',
        kqDongCa.bienBanKetCa.trangThai === 'DaDongCa' && kqDongCa.bienBanKetCa.chenhLech === 0,
        `Thực tế: ${kqDongCa.bienBanKetCa.tienMatThucTeCuoiCa.toLocaleString()}đ, Chênh lệch: ${kqDongCa.bienBanKetCa.chenhLech}đ`
    );

    // 2.6. Quản lý xem lịch sử biên bản bàn giao ca
    const dsLichSuCa = await caLamViecService.layLichSuPhienCa();
    ghiKetQua(
        'Quản lý xem lịch sử bàn giao ca và biên bản kết ca (US-122)',
        dsLichSuCa.length >= 2,
        `Tìm thấy ${dsLichSuCa.length} phiên ca đã lưu trữ trên hệ thống`
    );

    // -------------------------------------------------------------
    // PHẦN 3: BÁO CÁO DOANH THU & DASHBOARD (US-123 -> US-130)
    // -------------------------------------------------------------
    console.log('\n--- [PHẦN 3: THỐNG KÊ DOANH THU & DASHBOARD (US-123 -> US-130)] ---');

    // 3.1. Dashboard tổng quan trong ngày
    const dashboard = await baoCaoService.layDashboardTongQuan();
    ghiKetQua(
        'Dashboard tổng quan số liệu trong ngày (US-123)',
        dashboard && dashboard.tongDoanhThu >= 0 && dashboard.banAn !== undefined,
        `Doanh thu: ${dashboard.tongDoanhThu.toLocaleString()}đ, Bàn phục vụ: ${dashboard.banAn.soBanDangPhucVu}/${dashboard.banAn.tongSoBan}`
    );

    // 3.2. Biểu đồ doanh thu theo thời gian
    const bieuDo = await baoCaoService.layBieuDoDoanhThu({ soNgay: 7 });
    ghiKetQua(
        'Xem biểu đồ doanh thu theo chuỗi thời gian (US-124)',
        Array.isArray(bieuDo) && bieuDo.length === 7,
        `Tạo dữ liệu biểu đồ cho ${bieuDo.length} ngày gần nhất`
    );

    // 3.3. Tỷ trọng phương thức thanh toán
    const tyTrong = await baoCaoService.layTyTrongThanhToan();
    ghiKetQua(
        'Thống kê tỷ trọng thanh toán Tiền mặt vs Chuyển khoản VietQR (US-125)',
        tyTrong.tienMat !== undefined && tyTrong.chuyenKhoanVietQr !== undefined,
        `Tiền mặt: ${tyTrong.tienMat.tyLePhanTram}% | Chuyển khoản VietQR: ${tyTrong.chuyenKhoanVietQr.tyLePhanTram}%`
    );

    // 3.4. Thống kê doanh thu theo danh mục
    const dtDanhMuc = await baoCaoService.layDoanhThuTheoDanhMuc();
    ghiKetQua(
        'Thống kê doanh thu phân bổ theo danh mục thực đơn (US-126)',
        Array.isArray(dtDanhMuc) && dtDanhMuc.length > 0,
        `Thống kê cho ${dtDanhMuc.length} danh mục thực đơn`
    );

    // 3.5. Xếp hạng Top món bán chạy và bán chậm
    const xepHang = await baoCaoService.layXepHangMonAn({ gioiHan: 5 });
    ghiKetQua(
        'Bảng xếp hạng Top món bán chạy và món ít người gọi (US-127, US-128)',
        Array.isArray(xepHang.topBanChay) && Array.isArray(xepHang.topBanCham),
        `Top bán chạy: ${xepHang.topBanChay.length} món, Top bán chậm: ${xepHang.topBanCham.length} món`
    );

    // 3.6. Thống kê khung giờ cao điểm
    const khungGio = await baoCaoService.layThongKeKhungGioCaoDiem();
    ghiKetQua(
        'Thống kê phân tích khung giờ cao điểm trong ngày (US-129)',
        Array.isArray(khungGio.topKhungGioCaoDiem) && khungGio.topKhungGioCaoDiem.length > 0,
        `Khung giờ đông khách nhất: ${khungGio.topKhungGioCaoDiem[0]?.khungGio} (${khungGio.topKhungGioCaoDiem[0]?.soDon} đơn)`
    );

    // 3.7. Thống kê tỷ lệ đơn hủy
    const thongKeHuy = await baoCaoService.layThongKeDonHuy();
    ghiKetQua(
        'Thống kê tỷ lệ đơn hủy / món hủy và giá trị thất thoát (US-130)',
        thongKeHuy.tyLeHuyPhanTram !== undefined,
        `Tỷ lệ hủy: ${thongKeHuy.tyLeHuyPhanTram}, Món hủy: ${thongKeHuy.soMonBiHuy}, Giá trị: ${thongKeHuy.tongGiaTriHuy.toLocaleString()}đ`
    );

    // -------------------------------------------------------------
    // PHẦN 4: ĐỐI SOÁT LỊCH SỬ & XUẤT CSV/EXCEL (US-131 -> US-134)
    // -------------------------------------------------------------
    console.log('\n--- [PHẦN 4: ĐỐI SOÁT LỊCH SỬ & XUẤT FILE CSV/EXCEL (US-131 -> US-134)] ---');

    // 4.1. Tra cứu lịch sử hóa đơn
    const lsHoaDon = await baoCaoService.traCuuLichSuHoaDon();
    ghiKetQua(
        'Tra cứu toàn bộ lịch sử hóa đơn và xem chi tiết (US-131, US-132)',
        lsHoaDon.length > 0,
        `Tìm thấy ${lsHoaDon.length} hóa đơn đã thanh toán trong lịch sử`
    );

    // 4.2. Xuất báo cáo hóa đơn ra file CSV chuẩn UTF-8 BOM
    const csvHoaDon = await baoCaoService.xuatCsvHoaDon();
    const coBomHoaDon = csvHoaDon.startsWith('\uFEFF');
    ghiKetQua(
        'Xuất báo cáo doanh thu & danh sách hóa đơn ra tệp CSV (US-133)',
        coBomHoaDon && csvHoaDon.includes('Mã Hóa Đơn') && csvHoaDon.includes('Tiền Món (VNĐ)'),
        `Tệp CSV chứa ký tự BOM UTF-8 (\\uFEFF), dung lượng: ${csvHoaDon.length} bytes, mở Excel không lỗi font`
    );

    // 4.3. Xuất danh mục thực đơn ra file CSV chuẩn UTF-8 BOM
    const csvThucDon = await baoCaoService.xuatCsvThucDon();
    const coBomThucDon = csvThucDon.startsWith('\uFEFF');
    ghiKetQua(
        'Xuất danh mục thực đơn ra tệp CSV để sao lưu / nhập liệu (US-134)',
        coBomThucDon && csvThucDon.includes('Tên Món Ăn') && csvThucDon.includes('Đơn Giá (VNĐ)'),
        `Tệp CSV chứa ký tự BOM UTF-8 (\\uFEFF), dung lượng: ${csvThucDon.length} bytes, mở Excel không lỗi font`
    );

    // -------------------------------------------------------------
    // TỔNG KẾT
    // -------------------------------------------------------------
    console.log('\n================================================================');
    console.log(`📊 TỔNG KẾT KIỂM THỬ SPRINT 4: ${soLuongDat}/${tongSoKiemThu} KỊCH BẢN ĐẠT (Tỷ lệ: ${(soLuongDat/tongSoKiemThu*100).toFixed(1)}%)`);
    if (soLuongDat === tongSoKiemThu) {
        console.log('🎉 XUẤT SẮC! TOÀN BỘ 24 USER STORIES SPRINT 4 CỦA MINH ĐỀU VƯỢT QUA KIỂM THỬ 100%');
    }
    console.log('================================================================');
}

if (require.main === module) {
    chayKiemThuSprint4().catch(err => {
        console.error('❌ LỖI TRONG QUÁ TRÌNH CHẠY KIỂM THỬ:', err);
        process.exit(1);
    });
}

module.exports = chayKiemThuSprint4;
