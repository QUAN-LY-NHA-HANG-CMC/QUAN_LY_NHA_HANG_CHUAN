const khuyenMaiService = require('../../backend/modules/khuyenMai/khuyenMai.service');
const donGoiMonService = require('../../backend/modules/donGoiMon/donGoiMon.service');
const hoaDonService = require('../../backend/modules/hoaDon/hoaDon.service');
const thanhToanService = require('../../backend/modules/thanhToan/thanhToan.service');
const banAnModel = require('../../backend/modules/banAn/banAn.model');

async function chayKiemThuSprint3() {
    console.log('================================================================');
    console.log('🧪 BẮT ĐẦU KIỂM THỬ TOÀN DIỆN BACKEND SPRINT 3 (MINH PHỤ TRÁCH)');
    console.log('   Mục tiêu: Khuyến mãi, Hóa đơn, In tạm tính, Tách bill, VietQR & Thanh toán');
    console.log('================================================================\n');

    let soLuongDat = 0;
    let tongSoKiemThu = 0;

    function ghiKetQua(tenKiemThu, dat, chiTiet = '') {
        tongSoKiemThu++;
        if (dat) soLuongDat++;
        console.log(`${dat ? '✅' : '❌'} [Test ${tongSoKiemThu}] ${tenKiemThu}: ${dat ? 'ĐẠT' : 'THẤT BẠI'}`);
        if (chiTiet) console.log(`   └─ ${chiTiet}`);
    }

    // Lấy bàn 3 để thực hiện trọn vẹn kịch bản từ Gọi món -> Lập hóa đơn -> Thanh toán
    const banTest = await banAnModel.layTheoId(3);
    console.log(`📌 Bàn thử nghiệm: ID = ${banTest.id}, Tên = "${banTest.tenBan}", Khu vực = ${banTest.khuVucId}\n`);

    // -------------------------------------------------------------
    // PHẦN 1: QUẢN LÝ KHUYẾN MÃI & MÃ GIẢM GIÁ (US-099, US-100)
    // -------------------------------------------------------------
    console.log('--- [PHẦN 1: KHUYẾN MÃI & MÃ GIẢM GIÁ (US-099, US-100)] ---');
    
    // 1.1. Lấy danh sách voucher
    const dsVoucher = await khuyenMaiService.layDanhSachKhuyenMai();
    ghiKetQua('Lấy danh sách mã khuyến mãi đang áp dụng', dsVoucher.length >= 2, `Tìm thấy ${dsVoucher.length} chương trình ưu đãi`);

    // 1.2. Thử áp dụng mã giảm giá 10%
    const kqApDung10 = await khuyenMaiService.kiemTraVaApDungMa({
        maKhuyenMai: 'GIAM10',
        tongTienTamTinh: 500000
    });
    // Giảm 10% của 500k = 50k, không vượt giamToiDa 100k
    ghiKetQua(
        "Áp dụng mã phần trăm 'GIAM10' (đơn 500.000đ)",
        kqApDung10.hopLe && kqApDung10.soTienGiam === 50000,
        `Giảm được: ${kqApDung10.soTienGiam.toLocaleString('vi-VN')}đ, Sau giảm: ${kqApDung10.tongTienSauGiam.toLocaleString('vi-VN')}đ`
    );

    // 1.3. Thử áp dụng mã giảm tiền cố định 'CHAOMUNG50K'
    const kqApDung50k = await khuyenMaiService.kiemTraVaApDungMa({
        maKhuyenMai: 'CHAOMUNG50K',
        tongTienTamTinh: 300000
    });
    ghiKetQua(
        "Áp dụng mã số tiền cố định 'CHAOMUNG50K' (đơn 300.000đ)",
        kqApDung50k.hopLe && kqApDung50k.soTienGiam === 50000,
        `Giảm được: ${kqApDung50k.soTienGiam.toLocaleString('vi-VN')}đ, Sau giảm: ${kqApDung50k.tongTienSauGiam.toLocaleString('vi-VN')}đ`
    );

    // 1.4. Chặn áp dụng khi chưa đủ giá trị đơn tối thiểu
    let loiGiaTriToiThieu = false;
    try {
        await khuyenMaiService.kiemTraVaApDungMa({
            maKhuyenMai: 'VIP20', // Yêu cầu tối thiểu 500k
            tongTienTamTinh: 200000
        });
    } catch (e) {
        loiGiaTriToiThieu = true;
    }
    ghiKetQua('Chặn áp dụng voucher khi chưa đủ giá trị đơn tối thiểu', loiGiaTriToiThieu, 'Báo lỗi đúng khi đơn 200k chưa đạt mức 500k');

    // -------------------------------------------------------------
    // PHẦN 2: ĐƠN GỌI MÓN VÀ LŨY KẾ THEO LƯỢT (US-067, US-070)
    // -------------------------------------------------------------
    console.log('\n--- [PHẦN 2: LƯỢT GỌI MÓN CỦA BÀN (ROUNDS)] ---');

    // 2.1. Bàn 3 đặt món Lượt 1
    const donLuot1 = await donGoiMonService.taoDonGoiMon({
        banId: banTest.id,
        ghiChuDon: 'Khách ăn đậm vị',
        danhSachMon: [
            {
                monId: 1,
                tenMon: 'Bò nướng tảng sốt tiêu đen',
                donGia: 189000,
                soLuong: 2,
                thanhTien: 378000,
                size: 'Tiêu chuẩn',
                ghiChu: 'Chín vừa'
            },
            {
                monId: 4,
                tenMon: 'Trà đào cam sả',
                donGia: 39000,
                soLuong: 3,
                thanhTien: 117000,
                size: 'Size L',
                ghiChu: 'Ít đá'
            }
        ]
    });
    ghiKetQua(
        'Tạo đơn đặt món Lượt 1 cho Bàn 03',
        donLuot1.luotGoi === 1 && donLuot1.tongTienDon === 495000,
        `Mã đơn: ${donLuot1.maDon}, Tổng tiền lượt 1: ${donLuot1.tongTienDon.toLocaleString('vi-VN')}đ`
    );

    // 2.2. Bàn 3 đặt thêm món Lượt 2 (Gọi thêm)
    const donLuot2 = await donGoiMonService.taoDonGoiMon({
        banId: banTest.id,
        ghiChuDon: 'Gọi thêm tráng miệng',
        danhSachMon: [
            {
                monId: 5,
                tenMon: 'Khoai tây chiên lắc phô mai',
                donGia: 45000,
                soLuong: 2,
                thanhTien: 90000,
                size: 'Tiêu chuẩn',
                ghiChu: 'Nóng giòn'
            }
        ]
    });
    ghiKetQua(
        'Tạo đơn gọi thêm món Lượt 2 cho Bàn 03',
        donLuot2.luotGoi === 2 && donLuot2.tongTienDon === 90000,
        `Mã đơn: ${donLuot2.maDon}, Tổng tiền lượt 2: ${donLuot2.tongTienDon.toLocaleString('vi-VN')}đ`
    );

    // 2.3. Lấy tổng lũy kế toàn bộ các lượt gọi của bàn
    const thongTinDonBan = await donGoiMonService.layDonCuaBan(banTest.id);
    const tongDuKien = 495000 + 90000; // 585.000đ
    ghiKetQua(
        'Tính tổng tiền lũy kế tự động của bàn',
        thongTinDonBan.tongTienLuyKe === tongDuKien && thongTinDonBan.tongSoDon === 2,
        `Tổng tiền 2 lượt: ${thongTinDonBan.tongTienLuyKe.toLocaleString('vi-VN')}đ, Tổng món: ${thongTinDonBan.tongSoMon}`
    );

    // -------------------------------------------------------------
    // PHẦN 3: TỔNG HỢP HÓA ĐƠN & TÍNH TOÁN KẾ TOÁN (US-101, 102, 103)
    // -------------------------------------------------------------
    console.log('\n--- [PHẦN 3: TỔNG HỢP HÓA ĐƠN & TÍNH TIỀN (US-101 -> US-103)] ---');

    // Tổng hợp hóa đơn kèm mã giảm giá 'CHAOMUNG50K' + Chiết khấu 20k + Phụ phí phòng VIP 30k
    const hoaDonBan3 = await hoaDonService.tongHopHoaDonTuBan(banTest.id, {
        maKhuyenMai: 'CHAOMUNG50K',
        chietKhauTrucTiep: 20000,
        lyDoChietKhau: 'Khách quen chiết khấu thêm',
        phuPhi: 30000,
        lyDoPhuPhi: 'Phí phòng VIP ngoài giờ',
        thueVatPhanTram: 8
    });

    // Kiểm tra công thức:
    // Tiền món: 585.000đ
    // Giảm voucher: 50.000đ
    // Chiết khấu: 20.000đ
    // Tổng giảm: 70.000đ
    // Phụ phí: +30.000đ
    // Trước thuế: 585.000 - 70.000 + 30.000 = 545.000đ
    // Thuế VAT 8%: 545.000 * 0.08 = 43.600đ
    // Tổng thanh toán: 545.000 + 43.600 = 588.600đ
    const kienTraHoaDon = (
        hoaDonBan3.tongTienMon === 585000 &&
        hoaDonBan3.giamGiaKhuyenMai === 50000 &&
        hoaDonBan3.chietKhauTrucTiep === 20000 &&
        hoaDonBan3.phuPhi === 30000 &&
        hoaDonBan3.tienTruocThue === 545000 &&
        hoaDonBan3.tienThueVat === 43600 &&
        hoaDonBan3.tongTienThanhToan === 588600
    );

    ghiKetQua(
        'Tự động tổng hợp 2 lượt gọi món thành 1 hóa đơn',
        hoaDonBan3.danhSachMon.length === 3,
        `Mã HĐ: ${hoaDonBan3.maHoaDon}, Gồm ${hoaDonBan3.danhSachMon.length} món ăn`
    );

    ghiKetQua(
        'Tính toán tiền hàng, giảm giá, phụ phí, VAT 8% chuẩn kế toán',
        kienTraHoaDon,
        `Tiền món: ${hoaDonBan3.tongTienMon.toLocaleString()}đ | Giảm: ${hoaDonBan3.tongGiamGia.toLocaleString()}đ | VAT: ${hoaDonBan3.tienThueVat.toLocaleString()}đ => Tổng: ${hoaDonBan3.tongTienThanhToan.toLocaleString()}đ`
    );

    // -------------------------------------------------------------
    // PHẦN 4: XEM TRƯỚC VÀ IN PHIẾU TẠM TÍNH (US-104)
    // -------------------------------------------------------------
    console.log('\n--- [PHẦN 4: XEM TRƯỚC VÀ IN PHIẾU TẠM TÍNH (US-104)] ---');
    const phieuTamTinh = await hoaDonService.layPhieuTamTinh(hoaDonBan3.id);
    const coVietQr = phieuTamTinh.thanhToanVietQr && phieuTamTinh.thanhToanVietQr.qrDataUrl.startsWith('data:image/png;base64');
    
    ghiKetQua(
        'Xuất dữ liệu phiếu tạm tính chuẩn in ấn (CSS Print)',
        phieuTamTinh.hoaDon.id === hoaDonBan3.id && phieuTamTinh.nhaHang.ten === 'NHÀ HÀNG QUÁN MỘC',
        `Nhà hàng: ${phieuTamTinh.nhaHang.ten}, Số tiền: ${phieuTamTinh.hoaDon.tongTienThanhToan.toLocaleString()}đ`
    );

    ghiKetQua(
        'Sinh kèm mã VietQR DataURL Base64 nhúng trên phiếu tạm tính',
        coVietQr,
        `Tài khoản nhận: ${phieuTamTinh.thanhToanVietQr.soTaiKhoan} (${phieuTamTinh.thanhToanVietQr.nganHang})`
    );

    // -------------------------------------------------------------
    // PHẦN 5: TÁCH HÓA ĐƠN RIÊNG (SPLIT BILL - US-108)
    // -------------------------------------------------------------
    console.log('\n--- [PHẦN 5: NGHIỆP VỤ TÁCH MÓN THANH TOÁN RIÊNG (US-108)] ---');
    // Tách 1 đĩa khoai tây chiên (45.000đ) sang hóa đơn con mới
    const monKhoaiTay = hoaDonBan3.danhSachMon.find(m => m.tenMon.includes('Khoai tây chiên'));
    const kqTach = await hoaDonService.tachHoaDon(hoaDonBan3.id, {
        danhSachMonTach: [
            { id: monKhoaiTay.id, soLuong: 1 }
        ]
    });

    const hdGocMoi = kqTach.hoaDonGoc;
    const hdTachMoi = kqTach.hoaDonTachMoi;

    ghiKetQua(
        'Tách 1 phần món ăn sang hóa đơn riêng mới',
        hdTachMoi && hdTachMoi.hoaDonGocId === hoaDonBan3.id,
        `Mã HĐ con: ${hdTachMoi.maHoaDon}, Tiền món con: ${hdTachMoi.tongTienMon.toLocaleString()}đ`
    );

    ghiKetQua(
        'Khấu trừ chính xác món đã tách khỏi hóa đơn gốc',
        hdGocMoi.danhSachMon.find(m => m.id === monKhoaiTay.id).soLuong === 1,
        `Khoai tây trong HĐ gốc giảm từ 2 xuống 1 đĩa`
    );

    // -------------------------------------------------------------
    // PHẦN 6: THANH TOÁN TIỀN MẶT & ĐÓNG PHIÊN BÀN (US-105, 107, 109, 110)
    // -------------------------------------------------------------
    console.log('\n--- [PHẦN 6: THANH TOÁN TIỀN MẶT, ĐÓNG PHIÊN & GIẢI PHÓNG BÀN] ---');

    // Thanh toán hóa đơn con trước
    await thanhToanService.thanhToanTienMat({
        hoaDonId: hdTachMoi.id,
        soTienKhachDua: 100000,
        tenThuNgan: 'Nguyễn Sỹ Minh'
    });

    // Giả sử khách đưa 600.000đ cho hóa đơn gốc
    const tienCanTraGoc = hdGocMoi.tongTienThanhToan;
    const kqThanhToanGoc = await thanhToanService.thanhToanTienMat({
        hoaDonId: hdGocMoi.id,
        soTienKhachDua: 600000,
        tenThuNgan: 'Nguyễn Sỹ Minh'
    });

    const tienThuaChuan = 600000 - tienCanTraGoc;
    ghiKetQua(
        'Xử lý thanh toán tiền mặt & tính tiền thừa chính xác',
        kqThanhToanGoc.thanhCong && kqThanhToanGoc.soTienThua === tienThuaChuan,
        `Khách đưa: 600.000đ, Cần trả: ${tienCanTraGoc.toLocaleString()}đ, Thừa: ${kqThanhToanGoc.soTienThua.toLocaleString()}đ`
    );

    // Kiểm tra trạng thái bàn sau khi thanh toán xong toàn bộ hóa đơn
    const banSauThanhToan = await banAnModel.layTheoId(banTest.id);
    ghiKetQua(
        'Tự động đóng phiên và giải phóng bàn về "Bàn trống" (US-109, US-110)',
        banSauThanhToan.trangThai === 'Trong' && banSauThanhToan.tokenBaoMat !== banTest.tokenBaoMat,
        `Trạng thái bàn hiện tại: '${banSauThanhToan.trangThai}', Token QR đã được làm mới an toàn`
    );

    // -------------------------------------------------------------
    // PHẦN 7: TẠO MÃ VIETQR ĐỘNG VÀ XÁC NHẬN CHUYỂN KHOẢN (US-106, 107)
    // -------------------------------------------------------------
    console.log('\n--- [PHẦN 7: THANH TOÁN CHUYỂN KHOẢN VIETQR ĐỘNG (US-106, 107)] ---');
    // Lấy Hóa đơn 1 mẫu trong CSDL để test thanh toán VietQR
    const hoaDonVietQr = await hoaDonService.tongHopHoaDonTuBan(1, { thueVatPhanTram: 8 });
    const ketQuaVietQr = await thanhToanService.taoMaVietQrChoHoaDon(hoaDonVietQr.id);

    ghiKetQua(
        'Sinh mã VietQR động chứa sẵn số tiền và nội dung hóa đơn (US-106)',
        ketQuaVietQr.qrDataUrl.startsWith('data:image/png;base64') && ketQuaVietQr.soTien === hoaDonVietQr.tongTienThanhToan,
        `Nội dung CK: "${ketQuaVietQr.noiDungChuyenKhoan}", Số tiền: ${ketQuaVietQr.soTien.toLocaleString('vi-VN')}đ`
    );

    // Xác nhận giao dịch VietQR thành công
    const xacNhanVietQr = await thanhToanService.xacNhanThanhToanVietQr({
        hoaDonId: hoaDonVietQr.id,
        maGiaoDichNganHang: 'FT262981920482',
        tenThuNgan: 'Nguyễn Sỹ Minh'
    });

    ghiKetQua(
        'Xác nhận chuyển khoản VietQR thành công và xuất hóa đơn chính thức (US-107)',
        xacNhanVietQr.thanhCong && xacNhanVietQr.hoaDon.trangThai === 'DaThanhToan',
        `Mã giao dịch NH: ${xacNhanVietQr.giaoDich.maGiaoDichNganHang}, Trạng thái HĐ: '${xacNhanVietQr.hoaDon.trangThai}'`
    );

    // -------------------------------------------------------------
    // TỔNG KẾT
    // -------------------------------------------------------------
    console.log('\n================================================================');
    console.log(`📊 TỔNG KẾT KIỂM THỬ SPRINT 3: ${soLuongDat}/${tongSoKiemThu} KỊCH BẢN ĐẠT (Tỷ lệ: ${(soLuongDat/tongSoKiemThu*100).toFixed(1)}%)`);
    if (soLuongDat === tongSoKiemThu) {
        console.log('🎉 XUẤT SẮC! TOÀN BỘ 12 USER STORIES SPRINT 3 CỦA MINH ĐỀU VƯỢT QUA KIỂM THỬ 100%');
    }
    console.log('================================================================');
}

// Chạy trực tiếp nếu gọi từ command line
if (require.main === module) {
    chayKiemThuSprint3().catch(err => {
        console.error('❌ LỖI TRONG QUÁ TRÌNH CHẠY KIỂM THỬ:', err);
        process.exit(1);
    });
}

module.exports = chayKiemThuSprint3;
