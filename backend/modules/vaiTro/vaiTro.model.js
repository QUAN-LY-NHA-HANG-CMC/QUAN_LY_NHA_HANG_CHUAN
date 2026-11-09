const { docDuLieu, ghiDuLieu } = require('../../tienIch/luuTruDuLieu');

const duLieuVaiTroMacDinh = [
    {
        ma: 'QUAN_LY',
        ten: 'Quản lý / Chủ nhà hàng',
        moTa: 'Toàn quyền điều hành hệ thống, nhân sự, thực đơn và tài chính',
        danhSachQuyen: [
            'BAN_XEM', 'BAN_SUA', 'BAN_IN_QR',
            'MON_XEM', 'MON_SUA', 'MON_TRANG_THAI',
            'THU_NGAN_XEM', 'THU_NGAN_THANH_TOAN', 'THU_NGAN_IN_BILL',
            'BEP_XEM', 'BEP_CAP_NHAT',
            'NHAN_VIEN_XEM', 'NHAN_VIEN_SUA', 'PHAN_QUYEN_SUA',
            'CAU_HINH_XEM', 'CAU_HINH_SUA'
        ]
    },
    {
        ma: 'THU_NGAN',
        ten: 'Thu ngân',
        moTa: 'Theo dõi sơ đồ bàn, in bill tạm tính và xử lý thanh toán hóa đơn',
        danhSachQuyen: [
            'BAN_XEM', 'MON_XEM',
            'THU_NGAN_XEM', 'THU_NGAN_THANH_TOAN', 'THU_NGAN_IN_BILL'
        ]
    },
    {
        ma: 'BEP',
        ten: 'Đầu bếp (KDS)',
        moTa: 'Xem danh sách gọi món, điều phối món ăn và bật tắt hết món',
        danhSachQuyen: [
            'MON_XEM', 'MON_TRANG_THAI',
            'BEP_XEM', 'BEP_CAP_NHAT'
        ]
    },
    {
        ma: 'PHUC_VU',
        ten: 'Nhân viên phục vụ',
        moTa: 'Xem bàn ăn, hỗ trợ khách gọi món và gửi yêu cầu',
        danhSachQuyen: [
            'BAN_XEM', 'MON_XEM', 'THU_NGAN_XEM'
        ]
    }
];

let danhSachVaiTro = docDuLieu('vaiTro', duLieuVaiTroMacDinh);
if (!Array.isArray(danhSachVaiTro) || danhSachVaiTro.length === 0) {
    danhSachVaiTro = duLieuVaiTroMacDinh;
    ghiDuLieu('vaiTro', danhSachVaiTro);
}

function layDanhSach() {
    return [...danhSachVaiTro];
}

function layTheoMa(ma) {
    return danhSachVaiTro.find(v => v.ma.toUpperCase() === String(ma).toUpperCase());
}

function capNhatQuyen(ma, dsQuyen) {
    const vt = layTheoMa(ma);
    if (!vt) return null;
    vt.danhSachQuyen = Array.isArray(dsQuyen) ? dsQuyen : [];
    ghiDuLieu('vaiTro', danhSachVaiTro);
    return vt;
}

function dongBoDanhSach(dsMoi) {
    if (!Array.isArray(dsMoi) || dsMoi.length === 0) return danhSachVaiTro;
    danhSachVaiTro = dsMoi;
    ghiDuLieu('vaiTro', danhSachVaiTro);
    return danhSachVaiTro;
}

module.exports = {
    layDanhSach,
    layTheoMa,
    capNhatQuyen,
    dongBoDanhSach,
    duLieuVaiTroMacDinh
};
