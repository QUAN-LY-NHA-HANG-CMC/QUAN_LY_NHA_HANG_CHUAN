-- Sprint 4 - Chi muc cho dashboard, ca thu ngan va feedback
CREATE INDEX IF NOT EXISTS idx_danh_gia_loc_ngay_sao ON danh_gia_khach_hang(ngay_tao, so_sao, trang_thai);
CREATE INDEX IF NOT EXISTS idx_danh_gia_mon_an ON danh_gia_khach_hang(mon_an_id, so_sao, trang_thai);
CREATE INDEX IF NOT EXISTS idx_phan_hoi_danh_gia ON phan_hoi_quan_ly(danh_gia_id, ngay_tao);
CREATE INDEX IF NOT EXISTS idx_ca_lam_viec_nhan_vien_trang_thai ON ca_lam_viec(nhan_vien_id, trang_thai, bat_dau_luc);
CREATE INDEX IF NOT EXISTS idx_phieu_thu_chi_ca_ngay ON phieu_thu_chi_ca(ca_lam_viec_id, loai_phieu, ngay_tao);
CREATE INDEX IF NOT EXISTS idx_tong_hop_ngay ON tong_hop_doanh_thu_ngay(ngay_bao_cao);
CREATE INDEX IF NOT EXISTS idx_tong_hop_thang ON tong_hop_doanh_thu_thang(nam, thang);
CREATE INDEX IF NOT EXISTS idx_thong_ke_mon_ngay_doanh_thu ON thong_ke_mon_an(ngay_bao_cao, doanh_thu DESC);
CREATE INDEX IF NOT EXISTS idx_thong_ke_gio_ngay_doanh_thu ON thong_ke_khung_gio(ngay_bao_cao, doanh_thu DESC);
CREATE INDEX IF NOT EXISTS idx_lich_su_xuat_bao_cao ON lich_su_xuat_bao_cao(nguoi_xuat_id, loai_bao_cao, ngay_tao);
