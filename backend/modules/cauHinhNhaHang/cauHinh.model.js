let cauHinhNhaHang = {
    ten: 'Nhà Hàng Quán Mộc',
    chiNhanh: 'Chi nhánh 1 (Quận 1)',
    diaChi: '123 Đường Ẩm Thực, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    hotline: '028 1234 5678',
    email: 'lienhe@quanmoc.com',
    wifiTen: 'QuanMoc_KhachHang',
    wifiMatKhau: 'quanmoc2026',
    khauHieu: 'Hương vị truyền thống, đậm đà tình thân',
    gioHoatDong: '09:00 - 22:30',
    thueVat: 8,
    phiPhucVu: 0,
    nganHang: {
        maNganHang: 'VCB',
        tenNganHang: 'Vietcombank - Ngân hàng Ngoại Thương Việt Nam',
        soTaiKhoan: '9988776655',
        chuTaiKhoan: 'NHA HANG QUAN MOC',
        cuPhapChuyenKhoan: 'QUANMOC {SO_BAN}'
    }
};

async function layCauHinh() {
    let cauHinhChung = {};
    try {
        cauHinhChung = require('../../cauHinh/cauHinhChung');
    } catch {}
    return {
        ...cauHinhNhaHang,
        lanIp: cauHinhChung.lanIp || 'localhost',
        congBackend: cauHinhChung.congBackend || 3001,
        qrBaseUrl: cauHinhChung.qrBaseUrl || 'http://localhost:3001/e-menu'
    };
}

async function capNhatCauHinh(duLieuMoi) {
    cauHinhNhaHang = {
        ...cauHinhNhaHang,
        ...duLieuMoi,
        nganHang: {
            ...cauHinhNhaHang.nganHang,
            ...(duLieuMoi.nganHang || {})
        }
    };
    return { ...cauHinhNhaHang };
}

module.exports = {
    layCauHinh,
    capNhatCauHinh
};
