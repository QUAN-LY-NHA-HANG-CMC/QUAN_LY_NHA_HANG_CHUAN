-- Sprint 4 - Danh gia, ca thu ngan, tong hop doanh thu va bao cao (SQLite)
-- Phu thuoc schema Sprint 1, Sprint 2 va Sprint 3.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS danh_gia_khach_hang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phien_phuc_vu_id INTEGER NOT NULL,
    hoa_don_id INTEGER,
    chi_tiet_don_hang_id INTEGER,
    mon_an_id INTEGER,
    ma_khach TEXT,
    so_sao INTEGER NOT NULL,
    nhan_xet TEXT,
    trang_thai TEXT NOT NULL DEFAULT 'ChoDuyet',
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (phien_phuc_vu_id) REFERENCES phien_phuc_vu(id),
    FOREIGN KEY (hoa_don_id) REFERENCES hoa_don(id),
    FOREIGN KEY (chi_tiet_don_hang_id) REFERENCES chi_tiet_don_hang(id),
    FOREIGN KEY (mon_an_id) REFERENCES mon_an(id)
);

CREATE TABLE IF NOT EXISTS phan_hoi_quan_ly (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    danh_gia_id INTEGER NOT NULL,
    nguoi_phan_hoi_id INTEGER NOT NULL,
    noi_dung TEXT NOT NULL,
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (danh_gia_id) REFERENCES danh_gia_khach_hang(id) ON DELETE CASCADE,
    FOREIGN KEY (nguoi_phan_hoi_id) REFERENCES tai_khoan(id)
);

CREATE TABLE IF NOT EXISTS ca_lam_viec (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ma_ca TEXT NOT NULL UNIQUE,
    nhan_vien_id INTEGER NOT NULL,
    bat_dau_luc TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ket_thuc_luc TEXT,
    tien_mat_dau_ca NUMERIC NOT NULL DEFAULT 0,
    tong_thu_tien_mat NUMERIC NOT NULL DEFAULT 0,
    tong_thu_chuyen_khoan NUMERIC NOT NULL DEFAULT 0,
    tong_chi NUMERIC NOT NULL DEFAULT 0,
    tien_mat_ky_vong NUMERIC NOT NULL DEFAULT 0,
    tien_mat_thuc_te NUMERIC,
    chenh_lech NUMERIC,
    trang_thai TEXT NOT NULL DEFAULT 'DangMo',
    ghi_chu TEXT,
    FOREIGN KEY (nhan_vien_id) REFERENCES tai_khoan(id)
);

CREATE TABLE IF NOT EXISTS phieu_thu_chi_ca (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ca_lam_viec_id INTEGER NOT NULL,
    loai_phieu TEXT NOT NULL,
    so_tien NUMERIC NOT NULL,
    ly_do TEXT NOT NULL,
    nguoi_lap_id INTEGER NOT NULL,
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ca_lam_viec_id) REFERENCES ca_lam_viec(id) ON DELETE CASCADE,
    FOREIGN KEY (nguoi_lap_id) REFERENCES tai_khoan(id)
);

CREATE TABLE IF NOT EXISTS bien_ban_giao_ca (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ca_lam_viec_id INTEGER NOT NULL UNIQUE,
    nguoi_ban_giao_id INTEGER NOT NULL,
    nguoi_nhan_id INTEGER,
    tien_mat_ky_vong NUMERIC NOT NULL,
    tien_mat_thuc_te NUMERIC NOT NULL,
    chenh_lech NUMERIC NOT NULL,
    ly_do_chenh_lech TEXT,
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ca_lam_viec_id) REFERENCES ca_lam_viec(id),
    FOREIGN KEY (nguoi_ban_giao_id) REFERENCES tai_khoan(id),
    FOREIGN KEY (nguoi_nhan_id) REFERENCES tai_khoan(id)
);

CREATE TABLE IF NOT EXISTS tong_hop_doanh_thu_ngay (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ngay_bao_cao TEXT NOT NULL UNIQUE,
    so_don_hang INTEGER NOT NULL DEFAULT 0,
    so_don_hang_huy INTEGER NOT NULL DEFAULT 0,
    doanh_thu_gop NUMERIC NOT NULL DEFAULT 0,
    tong_giam_gia NUMERIC NOT NULL DEFAULT 0,
    tong_phu_phi NUMERIC NOT NULL DEFAULT 0,
    tong_thue_vat NUMERIC NOT NULL DEFAULT 0,
    doanh_thu_thuc_te NUMERIC NOT NULL DEFAULT 0,
    doanh_thu_tien_mat NUMERIC NOT NULL DEFAULT 0,
    doanh_thu_chuyen_khoan NUMERIC NOT NULL DEFAULT 0,
    ngay_cap_nhat TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tong_hop_doanh_thu_thang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nam INTEGER NOT NULL,
    thang INTEGER NOT NULL,
    so_don_hang INTEGER NOT NULL DEFAULT 0,
    doanh_thu_thuc_te NUMERIC NOT NULL DEFAULT 0,
    doanh_thu_tien_mat NUMERIC NOT NULL DEFAULT 0,
    doanh_thu_chuyen_khoan NUMERIC NOT NULL DEFAULT 0,
    ngay_cap_nhat TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (nam, thang)
);

CREATE TABLE IF NOT EXISTS thong_ke_mon_an (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ngay_bao_cao TEXT NOT NULL,
    mon_an_id INTEGER NOT NULL,
    so_luong_ban INTEGER NOT NULL DEFAULT 0,
    doanh_thu NUMERIC NOT NULL DEFAULT 0,
    so_luong_huy INTEGER NOT NULL DEFAULT 0,
    ngay_cap_nhat TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (ngay_bao_cao, mon_an_id),
    FOREIGN KEY (mon_an_id) REFERENCES mon_an(id)
);

CREATE TABLE IF NOT EXISTS thong_ke_khung_gio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ngay_bao_cao TEXT NOT NULL,
    gio_trong_ngay INTEGER NOT NULL,
    so_don_hang INTEGER NOT NULL DEFAULT 0,
    so_luong_mon INTEGER NOT NULL DEFAULT 0,
    doanh_thu NUMERIC NOT NULL DEFAULT 0,
    ngay_cap_nhat TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (ngay_bao_cao, gio_trong_ngay)
);

CREATE TABLE IF NOT EXISTS lich_su_xuat_bao_cao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    loai_bao_cao TEXT NOT NULL,
    dinh_dang TEXT NOT NULL,
    tu_ngay TEXT,
    den_ngay TEXT,
    ten_tep TEXT,
    duong_dan_tep TEXT,
    trang_thai TEXT NOT NULL DEFAULT 'DangTao',
    nguoi_xuat_id INTEGER NOT NULL,
    loi_chi_tiet TEXT,
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_hoan_tat TEXT,
    FOREIGN KEY (nguoi_xuat_id) REFERENCES tai_khoan(id)
);
