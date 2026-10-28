const express = require('express');
const router = express.Router();
const banAnController = require('./banAn.controller');
const xacThuc = require('../../middleware/xacThuc');
const { kiemTraVaiTro } = require('../../middleware/phanQuyen');

// Xem danh sách bàn và chi tiết bàn (Thu ngân, Phục vụ, Quản lý)
router.get('/', banAnController.layTatCa);
router.get('/:id', banAnController.layChiTiet);

// Quản lý QR
router.get('/:id/qr', banAnController.layQr);
router.get('/khu-vuc/:khuVucId/qr', banAnController.layQrKhuVuc);
router.patch('/:id/lam-moi-qr', xacThuc, kiemTraVaiTro('QuanLy'), banAnController.lamMoiQr);

// Quản lý tạo, sửa, xóa bàn
router.post('/', xacThuc, kiemTraVaiTro('QuanLy'), banAnController.taoMoi);
router.put('/:id', xacThuc, kiemTraVaiTro('QuanLy'), banAnController.capNhat);
router.delete('/:id', xacThuc, kiemTraVaiTro('QuanLy'), banAnController.xoa);

module.exports = router;
