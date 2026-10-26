function kiemTraTaoNhanVien(duLieu) {
    const loi = [];

    if (!duLieu.tenDangNhap || typeof duLieu.tenDangNhap !== 'string' || duLieu.tenDangNhap.trim() === '') {
        loi.push('Tên đăng nhập không được để trống');
    } else if (duLieu.tenDangNhap.trim().length < 3) {
        loi.push('Tên đăng nhập phải có ít nhất 3 ký tự');
    }

    if (!duLieu.matKhau || typeof duLieu.matKhau !== 'string' || duLieu.matKhau.length < 6) {
        loi.push('Mật khẩu phải có ít nhất 6 ký tự');
    }

    if (!duLieu.hoTen || typeof duLieu.hoTen !== 'string' || duLieu.hoTen.trim() === '') {
        loi.push('Họ và tên nhân viên không được để trống');
    }

    const danhSachVaiTroHopLe = ['QuanLy', 'ThuNgan', 'Bep', 'PhucVu'];
    if (!duLieu.vaiTro || !danhSachVaiTroHopLe.includes(duLieu.vaiTro)) {
        loi.push(`Vai trò không hợp lệ. Chỉ chấp nhận: ${danhSachVaiTroHopLe.join(', ')}`);
    }

    if (duLieu.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(duLieu.email)) {
        loi.push('Định dạng email không hợp lệ');
    }

    if (duLieu.soDienThoai && !/^[0-9]{9,11}$/.test(duLieu.soDienThoai.replace(/\s+/g, ''))) {
        loi.push('Số điện thoại không hợp lệ (phải gồm 9-11 chữ số)');
    }

    return loi;
}

function kiemTraCapNhatNhanVien(duLieu) {
    const loi = [];

    if (duLieu.hoTen !== undefined && (typeof duLieu.hoTen !== 'string' || duLieu.hoTen.trim() === '')) {
        loi.push('Họ và tên nhân viên không được để trống');
    }

    const danhSachVaiTroHopLe = ['QuanLy', 'ThuNgan', 'Bep', 'PhucVu'];
    if (duLieu.vaiTro && !danhSachVaiTroHopLe.includes(duLieu.vaiTro)) {
        loi.push(`Vai trò không hợp lệ. Chỉ chấp nhận: ${danhSachVaiTroHopLe.join(', ')}`);
    }

    if (duLieu.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(duLieu.email)) {
        loi.push('Định dạng email không hợp lệ');
    }

    if (duLieu.soDienThoai && !/^[0-9]{9,11}$/.test(duLieu.soDienThoai.replace(/\s+/g, ''))) {
        loi.push('Số điện thoại không hợp lệ (phải gồm 9-11 chữ số)');
    }

    return loi;
}

function kiemTraDatLaiMatKhau(duLieu) {
    const loi = [];
    if (!duLieu.matKhauMoi || typeof duLieu.matKhauMoi !== 'string' || duLieu.matKhauMoi.length < 6) {
        loi.push('Mật khẩu mới phải có ít nhất 6 ký tự');
    }
    return loi;
}

module.exports = {
    kiemTraTaoNhanVien,
    kiemTraCapNhatNhanVien,
    kiemTraDatLaiMatKhau
};
