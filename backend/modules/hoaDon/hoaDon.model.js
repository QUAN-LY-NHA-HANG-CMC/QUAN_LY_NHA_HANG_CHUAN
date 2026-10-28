/**
 * MODEL HÓA ĐƠN THANH TOÁN (hoaDon.model.js)
 * Lưu trữ hóa đơn, chi tiết món ăn, phụ phí, giảm giá và thuế VAT (US-101 -> US-104, US-108)
 */

let danhSachHoaDon = [
    {
        id: 1,
        maHoaDon: 'HD-20261028-001',
        banId: 2,
        maBan: 'B102',
        tenBan: 'Bàn 02',
        khuVucId: 1,
        tenKhuVuc: 'Tầng 1 - Trong nhà',
        thoiGianVao: new Date(Date.now() - 60 * 60 * 1000),
        thoiGianTao: new Date(Date.now() - 10 * 60 * 1000),
        thoiGianThanhToan: new Date(Date.now() - 5 * 60 * 1000),
        danhSachMon: [
            {
                id: 1,
                monId: 2,
                tenMon: 'Lẩu nấm gà ta thảo mộc',
                size: 'Nồi lớn (4-6 người)',
                topping: 'Thêm đĩa nấm tươi (+40.000đ)',
                donGia: 350000,
                soLuong: 1,
                thanhTien: 390000,
                ghiChu: 'Nước dùng thanh',
                luotGoi: 1
            },
            {
                id: 2,
                monId: 4,
                tenMon: 'Trà đào cam sả',
                size: 'Size L (+10.000đ)',
                topping: '',
                donGia: 39000,
                soLuong: 4,
                thanhTien: 196000,
                ghiChu: 'Ít đường',
                luotGoi: 1
            }
        ],
        tongTienMon: 586000,
        maKhuyenMai: 'CHAOMUNG50K',
        giamGiaKhuyenMai: 50000,
        chietKhauTrucTiep: 0,
        lyDoChietKhau: '',
        phuPhi: 0,
        lyDoPhuPhi: '',
        tongGiamGia: 50000,
        tienTruocThue: 536000,
        thueVatPhanTram: 8,
        tienThueVat: 42880,
        tongTienThanhToan: 578880,
        trangThai: 'DaThanhToan', // 'ChoThanhToan', 'DaThanhToan', 'DaHuy'
        phuongThucThanhToan: 'CHUYEN_KHOAN_VIETQR',
        thuNganId: 2,
        tenThuNgan: 'Trần Thị Thu Ngân',
        hoaDonGocId: null,
        ngayTao: new Date(Date.now() - 10 * 60 * 1000),
        ngayCapNhat: new Date(Date.now() - 5 * 60 * 1000)
    }
];

let tuTangId = 2;

async function layTatCa({ banId, trangThai, tuNgay, denNgay } = {}) {
    let ketQua = [...danhSachHoaDon];

    if (banId) {
        ketQua = ketQua.filter(hd => Number(hd.banId) === Number(banId));
    }

    if (trangThai) {
        ketQua = ketQua.filter(hd => hd.trangThai === trangThai);
    }

    if (tuNgay) {
        const tu = new Date(tuNgay);
        ketQua = ketQua.filter(hd => new Date(hd.thoiGianTao) >= tu);
    }

    if (denNgay) {
        const den = new Date(denNgay);
        ketQua = ketQua.filter(hd => new Date(hd.thoiGianTao) <= den);
    }

    return ketQua.sort((a, b) => b.id - a.id);
}

async function layTheoId(id) {
    return danhSachHoaDon.find(hd => hd.id === Number(id)) || null;
}

async function layTheoMaHoaDon(maHoaDon) {
    if (!maHoaDon) return null;
    return danhSachHoaDon.find(hd => hd.maHoaDon.toUpperCase() === maHoaDon.trim().toUpperCase()) || null;
}

async function layHoaDonChoCuaBan(banId) {
    return danhSachHoaDon.find(hd => Number(hd.banId) === Number(banId) && hd.trangThai === 'ChoThanhToan') || null;
}

async function taoMoi(duLieu) {
    const ngayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const maHoaDon = duLieu.maHoaDon || `HD-${ngayStr}-${String(tuTangId).padStart(3, '0')}`;

    const banGhi = {
        id: tuTangId++,
        maHoaDon,
        banId: Number(duLieu.banId),
        maBan: duLieu.maBan,
        tenBan: duLieu.tenBan,
        khuVucId: Number(duLieu.khuVucId || 1),
        tenKhuVuc: duLieu.tenKhuVuc || '',
        thoiGianVao: duLieu.thoiGianVao ? new Date(duLieu.thoiGianVao) : new Date(),
        thoiGianTao: new Date(),
        thoiGianThanhToan: null,
        danhSachMon: duLieu.danhSachMon || [],
        tongTienMon: Number(duLieu.tongTienMon) || 0,
        maKhuyenMai: duLieu.maKhuyenMai || null,
        giamGiaKhuyenMai: Number(duLieu.giamGiaKhuyenMai) || 0,
        chietKhauTrucTiep: Number(duLieu.chietKhauTrucTiep) || 0,
        lyDoChietKhau: duLieu.lyDoChietKhau || '',
        phuPhi: Number(duLieu.phuPhi) || 0,
        lyDoPhuPhi: duLieu.lyDoPhuPhi || '',
        tongGiamGia: Number(duLieu.tongGiamGia) || 0,
        tienTruocThue: Number(duLieu.tienTruocThue) || 0,
        thueVatPhanTram: Number(duLieu.thueVatPhanTram) || 8,
        tienThueVat: Number(duLieu.tienThueVat) || 0,
        tongTienThanhToan: Number(duLieu.tongTienThanhToan) || 0,
        trangThai: duLieu.trangThai || 'ChoThanhToan',
        phuongThucThanhToan: null,
        thuNganId: duLieu.thuNganId || null,
        tenThuNgan: duLieu.tenThuNgan || '',
        hoaDonGocId: duLieu.hoaDonGocId || null,
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    };

    danhSachHoaDon.push(banGhi);
    return banGhi;
}

async function capNhat(id, duLieu) {
    const viTri = danhSachHoaDon.findIndex(hd => hd.id === Number(id));
    if (viTri === -1) return null;

    danhSachHoaDon[viTri] = {
        ...danhSachHoaDon[viTri],
        ...duLieu,
        ngayCapNhat: new Date()
    };

    return danhSachHoaDon[viTri];
}

async function xoa(id) {
    const viTri = danhSachHoaDon.findIndex(hd => hd.id === Number(id));
    if (viTri === -1) return false;
    danhSachHoaDon[viTri].trangThai = 'DaHuy';
    danhSachHoaDon[viTri].ngayCapNhat = new Date();
    return true;
}

module.exports = {
    layTatCa,
    layTheoId,
    layTheoMaHoaDon,
    layHoaDonChoCuaBan,
    taoMoi,
    capNhat,
    xoa
};
