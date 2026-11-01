-- Sprint 2 - Chi muc cho luong E-Menu, gio hang, don hang va realtime
CREATE UNIQUE INDEX IF NOT EXISTS uq_phien_dang_mo_theo_ban
ON phien_phuc_vu(ban_an_id) WHERE trang_thai = 'DangMo';
CREATE INDEX IF NOT EXISTS idx_gio_hang_phien ON gio_hang(phien_phuc_vu_id, trang_thai);
CREATE INDEX IF NOT EXISTS idx_gio_hang_item_gio_hang ON gio_hang_item(gio_hang_id);
CREATE INDEX IF NOT EXISTS idx_don_hang_phien_ngay ON don_hang(phien_phuc_vu_id, ngay_tao);
CREATE INDEX IF NOT EXISTS idx_don_hang_trang_thai ON don_hang(trang_thai, ngay_tao);
CREATE INDEX IF NOT EXISTS idx_chi_tiet_don_hang_don ON chi_tiet_don_hang(don_hang_id, trang_thai_mon);
CREATE INDEX IF NOT EXISTS idx_lich_su_don_hang ON lich_su_trang_thai_don_hang(don_hang_id, ngay_tao);
CREATE INDEX IF NOT EXISTS idx_yeu_cau_ho_tro_trang_thai ON yeu_cau_ho_tro_ban(trang_thai, ngay_tao);
CREATE INDEX IF NOT EXISTS idx_thong_bao_chua_gui ON thong_bao_thoi_gian_thuc(da_gui, ngay_tao);
