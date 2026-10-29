/**
 * MODEL CA LÀM VIỆC & PHIÊN CA THU NGÂN (caLamViec.model.js)
 * Quản lý định nghĩa ca, mở ca, ghi nhận thu/chi và biên bản kết ca (US-117 -> US-122)
 */

// Danh sách cấu hình các ca làm việc mẫu trong ngày (US-117)
let danhSachCaMau = [
    { id: 1, maCa: 'CA_SANG', tenCa: 'Ca Sáng', gioBatDau: '06:00', gioKetThuc: '14:00', moTa: 'Ca phục vụ bữa sáng và bữa trưa' },
    { id: 2, maCa: 'CA_CHIEU', tenCa: 'Ca Chiều', gioBatDau: '14:00', gioKetThuc: '22:00', moTa: 'Ca phục vụ bữa tối và khung giờ cao điểm' },
    { id: 3, maCa: 'CA_TOI', tenCa: 'Ca Tối/Đêm', gioBatDau: '22:00', gioKetThuc: '06:00', moTa: 'Ca phục vụ khuya và dọn dẹp vệ sinh' }
];

// Lịch sử các phiên ca làm việc thực tế của thu ngân (US-118 -> US-122)
let danhSachPhienCa = [
    {
        id: 1,
        maPhienCa: 'SHIFT-20261028-001',
        caId: 1,
        tenCa: 'Ca Sáng',
        thuNganId: 2,
        tenThuNgan: 'Trần Thị Thu Ngân',
        thoiGianMoCa: new Date('2026-10-28T06:00:00Z'),
        thoiGianDongCa: new Date('2026-10-28T14:00:00Z'),
        tienDauCa: 2000000, // 2 triệu tiền lẻ đầu ca (US-118)
        phieuThuChi: [ // (US-119)
            { id: 1, loai: 'CHI', soTien: 150000, lyDo: 'Mua thêm đá lạnh và túi đựng mang về', thoiGian: new Date('2026-10-28T09:30:00Z') },
            { id: 2, loai: 'THU', soTien: 200000, lyDo: 'Khách để lại tiền tip chung cho quỹ quán', thoiGian: new Date('2026-10-28T12:15:00Z') }
        ],
        doanhThuTienMat: 4500000,     // Tổng tiền mặt thu được từ hóa đơn (US-120)
        doanhThuChuyenKhoan: 7800000, // Tổng chuyển khoản VietQR trong ca
        tongTienMatThuThem: 200000,
        tongTienMatChiRa: 150000,
        tienMatLyThuyetTrongKet: 6550000, // 2tr + 4.5tr + 200k - 150k
        tienMatThucTeCuoiCa: 6550000,     // Thực tế đếm được cuối ca (US-121)
        chenhLech: 0,
        ghiChuKetCa: 'Bàn giao ca đầy đủ, két tiền khớp 100%',
        trangThai: 'DaDongCa', // 'DangHoatDong', 'DaDongCa'
        quanLyXacNhanId: 1,
        tenQuanLyXacNhan: 'Nguyễn Sỹ Minh'
    }
];

let tuTangPhienCaId = 2;
let tuTangPhieuId = 3;

async function layDanhSachCaMau() {
    return [...danhSachCaMau];
}

async function layTatCaPhienCa({ thuNganId, trangThai, tuNgay, denNgay } = {}) {
    let ketQua = [...danhSachPhienCa];

    if (thuNganId) {
        ketQua = ketQua.filter(pc => pc.thuNganId === Number(thuNganId));
    }

    if (trangThai) {
        ketQua = ketQua.filter(pc => pc.trangThai === trangThai);
    }

    if (tuNgay) {
        const tu = new Date(tuNgay);
        ketQua = ketQua.filter(pc => new Date(pc.thoiGianMoCa) >= tu);
    }

    if (denNgay) {
        const den = new Date(denNgay);
        ketQua = ketQua.filter(pc => new Date(pc.thoiGianMoCa) <= den);
    }

    return ketQua.sort((a, b) => b.id - a.id);
}

async function layPhienCaTheoId(id) {
    return danhSachPhienCa.find(pc => pc.id === Number(id)) || null;
}

async function layPhienCaDangMo(thuNganId = null) {
    if (thuNganId) {
        return danhSachPhienCa.find(pc => pc.thuNganId === Number(thuNganId) && pc.trangThai === 'DangHoatDong') || null;
    }
    return danhSachPhienCa.find(pc => pc.trangThai === 'DangHoatDong') || null;
}

async function taoPhienCaMoi(duLieu) {
    const ngayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const maPhienCa = `SHIFT-${ngayStr}-${String(tuTangPhienCaId).padStart(3, '0')}`;

    const banGhi = {
        id: tuTangPhienCaId++,
        maPhienCa,
        caId: Number(duLieu.caId) || 1,
        tenCa: duLieu.tenCa || 'Ca Sáng',
        thuNganId: Number(duLieu.thuNganId) || 1,
        tenThuNgan: duLieu.tenThuNgan || 'Thu ngân',
        thoiGianMoCa: new Date(),
        thoiGianDongCa: null,
        tienDauCa: Number(duLieu.tienDauCa) || 0,
        phieuThuChi: [],
        doanhThuTienMat: 0,
        doanhThuChuyenKhoan: 0,
        tongTienMatThuThem: 0,
        tongTienMatChiRa: 0,
        tienMatLyThuyetTrongKet: Number(duLieu.tienDauCa) || 0,
        tienMatThucTeCuoiCa: null,
        chenhLech: 0,
        ghiChuKetCa: '',
        trangThai: 'DangHoatDong',
        quanLyXacNhanId: null,
        tenQuanLyXacNhan: ''
    };

    danhSachPhienCa.push(banGhi);
    return banGhi;
}

async function themPhieuThuChi(phienCaId, { loai, soTien, lyDo }) {
    const phienCa = await layPhienCaTheoId(phienCaId);
    if (!phienCa) return null;

    const tien = Number(soTien) || 0;
    const phieu = {
        id: tuTangPhieuId++,
        loai: loai === 'THU' ? 'THU' : 'CHI',
        soTien: tien,
        lyDo: lyDo ? lyDo.trim() : '',
        thoiGian: new Date()
    };

    phienCa.phieuThuChi.push(phieu);

    if (phieu.loai === 'THU') {
        phienCa.tongTienMatThuThem += tien;
    } else {
        phienCa.tongTienMatChiRa += tien;
    }

    phienCa.tienMatLyThuyetTrongKet = phienCa.tienDauCa + phienCa.doanhThuTienMat + phienCa.tongTienMatThuThem - phienCa.tongTienMatChiRa;
    return phieu;
}

async function capNhatDoanhThuPhienCa(phienCaId, { tienMat = 0, chuyenKhoan = 0 }) {
    const phienCa = await layPhienCaTheoId(phienCaId);
    if (!phienCa) return null;

    phienCa.doanhThuTienMat += Number(tienMat) || 0;
    phienCa.doanhThuChuyenKhoan += Number(chuyenKhoan) || 0;
    phienCa.tienMatLyThuyetTrongKet = phienCa.tienDauCa + phienCa.doanhThuTienMat + phienCa.tongTienMatThuThem - phienCa.tongTienMatChiRa;

    return phienCa;
}

async function dongCa(phienCaId, { tienMatThucTeCuoiCa, ghiChuKetCa, quanLyId, tenQuanLy }) {
    const viTri = danhSachPhienCa.findIndex(pc => pc.id === Number(phienCaId));
    if (viTri === -1) return null;

    const pc = danhSachPhienCa[viTri];
    const thucTe = Number(tienMatThucTeCuoiCa) || 0;
    const chenhLech = thucTe - pc.tienMatLyThuyetTrongKet;

    danhSachPhienCa[viTri] = {
        ...pc,
        thoiGianDongCa: new Date(),
        tienMatThucTeCuoiCa: thucTe,
        chenhLech,
        ghiChuKetCa: ghiChuKetCa ? ghiChuKetCa.trim() : '',
        trangThai: 'DaDongCa',
        quanLyXacNhanId: quanLyId || null,
        tenQuanLyXacNhan: tenQuanLy || ''
    };

    return danhSachPhienCa[viTri];
}

module.exports = {
    layDanhSachCaMau,
    layTatCaPhienCa,
    layPhienCaTheoId,
    layPhienCaDangMo,
    taoPhienCaMoi,
    themPhieuThuChi,
    capNhatDoanhThuPhienCa,
    dongCa
};
