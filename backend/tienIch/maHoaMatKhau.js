const bcrypt = require('bcryptjs');

async function bămMatKhau(matKhauGoc) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(matKhauGoc, salt);
}

async function soSanhMatKhau(matKhauGoc, matKhauDaBam) {
    return await bcrypt.compare(matKhauGoc, matKhauDaBam);
}

module.exports = {
    bămMatKhau,
    soSanhMatKhau
};
