-- Sprint 3 - Bep, ban van hanh, khuyen mai, hoa don va thanh toan (SQLite)
-- Phu thuoc schema Sprint 1 va Sprint 2.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS hang_doi_bep (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chi_tiet_don_hang_id INTEGER NOT NULL UNIQUE,
    trang_thai TEXT NOT NULL DEFAULT 'ChoCheBien',
    uu_tien INTEGER NOT NULL DEFAULT 0,
    ghi_chu_bep TEXT,
    bat_dau_luc TEXT,
    hoan_thanh_luc TEXT,
    nguoi_phu_trach_id INTEGER,
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chi_tiet_don_hang_id) REFERENCES chi_tiet_don_hang(id) ON DELETE CASCADE,
    FOREIGN KEY (nguoi_phu_trach_id) REFERENCES tai_khoan(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS lich_su_mon_bep (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chi_tiet_don_hang_id INTEGER NOT NULL,
    trang_thai_cu TEXT,
    trang_thai_moi TEXT NOT NULL,
    ly_do TEXT,
    nguoi_cap_nhat_id INTEGER,
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chi_tiet_don_hang_id) REFERENCES chi_tiet_don_hang(id) ON DELETE CASCADE,
    FOREIGN KEY (nguoi_cap_nhat_id) REFERENCES tai_khoan(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS yeu_cau_huy_tra_mon (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chi_tiet_don_hang_id INTEGER NOT NULL,
    loai_yeu_cau TEXT NOT NULL,
    so_luong INTEGER NOT NULL,
    ly_do TEXT NOT NULL,
    trang_thai TEXT NOT NULL DEFAULT 'ChoDuyet',
    nguoi_yeu_cau_id INTEGER,
    nguoi_duyet_id INTEGER,
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chi_tiet_don_hang_id) REFERENCES chi_tiet_don_hang(id),
    FOREIGN KEY (nguoi_yeu_cau_id) REFERENCES tai_khoan(id) ON DELETE SET NULL,
    FOREIGN KEY (nguoi_duyet_id) REFERENCES tai_khoan(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS lich_su_that_thoat_mon (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chi_tiet_don_hang_id INTEGER NOT NULL,
    yeu_cau_huy_tra_id INTEGER,
    so_luong INTEGER NOT NULL,
    gia_tri NUMERIC NOT NULL DEFAULT 0,
    ly_do TEXT NOT NULL,
    nguoi_ghi_nhan_id INTEGER,
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chi_tiet_don_hang_id) REFERENCES chi_tiet_don_hang(id),
    FOREIGN KEY (yeu_cau_huy_tra_id) REFERENCES yeu_cau_huy_tra_mon(id),
    FOREIGN KEY (nguoi_ghi_nhan_id) REFERENCES tai_khoan(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS lich_su_chuyen_ban (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phien_nguon_id INTEGER NOT NULL,
    ban_nguon_id INTEGER NOT NULL,
    phien_dich_id INTEGER NOT NULL,
    ban_dich_id INTEGER NOT NULL,
    ly_do TEXT,
    nguoi_thuc_hien_id INTEGER,
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (phien_nguon_id) REFERENCES phien_phuc_vu(id),
    FOREIGN KEY (ban_nguon_id) REFERENCES ban_an(id),
    FOREIGN KEY (phien_dich_id) REFERENCES phien_phuc_vu(id),
    FOREIGN KEY (ban_dich_id) REFERENCES ban_an(id),
    FOREIGN KEY (nguoi_thuc_hien_id) REFERENCES tai_khoan(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS lich_su_ghep_ban (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phien_nguon_id INTEGER NOT NULL,
    ban_nguon_id INTEGER NOT NULL,
    phien_dich_id INTEGER NOT NULL,
    ban_dich_id INTEGER NOT NULL,
    trang_thai TEXT NOT NULL DEFAULT 'DaGhep',
    ly_do TEXT,
    nguoi_thuc_hien_id INTEGER,
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (phien_nguon_id) REFERENCES phien_phuc_vu(id),
    FOREIGN KEY (ban_nguon_id) REFERENCES ban_an(id),
    FOREIGN KEY (phien_dich_id) REFERENCES phien_phuc_vu(id),
    FOREIGN KEY (ban_dich_id) REFERENCES ban_an(id),
    FOREIGN KEY (nguoi_thuc_hien_id) REFERENCES tai_khoan(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS chuong_trinh_khuyen_mai (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ten_chuong_trinh TEXT NOT NULL,
    loai_giam TEXT NOT NULL,
    gia_tri_giam NUMERIC NOT NULL,
    gia_tri_giam_toi_da NUMERIC,
    don_toi_thieu NUMERIC NOT NULL DEFAULT 0,
    bat_dau_luc TEXT NOT NULL,
    ket_thuc_luc TEXT NOT NULL,
    trang_thai TEXT NOT NULL DEFAULT 'HoatDong',
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ma_giam_gia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chuong_trinh_id INTEGER NOT NULL,
    ma_code TEXT NOT NULL UNIQUE,
    so_lan_su_dung_toi_da INTEGER,
    so_lan_da_su_dung INTEGER NOT NULL DEFAULT 0,
    trang_thai TEXT NOT NULL DEFAULT 'HoatDong',
    FOREIGN KEY (chuong_trinh_id) REFERENCES chuong_trinh_khuyen_mai(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS hoa_don (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phien_phuc_vu_id INTEGER NOT NULL,
    hoa_don_goc_id INTEGER,
    ma_hoa_don TEXT NOT NULL UNIQUE,
    tam_tinh NUMERIC NOT NULL DEFAULT 0,
    giam_gia NUMERIC NOT NULL DEFAULT 0,
    phu_phi NUMERIC NOT NULL DEFAULT 0,
    thue_vat NUMERIC NOT NULL DEFAULT 0,
    tong_tien NUMERIC NOT NULL DEFAULT 0,
    trang_thai TEXT NOT NULL DEFAULT 'TamTinh',
    ngay_phat_hanh TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_thanh_toan TEXT,
    nguoi_lap_id INTEGER,
    FOREIGN KEY (phien_phuc_vu_id) REFERENCES phien_phuc_vu(id),
    FOREIGN KEY (hoa_don_goc_id) REFERENCES hoa_don(id),
    FOREIGN KEY (nguoi_lap_id) REFERENCES tai_khoan(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS chi_tiet_hoa_don (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hoa_don_id INTEGER NOT NULL,
    chi_tiet_don_hang_id INTEGER,
    ten_mon_snapshot TEXT NOT NULL,
    don_gia_snapshot NUMERIC NOT NULL,
    so_luong INTEGER NOT NULL,
    thanh_tien NUMERIC NOT NULL,
    FOREIGN KEY (hoa_don_id) REFERENCES hoa_don(id) ON DELETE CASCADE,
    FOREIGN KEY (chi_tiet_don_hang_id) REFERENCES chi_tiet_don_hang(id)
);

CREATE TABLE IF NOT EXISTS hoa_don_khuyen_mai (
    hoa_don_id INTEGER NOT NULL,
    ma_giam_gia_id INTEGER,
    chuong_trinh_id INTEGER,
    so_tien_giam NUMERIC NOT NULL DEFAULT 0,
    PRIMARY KEY (hoa_don_id, ma_giam_gia_id, chuong_trinh_id),
    FOREIGN KEY (hoa_don_id) REFERENCES hoa_don(id) ON DELETE CASCADE,
    FOREIGN KEY (ma_giam_gia_id) REFERENCES ma_giam_gia(id),
    FOREIGN KEY (chuong_trinh_id) REFERENCES chuong_trinh_khuyen_mai(id)
);

CREATE TABLE IF NOT EXISTS giao_dich_thanh_toan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hoa_don_id INTEGER NOT NULL,
    ma_giao_dich TEXT NOT NULL UNIQUE,
    phuong_thuc TEXT NOT NULL,
    trang_thai TEXT NOT NULL DEFAULT 'ChoXuLy',
    so_tien NUMERIC NOT NULL,
    tien_khach_dua NUMERIC,
    tien_thua NUMERIC,
    ma_tham_chieu_ngan_hang TEXT,
    noi_dung_viet_qr TEXT,
    thoi_gian_thanh_toan TEXT,
    nguoi_thu_id INTEGER,
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hoa_don_id) REFERENCES hoa_don(id),
    FOREIGN KEY (nguoi_thu_id) REFERENCES tai_khoan(id) ON DELETE SET NULL
);
