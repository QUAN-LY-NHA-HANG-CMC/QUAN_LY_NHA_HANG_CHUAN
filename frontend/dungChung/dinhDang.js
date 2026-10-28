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
    },

    /**
     * Sinh ảnh đại diện SVG mặc định khi mạng chậm hoặc ảnh lỗi (0ms)
     */
    layAnhMacDinh(tenMon = 'Món Quán Mộc') {
        const chuoiTen = this.rutGonVanBan(tenMon, 22);
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="#FBF8F5"/><circle cx="200" cy="120" r="52" fill="#F0E5DA"/><text x="200" y="135" font-size="44" text-anchor="middle">🍲</text><text x="200" y="210" font-family="sans-serif" font-size="16" font-weight="bold" fill="#8F440F" text-anchor="middle">${chuoiTen}</text><text x="200" y="235" font-family="sans-serif" font-size="12" fill="#9CA3AF" text-anchor="middle">Quán Mộc</text></svg>`;
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    },

    /**
     * Chuẩn hóa URL hình ảnh món ăn theo quy định của Backend (Minh)
     */
    chuanHoaUrlHinhAnh(hinhAnh, tenMon = 'Món Quán Mộc') {
        if (!hinhAnh) return this.layAnhMacDinh(tenMon);
        if (hinhAnh.startsWith('http://') || hinhAnh.startsWith('https://') || hinhAnh.startsWith('data:')) {
            return hinhAnh;
        }
        const baseUrl = (typeof window !== 'undefined' && window.HANG_SO && window.HANG_SO.BACKEND_URL) 
            ? window.HANG_SO.BACKEND_URL 
            : 'http://localhost:3001';
        return `${baseUrl}${hinhAnh.startsWith('/') ? hinhAnh : '/' + hinhAnh}`;
    }
};

if (typeof window !== 'undefined') {
    window.DinhDang = DinhDang;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DinhDang;
}
