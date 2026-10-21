/**
 * MODULE QUẢN LÝ DANH MỤC & THỰC ĐƠN MÓN ĂN (quanLyThucDon.js)
 * Phục vụ toàn bộ các User Story của Quân trong Sprint 1:
 * - US-031: Tạo mới danh mục món ăn
 * - US-032: Chỉnh sửa tên, thứ tự và xóa danh mục
 * - US-033: Xem danh sách món ăn phía quản trị có phân trang & bộ lọc
 * - US-034: Thêm món ăn mới (tên, giá, mô tả, ảnh, danh mục, ĐVT)
 * - US-035: Xem trước ảnh món ăn và tải lên
 * - US-036: Chỉnh sửa thông tin và giá bán món ăn
 * - US-037: Thiết lập tùy chọn (Size, Topping, độ cay)
 * - US-038: Bật / tắt nhanh "Đang bán / Tạm hết" (Toggle Switch)
 * - US-039: Đánh dấu món "Bán chạy / Đề xuất" (Best Seller)
 * - US-040: Xóa mềm (ẩn) món ăn bảo toàn lịch sử
 */

class QuanLyThucDonModule {
    constructor() {
        this.danhSachDanhMuc = [];
        this.danhSachMonAn = [];
        this.danhMucDangChon = 'ALL';
        this.locTrangThai = 'ALL'; // ALL, DANG_BAN, TAM_HET, BAN_CHAY
        this.tuKhoaTimKiem = '';
        this.trangHienTai = 1;
        this.soLuongMoiTrang = 8;
    }

    async khoiTao() {
        await this.taiDuLieu();
        this.veGiaoDien();
    }

    async taiDuLieu() {
        this.danhSachDanhMuc = await window.api.layDanhSachDanhMuc();
        this.danhSachMonAn = await window.api.layDanhSachMonAn();
    }

    veGiaoDien() {
        const vungChua = document.getElementById('noi-dung-chinh');
        if (!vungChua) return;

        // Thống kê nhanh
        const tongMon = this.danhSachMonAn.filter(m => m.trangThai !== -1).length;
        const monDangBan = this.danhSachMonAn.filter(m => m.trangThai === 1).length;
        const monTamHet = this.danhSachMonAn.filter(m => m.trangThai === 0).length;
        const monBanChay = this.danhSachMonAn.filter(m => m.laBanChay === 1 && m.trangThai !== -1).length;

        // Lọc món ăn (US-033)
        const monLocDuoc = this.danhSachMonAn.filter(mon => {
            if (mon.trangThai === -1) return false; // Đã xóa mềm (US-040)

            const thoaDanhMuc = (this.danhMucDangChon === 'ALL') || (mon.danhMucId === Number(this.danhMucDangChon));
            
            let thoaTrangThai = true;
            if (this.locTrangThai === 'DANG_BAN') thoaTrangThai = (mon.trangThai === 1);
            else if (this.locTrangThai === 'TAM_HET') thoaTrangThai = (mon.trangThai === 0);
            else if (this.locTrangThai === 'BAN_CHAY') thoaTrangThai = (mon.laBanChay === 1);

            const thoaTuKhoa = !this.tuKhoaTimKiem || 
                mon.tenMon.toLowerCase().includes(this.tuKhoaTimKiem.toLowerCase()) || 
                mon.maMon.toLowerCase().includes(this.tuKhoaTimKiem.toLowerCase());

            return thoaDanhMuc && thoaTrangThai && thoaTuKhoa;
        });

        // Phân trang (US-033)
        const tongSoTrang = Math.ceil(monLocDuoc.length / this.soLuongMoiTrang) || 1;
        if (this.trangHienTai > tongSoTrang) this.trangHienTai = tongSoTrang;
        const batDau = (this.trangHienTai - 1) * this.soLuongMoiTrang;
        const danhSachHienThi = monLocDuoc.slice(batDau, batDau + this.soLuongMoiTrang);

        vungChua.innerHTML = `
            <div class="trang-quan-ly-thuc-don">
                <!-- Tiêu đề & Nút thao tác -->
                <div class="thanh-tieu-de-trang">
                    <div>
                        <h2>🍲 Quản Lý Danh Mục & Thực Đơn</h2>
                        <p class="mo-ta-phu">Thiết lập thực đơn, món ăn, tùy chọn Size/Topping và công tắc báo hết món nhanh</p>
                    </div>
                    <div class="nhom-nut-hanh-dong">
                        <button class="nut nut-phu" onclick="window.quanLyThucDon.moModalQuanLyDanhMuc()">
                            📁 Quản lý Danh mục (${this.danhSachDanhMuc.length})
                        </button>
                        <button class="nut nut-chinh" onclick="window.quanLyThucDon.moModalThemMon()">
                            ➕ Thêm món mới
                        </button>
                    </div>
                </div>

                <!-- Thống kê nhanh chỉ số thực đơn -->
                <div class="luoi-thong-ke">
                    <div class="the-chi-so">
                        <div class="so-chi-so">${tongMon}</div>
                        <div class="nhan-chi-so">Tổng số món ăn</div>
                    </div>
                    <div class="the-chi-so chi-so-xanh">
                        <div class="so-chi-so">${monDangBan}</div>
                        <div class="nhan-chi-so">Món đang bán</div>
                    </div>
                    <div class="the-chi-so chi-so-cam">
                        <div class="so-chi-so">${monTamHet}</div>
                        <div class="nhan-chi-so">Món tạm hết hàng</div>
                    </div>
                    <div class="the-chi-so chi-so-vang">
                        <div class="so-chi-so">${monBanChay}</div>
                        <div class="nhan-chi-so">Món bán chạy (Best Seller)</div>
                    </div>
                </div>

                <!-- Bộ lọc danh mục, trạng thái và tìm kiếm (US-033) -->
                <div class="thanh-bo-loc">
                    <div class="cac-tab-khu-vuc">
                        <button class="tab-khu-vuc ${this.danhMucDangChon === 'ALL' ? 'kich-hoat' : ''}" 
                                onclick="window.quanLyThucDon.chonDanhMuc('ALL')">
                            Tất cả danh mục (${tongMon})
                        </button>
                        ${this.danhSachDanhMuc.map(dm => {
                            const soMon = this.danhSachMonAn.filter(m => m.danhMucId === dm.id && m.trangThai !== -1).length;
                            return `
                                <button class="tab-khu-vuc ${this.danhMucDangChon === dm.id ? 'kich-hoat' : ''}" 
                                        onclick="window.quanLyThucDon.chonDanhMuc(${dm.id})">
                                    ${dm.bieuTuong || '🍽️'} ${window.DinhDang.thoatHtml(dm.ten)} (${soMon})
                                </button>
                            `;
                        }).join('')}
                    </div>

                    <div class="nhom-loc-tim-kiem">
                        <select class="select-loc" onchange="window.quanLyThucDon.doiLocTrangThai(this.value)">
                            <option value="ALL" ${this.locTrangThai === 'ALL' ? 'selected' : ''}>Tất cả trạng thái</option>
                            <option value="DANG_BAN" ${this.locTrangThai === 'DANG_BAN' ? 'selected' : ''}>Chỉ món đang bán</option>
                            <option value="TAM_HET" ${this.locTrangThai === 'TAM_HET' ? 'selected' : ''}>Chỉ món tạm hết</option>
                            <option value="BAN_CHAY" ${this.locTrangThai === 'BAN_CHAY' ? 'selected' : ''}>Chỉ món bán chạy (Hot)</option>
                        </select>

                        <div class="hop-tim-kiem">
                            <input type="text" placeholder="Tìm tên món, mã món..." 
                                   value="${window.DinhDang.thoatHtml(this.tuKhoaTimKiem)}"
                                   oninput="window.quanLyThucDon.timKiemMon(this.value)">
                        </div>
                    </div>
                </div>

                <!-- Lưới hiển thị món ăn -->
                ${danhSachHienThi.length === 0 ? `
                    <div class="khung-trong">
                        <div class="bieu-tuong-trong">🍲</div>
                        <h3>Không tìm thấy món ăn nào</h3>
                        <p>Thử đổi bộ lọc hoặc thêm món ăn mới vào thực đơn.</p>
                        <button class="nut nut-chinh" onclick="window.quanLyThucDon.moModalThemMon()">➕ Thêm món mới</button>
                    </div>
                ` : `
                    <div class="luoi-the-mon-an">
                        ${danhSachHienThi.map(mon => this.veTheMonAn(mon)).join('')}
                    </div>

                    <!-- Thanh phân trang (US-033) -->
                    ${tongSoTrang > 1 ? `
                        <div class="thanh-phan-trang">
                            <button class="nut-trang" ${this.trangHienTai === 1 ? 'disabled' : ''} 
                                    onclick="window.quanLyThucDon.chuyenTrang(${this.trangHienTai - 1})">❮ Trước</button>
                            <span class="chu-trang">Trang <strong>${this.trangHienTai}</strong> / ${tongSoTrang} (Tổng ${monLocDuoc.length} món)</span>
                            <button class="nut-trang" ${this.trangHienTai === tongSoTrang ? 'disabled' : ''} 
                                    onclick="window.quanLyThucDon.chuyenTrang(${this.trangHienTai + 1})">Sau ❯</button>
                        </div>
                    ` : ''}
                `}
            </div>
        `;
    }

    veTheMonAn(mon) {
        const danhMuc = this.danhSachDanhMuc.find(d => d.id === mon.danhMucId);
        const tenDanhMuc = danhMuc ? danhMuc.ten : 'Món chung';
        const laDangBan = (mon.trangThai === 1);

        const soLuongSize = (mon.tuyChonSize || []).length;
        const soLuongTopping = (mon.tuyChonTopping || []).length;

        return `
            <div class="the-mon-an ${!laDangBan ? 'the-mon-tam-het' : ''}">
                <div class="khung-anh-mon">
                    <img src="${window.DinhDang.thoatHtml(mon.hinhAnh || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80')}" 
                         alt="${window.DinhDang.thoatHtml(mon.tenMon)}" 
                         onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'"
                         loading="lazy" />
                    
                    <!-- Nút ghim Best Seller (US-039) -->
                    <button class="nut-huy-hieu-hot ${mon.laBanChay === 1 ? 'dang-bat' : ''}" 
                            title="${mon.laBanChay === 1 ? 'Bỏ nhãn Món bán chạy' : 'Đánh dấu Món bán chạy'}"
                            onclick="window.quanLyThucDon.chuyenTrangThaiBanChay(${mon.id})">
                        🔥 Bán chạy
                    </button>

                    ${!laDangBan ? `
                        <div class="lop-phu-tam-het">
                            <span>TẠM HẾT HÀNG</span>
                        </div>
                    ` : ''}
                </div>

                <div class="than-the-mon">
                    <div class="hang-danh-muc">
                        <span class="the-tag-danh-muc">${window.DinhDang.thoatHtml(tenDanhMuc)}</span>
                        <span class="ma-mon-nho">${window.DinhDang.thoatHtml(mon.maMon)}</span>
                    </div>

                    <h3 class="ten-mon-an" title="${window.DinhDang.thoatHtml(mon.tenMon)}">
                        ${window.DinhDang.thoatHtml(mon.tenMon)}
                    </h3>

                    <p class="mo-ta-mon-an">${window.DinhDang.thoatHtml(window.DinhDang.rutGonVanBan(mon.moTa || 'Chưa có mô tả', 60))}</p>

                    <div class="thong-tin-tuy-chon-kem">
                        <span class="chi-tiet-tc">📏 ${soLuongSize} kích cỡ</span> • 
                        <span class="chi-tiet-tc">🧀 ${soLuongTopping} món thêm</span>
                    </div>

                    <div class="hang-gia-va-toggle">
                        <div class="gia-tien-mon">
                            <span class="so-tien">${window.DinhDang.tienVnd(mon.giaBan)}</span>
                            <span class="don-vi">/ ${window.DinhDang.thoatHtml(mon.donViTinh || 'Phần')}</span>
                        </div>

                        <!-- Công tắc gạt Đang bán / Tạm hết (US-038) -->
                        <div class="hop-nut-gat" title="Bật/Tắt trạng thái Còn hàng - Tạm hết">
                            <label class="nut-gat-switch">
                                <input type="checkbox" ${laDangBan ? 'checked' : ''} 
                                       onchange="window.quanLyThucDon.chuyenTrangThaiKinhDoanh(${mon.id}, this.checked)">
                                <span class="con-lan-switch"></span>
                            </label>
                            <span class="nhan-switch ${laDangBan ? 'chu-xanh' : 'chu-xam'}">
                                ${laDangBan ? 'Đang bán' : 'Tạm hết'}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="duoi-the-mon">
                    <button class="nut-hanh-dong nut-sua-mon" onclick="window.quanLyThucDon.moModalSuaMon(${mon.id})">
                        ✏️ Chỉnh sửa chi tiết
                    </button>
                    <button class="nut-hanh-dong nut-an-mon" onclick="window.quanLyThucDon.xoaMemMonAn(${mon.id})" title="Ẩn món (Xóa mềm - US-040)">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }

    chonDanhMuc(id) {
        this.danhMucDangChon = id;
        this.trangHienTai = 1;
        this.veGiaoDien();
    }

    doiLocTrangThai(trangThai) {
        this.locTrangThai = trangThai;
        this.trangHienTai = 1;
        this.veGiaoDien();
    }

    timKiemMon(tuKhoa) {
        this.tuKhoaTimKiem = tuKhoa;
        this.trangHienTai = 1;
        this.veGiaoDien();
    }

    chuyenTrang(soTrang) {
        this.trangHienTai = soTrang;
        this.veGiaoDien();
    }

    // US-038: Nút gạt nhanh trạng thái Đang bán / Tạm hết
    async chuyenTrangThaiKinhDoanh(monId, laDangBan) {
        const mon = this.danhSachMonAn.find(m => m.id === monId);
        if (mon) {
            mon.trangThai = laDangBan ? 1 : 0;
            await window.api.luuDanhSachMonAn(this.danhSachMonAn);
            
            if (laDangBan) {
                window.thongBao.thanhCong('Mở bán lại món thành công!', `"${mon.tenMon}" đã sẵn sàng trên E-Menu.`);
            } else {
                window.thongBao.canhBao('Đã chuyển sang Tạm hết hàng!', `"${mon.tenMon}" đã bị khóa trên E-Menu khách hàng.`);
            }

            // Bắn tín hiệu Socket.io nếu có
            if (window.socketClient) {
                window.socketClient.phatSuKien('CAP_NHAT_TRANG_THAI_MON', { monId: mon.id, trangThai: mon.trangThai });
            }

            this.veGiaoDien();
        }
    }

    // US-039: Đánh dấu món bán chạy
    async chuyenTrangThaiBanChay(monId) {
        const mon = this.danhSachMonAn.find(m => m.id === monId);
        if (mon) {
            mon.laBanChay = (mon.laBanChay === 1) ? 0 : 1;
            await window.api.luuDanhSachMonAn(this.danhSachMonAn);

            if (mon.laBanChay === 1) {
                window.thongBao.thanhCong('Đã gắn nhãn Bán chạy!', `"${mon.tenMon}" sẽ được ưu tiên hiển thị trên E-Menu.`);
            } else {
                window.thongBao.thongTin('Đã bỏ nhãn Bán chạy.');
            }

            this.veGiaoDien();
        }
    }

    // US-040: Xóa mềm (ẩn) món ăn
    async xoaMemMonAn(monId) {
        const mon = this.danhSachMonAn.find(m => m.id === monId);
        if (!mon) return;

        if (confirm(`Bạn có chắc chắn muốn ngưng kinh doanh món "${mon.tenMon}"?\nMón này sẽ bị ẩn khỏi thực đơn để bảo toàn lịch sử hóa đơn trước đây.`)) {
            mon.trangThai = -1; // Ẩn vĩnh viễn khỏi menu bán
            await window.api.luuDanhSachMonAn(this.danhSachMonAn);
            window.thongBao.thanhCong('Đã ẩn món thành công (Xóa mềm - US-040)');
            this.veGiaoDien();
        }
    }

    // =========================================================================
    // MODAL THÊM / CHỈNH SỬA MÓN ĂN CHI TIẾT (US-034 -> US-037)
    // =========================================================================
    moModalThemMon() {
        this.hienThiModalFormMon(null);
    }

    moModalSuaMon(monId) {
        const mon = this.danhSachMonAn.find(m => m.id === monId);
        if (!mon) return;
        this.hienThiModalFormMon(mon);
    }

    hienThiModalFormMon(monHienTai) {
        const laThemMoi = !monHienTai;
        const modal = document.getElementById('khung-modal-toan-cuc');

        // Tạo dữ liệu mảng Size & Topping
        const sizes = monHienTai?.tuyChonSize ? JSON.parse(JSON.stringify(monHienTai.tuyChonSize)) : [
            { ten: 'Tiêu chuẩn', giaCongThem: 0 }
        ];
        const toppings = monHienTai?.tuyChonTopping ? JSON.parse(JSON.stringify(monHienTai.tuyChonTopping)) : [];

        modal.innerHTML = `
            <div class="hop-modal modal-lon">
                <div class="dau-modal">
                    <h3>${laThemMoi ? '➕ Thêm Món Ăn Mới Vào Thực Đơn (US-034)' : '✏️ Chỉnh Sửa Chi Tiết Món Ăn (US-036)'}</h3>
                    <button class="nut-dong-modal" onclick="window.quanLyThucDon.dongModal()">✕</button>
                </div>

                <form id="form-mon-an" onsubmit="window.quanLyThucDon.luuThongTinMon(event, ${laThemMoi ? 'null' : monHienTai.id})">
                    <div class="than-modal luoi-hai-cot">
                        <!-- Cột 1: Thông tin cơ bản & Ảnh -->
                        <div class="cot-thong-tin-chinh">
                            <div class="nhom-nhap-lieu">
                                <label>Danh mục món ăn <span class="bat-buoc">*</span></label>
                                <select id="nhap-danh-muc-mon" required>
                                    ${this.danhSachDanhMuc.map(dm => `
                                        <option value="${dm.id}" ${monHienTai && monHienTai.danhMucId === dm.id ? 'selected' : ''}>
                                            ${dm.bieuTuong || '🍽️'} ${window.DinhDang.thoatHtml(dm.ten)}
                                        </option>
                                    `).join('')}
                                </select>
                            </div>

                            <div class="hang-nhap-doi">
                                <div class="nhom-nhap-lieu">
                                    <label>Tên món ăn <span class="bat-buoc">*</span></label>
                                    <input type="text" id="nhap-ten-mon" placeholder="Ví dụ: Gà nướng lá chanh" 
                                           value="${monHienTai ? window.DinhDang.thoatHtml(monHienTai.tenMon) : ''}" required>
                                </div>
                                <div class="nhom-nhap-lieu">
                                    <label>Mã món <span class="bat-buoc">*</span></label>
                                    <input type="text" id="nhap-ma-mon" placeholder="Ví dụ: MON-09" 
                                           value="${monHienTai ? window.DinhDang.thoatHtml(monHienTai.maMon) : 'MON-' + (this.danhSachMonAn.length + 1)}" required>
                                </div>
                            </div>

                            <div class="hang-nhap-doi">
                                <div class="nhom-nhap-lieu">
                                    <label>Đơn giá bán (VND) <span class="bat-buoc">*</span></label>
                                    <input type="number" id="nhap-gia-ban" min="0" step="1000" placeholder="150000" 
                                           value="${monHienTai ? monHienTai.giaBan : ''}" required>
                                </div>
                                <div class="nhom-nhap-lieu">
                                    <label>Đơn vị tính <span class="bat-buoc">*</span></label>
                                    <input type="text" id="nhap-dvt" placeholder="Đĩa, Con, Nồi, Phần, Ly..." 
                                           value="${monHienTai ? window.DinhDang.thoatHtml(monHienTai.donViTinh || 'Đĩa') : 'Đĩa'}" required>
                                </div>
                            </div>

                            <div class="nhom-nhap-lieu">
                                <label>Mô tả hương vị / Thành phần</label>
                                <textarea id="nhap-mo-ta-mon" rows="3" placeholder="Ghi chú về nguồn gốc nguyên liệu, vị giác...">${monHienTai ? window.DinhDang.thoatHtml(monHienTai.moTa || '') : ''}</textarea>
                            </div>

                            <!-- Tải lên & Xem trước ảnh (US-035) -->
                            <div class="nhom-nhap-lieu">
                                <label>Hình ảnh món ăn (US-035)</label>
                                <div class="khung-tai-anh-preview">
                                    <img id="anh-preview-mon" 
                                         src="${monHienTai?.hinhAnh || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'}" 
                                         alt="Preview" class="anh-preview-vuong" />
                                    <div class="nut-nhap-url-anh">
                                        <input type="text" id="nhap-url-anh" placeholder="Dán link ảnh online (URL)..." 
                                               value="${monHienTai ? window.DinhDang.thoatHtml(monHienTai.hinhAnh || '') : ''}"
                                               oninput="document.getElementById('anh-preview-mon').src = this.value || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'">
                                        <div class="dong-tai-tep">
                                            <span>Hoặc chọn ảnh từ máy:</span>
                                            <input type="file" id="tep-anh-mon" accept="image/*" onchange="window.quanLyThucDon.docTepAnhLocal(this)">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Cột 2: Cấu hình Tùy chọn Size & Topping (US-037) -->
                        <div class="cot-thong-tin-phu">
                            <!-- Kích cỡ (Size) -->
                            <div class="khung-tuy-chon-con">
                                <div class="tieu-de-con">
                                    <h4>📏 Kích cỡ (Size món)</h4>
                                    <button type="button" class="nut-them-dong" onclick="window.quanLyThucDon.themDongSize()">➕ Thêm Size</button>
                                </div>
                                <div id="danh-sach-dong-size" class="danh-sach-dong-tc">
                                    ${sizes.map((s, idx) => `
                                        <div class="hang-dong-tc">
                                            <input type="text" class="size-ten" placeholder="Tên size (VD: Lớn)" value="${window.DinhDang.thoatHtml(s.ten)}" required>
                                            <input type="number" class="size-gia" placeholder="Giá bù (+/- VND)" value="${s.giaCongThem || 0}">
                                            <button type="button" class="nut-xoa-dong" onclick="this.parentElement.remove()">✕</button>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- Topping / Món ăn kèm -->
                            <div class="khung-tuy-chon-con">
                                <div class="tieu-de-con">
                                    <h4>🧀 Món thêm / Topping</h4>
                                    <button type="button" class="nut-them-dong" onclick="window.quanLyThucDon.themDongTopping()">➕ Thêm Topping</button>
                                </div>
                                <div id="danh-sach-dong-topping" class="danh-sach-dong-tc">
                                    ${toppings.map((t, idx) => `
                                        <div class="hang-dong-tc">
                                            <input type="text" class="topping-ten" placeholder="Tên món thêm" value="${window.DinhDang.thoatHtml(t.ten)}" required>
                                            <input type="number" class="topping-gia" placeholder="Giá tiền (VND)" value="${t.gia || 0}">
                                            <button type="button" class="nut-xoa-dong" onclick="this.parentElement.remove()">✕</button>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- Cờ bổ trợ -->
                            <div class="hop-tuy-chon-checkbox">
                                <label class="nhan-checkbox">
                                    <input type="checkbox" id="nhap-la-ban-chay" ${monHienTai && monHienTai.laBanChay === 1 ? 'checked' : ''}>
                                    <span>🔥 Đánh dấu là Món bán chạy / Gợi ý của quán (US-039)</span>
                                </label>
                                <label class="nhan-checkbox">
                                    <input type="checkbox" id="nhap-trang-thai-ban" ${!monHienTai || monHienTai.trangThai === 1 ? 'checked' : ''}>
                                    <span>✅ Đang bán (Bỏ tích nếu quán tạm hết nguyên liệu) (US-038)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="duoi-modal">
                        <button type="button" class="nut nut-phu" onclick="window.quanLyThucDon.dongModal()">Hủy bỏ</button>
                        <button type="submit" class="nut nut-chinh">Lưu thông tin món ăn</button>
                    </div>
                </form>
            </div>
        `;
        modal.classList.add('mo');
    }

    docTepAnhLocal(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target.result;
                document.getElementById('anh-preview-mon').src = base64;
                document.getElementById('nhap-url-anh').value = base64;
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    themDongSize() {
        const c = document.getElementById('danh-sach-dong-size');
        const div = document.createElement('div');
        div.className = 'hang-dong-tc';
        div.innerHTML = `
            <input type="text" class="size-ten" placeholder="Tên size (VD: Lớn)" required>
            <input type="number" class="size-gia" placeholder="Giá bù (+/- VND)" value="0">
            <button type="button" class="nut-xoa-dong" onclick="this.parentElement.remove()">✕</button>
        `;
        c.appendChild(div);
    }

    themDongTopping() {
        const c = document.getElementById('danh-sach-dong-topping');
        const div = document.createElement('div');
        div.className = 'hang-dong-tc';
        div.innerHTML = `
            <input type="text" class="topping-ten" placeholder="Tên món thêm" required>
            <input type="number" class="topping-gia" placeholder="Giá tiền (VND)" value="15000">
            <button type="button" class="nut-xoa-dong" onclick="this.parentElement.remove()">✕</button>
        `;
        c.appendChild(div);
    }

    async luuThongTinMon(event, monId) {
        event.preventDefault();

        const danhMucId = Number(document.getElementById('nhap-danh-muc-mon').value);
        const tenMon = document.getElementById('nhap-ten-mon').value.trim();
        const maMon = document.getElementById('nhap-ma-mon').value.trim();
        const giaBan = Number(document.getElementById('nhap-gia-ban').value) || 0;
        const donViTinh = document.getElementById('nhap-dvt').value.trim();
        const moTa = document.getElementById('nhap-mo-ta-mon').value.trim();
        const hinhAnh = document.getElementById('nhap-url-anh').value.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
        const laBanChay = document.getElementById('nhap-la-ban-chay').checked ? 1 : 0;
        const trangThai = document.getElementById('nhap-trang-thai-ban').checked ? 1 : 0;

        // Lấy danh sách Size
        const tuyChonSize = [];
        document.querySelectorAll('#danh-sach-dong-size .hang-dong-tc').forEach(hang => {
            const ten = hang.querySelector('.size-ten')?.value?.trim();
            const giaCongThem = Number(hang.querySelector('.size-gia')?.value) || 0;
            if (ten) tuyChonSize.push({ ten, giaCongThem });
        });

        // Lấy danh sách Topping
        const tuyChonTopping = [];
        document.querySelectorAll('#danh-sach-dong-topping .hang-dong-tc').forEach(hang => {
            const ten = hang.querySelector('.topping-ten')?.value?.trim();
            const gia = Number(hang.querySelector('.topping-gia')?.value) || 0;
            if (ten) tuyChonTopping.push({ ten, gia });
        });

        if (monId) {
            // Sửa món (US-036)
            const mon = this.danhSachMonAn.find(m => m.id === monId);
            if (mon) {
                Object.assign(mon, {
                    danhMucId, tenMon, maMon, giaBan, donViTinh, moTa, hinhAnh,
                    laBanChay, trangThai, tuyChonSize, tuyChonTopping
                });
            }
            window.thongBao.thanhCong('Cập nhật món thành công!', `Đã lưu thay đổi cho ${tenMon}`);
        } else {
            // Thêm món mới (US-034)
            const idMoi = this.danhSachMonAn.length > 0 ? Math.max(...this.danhSachMonAn.map(m => m.id)) + 1 : 1;
            this.danhSachMonAn.push({
                id: idMoi,
                danhMucId, tenMon, maMon, giaBan, donViTinh, moTa, hinhAnh,
                laBanChay, trangThai, tuyChonSize, tuyChonTopping
            });
            window.thongBao.thanhCong('Thêm món mới thành công!', `"${tenMon}" đã được đưa vào thực đơn.`);
        }

        await window.api.luuDanhSachMonAn(this.danhSachMonAn);
        this.dongModal();
        this.veGiaoDien();
    }

    // =========================================================================
    // QUẢN LÝ DANH MỤC MÓN ĂN (US-031 & US-032)
    // =========================================================================
    moModalQuanLyDanhMuc() {
        const modal = document.getElementById('khung-modal-toan-cuc');
        modal.innerHTML = `
            <div class="hop-modal">
                <div class="dau-modal">
                    <h3>📁 Quản Lý Danh Mục Thực Đơn (US-031 & US-032)</h3>
                    <button class="nut-dong-modal" onclick="window.quanLyThucDon.dongModal()">✕</button>
                </div>

                <div class="than-modal">
                    <!-- Form thêm danh mục nhanh -->
                    <div class="hop-them-nhanh">
                        <input type="text" id="nhap-icon-dm-moi" placeholder="Icon (VD: 🍲)" style="max-width: 80px; text-align: center;">
                        <input type="text" id="nhap-ten-dm-moi" placeholder="Nhập tên danh mục mới (VD: Món Nhúng Lẩu, Khai Vị)...">
                        <button class="nut nut-chinh" onclick="window.quanLyThucDon.themDanhMucMoi()">➕ Thêm danh mục</button>
                    </div>

                    <!-- Danh sách danh mục -->
                    <div class="danh-sach-khu-vuc-modal">
                        ${this.danhSachDanhMuc.map(dm => {
                            const soMon = this.danhSachMonAn.filter(m => m.danhMucId === dm.id && m.trangThai !== -1).length;
                            return `
                                <div class="hang-khu-vuc">
                                    <div class="thong-tin-kv">
                                        <span class="icon-to">${dm.bieuTuong || '🍽️'}</span>
                                        <strong>${window.DinhDang.thoatHtml(dm.ten)}</strong>
                                        <span class="chu-phu">(${soMon} món)</span>
                                    </div>
                                    <div class="nut-kv">
                                        <button class="nut-icon" onclick="window.quanLyThucDon.suaTenDanhMuc(${dm.id})" title="Đổi tên danh mục">✏️</button>
                                        <button class="nut-icon nut-do" onclick="window.quanLyThucDon.xoaDanhMuc(${dm.id})" title="Xóa danh mục">🗑️</button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <div class="duoi-modal">
                    <button class="nut nut-chinh" onclick="window.quanLyThucDon.dongModal()">Hoàn tất</button>
                </div>
            </div>
        `;
        modal.classList.add('mo');
    }

    async themDanhMucMoi() {
        const inputIcon = document.getElementById('nhap-icon-dm-moi');
        const inputTen = document.getElementById('nhap-ten-dm-moi');
        const ten = inputTen.value.trim();
        const bieuTuong = inputIcon.value.trim() || '🍽️';

        if (!ten) return;

        const idMoi = this.danhSachDanhMuc.length > 0 ? Math.max(...this.danhSachDanhMuc.map(d => d.id)) + 1 : 1;
        this.danhSachDanhMuc.push({
            id: idMoi,
            ma: `DM_${idMoi}`,
            ten,
            bieuTuong,
            thuTu: this.danhSachDanhMuc.length + 1,
            trangThai: 1
        });

        await window.api.luuDanhSachDanhMuc(this.danhSachDanhMuc);
        window.thongBao.thanhCong('Thêm danh mục mới thành công!', `Đã tạo danh mục: ${ten}`);
        this.moModalQuanLyDanhMuc();
        this.veGiaoDien();
    }

    async suaTenDanhMuc(danhMucId) {
        const dm = this.danhSachDanhMuc.find(d => d.id === danhMucId);
        if (!dm) return;

        const tenMoi = prompt('Nhập tên mới cho danh mục:', dm.ten);
        if (tenMoi && tenMoi.trim() && tenMoi.trim() !== dm.ten) {
            dm.ten = tenMoi.trim();
            await window.api.luuDanhSachDanhMuc(this.danhSachDanhMuc);
            window.thongBao.thanhCong('Đã cập nhật tên danh mục!');
            this.moModalQuanLyDanhMuc();
            this.veGiaoDien();
        }
    }

    async xoaDanhMuc(danhMucId) {
        const soMon = this.danhSachMonAn.filter(m => m.danhMucId === danhMucId && m.trangThai !== -1).length;
        if (soMon > 0) {
            window.thongBao.canhBao('Không thể xóa danh mục!', `Danh mục này đang có ${soMon} món ăn. Vui lòng chuyển hoặc xóa món trước.`);
            return;
        }

        if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            this.danhSachDanhMuc = this.danhSachDanhMuc.filter(d => d.id !== danhMucId);
            await window.api.luuDanhSachDanhMuc(this.danhSachDanhMuc);
            window.thongBao.thanhCong('Đã xóa danh mục thành công!');
            this.moModalQuanLyDanhMuc();
            this.veGiaoDien();
        }
    }

    dongModal() {
        const modal = document.getElementById('khung-modal-toan-cuc');
        if (modal) {
            modal.classList.remove('mo');
            modal.innerHTML = '';
        }
    }
}

window.quanLyThucDon = new QuanLyThucDonModule();
