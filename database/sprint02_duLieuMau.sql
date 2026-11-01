-- Sprint 2 - Du lieu mau cho phien dat mon va realtime
PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO phien_phuc_vu
    (id, ban_an_id, ma_phien, token_phien_hash, trang_thai, ghi_chu)
VALUES
    (1, 1, 'P-B101-DEMO', 'hash-demo-phien-b101', 'DangMo', 'Phien mau Sprint 2');

INSERT OR IGNORE INTO gio_hang
    (id, phien_phuc_vu_id, ma_khach, trang_thai, ghi_chu_chung)
VALUES
    (1, 1, 'khach-demo-01', 'DangSua', 'It cay');

INSERT OR IGNORE INTO gio_hang_item
    (id, gio_hang_id, mon_an_id, ten_mon_snapshot, don_gia_snapshot, so_luong, ghi_chu, thanh_tien)
VALUES
    (1, 1, 1, 'Goi bo bop thau', 95000, 1, 'Khong hanh', 95000);

INSERT OR IGNORE INTO gio_hang_item_tuy_chon
    (gio_hang_item_id, ten_nhom_snapshot, ten_tuy_chon_snapshot, gia_them_snapshot)
VALUES
    (1, 'Muc do cay', 'Khong cay', 0);
