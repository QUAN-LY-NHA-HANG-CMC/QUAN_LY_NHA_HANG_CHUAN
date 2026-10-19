/**
 * TIỆN ÍCH SINH MÃ QR PHÍA FRONTEND (taoQrClient.js)
 * Phục vụ US-028 & US-029 (Tự động sinh URL & mã QR định danh bàn ăn, xem trước và in ấn)
 * Thiết kế cho: Quân (Frontend)
 */

const BoSinhQr = {
    /**
     * Sinh URL hình ảnh mã QR định danh bàn ăn
     * Hỗ trợ API QuickChart chất lượng cao, có thể tải về dạng PNG
     * @param {string} noiDungUrl - Đường dẫn E-Menu gắn token bàn
     * @param {number} kichThuoc - Kích thước ảnh (pixel)
     * @returns {string} URL ảnh QR
     */
    layUrlAnhQr(noiDungUrl, kichThuoc = 300) {
        if (!noiDungUrl) return '';
        const noiDungMaHoa = encodeURIComponent(noiDungUrl.trim());
        // Sử dụng QuickChart QR API độ ổn định cao, không cần API Key, chuẩn ISO/IEC 18004
        return `https://api.quickchart.io/qr?text=${noiDungMaHoa}&size=${kichThuoc}&margin=1&format=png`;
    },

    /**
     * Tạo đường dẫn định danh bàn ăn đầy đủ
     * @param {string|number} maBan - Mã hoặc số bàn (VD: "B01", "VIP-01")
     * @param {string} token - Token bảo mật phiên quét QR
     * @returns {string} URL tuyệt đối
     */
    taoDuongDanBanAn(maBan, token) {
        const origin = (typeof window !== 'undefined' && window.location.origin) 
            ? window.location.origin 
            : 'http://localhost:3001';
        return `${origin}/e-menu?ban=${encodeURIComponent(maBan)}&token=${encodeURIComponent(token)}`;
    },

    /**
     * Tải tệp hình ảnh mã QR về máy tính của người dùng
     * @param {string} urlAnh - URL ảnh QR
     * @param {string} tenTep - Tên tệp lưu về (VD: "QR_Ban_01.png")
     */
    async taiAnhVeMay(urlAnh, tenTep = 'Ma_QR_Ban.png') {
        try {
            const phanHoi = await fetch(urlAnh);
            const blob = await phanHoi.blob();
            const urlBlob = window.URL.createObjectURL(blob);
            const theA = document.createElement('a');
            theA.style.display = 'none';
            theA.href = urlBlob;
            theA.download = tenTep;
            document.body.appendChild(theA);
            theA.click();
            window.URL.revokeObjectURL(urlBlob);
            document.body.removeChild(theA);
            return true;
        } catch (loi) {
            console.error('Lỗi khi tải ảnh QR về máy:', loi);
            // Fallback mở tab mới nếu bị chặn CORS tải trực tiếp
            window.open(urlAnh, '_blank');
            return false;
        }
    }
};

if (typeof window !== 'undefined') {
    window.BoSinhQr = BoSinhQr;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = BoSinhQr;
}
