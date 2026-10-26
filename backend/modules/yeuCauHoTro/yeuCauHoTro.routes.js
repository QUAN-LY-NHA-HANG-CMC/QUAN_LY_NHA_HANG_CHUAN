const express = require('express');
const router = express.Router();
const yeuCauController = require('./yeuCauHoTro.controller');
const xacThuc = require('../../middleware/xacThuc');
const { kiemTraVaiTro } = require('../../middleware/phanQuyen');

// Khách hàng gửi yêu cầu hỗ trợ (Public)
router.post('/', yeuCauController.taoMoi);

// Phục vụ / Thu ngân / Quản lý xem danh sách và cập nhật trạng thái
router.get('/', xacThuc, kiemTraVaiTro('QuanLy', 'ThuNgan', 'PhucVu', 'Bep'), yeuCauController.layDanhSach);
router.get('/:id', xacThuc, kiemTraVaiTro('QuanLy', 'ThuNgan', 'PhucVu', 'Bep'), yeuCauController.layChiTiet);
router.patch('/:id/trang-thai', xacThuc, kiemTraVaiTro('QuanLy', 'ThuNgan', 'PhucVu'), yeuCauController.doiTrangThai);

module.exports = router;
