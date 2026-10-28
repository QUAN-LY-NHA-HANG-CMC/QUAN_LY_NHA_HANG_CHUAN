const express = require('express');
const router = express.Router();
const hoaDonController = require('./hoaDon.controller');
const hoaDonValidation = require('./hoaDon.validation');

router.get('/', hoaDonController.layDanhSach);
router.get('/tam-tinh/:idHoacBanId', hoaDonController.layPhieuTamTinh);
router.get('/:id', hoaDonController.layChiTiet);
router.post('/tong-hop-ban/:banId', hoaDonValidation.kiemTraTongHopHoaDon, hoaDonController.tongHopHoaDon);
router.post('/:id/tach-hoa-don', hoaDonValidation.kiemTraTachHoaDon, hoaDonController.tachHoaDon);

module.exports = router;
