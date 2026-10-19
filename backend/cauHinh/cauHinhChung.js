const path = require('path');
require('dotenv').config();

const cauHinhChung = {
    congBackend: Number(process.env.PORT || 3001),
    moiTruong: process.env.NODE_ENV || 'development',
    diaChiFrontend: process.env.CLIENT_URL || 'http://localhost:5173',
    qrBaseUrl: process.env.QR_BASE_URL || 'http://localhost:5173/menu',
    gioiHanTepTaiLenMB: 5,
    thuMucTaiLen: path.join(__dirname, '../tepTaiLen/anhMonAn'),
    thoiGianPhienBanPhut: 180
};

module.exports = cauHinhChung;
