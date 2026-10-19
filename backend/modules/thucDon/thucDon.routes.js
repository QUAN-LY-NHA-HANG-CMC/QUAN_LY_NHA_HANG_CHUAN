const express = require('express');
const router = express.Router();
const thucDonController = require('./thucDon.controller');
const xacThuc = require('../../middleware/xacThuc');
const { kiemTraVaiTro } = require('../../middleware/phanQuyen');

// Khách hàng hoặc công khai
router.get('/', thucDonController.layDanhSach);
router.get('/:id', thucDonController.layChiTiet);

// Quản trị viên (Admin / Quản lý)
router.post('/', xacThuc, kiemTraVaiTro('QuanLy'), thucDonController.taoMoi);
router.put('/:id', xacThuc, kiemTraVaiTro('QuanLy'), thucDonController.capNhat);
router.post('/:id/hinh-anh', xacThuc, kiemTraVaiTro('QuanLy'), thucDonController.taiHinhAnh);
router.patch('/:id/trang-thai', xacThuc, kiemTraVaiTro('QuanLy', 'Bep'), thucDonController.doiTrangThai);
router.patch('/:id/ban-chay', xacThuc, kiemTraVaiTro('QuanLy'), thucDonController.doiMonBanChay);
router.put('/:id/tuy-chon', xacThuc, kiemTraVaiTro('QuanLy'), thucDonController.thietLapTuyChon);
router.delete('/:id', xacThuc, kiemTraVaiTro('QuanLy'), thucDonController.xoaMem);

module.exports = router;
