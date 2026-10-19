function phanHoiThanhCong(res, data = {}, msg = 'Thành công', maTrangThai = 200) {
    return res.status(maTrangThai).json({
        ok: true,
        data,
        msg
    });
}

function phanHoiLoi(res, msg = 'Đã có lỗi xảy ra', maTrangThai = 400, data = null) {
    return res.status(maTrangThai).json({
        ok: false,
        data,
        msg
    });
}

module.exports = {
    phanHoiThanhCong,
    phanHoiLoi
};
