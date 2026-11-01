-- Sprint 2 - Schema phien ban, gio hang va dat mon (SQLite)
-- Phu thuoc schema Sprint 1: taoBang.sql
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS phien_phuc_vu (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ban_an_id INTEGER NOT NULL,
    ma_phien TEXT NOT NULL UNIQUE,
    token_phien_hash TEXT NOT NULL UNIQUE,
    trang_thai TEXT NOT NULL DEFAULT 'DangMo',
    bat_dau_luc TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ket_thuc_luc TEXT,
    ghi_chu TEXT,
    FOREIGN KEY (ban_an_id) REFERENCES ban_an(id)
);

CREATE TABLE IF NOT EXISTS gio_hang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phien_phuc_vu_id INTEGER NOT NULL,
    ma_khach TEXT NOT NULL,
    trang_thai TEXT NOT NULL DEFAULT 'DangSua',
    ghi_chu_chung TEXT,
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (phien_phuc_vu_id, ma_khach),
    FOREIGN KEY (phien_phuc_vu_id) REFERENCES phien_phuc_vu(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS gio_hang_item (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gio_hang_id INTEGER NOT NULL,
    mon_an_id INTEGER NOT NULL,
    ten_mon_snapshot TEXT NOT NULL,
    don_gia_snapshot NUMERIC NOT NULL,
    so_luong INTEGER NOT NULL DEFAULT 1,
    ghi_chu TEXT,
    thanh_tien NUMERIC NOT NULL,
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (gio_hang_id) REFERENCES gio_hang(id) ON DELETE CASCADE,
    FOREIGN KEY (mon_an_id) REFERENCES mon_an(id)
);

CREATE TABLE IF NOT EXISTS gio_hang_item_tuy_chon (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gio_hang_item_id INTEGER NOT NULL,
    ten_nhom_snapshot TEXT NOT NULL,
    ten_tuy_chon_snapshot TEXT NOT NULL,
    gia_them_snapshot NUMERIC NOT NULL DEFAULT 0,
    FOREIGN KEY (gio_hang_item_id) REFERENCES gio_hang_item(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS don_hang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phien_phuc_vu_id INTEGER NOT NULL,
    ma_don TEXT NOT NULL UNIQUE,
    ma_yeu_cau_idempotency TEXT NOT NULL UNIQUE,
    loai_don TEXT NOT NULL DEFAULT 'Moi',
    trang_thai TEXT NOT NULL DEFAULT 'ChoXacNhan',
    ghi_chu_chung TEXT,
    tong_tien NUMERIC NOT NULL DEFAULT 0,
    tao_boi_ma_khach TEXT,
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (phien_phuc_vu_id) REFERENCES phien_phuc_vu(id)
);

CREATE TABLE IF NOT EXISTS chi_tiet_don_hang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    don_hang_id INTEGER NOT NULL,
    mon_an_id INTEGER NOT NULL,
    ten_mon_snapshot TEXT NOT NULL,
    don_gia_snapshot NUMERIC NOT NULL,
    so_luong INTEGER NOT NULL,
    ghi_chu TEXT,
    thanh_tien NUMERIC NOT NULL,
    trang_thai_mon TEXT NOT NULL DEFAULT 'ChoXacNhan',
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (don_hang_id) REFERENCES don_hang(id) ON DELETE CASCADE,
    FOREIGN KEY (mon_an_id) REFERENCES mon_an(id)
);

CREATE TABLE IF NOT EXISTS chi_tiet_don_hang_tuy_chon (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chi_tiet_don_hang_id INTEGER NOT NULL,
    ten_nhom_snapshot TEXT NOT NULL,
    ten_tuy_chon_snapshot TEXT NOT NULL,
    gia_them_snapshot NUMERIC NOT NULL DEFAULT 0,
    FOREIGN KEY (chi_tiet_don_hang_id) REFERENCES chi_tiet_don_hang(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lich_su_trang_thai_don_hang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    don_hang_id INTEGER NOT NULL,
    trang_thai_cu TEXT,
    trang_thai_moi TEXT NOT NULL,
    nguoi_cap_nhat_id INTEGER,
    ly_do TEXT,
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (don_hang_id) REFERENCES don_hang(id) ON DELETE CASCADE,
    FOREIGN KEY (nguoi_cap_nhat_id) REFERENCES tai_khoan(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS yeu_cau_ho_tro_ban (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phien_phuc_vu_id INTEGER NOT NULL,
    ban_an_id INTEGER NOT NULL,
    loai_yeu_cau TEXT NOT NULL,
    ly_do TEXT,
    phuong_thuc_thanh_toan TEXT,
    ghi_chu TEXT,
    trang_thai TEXT NOT NULL DEFAULT 'ChoXuLy',
    nguoi_tiep_nhan_id INTEGER,
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (phien_phuc_vu_id) REFERENCES phien_phuc_vu(id),
    FOREIGN KEY (ban_an_id) REFERENCES ban_an(id),
    FOREIGN KEY (nguoi_tiep_nhan_id) REFERENCES tai_khoan(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS thong_bao_thoi_gian_thuc (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phien_phuc_vu_id INTEGER,
    loai_su_kien TEXT NOT NULL,
    doi_tuong TEXT,
    doi_tuong_id INTEGER,
    du_lieu_json TEXT NOT NULL,
    da_gui INTEGER NOT NULL DEFAULT 0,
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (phien_phuc_vu_id) REFERENCES phien_phuc_vu(id) ON DELETE CASCADE
);
