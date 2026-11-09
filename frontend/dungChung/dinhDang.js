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
     * Chuẩn hóa đối tượng Date từ chuỗi, số hoặc Date
     */
    chuanHoaDate(thoiGian) {
        if (!thoiGian) return null;
        if (thoiGian instanceof Date) return isNaN(thoiGian.getTime()) ? null : thoiGian;
        let str = String(thoiGian).trim();
        if (!isNaN(Number(str)) && str.length >= 10) {
            const num = Number(str);
            return new Date(str.length === 10 ? num * 1000 : num);
        }
        let d = new Date(str);
        if (isNaN(d.getTime())) {
            d = new Date(str.replace(' ', 'T'));
        }
        return isNaN(d.getTime()) ? null : d;
    },

    /**
     * Định dạng ngày giờ chuẩn Việt Nam (HH:mm DD/MM/YYYY hoặc HH:mm:ss DD/MM/YYYY)
     * Luôn ép buộc theo múi giờ Việt Nam (Asia/Ho_Chi_Minh - GMT+7)
     * @param {string|Date} thoiGian 
     * @param {boolean} kemGiay 
     * @returns {string} Ví dụ: 07:35 06/11/2026
     */
    ngayGio(thoiGian, kemGiay = false) {
        const d = this.chuanHoaDate(thoiGian);
        if (!d) return thoiGian ? String(thoiGian) : '---';
        const options = {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour12: false
        };
        if (kemGiay) options.second = '2-digit';
        return new Intl.DateTimeFormat('vi-VN', options).format(d).replace(',', '');
    },

    /**
     * Định dạng giờ phút chuẩn Việt Nam (HH:mm)
     * Luôn ép buộc theo múi giờ Việt Nam (Asia/Ho_Chi_Minh - GMT+7)
     * @param {string|Date} thoiGian 
     * @returns {string} Ví dụ: 07:35
     */
    gioPhut(thoiGian) {
        const d = this.chuanHoaDate(thoiGian);
        if (!d) return thoiGian ? String(thoiGian).substring(11, 16) : '--:--';
        return new Intl.DateTimeFormat('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(d);
    },

    /**
     * Định dạng chỉ ngày chuẩn Việt Nam (DD/MM/YYYY)
     * Luôn ép buộc theo múi giờ Việt Nam (Asia/Ho_Chi_Minh - GMT+7)
     */
    chiNgay(thoiGian) {
        const d = this.chuanHoaDate(thoiGian);
        if (!d) return '---';
        return new Intl.DateTimeFormat('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(d);
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
    /**
     * Lấy chuỗi ngày giờ hiện tại chuẩn Việt Nam (YYYY-MM-DD HH:mm:ss)
     * Luôn ép buộc theo múi giờ Việt Nam (Asia/Ho_Chi_Minh - GMT+7)
     */
    layThoiGianHienTaiVN() {
        return new Intl.DateTimeFormat('sv-SE', {
            timeZone: 'Asia/Ho_Chi_Minh',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(new Date());
    },

    /**
     * Định dạng bất kỳ mốc thời gian nào (ISO, timestamp, chuỗi) sang YYYY-MM-DD HH:mm:ss theo múi giờ Việt Nam (GMT+7)
     */
    dinhDangGioVN(thoiGian, kemGiay = true) {
        if (!thoiGian) return '--:--';
        if (typeof thoiGian === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(thoiGian.trim())) {
            return thoiGian.trim();
        }
        const d = this.chuanHoaDate(thoiGian);
        if (!d) return String(thoiGian);
        return new Intl.DateTimeFormat('sv-SE', {
            timeZone: 'Asia/Ho_Chi_Minh',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: kemGiay ? '2-digit' : undefined,
            hour12: false
        }).format(d);
    },

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
