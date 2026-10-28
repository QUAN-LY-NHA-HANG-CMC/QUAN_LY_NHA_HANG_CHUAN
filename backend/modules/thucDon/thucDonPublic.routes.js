const express = require('express');
const router = express.Router();
const thucDonPublicController = require('./thucDonPublic.controller');

// Trang chủ E-Menu khi quét QR (kèm banId & token)
router.get('/', thucDonPublicController.layTrangChuEMenu);

// Danh mục
router.get('/danh-muc', thucDonPublicController.layDanhMucPublic);

// Món bán chạy
router.get('/mon-ban-chay', thucDonPublicController.layMonBanChayPublic);

// Danh sách món ăn có bộ lọc & tìm kiếm
router.get('/mon-an', thucDonPublicController.layDanhSachMonAnPublic);

// Chi tiết món ăn
router.get('/mon-an/:id', thucDonPublicController.layChiTietMonAnPublic);

module.exports = router;
