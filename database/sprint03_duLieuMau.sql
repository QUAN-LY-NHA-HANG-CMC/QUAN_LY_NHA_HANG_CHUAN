-- Sprint 3 - Du lieu mau KDS, khuyen mai va thanh toan
PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO chuong_trinh_khuyen_mai
    (id, ten_chuong_trinh, loai_giam, gia_tri_giam, gia_tri_giam_toi_da,
     don_toi_thieu, bat_dau_luc, ket_thuc_luc)
VALUES
    (1, 'Giam 10 phan tram don tu 300K', 'PhanTram', 10, 50000, 300000,
     '2026-01-01 00:00:00', '2099-12-31 23:59:59');

INSERT OR IGNORE INTO ma_giam_gia
    (id, chuong_trinh_id, ma_code, so_lan_su_dung_toi_da)
VALUES
    (1, 1, 'WELCOME10', 1000);
