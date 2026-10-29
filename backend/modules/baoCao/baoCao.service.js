/**
 * SERVICE THỐNG KÊ & BÁO CÁO DOANH THU (baoCao.service.js)
 * Phân tích dữ liệu kinh doanh, lập báo cáo và xuất CSV/Excel (US-123 -> US-134)
 */
const hoaDonModel = require('../hoaDon/hoaDon.model');
const donGoiMonModel = require('../donGoiMon/donGoiMon.model');
const thucDonModel = require('../thucDon/thucDon.model');
const danhMucModel = require('../danhMucMon/danhMucMon.model');
const banAnModel = require('../banAn/banAn.model');
const { chuyenDoiSangCsv } = require('../../tienIch/xuatCsv');

/**
 * US-123: Xem Dashboard tổng quan trong ngày
 */
async function layDashboardTongQuan(ngay = null) {
    const targetDate = ngay ? new Date(ngay) : new Date();
    const dauNgay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0);
    const cuoiNgay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59);

    const danhSachHoaDon = await hoaDonModel.layTatCa({
        trangThai: 'DaThanhToan',
        tuNgay: dauNgay,
        denNgay: cuoiNgay
    });

    let tongDoanhThu = 0;
    let doanhThuTienMat = 0;
    let doanhThuChuyenKhoan = 0;
    let tongTienGiamGia = 0;
    let tongTienVat = 0;

    danhSachHoaDon.forEach(hd => {
        tongDoanhThu += hd.tongTienThanhToan;
        tongTienGiamGia += hd.tongGiamGia || 0;
        tongTienVat += hd.tienThueVat || 0;

        if (hd.phuongThucThanhToan === 'TIEN_MAT') {
            doanhThuTienMat += hd.tongTienThanhToan;
        } else {
            doanhThuChuyenKhoan += hd.tongTienThanhToan;
        }
    });

    const soHoaDon = danhSachHoaDon.length;
    const giaTriTrungBinhDon = soHoaDon > 0 ? Math.round(tongDoanhThu / soHoaDon) : 0;

    // Lấy thông tin sơ đồ bàn ăn hiện tại
    const danhSachBan = await banAnModel.layTatCa();
    const soBanDangPhucVu = danhSachBan.filter(b => b.trangThai === 'DangPhucVu').length;
    const soBanTrong = danhSachBan.filter(b => b.trangThai === 'Trong').length;
    const tongSoBan = danhSachBan.length;

    return {
        ngayBaoCao: dauNgay.toISOString().slice(0, 10),
        tongDoanhThu,
        doanhThuTienMat,
        doanhThuChuyenKhoan,
        tongTienGiamGia,
        tongTienVat,
        soHoaDon,
        giaTriTrungBinhDon,
        banAn: {
            tongSoBan,
            soBanDangPhucVu,
            soBanTrong,
            tyLeLapDay: tongSoBan > 0 ? `${Math.round((soBanDangPhucVu / tongSoBan) * 100)}%` : '0%'
        }
    };
}

/**
 * US-124: Xem biểu đồ doanh thu theo ngày, tuần, tháng
 */
async function layBieuDoDoanhThu({ kieu = 'ngay', soNgay = 7 } = {}) {
    const tatCaHoaDon = await hoaDonModel.layTatCa({ trangThai: 'DaThanhToan' });
    const duLieuMap = {};

    // Khởi tạo các mốc thời gian gần nhất
    const today = new Date();
    for (let i = Number(soNgay) - 1; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        duLieuMap[key] = {
            ngay: key,
            nhan: `${d.getDate()}/${d.getMonth() + 1}`,
            doanhThu: 0,
            soDon: 0
        };
    }

    tatCaHoaDon.forEach(hd => {
        const dateStr = new Date(hd.thoiGianTao).toISOString().slice(0, 10);
        if (duLieuMap[dateStr]) {
            duLieuMap[dateStr].doanhThu += hd.tongTienThanhToan;
            duLieuMap[dateStr].soDon += 1;
        }
    });

    return Object.values(duLieuMap);
}

/**
 * US-125: Thống kê tỷ trọng phương thức thanh toán
 */
async function layTyTrongThanhToan({ tuNgay, denNgay } = {}) {
    const danhSach = await hoaDonModel.layTatCa({ trangThai: 'DaThanhToan', tuNgay, denNgay });
    let tienMat = 0;
    let chuyenKhoan = 0;
    let soDonTienMat = 0;
    let soDonChuyenKhoan = 0;

    danhSach.forEach(hd => {
        if (hd.phuongThucThanhToan === 'TIEN_MAT') {
            tienMat += hd.tongTienThanhToan;
            soDonTienMat++;
        } else {
            chuyenKhoan += hd.tongTienThanhToan;
            soDonChuyenKhoan++;
        }
    });

    const tongTien = tienMat + chuyenKhoan;
    return {
        tongTien,
        tienMat: {
            soTien: tienMat,
            soDon: soDonTienMat,
            tyLePhanTram: tongTien > 0 ? Number(((tienMat / tongTien) * 100).toFixed(1)) : 0
        },
        chuyenKhoanVietQr: {
            soTien: chuyenKhoan,
            soDon: soDonChuyenKhoan,
            tyLePhanTram: tongTien > 0 ? Number(((chuyenKhoan / tongTien) * 100).toFixed(1)) : 0
        }
    };
}

/**
 * US-126: Thống kê doanh thu theo từng danh mục thực đơn
 */
async function layDoanhThuTheoDanhMuc() {
    const dsDanhMuc = await danhMucModel.layTatCa();
    const { danhSach: dsMon } = await thucDonModel.layDanhSach({ soLuong: 1000 });
    const dsHoaDon = await hoaDonModel.layTatCa({ trangThai: 'DaThanhToan' });

    const danhMucMap = {};
    dsDanhMuc.forEach(dm => {
        danhMucMap[dm.id] = {
            danhMucId: dm.id,
            tenDanhMuc: dm.tenDanhMuc,
            tongSoLuongBan: 0,
            tongDoanhThu: 0
        };
    });

    // Tạo bản đồ tra cứu danh mục của từng món
    const monToDanhMucMap = {};
    dsMon.forEach(m => {
        monToDanhMucMap[m.id] = m.danhMucId;
    });

    dsHoaDon.forEach(hd => {
        hd.danhSachMon.forEach(item => {
            const danhMucId = monToDanhMucMap[item.monId] || 1;
            if (danhMucMap[danhMucId]) {
                danhMucMap[danhMucId].tongSoLuongBan += Number(item.soLuong) || 1;
                danhMucMap[danhMucId].tongDoanhThu += Number(item.thanhTien) || 0;
            }
        });
    });

    return Object.values(danhMucMap).sort((a, b) => b.tongDoanhThu - a.tongDoanhThu);
}

/**
 * US-127 & US-128: Bảng xếp hạng Top món bán chạy và món ít người gọi
 */
async function layXepHangMonAn({ gioiHan = 10 } = {}) {
    const { danhSach: dsMon } = await thucDonModel.layDanhSach({ soLuong: 1000 });
    const dsHoaDon = await hoaDonModel.layTatCa({ trangThai: 'DaThanhToan' });

    const thongKeMon = {};
    dsMon.forEach(m => {
        thongKeMon[m.id] = {
            monId: m.id,
            tenMon: m.tenMon,
            donGia: m.giaBan,
            soLuongBan: 0,
            doanhThu: 0
        };
    });

    dsHoaDon.forEach(hd => {
        hd.danhSachMon.forEach(item => {
            if (thongKeMon[item.monId]) {
                thongKeMon[item.monId].soLuongBan += Number(item.soLuong) || 1;
                thongKeMon[item.monId].doanhThu += Number(item.thanhTien) || 0;
            }
        });
    });

    const danhSach = Object.values(thongKeMon);

    // Sắp xếp giảm dần theo số lượng bán (US-127)
    const topBanChay = [...danhSach]
        .filter(m => m.soLuongBan > 0)
        .sort((a, b) => b.soLuongBan - a.soLuongBan)
        .slice(0, Number(gioiHan));

    // Sắp xếp tăng dần để tìm các món ít người gọi nhất (US-128)
    const topBanCham = [...danhSach]
        .sort((a, b) => a.soLuongBan - b.soLuongBan)
        .slice(0, Number(gioiHan));

    return {
        topBanChay,
        topBanCham
    };
}

/**
 * US-129: Thống kê khung giờ cao điểm trong ngày
 */
async function layThongKeKhungGioCaoDiem() {
    const dsHoaDon = await hoaDonModel.layTatCa({ trangThai: 'DaThanhToan' });
    const gioMap = {};

    for (let h = 0; h < 24; h++) {
        const gioStr = `${String(h).padStart(2, '0')}:00 - ${String(h).padStart(2, '0')}:59`;
        gioMap[h] = {
            khungGio: gioStr,
            soDon: 0,
            doanhThu: 0
        };
    }

    dsHoaDon.forEach(hd => {
        const gio = new Date(hd.thoiGianTao).getHours();
        if (gioMap[gio]) {
            gioMap[gio].soDon += 1;
            gioMap[gio].doanhThu += hd.tongTienThanhToan;
        }
    });

    // Lọc ra các khung giờ có hoạt động hoặc top giờ cao điểm
    const danhSachGio = Object.values(gioMap);
    const topKhungGio = [...danhSachGio].sort((a, b) => b.doanhThu - a.doanhThu).slice(0, 5);

    return {
        tatCaKhungGio: danhSachGio,
        topKhungGioCaoDiem: topKhungGio
    };
}

/**
 * US-130: Thống kê tỷ lệ đơn hủy và giá trị hủy món
 */
async function layThongKeDonHuy() {
    const tatCaDon = await donGoiMonModel.layTatCa();
    let tongMonDat = 0;
    let soMonBiHuy = 0;
    let tongGiaTriHuy = 0;

    tatCaDon.forEach(don => {
        don.danhSachMon.forEach(m => {
            tongMonDat += m.soLuong;
            if (m.trangThai === 'DA_HUY') {
                soMonBiHuy += m.soLuong;
                tongGiaTriHuy += m.thanhTien;
            }
        });
    });

    const tyLeHuy = tongMonDat > 0 ? Number(((soMonBiHuy / tongMonDat) * 100).toFixed(1)) : 0;

    return {
        tongMonDat,
        soMonBiHuy,
        tongGiaTriHuy,
        tyLeHuyPhanTram: `${tyLeHuy}%`
    };
}

/**
 * US-131 & US-132: Tra cứu lịch sử hóa đơn và chi tiết
 */
async function traCuuLichSuHoaDon(boLoc = {}) {
    return await hoaDonModel.layTatCa(boLoc);
}

/**
 * US-133: Xuất báo cáo danh sách hóa đơn ra file CSV chuẩn UTF-8 BOM
 */
async function xuatCsvHoaDon(boLoc = {}) {
    const danhSach = await hoaDonModel.layTatCa(boLoc);

    const duLieuXuat = danhSach.map(hd => ({
        maHoaDon: hd.maHoaDon,
        tenBan: hd.tenBan,
        khuVuc: hd.tenKhuVuc,
        thoiGianVao: new Date(hd.thoiGianVao).toLocaleString('vi-VN'),
        thoiGianThanhToan: hd.thoiGianThanhToan ? new Date(hd.thoiGianThanhToan).toLocaleString('vi-VN') : 'Chưa thanh toán',
        tongTienMon: hd.tongTienMon,
        giamGia: hd.tongGiamGia,
        phuPhi: hd.phuPhi,
        thueVat: hd.tienThueVat,
        tongTienThanhToan: hd.tongTienThanhToan,
        phuongThuc: hd.phuongThucThanhToan === 'TIEN_MAT' ? 'Tiền mặt' : (hd.phuongThucThanhToan === 'CHUYEN_KHOAN_VIETQR' ? 'Chuyển khoản VietQR' : 'Chưa chọn'),
        thuNgan: hd.tenThuNgan,
        trangThai: hd.trangThai === 'DaThanhToan' ? 'Đã thanh toán' : (hd.trangThai === 'ChoThanhToan' ? 'Chờ thanh toán' : 'Đã hủy')
    }));

    const cotCauHinh = [
        { khoa: 'maHoaDon', tieuDe: 'Mã Hóa Đơn' },
        { khoa: 'tenBan', tieuDe: 'Bàn Ăn' },
        { khoa: 'khuVuc', tieuDe: 'Khu Vực' },
        { khoa: 'thoiGianVao', tieuDe: 'Thời Gian Vào' },
        { khoa: 'thoiGianThanhToan', tieuDe: 'Thời Gian Thanh Toán' },
        { khoa: 'tongTienMon', tieuDe: 'Tiền Món (VNĐ)' },
        { khoa: 'giamGia', tieuDe: 'Giảm Giá (VNĐ)' },
        { khoa: 'phuPhi', tieuDe: 'Phụ Phí (VNĐ)' },
        { khoa: 'thueVat', tieuDe: 'Thuế VAT (VNĐ)' },
        { khoa: 'tongTienThanhToan', tieuDe: 'Tổng Thanh Toán (VNĐ)' },
        { khoa: 'phuongThuc', tieuDe: 'Phương Thức' },
        { khoa: 'thuNgan', tieuDe: 'Thu Ngân' },
        { khoa: 'trangThai', tieuDe: 'Trạng Thái' }
    ];

    return chuyenDoiSangCsv(duLieuXuat, cotCauHinh);
}

/**
 * US-134: Xuất danh mục thực đơn ra file CSV chuẩn UTF-8 BOM
 */
async function xuatCsvThucDon() {
    const { danhSach: dsMon } = await thucDonModel.layDanhSach({ soLuong: 1000 });
    const dsDanhMuc = await danhMucModel.layTatCa();

    const dmMap = {};
    dsDanhMuc.forEach(d => { dmMap[d.id] = d.tenDanhMuc; });

    const duLieuXuat = dsMon.map(m => ({
        id: m.id,
        tenMon: m.tenMon,
        danhMuc: dmMap[m.danhMucId] || 'Chung',
        giaBan: m.giaBan,
        donViTinh: m.donViTinh,
        trangThai: m.trangThai === 'DangBan' ? 'Đang bán' : (m.trangThai === 'TamHet' ? 'Tạm hết' : 'Ẩn'),
        laMonBanChay: m.laMonBanChay ? 'Có' : 'Không',
        moTa: m.moTa || ''
    }));

    const cotCauHinh = [
        { khoa: 'id', tieuDe: 'ID Món' },
        { khoa: 'tenMon', tieuDe: 'Tên Món Ăn' },
        { khoa: 'danhMuc', tieuDe: 'Danh Mục' },
        { khoa: 'giaBan', tieuDe: 'Đơn Giá (VNĐ)' },
        { khoa: 'donViTinh', tieuDe: 'Đơn Vị Tính' },
        { khoa: 'trangThai', tieuDe: 'Trạng Thái' },
        { khoa: 'laMonBanChay', tieuDe: 'Món Bán Chạy' },
        { khoa: 'moTa', tieuDe: 'Mô Tả' }
    ];

    return chuyenDoiSangCsv(duLieuXuat, cotCauHinh);
}

module.exports = {
    layDashboardTongQuan,
    layBieuDoDoanhThu,
    layTyTrongThanhToan,
    layDoanhThuTheoDanhMuc,
    layXepHangMonAn,
    layThongKeKhungGioCaoDiem,
    layThongKeDonHuy,
    traCuuLichSuHoaDon,
    xuatCsvHoaDon,
    xuatCsvThucDon
};
