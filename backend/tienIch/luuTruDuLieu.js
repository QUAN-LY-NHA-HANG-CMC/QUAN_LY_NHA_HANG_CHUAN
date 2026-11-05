const fs = require('fs');
const path = require('path');

/**
 * BỘ QUẢN LÝ LƯU TRỮ DỮ LIỆU BỀN VỮNG (luuTruDuLieu.js)
 * Phụ trách: Minh (Backend API Dev) & Nhật (PM & Backend Core)
 * Giúp dữ liệu cấu hình, thực đơn, bàn ăn, đơn hàng được lưu trữ bền vững (persistent) vào đĩa,
 * không bị mất hay hoàn về dữ liệu thử khi khởi động lại máy chủ hoặc chạy trên các máy khác nhau.
 */

const THU_MUC_DU_LIEU = path.join(__dirname, '../duLieu');

// Đảm bảo thư mục backend/duLieu luôn tồn tại
try {
    if (!fs.existsSync(THU_MUC_DU_LIEU)) {
        fs.mkdirSync(THU_MUC_DU_LIEU, { recursive: true });
    }
} catch (loi) {
    console.error('Không thể tạo thư mục lưu trữ backend/duLieu:', loi);
}

/**
 * Đọc dữ liệu từ tệp JSON. Nếu tệp chưa tồn tại, tự động tạo mới với dữ liệu mặc định.
 * @param {string} tenTep Tên định danh bảng/tệp (ví dụ 'thucDon', 'banAn')
 * @param {any} duLieuMacDinh Dữ liệu mẫu khởi tạo ban đầu
 * @returns {any} Dữ liệu đã lưu trữ hoặc dữ liệu mặc định
 */
function docDuLieu(tenTep, duLieuMacDinh) {
    const duongDanTep = path.join(THU_MUC_DU_LIEU, `${tenTep}.json`);
    try {
        if (fs.existsSync(duongDanTep)) {
            const noiDung = fs.readFileSync(duongDanTep, 'utf8');
            if (noiDung && noiDung.trim().length > 0) {
                return JSON.parse(noiDung);
            }
        }
    } catch (loi) {
        console.warn(`[LuuTruDuLieu] Không đọc được tệp ${tenTep}.json, sử dụng dữ liệu mặc định:`, loi.message);
    }

    // Nếu chưa có tệp hoặc tệp rỗng, ghi dữ liệu mặc định ra đĩa
    ghiDuLieu(tenTep, duLieuMacDinh);
    return duLieuMacDinh;
}

/**
 * Ghi dữ liệu đồng bộ ra tệp JSON trên đĩa để đảm bảo tính toàn vẹn (ACID / Persistence).
 * @param {string} tenTep Tên định danh bảng/tệp
 * @param {any} duLieu Dữ liệu cần ghi
 */
function ghiDuLieu(tenTep, duLieu) {
    const duongDanTep = path.join(THU_MUC_DU_LIEU, `${tenTep}.json`);
    try {
        if (!fs.existsSync(THU_MUC_DU_LIEU)) {
            fs.mkdirSync(THU_MUC_DU_LIEU, { recursive: true });
        }
        const noiDung = JSON.stringify(duLieu, null, 2);
        fs.writeFileSync(duongDanTep, noiDung, 'utf8');
    } catch (loi) {
        console.error(`[LuuTruDuLieu] Lỗi khi ghi tệp ${tenTep}.json:`, loi);
    }
}

module.exports = {
    docDuLieu,
    ghiDuLieu,
    THU_MUC_DU_LIEU
};
