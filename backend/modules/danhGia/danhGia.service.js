/**
 * SERVICE ĐÁNH GIÁ & PHẢN HỒI (danhGia.service.js)
 * Nghiệp vụ xử lý gửi đánh giá, phản hồi quản lý và thống kê điểm sao (US-111 -> US-116)
 */
const danhGiaModel = require('./danhGia.model');
const hoaDonModel = require('../hoaDon/hoaDon.model');

async function guiDanhGia(duLieu) {
    // 1. Kiểm tra hóa đơn nếu có
    if (duLieu.hoaDonId) {
        const daDanhGia = await danhGiaModel.layTheoHoaDonId(duLieu.hoaDonId);
        if (daDanhGia) {
            const loi = new Error('Hóa đơn này đã được gửi đánh giá trước đó');
            loi.status = 400;
            throw loi;
        }

        const hoaDon = await hoaDonModel.layTheoId(duLieu.hoaDonId);
        if (hoaDon) {
            duLieu.maHoaDon = hoaDon.maHoaDon;
            duLieu.banId = hoaDon.banId;
            duLieu.maBan = hoaDon.maBan;
            duLieu.tenBan = hoaDon.tenBan;
        }
    }

    return await danhGiaModel.taoMoi(duLieu);
}

async function layDanhSach(boLoc = {}) {
    return await danhGiaModel.layTatCa(boLoc);
}

async function layChiTiet(id) {
    const dg = await danhGiaModel.layTheoId(id);
    if (!dg) {
        const loi = new Error('Không tìm thấy đánh giá');
        loi.status = 404;
        throw loi;
    }
    return dg;
}

async function phanHoiDanhGia(id, { phanHoiCuaQuanLy, nguoiPhanHoiId, tenNguoiPhanHoi }) {
    if (!phanHoiCuaQuanLy || !phanHoiCuaQuanLy.trim()) {
        const loi = new Error('Nội dung phản hồi không được để trống');
        loi.status = 400;
        throw loi;
    }

    const dg = await layChiTiet(id);
    return await danhGiaModel.capNhatPhanHoi(dg.id, {
        phanHoiCuaQuanLy,
        nguoiPhanHoiId,
        tenNguoiPhanHoi
    });
}

/**
 * US-116: Thống kê điểm đánh giá trung bình của nhà hàng và từng món ăn
 */
async function thongKeDiemDanhGia() {
    const danhSach = await danhGiaModel.layTatCa();
    const tongSoDanhGia = danhSach.length;

    if (tongSoDanhGia === 0) {
        return {
            tongSoDanhGia: 0,
            diemTrungBinhNhaHang: 5.0,
            phanBoSao: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
            soLuongCanXuLyGap: 0,
            thongKeMonAn: []
        };
    }

    let tongDiem = 0;
    const phanBoSao = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let soLuongCanXuLyGap = 0;

    // Bản đồ thống kê từng món
    const monAnMap = {};

    danhSach.forEach(dg => {
        tongDiem += dg.diemDichVu;
        phanBoSao[dg.diemDichVu] = (phanBoSao[dg.diemDichVu] || 0) + 1;
        if (dg.diemDichVu <= 2 || dg.trangThai === 'CanXuLyGap') {
            soLuongCanXuLyGap++;
        }

        if (Array.isArray(dg.danhGiaMonAn)) {
            dg.danhGiaMonAn.forEach(m => {
                if (!monAnMap[m.monId]) {
                    monAnMap[m.monId] = {
                        monId: m.monId,
                        tenMon: m.tenMon,
                        tongDiem: 0,
                        soLuotDanhGia: 0
                    };
                }
                monAnMap[m.monId].tongDiem += m.soSao;
                monAnMap[m.monId].soLuotDanhGia += 1;
            });
        }
    });

    const diemTrungBinhNhaHang = Number((tongDiem / tongSoDanhGia).toFixed(1));

    const thongKeMonAn = Object.values(monAnMap).map(m => ({
        monId: m.monId,
        tenMon: m.tenMon,
        soLuotDanhGia: m.soLuotDanhGia,
        diemTrungBinh: Number((m.tongDiem / m.soLuotDanhGia).toFixed(1))
    })).sort((a, b) => b.diemTrungBinh - a.diemTrungBinh);

    return {
        tongSoDanhGia,
        diemTrungBinhNhaHang,
        phanBoSao,
        soLuongCanXuLyGap,
        thongKeMonAn
    };
}

module.exports = {
    guiDanhGia,
    layDanhSach,
    layChiTiet,
    phanHoiDanhGia,
    thongKeDiemDanhGia
};
