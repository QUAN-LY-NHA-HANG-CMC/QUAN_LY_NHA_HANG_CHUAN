const express = require('express');
const router = express.Router();
const vaiTroController = require('./vaiTro.controller');

router.get('/', vaiTroController.layDanhSach);
router.get('/:ma', vaiTroController.layChiTiet);
router.put('/:ma', vaiTroController.capNhatQuyen);
router.post('/dong-bo', vaiTroController.dongBo);

module.exports = router;
