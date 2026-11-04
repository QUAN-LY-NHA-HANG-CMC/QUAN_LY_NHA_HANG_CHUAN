const express = require('express');
const router = express.Router();
const cauHinhController = require('./cauHinh.controller');

router.get('/', cauHinhController.layCauHinh);
router.put('/', cauHinhController.capNhatCauHinh);
router.post('/', cauHinhController.capNhatCauHinh);

module.exports = router;
