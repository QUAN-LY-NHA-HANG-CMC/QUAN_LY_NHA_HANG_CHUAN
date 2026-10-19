const nhanVienService = require('./nhanVien.service');
const { kiemTraTaoNhanVien, kiemTraCapNhatNhanVien, kiemTraDatLaiMatKhau } = require('./nhanVien.validation');
const { phanHoiThanhCong, phanHoiLoi } = require('../../tienIch/dinhDangPhanHoi');

async function layDanhSach(req, res, next) {
    try {
        const { tuKhoa, vaiTro, trangThai, trang, soLuong } = req.query;
        const ketQua = await nhanVienService.layDanhSachNhanVien({
            tuKhoa,
            vaiTro,
            trangThai,
            trang,
            soLuong
        });
        return phanHoiThanhCong(res, ketQua, 'Lấy danh sách nhân viên thành công');
    } catch (loi) {
        next(loi);
    }
}

async function layChiTiet(req, res, next) {
    try {
        const { id } = req.params;
        const nv = await nhanVienService.layChiTietNhanVien(id);
        return phanHoiThanhCong(res, nv, 'Lấy thông tin nhân viên thành công');
    } catch (loi) {
        next(loi);
    }
}

async function taoMoi(req, res, next) {
    try {
        const loiValidation = kiemTraTaoNhanVien(req.body);
        if (loiValidation.length > 0) {
            return phanHoiLoi(res, loiValidation.join(', '), 400);
        }

        const nvMoi = await nhanVienService.taoNhanVien(req.body);
        return phanHoiThanhCong(res, nvMoi, 'Tạo tài khoản nhân viên thành công', 201);
    } catch (loi) {
        next(loi);
    }
}

async function capNhat(req, res, next) {
    try {
        const { id } = req.params;
        const loiValidation = kiemTraCapNhatNhanVien(req.body);
        if (loiValidation.length > 0) {
            return phanHoiLoi(res, loiValidation.join(', '), 400);
        }

        const nvCapNhat = await nhanVienService.capNhatNhanVien(id, req.body);
        return phanHoiThanhCong(res, nvCapNhat, 'Cập nhật nhân viên thành công');
    } catch (loi) {
        next(loi);
    }
}

async function doiTrangThai(req, res, next) {
    try {
        const { id } = req.params;
        const { trangThai } = req.body;
        if (!trangThai) {
            return phanHoiLoi(res, 'Vui lòng cung cấp trạng thái (HoatDong hoặc Khoa)', 400);
        }

        const nvCapNhat = await nhanVienService.doiTrangThaiNhanVien(id, trangThai);
        const thongDiep = trangThai === 'Khoa' ? 'Khóa tài khoản nhân viên thành công' : 'Mở khóa tài khoản nhân viên thành công';
        return phanHoiThanhCong(res, nvCapNhat, thongDiep);
    } catch (loi) {
        next(loi);
    }
}

async function datLaiMatKhau(req, res, next) {
    try {
        const { id } = req.params;
        const loiValidation = kiemTraDatLaiMatKhau(req.body);
        if (loiValidation.length > 0) {
            return phanHoiLoi(res, loiValidation.join(', '), 400);
        }

        await nhanVienService.datLaiMatKhau(id, req.body.matKhauMoi);
        return phanHoiThanhCong(res, null, 'Đặt lại mật khẩu nhân viên thành công');
    } catch (loi) {
        next(loi);
    }
}

module.exports = {
    layDanhSach,
    layChiTiet,
    taoMoi,
    capNhat,
    doiTrangThai,
    datLaiMatKhau
};
