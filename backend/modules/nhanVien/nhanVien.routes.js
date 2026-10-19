const express = require('express');
const router = express.Router();
const nhanVienController = require('./nhanVien.controller');
const xacThuc = require('../../middleware/xacThuc');
const { kiemTraVaiTro } = require('../../middleware/phanQuyen');

// Chỉ Quản lý mới có quyền thao tác nhân sự
router.use(xacThuc);
router.use(kiemTraVaiTro('QuanLy'));

router.get('/', nhanVienController.layDanhSach);
router.get('/:id', nhanVienController.layChiTiet);
router.post('/', nhanVienController.taoMoi);
router.put('/:id', nhanVienController.capNhat);
router.patch('/:id/trang-thai', nhanVienController.doiTrangThai);
router.patch('/:id/dat-lai-mat-khau', nhanVienController.datLaiMatKhau);

module.exports = router;
