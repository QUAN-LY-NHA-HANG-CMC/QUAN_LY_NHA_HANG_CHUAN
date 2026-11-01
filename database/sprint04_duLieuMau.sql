-- Sprint 4 - Du lieu mau danh gia, ca va bao cao
PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO tong_hop_doanh_thu_ngay (ngay_bao_cao)
VALUES (date('now'));

INSERT OR IGNORE INTO tong_hop_doanh_thu_thang (nam, thang)
VALUES (CAST(strftime('%Y', 'now') AS INTEGER), CAST(strftime('%m', 'now') AS INTEGER));
