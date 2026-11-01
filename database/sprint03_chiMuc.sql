-- Sprint 3 - Chi muc KDS, ban van hanh, hoa don va thanh toan
CREATE INDEX IF NOT EXISTS idx_hang_doi_bep_fifo ON hang_doi_bep(trang_thai, uu_tien DESC, ngay_tao);
CREATE INDEX IF NOT EXISTS idx_lich_su_mon_bep_chi_tiet ON lich_su_mon_bep(chi_tiet_don_hang_id, ngay_tao);
CREATE INDEX IF NOT EXISTS idx_yeu_cau_huy_tra_trang_thai ON yeu_cau_huy_tra_mon(trang_thai, ngay_tao);
CREATE INDEX IF NOT EXISTS idx_lich_su_chuyen_ban_phien ON lich_su_chuyen_ban(phien_nguon_id, phien_dich_id, ngay_tao);
CREATE INDEX IF NOT EXISTS idx_lich_su_ghep_ban_phien ON lich_su_ghep_ban(phien_nguon_id, phien_dich_id, ngay_tao);
CREATE INDEX IF NOT EXISTS idx_ma_giam_gia_code_trang_thai ON ma_giam_gia(ma_code, trang_thai);
CREATE INDEX IF NOT EXISTS idx_hoa_don_phien_trang_thai ON hoa_don(phien_phuc_vu_id, trang_thai, ngay_phat_hanh);
CREATE INDEX IF NOT EXISTS idx_chi_tiet_hoa_don_hoa_don ON chi_tiet_hoa_don(hoa_don_id);
CREATE INDEX IF NOT EXISTS idx_giao_dich_hoa_don_trang_thai ON giao_dich_thanh_toan(hoa_don_id, trang_thai, ngay_tao);
