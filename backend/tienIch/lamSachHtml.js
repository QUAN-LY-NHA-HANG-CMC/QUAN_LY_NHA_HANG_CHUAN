function lamSachChuoi(chuoi) {
    if (typeof chuoi !== 'string') return chuoi;
    return chuoi
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
}

module.exports = {
    lamSachChuoi
};
