const qrcode = require('qrcode');

/**
 * CẤU HÌNH TÀI KHOẢN NGÂN HÀNG NHẬN THANH TOÁN CỦA NHÀ HÀNG (QUÁN MỘC)
 * Hỗ trợ tạo mã VietQR động chuẩn Napas 247
 */
const CAU_HINH_VIETQR_MAC_DINH = {
    nganHang: 'MBBank',        // Ngân hàng Quân Đội
    binNganHang: '970422',     // BIN MBBank theo chuẩn Napas
    soTaiKhoan: '0988889999',  // Số tài khoản nhà hàng
    tenChuTaiKhoan: 'NHA HANG QUAN MOC',
    chiNhanh: 'Hà Nội'
};

/**
 * Sinh mã thanh toán nhanh VietQR dạng QuickLink hình ảnh
 * @param {Object} param0 
 * @returns {String} URL ảnh VietQR
 */
function sinhUrlVietQrQuickLink({ soTien, noiDungChuyenKhoan, binNganHang, soTaiKhoan, tenChuTaiKhoan }) {
    const bin = binNganHang || CAU_HINH_VIETQR_MAC_DINH.binNganHang;
    const stk = soTaiKhoan || CAU_HINH_VIETQR_MAC_DINH.soTaiKhoan;
    const ten = encodeURIComponent(tenChuTaiKhoan || CAU_HINH_VIETQR_MAC_DINH.tenChuTaiKhoan);
    const tien = Math.round(Number(soTien) || 0);
    const noiDung = encodeURIComponent(noiDungChuyenKhoan || 'THANH TOAN HOA DON');

    return `https://img.vietqr.io/image/${bin}-${stk}-compact2.png?amount=${tien}&addInfo=${noiDung}&accountName=${ten}`;
}

/**
 * Sinh mã QR hình ảnh dạng Base64 Data URL (offline không phụ thuộc mạng ngoài)
 * Sử dụng thư viện qrcode nội bộ
 * @param {Object} param0
 * @returns {Promise<String>} data:image/png;base64,...
 */
async function sinhAnhQrDataUrl({ soTien, noiDungChuyenKhoan, binNganHang, soTaiKhoan, tenChuTaiKhoan }) {
    const urlQuickLink = sinhUrlVietQrQuickLink({
        soTien,
        noiDungChuyenKhoan,
        binNganHang,
        soTaiKhoan,
        tenChuTaiKhoan
    });

    try {
        // Tạo DataURL mã QR chứa đường dẫn thanh toán hoặc thông tin chuyển khoản
        const qrDataUrl = await qrcode.toDataURL(urlQuickLink, {
            errorCorrectionLevel: 'M',
            margin: 2,
            width: 320,
            color: {
                dark: '#1e3a8a', // Xanh navy thương hiệu chuyên nghiệp
                light: '#ffffff'
            }
        });
        return qrDataUrl;
    } catch (e) {
        // Fallback đơn giản nếu có lỗi render
        return await qrcode.toDataURL(`VIETQR|${soTaiKhoan}|${soTien}|${noiDungChuyenKhoan}`);
    }
}

module.exports = {
    CAU_HINH_VIETQR_MAC_DINH,
    sinhUrlVietQrQuickLink,
    sinhAnhQrDataUrl
};
