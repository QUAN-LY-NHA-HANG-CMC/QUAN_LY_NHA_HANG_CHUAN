const { docDuLieu, ghiDuLieu } = require('../../tienIch/luuTruDuLieu');

const duLieuThucDonMacDinh = [
    {
        id: 1,
        maMon: 'MON-01',
        tenMon: 'Gà Nướng Ống Tre Tây Bắc',
        danhMucId: 2,
        giaBan: 245000,
        donViTinh: 'Con',
        hinhAnh: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop&q=80',
        moTa: 'Gà đồi thả vườn ướp hạt dổi, mắc khén nướng trong ống tre thơm lừng, thịt mềm ngọt đậm vị.',
        trangThai: 'DangBan',
        laMonBanChay: true,
        tuyChonSize: [
            { ten: 'Nửa con', giaCongThem: -100000 },
            { ten: 'Nguyên con tiêu chuẩn', giaCongThem: 0 },
            { ten: 'Nguyên con cỡ lớn (2kg)', giaCongThem: 60000 }
        ],
        tuyChonTopping: [
            { ten: 'Xôi nếp nương nướng', gia: 35000 },
            { ten: 'Muối chấm chẩm chéo đặc biệt', gia: 15000 }
        ],
        tuyChon: [],
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    },
    {
        id: 2,
        maMon: 'MON-02',
        tenMon: 'Lẩu Gà Lá É Tao Ngộ',
        danhMucId: 3,
        giaBan: 289000,
        donViTinh: 'Nồi',
        hinhAnh: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=600&auto=format&fit=crop&q=80',
        moTa: 'Hương vị chuẩn Đà Lạt, nước dùng thanh ngọt nấu nấm samco và thịt gà ta, dậy mùi thơm lá é.',
        trangThai: 'DangBan',
        laMonBanChay: true,
        tuyChonSize: [
            { ten: 'Nồi vừa (2 - 3 người)', giaCongThem: 0 },
            { ten: 'Nồi lớn (4 - 6 người)', giaCongThem: 90000 }
        ],
        tuyChonTopping: [
            { ten: 'Đĩa lá é tươi thêm', gia: 25000 },
            { ten: 'Bún tươi thêm', gia: 15000 },
            { ten: 'Đĩa nấm samco thêm', gia: 35000 }
        ],
        tuyChon: [],
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    },
    {
        id: 3,
        maMon: 'MON-03',
        tenMon: 'Bò Tơ Nướng Tảng Sốt Tiêu Rừng',
        danhMucId: 2,
        giaBan: 260000,
        donViTinh: 'Phần',
        hinhAnh: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80',
        moTa: 'Thịt bò tơ tươi nướng trên than hoa giữ trọn độ mọng nước, kèm sốt tiêu rừng cay the dịu dàng.',
        trangThai: 'DangBan',
        laMonBanChay: true,
        tuyChonSize: [
            { ten: 'Phần 300g', giaCongThem: 0 },
            { ten: 'Phần 500g', giaCongThem: 140000 }
        ],
        tuyChonTopping: [
            { ten: 'Bánh mì nướng bơ tỏi', gia: 20000 },
            { ten: 'Khoai tây múi cau chiên', gia: 35000 }
        ],
        tuyChon: [],
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    },
    {
        id: 4,
        maMon: 'MON-04',
        tenMon: 'Cơm Cháy Kho Quẹt Nam Bộ',
        danhMucId: 1,
        giaBan: 95000,
        donViTinh: 'Đĩa',
        hinhAnh: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80',
        moTa: 'Cơm cháy đáy nồi giòn rụm chấm cùng niêu kho quẹt tôm khô tóp mỡ đậm đà, ăn kèm rau củ luộc.',
        trangThai: 'DangBan',
        laMonBanChay: true,
        tuyChonSize: [],
        tuyChonTopping: [
            { ten: 'Tóp mỡ kho quẹt thêm', gia: 30000 },
            { ten: 'Cơm cháy giòn thêm', gia: 25000 }
        ],
        tuyChon: [],
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    },
    {
        id: 5,
        maMon: 'MON-05',
        tenMon: 'Mực Một Nắng Nướng Sa Tế',
        danhMucId: 4,
        giaBan: 185000,
        donViTinh: 'Con',
        hinhAnh: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80',
        moTa: 'Mực câu Phan Thiết phơi một nắng dẻo thơm, tẩm ướp sa tế cay nồng nướng than hồng.',
        trangThai: 'TamHet',
        laMonBanChay: false,
        tuyChonSize: [],
        tuyChonTopping: [],
        tuyChon: [],
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    },
    {
        id: 6,
        maMon: 'MON-06',
        tenMon: 'Gỏi Ngó Sen Tôm Thịt Hoa Chuối',
        danhMucId: 1,
        giaBan: 110000,
        donViTinh: 'Đĩa',
        hinhAnh: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
        moTa: 'Ngó sen giòn sần sật, tôm sú bóc nõn, thịt ba chỉ luộc trộn cùng nước mắm chua ngọt và bánh phồng tôm.',
        trangThai: 'DangBan',
        laMonBanChay: false,
        tuyChonSize: [],
        tuyChonTopping: [
            { ten: 'Bánh phồng tôm chiên thêm', gia: 15000 }
        ],
        tuyChon: [],
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    },
    {
        id: 7,
        maMon: 'MON-07',
        tenMon: 'Rau Rừng Gia Lai Xào Tỏi',
        danhMucId: 5,
        giaBan: 75000,
        donViTinh: 'Đĩa',
        hinhAnh: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
        moTa: 'Rau dớn, rau lủi hái trên nương rẫy xanh mướt, xào thơm nức mũi với tỏi Lý Sơn giã dập.',
        trangThai: 'DangBan',
        laMonBanChay: false,
        tuyChonSize: [],
        tuyChonTopping: [],
        tuyChon: [],
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    },
    {
        id: 8,
        maMon: 'MON-08',
        tenMon: 'Trà Sen Vàng Củ Năng Hạt Sen',
        danhMucId: 6,
        giaBan: 45000,
        donViTinh: 'Ly',
        hinhAnh: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80',
        moTa: 'Trà ô long ướp hoa sen thanh nhã, thạch củ năng giòn ngọt và hạt sen bùi béo, phủ lớp kem sữa.',
        trangThai: 'DangBan',
        laMonBanChay: true,
        tuyChonSize: [
            { ten: 'Size M (Tiêu chuẩn)', giaCongThem: 0 },
            { ten: 'Size L (Khổng lồ)', giaCongThem: 10000 }
        ],
        tuyChonTopping: [
            { ten: 'Thạch củ năng thêm', gia: 10000 },
            { ten: 'Kem cheese béo ngậy', gia: 12000 }
        ],
        tuyChon: [],
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    },
    {
        id: 9,
        maMon: 'MON-09',
        tenMon: 'Trà Vải Hoa Nhài',
        danhMucId: 6,
        giaBan: 35000,
        donViTinh: 'Ly',
        hinhAnh: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
        moTa: 'Trà lài ủ lạnh thơm mát kết hợp vị vải ngọt thanh mọng nước.',
        trangThai: 'DangBan',
        laMonBanChay: true,
        tuyChonSize: [],
        tuyChonTopping: [],
        tuyChon: [],
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    },
    {
        id: 10,
        maMon: 'MON-10',
        tenMon: 'Lẩu Bò Nhúng Dấm',
        danhMucId: 3,
        giaBan: 295000,
        donViTinh: 'Nồi',
        hinhAnh: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=600&auto=format&fit=crop&q=80',
        moTa: 'Nước lẩu chua thanh dịu nhẹ từ nước dừa xiêm và dấm gạo thơm, kèm bắp bò hoa.',
        trangThai: 'DangBan',
        laMonBanChay: false,
        tuyChonSize: [],
        tuyChonTopping: [],
        tuyChon: [],
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    },
    {
        id: 11,
        maMon: 'MON-11',
        tenMon: 'Bò Tơ Hấp Cuốn Bánh Tráng',
        danhMucId: 2,
        giaBan: 185000,
        donViTinh: 'Phần',
        hinhAnh: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
        moTa: 'Bò tơ mềm ngọt cuốn rau rừng Tây Ninh chấm mắm nêm đặc sản.',
        trangThai: 'DangBan',
        laMonBanChay: true,
        tuyChonSize: [],
        tuyChonTopping: [],
        tuyChon: [],
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    },
    {
        id: 12,
        maMon: 'MON-12',
        tenMon: 'Gỏi Bò Bóp Thấu',
        danhMucId: 1,
        giaBan: 95000,
        donViTinh: 'Đĩa',
        hinhAnh: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
        moTa: 'Thịt bò tươi mềm bóp thấu kèm bắp chuối, đậu phộng rang giòn thơm lừng.',
        trangThai: 'DangBan',
        laMonBanChay: false,
        tuyChonSize: [],
        tuyChonTopping: [],
        tuyChon: [],
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    }
];

let danhSachMonAn = docDuLieu('thucDon', duLieuThucDonMacDinh);
let tuTangId = Math.max(...danhSachMonAn.map(m => m.id || 0), 0) + 1;

function luu() {
    ghiDuLieu('thucDon', danhSachMonAn);
}

async function layDanhSach({ danhMucId, trangThai, tuKhoa, giaTu, giaDen, trang = 1, soLuong = 20, chiLayDangBan = false } = {}) {
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
        ketQua = ketQua.filter(m => (m.tenMon && m.tenMon.toLowerCase().includes(tuKhoaChuan)) || (m.moTa && m.moTa.toLowerCase().includes(tuKhoaChuan)));
    }

    if (giaTu !== undefined && !isNaN(Number(giaTu))) {
        ketQua = ketQua.filter(m => m.giaBan >= Number(giaTu));
    }

    if (giaDen !== undefined && !isNaN(Number(giaDen))) {
        ketQua = ketQua.filter(m => m.giaBan <= Number(giaDen));
    }

    const tongSo = ketQua.length;
    const soLuongNum = Number(soLuong) || 20;
    const trangNum = Number(trang) || 1;
    const tongSoTrang = Math.ceil(tongSo / soLuongNum) || 1;
    const viTriBatDau = (trangNum - 1) * soLuongNum;
    const duLieuTrang = ketQua.slice(viTriBatDau, viTriBatDau + soLuongNum);

    return {
        danhSach: duLieuTrang,
        phanTrang: {
            trangHienTai: trangNum,
            soLuongMoiTrang: soLuongNum,
            tongSoBanGhi: tongSo,
            tongSoTrang
        }
    };
}

async function layTheoId(id) {
    if (!id) return null;
    return danhSachMonAn.find(m => (m.id === Number(id) || (m.maMon && m.maMon.toLowerCase() === String(id).toLowerCase().trim())) && m.trangThai !== 'DaXoa') || null;
}

async function layTheoTen(tenMon) {
    if (!tenMon) return null;
    return danhSachMonAn.find(m => m.tenMon && m.tenMon.toLowerCase() === tenMon.toLowerCase().trim() && m.trangThai !== 'DaXoa') || null;
}

async function taoMoi(duLieu) {
    const banGhiMoi = {
        id: tuTangId++,
        maMon: duLieu.maMon || `MON-${tuTangId}`,
        tenMon: duLieu.tenMon.trim(),
        danhMucId: Number(duLieu.danhMucId),
        giaBan: Number(duLieu.giaBan),
        donViTinh: duLieu.donViTinh ? duLieu.donViTinh.trim() : 'Phần',
        hinhAnh: duLieu.hinhAnh || '',
        moTa: duLieu.moTa ? duLieu.moTa.trim() : '',
        trangThai: duLieu.trangThai || 'DangBan',
        laMonBanChay: Boolean(duLieu.laMonBanChay),
        tuyChon: Array.isArray(duLieu.tuyChon) ? duLieu.tuyChon : [],
        tuyChonSize: Array.isArray(duLieu.tuyChonSize) ? duLieu.tuyChonSize : [],
        tuyChonTopping: Array.isArray(duLieu.tuyChonTopping) ? duLieu.tuyChonTopping : [],
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    };
    danhSachMonAn.push(banGhiMoi);
    luu();
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
        tuyChonSize: duLieu.tuyChonSize !== undefined && Array.isArray(duLieu.tuyChonSize) ? duLieu.tuyChonSize : danhSachMonAn[viTri].tuyChonSize,
        tuyChonTopping: duLieu.tuyChonTopping !== undefined && Array.isArray(duLieu.tuyChonTopping) ? duLieu.tuyChonTopping : danhSachMonAn[viTri].tuyChonTopping,
        ngayCapNhat: new Date()
    };
    luu();
    return danhSachMonAn[viTri];
}

async function doiTrangThai(id, trangThaiMoi) {
    const mon = await layTheoId(id);
    if (!mon) return null;
    mon.trangThai = trangThaiMoi;
    mon.ngayCapNhat = new Date();
    luu();
    return mon;
}

async function danhDauBanChay(id, laBanChay) {
    const mon = await layTheoId(id);
    if (!mon) return null;
    mon.laMonBanChay = Boolean(laBanChay);
    mon.ngayCapNhat = new Date();
    luu();
    return mon;
}

async function xoaMem(id) {
    const mon = await layTheoId(id);
    if (!mon) return false;
    mon.trangThai = 'DaXoa';
    mon.ngayCapNhat = new Date();
    luu();
    return true;
}

async function dongBoDanhSach(danhSachMoi) {
    if (!Array.isArray(danhSachMoi)) return danhSachMonAn;
    danhSachMonAn = danhSachMoi.map((m, idx) => ({
        id: Number(m.id) || (idx + 1),
        maMon: (m.maMon || `MON-${m.id || (idx + 1)}`).trim(),
        tenMon: (m.tenMon || m.ten || `Món ${m.id}`).trim(),
        danhMucId: m.danhMucId ? Number(m.danhMucId) : 1,
        giaBan: m.giaBan !== undefined ? Number(m.giaBan) : 0,
        donViTinh: (m.donViTinh || 'Phần').trim(),
        hinhAnh: m.hinhAnh || '',
        moTa: (m.moTa || '').trim(),
        trangThai: (m.trangThai === -1 || m.trangThai === 'DaXoa' || m.trangThai === 'da_xoa') ? 'DaXoa' : ((m.trangThai === 1 || m.trangThai === 'DangBan' || m.trangThai === 'HoatDong') ? 'DangBan' : 'TamHet'),
        laMonBanChay: Boolean(m.laMonBanChay || m.noiBat),
        tuyChon: Array.isArray(m.tuyChon) ? m.tuyChon : [],
        tuyChonSize: Array.isArray(m.tuyChonSize) ? m.tuyChonSize : [],
        tuyChonTopping: Array.isArray(m.tuyChonTopping) ? m.tuyChonTopping : [],
        ngayTao: m.ngayTao ? new Date(m.ngayTao) : new Date(),
        ngayCapNhat: new Date()
    }));
    tuTangId = Math.max(...danhSachMonAn.map(m => m.id || 0), 0) + 1;
    luu();
    return danhSachMonAn;
}

module.exports = {
    layDanhSach,
    layTheoId,
    layTheoTen,
    taoMoi,
    capNhat,
    doiTrangThai,
    danhDauBanChay,
    xoaMem,
    dongBoDanhSach
};
