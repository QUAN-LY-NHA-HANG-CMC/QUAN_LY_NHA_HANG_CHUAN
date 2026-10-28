/**
 * SERVICE HÓA ĐƠN THANH TOÁN (hoaDon.service.js)
 * Tự động tổng hợp lượt gọi món, tính tiền, giảm giá, VAT và in phiếu tạm tính (US-101 -> US-104, US-108)
 */
const hoaDonModel = require('./hoaDon.model');
const donGoiMonModel = require('../donGoiMon/donGoiMon.model');
const banAnModel = require('../banAn/banAn.model');
const khuyenMaiService = require('../khuyenMai/khuyenMai.service');
const { sinhAnhQrDataUrl, sinhUrlVietQrQuickLink } = require('../../tienIch/vietQr');

// Cấu hình thuế VAT mặc định
const THUE_VAT_MAC_DINH = 8; // 8%

/**
 * US-102 & US-103: Tự động tổng hợp toàn bộ các lượt gọi món của bàn thành một hóa đơn duy nhất
 */
async function tongHopHoaDonTuBan(banId, tuyChon = {}) {
    const ban = await banAnModel.layTheoId(banId);
    if (!ban) {
        const loi = new Error('Bàn ăn không tồn tại');
        loi.status = 404;
        throw loi;
    }

    const danhSachDon = await donGoiMonModel.layDonCuaBan(banId);
    if (!danhSachDon || danhSachDon.length === 0) {
        const loi = new Error('Bàn này chưa có lượt gọi món nào để lập hóa đơn');
        loi.status = 400;
        throw loi;
    }

    // 1. Gom toàn bộ các món không bị hủy từ tất cả các lượt gọi
    const danhSachMonHopLe = [];
    let tongTienMon = 0;
    let thoiGianVao = danhSachDon[0]?.thoiGianTao || new Date();

    danhSachDon.forEach(don => {
        if (new Date(don.thoiGianTao) < new Date(thoiGianVao)) {
            thoiGianVao = don.thoiGianTao;
        }

        don.danhSachMon.forEach(m => {
            if (m.trangThai !== 'DA_HUY') {
                tongTienMon += m.thanhTien;
                danhSachMonHopLe.push({
                    id: m.id,
                    monId: m.monId,
                    tenMon: m.tenMon,
                    size: m.size,
                    topping: m.topping,
                    donGia: m.donGia,
                    soLuong: m.soLuong,
                    thanhTien: m.thanhTien,
                    ghiChu: m.ghiChu,
                    luotGoi: don.luotGoi
                });
            }
        });
    });

    if (danhSachMonHopLe.length === 0) {
        const loi = new Error('Tất cả các món đã gọi của bàn đều đã bị hủy');
        loi.status = 400;
        throw loi;
    }

    // 2. Xử lý mã khuyến mãi (nếu có)
    let maKhuyenMai = tuyChon.maKhuyenMai || null;
    let giamGiaKhuyenMai = 0;
    if (maKhuyenMai) {
        try {
            const kqKm = await khuyenMaiService.kiemTraVaApDungMa({
                maKhuyenMai,
                tongTienTamTinh: tongTienMon
            });
            giamGiaKhuyenMai = kqKm.soTienGiam;
            maKhuyenMai = kqKm.maKhuyenMai;
        } catch (e) {
            // Nếu mã không hợp lệ, giữ thông báo lỗi
            throw e;
        }
    }

    // 3. Xử lý chiết khấu trực tiếp & phụ phí (US-101)
    const chietKhauTrucTiep = Number(tuyChon.chietKhauTrucTiep) || 0;
    const lyDoChietKhau = tuyChon.lyDoChietKhau || '';
    const phuPhi = Number(tuyChon.phuPhi) || 0;
    const lyDoPhuPhi = tuyChon.lyDoPhuPhi || '';

    // 4. Tính toán số liệu theo chuẩn kế toán (US-103)
    const tongGiamGia = giamGiaKhuyenMai + chietKhauTrucTiep;
    const tienTruocThue = Math.max(0, tongTienMon - tongGiamGia + phuPhi);
    const thueVatPhanTram = tuyChon.thueVatPhanTram !== undefined ? Number(tuyChon.thueVatPhanTram) : THUE_VAT_MAC_DINH;
    const tienThueVat = Math.round(tienTruocThue * (thueVatPhanTram / 100));
    const tongTienThanhToan = tienTruocThue + tienThueVat;

    // 5. Kiểm tra nếu bàn đã có hóa đơn chờ thanh toán -> Cập nhật; nếu chưa -> Tạo mới
    const hoaDonCho = await hoaDonModel.layHoaDonChoCuaBan(banId);
    let hoaDonKetQua = null;

    const duLieuHoaDon = {
        banId: ban.id,
        maBan: ban.maBan,
        tenBan: ban.tenBan,
        khuVucId: ban.khuVucId,
        thoiGianVao,
        danhSachMon: danhSachMonHopLe,
        tongTienMon,
        maKhuyenMai,
        giamGiaKhuyenMai,
        chietKhauTrucTiep,
        lyDoChietKhau,
        phuPhi,
        lyDoPhuPhi,
        tongGiamGia,
        tienTruocThue,
        thueVatPhanTram,
        tienThueVat,
        tongTienThanhToan,
        trangThai: 'ChoThanhToan',
        thuNganId: tuyChon.thuNganId || null,
        tenThuNgan: tuyChon.tenThuNgan || 'Thu ngân ca trực'
    };

    if (hoaDonCho) {
        hoaDonKetQua = await hoaDonModel.capNhat(hoaDonCho.id, duLieuHoaDon);
    } else {
        hoaDonKetQua = await hoaDonModel.taoMoi(duLieuHoaDon);
    }

    return hoaDonKetQua;
}

/**
 * US-104: Lấy dữ liệu phiếu tạm tính chuẩn để in ấn ra bàn cho khách kiểm tra (CSS Print)
 */
async function layPhieuTamTinh(idHoacBanId) {
    let hoaDon = null;
    // Kiểm tra là hóa đơn ID hay bàn ID
    const hoaDonId = Number(idHoacBanId);
    hoaDon = await hoaDonModel.layTheoId(hoaDonId);

    if (!hoaDon) {
        // Thử tìm theo bàn ăn ID
        hoaDon = await hoaDonModel.layHoaDonChoCuaBan(hoaDonId);
        if (!hoaDon) {
            // Tự động tổng hợp mới nếu chưa có
            hoaDon = await tongHopHoaDonTuBan(hoaDonId);
        }
    }

    if (!hoaDon) {
        const loi = new Error('Không tìm thấy thông tin hóa đơn tạm tính');
        loi.status = 404;
        throw loi;
    }

    // Sinh mã VietQR hình ảnh để in kèm lên phiếu tạm tính (khách có thể quét chuyển khoản ngay tại bàn)
    const urlVietQr = sinhUrlVietQrQuickLink({
        soTien: hoaDon.tongTienThanhToan,
        noiDungChuyenKhoan: `THANH TOAN ${hoaDon.maHoaDon} ${hoaDon.maBan}`
    });

    const qrDataUrl = await sinhAnhQrDataUrl({
        soTien: hoaDon.tongTienThanhToan,
        noiDungChuyenKhoan: `THANH TOAN ${hoaDon.maHoaDon} ${hoaDon.maBan}`
    });

    return {
        nhaHang: {
            ten: 'NHÀ HÀNG QUÁN MỘC',
            diaChi: 'Số 123 Đường Ẩm Thực, Quận Cầu Giấy, TP. Hà Nội',
            hotline: '1900 6868 - 0988.889.999',
            wifi: 'QuanMoc_Guest (Pass: 88888888)',
            website: 'quanmoc.com'
        },
        hoaDon: {
            id: hoaDon.id,
            maHoaDon: hoaDon.maHoaDon,
            banId: hoaDon.banId,
            maBan: hoaDon.maBan,
            tenBan: hoaDon.tenBan,
            thoiGianVao: hoaDon.thoiGianVao,
            thoiGianInPhieu: new Date(),
            tenThuNgan: hoaDon.tenThuNgan || 'Thu ngân ca trực',
            danhSachMon: hoaDon.danhSachMon,
            tongTienMon: hoaDon.tongTienMon,
            maKhuyenMai: hoaDon.maKhuyenMai,
            giamGiaKhuyenMai: hoaDon.giamGiaKhuyenMai,
            chietKhauTrucTiep: hoaDon.chietKhauTrucTiep,
            lyDoChietKhau: hoaDon.lyDoChietKhau,
            phuPhi: hoaDon.phuPhi,
            lyDoPhuPhi: hoaDon.lyDoPhuPhi,
            tongGiamGia: hoaDon.tongGiamGia,
            tienTruocThue: hoaDon.tienTruocThue,
            thueVatPhanTram: hoaDon.thueVatPhanTram,
            tienThueVat: hoaDon.tienThueVat,
            tongTienThanhToan: hoaDon.tongTienThanhToan,
            trangThai: hoaDon.trangThai
        },
        thanhToanVietQr: {
            urlQuickLink: urlVietQr,
            qrDataUrl: qrDataUrl,
            soTaiKhoan: '0988889999',
            nganHang: 'MBBank (Quân Đội)',
            chuTaiKhoan: 'NHA HANG QUAN MOC',
            noiDung: `THANH TOAN ${hoaDon.maHoaDon} ${hoaDon.maBan}`,
            soTien: hoaDon.tongTienThanhToan
        }
    };
}

/**
 * US-108: Hỗ trợ tách món trong bàn để thanh toán riêng theo nhu cầu của nhóm khách
 */
async function tachHoaDon(hoaDonGocId, { danhSachMonTach }) {
    const hoaDonGoc = await hoaDonModel.layTheoId(hoaDonGocId);
    if (!hoaDonGoc) {
        const loi = new Error('Hóa đơn gốc không tồn tại');
        loi.status = 404;
        throw loi;
    }

    if (hoaDonGoc.trangThai !== 'ChoThanhToan') {
        const loi = new Error('Chỉ có thể tách hóa đơn khi đang ở trạng thái chờ thanh toán');
        loi.status = 400;
        throw loi;
    }

    if (!Array.isArray(danhSachMonTach) || danhSachMonTach.length === 0) {
        const loi = new Error('Vui lòng chọn ít nhất một món để tách hóa đơn');
        loi.status = 400;
        throw loi;
    }

    const danhSachMonMoi = [];
    const danhSachMonConLai = [...hoaDonGoc.danhSachMon];

    // Xử lý từng món cần tách
    for (const itemTach of danhSachMonTach) {
        const viTri = danhSachMonConLai.findIndex(m => m.id === Number(itemTach.id));
        if (viTri === -1) {
            const loi = new Error(`Món có ID ${itemTach.id} không tồn tại trong hóa đơn`);
            loi.status = 400;
            throw loi;
        }

        const monHienTai = danhSachMonConLai[viTri];
        const soLuongTach = Number(itemTach.soLuong) || monHienTai.soLuong;

        if (soLuongTach <= 0 || soLuongTach > monHienTai.soLuong) {
            const loi = new Error(`Số lượng tách món '${monHienTai.tenMon}' không hợp lệ (Tối đa ${monHienTai.soLuong})`);
            loi.status = 400;
            throw loi;
        }

        const donGiaMon = monHienTai.thanhTien / monHienTai.soLuong;
        const thanhTienTach = Math.round(donGiaMon * soLuongTach);

        danhSachMonMoi.push({
            ...monHienTai,
            soLuong: soLuongTach,
            thanhTien: thanhTienTach
        });

        if (soLuongTach === monHienTai.soLuong) {
            // Tách hết món này
            danhSachMonConLai.splice(viTri, 1);
        } else {
            // Giảm số lượng trong hóa đơn gốc
            monHienTai.soLuong -= soLuongTach;
            monHienTai.thanhTien -= thanhTienTach;
        }
    }

    if (danhSachMonConLai.length === 0) {
        const loi = new Error('Không thể tách toàn bộ món ăn thành hóa đơn mới mà không để lại món nào ở hóa đơn gốc');
        loi.status = 400;
        throw loi;
    }

    // Tính lại tiền hóa đơn gốc
    const tongTienGoc = danhSachMonConLai.reduce((t, m) => t + m.thanhTien, 0);
    const vatGoc = Math.round(tongTienGoc * (hoaDonGoc.thueVatPhanTram / 100));
    await hoaDonModel.capNhat(hoaDonGoc.id, {
        danhSachMon: danhSachMonConLai,
        tongTienMon: tongTienGoc,
        giamGiaKhuyenMai: 0, // Reset voucher khi tách món để tính lại
        chietKhauTrucTiep: 0,
        tongGiamGia: 0,
        tienTruocThue: tongTienGoc,
        tienThueVat: vatGoc,
        tongTienThanhToan: tongTienGoc + vatGoc
    });

    // Tạo hóa đơn tách mới
    const tongTienMoi = danhSachMonMoi.reduce((t, m) => t + m.thanhTien, 0);
    const vatMoi = Math.round(tongTienMoi * (THUE_VAT_MAC_DINH / 100));
    const hoaDonTachMoi = await hoaDonModel.taoMoi({
        maHoaDon: `${hoaDonGoc.maHoaDon}-T1`,
        banId: hoaDonGoc.banId,
        maBan: hoaDonGoc.maBan,
        tenBan: hoaDonGoc.tenBan,
        khuVucId: hoaDonGoc.khuVucId,
        thoiGianVao: hoaDonGoc.thoiGianVao,
        danhSachMon: danhSachMonMoi,
        tongTienMon: tongTienMoi,
        tongGiamGia: 0,
        tienTruocThue: tongTienMoi,
        thueVatPhanTram: THUE_VAT_MAC_DINH,
        tienThueVat: vatMoi,
        tongTienThanhToan: tongTienMoi + vatMoi,
        hoaDonGocId: hoaDonGoc.id,
        thuNganId: hoaDonGoc.thuNganId,
        tenThuNgan: hoaDonGoc.tenThuNgan
    });

    return {
        hoaDonGoc: await hoaDonModel.layTheoId(hoaDonGoc.id),
        hoaDonTachMoi
    };
}

module.exports = {
    tongHopHoaDonTuBan,
    layPhieuTamTinh,
    tachHoaDon
};
