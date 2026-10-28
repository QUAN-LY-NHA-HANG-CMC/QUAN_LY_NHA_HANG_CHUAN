const express = require('express');
const router = express.Router();
const khuVucController = require('./khuVuc.controller');
const xacThuc = require('../../middleware/xacThuc');
const { kiemTraVaiTro } = require('../../middleware/phanQuyen');

router.get('/', khuVucController.layTatCa);
router.get('/:id', khuVucController.layChiTiet);

router.post('/', xacThuc, kiemTraVaiTro('QuanLy'), khuVucController.taoMoi);
router.put('/:id', xacThuc, kiemTraVaiTro('QuanLy'), khuVucController.capNhat);
router.delete('/:id', xacThuc, kiemTraVaiTro('QuanLy'), khuVucController.xoa);

module.exports = router;
