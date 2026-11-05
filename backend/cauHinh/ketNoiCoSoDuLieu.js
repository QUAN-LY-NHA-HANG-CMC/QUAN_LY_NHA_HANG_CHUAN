/**
 * CẤU HÌNH KẾT NỐI VÀ QUẢN TRỊ DỮ LIỆU BỀN VỮNG (ketNoiCoSoDuLieu.js)
 * Phụ trách: Phát (DBA) & Minh (Backend API) & Nhật (PM & Backend Core)
 * Cung cấp tầng truy xuất dữ liệu lưu trữ (Data Access Layer - DAL) đồng bộ với các đặc tả SQL trong database/
 */

const { docDuLieu, ghiDuLieu, THU_MUC_DU_LIEU } = require('../tienIch/luuTruDuLieu');

async function kiemTraKetNoiCoSoDuLieu() {
    return {
        ok: true,
        loai: 'PersistentJSONStore',
        thuMuc: THU_MUC_DU_LIEU,
        thoiGian: new Date().toISOString()
    };
}

module.exports = {
    kiemTraKetNoiCoSoDuLieu,
    docDuLieu,
    ghiDuLieu,
    THU_MUC_DU_LIEU
};
