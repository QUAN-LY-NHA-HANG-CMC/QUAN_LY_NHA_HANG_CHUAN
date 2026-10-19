const path = require('path');
const fs = require('fs');
const multer = require('multer');
const thucDonService = require('./thucDon.service');
const { kiemTraTaoMonAn, kiemTraCapNhatMonAn } = require('./thucDon.validation');
const { phanHoiThanhCong, phanHoiLoi } = require('../../tienIch/dinhDangPhanHoi');
const cauHinhChung = require('../../cauHinh/cauHinhChung');

// Cấu hình Multer lưu ảnh món ăn
const noiLuuTru = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(cauHinhChung.thuMucTaiLen)) {
            fs.mkdirSync(cauHinhChung.thuMucTaiLen, { recursive: true });
        }
        cb(null, cauHinhChung.thuMucTaiLen);
    },
    filename: function (req, file, cb) {
        const phanMoRong = path.extname(file.originalname).toLowerCase();
        const tenTepDuyNhat = `mon-${Date.now()}-${Math.round(Math.random() * 1E9)}${phanMoRong}`;
        cb(null, tenTepDuyNhat);
    }
});

const boLocTep = (req, file, cb) => {
    const loaiHopLe = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (loaiHopLe.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận tệp hình ảnh định dạng JPG, PNG hoặc WEBP'), false);
    }
};

const xuLyTaiAnh = multer({
    storage: noiLuuTru,
    limits: { fileSize: cauHinhChung.gioiHanTepTaiLenMB * 1024 * 1024 },
    fileFilter: boLocTep
}).single('hinhAnh');

async function layDanhSach(req, res, next) {
    try {
        const { danhMucId, trangThai, tuKhoa, giaTu, giaDen, trang, soLuong } = req.query;
        const ketQua = await thucDonService.layDanhSachMonAn({
            danhMucId,
            trangThai,
            tuKhoa,
            giaTu,
            giaDen,
            trang,
            soLuong
        });
        return phanHoiThanhCong(res, ketQua, 'Lấy danh sách món ăn thành công');
    } catch (loi) {
        next(loi);
    }
}

async function layChiTiet(req, res, next) {
    try {
        const { id } = req.params;
        const mon = await thucDonService.layChiTietMonAn(id);
        return phanHoiThanhCong(res, mon, 'Lấy chi tiết món ăn thành công');
    } catch (loi) {
        next(loi);
    }
}

async function taoMoi(req, res, next) {
    try {
        const loiValidation = kiemTraTaoMonAn(req.body);
        if (loiValidation.length > 0) {
            return phanHoiLoi(res, loiValidation.join(', '), 400);
        }

        const monMoi = await thucDonService.taoMonAn(req.body);
        return phanHoiThanhCong(res, monMoi, 'Tạo món ăn thành công', 201);
    } catch (loi) {
        next(loi);
    }
}

async function capNhat(req, res, next) {
    try {
        const { id } = req.params;
        const loiValidation = kiemTraCapNhatMonAn(req.body);
        if (loiValidation.length > 0) {
            return phanHoiLoi(res, loiValidation.join(', '), 400);
        }

        const monCapNhat = await thucDonService.capNhatMonAn(id, req.body);
        return phanHoiThanhCong(res, monCapNhat, 'Cập nhật món ăn thành công');
    } catch (loi) {
        next(loi);
    }
}

function taiHinhAnh(req, res, next) {
    xuLyTaiAnh(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return phanHoiLoi(res, `Lỗi tải ảnh: ${err.message}`, 400);
        } else if (err) {
            return phanHoiLoi(res, err.message, 400);
        }

        if (!req.file) {
            return phanHoiLoi(res, 'Vui lòng chọn tệp hình ảnh để tải lên', 400);
        }

        try {
            const { id } = req.params;
            const duongDanAnh = `/tepTaiLen/anhMonAn/${req.file.filename}`;
            const monCapNhat = await thucDonService.capNhatHinhAnh(id, duongDanAnh);
            return phanHoiThanhCong(res, monCapNhat, 'Tải ảnh món ăn thành công');
        } catch (loi) {
            next(loi);
        }
    });
}

async function doiTrangThai(req, res, next) {
    try {
        const { id } = req.params;
        const { trangThai } = req.body;
        if (!trangThai) {
            return phanHoiLoi(res, 'Vui lòng cung cấp trạng thái (DangBan hoặc TamHet)', 400);
        }
        const monCapNhat = await thucDonService.doiTrangThaiMonAn(id, trangThai);
        return phanHoiThanhCong(res, monCapNhat, 'Cập nhật trạng thái món ăn thành công');
    } catch (loi) {
        next(loi);
    }
}

async function doiMonBanChay(req, res, next) {
    try {
        const { id } = req.params;
        const { laMonBanChay } = req.body;
        const monCapNhat = await thucDonService.danhDauMonBanChay(id, Boolean(laMonBanChay));
        return phanHoiThanhCong(res, monCapNhat, 'Cập nhật đánh dấu món bán chạy thành công');
    } catch (loi) {
        next(loi);
    }
}

async function thietLapTuyChon(req, res, next) {
    try {
        const { id } = req.params;
        const { tuyChon } = req.body;
        const monCapNhat = await thucDonService.thietLapTuyChon(id, tuyChon);
        return phanHoiThanhCong(res, monCapNhat, 'Thiết lập tùy chọn món ăn thành công');
    } catch (loi) {
        next(loi);
    }
}

async function xoaMem(req, res, next) {
    try {
        const { id } = req.params;
        await thucDonService.xoaMemMonAn(id);
        return phanHoiThanhCong(res, null, 'Ẩn món ăn thành công');
    } catch (loi) {
        next(loi);
    }
}

module.exports = {
    layDanhSach,
    layChiTiet,
    taoMoi,
    capNhat,
    taiHinhAnh,
    doiTrangThai,
    doiMonBanChay,
    thietLapTuyChon,
    xoaMem
};
