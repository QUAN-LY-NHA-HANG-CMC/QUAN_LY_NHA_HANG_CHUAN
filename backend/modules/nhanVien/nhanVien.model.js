const bcrypt = require('bcryptjs');

let danhSachNhanVien = [
    {
        id: 1,
        tenDangNhap: 'quanly',
        matKhau: '$2a$10$w3a6zB2qLphF3kL4kOaPDeP46n9Gk1wD26dJ3j5aC3aE.vEw6G.Xe', // 123456
        hoTen: 'Nguyễn Văn Quản Lý',
        soDienThoai: '0901234567',
        email: 'quanly@quanmoc.com',
        vaiTro: 'QuanLy', // 'QuanLy', 'ThuNgan', 'Bep', 'PhucVu'
        trangThai: 'HoatDong', // 'HoatDong', 'Khoa'
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    },
    {
        id: 2,
        tenDangNhap: 'thungan01',
        matKhau: '$2a$10$w3a6zB2qLphF3kL4kOaPDeP46n9Gk1wD26dJ3j5aC3aE.vEw6G.Xe',
        hoTen: 'Trần Thị Thu Ngân',
        soDienThoai: '0912345678',
        email: 'thungan@quanmoc.com',
        vaiTro: 'ThuNgan',
        trangThai: 'HoatDong',
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    },
    {
        id: 3,
        tenDangNhap: 'bep01',
        matKhau: '$2a$10$w3a6zB2qLphF3kL4kOaPDeP46n9Gk1wD26dJ3j5aC3aE.vEw6G.Xe',
        hoTen: 'Lê Văn Bếp Trưởng',
        soDienThoai: '0923456789',
        email: 'bep@quanmoc.com',
        vaiTro: 'Bep',
        trangThai: 'HoatDong',
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    }
];

let tuTangId = 4;

async function layDanhSach({ tuKhoa, vaiTro, trangThai, trang = 1, soLuong = 10 } = {}) {
    let ketQua = danhSachNhanVien.filter(nv => nv.trangThai !== 'DaXoa');

    if (vaiTro) {
        ketQua = ketQua.filter(nv => nv.vaiTro === vaiTro);
    }

    if (trangThai) {
        ketQua = ketQua.filter(nv => nv.trangThai === trangThai);
    }

    if (tuKhoa) {
        const tuKhoaChuan = tuKhoa.toLowerCase().trim();
        ketQua = ketQua.filter(
            nv => nv.hoTen.toLowerCase().includes(tuKhoaChuan) ||
                  nv.tenDangNhap.toLowerCase().includes(tuKhoaChuan) ||
                  (nv.soDienThoai && nv.soDienThoai.includes(tuKhoaChuan))
        );
    }

    const tongSo = ketQua.length;
    const tongSoTrang = Math.ceil(tongSo / soLuong) || 1;
    const viTriBatDau = (trang - 1) * soLuong;
    const duLieuTrang = ketQua.slice(viTriBatDau, viTriBatDau + Number(soLuong));

    // Loại bỏ trường matKhau khi trả về danh sách
    const danhSachAnToan = duLieuTrang.map(({ matKhau, ...duLieuAnToan }) => duLieuAnToan);

    return {
        danhSach: danhSachAnToan,
        phanTrang: {
            trangHienTai: Number(trang),
            soLuongMoiTrang: Number(soLuong),
            tongSoBanGhi: tongSo,
            tongSoTrang
        }
    };
}

async function layTheoId(id) {
    const nv = danhSachNhanVien.find(n => n.id === Number(id) && n.trangThai !== 'DaXoa');
    if (!nv) return null;
    const { matKhau, ...duLieuAnToan } = nv;
    return duLieuAnToan;
}

async function layBanGhiGocTheoId(id) {
    return danhSachNhanVien.find(n => n.id === Number(id) && n.trangThai !== 'DaXoa') || null;
}

async function layTheoTenDangNhap(tenDangNhap) {
    return danhSachNhanVien.find(
        n => n.tenDangNhap.toLowerCase() === tenDangNhap.toLowerCase().trim() && n.trangThai !== 'DaXoa'
    ) || null;
}

async function taoMoi(duLieu) {
    const banGhiMoi = {
        id: tuTangId++,
        tenDangNhap: duLieu.tenDangNhap.trim().toLowerCase(),
        matKhau: duLieu.matKhau,
        hoTen: duLieu.hoTen.trim(),
        soDienThoai: duLieu.soDienThoai ? duLieu.soDienThoai.trim() : '',
        email: duLieu.email ? duLieu.email.trim().toLowerCase() : '',
        vaiTro: duLieu.vaiTro,
        trangThai: 'HoatDong',
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    };
    danhSachNhanVien.push(banGhiMoi);

    const { matKhau, ...duLieuAnToan } = banGhiMoi;
    return duLieuAnToan;
}

async function capNhat(id, duLieu) {
    const viTri = danhSachNhanVien.findIndex(n => n.id === Number(id) && n.trangThai !== 'DaXoa');
    if (viTri === -1) return null;

    danhSachNhanVien[viTri] = {
        ...danhSachNhanVien[viTri],
        hoTen: duLieu.hoTen !== undefined ? duLieu.hoTen.trim() : danhSachNhanVien[viTri].hoTen,
        soDienThoai: duLieu.soDienThoai !== undefined ? duLieu.soDienThoai.trim() : danhSachNhanVien[viTri].soDienThoai,
        email: duLieu.email !== undefined ? duLieu.email.trim().toLowerCase() : danhSachNhanVien[viTri].email,
        vaiTro: duLieu.vaiTro !== undefined ? duLieu.vaiTro : danhSachNhanVien[viTri].vaiTro,
        ngayCapNhat: new Date()
    };

    const { matKhau, ...duLieuAnToan } = danhSachNhanVien[viTri];
    return duLieuAnToan;
}

async function doiTrangThai(id, trangThaiMoi) {
    const viTri = danhSachNhanVien.findIndex(n => n.id === Number(id) && n.trangThai !== 'DaXoa');
    if (viTri === -1) return null;

    danhSachNhanVien[viTri].trangThai = trangThaiMoi;
    danhSachNhanVien[viTri].ngayCapNhat = new Date();

    const { matKhau, ...duLieuAnToan } = danhSachNhanVien[viTri];
    return duLieuAnToan;
}

async function datLaiMatKhau(id, matKhauMoiDaBam) {
    const viTri = danhSachNhanVien.findIndex(n => n.id === Number(id) && n.trangThai !== 'DaXoa');
    if (viTri === -1) return false;

    danhSachNhanVien[viTri].matKhau = matKhauMoiDaBam;
    danhSachNhanVien[viTri].ngayCapNhat = new Date();
    return true;
}

module.exports = {
    layDanhSach,
    layTheoId,
    layBanGhiGocTheoId,
    layTheoTenDangNhap,
    taoMoi,
    capNhat,
    doiTrangThai,
    datLaiMatKhau
};
