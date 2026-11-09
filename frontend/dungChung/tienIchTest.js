/**
 * TIỆN ÍCH KIỂM THỬ & DỌN DẸP DỮ LIỆU TEST (tienIchTest.js)
 * Giúp Tester / Lập trình viên reset nhanh dữ liệu ở từng chức năng và toàn hệ thống
 * Hỗ trợ đồng bộ dọn sạch cả LocalStorage trình duyệt và CSDL Backend SQL/JSON.
 */

class TienIchTestModule {
    constructor() {
        console.log('[TienIchTest] Đã nạp Module Tiện ích Kiểm thử & Dọn dẹp dữ liệu.');
    }

    /**
     * Mở Modal trung tâm quản lý & reset dữ liệu kiểm thử
     */
    moModalResetTest() {
        const modal = document.getElementById('khung-modal-toan-cuc');
        if (!modal) return;

        modal.innerHTML = `
            <div class="hop-modal" style="max-width: 620px;">
                <div class="hop-modal-dau" style="background: linear-gradient(135deg, #b91c1c, #dc2626); color: #fff; padding: 14px 20px; border-top-left-radius: 12px; border-top-right-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; font-size: 1.15rem; display: flex; align-items: center; gap: 8px;">
                        <span>🧹</span> TIỆN ÍCH QUẢN LÝ & RESET DỮ LIỆU TEST
                    </h3>
                    <button class="nut-dong-modal" onclick="window.tienIchTest.dongModal()" style="color: #fff; font-size: 24px; background: none; border: none; cursor: pointer;">&times;</button>
                </div>
                <div class="hop-modal-than" style="padding: 20px;">
                    <p style="margin: 0 0 16px 0; color: var(--mau-chu-phu); font-size: 0.95rem; line-height: 1.5;">
                        Chọn thao tác làm sạch dữ liệu kiểm thử (Tự động xóa cả trong LocalStorage trình duyệt và CSDL Backend SQL/JSON để bạn tiếp tục test):
                    </p>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <!-- Nút 1: Reset toàn diện -->
                        <div style="border: 1px solid #fecaca; background: #fff5f5; border-radius: 8px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: #b91c1c; font-size: 0.95rem;">⚡ Xóa TOÀN BỘ dữ liệu test (Full Clean Reset)</strong>
                                <div style="font-size: 0.85rem; color: #7f1d1d; margin-top: 2px;">
                                    Đặt lại 12 bàn thành BÀN TRỐNG, xóa sạch đơn gọi, xóa hàng đợi bếp KDS, hóa đơn POS và reset ca quỹ.
                                    <br><em style="color: #15803d; font-weight: 500;">(Vẫn bảo toàn Thực đơn, Danh mục món, Nhân viên và Cấu hình nhà hàng)</em>
                                </div>
                            </div>
                            <button type="button" class="nut nut-nguy-hiem nut-nho" style="white-space: nowrap; margin-left: 12px;" onclick="window.tienIchTest.xoaTatCaDuLieuTest()">
                                ⚡ Làm sạch tất cả
                            </button>
                        </div>

                        <!-- Nút 2: Reset Sơ đồ bàn POS -->
                        <div style="border: 1px solid #fed7aa; background: #fffbeb; border-radius: 8px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: #c2410c; font-size: 0.95rem;">🪑 Reset Sơ đồ bàn POS & Đơn bàn</strong>
                                <div style="font-size: 0.85rem; color: #7c2d12; margin-top: 2px;">
                                    Giải phóng tất cả bàn về "Bàn trống sẵn sàng", xóa phiên phục vụ và đơn gọi món.
                                </div>
                            </div>
                            <button type="button" class="nut nut-phu nut-nho" style="white-space: nowrap; margin-left: 12px; color: #c2410c; border-color: #f97316;" onclick="window.tienIchTest.resetSoDoBan()">
                                🪑 Reset bàn
                            </button>
                        </div>

                        <!-- Nút 3: Reset Bếp KDS -->
                        <div style="border: 1px solid #bbf7d0; background: #f0fdf4; border-radius: 8px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: #15803d; font-size: 0.95rem;">👨‍🍳 Làm sạch Hàng đợi Bếp KDS</strong>
                                <div style="font-size: 0.85rem; color: #14532d; margin-top: 2px;">
                                    Xóa tất cả các đơn món đang chờ chế biến, đang nấu và đã xong trên màn hình điều phối bếp.
                                </div>
                            </div>
                            <button type="button" class="nut nut-phu nut-nho" style="white-space: nowrap; margin-left: 12px; color: #16a34a; border-color: #22c55e;" onclick="window.tienIchTest.resetBepKds()">
                                👨‍🍳 Xóa đơn bếp
                            </button>
                        </div>

                        <!-- Nút 4: Xóa Lịch sử Hóa đơn & Báo cáo -->
                        <div style="border: 1px solid #bfdbfe; background: #eff6ff; border-radius: 8px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: #1d4ed8; font-size: 0.95rem;">🧾 Xóa Lịch sử Hóa đơn Test & Báo cáo</strong>
                                <div style="font-size: 0.85rem; color: #1e3a8a; margin-top: 2px;">
                                    Xóa toàn bộ bill bán lẻ test trong POS và đưa doanh thu báo cáo về 0 để kiểm tra lại từ đầu.
                                </div>
                            </div>
                            <button type="button" class="nut nut-phu nut-nho" style="white-space: nowrap; margin-left: 12px; color: #2563eb; border-color: #3b82f6;" onclick="window.tienIchTest.xoaLichSuHoaDonTest()">
                                🧾 Xóa hóa đơn
                            </button>
                        </div>

                        <!-- Nút 5: Reset Ca làm việc -->
                        <div style="border: 1px solid #e9d5ff; background: #faf5ff; border-radius: 8px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: #7e22ce; font-size: 0.95rem;">🕒 Reset Ca làm việc & Quỹ tiền</strong>
                                <div style="font-size: 0.85rem; color: #581c87; margin-top: 2px;">
                                    Đưa tiền két về ban đầu (1.500.000đ), xóa các phiếu thu/chi và biên bản kết ca test.
                                </div>
                            </div>
                            <button type="button" class="nut nut-phu nut-nho" style="white-space: nowrap; margin-left: 12px; color: #9333ea; border-color: #a855f7;" onclick="window.tienIchTest.resetCaLamViec()">
                                🕒 Reset ca quỹ
                            </button>
                        </div>
                    </div>
                </div>
                <div class="hop-modal-duoi" style="padding: 12px 20px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; background: #f9fafb; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
                    <span style="font-size: 0.85rem; color: var(--mau-chu-phu);">💡 Tiện ích hỗ trợ kiểm thử giao diện & API liên tục</span>
                    <button type="button" class="nut nut-phu" onclick="window.tienIchTest.dongModal()">Đóng cửa sổ</button>
                </div>
            </div>
        `;
        modal.classList.add('mo');
    }

    dongModal() {
        const modal = document.getElementById('khung-modal-toan-cuc');
        if (modal) {
            modal.classList.remove('mo');
            modal.innerHTML = '';
        }
    }

    /**
     * Gửi yêu cầu reset lên backend API
     */
    async goiApiResetServer(phanHe = 'ALL') {
        try {
            if (window.api && window.api.yeuCau) {
                await window.api.yeuCau('/kiem-thu/reset', {
                    method: 'POST',
                    body: { phanHe }
                });
            }
        } catch (e) {
            console.warn('Lỗi gọi API reset backend:', e);
        }
    }

    /**
     * Xóa toàn bộ dữ liệu test (Full Clean Reset)
     */
    async xoaTatCaDuLieuTest() {
        if (!confirm('Bạn có chắc chắn muốn XÓA TOÀN BỘ dữ liệu test (Bàn, Đơn, Bếp KDS, Hóa đơn, Ca quỹ)?\n(Thực đơn, Danh mục món và Nhân viên vẫn được giữ nguyên)')) {
            return;
        }

        // 1. Gọi backend reset SQLite & JSON
        await this.goiApiResetServer('ALL');

        // 2. Làm sạch LocalStorage
        localStorage.setItem('quanmoc_pos_phien_ban', JSON.stringify({}));
        localStorage.setItem('quanmoc_ds_don_goi', JSON.stringify([]));
        localStorage.setItem('quanmoc_pos_lich_su_hoa_don', JSON.stringify([]));
        localStorage.setItem('quanmoc_ds_hoa_don', JSON.stringify([]));
        localStorage.setItem('quanmoc_ls_ket_ca', JSON.stringify([]));
        localStorage.setItem('quanmoc_phieu_thu_chi', JSON.stringify([]));
        localStorage.setItem('quanmoc_pos_nhat_ky_huy_tra', JSON.stringify([]));
        localStorage.removeItem('quanmoc_gio_hang');

        // Reset ca làm việc về ca sáng mở mới tinh
        const caMoi = {
            id: 101,
            maCa: 'SHIFT-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-01',
            caId: 1,
            tenCa: 'Ca Sáng (08:00 - 15:00)',
            thuNganTen: 'Minh (Thu ngân)',
            tienDauCa: 1500000,
            thoiGianMo: new Date().toISOString(),
            thoiDiemMo: Date.now(),
            ghiChuMo: 'Tiền mặt đầu ca gồm các mệnh giá 20k, 50k, 100k đủ cơ số',
            trangThai: 'DANG_MO'
        };
        localStorage.setItem('quanmoc_ca_hien_tai', JSON.stringify(caMoi));

        // 3. Đưa toàn bộ 12 bàn về trạng thái TRONG
        try {
            const dsBan = await window.api.layDanhSachBan();
            if (Array.isArray(dsBan)) {
                for (const b of dsBan) {
                    b.trangThai = 'TRONG';
                    b.daPhatSinhGiaoDich = false;
                    await window.api.capNhatTrangThaiBan(b.id, 'TRONG').catch(() => {});
                }
                await window.api.luuDanhSachBan(dsBan).catch(() => {});
            }
        } catch (e) {}

        this.dongModal();
        if (window.thongBao) {
            window.thongBao.thanhCong(
                'Làm sạch hoàn tất! 🎉',
                'Đã xóa toàn bộ đơn, giải phóng 12 bàn, làm sạch bếp KDS, hóa đơn và đưa ca quỹ về ban đầu.'
            );
        }

        // Tải lại giao diện tab hiện tại
        this.lamMoiGiaoDienHienTai();
    }

    /**
     * Reset Sơ đồ bàn POS
     */
    async resetSoDoBan() {
        if (!confirm('Bạn có muốn giải phóng tất cả các bàn về trạng thái BÀN TRỐNG và xóa toàn bộ phiên POS?')) {
            return;
        }

        await this.goiApiResetServer('BAN');
        localStorage.setItem('quanmoc_pos_phien_ban', JSON.stringify({}));

        // Đánh dấu hoặc xóa các đơn gọi món của các bàn
        try {
            const raw = localStorage.getItem('quanmoc_ds_don_goi');
            if (raw) {
                let ds = JSON.parse(raw);
                if (Array.isArray(ds)) {
                    ds.forEach(d => {
                        d.trangThai = 'DA_THANH_TOAN';
                        d.daThanhToan = true;
                    });
                    localStorage.setItem('quanmoc_ds_don_goi', JSON.stringify(ds));
                }
            }
        } catch (e) {}

        // Đặt tất cả bàn về TRONG
        try {
            const dsBan = await window.api.layDanhSachBan();
            if (Array.isArray(dsBan)) {
                for (const b of dsBan) {
                    b.trangThai = 'TRONG';
                    b.daPhatSinhGiaoDich = false;
                    await window.api.capNhatTrangThaiBan(b.id, 'TRONG').catch(() => {});
                }
                await window.api.luuDanhSachBan(dsBan).catch(() => {});
            }
        } catch (e) {}

        this.dongModal();
        if (window.thongBao) {
            window.thongBao.thanhCong('Reset bàn thành công', 'Toàn bộ 12 bàn đã sẵn sàng đón khách mới.');
        }

        if (window.soDoBanPos && window.soDoBanPos.taiVaHienThi) {
            await window.soDoBanPos.taiVaHienThi();
        } else {
            this.lamMoiGiaoDienHienTai();
        }
    }

    /**
     * Xóa sạch hàng đợi Bếp KDS
     */
    async resetBepKds() {
        if (!confirm('Bạn có muốn xóa sạch toàn bộ đơn món đang chờ nấu trên màn hình bếp KDS?')) {
            return;
        }

        await this.goiApiResetServer('BEP');
        localStorage.setItem('quanmoc_ds_don_goi', JSON.stringify([]));

        // Đồng thời làm sạch các món trong phiên POS để không hồi sinh
        try {
            const rawPhien = localStorage.getItem('quanmoc_pos_phien_ban');
            if (rawPhien) {
                const phien = JSON.parse(rawPhien);
                Object.keys(phien).forEach(k => {
                    if (phien[k]) phien[k].danhSachMon = [];
                });
                localStorage.setItem('quanmoc_pos_phien_ban', JSON.stringify(phien));
            }
        } catch (e) {}

        this.dongModal();
        if (window.thongBao) {
            window.thongBao.thanhCong('Làm sạch Bếp KDS thành công', 'Hàng đợi chế biến đã trống hoàn toàn.');
        }

        if (window.dieuPhoiBepModule && window.dieuPhoiBepModule.taiDuLieuVaCapNhatGiaoDien) {
            await window.dieuPhoiBepModule.taiDuLieuVaCapNhatGiaoDien();
        } else {
            this.lamMoiGiaoDienHienTai();
        }
    }

    /**
     * Xóa lịch sử hóa đơn test & làm sạch báo cáo
     */
    async xoaLichSuHoaDonTest() {
        if (!confirm('Bạn có muốn xóa toàn bộ hóa đơn test trong lịch sử POS và đưa Báo cáo doanh thu về 0?')) {
            return;
        }

        await this.goiApiResetServer('HOA_DON');
        localStorage.setItem('quanmoc_pos_lich_su_hoa_don', JSON.stringify([]));
        localStorage.setItem('quanmoc_ds_hoa_don', JSON.stringify([]));

        this.dongModal();
        if (window.thongBao) {
            window.thongBao.thanhCong('Xóa hóa đơn test thành công', 'Lịch sử hóa đơn và dữ liệu doanh thu đã được làm sạch.');
        }

        if (window.baoCaoDoanhThuModule && window.baoCaoDoanhThuModule.khoiTao) {
            await window.baoCaoDoanhThuModule.khoiTao();
        } else if (window.thanhToanPos && window.thanhToanPos.taiVaHienThi) {
            await window.thanhToanPos.taiVaHienThi();
        } else {
            this.lamMoiGiaoDienHienTai();
        }
    }

    /**
     * Reset Ca làm việc & Quỹ tiền
     */
    async resetCaLamViec() {
        if (!confirm('Bạn có muốn reset ca làm việc hiện tại, xóa các phiếu thu/chi và đưa quỹ tiền mặt về mức ban đầu?')) {
            return;
        }

        await this.goiApiResetServer('CA');
        localStorage.setItem('quanmoc_ls_ket_ca', JSON.stringify([]));
        localStorage.setItem('quanmoc_phieu_thu_chi', JSON.stringify([]));

        const caMoi = {
            id: 101,
            maCa: 'SHIFT-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-01',
            caId: 1,
            tenCa: 'Ca Sáng (08:00 - 15:00)',
            thuNganTen: 'Minh (Thu ngân)',
            tienDauCa: 1500000,
            thoiGianMo: new Date().toISOString(),
            thoiDiemMo: Date.now(),
            ghiChuMo: 'Tiền mặt đầu ca gồm các mệnh giá 20k, 50k, 100k đủ cơ số',
            trangThai: 'DANG_MO'
        };
        localStorage.setItem('quanmoc_ca_hien_tai', JSON.stringify(caMoi));

        this.dongModal();
        if (window.thongBao) {
            window.thongBao.thanhCong('Reset ca quỹ thành công', 'Ca làm việc đã được mở mới với 1.500.000đ tiền mặt đầu ca.');
        }

        if (window.caLamViecModule && window.caLamViecModule.khoiTao) {
            await window.caLamViecModule.khoiTao();
        } else {
            this.lamMoiGiaoDienHienTai();
        }
    }

    /**
     * Hủy / Xóa đơn test của một bàn cụ thể
     */
    async xoaDonBan(banId) {
        const idNum = Number(banId);
        if (!idNum) return;

        if (!confirm(`Bạn có chắc chắn muốn HỦY / XÓA toàn bộ đơn của Bàn ${idNum} và đưa bàn về trạng thái Trống?`)) {
            return;
        }

        // 1. Xóa phiên POS của bàn này
        try {
            const rawPhien = localStorage.getItem('quanmoc_pos_phien_ban');
            if (rawPhien) {
                const phien = JSON.parse(rawPhien);
                delete phien[idNum];
                delete phien[String(idNum)];
                localStorage.setItem('quanmoc_pos_phien_ban', JSON.stringify(phien));
            }
        } catch (e) {}

        // 2. Xóa hoặc đánh dấu DA_HUY cho các đơn gọi món của bàn này
        try {
            const rawDon = localStorage.getItem('quanmoc_ds_don_goi');
            if (rawDon) {
                let ds = JSON.parse(rawDon);
                if (Array.isArray(ds)) {
                    ds = ds.filter(d => Number(d.banId) !== idNum);
                    localStorage.setItem('quanmoc_ds_don_goi', JSON.stringify(ds));
                }
            }
        } catch (e) {}

        // 3. Đưa trạng thái bàn về TRONG
        try {
            await window.api.capNhatTrangThaiBan(idNum, 'TRONG');
            const dsBan = await window.api.layDanhSachBan();
            const b = dsBan.find(item => Number(item.id) === idNum);
            if (b) {
                b.trangThai = 'TRONG';
                b.daPhatSinhGiaoDich = false;
                await window.api.luuDanhSachBan(dsBan);
            }
        } catch (e) {}

        this.dongModal();
        if (window.thongBao) {
            window.thongBao.thanhCong('Xóa đơn bàn thành công', `Bàn ${idNum} đã được giải phóng hoàn toàn.`);
        }

        this.lamMoiGiaoDienHienTai();
    }

    /**
     * Xóa một đơn cụ thể khỏi màn hình Bếp KDS
     */
    async xoaDonKds(donId) {
        if (!donId) return;
        if (!confirm('Bạn có muốn xóa đơn test này khỏi hàng đợi Bếp KDS?')) return;

        try {
            const rawDon = localStorage.getItem('quanmoc_ds_don_goi');
            if (rawDon) {
                let ds = JSON.parse(rawDon);
                if (Array.isArray(ds)) {
                    ds = ds.filter(d => String(d.id) !== String(donId) && String(d.maDon) !== String(donId));
                    localStorage.setItem('quanmoc_ds_don_goi', JSON.stringify(ds));
                }
            }
        } catch (e) {}

        if (window.thongBao) {
            window.thongBao.thanhCong('Đã xóa đơn', `Đã xóa đơn ${donId} khỏi bếp KDS.`);
        }

        if (window.dieuPhoiBepModule && window.dieuPhoiBepModule.taiDuLieuVaCapNhatGiaoDien) {
            await window.dieuPhoiBepModule.taiDuLieuVaCapNhatGiaoDien();
        } else {
            this.lamMoiGiaoDienHienTai();
        }
    }

    /**
     * Tự động làm mới phân hệ đang mở trên màn hình
     */
    lamMoiGiaoDienHienTai() {
        const tab = window.ungDung ? window.ungDung.tabHienTai : '';
        if (tab === 'posThuNgan' && window.soDoBanPos) {
            window.soDoBanPos.taiVaHienThi();
        } else if (tab === 'dieuPhoiBep' && window.dieuPhoiBepModule) {
            window.dieuPhoiBepModule.taiDuLieuVaCapNhatGiaoDien();
        } else if (tab === 'caLamViec' && window.caLamViecModule) {
            window.caLamViecModule.khoiTao();
        } else if (tab === 'baoCao' && window.baoCaoDoanhThuModule) {
            window.baoCaoDoanhThuModule.khoiTao();
        } else if (tab === 'theoDoiDonMon' && window.theoDoiDonMonModule) {
            window.theoDoiDonMonModule.taiDuLieuVaVe();
        } else if (tab === 'thanhToanPos' && window.thanhToanPos) {
            window.thanhToanPos.taiVaHienThi();
        } else if (window.ungDung && window.ungDung.chuyenTab) {
            window.ungDung.chuyenTab(tab);
        }
    }
}

// Khởi tạo đối tượng toàn cục
window.tienIchTest = new TienIchTestModule();
