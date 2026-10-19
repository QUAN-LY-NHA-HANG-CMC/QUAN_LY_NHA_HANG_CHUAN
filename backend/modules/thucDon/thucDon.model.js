let danhSachMonAn = [
    {
        id: 1,
        tenMon: 'Gỏi Bò Bóp Thấu',
        danhMucId: 1,
        giaBan: 95000,
        donViTinh: 'Đĩa',
        hinhAnh: '/tepTaiLen/anhMonAn/goi-bo.jpg',
        moTa: 'Thịt bò tươi mềm bóp thấu kèm bắp chuối, đậu phộng rang giòn thơm lừng.',
        trangThai: 'DangBan', // 'DangBan', 'TamHet', 'DaXoa'
        laMonBanChay: true,
        tuyChon: [
            { tenNhom: 'Mức độ cay', batBuoc: false, loai: 'ChonMot', danhSach: [{ ten: 'Không cay', giaThem: 0 }, { ten: 'Cay vừa', giaThem: 0 }, { ten: 'Cay nhiều', giaThem: 0 }] }
        ],
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    },
    {
        id: 2,
        tenMon: 'Bò Tơ Hấp Cuốn Bánh Tráng',
        danhMucId: 2,
        giaBan: 185000,
        donViTinh: 'Phần',
        hinhAnh: '/tepTaiLen/anhMonAn/bo-to-hap.jpg',
        moTa: 'Bò tơ mềm ngọt cuốn rau rừng Tây Ninh chấm mắm nêm đặc sản.',
        trangThai: 'DangBan',
        laMonBanChay: true,
        tuyChon: [
            { tenNhom: 'Kích cỡ', batBuoc: true, loai: 'ChonMot', danhSach: [{ ten: 'Phần vừa (2 người)', giaThem: 0 }, { ten: 'Phần lớn (4 người)', giaThem: 80000 }] },
            { tenNhom: 'Món thêm', batBuoc: false, loai: 'ChonNhieu', danhSach: [{ ten: 'Thêm bánh tráng', giaThem: 10000 }, { ten: 'Thêm rau rừng', giaThem: 20000 }] }
        ],
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    },
    {
        id: 3,
        tenMon: 'Lẩu Bò Nhúng Dấm',
        danhMucId: 3,
        giaBan: 295000,
        donViTinh: 'Nồi',
        hinhAnh: '/tepTaiLen/anhMonAn/lau-bo.jpg',
        moTa: 'Nước lẩu chua thanh dịu nhẹ từ nước dừa xiêm và dấm gạo thơm, kèm bắp bò hoa.',
        trangThai: 'DangBan',
        laMonBanChay: false,
        tuyChon: [
            { tenNhom: 'Topping lẩu', batBuoc: false, loai: 'ChonNhieu', danhSach: [{ ten: 'Thêm bắp bò hoa', giaThem: 60000 }, { ten: 'Thêm mì trứng', giaThem: 15000 }] }
        ],
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    },
    {
        id: 4,
        tenMon: 'Trà Vải Hoa Nhài',
        danhMucId: 4,
        giaBan: 35000,
        donViTinh: 'Ly',
        hinhAnh: '/tepTaiLen/anhMonAn/tra-vai.jpg',
        moTa: 'Trà lài ủ lạnh thơm mát kết hợp vị vải ngọt thanh mọng nước.',
        trangThai: 'DangBan',
        laMonBanChay: true,
        tuyChon: [
            { tenNhom: 'Mức đường', batBuoc: true, loai: 'ChonMot', danhSach: [{ ten: '100% đường', giaThem: 0 }, { ten: '50% đường', giaThem: 0 }, { ten: 'Không đường', giaThem: 0 }] },
            { tenNhom: 'Mức đá', batBuoc: true, loai: 'ChonMot', danhSach: [{ ten: 'Đầy đá', giaThem: 0 }, { ten: 'Ít đá', giaThem: 0 }, { ten: 'Không đá', giaThem: 0 }] }
        ],
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    }
];

let tuTangId = 5;

async function layDanhSach({ danhMucId, trangThai, tuKhoa, giaTu, giaDen, trang = 1, soLuong = 10, chiLayDangBan = false }) {
    let ketQua = danhSachMonAn.filter(m => m.trangThai !== 'DaXoa');

    if (chiLayDangBan) {
        ketQua = ketQua.filter(m => m.trangThai === 'DangBan');
    }

    if (danhMucId) {
        ketQua = ketQua.filter(m => m.danhMucId === Number(danhMucId));
    }

    if (trangThai) {
        ketQua = ketQua.filter(m => m.trangThai === trangThai);
    }

    if (tuKhoa) {
        const tuKhoaChuan = tuKhoa.toLowerCase().trim();
        ketQua = ketQua.filter(m => m.tenMon.toLowerCase().includes(tuKhoaChuan) || (m.moTa && m.moTa.toLowerCase().includes(tuKhoaChuan)));
    }

    if (giaTu !== undefined && !isNaN(Number(giaTu))) {
        ketQua = ketQua.filter(m => m.giaBan >= Number(giaTu));
    }

    if (giaDen !== undefined && !isNaN(Number(giaDen))) {
        ketQua = ketQua.filter(m => m.giaBan <= Number(giaDen));
    }

    const tongSo = ketQua.length;
    const tongSoTrang = Math.ceil(tongSo / soLuong) || 1;
    const viTriBatDau = (trang - 1) * soLuong;
    const duLieuTrang = ketQua.slice(viTriBatDau, viTriBatDau + Number(soLuong));

    return {
        danhSach: duLieuTrang,
        phanTrang: {
            trangHienTai: Number(trang),
            soLuongMoiTrang: Number(soLuong),
            tongSoBanGhi: tongSo,
            tongSoTrang
        }
    };
}

async function layTheoId(id) {
    return danhSachMonAn.find(m => m.id === Number(id) && m.trangThai !== 'DaXoa') || null;
}

async function layTheoTen(tenMon) {
    return danhSachMonAn.find(m => m.tenMon.toLowerCase() === tenMon.toLowerCase().trim() && m.trangThai !== 'DaXoa') || null;
}

async function taoMoi(duLieu) {
    const banGhiMoi = {
        id: tuTangId++,
        tenMon: duLieu.tenMon.trim(),
        danhMucId: Number(duLieu.danhMucId),
        giaBan: Number(duLieu.giaBan),
        donViTinh: duLieu.donViTinh ? duLieu.donViTinh.trim() : 'Phần',
        hinhAnh: duLieu.hinhAnh || '',
        moTa: duLieu.moTa ? duLieu.moTa.trim() : '',
        trangThai: duLieu.trangThai || 'DangBan',
        laMonBanChay: Boolean(duLieu.laMonBanChay),
        tuyChon: Array.isArray(duLieu.tuyChon) ? duLieu.tuyChon : [],
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    };
    danhSachMonAn.push(banGhiMoi);
    return banGhiMoi;
}

async function capNhat(id, duLieu) {
    const viTri = danhSachMonAn.findIndex(m => m.id === Number(id) && m.trangThai !== 'DaXoa');
    if (viTri === -1) return null;

    danhSachMonAn[viTri] = {
        ...danhSachMonAn[viTri],
        tenMon: duLieu.tenMon !== undefined ? duLieu.tenMon.trim() : danhSachMonAn[viTri].tenMon,
        danhMucId: duLieu.danhMucId !== undefined ? Number(duLieu.danhMucId) : danhSachMonAn[viTri].danhMucId,
        giaBan: duLieu.giaBan !== undefined ? Number(duLieu.giaBan) : danhSachMonAn[viTri].giaBan,
        donViTinh: duLieu.donViTinh !== undefined ? duLieu.donViTinh.trim() : danhSachMonAn[viTri].donViTinh,
        hinhAnh: duLieu.hinhAnh !== undefined ? duLieu.hinhAnh : danhSachMonAn[viTri].hinhAnh,
        moTa: duLieu.moTa !== undefined ? duLieu.moTa.trim() : danhSachMonAn[viTri].moTa,
        trangThai: duLieu.trangThai !== undefined ? duLieu.trangThai : danhSachMonAn[viTri].trangThai,
        laMonBanChay: duLieu.laMonBanChay !== undefined ? Boolean(duLieu.laMonBanChay) : danhSachMonAn[viTri].laMonBanChay,
        tuyChon: duLieu.tuyChon !== undefined && Array.isArray(duLieu.tuyChon) ? duLieu.tuyChon : danhSachMonAn[viTri].tuyChon,
        ngayCapNhat: new Date()
    };
    return danhSachMonAn[viTri];
}

async function doiTrangThai(id, trangThaiMoi) {
    const mon = await layTheoId(id);
    if (!mon) return null;
    mon.trangThai = trangThaiMoi;
    mon.ngayCapNhat = new Date();
    return mon;
}

async function danhDauBanChay(id, laBanChay) {
    const mon = await layTheoId(id);
    if (!mon) return null;
    mon.laMonBanChay = Boolean(laBanChay);
    mon.ngayCapNhat = new Date();
    return mon;
}

async function xoaMem(id) {
    const mon = await layTheoId(id);
    if (!mon) return false;
    mon.trangThai = 'DaXoa';
    mon.ngayCapNhat = new Date();
    return true;
}

module.exports = {
    layDanhSach,
    layTheoId,
    layTheoTen,
    taoMoi,
    capNhat,
    doiTrangThai,
    danhDauBanChay,
    xoaMem
};
