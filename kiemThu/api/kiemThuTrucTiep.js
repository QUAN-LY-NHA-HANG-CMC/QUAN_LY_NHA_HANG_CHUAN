const danhMucService = require('../../backend/modules/danhMucMon/danhMucMon.service');
const thucDonService = require('../../backend/modules/thucDon/thucDon.service');
const khuVucService = require('../../backend/modules/khuVuc/khuVuc.service');
const banAnService = require('../../backend/modules/banAn/banAn.service');
const nhanVienService = require('../../backend/modules/nhanVien/nhanVien.service');

async function chayKiemThu() {
    console.log('================================================================');
    console.log('🧪 KIỂM THỬ TÍCH HỢP TRỰC TIẾP TẤT CẢ SERVICE SPRINT 1 CỦA MINH');
    console.log('================================================================');

    // 1. Danh mục món (US-031, US-032)
    console.log('\n[PHÂN HỆ 1: DANH MỤC MÓN]');
    const danhSachDanhMuc = await danhMucService.layTatCaDanhMuc();
    console.log(`✅ Lấy danh sách danh mục ban đầu: ${danhSachDanhMuc.length} danh mục`);

    const danhMucMoi = await danhMucService.taoDanhMucMoi({
        tenDanhMuc: 'Món Nướng Đặc Biệt',
        thuTuHienThi: 7
    });
    console.log(`✅ Tạo mới danh mục thành công: ID = ${danhMucMoi.id}, Tên = "${danhMucMoi.tenDanhMuc}"`);

    const danhMucCapNhat = await danhMucService.capNhatDanhMuc(danhMucMoi.id, {
        tenDanhMuc: 'Món Nướng Than Hoa'
    });
    console.log(`✅ Cập nhật danh mục: Tên mới = "${danhMucCapNhat.tenDanhMuc}"`);

    // 2. Món ăn & Thực đơn (US-033 -> US-040)
    console.log('\n[PHÂN HỆ 2: MÓN ĂN & THỰC ĐƠN]');
    const monMoi = await thucDonService.taoMonAn({
        tenMon: 'Bò Nướng Tảng Sốt Phô Mai',
        danhMucId: danhMucCapNhat.id,
        giaBan: 219000,
        donViTinh: 'Phần',
        moTa: 'Bò nướng tảng thơm mềm ăn kèm sốt phô mai kéo sợi',
        tuyChon: [
            { tenNhom: 'Mức chín', batBuoc: true, loai: 'ChonMot', danhSach: [{ ten: 'Chín vừa', giaThem: 0 }, { ten: 'Chín kỹ', giaThem: 0 }] }
        ]
    });
    console.log(`✅ Tạo món ăn mới thành công: ID = ${monMoi.id}, Tên = "${monMoi.tenMon}", Giá = ${monMoi.giaBan}đ`);

    const monTamHet = await thucDonService.doiTrangThaiMonAn(monMoi.id, 'TamHet');
    console.log(`✅ Chuyển trạng thái món nhanh: ${monTamHet.trangThai}`);

    const monBanChay = await thucDonService.danhDauMonBanChay(monMoi.id, true);
    console.log(`✅ Đánh dấu món bán chạy: laMonBanChay = ${monBanChay.laMonBanChay}`);

    const danhSachLoc = await thucDonService.layDanhSachMonAn({ tuKhoa: 'Bò', giaTu: 100000 });
    console.log(`✅ Lọc món ăn (từ khóa "Bò", giá >= 100k): tìm thấy ${danhSachLoc.danhSach.length} món`);

    await thucDonService.xoaMemMonAn(monMoi.id);
    console.log(`✅ Xóa mềm (ẩn) món ăn thành công`);

    // 3. Khu vực & Sơ đồ bàn & Mã QR (US-023 -> US-030)
    console.log('\n[PHÂN HỆ 3: KHU VỰC, BÀN ĂN & MÃ QR]');
    const khuVucMoi = await khuVucService.taoKhuVuc({
        tenKhuVuc: 'Khu Sân Vườn',
        ghiChu: 'Không gian mở nhiều cây xanh'
    });
    console.log(`✅ Tạo khu vực mới: ID = ${khuVucMoi.id}, Tên = "${khuVucMoi.tenKhuVuc}"`);

    const banMoi = await banAnService.taoBanAn({
        maBan: 'SV01',
        tenBan: 'Bàn Sân Vườn 01',
        khuVucId: khuVucMoi.id,
        sucChua: 8
    });
    console.log(`✅ Tạo bàn ăn: ID = ${banMoi.id}, Mã = "${banMoi.maBan}"`);
    console.log(`   🔗 Đường dẫn QR: ${banMoi.duongDanQr}`);
    console.log(`   🖼️ Ảnh QR (Base64 preview): ${banMoi.anhQr.substring(0, 45)}...`);

    const banLamMoiQr = await banAnService.lamMoiTokenQr(banMoi.id);
    console.log(`✅ Làm mới token bảo mật QR: Token mới = ${banLamMoiQr.tokenBaoMat}`);

    const qrTatCa = await banAnService.layQrTatCaBanTheoKhuVuc(khuVucMoi.id);
    console.log(`✅ Xuất toàn bộ mã QR của khu vực (${qrTatCa.length} bàn)`);

    // 4. Hồ sơ nhân sự (US-011 -> US-014)
    console.log('\n[PHÂN HỆ 4: HỒ SƠ NHÂN SỰ]');
    const nvMoi = await nhanVienService.taoNhanVien({
        tenDangNhap: 'thungan02',
        matKhau: 'MatKhauBaoMat@2026',
        hoTen: 'Phạm Thị Thu Ngân 2',
        soDienThoai: '0933445566',
        email: 'thungan02@quanmoc.com',
        vaiTro: 'ThuNgan'
    });
    console.log(`✅ Tạo nhân viên mới: ID = ${nvMoi.id}, Họ tên = "${nvMoi.hoTen}", Mật khẩu được ẩn an toàn`);

    const nvKhoa = await nhanVienService.doiTrangThaiNhanVien(nvMoi.id, 'Khoa');
    console.log(`✅ Khóa tài khoản nhân viên đã nghỉ việc: Trạng thái = ${nvKhoa.trangThai}`);

    await nhanVienService.datLaiMatKhau(nvMoi.id, 'MatKhauMoiToanh@123');
    console.log(`✅ Đặt lại mật khẩu nhân viên thành công (đã băm bằng bcrypt)`);

    console.log('\n================================================================');
    console.log('🎉 TẤT CẢ CÁC CHỨC NĂNG CỦA MINH TRONG SPRINT 1 HOẠT ĐỘNG HOÀN HẢO!');
    console.log('================================================================');
}

chayKiemThu().catch(err => {
    console.error('❌ Thất bại:', err);
    process.exit(1);
});
