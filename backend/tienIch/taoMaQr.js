const crypto = require('crypto');
const QRCode = require('qrcode');
const cauHinhChung = require('../cauHinh/cauHinhChung');

function taoTokenBaoMatQr() {
    return 'tok_' + crypto.randomBytes(8).toString('hex');
}

function taoDuongDanQrBan(banId, tokenBaoMat, maBan) {
    const ma = maBan || `B${banId}`;
    return `${cauHinhChung.qrBaseUrl}?ban=${encodeURIComponent(ma)}&banId=${banId}&token=${tokenBaoMat}`;
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
