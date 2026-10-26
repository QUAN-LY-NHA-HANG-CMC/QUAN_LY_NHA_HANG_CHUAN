const { phanHoiLoi } = require('../tienIch/dinhDangPhanHoi');

function kiemTraVaiTro(...cacVaiTroChoPhep) {
    return (req, res, next) => {
        if (!req.nguoiDung) {
            return phanHoiLoi(res, 'Chưa đăng nhập', 401);
        }

        const vaiTroHienTai = req.nguoiDung.vaiTro;
        if (!cacVaiTroChoPhep.includes(vaiTroHienTai)) {
            return phanHoiLoi(res, 'Bạn không có quyền thực hiện hành động này', 403);
        }

        next();
    };
}

module.exports = {
    kiemTraVaiTro
};
