const { docDuLieu, ghiDuLieu } = require('../../tienIch/luuTruDuLieu');

let danhSachYeuCau = docDuLieu('yeuCauHoTro', []);
if (!Array.isArray(danhSachYeuCau)) {
    danhSachYeuCau = [];
}

let tuTangId = Math.max(...danhSachYeuCau.map(y => Number(y.id) || 0), 0) + 1;

function luu() {
    ghiDuLieu('yeuCauHoTro', danhSachYeuCau);
}

const TEN_LY_DO_MAP = {
    THEM_BAT_DUA: '🥢 Xin thêm bát, đĩa, đũa, thìa',
    THEM_KHAN_GIAY: '🧻 Xin thêm khăn giấy, tăm tiệt trùng',
    THEM_DA_LANH: '🧊 Xin thêm đá lạnh / nước lọc',
    THEM_GIA_VI: '🌶️ Xin thêm nước chấm, ớt, chanh, tỏi',
    DON_BAN: '🧹 Yêu cầu dọn bàn / lau bàn sạch',
    GAP_NHAN_VIEN: '🙋 Khách cần nhân viên hỗ trợ trực tiếp'
};

function chuanHoaTrangThai(tt) {
    const map = {
        ChoXuLy: 'CHO_TIEP_NHAN',
        CHO_TIEP_NHAN: 'CHO_TIEP_NHAN',
        DangXuLy: 'DA_TIEP_NHAN',
        DA_TIEP_NHAN: 'DA_TIEP_NHAN',
        DaHoanThanh: 'DA_XU_LY',
        DA_XU_LY: 'DA_XU_LY',
        HuyBo: 'DA_XU_LY'
    };
    return map[tt] || 'CHO_TIEP_NHAN';
}

async function taoMoi(duLieu) {
    const nowIso = new Date().toISOString();
    const laThanhToan = duLieu.loaiYeuCau === 'YeuCauThanhToan' || duLieu.loaiYeuCau === 'THANH_TOAN';
    const ptChuan = (duLieu.phuongThucThanhToan === 'ChuyenKhoan' || duLieu.phuongThuc === 'CHUYEN_KHOAN')
        ? 'CHUYEN_KHOAN'
        : (laThanhToan ? 'TIEN_MAT' : null);
    const tenPt = ptChuan === 'CHUYEN_KHOAN' ? 'Chuyển khoản VietQR' : 'Tiền mặt';

    const tenBanHienThi = duLieu.tenBan || duLieu.soBan || `Bàn ${duLieu.banId}`;
    const lyDoText = duLieu.lyDo ? String(duLieu.lyDo).trim() : '';
    const ghiChuText = duLieu.ghiChu ? String(duLieu.ghiChu).trim() : '';
    const chiTietText = duLieu.chiTiet ? String(duLieu.chiTiet).trim() : '';

    let tenYeuCau = duLieu.tenYeuCau;
    if (!tenYeuCau) {
        if (laThanhToan) {
            tenYeuCau = `💳 Yêu cầu thanh toán (${tenPt})`;
        } else if (TEN_LY_DO_MAP[duLieu.loaiYeuCau]) {
            tenYeuCau = TEN_LY_DO_MAP[duLieu.loaiYeuCau];
        } else if (lyDoText) {
            tenYeuCau = `🙋 ${lyDoText}`;
        } else {
            tenYeuCau = '🙋 Khách cần nhân viên hỗ trợ trực tiếp';
        }
    }

    const tongTamTinh = Number(duLieu.tongTamTinh || 0);
    const chiTietChuan = chiTietText || ghiChuText || (
        laThanhToan
            ? `Khách chọn thanh toán bằng ${tenPt}.${tongTamTinh > 0 ? ` Tạm tính: ${tongTamTinh.toLocaleString('vi-VN')}đ` : ''}`
            : (lyDoText || 'Khách gửi yêu cầu hỗ trợ tại bàn')
    );

    tuTangId = Math.max(...danhSachYeuCau.map(y => Number(y.id) || 0), tuTangId - 1, 0) + 1;

    const banGhiMoi = {
        id: tuTangId++,
        banId: Number(duLieu.banId),
        maBan: duLieu.maBan || `B${duLieu.banId}`,
        tenBan: tenBanHienThi,
        soBan: tenBanHienThi,
        loaiYeuCau: laThanhToan ? 'THANH_TOAN' : (duLieu.loaiYeuCau || 'GoiNhanVien'),
        loaiGoc: duLieu.loaiYeuCau || 'GoiNhanVien',
        tenYeuCau,
        lyDo: lyDoText || tenYeuCau,
        phuongThuc: ptChuan,
        phuongThucThanhToan: ptChuan === 'CHUYEN_KHOAN' ? 'ChuyenKhoan' : (ptChuan === 'TIEN_MAT' ? 'TienMat' : null),
        tongTamTinh,
        ghiChu: ghiChuText,
        chiTiet: chiTietChuan,
        trangThai: 'CHO_TIEP_NHAN',
        nguoiTiepNhanId: null,
        nguoiTiepNhan: null,
        thoiGian: nowIso,
        thoiGianTao: nowIso,
        thoiGianCapNhat: nowIso
    };

    danhSachYeuCau.unshift(banGhiMoi);
    luu();
    return banGhiMoi;
}

async function layTatCa({ trangThai, banId } = {}) {
    let ketQua = [...danhSachYeuCau];

    if (trangThai) {
        const ttChuan = chuanHoaTrangThai(trangThai);
        ketQua = ketQua.filter(yc => chuanHoaTrangThai(yc.trangThai) === ttChuan || yc.trangThai === trangThai);
    }

    if (banId !== undefined && banId !== null && banId !== '') {
        ketQua = ketQua.filter(yc => Number(yc.banId) === Number(banId));
    }

    return ketQua.sort((a, b) => new Date(b.thoiGianTao || b.thoiGian || 0) - new Date(a.thoiGianTao || a.thoiGian || 0));
}

async function layTheoId(id) {
    return danhSachYeuCau.find(yc => Number(yc.id) === Number(id)) || null;
}

async function capNhatTrangThai(id, trangThaiMoi, nguoiXuLyId = null, nguoiTiepNhan = null) {
    const viTri = danhSachYeuCau.findIndex(yc => Number(yc.id) === Number(id));
    if (viTri === -1) return null;

    const nowIso = new Date().toISOString();
    const ttChuan = chuanHoaTrangThai(trangThaiMoi);
    danhSachYeuCau[viTri] = {
        ...danhSachYeuCau[viTri],
        trangThai: ttChuan,
        nguoiTiepNhanId: nguoiXuLyId || danhSachYeuCau[viTri].nguoiTiepNhanId,
        nguoiTiepNhan: nguoiTiepNhan || danhSachYeuCau[viTri].nguoiTiepNhan || (ttChuan === 'DA_TIEP_NHAN' ? 'Nhân viên phục vụ' : null),
        thoiGianTiepNhan: ttChuan === 'DA_TIEP_NHAN' ? nowIso : danhSachYeuCau[viTri].thoiGianTiepNhan,
        thoiGianHoanTat: ttChuan === 'DA_XU_LY' ? nowIso : danhSachYeuCau[viTri].thoiGianHoanTat,
        thoiGianCapNhat: nowIso
    };
    luu();
    return danhSachYeuCau[viTri];
}

async function xoaTatCa() {
    danhSachYeuCau = [];
    tuTangId = 1;
    luu();
}

module.exports = {
    taoMoi,
    layTatCa,
    layTheoId,
    capNhatTrangThai,
    xoaTatCa,
    chuanHoaTrangThai
};
