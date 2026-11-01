-- Sprint 1 - Chi muc phuc vu dang nhap, tim kiem va danh sach
CREATE INDEX IF NOT EXISTS idx_nhan_vien_vai_tro_trang_thai ON nhan_vien(vai_tro_id, trang_thai);
CREATE INDEX IF NOT EXISTS idx_phien_dang_nhap_tai_khoan ON phien_dang_nhap(tai_khoan_id, thoi_gian_het_han);
CREATE INDEX IF NOT EXISTS idx_ban_an_khu_vuc_trang_thai ON ban_an(khu_vuc_id, trang_thai);
CREATE INDEX IF NOT EXISTS idx_mon_an_danh_muc_trang_thai ON mon_an(danh_muc_id, trang_thai);
CREATE INDEX IF NOT EXISTS idx_mon_an_gia_ban ON mon_an(gia_ban);
CREATE INDEX IF NOT EXISTS idx_mon_an_ten ON mon_an(ten_mon);
CREATE INDEX IF NOT EXISTS idx_nhom_tuy_chon_mon_an ON nhom_tuy_chon_mon(mon_an_id);
CREATE INDEX IF NOT EXISTS idx_nhat_ky_he_thong_tai_khoan_ngay ON nhat_ky_he_thong(tai_khoan_id, ngay_tao);
