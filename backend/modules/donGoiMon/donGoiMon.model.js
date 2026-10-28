/**
 * MODEL ĐƠN GỌI MÓN (donGoiMon.model.js)
 * Quản lý các lượt gọi món (Orders/Rounds) của từng bàn ăn trong phiên phục vụ
 */

let danhSachDonGoi = [
    {
        id: 1,
        maDon: 'ORD-20261028-001',
        banId: 1,
        maBan: 'B101',
        tenBan: 'Bàn 01',
        khuVucId: 1,
        tenKhuVuc: 'Tầng 1 - Trong nhà',
        luotGoi: 1,
        thoiGianTao: new Date(Date.now() - 35 * 60 * 1000), // 35 phút trước
        trangThai: 'DANG_XU_LY', // 'CHO_XU_LY', 'DANG_XU_LY', 'HOAN_THANH', 'DA_HUY'
        ghiChuDon: 'Khách ăn ít cay',
        danhSachMon: [
            {
                id: 101,
                monId: 1,
                tenMon: 'Bò nướng tảng sốt tiêu đen',
                size: 'Tiêu chuẩn',
                topping: 'Thêm khoai tây chiên (+20.000đ)',
                donGia: 189000,
                soLuong: 1,
                thanhTien: 209000,
                ghiChu: 'Chín vừa',
                trangThai: 'DA_LEN_MON' // 'CHO_XAC_NHAN', 'DANG_CHE_BIEN', 'DA_NAU_XONG', 'DA_LEN_MON', 'DA_HUY'
            },
            {
                id: 102,
                monId: 4,
                tenMon: 'Trà đào cam sả',
                size: 'Size L (+10.000đ)',
                topping: '',
                donGia: 39000,
                soLuong: 2,
                thanhTien: 98000,
                ghiChu: 'Ít đường nhiều đá',
                trangThai: 'DA_LEN_MON'
            }
        ],
        tongTienDon: 307000
    },
    {
        id: 2,
        maDon: 'ORD-20261028-002',
        banId: 1,
        maBan: 'B101',
        tenBan: 'Bàn 01',
        khuVucId: 1,
        tenKhuVuc: 'Tầng 1 - Trong nhà',
        luotGoi: 2,
        thoiGianTao: new Date(Date.now() - 15 * 60 * 1000), // 15 phút trước
        trangThai: 'DANG_XU_LY',
        ghiChuDon: 'Gọi thêm',
        danhSachMon: [
            {
                id: 103,
                monId: 5,
                tenMon: 'Khoai tây chiên lắc phô mai',
                size: 'Tiêu chuẩn',
                topping: '',
                donGia: 45000,
                soLuong: 1,
                thanhTien: 45000,
                ghiChu: 'Chiên giòn',
                trangThai: 'DA_NAU_XONG'
            }
        ],
        tongTienDon: 45000
    }
];

let tuTangId = 3;
let tuTangItemId = 104;

async function layTatCa({ banId, trangThai } = {}) {
    let ketQua = [...danhSachDonGoi];
    if (banId) {
        ketQua = ketQua.filter(d => Number(d.banId) === Number(banId));
    }
    if (trangThai) {
        ketQua = ketQua.filter(d => d.trangThai === trangThai);
    }
    return ketQua.sort((a, b) => b.id - a.id);
}

async function layTheoId(id) {
    return danhSachDonGoi.find(d => d.id === Number(id)) || null;
}

async function layDonCuaBan(banId) {
    return danhSachDonGoi.filter(d => Number(d.banId) === Number(banId) && d.trangThai !== 'DA_HUY');
}

async function taoDon(duLieu) {
    const banId = Number(duLieu.banId);
    const donHienCo = await layDonCuaBan(banId);
    const luotGoi = donHienCo.length + 1;

    const ngayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const maDon = `ORD-${ngayStr}-${String(tuTangId).padStart(3, '0')}`;

    let tongTienDon = 0;
    const danhSachMon = (duLieu.danhSachMon || []).map(m => {
        const donGia = Number(m.donGia) || 0;
        const soLuong = Number(m.soLuong) || 1;
        const thanhTien = Number(m.thanhTien) || (donGia * soLuong);
        tongTienDon += thanhTien;

        return {
            id: tuTangItemId++,
            monId: Number(m.monId || m.id),
            tenMon: m.tenMon,
            size: m.size || 'Tiêu chuẩn',
            topping: m.topping || '',
            donGia,
            soLuong,
            thanhTien,
            ghiChu: m.ghiChu || '',
            trangThai: m.trangThai || 'CHO_XAC_NHAN'
        };
    });

    const donMoi = {
        id: tuTangId++,
        maDon,
        banId,
        maBan: duLieu.maBan || `Bàn ${banId}`,
        tenBan: duLieu.tenBan || `Bàn ${banId}`,
        khuVucId: duLieu.khuVucId || 1,
        tenKhuVuc: duLieu.tenKhuVuc || '',
        luotGoi,
        thoiGianTao: new Date(),
        trangThai: 'CHO_XU_LY',
        ghiChuDon: duLieu.ghiChuDon || '',
        danhSachMon,
        tongTienDon
    };

    danhSachDonGoi.push(donMoi);
    return donMoi;
}

async function capNhatTrangThaiMon(itemId, trangThaiMoi) {
    for (const don of danhSachDonGoi) {
        const mon = don.danhSachMon.find(m => m.id === Number(itemId));
        if (mon) {
            mon.trangThai = trangThaiMoi;
            return { don, mon };
        }
    }
    return null;
}

async function huyMon(itemId, lyDo = '') {
    for (const don of danhSachDonGoi) {
        const mon = don.danhSachMon.find(m => m.id === Number(itemId));
        if (mon) {
            if (mon.trangThai !== 'CHO_XAC_NHAN') {
                const loi = new Error('Không thể hủy món vì bếp đã bắt đầu chế biến hoặc đã lên món');
                loi.status = 400;
                throw loi;
            }
            mon.trangThai = 'DA_HUY';
            mon.lyDoHuy = lyDo;
            // Tính lại tổng tiền của đơn
            don.tongTienDon = don.danhSachMon
                .filter(m => m.trangThai !== 'DA_HUY')
                .reduce((tong, m) => tong + m.thanhTien, 0);

            return { don, mon };
        }
    }
    return null;
}

async function dongDonCuaBan(banId) {
    const cacDon = danhSachDonGoi.filter(d => Number(d.banId) === Number(banId));
    cacDon.forEach(d => {
        d.trangThai = 'HOAN_THANH';
        d.thoiGianHoanThanh = new Date();
    });
    return cacDon.length;
}

module.exports = {
    layTatCa,
    layTheoId,
    layDonCuaBan,
    taoDon,
    capNhatTrangThaiMon,
    huyMon,
    dongDonCuaBan
};
