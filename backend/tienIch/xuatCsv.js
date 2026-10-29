/**
 * TIỆN ÍCH XUẤT TỆP CSV / EXCEL (xuatCsv.js)
 * Chuẩn hóa định dạng CSV theo RFC 4180, nhúng BOM UTF-8 (\uFEFF)
 * Đảm bảo mở trực tiếp trên Microsoft Excel tiếng Việt hiển thị 100% không lỗi font (US-133, US-134)
 */

function thoatGiaTriCsv(giaTri) {
    if (giaTri === null || giaTri === undefined) {
        return '""';
    }
    let str = String(giaTri);
    // Nếu có dấu phẩy, dấu nháy kép hoặc xuống dòng -> Bọc trong dấu nháy kép và escape nháy kép
    if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
        str = str.replace(/"/g, '""');
        return `"${str}"`;
    }
    return `"${str}"`;
}

/**
 * Chuyển đổi danh sách đối tượng thành chuỗi CSV UTF-8 có BOM
 * @param {Array<Object>} danhSach Mảng dữ liệu
 * @param {Array<{ khoa: string, tieuDe: string }>} cotCauHinh Danh sách cột cần xuất
 * @returns {String} Chuỗi CSV chuẩn
 */
function chuyenDoiSangCsv(danhSach, cotCauHinh) {
    if (!Array.isArray(danhSach) || danhSach.length === 0) {
        // Nếu không có dữ liệu, trả về chỉ có dòng tiêu đề
        const tieuDe = cotCauHinh.map(c => thoatGiaTriCsv(c.tieuDe)).join(',');
        return '\uFEFF' + tieuDe + '\r\n';
    }

    const cacCot = cotCauHinh || Object.keys(danhSach[0]).map(k => ({ khoa: k, tieuDe: k }));
    const dongTieuDe = cacCot.map(c => thoatGiaTriCsv(c.tieuDe)).join(',');

    const cacDongDuLieu = danhSach.map(item => {
        return cacCot.map(c => {
            const val = item[c.khoa];
            return thoatGiaTriCsv(val);
        }).join(',');
    });

    // Thêm ký tự BOM (\uFEFF) ở đầu chuỗi
    return '\uFEFF' + [dongTieuDe, ...cacDongDuLieu].join('\r\n');
}

module.exports = {
    chuyenDoiSangCsv,
    thoatGiaTriCsv
};
