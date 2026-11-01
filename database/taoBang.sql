-- Sprint 1 - Schema co so du lieu (SQLite)
-- Chay truoc: taoBang.sql -> rangBuoc.sql -> chiMuc.sql -> duLieuMau.sql
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS vai_tro (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ma_vai_tro TEXT NOT NULL UNIQUE,
    ten_vai_tro TEXT NOT NULL UNIQUE,
    mo_ta TEXT,
    trang_thai TEXT NOT NULL DEFAULT 'HoatDong',
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quyen_han (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ma_quyen TEXT NOT NULL UNIQUE,
    ten_quyen TEXT NOT NULL,
    nhom_quyen TEXT NOT NULL,
    mo_ta TEXT,
    trang_thai TEXT NOT NULL DEFAULT 'HoatDong'
);

CREATE TABLE IF NOT EXISTS vai_tro_quyen_han (
    vai_tro_id INTEGER NOT NULL,
    quyen_han_id INTEGER NOT NULL,
    ngay_gan TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (vai_tro_id, quyen_han_id),
    FOREIGN KEY (vai_tro_id) REFERENCES vai_tro(id) ON DELETE CASCADE,
    FOREIGN KEY (quyen_han_id) REFERENCES quyen_han(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tai_khoan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ten_dang_nhap TEXT NOT NULL UNIQUE,
    mat_khau TEXT NOT NULL,
    email TEXT UNIQUE,
    trang_thai TEXT NOT NULL DEFAULT 'HoatDong',
    lan_dang_nhap_cuoi TEXT,
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nhan_vien (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tai_khoan_id INTEGER NOT NULL UNIQUE,
    ho_ten TEXT NOT NULL,
    so_dien_thoai TEXT,
    email TEXT,
    vai_tro_id INTEGER NOT NULL,
    trang_thai TEXT NOT NULL DEFAULT 'HoatDong',
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tai_khoan_id) REFERENCES tai_khoan(id) ON DELETE CASCADE,
    FOREIGN KEY (vai_tro_id) REFERENCES vai_tro(id)
);

CREATE TABLE IF NOT EXISTS phien_dang_nhap (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tai_khoan_id INTEGER NOT NULL,
    ma_phien TEXT NOT NULL UNIQUE,
    refresh_token_hash TEXT NOT NULL,
    dia_chi_ip TEXT,
    user_agent TEXT,
    thoi_gian_het_han TEXT NOT NULL,
    thoi_gian_dang_xuat TEXT,
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tai_khoan_id) REFERENCES tai_khoan(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS khu_vuc (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ten_khu_vuc TEXT NOT NULL UNIQUE,
    ghi_chu TEXT,
    trang_thai TEXT NOT NULL DEFAULT 'HoatDong',
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ban_an (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    khu_vuc_id INTEGER NOT NULL,
    ma_ban TEXT NOT NULL UNIQUE,
    ten_ban TEXT NOT NULL,
    suc_chua INTEGER NOT NULL DEFAULT 4,
    trang_thai TEXT NOT NULL DEFAULT 'Trong',
    da_phat_sinh_giao_dich INTEGER NOT NULL DEFAULT 0,
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (khu_vuc_id) REFERENCES khu_vuc(id)
);

CREATE TABLE IF NOT EXISTS ma_qr_ban (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ban_an_id INTEGER NOT NULL UNIQUE,
    token_bao_mat TEXT NOT NULL UNIQUE,
    duong_dan_qr TEXT NOT NULL,
    trang_thai TEXT NOT NULL DEFAULT 'HoatDong',
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ban_an_id) REFERENCES ban_an(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS danh_muc_mon (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ten_danh_muc TEXT NOT NULL UNIQUE,
    thu_tu_hien_thi INTEGER NOT NULL DEFAULT 0,
    trang_thai TEXT NOT NULL DEFAULT 'HoatDong',
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mon_an (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    danh_muc_id INTEGER NOT NULL,
    ten_mon TEXT NOT NULL,
    gia_ban NUMERIC NOT NULL,
    don_vi_tinh TEXT NOT NULL DEFAULT 'Phan',
    mo_ta TEXT,
    trang_thai TEXT NOT NULL DEFAULT 'DangBan',
    la_mon_ban_chay INTEGER NOT NULL DEFAULT 0,
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (danh_muc_id) REFERENCES danh_muc_mon(id)
);

CREATE TABLE IF NOT EXISTS hinh_anh_mon_an (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mon_an_id INTEGER NOT NULL,
    duong_dan TEXT NOT NULL,
    la_anh_dai_dien INTEGER NOT NULL DEFAULT 0,
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mon_an_id) REFERENCES mon_an(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS nhom_tuy_chon_mon (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mon_an_id INTEGER NOT NULL,
    ten_nhom TEXT NOT NULL,
    bat_buoc INTEGER NOT NULL DEFAULT 0,
    loai_lua_chon TEXT NOT NULL DEFAULT 'ChonMot',
    thu_tu_hien_thi INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (mon_an_id) REFERENCES mon_an(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tuy_chon_mon (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nhom_tuy_chon_id INTEGER NOT NULL,
    ten_tuy_chon TEXT NOT NULL,
    gia_them NUMERIC NOT NULL DEFAULT 0,
    trang_thai TEXT NOT NULL DEFAULT 'HoatDong',
    FOREIGN KEY (nhom_tuy_chon_id) REFERENCES nhom_tuy_chon_mon(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cau_hinh_nha_hang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ma_cau_hinh TEXT NOT NULL UNIQUE,
    gia_tri TEXT,
    kieu_du_lieu TEXT NOT NULL DEFAULT 'text',
    mo_ta TEXT,
    ngay_cap_nhat TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nhat_ky_he_thong (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tai_khoan_id INTEGER,
    hanh_dong TEXT NOT NULL,
    doi_tuong TEXT,
    doi_tuong_id INTEGER,
    du_lieu_cu TEXT,
    du_lieu_moi TEXT,
    dia_chi_ip TEXT,
    ngay_tao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tai_khoan_id) REFERENCES tai_khoan(id) ON DELETE SET NULL
);
