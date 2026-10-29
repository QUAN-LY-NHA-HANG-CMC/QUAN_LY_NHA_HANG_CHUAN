/**
 * MODEL ĐÁNH GIÁ & PHẢN HỒI KHÁCH HÀNG (danhGia.model.js)
 * Lưu trữ điểm sao, nhận xét dịch vụ và đánh giá từng món ăn (US-111 -> US-116)
 */

let danhSachDanhGia = [
    {
        id: 1,
        banId: 2,
        maBan: 'B102',
        tenBan: 'Bàn 02',
        hoaDonId: 1,
        maHoaDon: 'HD-20261028-001',
        soDienThoaiKhach: '0912***456',
        tenKhachHang: 'Anh Nam',
        diemDichVu: 5, // 1 - 5 sao (US-111)
        nhanXetDichVu: 'Đồ ăn ra rất nhanh, nhân viên phục vụ nhiệt tình và chu đáo!',
        danhGiaMonAn: [ // (US-112)
            { monId: 2, tenMon: 'Lẩu nấm gà ta thảo mộc', soSao: 5, nhanXet: 'Nước dùng ngọt thanh, gà ta chắc thịt' },
            { monId: 4, tenMon: 'Trà đào cam sả', soSao: 5, nhanXet: 'Trà thơm, không bị ngọt gắt' }
        ],
        phanHoiCuaQuanLy: 'Quán Mộc chân thành cảm ơn Anh Nam đã ủng hộ ạ! Hẹn gặp lại anh sớm.', // (US-115)
        nguoiPhanHoiId: 1,
        tenNguoiPhanHoi: 'Nguyễn Sỹ Minh (Quản lý)',
        thoiGianPhanHoi: new Date(Date.now() - 30 * 60 * 1000),
        trangThai: 'DaXuLy', // 'ChoXuLy', 'DaXuLy', 'CanXuLyGap'
        thoiGianTao: new Date(Date.now() - 60 * 60 * 1000)
    },
    {
        id: 2,
        banId: 1,
        maBan: 'B101',
        tenBan: 'Bàn 01',
        hoaDonId: 2,
        maHoaDon: 'HD-20261028-002',
        soDienThoaiKhach: '0988***112',
        tenKhachHang: 'Chị Mai',
        diemDichVu: 2, // Đánh giá tiêu cực cần xử lý gấp (US-114)
        nhanXetDichVu: 'Hôm nay quán đông, điều hòa tầng 1 hơi nóng, mong quán khắc phục sớm.',
        danhGiaMonAn: [
            { monId: 1, tenMon: 'Bò nướng tảng sốt tiêu đen', soSao: 4, nhanXet: 'Thịt bò ngon' },
            { monId: 5, tenMon: 'Khoai tây chiên lắc phô mai', soSao: 3, nhanXet: 'Hơi nguội' }
        ],
        phanHoiCuaQuanLy: '',
        nguoiPhanHoiId: null,
        tenNguoiPhanHoi: '',
        thoiGianPhanHoi: null,
        trangThai: 'CanXuLyGap',
        thoiGianTao: new Date(Date.now() - 20 * 60 * 1000)
    }
];

let tuTangId = 3;

async function layTatCa({ soSao, trangThai, tuNgay, denNgay, canXuLyGap } = {}) {
    let ketQua = [...danhSachDanhGia];

    if (soSao) {
        ketQua = ketQua.filter(dg => dg.diemDichVu === Number(soSao));
    }

    if (trangThai) {
        ketQua = ketQua.filter(dg => dg.trangThai === trangThai);
    }

    if (canXuLyGap === 'true' || canXuLyGap === true) {
        ketQua = ketQua.filter(dg => dg.diemDichVu <= 2 || dg.trangThai === 'CanXuLyGap');
    }

    if (tuNgay) {
        const tu = new Date(tuNgay);
        ketQua = ketQua.filter(dg => new Date(dg.thoiGianTao) >= tu);
    }

    if (denNgay) {
        const den = new Date(denNgay);
        ketQua = ketQua.filter(dg => new Date(dg.thoiGianTao) <= den);
    }

    return ketQua.sort((a, b) => b.thoiGianTao - a.thoiGianTao);
}

async function layTheoId(id) {
    return danhSachDanhGia.find(dg => dg.id === Number(id)) || null;
}

async function layTheoHoaDonId(hoaDonId) {
    return danhSachDanhGia.find(dg => dg.hoaDonId === Number(hoaDonId)) || null;
}

async function taoMoi(duLieu) {
    const diemSao = Math.max(1, Math.min(5, Number(duLieu.diemDichVu) || 5));
    const trangThai = (diemSao <= 2) ? 'CanXuLyGap' : 'ChoXuLy';

    const banGhi = {
        id: tuTangId++,
        banId: Number(duLieu.banId) || null,
        maBan: duLieu.maBan || '',
        tenBan: duLieu.tenBan || '',
        hoaDonId: Number(duLieu.hoaDonId) || null,
        maHoaDon: duLieu.maHoaDon || '',
        soDienThoaiKhach: duLieu.soDienThoaiKhach ? duLieu.soDienThoaiKhach.trim() : '',
        tenKhachHang: duLieu.tenKhachHang ? duLieu.tenKhachHang.trim() : 'Khách hàng',
        diemDichVu: diemSao,
        nhanXetDichVu: duLieu.nhanXetDichVu ? duLieu.nhanXetDichVu.trim() : '',
        danhGiaMonAn: Array.isArray(duLieu.danhGiaMonAn) ? duLieu.danhGiaMonAn.map(m => ({
            monId: Number(m.monId),
            tenMon: m.tenMon || '',
            soSao: Math.max(1, Math.min(5, Number(m.soSao) || 5)),
            nhanXet: m.nhanXet ? m.nhanXet.trim() : ''
        })) : [],
        phanHoiCuaQuanLy: '',
        nguoiPhanHoiId: null,
        tenNguoiPhanHoi: '',
        thoiGianPhanHoi: null,
        trangThai,
        thoiGianTao: new Date()
    };

    danhSachDanhGia.push(banGhi);
    return banGhi;
}

async function capNhatPhanHoi(id, { phanHoiCuaQuanLy, nguoiPhanHoiId, tenNguoiPhanHoi }) {
    const viTri = danhSachDanhGia.findIndex(dg => dg.id === Number(id));
    if (viTri === -1) return null;

    danhSachDanhGia[viTri] = {
        ...danhSachDanhGia[viTri],
        phanHoiCuaQuanLy: phanHoiCuaQuanLy ? phanHoiCuaQuanLy.trim() : danhSachDanhGia[viTri].phanHoiCuaQuanLy,
        nguoiPhanHoiId: nguoiPhanHoiId || danhSachDanhGia[viTri].nguoiPhanHoiId,
        tenNguoiPhanHoi: tenNguoiPhanHoi || danhSachDanhGia[viTri].tenNguoiPhanHoi,
        thoiGianPhanHoi: new Date(),
        trangThai: 'DaXuLy'
    };

    return danhSachDanhGia[viTri];
}

module.exports = {
    layTatCa,
    layTheoId,
    layTheoHoaDonId,
    taoMoi,
    capNhatPhanHoi
};
