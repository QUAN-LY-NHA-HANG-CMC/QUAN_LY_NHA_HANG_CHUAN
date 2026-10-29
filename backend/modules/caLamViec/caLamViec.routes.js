const express = require('express');
const router = express.Router();
const caLamViecController = require('./caLamViec.controller');
const caLamViecValidation = require('./caLamViec.validation');

// Danh sách ca mẫu (US-117)
router.get('/danh-sach-ca', caLamViecController.layDanhSachCa);

// Lấy thông tin ca hiện tại đang hoạt động (US-120)
router.get('/hien-tai', caLamViecController.layCaHienTai);

// Mở ca làm việc (US-118)
router.post('/mo-ca', caLamViecValidation.kiemTraMoCa, caLamViecController.moCa);

// Ghi nhận phiếu thu/chi trong ca (US-119)
router.post('/:phienCaId/thu-chi', caLamViecValidation.kiemTraThuChi, caLamViecController.taoThuChi);

// Đóng ca và đối soát kết ca (US-121)
router.post('/:phienCaId/dong-ca', caLamViecValidation.kiemTraDongCa, caLamViecController.dongCa);

// Lịch sử và chi tiết phiên ca (US-122)
router.get('/lich-su', caLamViecController.layLichSu);
router.get('/:id', caLamViecController.layChiTiet);

module.exports = router;
