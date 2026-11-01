-- Sprint 1 - Cac view phuc vu kiem tra so do va tich hop API
-- Schema chinh nam trong taoBang.sql; file nay tao cac view doc du lieu lien bang.
PRAGMA foreign_keys = ON;

CREATE VIEW IF NOT EXISTS vw_nhan_vien_phan_quyen AS
SELECT nv.id AS nhan_vien_id,
       nv.ho_ten,
       tk.ten_dang_nhap,
       vt.ma_vai_tro,
       vt.ten_vai_tro,
       q.ma_quyen,
       q.ten_quyen
FROM nhan_vien nv
JOIN tai_khoan tk ON tk.id = nv.tai_khoan_id
JOIN vai_tro vt ON vt.id = nv.vai_tro_id
LEFT JOIN vai_tro_quyen_han vq ON vq.vai_tro_id = vt.id
LEFT JOIN quyen_han q ON q.id = vq.quyen_han_id;

CREATE VIEW IF NOT EXISTS vw_thuc_don AS
SELECT m.id AS mon_an_id,
       dm.ten_danh_muc,
       m.ten_mon,
       m.gia_ban,
       m.don_vi_tinh,
       m.trang_thai,
       m.la_mon_ban_chay
FROM mon_an m
JOIN danh_muc_mon dm ON dm.id = m.danh_muc_id
WHERE m.trang_thai <> 'DaXoa' AND dm.trang_thai <> 'DaXoa';

CREATE VIEW IF NOT EXISTS vw_ban_an_qr AS
SELECT b.id AS ban_an_id,
       kv.ten_khu_vuc,
       b.ma_ban,
       b.ten_ban,
       b.suc_chua,
       b.trang_thai,
       qr.token_bao_mat,
       qr.duong_dan_qr
FROM ban_an b
JOIN khu_vuc kv ON kv.id = b.khu_vuc_id
LEFT JOIN ma_qr_ban qr ON qr.ban_an_id = b.id
WHERE b.trang_thai <> 'DaXoa' AND kv.trang_thai <> 'DaXoa';
