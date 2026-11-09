/**
 * MODEL ĐƠN GỌI MÓN (donGoiMon.model.js)
 * Quản lý các lượt gọi món (Orders/Rounds) của từng bàn ăn trong phiên phục vụ
 */

const { docDuLieu, ghiDuLieu } = require('../../tienIch/luuTruDuLieu');

const duLieuDonGoiMacDinh = [];

let danhSachDonGoi = docDuLieu('donGoiMon', duLieuDonGoiMacDinh);

function tinhTuTangId() {
    return Math.max(...danhSachDonGoi.map(d => d.id || 0), 0) + 1;
}

function tinhTuTangItemId() {
    let maxItemId = 100;
    danhSachDonGoi.forEach(d => {
        (d.danhSachMon || []).forEach(m => {
            if (m.id && m.id > maxItemId) maxItemId = m.id;
        });
    });
    return maxItemId + 1;
}

let tuTangId = tinhTuTangId();
let tuTangItemId = tinhTuTangItemId();

function luu() {
    ghiDuLieu('donGoiMon', danhSachDonGoi);
}

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
    return danhSachDonGoi.filter(d => Number(d.banId) === Number(banId) && d.trangThai !== 'DA_HUY' && d.trangThai !== 'HOAN_THANH' && d.trangThai !== 'DA_THANH_TOAN');
}

async function taoDon(duLieu) {
    const banId = Number(duLieu.banId);
    const donHienCo = await layDonCuaBan(banId);
    const luotGoi = donHienCo.length + 1;

    tuTangId = Math.max(tuTangId, tinhTuTangId());
    tuTangItemId = Math.max(tuTangItemId, tinhTuTangItemId());

    const ngayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const maDon = `ORD-${ngayStr}-${String(tuTangId).padStart(3, '0')}`;

    const nowIso = new Date().toISOString();
    let tongTienDon = 0;
    const danhSachMon = (duLieu.danhSachMon || []).map(m => {
        const donGia = Number(m.donGia) || 0;
        const soLuong = Number(m.soLuong) || 1;
        const thanhTien = Number(m.thanhTien) || (donGia * soLuong);
        tongTienDon += thanhTien;

        let size = m.size || 'Tiêu chuẩn';
        let topping = m.topping || '';
        if (Array.isArray(m.tuyChonChon)) {
            const sizeOpt = m.tuyChonChon.find(tc => tc.tenNhom?.toLowerCase().includes('size') || tc.tenNhom?.toLowerCase().includes('kích cỡ'));
            if (sizeOpt) size = sizeOpt.ten;
            const toppingOpts = m.tuyChonChon.filter(tc => !tc.tenNhom?.toLowerCase().includes('size') && !tc.tenNhom?.toLowerCase().includes('kích cỡ'));
            if (toppingOpts.length > 0) topping = toppingOpts.map(t => t.ten).join(', ');
        }

        return {
            id: tuTangItemId++,
            monId: Number(m.monId || m.monAnId || m.id || 0),
            tenMon: m.tenMon,
            size,
            topping,
            donGia,
            soLuong,
            thanhTien,
            ghiChu: m.ghiChu || '',
            trangThai: m.trangThai || 'CHO_XAC_NHAN',
            thoiGianTao: nowIso,
            thoiGianCapNhat: nowIso
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
        thoiGianTao: nowIso,
        thoiGianDat: nowIso,
        thoiGianGoiMoiNhat: nowIso,
        trangThai: 'CHO_XU_LY',
        ghiChuDon: duLieu.ghiChuDon || duLieu.ghiChuChung || '',
        danhSachMon,
        tongTien: tongTienDon,
        tongTienDon
    };

    danhSachDonGoi.push(donMoi);
    luu();
    return donMoi;
}

async function capNhatTrangThaiMon(itemId, trangThaiMoi) {
    const numId = Number(itemId);
    for (const don of danhSachDonGoi) {
        const mon = (don.danhSachMon || []).find(m => (m.id && Number(m.id) === numId) || String(m.id) === String(itemId));
        if (mon) {
            mon.trangThai = trangThaiMoi;
            mon.thoiGianCapNhat = new Date();
            luu();
            return { don, mon };
        }
    }
    return null;
}

async function huyMon(itemId, lyDo = '') {
    const numId = Number(itemId);
    for (const don of danhSachDonGoi) {
        const mon = (don.danhSachMon || []).find(m => (m.id && Number(m.id) === numId) || String(m.id) === String(itemId));
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

            luu();
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
    luu();
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
