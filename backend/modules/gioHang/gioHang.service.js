const thucDonModel = require('../thucDon/thucDon.model');
const banAnModel = require('../banAn/banAn.model');

async function kiemTraVaTinhTienGioHang({ banId, token, danhSachMon }) {
    // 1. Kiểm tra bàn ăn
    const ban = await banAnModel.layTheoId(banId);
    if (!ban) {
        const loi = new Error('Bàn ăn không tồn tại');
        loi.status = 404;
        throw loi;
    }

    if (token && ban.tokenBaoMat !== token) {
        const loi = new Error('Mã bảo mật QR bàn không hợp lệ');
        loi.status = 403;
        throw loi;
    }

    if (ban.trangThai === 'TamKhoa') {
        const loi = new Error('Bàn này hiện đang tạm ngưng phục vụ');
        loi.status = 403;
        throw loi;
    }

    const danhSachHopLe = [];
    const danhSachMonHetHang = [];
    let tongSoLuongMon = 0;
    let tongTienTamTinh = 0;

    // 2. Duyệt qua từng món ăn để kiểm tra và tính toán
    for (const item of danhSachMon) {
        const monGoc = await thucDonModel.layTheoId(item.monAnId);

        if (!monGoc || monGoc.trangThai === 'DaXoa') {
            const loi = new Error(`Món ăn ID ${item.monAnId} không tồn tại hoặc đã ngừng kinh doanh`);
            loi.status = 400;
            throw loi;
        }

        // Kiểm tra món đã hết hàng
        if (monGoc.trangThai === 'TamHet') {
            danhSachMonHetHang.push({
                monAnId: monGoc.id,
                tenMon: monGoc.tenMon
            });
            continue;
        }

        const donGiaGoc = Number(monGoc.giaBan);
        let tienTuyChon = 0;
        const chiTietTuyChonHopLe = [];

        // 3. Tính tiền tùy chọn (Size, Topping) dựa trên CSDL chuẩn của Server
        if (Array.isArray(item.tuyChonChon) && item.tuyChonChon.length > 0 && Array.isArray(monGoc.tuyChon)) {
            for (const tcDaChon of item.tuyChonChon) {
                const nhomGoc = monGoc.tuyChon.find(n => n.tenNhom === tcDaChon.tenNhom);
                if (nhomGoc && Array.isArray(nhomGoc.danhSach)) {
                    const luaChonGoc = nhomGoc.danhSach.find(l => l.ten === tcDaChon.ten);
                    if (luaChonGoc) {
                        const giaThem = Number(luaChonGoc.giaThem) || 0;
                        tienTuyChon += giaThem;
                        chiTietTuyChonHopLe.push({
                            tenNhom: nhomGoc.tenNhom,
                            ten: luaChonGoc.ten,
                            giaThem
                        });
                    }
                }
            }
        }

        const donGiaTong = donGiaGoc + tienTuyChon;
        const soLuong = Number(item.soLuong);
        const thanhTien = donGiaTong * soLuong;

        tongSoLuongMon += soLuong;
        tongTienTamTinh += thanhTien;

        danhSachHopLe.push({
            monAnId: monGoc.id,
            tenMon: monGoc.tenMon,
            hinhAnh: monGoc.hinhAnh,
            donViTinh: monGoc.donViTinh,
            donGiaGoc,
            tienTuyChon,
            donGiaTong,
            soLuong,
            thanhTien,
            tuyChonChon: chiTietTuyChonHopLe,
            ghiChu: item.ghiChu ? item.ghiChu.trim() : ''
        });
    }

    // Nếu có món đã hết hàng, trả về cảnh báo chi tiết
    if (danhSachMonHetHang.length > 0) {
        const danhSachTen = danhSachMonHetHang.map(m => `"${m.tenMon}"`).join(', ');
        const loi = new Error(`Món ${danhSachTen} hiện đã hết nguyên liệu. Vui lòng xóa khỏi giỏ để tiếp tục.`);
        loi.status = 400;
        loi.duLieuLoi = { danhSachMonHetHang };
        throw loi;
    }

    return {
        banId: ban.id,
        tenBan: ban.tenBan,
        danhSachHopLe,
        tongSoLuongMon,
        tongTienTamTinh
    };
}

module.exports = {
    kiemTraVaTinhTienGioHang
};
