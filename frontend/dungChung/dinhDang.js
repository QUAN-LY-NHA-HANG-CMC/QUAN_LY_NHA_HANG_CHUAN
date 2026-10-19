/**
 * CÁC HÀM TIỆN ÍCH ĐỊNH DẠNG DỮ LIỆU (dinhDang.js)
 * Tuân thủ Quy chuẩn phát triển toàn dự án
 */

const DinhDang = {
    /**
     * Định dạng tiền tệ Việt Nam Đồng (VND)
     * @param {number|string} soTien 
     * @returns {string} Ví dụ: 150.000 đ
     */
    tienVnd(soTien) {
        const giaTri = Number(soTien) || 0;
        return new Intl.NumberFormat('vi-VN').format(giaTri) + ' đ';
    },

    /**
     * Định dạng ngày giờ chuẩn Việt Nam (DD/MM/YYYY HH:mm)
     * @param {string|Date} thoiGian 
     * @returns {string} Ví dụ: 19/10/2026 10:30
     */
    ngayGio(thoiGian) {
        if (!thoiGian) return '---';
        const d = new Date(thoiGian);
        if (isNaN(d.getTime())) return '---';
        const ngay = String(d.getDate()).padStart(2, '0');
        const thang = String(d.getMonth() + 1).padStart(2, '0');
        const nam = d.getFullYear();
        const gio = String(d.getHours()).padStart(2, '0');
        const phut = String(d.getMinutes()).padStart(2, '0');
        return `${ngay}/${thang}/${nam} ${gio}:${phut}`;
    },

    /**
     * Định dạng chỉ ngày (DD/MM/YYYY)
     */
    chiNgay(thoiGian) {
        if (!thoiGian) return '---';
        const d = new Date(thoiGian);
        if (isNaN(d.getTime())) return '---';
        const ngay = String(d.getDate()).padStart(2, '0');
        const thang = String(d.getMonth() + 1).padStart(2, '0');
        const nam = d.getFullYear();
        return `${ngay}/${thang}/${nam}`;
    },

    /**
     * Tạo chuỗi ngẫu nhiên (UUID ngắn) phục vụ Token bảo mật QR
     * @param {number} doDai 
     * @returns {string}
     */
    taoChuoiNgauNhien(doDai = 16) {
        const kyTu = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let ketQua = '';
        for (let i = 0; i < doDai; i++) {
            ketQua += kyTu.charAt(Math.floor(Math.random() * kyTu.length));
        }
        return ketQua;
    },

    /**
     * Làm sạch và cắt ngắn chuỗi văn bản nếu quá dài
     */
    rutGonVanBan(chuoi, doDaiToiDa = 50) {
        if (!chuoi) return '';
        if (chuoi.length <= doDaiToiDa) return chuoi;
        return chuoi.substring(0, doDaiToiDa) + '...';
    },

    /**
     * Thoát các ký tự HTML nguy hiểm (Chống XSS phía Client)
     */
    thoatHtml(chuoi) {
        if (chuoi === null || chuoi === undefined) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(chuoi).replace(/[&<>"']/g, (m) => map[m]);
    }
};

if (typeof window !== 'undefined') {
    window.DinhDang = DinhDang;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DinhDang;
}
