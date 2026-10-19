const crypto = require('crypto');
const QRCode = require('qrcode');
const cauHinhChung = require('../cauHinh/cauHinhChung');

function taoTokenBaoMatQr() {
    return crypto.randomBytes(16).toString('hex');
}

function taoDuongDanQrBan(banId, tokenBaoMat) {
    return `${cauHinhChung.qrBaseUrl}?banId=${banId}&token=${tokenBaoMat}`;
}

async function taoAnhQrDataUrl(duongDan) {
    try {
        const anhDataUrl = await QRCode.toDataURL(duongDan, {
            errorCorrectionLevel: 'H',
            margin: 2,
            width: 300,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });
        return anhDataUrl;
    } catch (loi) {
        throw new Error('Không thể tạo mã QR: ' + loi.message);
    }
}

module.exports = {
    taoTokenBaoMatQr,
    taoDuongDanQrBan,
    taoAnhQrDataUrl
};
