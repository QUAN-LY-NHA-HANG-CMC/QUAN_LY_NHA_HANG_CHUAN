const path = require('path');
const os = require('os');
require('dotenv').config();

function layDiaChiIpLan() {
    try {
        const interfaces = os.networkInterfaces();
        for (const tenGiaoDien of Object.keys(interfaces)) {
            const danhSach = interfaces[tenGiaoDien];
            for (const diaChi of danhSach) {
                if (diaChi.family === 'IPv4' && !diaChi.internal && diaChi.address) {
                    return diaChi.address;
                }
            }
        }
    } catch (e) {}
    return 'localhost';
}

const congBackend = Number(process.env.PORT || 3001);
const lanIp = layDiaChiIpLan();
const diaChiHostMacDinh = lanIp !== 'localhost' ? `http://${lanIp}:${congBackend}` : `http://localhost:${congBackend}`;

const envQrBase = (process.env.QR_BASE_URL || '').trim();
const qrBaseUrl = (envQrBase && !envQrBase.includes('5173'))
    ? envQrBase
    : `${diaChiHostMacDinh}/e-menu`;

const cauHinhChung = {
    congBackend,
    lanIp,
    moiTruong: process.env.NODE_ENV || 'development',
    diaChiFrontend: (process.env.CLIENT_URL && !process.env.CLIENT_URL.includes('5173')) ? process.env.CLIENT_URL : diaChiHostMacDinh,
    qrBaseUrl,
    gioiHanTepTaiLenMB: 5,
    thuMucTaiLen: path.join(__dirname, '../tepTaiLen/anhMonAn'),
    thoiGianPhienBanPhut: 180
};

module.exports = cauHinhChung;
