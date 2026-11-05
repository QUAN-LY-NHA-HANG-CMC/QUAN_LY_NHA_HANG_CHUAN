const bcrypt = require('bcryptjs');
const { docDuLieu, ghiDuLieu } = require('../../tienIch/luuTruDuLieu');

const duLieuNhanVienMacDinh = [
    {
        id: 1,
        tenDangNhap: 'quanly',
        matKhau: '$2a$10$w3a6zB2qLphF3kL4kOaPDeP46n9Gk1wD26dJ3j5aC3aE.vEw6G.Xe', // 123456
        hoTen: 'Nguyễn Văn Quản Lý',
        soDienThoai: '0901234567',
        email: 'quanly@quanmoc.com',
        vaiTro: 'QuanLy',
        trangThai: 'HoatDong',
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
    },
    {
        id: 4,
        tenDangNhap: 'phucvu01',
        matKhau: '$2a$10$w3a6zB2qLphF3kL4kOaPDeP46n9Gk1wD26dJ3j5aC3aE.vEw6G.Xe',
        hoTen: 'Phạm Văn Phục Vụ',
        soDienThoai: '0934567890',
        email: 'phucvu@quanmoc.com',
        vaiTro: 'PhucVu',
        trangThai: 'HoatDong',
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    }
];

let danhSachNhanVien = docDuLieu('nhanVien', duLieuNhanVienMacDinh);
let tuTangId = Math.max(...danhSachNhanVien.map(n => n.id || 0), 0) + 1;

function luu() {
    ghiDuLieu('nhanVien', danhSachNhanVien);
}

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
            nv => (nv.hoTen && nv.hoTen.toLowerCase().includes(tuKhoaChuan)) ||
                  (nv.tenDangNhap && nv.tenDangNhap.toLowerCase().includes(tuKhoaChuan)) ||
                  (nv.soDienThoai && nv.soDienThoai.includes(tuKhoaChuan))
        );
    }

    const tongSo = ketQua.length;
    const soLuongNum = Number(soLuong) || 10;
    const trangNum = Number(trang) || 1;
    const tongSoTrang = Math.ceil(tongSo / soLuongNum) || 1;
    const viTriBatDau = (trangNum - 1) * soLuongNum;
    const duLieuTrang = ketQua.slice(viTriBatDau, viTriBatDau + soLuongNum);

    const danhSachAnToan = duLieuTrang.map(({ matKhau, ...duLieuAnToan }) => duLieuAnToan);

    return {
        danhSach: danhSachAnToan,
        phanTrang: {
            trangHienTai: trangNum,
            soLuongMoiTrang: soLuongNum,
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
    if (!tenDangNhap) return null;
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
    luu();

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
    luu();

    const { matKhau, ...duLieuAnToan } = danhSachNhanVien[viTri];
    return duLieuAnToan;
}

async function doiTrangThai(id, trangThaiMoi) {
    const viTri = danhSachNhanVien.findIndex(n => n.id === Number(id) && n.trangThai !== 'DaXoa');
    if (viTri === -1) return null;

    danhSachNhanVien[viTri].trangThai = trangThaiMoi;
    danhSachNhanVien[viTri].ngayCapNhat = new Date();
    luu();

    const { matKhau, ...duLieuAnToan } = danhSachNhanVien[viTri];
    return duLieuAnToan;
}

async function datLaiMatKhau(id, matKhauMoiDaBam) {
    const viTri = danhSachNhanVien.findIndex(n => n.id === Number(id) && n.trangThai !== 'DaXoa');
    if (viTri === -1) return false;

    danhSachNhanVien[viTri].matKhau = matKhauMoiDaBam;
    danhSachNhanVien[viTri].ngayCapNhat = new Date();
    luu();
    return true;
}

async function dongBoDanhSach(danhSachMoi) {
    if (!Array.isArray(danhSachMoi)) return danhSachNhanVien;
    const vaiTroMap = {
        'QUAN_LY': 'QuanLy',
        'THU_NGAN': 'ThuNgan',
        'BEP': 'Bep',
        'PHUC_VU': 'PhucVu',
        'QuanLy': 'QuanLy',
        'ThuNgan': 'ThuNgan',
        'Bep': 'Bep',
        'PhucVu': 'PhucVu'
    };
    const trangThaiMap = {
        'DANG_LAM_VIEC': 'HoatDong',
        'DA_KHOA': 'Khoa',
        'HoatDong': 'HoatDong',
        'Khoa': 'Khoa',
        'DaXoa': 'DaXoa'
    };

    danhSachNhanVien = danhSachMoi.map((n, idx) => ({
        id: Number(n.id) || (idx + 1),
        tenDangNhap: (n.tenDangNhap || `nv${idx + 1}`).toLowerCase().trim(),
        matKhau: n.matKhau || '$2a$10$w3a6zB2qLphF3kL4kOaPDeP46n9Gk1wD26dJ3j5aC3aE.vEw6G.Xe',
        hoTen: (n.hoTen || n.tenDangNhap || `Nhân viên ${n.id}`).trim(),
        soDienThoai: (n.soDienThoai || '').trim(),
        email: (n.email || `${n.tenDangNhap}@quanmoc.com`).trim(),
        vaiTro: vaiTroMap[n.vaiTro] || 'PhucVu',
        trangThai: trangThaiMap[n.trangThai] || 'HoatDong',
        ngayTao: n.ngayTao ? new Date(n.ngayTao) : new Date(),
        ngayCapNhat: new Date()
    }));
    tuTangId = Math.max(...danhSachNhanVien.map(n => n.id || 0), 0) + 1;
    luu();
    return danhSachNhanVien;
}

module.exports = {
    layDanhSach,
    layTheoId,
    layBanGhiGocTheoId,
    layTheoTenDangNhap,
    taoMoi,
    capNhat,
    doiTrangThai,
    datLaiMatKhau,
    dongBoDanhSach
};
